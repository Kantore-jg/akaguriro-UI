/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ref, computed, watch, provide, inject } from 'vue';
import { getStoredData, saveStoredData } from '../data.js';

const APP_KEY = Symbol('app');

export function createAppState() {
  const data = ref(getStoredData());
  const viewState = ref('PUBLIC');
  const selectedMarketId = ref(null);
  const selectedProductId = ref(null);
  const publicTab = ref('home');
  const adminActiveTab = ref('dashboard');
  const toast = ref(null);

  watch(data, (newData) => {
    saveStoredData(newData.value ?? newData);
  }, { deep: true });

  const markets = computed(() => data.value.markets);
  const merchants = computed(() => data.value.merchants);
  const products = computed(() => data.value.products);
  const places = computed(() => data.value.places);
  const requests = computed(() => data.value.requests);
  const receipts = computed(() => data.value.receipts);
  const currentUser = computed(() => data.value.currentUser);

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

  const setCurrentUser = (user) => {
    data.value = { ...data.value, currentUser: user };
    showToast(`Session active : rôle ${user.role}`, 'info');
  };

  const addPlaceRequest = (req) => {
    const newReq = {
      id: `req_${Date.now()}`,
      ...req,
      submittedDate: new Date().toISOString().split('T')[0],
      status: 'pending',
    };
    data.value = {
      ...data.value,
      requests: [newReq, ...data.value.requests],
    };
    showToast('Demande d\'octroi de place envoyée avec succès', 'success');
  };

  const addPaymentReceipt = (rec) => {
    const newRec = {
      id: `rec_${Date.now()}`,
      ...rec,
      submittedDate: new Date().toISOString().split('T')[0],
      status: 'pending',
    };
    data.value = {
      ...data.value,
      receipts: [newRec, ...data.value.receipts],
    };
    showToast('Reçu téléversé avec succès pour validation', 'success');
  };

  const updateRequestStatus = (reqId, status) => {
    const prev = data.value;
    const requests = prev.requests.map((r) => {
      if (r.id === reqId) return { ...r, status };
      return r;
    });

    let places = [...prev.places];
    let merchants = [...prev.merchants];
    const reqObj = prev.requests.find((r) => r.id === reqId);

    if (status === 'approved' && reqObj) {
      const freePlaceIdx = places.findIndex(
        (p) => p.marketId === reqObj.requestedMarketId && p.status === 'libre'
      );

      if (freePlaceIdx !== -1) {
        const place = places[freePlaceIdx];
        const newMerchantId = `mer_${Date.now()}`;

        const newMerchant = {
          id: newMerchantId,
          name: reqObj.merchantName,
          phone: reqObj.merchantPhone,
          image: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 900000)}?auto=format&fit=crop&q=80&w=200`,
          category: reqObj.category || 'Commerce Général',
          rating: 5.0,
          activePlaceId: place.id,
          activeMarketId: reqObj.requestedMarketId,
          joinedDate: new Date().toISOString().split('T')[0],
          verified: true,
          bio: reqObj.description
        };

        merchants.push(newMerchant);
        places[freePlaceIdx] = {
          ...place,
          status: 'occupée',
          merchantId: newMerchantId,
          category: reqObj.category
        };

        const markets = prev.markets.map(m => {
          if (m.id === reqObj.requestedMarketId) {
            return { ...m, occupiedPlaces: Math.min(m.totalPlaces, m.occupiedPlaces + 1) };
          }
          return m;
        });

        data.value = { ...prev, requests, places, merchants, markets };
        showToast(`Demande de place ${status === 'approved' ? 'approuvée' : 'rejetée'}`, status === 'approved' ? 'success' : 'error');
        return;
      }
    }

    data.value = { ...prev, requests };
    showToast(`Demande de place ${status === 'approved' ? 'approuvée' : 'rejetée'}`, status === 'approved' ? 'success' : 'error');
  };

  const updateReceiptStatus = (recId, status) => {
    data.value = {
      ...data.value,
      receipts: data.value.receipts.map((r) => (r.id === recId ? { ...r, status } : r)),
    };
    showToast(`Reçu de paiement ${status === 'approved' ? 'validé' : 'rejeté'}`, status === 'approved' ? 'success' : 'error');
  };

  const addProduct = (product) => {
    const newProduct = {
      id: `prod_${Date.now()}`,
      ...product,
    };
    data.value = {
      ...data.value,
      products: [newProduct, ...data.value.products],
    };
    showToast(`Produit "${product.name}" ajouté avec succès`, 'success');
  };

  const updateProduct = (product) => {
    data.value = {
      ...data.value,
      products: data.value.products.map((p) => (p.id === product.id ? product : p)),
    };
    showToast(`Produit "${product.name}" mis à jour`, 'success');
  };

  const deleteProduct = (id) => {
    data.value = {
      ...data.value,
      products: data.value.products.filter((p) => p.id !== id),
    };
    showToast('Produit retiré du catalogue', 'success');
  };

  const updatePlaceStatus = (placeId, marketId, status, merchantId) => {
    const prev = data.value;
    const places = prev.places.map((p) => {
      if (p.id === placeId && p.marketId === marketId) {
        return {
          ...p,
          status,
          merchantId: status === 'libre' ? undefined : merchantId || p.merchantId,
          category: status === 'libre' ? undefined : p.category
        };
      }
      return p;
    });

    const countOccupied = places.filter(p => p.marketId === marketId && p.status === 'occupée').length;
    const markets = prev.markets.map(m => {
      if (m.id === marketId) {
        return { ...m, occupiedPlaces: countOccupied };
      }
      return m;
    });

    data.value = { ...prev, places, markets };
    showToast(`Emplacement ${placeId} mis à jour : ${status.toUpperCase()}`, 'info');
  };

  return {
    data,
    markets,
    merchants,
    products,
    places,
    requests,
    receipts,
    currentUser,
    viewState,
    selectedMarketId,
    selectedProductId,
    publicTab,
    adminActiveTab,
    toast,
    setCurrentUser,
    setViewState,
    setSelectedMarketId: (id) => { selectedMarketId.value = id; },
    setSelectedProductId: (id) => { selectedProductId.value = id; },
    setPublicTab: (tab) => { publicTab.value = tab; },
    setAdminActiveTab: (tab) => { adminActiveTab.value = tab; },
    addPlaceRequest,
    addPaymentReceipt,
    updateRequestStatus,
    updateReceiptStatus,
    addProduct,
    updateProduct,
    deleteProduct,
    updatePlaceStatus,
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
