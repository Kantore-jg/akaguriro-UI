/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useApp } from '../composables/useApp.js';
import {
  Tv,
  TrendingUp,
  Star,
  Volume2,
  Eye,
  Calendar,
  Sparkles
} from 'lucide-vue-next';

const { markets, products, merchants, setViewState } = useApp();

const timeStr = ref('');
const activeAlertIndex = ref(0);

const bulletins = [
  "📢 MAIRIE : Les tarifs du Mukeke du Lac Tanganyika sont plafonnés à 25 000 BIF maximum ce lundi.",
  "💡 INFO : Phase 2 de l'éclairage public LED intelligent en cours d'activation dans le Bloc Agro de Gitega.",
  "🛡️ SÉCURITÉ : Port des badges d'authentification Akaguriro obligatoire pour tous les commerçants habilités.",
  "🌾 VIVRES : Arrivée massive de haricots jaunes de Kirundo ce matin au marché central Siyoni."
];

let clockInterval = null;
let bulletinInterval = null;

onMounted(() => {
  const updateClock = () => {
    const now = new Date();
    timeStr.value = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };
  updateClock();
  clockInterval = setInterval(updateClock, 1000);

  bulletinInterval = setInterval(() => {
    activeAlertIndex.value = (activeAlertIndex.value + 1) % bulletins.length;
  }, 6000);
});

onUnmounted(() => {
  if (clockInterval) clearInterval(clockInterval);
  if (bulletinInterval) clearInterval(bulletinInterval);
});

const totalVendors = computed(() => merchants.value.length);
const topRatedMerchants = computed(() =>
  [...merchants.value].sort((a, b) => b.rating - a.rating).slice(0, 3)
);
const coreTrendingProducts = computed(() =>
  products.value.filter(p => p.isTrending || p.price > 10000).slice(0, 4)
);

function findMarket(marketId) {
  return markets.value.find(m => m.id === marketId);
}
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-6 sm:p-10 select-none font-sans overflow-hidden">

    <!-- 1. TOP HEADER: SMART TV BOARD BRAND & TICKING TIME -->
    <header class="border-b border-slate-800 pb-6 flex flex-col sm:flex-row justify-between items-center gap-4">

      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <Tv class="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <p>statistiques actuelles du marché</p>
        </div>
        
      </div>

      <!-- Dynamic ticking digital clock block -->
      <div class="flex items-center gap-5 bg-slate-900 border border-slate-800 px-5 py-3 rounded-2xl">
        
        <div class="text-3xl  tracking-wider text-emerald-400  py-1 px-4 rounded-xl ">
          {{ timeStr || "17:03:00" }}
        </div>
      </div>

    </header>

    <!-- 2. CORE SCREEN CONTENT: SPLIT GRID -->
    <main class="grid grid-cols-1 lg:grid-cols-12 gap-8 my-8 flex-1">

      <!-- Left Section: Price indices shelf (Grid 7 cols) -->
      <section class="lg:col-span-7 space-y-6">
        

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            v-for="p in coreTrendingProducts"
            :key="p.id"
            class="bg-slate-900 border border-slate-800 p-4.5 rounded-2xl flex items-center gap-4 relative overflow-hidden group"
          >
            <img :src="p.image" class="w-16 h-16 rounded-xl object-cover shrink-0" />
            <div class="min-w-0 flex-1 space-y-1">
              <span class="text-[9.5px] font-black text-emerald-400 uppercase block tracking-wider">{{ p.category }}</span>
              <h3 class="text-xs sm:text-sm font-black text-white truncate">{{ p.name }}</h3>
              <p class="text-[10.5px] text-slate-400 font-bold truncate">Marché : {{ findMarket(p.marketId)?.city || 'Siyoni' }}</p>

              <div class="text-sm font-black text-yellow-400 flex items-baseline gap-1 py-0.5">
                {{ p.price.toLocaleString('fr-FR') }} BIF
                <span class="text-[10px] text-slate-500 font-medium font-mono">/ {{ p.unit }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Slogans and statistics counter horizontally -->
        <div class="grid grid-cols-3 gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-850 text-center">
          <div>
            <span class="text-[9.5px] text-slate-400 block font-bold">COMMERÇANTS ATTESTÉS</span>
            <strong class="text-xl font-bold text-emerald-400">{{ totalVendors }}</strong>
          </div>
          <div class="border-x border-slate-800">
            <span class="text-[9.5px] text-slate-400 block font-bold">MARCHÉS COUVERTS</span>
            <strong class="text-xl font-bold text-white">{{ markets.length }}</strong>
          </div>
          <div>
            <span class="text-[9.5px] text-slate-400 block font-bold">INDICES ACTIFS</span>
            <strong class="text-xl font-bold text-teal-400">{{ products.length }}</strong>
          </div>
        </div>
      </section>

      <!-- Right Section: Top Rated Commerçants Podium columns (Grid 5 cols) -->
      <section class="lg:col-span-5 space-y-6">

        <div class="border-b border-slate-800 pb-2">
          <h2 class="text-base sm:text-lg font-black uppercase tracking-wider text-emerald-400 flex items-center gap-2">
            <Sparkles class="w-5 h-5 text-yellow-400" />
            Opérateurs Exemplaires de la Semaine
          </h2>
        </div>

        <div class="space-y-4">
          <div
            v-for="(item, rank) in topRatedMerchants"
            :key="item.id"
            class="bg-gradient-to-r from-slate-900 to-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center gap-4 relative"
          >
            <!-- Badge position -->
            <div class="absolute -top-2.5 -right-2 bg-yellow-400 text-slate-950 font-black text-[9px] px-2.5 py-0.5 rounded shadow">
              LAURÉAT #{{ rank + 1 }}
            </div>

            <img :src="item.image" class="w-12 h-12 rounded-lg object-cover bg-slate-800 shrink-0" />

            <div class="min-w-0 flex-1 space-y-0.5 text-xs">
              <h4 class="text-sm font-black text-white truncate">{{ item.name }}</h4>
              <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{{ item.category }} • Étale {{ item.activePlaceId }}</p>
              <p class="text-[10px] text-slate-500 font-medium">Lieu : {{ findMarket(item.activeMarketId)?.name }}</p>

              <div class="flex items-center gap-1 text-yellow-400 pt-1">
                <Star class="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                <span class="text-[11px] font-extrabold text-slate-200">{{ item.rating }} Score Habilité</span>
              </div>
            </div>
          </div>
        </div>

      </section>

    </main>

    <!-- 3. FOOTER BULLETIN BANNER: AUTO-CYCLING TICK TAPE WITH MUNICIPAL ALERT -->
    <footer class="border-t border-slate-800 pt-6 space-y-4">

      

      <!-- Back navigation and informational credits -->
      <div class="flex flex-col sm:flex-row justify-between items-center text-[10.5px] text-slate-500 font-bold uppercase">
        <span>Plateforme Akaguriro LED Signage Engine v2.4</span>
        <button
          @click="setViewState('PUBLIC')"
          class="text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 pt-2 sm:pt-0"
        >
          <Eye class="w-4 h-4" />
          Fermer l'Aperçu LED et retourner au site web
        </button>
      </div>

    </footer>

  </div>
</template>
