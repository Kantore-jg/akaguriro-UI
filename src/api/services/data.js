import { apiClient, extractData, extractList } from '../client.js';
import {
  mapMarket,
  mapPlace,
  mapMerchant,
  mapProduct,
  mapPlaceRequest,
  mapReceipt,
  marketToApi,
  placeToApi,
  productToApi,
  placeRequestToApi,
} from '../mappers.js';
import { getStoredUser } from './auth.js';

const PER_PAGE = 100;

export async function fetchMarkets() {
  const { data } = await apiClient.get('/markets', { params: { per_page: PER_PAGE } });
  return extractList({ data }).map(mapMarket);
}

export async function fetchPlaces(params = {}) {
  const { data } = await apiClient.get('/places', { params: { per_page: PER_PAGE, ...params } });
  return extractList({ data }).map(mapPlace);
}

export async function fetchMerchants(params = {}) {
  const { data } = await apiClient.get('/merchants', { params: { per_page: PER_PAGE, ...params } });
  return extractList({ data }).map(mapMerchant);
}

export async function fetchProducts(params = {}) {
  const { data } = await apiClient.get('/products', { params: { per_page: PER_PAGE, ...params } });
  return extractList({ data }).map(mapProduct);
}

export async function fetchPlaceRequests() {
  const user = getStoredUser();
  const isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN_MARCHE';
  const endpoint = isAdmin ? '/place-requests' : '/my/place-requests';
  try {
    const { data } = await apiClient.get(endpoint, { params: { per_page: PER_PAGE } });
    return extractList({ data }).map(mapPlaceRequest);
  } catch {
    return [];
  }
}

export async function fetchReceipts() {
  const user = getStoredUser();
  const isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN_MARCHE';
  const endpoint = isAdmin ? '/receipts' : '/my/receipts';
  try {
    const { data } = await apiClient.get(endpoint, { params: { per_page: PER_PAGE } });
    return extractList({ data }).map(mapReceipt);
  } catch {
    return [];
  }
}

export async function createMarket(market) {
  const { data } = await apiClient.post('/markets', marketToApi(market));
  return mapMarket(extractData({ data }));
}

export async function updateMarket(id, market) {
  const { data } = await apiClient.put(`/markets/${id}`, marketToApi(market));
  return mapMarket(extractData({ data }));
}

export async function deleteMarketApi(id) {
  await apiClient.delete(`/markets/${id}`);
}

export async function createPlace(place) {
  const { data } = await apiClient.post('/places', placeToApi(place));
  return mapPlace(extractData({ data }));
}

export async function updatePlaceApi(placeId, payload) {
  const { data } = await apiClient.put(`/places/${placeId}`, payload);
  return mapPlace(extractData({ data }));
}

export async function assignPlaceChief(placeId, userId) {
  const { data } = await apiClient.post(`/places/${placeId}/assign-chief`, { user_id: userId });
  return mapPlace(extractData({ data }));
}

export async function createProduct(product) {
  const { data } = await apiClient.post('/products', productToApi(product));
  return mapProduct(extractData({ data }));
}

export async function updateProductApi(id, product) {
  const { data } = await apiClient.put(`/products/${id}`, productToApi(product));
  return mapProduct(extractData({ data }));
}

export async function deleteProductApi(id) {
  await apiClient.delete(`/products/${id}`);
}

export async function createPlaceRequest(request) {
  const { data } = await apiClient.post('/place-requests', placeRequestToApi(request));
  return mapPlaceRequest(extractData({ data }));
}

export async function approvePlaceRequest(id, placeId = null) {
  const { data } = await apiClient.post(`/place-requests/${id}/approve`, placeId ? { place_id: placeId } : {});
  return mapPlaceRequest(extractData({ data }));
}

export async function rejectPlaceRequest(id, reason) {
  const { data } = await apiClient.post(`/place-requests/${id}/reject`, { reason });
  return mapPlaceRequest(extractData({ data }));
}

export async function createReceipt(formData) {
  const { data } = await apiClient.post('/receipts', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return mapReceipt(extractData({ data }));
}

export async function approveReceipt(id) {
  const { data } = await apiClient.post(`/receipts/${id}/approve`);
  return mapReceipt(extractData({ data }));
}

export async function rejectReceipt(id, reason) {
  const { data } = await apiClient.post(`/receipts/${id}/reject`, { reason });
  return mapReceipt(extractData({ data }));
}