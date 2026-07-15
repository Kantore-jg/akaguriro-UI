/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ref, computed, watch, provide, inject, onMounted } from 'vue';
import { getStoredUser, saveUser, fetchProfile } from '../api/services/auth.js';
import { getErrorMessage } from '../api/client.js';
import { createSessionActions, GUEST_USER } from './sessionActions.js';
import { createDataActions } from './dataActions.js';

const APP_KEY = Symbol('app');

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

  let refreshPromise = null;

  const refreshAll = async () => {
    if (refreshPromise) return refreshPromise;

    loading.value = true;
    refreshPromise = (async () => {
      try {
        await dataActions.loadPublicData();
        if (currentUser.value?.id) {
          await dataActions.loadAuthenticatedData();
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

  const dataActions = createDataActions({
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
    usersLoading,
    showToast,
  });

  dataActions.bindRefreshers({
    refreshPublicData: dataActions.loadPublicData,
    refreshAllData: refreshAll,
  });

  const {
    setCurrentUser,
    login,
    register,
    logout,
    updateProfile,
    updatePassword,
  } = createSessionActions({
    currentUser,
    requests,
    receipts,
    sales,
    showToast,
    refreshInBackground,
    saveUser,
  });

  const {
    loadUsers,
    loadBlocks,
    addPlaceRequest,
    loadSales,
    getSale,
    addSale,
    addPaymentReceipt,
    updateRequestStatus,
    updateReceiptStatus,
    addProduct,
    updateProduct,
    deleteProduct,
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
    addUser,
    updateUser,
    deleteUser,
    toggleUserActive,
    updatePlaceStatus,
  } = dataActions;

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
