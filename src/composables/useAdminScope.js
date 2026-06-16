import { computed } from 'vue';
import { useApp } from './useApp.js';

export function useAdminScope() {
  const {
    currentUser,
    markets,
    merchants,
    places,
    products,
    requests,
    receipts,
  } = useApp();

  const isSuperAdmin = computed(() => currentUser.value.role === 'SUPER_ADMIN');
  const isMarketAdmin = computed(() => currentUser.value.role === 'ADMIN_MARCHE');
  const isMerchant = computed(() => currentUser.value.role === 'COMMERCANT');

  const assignedMarketId = computed(() =>
    isMarketAdmin.value ? currentUser.value.marketId : null,
  );

  const assignedMerchantId = computed(() =>
    isMerchant.value ? currentUser.value.merchantId : null,
  );

  const assignedMerchant = computed(() =>
    assignedMerchantId.value
      ? merchants.value.find((m) => m.id === assignedMerchantId.value)
      : null,
  );

  const scopedMarkets = computed(() => {
    if (assignedMarketId.value) {
      return markets.value.filter((m) => m.id == assignedMarketId.value);
    }
    return markets.value;
  });

  const scopedPlaces = computed(() =>
    places.value.filter(
      (p) => !assignedMarketId.value || p.marketId == assignedMarketId.value,
    ),
  );

  const scopedMerchants = computed(() => {
    if (isMerchant.value && assignedMerchantId.value) {
      return merchants.value.filter((m) => m.id === assignedMerchantId.value);
    }
    if (assignedMarketId.value) {
      return merchants.value.filter((m) => m.activeMarketId == assignedMarketId.value);
    }
    return merchants.value;
  });

  const scopedProducts = computed(() => {
    if (isMerchant.value && assignedMerchantId.value) {
      return products.value.filter((p) => p.merchantId === assignedMerchantId.value);
    }
    if (assignedMarketId.value) {
      return products.value.filter((p) => p.marketId == assignedMarketId.value);
    }
    return products.value;
  });

  const scopedRequests = computed(() =>
    requests.value.filter(
      (r) => !assignedMarketId.value || r.requestedMarketId == assignedMarketId.value,
    ),
  );

  const scopedReceipts = computed(() => {
    if (isMerchant.value && assignedMerchantId.value) {
      return receipts.value.filter((r) => r.merchantId === assignedMerchantId.value);
    }
    if (assignedMarketId.value) {
      const merchantIds = merchants.value
        .filter((m) => m.activeMarketId === assignedMarketId.value)
        .map((m) => m.id);
      return receipts.value.filter((r) => merchantIds.includes(r.merchantId));
    }
    return receipts.value;
  });

  const findMarket = (id) => markets.value.find((m) => m.id === id);
  const findMerchant = (id) => merchants.value.find((m) => m.id === id);

  return {
    currentUser,
    markets,
    merchants,
    places,
    products,
    requests,
    receipts,
    isSuperAdmin,
    isMarketAdmin,
    isMerchant,
    assignedMarketId,
    assignedMerchantId,
    assignedMerchant,
    scopedMarkets,
    scopedPlaces,
    scopedMerchants,
    scopedProducts,
    scopedRequests,
    scopedReceipts,
    findMarket,
    findMerchant,
  };
}