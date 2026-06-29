import { useRouter } from 'vue-router';
import { useApp } from './useApp.js';
import { toIdString } from '../utils/ids.js';

export function usePublicNavigation() {
  const router = useRouter();
  const { setPublicTab, setSelectedMarketId, setSelectedProductId } = useApp();

  const goHome = () => {
    setSelectedMarketId(null);
    setSelectedProductId(null);
    setPublicTab('home');
    router.push('/');
  };

  const goToTab = (tab) => {
    const paths = {
      home: '/',
      markets: '/markets',
      products: '/products',
      merchants: '/merchants',
      'price-trends': '/price-trends',
      request: '/request',
      auth: '/login',
    };
    setSelectedMarketId(null);
    setSelectedProductId(null);
    setPublicTab(tab);
    router.push(paths[tab] || '/');
  };

  const goToMarketsList = () => {
    setSelectedMarketId(null);
    setPublicTab('markets');
    router.push('/markets');
  };

  const goToMarket = (marketId) => {
    if (marketId == null) return goToMarketsList();
    setSelectedMarketId(marketId);
    setPublicTab('markets');
    router.push(`/markets/${toIdString(marketId)}`);
  };

  const goToProductsList = () => {
    setSelectedProductId(null);
    setPublicTab('products');
    router.push('/products');
  };

  const goToProduct = (productId) => {
    if (productId == null) return goToProductsList();
    setSelectedProductId(productId);
    setPublicTab('products');
    router.push(`/products/${toIdString(productId)}`);
  };

  return {
    goHome,
    goToTab,
    goToMarketsList,
    goToMarket,
    goToProductsList,
    goToProduct,
  };
}