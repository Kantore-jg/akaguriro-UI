<script setup>
import { computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useApp } from '../composables/useApp.js';
import { usePublicNavigation } from '../composables/usePublicNavigation.js';
import Navigation from './Navigation.vue';
import PublicHome from './PublicHome.vue';
import PublicMarketsList from './PublicMarketsList.vue';
import PublicMarketDetail from './PublicMarketDetail.vue';
import PublicProductDetails from './PublicProductDetails.vue';
import PublicRequestPlace from './PublicRequestPlace.vue';
import PublicPriceTrends from './PublicPriceTrends.vue';
import PublicProductsSection from './PublicProductsSection.vue';
import PublicMerchantsSection from './PublicMerchantsSection.vue';
import ProfilePage from './ProfilePage.vue';

const route = useRoute();
const {
  publicTab,
  setPublicTab,
  selectedMarketId,
  selectedProductId,
  setSelectedProductId,
  setSelectedMarketId,
  products,
  markets,
  merchants,
  productCategories,
  toast,
  initialized,
} = useApp();

const { goToProduct, goToTab, goHome } = usePublicNavigation();

const tabFromRoute = computed(() => route.meta.tab || 'home');

watch(
  () => [route.path, route.params.marketId, route.params.productId, tabFromRoute.value],
  () => {
    const tab = tabFromRoute.value;
    if (publicTab.value !== tab) setPublicTab(tab);

    if (route.params.marketId) {
      if (selectedMarketId.value !== route.params.marketId) {
        setSelectedMarketId(route.params.marketId);
      }
    } else if (route.name === 'Markets') {
      if (selectedMarketId.value != null) setSelectedMarketId(null);
    }

    if (route.params.productId) {
      if (selectedProductId.value !== route.params.productId) {
        setSelectedProductId(route.params.productId);
      }
    } else if (route.name === 'Products') {
      if (selectedProductId.value != null) setSelectedProductId(null);
    }
  },
  { immediate: true },
);
</script>

<template>
  <div class="min-h-screen bg-background flex flex-col justify-between text-foreground">
    <Navigation />

    <main class="flex-1">
      <ProfilePage v-if="publicTab === 'profile'" />

      <PublicHome v-else-if="publicTab === 'home'" />

      <template v-else-if="publicTab === 'markets'">
        <div v-if="!initialized" class="py-20 text-center text-muted-foreground text-sm">
          Chargement des marchés...
        </div>
        <PublicMarketDetail v-else-if="selectedMarketId" />
        <PublicMarketsList v-else />
      </template>

      <template v-else-if="publicTab === 'products'">
        <PublicProductDetails v-if="selectedProductId" />
        <PublicProductsSection
          v-else
          :products="products"
          :markets="markets"
          :product-categories="productCategories"
          :on-select-product="goToProduct"
        />
      </template>

      <PublicPriceTrends v-else-if="publicTab === 'price-trends'" />

      <PublicMerchantsSection
        v-else-if="publicTab === 'merchants'"
        :merchants="merchants"
        :markets="markets"
        :product-categories="productCategories"
      />

      <PublicRequestPlace v-else-if="publicTab === 'request'" />
    </main>

    <footer class="bg-slate-900 text-slate-200 border-t border-slate-800 py-12 px-4 select-none">
      <div class="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-12 gap-8 text-xs font-semibold">
        <div class="md:col-span-4 space-y-3">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-display shadow text-slate-950 font-black">A</div>
            <h3 class="text-base font-extrabold text-white">Akaguriro</h3>
          </div>
          <p class="text-slate-400 leading-relaxed text-[11px] font-medium max-w-sm">
            Plateforme de digitalisation et d'aide à la gestion des marchés communaux de la République du Burundi.
          </p>
        </div>
        <div class="md:col-span-4 space-y-1">
          <h4 class="text-[10px] text-primary font-extrabold uppercase tracking-widest mb-2.5">Accès & Navigation rapide</h4>
          <div class="grid grid-cols-2 gap-2 text-slate-300 font-medium">
            <button @click="goHome" class="text-left hover:text-white">Accueil</button>
            <button @click="goToTab('markets')" class="text-left hover:text-white">Marchés Connectés</button>
            <button @click="goToTab('products')" class="text-left hover:text-white">Produits phares</button>
            <button @click="goToTab('price-trends')" class="text-left hover:text-white">Tendances prix</button>
            <button @click="goToTab('merchants')" class="text-left hover:text-white">Annuaire Commerçants</button>
            <button @click="goToTab('request')" class="text-left hover:text-white text-primary">Demander une place</button>
          </div>
        </div>
      </div>
      <div class="mx-auto max-w-7xl border-t border-slate-850 pt-6 mt-8 flex flex-col sm:flex-row justify-between items-center text-slate-500 text-[9.5px] font-bold uppercase tracking-wide gap-3">
        <span>Plateforme Officielle - Akaguriro Burundi © 2026. Tous droits réservés.</span>
      </div>
    </footer>

    <div
      v-if="toast"
      class="fixed bottom-5 right-5 z-50 bg-slate-900 border border-slate-700 p-4 rounded-xl shadow-2xl flex items-center gap-3 text-white animate-fadeIn"
    >
      <span
        :class="`w-2 h-2 rounded-full ${toast.type === 'error' ? 'bg-red-500' : toast.type === 'info' ? 'bg-blue-400' : 'bg-emerald-400'} animate-ping`"
      />
      <span class="text-xs font-extrabold">{{ toast.message }}</span>
    </div>
  </div>
</template>
