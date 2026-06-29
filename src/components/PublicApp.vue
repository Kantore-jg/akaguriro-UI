<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useApp } from '../composables/useApp.js';
import { usePublicNavigation } from '../composables/usePublicNavigation.js';
import { sameId } from '../utils/ids.js';
import Navigation from './Navigation.vue';
import PublicHome from './PublicHome.vue';
import PublicMarketsList from './PublicMarketsList.vue';
import PublicMarketDetail from './PublicMarketDetail.vue';
import PublicProductDetails from './PublicProductDetails.vue';
import PublicRequestPlace from './PublicRequestPlace.vue';
import PublicPriceTrends from './PublicPriceTrends.vue';
import ProfilePage from './ProfilePage.vue';
import { Search, MessageSquare, ShieldCheck } from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();
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

const globalProdQuery = ref('');
const globalProdCat = ref('all');
const globalProdCity = ref('all');
const merchantQuery = ref('');
const merchantCategory = ref('all');

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

const filteredProducts = computed(() =>
  products.value.filter((p) => {
    const matchesQuery =
      p.name.toLowerCase().includes(globalProdQuery.value.toLowerCase()) ||
      p.category.toLowerCase().includes(globalProdQuery.value.toLowerCase());
    const matchesCat = globalProdCat.value === 'all' || p.category === globalProdCat.value;
    const mObj = markets.value.find((m) => sameId(m.id, p.marketId));
    const matchesCity =
      globalProdCity.value === 'all' ||
      (mObj ? mObj.city === globalProdCity.value : false);
    return matchesQuery && matchesCat && matchesCity;
  }),
);

const filteredMerchants = computed(() =>
  merchants.value.filter((m) => {
    const matchesQuery =
      m.name.toLowerCase().includes(merchantQuery.value.toLowerCase()) ||
      m.category.toLowerCase().includes(merchantQuery.value.toLowerCase());
    const matchesCategory =
      merchantCategory.value === 'all' || m.category === merchantCategory.value;
    return matchesQuery && matchesCategory;
  }),
);

const navigateHome = () => goHome();
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
        <div v-else class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
          <div class="space-y-1.5">
            <!-- <h3 class="text-xs font-bold uppercase tracking-wider text-primary">Alimentation, Textiles & Épices</h3> -->
            <h1 ">
              Catalogue Digital des Produits du Burundi
            </h1>
            <p class="text-slate-500 text-sm max-w-xl font-medium">
              Comparez les tarifs indicatifs arrêtés par les mairies provinciales 
            </p>
          </div>

          <div class="bg-white p-4 rounded-2xl border border-slate-150 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
            <div class="w-full md:w-80 flex items-center gap-2 px-3 py-2 bg-background border border-slate-200/60 rounded-xl focus-within:bg-white focus-within:border-primary/30 transition-all">
              <Search class="w-4 h-4 text-slate-400" />
              <input
                v-model="globalProdQuery"
                type="text"
                placeholder="Filtrer par nom (ex. Mukeke, Banane...)"
                class="bg-transparent border-0 outline-none text-xs w-full text-slate-700"
              />
            </div>
            <div class="flex flex-wrap gap-2.5 w-full md:w-auto">
              <select
                v-model="globalProdCat"
                class="bg-background hover:bg-slate-100/60 border border-slate-200/60 text-xs font-bold rounded-xl px-3 py-2 cursor-pointer text-slate-700"
              >
                <option value="all">Secteur / Tout</option>
                <option v-for="cat in productCategories" :key="cat.id" :value="cat.name">
                  {{ cat.name }}
                </option>
              </select>
              <select
                v-model="globalProdCity"
                class="bg-background hover:bg-slate-100/60 border border-slate-200/60 text-xs font-bold rounded-xl px-3 py-2 cursor-pointer text-slate-700"
              >
                <option value="all">Ville / Tout</option>
                <option value="Bujumbura">Bujumbura</option>
                <option value="Gitega">Gitega</option>
                <option value="Ngozi">Ngozi</option>
                <option value="Rumonge">Rumonge</option>
              </select>
            </div>
          </div>

          <div v-if="filteredProducts.length === 0" class="text-center py-12 bg-white rounded-2xl border border-slate-150 text-slate-400 font-medium text-xs">
            Aucun aliment ou produit trouvé pour ces paramètres.
          </div>
          <div v-else class="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div
              v-for="p in filteredProducts"
              :key="p.id"
              @click="goToProduct(p.id)"
              class="bg-white rounded-2xl border border-slate-100 p-3.5 space-y-3.5  transition-all "
            >
              <div class="relative rounded-xl overflow-hidden aspect-square bg-background">
                <img :src="p.image" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <!-- <span v-if="p.isTrending" class="absolute top-2.5 left-2.5 bg-yellow-400 text-slate-900 font-extrabold text-[8.5px] px-2 py-0.5 rounded uppercase">
                  Tendance
                </span> -->
              </div>
              <div class="space-y-1">
                <span class="text-[9.5px] font-bold text-primary block uppercase tracking-wide">{{ p.category }}</span>
                <h4 class="text-xs sm:text-sm font-extrabold text-slate-800 line-clamp-1 group-hover:text-primary transition-colors">{{ p.name }}</h4>
                <p class="text-[10.5px] text-slate-400 font-semibold truncate">
                  {{ markets.find(m => sameId(m.id, p.marketId))?.name }} (étal {{ p.placeNumber }})
                </p>
              </div>
              <div class="border-t border-slate-50 pt-2.5 flex items-center justify-between">
                <div>
                  <span class="text-xs sm:text-sm font-black text-slate-950">{{ p.price.toLocaleString('fr-FR') }} BIF</span>
                  <span class="text-[8.5px] text-slate-400 font-medium font-mono ml-0.5">/ {{ p.unit }}</span>
                </div>
                <span class="text-[10px] font-black text-primary">Détails</span>
              </div>
            </div>
          </div>
        </div>
      </template>

      <PublicPriceTrends v-else-if="publicTab === 'price-trends'" />

      <div v-else-if="publicTab === 'merchants'" class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
        <div class="space-y-1.5">
          <!-- <h3 class="text-xs font-bold uppercase tracking-wider text-primary">Habilités par Mairies</h3> -->
          <h1 ">
           Public des Commerçants
          </h1>
         
        </div>

        <div class="bg-white p-4 rounded-2xl border border-slate-150 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          <div class="w-full md:w-80 flex items-center gap-2 px-3 py-2 bg-background border border-slate-200/60 rounded-xl focus-within:bg-white focus-within:border-primary/30 transition-all">
            <Search class="w-4 h-4 text-slate-400" />
            <input
              v-model="merchantQuery"
              type="text"
              placeholder="Rechercher par nom d'exploitant ou filière..."
              class="bg-transparent border-0 outline-none text-xs w-full text-slate-700"
            />
          </div>
          <select
            v-model="merchantCategory"
            class="bg-background hover:bg-slate-100/60 border border-slate-200/60 text-xs font-bold rounded-xl px-3 py-2 cursor-pointer text-slate-700 w-full md:w-auto"
          >
            <option value="all">Spécialité / Tout</option>
            <option v-for="cat in productCategories" :key="cat.id" :value="cat.name">
              {{ cat.name }}
            </option>
          </select>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="m in filteredMerchants"
            :key="m.id"
            class="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex gap-4 items-center relative group"
          >
            <img :src="m.image" class="w-16 h-16 rounded-2xl object-cover bg-background shrink-0" />
            <div class="min-w-0 flex-1 space-y-1 text-xs">
              <h3 class="text-sm font-extrabold text-slate-900 truncate flex items-center gap-1">
                {{ m.name }}
                <ShieldCheck class="w-4.5 h-4.5 text-primary inline shrink-0" />
              </h3>
              <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{{ m.category }}</p>
              <p v-if="markets.find(mk => sameId(mk.id, m.activeMarketId))" class="text-slate-500 font-medium">
                {{ markets.find(mk => sameId(mk.id, m.activeMarketId))?.city }} • Étale {{ m.activePlaceNumber || m.activePlaceId }}
              </p>
            </div>
            <div class="absolute bottom-4 right-4 flex gap-1">
              <a
                :href="`https://wa.me/${(m.phone || '').replace(/\s+/g, '')}`"
                target="_blank"
                rel="noreferrer"
                class="p-1.5 bg-emerald-50 text-primary rounded-lg border border-emerald-110 shadow-sm hover:bg-primary hover:text-white transition-colors"
                title="Contacter sur WhatsApp"
              >
                <MessageSquare class="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

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
            <button @click="navigateHome" class="text-left hover:text-white">Accueil</button>
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
      <span :class="`w-2 h-2 rounded-full ${toast.type === 'error' ? 'bg-red-500' : toast.type === 'info' ? 'bg-blue-400' : 'bg-emerald-400'} animate-ping`"></span>
      <span class="text-xs font-extrabold">{{ toast.message }}</span>
    </div>
  </div>
</template>