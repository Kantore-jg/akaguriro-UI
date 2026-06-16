/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

<script setup>
import { computed } from 'vue';
import { useApp } from '../composables/useApp.js';
import {
  ArrowLeft,
  MapPin,
  Store,
  MessageSquare,
  ShieldCheck,
  Star
} from 'lucide-vue-next';

const {
  products,
  markets,
  merchants,
  selectedProductId,
  setSelectedProductId,
  setSelectedMarketId,
  setPublicTab,
  showToast
} = useApp();

const product = computed(() => products.value.find(p => p.id === selectedProductId.value));

const market = computed(() => {
  if (!product.value) return undefined;
  return markets.value.find(m => m.id === product.value.marketId);
});

const merchant = computed(() => {
  if (!product.value) return undefined;
  return merchants.value.find(m => m.id === product.value.merchantId);
});

const similarProducts = computed(() => {
  if (!product.value) return [];
  return products.value.filter(
    p => p.category === product.value.category && p.id !== product.value.id
  ).slice(0, 4);
});

function handleViewPlaceOnMap() {
  if (!market.value || !product.value?.placeNumber) return;

  setSelectedMarketId(market.value.id);
  setPublicTab('markets');
  showToast(`Redirection vers le ${market.value.name} - Étalage ${product.value.placeNumber}`, 'success');
}
</script>

<template>
  <div v-if="!product" class="py-20 text-center text-slate-500">
    <p>Produit non trouvé ou retiré par son vendeur.</p>
    <button @click="setPublicTab('home')" class="mt-4 text-emerald-600 font-bold text-xs underline">
      Retour à l'accueil
    </button>
  </div>

  <div v-else class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-12">

    <!-- 1. RETRO NAVIGATION BACK BUTTON -->
    <div>
      <button
        @click="setSelectedProductId(null)"
        class="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-emerald-600 transition-colors py-1 px-2.5 rounded-lg hover:bg-slate-100"
      >
        <ArrowLeft class="w-4 h-4" />
        Retour au catalogue de produits
      </button>
    </div>

    <!-- 2. SPLIT-SCREEN MAIN PRODUCT INFO -->
    <section class="bg-white rounded-3xl border border-slate-100 p-5 sm:p-8 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

      <!-- Left column: Image presentation -->
      <div class="lg:col-span-6 relative rounded-2xl overflow-hidden bg-slate-50 aspect-square border border-slate-100 shadow-inner">
        <img
          :src="product.image"
          :alt="product.name"
          class="w-full h-full object-cover"
        />
        <span
          v-if="product.isTrending"
          class="absolute top-4 left-4 bg-yellow-400 text-slate-900 font-extrabold text-[10px] uppercase tracking-wider px-3 py-1 rounded-lg shadow-sm"
        >
          Tendance Nationale
        </span>
      </div>

      <!-- Right column: Purchase & Stall metadata -->
      <div class="lg:col-span-6 space-y-6">

        <div class="space-y-2">
          <span class="inline-block bg-emerald-50 text-emerald-700 font-bold text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-md border border-emerald-100">
            {{ product.category }}
          </span>
          <h1 class="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
            {{ product.name }}
          </h1>

          <!-- Store & City location block -->
          <p v-if="market" class="text-xs sm:text-sm font-semibold text-slate-500 flex items-center gap-1.5 pt-0.5">
            <MapPin class="w-4 h-4 text-emerald-500 shrink-0" />
            {{ market.name }} ({{ market.city }})
          </p>
        </div>

        <!-- Pricing Box -->
        <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200/50 flex justify-between items-center">
          <div>
            <span class="block text-[9.5px] text-slate-400 font-bold uppercase">Prix Conseillé Estimatif</span>
            <strong class="text-2xl sm:text-3xl font-black text-emerald-600">
              {{ product.price.toLocaleString('fr-FR') }} BIF
            </strong>
            <span class="text-xs text-slate-400 font-medium ml-1">par {{ product.unit }}</span>
          </div>
          <div class="text-right">
            <span class="block text-[9.5px] text-slate-400 font-bold uppercase">Disponibilité d'Étal</span>
            <span
              class="inline-flex items-center gap-1 font-bold text-xs mt-1 px-2.5 py-0.5 rounded-full"
              :class="product.available ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'"
            >
              {{ product.available ? '🟢 En Stock' : '🔴 Rupture de stock' }}
            </span>
          </div>
        </div>

        <!-- Product description -->
        <div class="space-y-2">
          <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider">Description de l'article</h3>
          <p class="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            {{ product.description || 'Cet article de première nécessité est listé par l\'exploitant officiel de l\'étalage. Les prix sont encadrés par la mairie locale.' }}
          </p>
        </div>

        <!-- Logistics identifiers list -->
        <div class="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200/40">
          <div>
            <span class="text-slate-400 block font-semibold">UNITÉ DE MESURE :</span>
            <span class="text-slate-900 font-bold text-xs uppercase">{{ product.unit }}</span>
          </div>
          <div>
            <span class="text-slate-400 block font-semibold">STOCK DÉPOSÉ :</span>
            <span class="text-slate-900 font-bold text-xs">{{ product.stock }} {{ product.unit }}(s)</span>
          </div>
          <div class="border-t border-slate-200/50 pt-2 pb-0">
            <span class="text-slate-400 block font-semibold">NUMÉRO D'ÉTAL :</span>
            <span class="text-emerald-600 font-extrabold text-xs">{{ product.placeNumber }}</span>
          </div>
          <div class="border-t border-slate-200/50 pt-2 pb-0">
            <span class="text-slate-400 block font-semibold">FIABILITÉ DU TARIF :</span>
            <span class="text-slate-900 font-bold text-xs">99% Vérifié par Mairie</span>
          </div>
        </div>

        <!-- 3. MERCHANT SHORTCARD WITH RATINGS -->
        <div v-if="merchant" class="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-3 shadow-inner">
          <span class="block text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Commerçant Habilité</span>
          <div class="flex gap-3.5 items-center">
            <img
              :src="merchant.image"
              :alt="merchant.name"
              class="w-11 h-11 rounded-lg object-cover bg-slate-800 shrink-0"
            />
            <div class="flex-1 min-w-0">
              <h4 class="text-xs sm:text-sm font-extrabold tracking-tight text-white truncate flex items-center gap-1">
                {{ merchant.name }}
                <ShieldCheck class="w-4 h-4 text-emerald-400 inline shrink-0" />
              </h4>
              <p class="text-[10px] text-slate-400 uppercase font-semibold leading-none mt-0.5">{{ merchant.category }}</p>

              <div class="flex items-center gap-1.5 mt-1 text-yellow-400">
                <Star class="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span class="text-[10.5px] font-semibold text-slate-200">{{ merchant.rating }} Score de satisfaction client</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Action triggers -->
        <div class="flex flex-col sm:flex-row gap-3 pt-3">
          <button
            @click="handleViewPlaceOnMap"
            class="flex-1 bg-slate-950 hover:bg-slate-800 text-white font-bold py-3.5 px-6 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <Store class="w-4 h-4 text-emerald-400" />
            Voir l'étalage sur le plan du marché
          </button>

          <a
            v-if="merchant"
            :href="`https://wa.me/${merchant.phone.replace(/\s+/g, '')}?text=Bonjour%20${encodeURIComponent(merchant.name)},%20je%20suis%20intéressé%20par%20votre%20produit%20${encodeURIComponent(product.name)}%20(Etalage%20${product.placeNumber})%20depuis%20Akaguriro.`"
            target="_blank"
            rel="noreferrer"
            class="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-6 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow shadow-emerald-700/30 text-center transition-all"
          >
            <MessageSquare class="w-4 h-4 shrink-0" />
            Contacter le vendeur
          </a>
        </div>

      </div>

    </section>

    <!-- 4. SIMILAR SUGGESTED PRODUCTS -->
    <section class="space-y-6">
      <div class="border-b border-slate-100 pb-3">
        <h2 class="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight font-display">
          Dans la même filière alimentaire ({{ product.category }})
        </h2>
      </div>

      <p v-if="similarProducts.length === 0" class="text-slate-400 text-xs">Aucun produit similaire en vente.</p>
      <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div
          v-for="p in similarProducts"
          :key="p.id"
          @click="setSelectedProductId(p.id)"
          class="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer p-3 space-y-3 group"
        >
          <div class="relative rounded-lg overflow-hidden bg-slate-50 aspect-square">
            <img :src="p.image" :alt="p.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform" />
          </div>
          <div class="space-y-0.5">
            <h4 class="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-emerald-600">{{ p.name }}</h4>
            <p class="text-[10px] text-slate-400 font-semibold">{{ p.price.toLocaleString('fr-FR') }} BIF</p>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>
