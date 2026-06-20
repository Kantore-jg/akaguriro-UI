import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { fetchLedDisplay } from '../api/services/led.js';
import { fetchMarkets } from '../api/services/data.js';
import { getErrorMessage } from '../api/client.js';

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=200';
const PLACEHOLDER_PRODUCT = 'https://images.unsplash.com/photo-1534482421-64566f976cfa?auto=format&fit=crop&q=80&w=400';
const PLACEHOLDER_AVATAR = 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=200';

const DEFAULT_BULLETINS = [
  '📢 AKAGURIRO : Plateforme intelligente de gestion des marchés publics du Burundi.',
  '💡 INFO : Affichage LED synchronisé en temps réel avec l\'API centrale.',
  '🛡️ SÉCURITÉ : Badges d\'authentification obligatoires pour tous les commerçants habilités.',
];

export function useLedDisplay() {
  const route = useRoute();
  const router = useRouter();

  const markets = ref([]);
  const selectedMarketId = ref(null);
  const display = ref(null);
  const loading = ref(true);
  const error = ref(null);
  const lastRefresh = ref(null);
  const activeAlertIndex = ref(0);
  const timeStr = ref('');

  let clockInterval = null;
  let refreshInterval = null;
  let bulletinInterval = null;

  const refreshIntervalMs = computed(() => (display.value?.refresh_interval ?? 30) * 1000);

  const bulletins = computed(() => {
    const fromApi = display.value?.announcements?.map((a) => a.text || `📢 ${a.title} : ${a.content}`) ?? [];
    return fromApi.length ? fromApi : DEFAULT_BULLETINS;
  });

  const topMerchants = computed(() =>
    (display.value?.top_merchants ?? []).map((m) => ({
      id: m.id,
      name: m.name,
      image: m.image || PLACEHOLDER_AVATAR,
      category: m.category || 'Commerce Général',
      activePlaceId: m.active_place_number || '—',
      activeMarketId: m.active_market_id,
      productsCount: m.products_count ?? 0,
    })),
  );

  const trendingProducts = computed(() =>
    (display.value?.trending_products ?? []).map((p) => ({
      id: p.id,
      name: p.name,
      price: Number(p.price),
      unit: p.unit || 'unit',
      category: p.category || 'Général',
      image: p.image || PLACEHOLDER_PRODUCT,
      marketId: p.market_id,
      isTrending: p.is_trending,
    })),
  );

  const statistics = computed(() => display.value?.statistics ?? {
    total_places: 0,
    occupied_places: 0,
    available_places: 0,
    products_count: 0,
    merchants_count: 0,
    visit_count: 0,
    occupancy_rate: 0,
  });

  const currentMarket = computed(() => display.value?.market ?? markets.value.find((m) => m.id == selectedMarketId.value));

  async function loadMarkets() {
    const list = await fetchMarkets();
    markets.value = list;
    const queryId = Number(route.query.market);
    if (queryId && list.some((m) => m.id === queryId)) {
      selectedMarketId.value = queryId;
    } else if (!selectedMarketId.value && list.length) {
      selectedMarketId.value = list[0].id;
    }
  }

  async function loadDisplay() {
    if (!selectedMarketId.value) return;
    error.value = null;
    try {
      display.value = await fetchLedDisplay(selectedMarketId.value);
      lastRefresh.value = new Date();
    } catch (err) {
      error.value = getErrorMessage(err, 'Impossible de charger les données LED');
    } finally {
      loading.value = false;
    }
  }

  function selectMarket(marketId) {
    selectedMarketId.value = marketId;
    router.replace({ query: { ...route.query, market: marketId } });
  }

  function startTimers() {
    const updateClock = () => {
      timeStr.value = new Date().toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    };
    updateClock();
    clockInterval = setInterval(updateClock, 1000);

    bulletinInterval = setInterval(() => {
      activeAlertIndex.value = (activeAlertIndex.value + 1) % bulletins.value.length;
    }, 6000);
  }

  function restartRefreshTimer() {
    if (refreshInterval) clearInterval(refreshInterval);
    refreshInterval = setInterval(loadDisplay, refreshIntervalMs.value);
  }

  watch(selectedMarketId, async (id) => {
    if (!id) return;
    loading.value = true;
    await loadDisplay();
    restartRefreshTimer();
  });

  watch(refreshIntervalMs, restartRefreshTimer);

  onMounted(async () => {
    startTimers();
    try {
      await loadMarkets();
      await loadDisplay();
      restartRefreshTimer();
    } catch (err) {
      error.value = getErrorMessage(err);
      loading.value = false;
    }
  });

  onUnmounted(() => {
    if (clockInterval) clearInterval(clockInterval);
    if (refreshInterval) clearInterval(refreshInterval);
    if (bulletinInterval) clearInterval(bulletinInterval);
  });

  return {
    markets,
    selectedMarketId,
    selectMarket,
    display,
    loading,
    error,
    lastRefresh,
    timeStr,
    bulletins,
    activeAlertIndex,
    topMerchants,
    trendingProducts,
    statistics,
    currentMarket,
    loadDisplay,
  };
}