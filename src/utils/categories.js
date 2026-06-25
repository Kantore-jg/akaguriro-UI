import { sameId } from './ids.js';

export function categoriesForMarket(market) {
  if (!market) return [];

  if (market.marketProductCategories?.length) {
    return market.marketProductCategories;
  }

  return [];
}

export function findMarketById(markets, marketId) {
  return markets.find((m) => sameId(m.id, marketId)) || null;
}