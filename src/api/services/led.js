import { apiClient, extractData } from '../client.js';

export async function fetchLedDisplay(marketId) {
  const { data } = await apiClient.get(`/led-displays/${marketId}`);
  return extractData({ data });
}