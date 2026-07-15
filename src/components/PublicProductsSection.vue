<script setup>
import { ref, computed } from 'vue';
import { Search } from 'lucide-vue-next';
import { sameId } from '../utils/ids.js';

const props = defineProps({
  products: { type: Array, default: () => [] },
  markets: { type: Array, default: () => [] },
  productCategories: { type: Array, default: () => [] },
  onSelectProduct: { type: Function, required: true },
});

const globalProdQuery = ref('');
const globalProdCat = ref('all');
const globalProdCity = ref('all');

const getMarketById = (marketId) => props.markets.find((market) => sameId(market.id, marketId));

const filteredProducts = computed(() =>
  props.products.filter((p) => {
    const query = globalProdQuery.value.toLowerCase();
    const matchesQuery = p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query);
    const matchesCat = globalProdCat.value === 'all' || p.category === globalProdCat.value;
    const market = getMarketById(p.marketId);
    const matchesCity = globalProdCity.value === 'all' || (market ? market.city === globalProdCity.value : false);
    return matchesQuery && matchesCat && matchesCity;
  }),
);
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
    <div class="space-y-1.5">
      <h1 class="text-2xl font-extrabold tracking-tight text-slate-900">
        Catalogue Digital des Produits du Burundi
      </h1>
      <p class="text-slate-500 text-sm max-w-xl font-medium">
        Comparez les tarifs indicatifs arrêtés par les mairies provinciales.
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
        @click="onSelectProduct(p.id)"
        class="bg-white rounded-2xl border border-slate-100 p-3.5 space-y-3.5 transition-all cursor-pointer"
      >
        <div class="relative rounded-xl overflow-hidden aspect-square bg-background">
          <img
            :src="p.image"
            :alt="p.name"
            class="w-full h-full object-cover transition-transform duration-300"
          />
        </div>
        <div class="space-y-1">
          <span class="text-[9.5px] font-bold text-primary block uppercase tracking-wide">{{ p.category }}</span>
          <h4 class="text-xs sm:text-sm font-extrabold text-slate-800 line-clamp-1 transition-colors">{{ p.name }}</h4>
          <p class="text-[10.5px] text-slate-400 font-semibold truncate">
            {{ getMarketById(p.marketId)?.name || '—' }} (étal {{ p.placeNumber }})
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
