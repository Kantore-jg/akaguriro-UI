/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

<script setup>
import { useRouter } from 'vue-router';
import { useLedDisplay } from '../composables/useLedDisplay.js';
import { getAdministrativeLocationLabel } from '../utils/burundiLocations.js';
import {
  Tv,
  TrendingUp,
  Volume2,
  Eye,
  Sparkles,
  RefreshCw,
  MapPin,
  AlertCircle,
} from 'lucide-vue-next';

const router = useRouter();

const {
  markets,
  selectedMarketId,
  selectMarket,
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
} = useLedDisplay();

const formatRefreshTime = (date) =>
  date ? date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '—';
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-6 sm:p-10 select-none font-sans overflow-hidden">

    <!-- HEADER -->
    <header class="border-b border-slate-800 pb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <Tv class="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h1 class="text-sm font-black uppercase tracking-widest text-white">AKAGURIRO LED</h1>
          <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            {{ currentMarket?.name || 'Chargement...' }}
          </p>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <!-- Sélecteur de marché -->
        <div v-if="markets.length > 1" class="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl">
          <MapPin class="w-4 h-4 text-emerald-400 shrink-0" />
          <select
            :value="selectedMarketId"
            class="bg-transparent text-xs font-bold text-slate-200 outline-none cursor-pointer"
            @change="selectMarket(Number($event.target.value))"
          >
            <option v-for="m in markets" :key="m.id" :value="m.id" class="bg-slate-900">
              {{ m.name }}
            </option>
          </select>
        </div>

        <!-- Horloge + statut live -->
        <div class="flex items-center gap-4 bg-slate-900 border border-slate-800 px-5 py-3 rounded-2xl">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span class="text-[9px] font-bold text-emerald-400 uppercase">Live</span>
          </div>
          <div class="text-2xl tracking-wider text-emerald-400 font-mono">
            {{ timeStr }}
          </div>
        </div>
      </div>
    </header>

    <!-- ERREUR -->
    <div
      v-if="error"
      class="my-4 flex items-center gap-3 bg-red-950/50 border border-red-800 text-red-300 px-4 py-3 rounded-xl text-xs font-bold"
    >
      <AlertCircle class="w-4 h-4 shrink-0" />
      <span class="flex-1">{{ error }}</span>
      <button
        class="flex items-center gap-1 text-red-200 hover:text-white"
        @click="loadDisplay"
      >
        <RefreshCw class="w-3.5 h-3.5" />
        Réessayer
      </button>
    </div>

    <!-- CONTENU PRINCIPAL -->
    <main class="grid grid-cols-1 lg:grid-cols-12 gap-8 my-8 flex-1">

      <!-- Produits tendances -->
      <section class="lg:col-span-7 space-y-6">
        <div class="border-b border-slate-800 pb-2">
          <h2 class="text-base sm:text-lg font-black uppercase tracking-wider text-emerald-400 flex items-center gap-2">
            <TrendingUp class="w-5 h-5" />
            Indices Prix — Produits Tendances
          </h2>
        </div>

        <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div v-for="i in 4" :key="i" class="bg-slate-900 border border-slate-800 p-4 rounded-2xl h-24 animate-pulse"></div>
        </div>

        <div v-else-if="trendingProducts.length" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            v-for="p in trendingProducts"
            :key="p.id"
            class="bg-slate-900 border border-slate-800 p-4.5 rounded-2xl flex items-center gap-4 relative overflow-hidden"
          >
            <img :src="p.image" :alt="p.name" class="w-16 h-16 rounded-xl object-cover shrink-0" />
            <div class="min-w-0 flex-1 space-y-1">
              <span class="text-[9.5px] font-black text-emerald-400 uppercase block tracking-wider">{{ p.category }}</span>
              <h3 class="text-xs sm:text-sm font-black text-white truncate">{{ p.name }}</h3>
              <p class="text-[10.5px] text-slate-400 font-bold truncate">
                {{ getAdministrativeLocationLabel(currentMarket) || 'Burundi' }}
              </p>
              <div class="text-sm font-black text-yellow-400 flex items-baseline gap-1">
                {{ p.price.toLocaleString('fr-FR') }} BIF
                <span class="text-[10px] text-slate-500 font-medium font-mono">/ {{ p.unit }}</span>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center text-slate-500 text-sm font-bold">
          Aucun produit tendance pour ce marché
        </div>

        <!-- Statistiques marché -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800 text-center">
          <div>
            <span class="text-[9px] text-slate-400 block font-bold">COMMERÇANTS</span>
            <strong class="text-xl font-bold text-emerald-400">{{ statistics.merchants_count }}</strong>
          </div>
          <div>
            <span class="text-[9px] text-slate-400 block font-bold">PRODUITS ACTIFS</span>
            <strong class="text-xl font-bold text-white">{{ statistics.products_count }}</strong>
          </div>
          <div>
            <span class="text-[9px] text-slate-400 block font-bold">PLACES OCCUPÉES</span>
            <strong class="text-xl font-bold text-teal-400">{{ statistics.occupied_places }}/{{ statistics.total_places }}</strong>
          </div>
          <div>
            <span class="text-[9px] text-slate-400 block font-bold">TAUX OCCUPATION</span>
            <strong class="text-xl font-bold text-yellow-400">{{ statistics.occupancy_rate }}%</strong>
          </div>
        </div>
      </section>

      <!-- Top commerçants -->
      <section class="lg:col-span-5 space-y-6">
        <div class="border-b border-slate-800 pb-2">
          <h2 class="text-base sm:text-lg font-black uppercase tracking-wider text-emerald-400 flex items-center gap-2">
            <Sparkles class="w-5 h-5 text-yellow-400" />
            Commerçants actifs
          </h2>
        </div>

        <div v-if="loading" class="space-y-4">
          <div v-for="i in 3" :key="i" class="bg-slate-900 border border-slate-800 p-4 rounded-2xl h-20 animate-pulse"></div>
        </div>

        <div v-else-if="topMerchants.length" class="space-y-4">
          <div
            v-for="(item, rank) in topMerchants"
            :key="item.id"
            class="bg-gradient-to-r from-slate-900 to-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center gap-4 relative"
          >
            <div class="absolute -top-2.5 -right-2 bg-yellow-400 text-slate-950 font-black text-[9px] px-2.5 py-0.5 rounded shadow">
              LAURÉAT #{{ rank + 1 }}
            </div>
            <img :src="item.image" :alt="item.name" class="w-12 h-12 rounded-lg object-cover bg-slate-800 shrink-0" />
            <div class="min-w-0 flex-1 space-y-0.5 text-xs">
              <h4 class="text-sm font-black text-white truncate">{{ item.name }}</h4>
              <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                {{ item.category }} • Étale {{ item.activePlaceId }}
              </p>
              <p class="text-[10px] text-slate-500 font-medium">{{ item.productsCount }} produit(s) actif(s)</p>
            </div>
          </div>
        </div>

        <div v-else class="bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center text-slate-500 text-sm font-bold">
          Aucun commerçant actif pour ce marché
        </div>
      </section>
    </main>

    <!-- FOOTER — bandeau défilant -->
    <footer class="border-t border-slate-800 pt-6 space-y-4">
      <div class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex items-center">
        <div class="bg-emerald-500 text-slate-950 px-3 py-2 flex items-center gap-1.5 shrink-0">
          <Volume2 class="w-4 h-4" />
          <span class="text-[9px] font-black uppercase">Info</span>
        </div>
        <div class="flex-1 px-4 py-2 overflow-hidden">
          <p
            :key="activeAlertIndex"
            class="text-xs font-bold text-slate-200 truncate animate-in fade-in duration-500"
          >
            {{ bulletins[activeAlertIndex] }}
          </p>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-500 font-bold uppercase gap-2">
        <span class="flex items-center gap-2">
          Akaguriro LED Engine
          <span v-if="lastRefresh" class="text-slate-600 normal-case">
            — MAJ {{ formatRefreshTime(lastRefresh) }}
          </span>
        </span>
        <button
          class="text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5"
          @click="router.push('/')"
        >
          <Eye class="w-4 h-4" />
          Retour au portail
        </button>
      </div>
    </footer>
  </div>
</template>
