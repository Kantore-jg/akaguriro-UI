import { sameId } from './ids.js';

export function categoriesForMarket(market, categories = []) {
  if (!market?.productCategoryIds?.length) return categories;
  const ids = new Set(market.productCategoryIds.map(String));
  const scoped = categories.filter((c) => ids.has(String(c.id)));
  return scoped.length ? scoped : categories;
}

export function findMarketById(markets, marketId) {
  return markets.find((m) => sameId(m.id, marketId)) || null;
}