/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ref, computed, watch, provide, inject, onMounted } from 'vue';
import {
  getStoredUser,
  saveUser,
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  fetchProfile,
  updateProfile as apiUpdateProfile,
  updatePassword as apiUpdatePassword,
} from '../api/services/auth.js';
import {
  fetchProductCategories,
  fetchAllProductCategories,
  createProductCategory,
  updateProductCategoryApi,
  deleteProductCategoryApi,
  fetchMarkets,
  fetchPlaces,
  fetchMerchants,
  fetchProducts,
  fetchPlaceRequests,
  fetchReceipts,
  fetchSales,
  fetchSale,
  createSale,
  fetchUsers,
  createUser,
  updateUserApi,
  deleteUserApi,
  createMarket,
  updateMarket as apiUpdateMarket,
  deleteMarketApi,
  fetchBlocks,
  createBlock,
  updateBlockApi,
  deleteBlockApi,
  createPlace,
  updatePlaceApi,
  deletePlaceApi,
  assignPlaceChief,
  createProduct,
  updateProductApi,
  deleteProductApi,
  createPlaceRequest,
  approvePlaceRequest,
  rejectPlaceRequest,
  createReceipt,
  approveReceipt,
  rejectReceipt,
} from '../api/services/data.js';
import { getErrorMessage } from '../api/client.js';
import { sameId } from '../utils/ids.js';

const APP_KEY = Symbol('app');

const GUEST_USER = {
  id: null,
  name: 'Visiteur Public',
  phone: '',
  email: '',
  role: 'VISITOR',
};

export function createAppState() {
  const markets = ref([]);
  const merchants = ref([]);
  const products = ref([]);
  const places = ref([]);
  const blocks = ref([]);
  const productCategories = ref([]);
  const requests = ref([]);
  const receipts = ref([]);
  const sales = ref([]);
  const users = ref([]);
  const currentUser = ref(getStoredUser() || GUEST_USER);
  const loading = ref(false);
  const usersLoading = ref(false);
  const initialized = ref(false);

  const viewState = ref('PUBLIC');
  const selectedMarketId = ref(null);
  const selectedProductId = ref(null);
  const publicTab = ref('home');
  const adminActiveTab = ref('dashboard');
  const toast = ref(null);

  const showToast = (message, type = 'success') => {
    toast.value = { message, type };
  };

  const clearToast = () => {
    toast.value = null;
  };

  watch(toast, (newToast) => {
    if (newToast) {
      const timer = setTimeout(() => {
        toast.value = null;
      }, 4000);
      return () => clearTimeout(timer);
    }
  });

  const setViewState = (view) => {
    viewState.value = view;
    if (view === 'DASHBOARD') {
      adminActiveTab.value = 'dashboard';
    } else {
      selectedMarketId.value = null;
      selectedProductId.value = null;
    }
  };

  const loadBlocks = async (marketIds = null) => {
    const ids = marketIds || markets.value.map((m) => m.id);
    if (!ids.length) {
      blocks.value = [];
      return;
    }
    const results = await Promise.all(ids.map((id) => fetchBlocks(id)));
    blocks.value = results.flat();
  };

  const loadPublicData = async () => {
    const categoriesRevision = productCategoriesRevision;
    const [m, p, pr, pl, tags] = await Promise.all([
      fetchMarkets(),
      fetchPlaces(),
      fetchProducts(),
      fetchMerchants(),
      fetchProductCategories(),
    ]);
    if (categoriesRevision === productCategoriesRevision) {
      productCategories.value = tags;
    }
    markets.value = m;
    places.value = p;
    products.value = pr;
    merchants.value = pl;
    await loadBlocks(m.map((market) => market.id));
  };

  const loadAuthenticatedData = async () => {
    const [req, rec, sal] = await Promise.all([
      fetchPlaceRequests(),
      fetchReceipts(),
      fetchSales(),
    ]);
    requests.value = req;
    receipts.value = rec;
    sales.value = sal;
  };

  const loadUsers = async () => {
    if (!['SUPER_ADMIN', 'ADMIN_MARCHE'].includes(currentUser.value?.role)) {
      users.value = [];
      return;
    }
    usersLoading.value = true;
    try {
      users.value = await fetchUsers();
    } catch (error) {
      showToast(getErrorMessage(error, 'Erreur de chargement des utilisateurs'), 'error');
    } finally {
      usersLoading.value = false;
    }
  };

  let refreshPromise = null;
  let productCategoriesRevision = 0;

  const refreshAll = async () => {
    if (refreshPromise) return refreshPromise;

    loading.value = true;
    refreshPromise = (async () => {
      try {
        await loadPublicData();
        if (currentUser.value?.id) {
          await loadAuthenticatedData();
        } else {
          requests.value = [];
          receipts.value = [];
          sales.value = [];
        }
      } catch (error) {
        showToast(getErrorMessage(error, 'Erreur de chargement des données'), 'error');
      } finally {
        loading.value = false;
        initialized.value = true;
        refreshPromise = null;
      }
    })();

    return refreshPromise;
  };

  const refreshInBackground = () => {
    void refreshAll();
  };

  const setCurrentUser = (user) => {
    currentUser.value = user || GUEST_USER;
    saveUser(user?.id ? user : null);
    if (user?.id) {
      refreshInBackground();
    }
  };

  const login = async (email, password) => {
    const user = await apiLogin(email, password);
    currentUser.value = user;
    showToast(`Connexion réussie — ${user.name}`, 'success');
    refreshInBackground();
    return user;
  };

  const register = async (payload) => {
    const user = await apiRegister(payload);
    currentUser.value = user;
    showToast('Inscription réussie', 'success');
    refreshInBackground();
    return user;
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch {
      // session may already be invalid
    }
    currentUser.value = GUEST_USER;
    requests.value = [];
    receipts.value = [];
    sales.value = [];
    showToast('Session déconnectée', 'info');
  };

  const updateProfile = async (payload) => {
    try {
      const user = await apiUpdateProfile(payload);
      currentUser.value = user;
      showToast('Profil mis à jour', 'success');
      return user;
    } catch (error) {
      showToast(getErrorMessage(error), 'error');
      throw error;
    }
  };

  const updatePassword = async (payload) => {
    try {
      await apiUpdatePassword(payload);
      showToast('Mot de passe mis à jour', 'success');
    } catch (error) {
      showToast(getErrorMessage(error), 'error');
      throw error;
    }
  };

  const addPlaceRequest = async (req) => {
    try {
      const created = await createPlaceRequest(req);
      requests.value = [created, ...requests.value];
      showToast('Demande d\'octroi de place envoyée avec succès', 'success');
    } catch (error) {
      showToast(getErrorMessage(error), 'error');
    }
  };

  const loadSales = async (params = {}) => {
    try {
      sales.value = await fetchSales(params);
    } catch (error) {
      showToast(getErrorMessage(error, 'Erreur de chargement des ventes'), 'error');
    }
  };

  const getSale = async (id) => {
    try {
      return await fetchSale(id);
    } catch (error) {
      showToast(getErrorMessage(error, 'Vente introuvable'), 'error');
      return null;
    }
  };

  const addSale = async (sale) => {
    try {
      const created = await createSale(sale);
      sales.value = [created, ...sales.value];
      await loadPublicData();
      showToast(`Vente enregistrée — ${created.invoiceNumber}`, 'success');
      return created;
    } catch (error) {
      showToast(getErrorMessage(error), 'error');
      return null;
    }
  };

  const addPaymentReceipt = async (rec) => {
    try {
      const formData = new FormData();
      if (rec.file) {
        formData.append('file', rec.file);
      }
      if (rec.marketId) formData.append('market_id', rec.marketId);
      formData.append('amount', rec.amount || 35000);
      if (rec.reference) formData.append('reference', rec.reference);

      const created = await createReceipt(formData);
      receipts.value = [created, ...receipts.value];
      showToast('Reçu téléversé avec succès pour validation', 'success');
    } catch (error) {
      showToast(getErrorMessage(error), 'error');
    }
  };

  const updateRequestStatus = async (reqId, status, reason = '') => {
    try {
      let updated;
      if (status === 'approved') {
        updated = await approvePlaceRequest(reqId);
      } else {
        updated = await rejectPlaceRequest(reqId, reason || 'Demande non conforme');
      }
      requests.value = requests.value.map((r) => (r.id === reqId ? updated : r));
      if (status === 'approved') {
        await refreshAll();
      }
      showToast(
        `Demande ${status === 'approved' ? 'approuvée' : 'rejetée'}`,
        status === 'approved' ? 'success' : 'error',
      );
    } catch (error) {
      showToast(getErrorMessage(error), 'error');
    }
  };

  const updateReceiptStatus = async (recId, status, reason = '') => {
    try {
      const updated =
        status === 'approved'
          ? await approveReceipt(recId)
          : await rejectReceipt(recId, reason || 'Justificatif non conforme');
      receipts.value = receipts.value.map((r) => (r.id === recId ? updated : r));
      showToast(
        `Reçu ${status === 'approved' ? 'validé' : 'rejeté'}`,
        status === 'approved' ? 'success' : 'error',
      );
    } catch (error) {
      showToast(getErrorMessage(error), 'error');
    }
  };

  const addProduct = async (product) => {
    try {
      const created = await createProduct(product);
      products.value = [created, ...products.value];
      showToast(`Produit "${product.name}" ajouté avec succès`, 'success');
    } catch (error) {
      showToast(getErrorMessage(error), 'error');
    }
  };

  const updateProduct = async (product) => {
    try {
      const updated = await updateProductApi(product.id, product);
      products.value = products.value.map((p) => (p.id === product.id ? updated : p));
      showToast(`Produit "${product.name}" mis à jour`, 'success');
    } catch (error) {
      showToast(getErrorMessage(error), 'error');
    }
  };

  const deleteProduct = async (id) => {
    try {
      await deleteProductApi(id);
      products.value = products.value.filter((p) => p.id !== id);
      showToast('Produit retiré du catalogue', 'success');
    } catch (error) {
      showToast(getErrorMessage(error), 'error');
    }
  };

  const addMarket = async (market) => {
    try {
      const created = await createMarket(market);
      markets.value = [created, ...markets.value];
      showToast(`Marché "${market.name}" créé avec succès`, 'success');
    } catch (error) {
      showToast(getErrorMessage(error), 'error');
    }
  };

  const updateMarket = async (market) => {
    try {
      const updated = await apiUpdateMarket(market.id, market);
      markets.value = markets.value.map((m) => (m.id === market.id ? updated : m));
      showToast(`Marché "${market.name}" mis à jour`, 'success');
    } catch (error) {
      showToast(getErrorMessage(error), 'error');
    }
  };

  const deleteMarket = async (id) => {
    try {
      await deleteMarketApi(id);
      markets.value = markets.value.filter((m) => m.id !== id);
      showToast('Marché retiré du registre', 'success');
      return true;
    } catch (error) {
      showToast(getErrorMessage(error, 'Impossible de supprimer ce marché'), 'error');
      return false;
    }
  };

  const loadProductCategories = async () => {
    const categoriesRevision = productCategoriesRevision;
    try {
      const categories = await fetchAllProductCategories();
      if (categoriesRevision !== productCategoriesRevision) return;
      productCategories.value = categories;
    } catch (error) {
      showToast(getErrorMessage(error, 'Erreur de chargement des catégories'), 'error');
    }
  };

  const syncCategoriesAfterMutation = async () => {
    productCategoriesRevision += 1;
    const categoriesRevision = productCategoriesRevision;
    try {
      const [categories, m] = await Promise.all([
        fetchAllProductCategories(),
        fetchMarkets(),
      ]);
      if (categoriesRevision !== productCategoriesRevision) return;
      productCategories.value = categories;
      markets.value = m;
    } catch (error) {
      showToast(getErrorMessage(error, 'Erreur de synchronisation des catégories'), 'error');
    }
  };

  const addProductCategory = async (category) => {
    try {
      await createProductCategory(category);
      await syncCategoriesAfterMutation();
      showToast(`Catégorie "${category.name}" créée avec succès`, 'success');
    } catch (error) {
      showToast(getErrorMessage(error), 'error');
    }
  };

  const updateProductCategory = async (category) => {
    try {
      await updateProductCategoryApi(category.id, category);
      await syncCategoriesAfterMutation();
      showToast(`Catégorie "${category.name}" mise à jour`, 'success');
    } catch (error) {
      showToast(getErrorMessage(error), 'error');
    }
  };

  const deleteProductCategory = async (id) => {
    try {
      await deleteProductCategoryApi(id);
      productCategories.value = productCategories.value.filter((c) => !sameId(c.id, id));
      await syncCategoriesAfterMutation();
      showToast('Catégorie supprimée', 'success');
      return true;
    } catch (error) {
      showToast(getErrorMessage(error, 'Impossible de supprimer cette catégorie'), 'error');
      return false;
    }
  };

  const addBlock = async (block) => {
    try {
      const created = await createBlock(block.marketId, block);
      blocks.value = [...blocks.value, created];
      showToast(`Bloc "${block.name}" créé`, 'success');
      return created;
    } catch (error) {
      showToast(getErrorMessage(error), 'error');
      return null;
    }
  };

  const updateBlock = async (block) => {
    try {
      const updated = await updateBlockApi(block.id, block);
      blocks.value = blocks.value.map((b) => (b.id === block.id ? updated : b));
      showToast(`Bloc "${block.name}" mis à jour`, 'success');
    } catch (error) {
      showToast(getErrorMessage(error), 'error');
    }
  };

  const deleteBlock = async (id) => {
    try {
      await deleteBlockApi(id);
      blocks.value = blocks.value.filter((b) => b.id !== id);
      showToast('Bloc supprimé', 'success');
      return true;
    } catch (error) {
      showToast(getErrorMessage(error), 'error');
      return false;
    }
  };

  const addPlace = async (place) => {
    try {
      const created = await createPlace(place);
      places.value = [...places.value, created];
      await loadPublicData();
      showToast(`Emplacement ${place.id} ajouté`, 'success');
    } catch (error) {
      showToast(getErrorMessage(error), 'error');
    }
  };

  const deletePlace = async (place) => {
    if (!place?.placeId) {
      showToast('Emplacement introuvable', 'error');
      return false;
    }
    try {
      await deletePlaceApi(place.placeId);
      places.value = places.value.filter(
        (p) => !(p.placeId === place.placeId || (p.id === place.id && p.marketId === place.marketId)),
      );
      await loadPublicData();
      showToast(`Emplacement ${place.id} supprimé`, 'success');
      return true;
    } catch (error) {
      showToast(getErrorMessage(error), 'error');
      return false;
    }
  };

  const addUser = async (user) => {
    try {
      const created = await createUser(user);
      users.value = [created, ...users.value];
      showToast(`Utilisateur "${user.name}" créé avec succès`, 'success');
    } catch (error) {
      showToast(getErrorMessage(error), 'error');
    }
  };

  const updateUser = async (user) => {
    try {
      const updated = await updateUserApi(user.id, user);
      users.value = users.value.map((u) => (u.id === user.id ? updated : u));
      showToast(`Utilisateur "${user.name}" mis à jour`, 'success');
    } catch (error) {
      showToast(getErrorMessage(error), 'error');
    }
  };

  const deleteUser = async (id) => {
    try {
      await deleteUserApi(id);
      users.value = users.value.filter((u) => u.id !== id);
      showToast('Utilisateur supprimé', 'success');
      return true;
    } catch (error) {
      showToast(getErrorMessage(error, 'Impossible de supprimer cet utilisateur'), 'error');
      return false;
    }
  };

  const toggleUserActive = async (id, isActive) => {
    const user = users.value.find((u) => u.id === id);
    if (!user) return;
    try {
      const updated = await updateUserApi(id, { ...user, isActive });
      users.value = users.value.map((u) => (u.id === id ? updated : u));
      showToast(
        `Compte ${isActive ? 'activé' : 'désactivé'}`,
        isActive ? 'success' : 'info',
      );
    } catch (error) {
      showToast(getErrorMessage(error), 'error');
    }
  };

  const updatePlaceStatus = async (placeNumber, marketId, status, merchantId) => {
    const place = places.value.find((p) => p.id === placeNumber && p.marketId === marketId);
    if (!place?.placeId) {
      showToast('Emplacement introuvable', 'error');
      return;
    }
    try {
      const statusMap = { libre: 'available', occupée: 'occupied', maintenance: 'maintenance', réservée: 'reserved' };
      await updatePlaceApi(place.placeId, { status: statusMap[status] || status });
      if (merchantId && status === 'occupée') {
        await assignPlaceChief(place.placeId, merchantId);
      }
      await loadPublicData();
      showToast(`Emplacement ${placeNumber} mis à jour`, 'info');
    } catch (error) {
      showToast(getErrorMessage(error), 'error');
    }
  };

  onMounted(() => {
    refreshInBackground();
    if (getStoredUser()) {
      fetchProfile()
        .then((profile) => {
          currentUser.value = profile;
        })
        .catch(() => {
          currentUser.value = GUEST_USER;
        });
    }
  });

  return {
    markets,
    merchants,
    products,
    places,
    blocks,
    productCategories,
    requests,
    receipts,
    sales,
    users,
    currentUser,
    loading,
    usersLoading,
    initialized,
    viewState,
    selectedMarketId,
    selectedProductId,
    publicTab,
    adminActiveTab,
    toast,
    login,
    register,
    logout,
    updateProfile,
    updatePassword,
    refreshAll,
    loadUsers,
    loadBlocks,
    setCurrentUser,
    setViewState,
    setSelectedMarketId: (id) => { selectedMarketId.value = id; },
    setSelectedProductId: (id) => { selectedProductId.value = id; },
    setPublicTab: (tab) => { publicTab.value = tab; },
    setAdminActiveTab: (tab) => { adminActiveTab.value = tab; },
    addPlaceRequest,
    addPaymentReceipt,
    loadSales,
    getSale,
    addSale,
    updateRequestStatus,
    updateReceiptStatus,
    addMarket,
    updateMarket,
    deleteMarket,
    loadProductCategories,
    addProductCategory,
    updateProductCategory,
    deleteProductCategory,
    addBlock,
    updateBlock,
    deleteBlock,
    addPlace,
    deletePlace,
    addProduct,
    updateProduct,
    deleteProduct,
    updatePlaceStatus,
    addUser,
    updateUser,
    deleteUser,
    toggleUserActive,
    showToast,
    clearToast,
  };
}

export function provideApp() {
  const state = createAppState();
  provide(APP_KEY, state);
  return state;
}

export function useApp() {
  const state = inject(APP_KEY);
  if (!state) {
    throw new Error('useApp must be used within AppProvider');
  }
  return state;
}