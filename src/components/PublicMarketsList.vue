/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

<script setup>
import { ref, computed } from 'vue';
import { useApp } from '../composables/useApp.js';
import { usePublicNavigation } from '../composables/usePublicNavigation.js';
import { MapPin, Search, ChevronRight, CheckCircle } from 'lucide-vue-next';

const { markets } = useApp();
const { goToMarket } = usePublicNavigation();

const searchQuery = ref('');
const selectedCity = ref('all');

const cities = ['all', 'Bujumbura', 'Gitega', 'Ngozi', 'Rumonge'];

const filteredMarkets = computed(() =>
  markets.value.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          m.location.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesCity = selectedCity.value === 'all' || m.city.toLowerCase() === selectedCity.value.toLowerCase();
    return matchesSearch && matchesCity;
  })
);

function resetFilters() {
  searchQuery.value = '';
  selectedCity.value = 'all';
}
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    <!-- Header -->
    <div class="space-y-2">
      <!-- <h3 class="text-xs font-bold uppercase tracking-wider text-primary">Plateforme Nationale</h3> -->
      <h1 class="text-2xl font-extrabold tracking-tight text-slate-900">
        Marchés Publics Numérisés du Burundi
      </h1>
    </div>

    <!-- Filters & Search Panel -->
    <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">

      <!-- Search -->
      <div class="w-full md:w-96 flex items-center gap-2 px-3 py-2 bg-background border border-slate-200/60 rounded-xl focus-within:border-primary/30 focus-within:bg-white transition-all">
        <Search class="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Rechercher un marché par nom, adresse..."
          v-model="searchQuery"
          class="bg-transparent border-0 outline-none text-xs w-full text-slate-700"
        />
      </div>

      <!-- City Filter pills -->
      <div class="w-full md:w-auto flex flex-wrap gap-1.5 self-start md:self-auto">
        <button
          v-for="city in cities"
          :key="city"
          @click="selectedCity = city"
          class="px-3 py-1.5 rounded-full text-xs font-bold transition-all border"
          :class="selectedCity === city
            ? 'bg-slate-900 text-white border-slate-900'
            : 'bg-background text-slate-600 border-slate-200/50 hover:bg-slate-100'"
        >
          {{ city === 'all' ? ' Tous les Marchés' : city }}
        </button>
      </div>

    </div>

    <!-- List / Cards Layout -->
    <div v-if="filteredMarkets.length === 0" class="text-center py-12 bg-white border border-dashed border-slate-200 rounded-3xl p-8">
      <p class="text-slate-400 text-sm mb-2">Aucun marché ne correspond à vos critères de recherche.</p>
      <button
        @click="resetFilters"
        class="text-primary font-bold text-xs"
      >
        Réinitialiser les filtres
      </button>
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="m in filteredMarkets"
        :key="m.id"
        class="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all p-5 flex flex-col md:flex-row gap-5 group"
      >
        <!-- Left: Thumbnail image -->
        <div class="w-full md:w-44 h-40 rounded-2xl overflow-hidden shrink-0 relative bg-background">
          <img
            :src="m.image"
            :alt="m.name"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <!-- <span class="absolute top-2.5 left-2.5 bg-slate-900/80 text-white text-[9px] font-bold uppercase py-0.5 px-2 rounded-full backdrop-blur-sm shadow-sm">
            {{ m.city }}
          </span> -->
        </div>

        <!-- Right: Core parameters -->
        <div class="flex-1 flex flex-col justify-between space-y-4">
          <div class="space-y-1.5">
            <h2 class="text-base sm:text-lg font-extrabold text-slate-900 group-hover:text-primary transition-colors">
              {{ m.name }}
            </h2>
            <p class="text-xs text-slate-400 font-medium flex items-center gap-1">
              <MapPin class="w-3.5 h-3.5 text-primary shrink-0" />
              {{ m.location }}
            </p>
            <p class="text-xs text-slate-500 line-clamp-2 leading-relaxed pt-1 font-medium">
              {{ m.description }}
            </p>
          </div>

          <!-- Progress gauge and actions -->
          <div class="space-y-3.5">
            <!-- Occupancy state -->
            <div class="space-y-1.5 border-t border-slate-50 pt-3">
              <div class="flex justify-between items-center text-[11px] font-bold">
                <span class="text-slate-400">TAUX D'OCCUPATION :</span>
                <span class="text-slate-800">{{ m.occupiedPlaces }} / {{ m.totalPlaces }} places ({{ m.totalPlaces ? Math.round((m.occupiedPlaces / m.totalPlaces) * 100) : 0 }}%)</span>
              </div>
              <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-500"
                  :class="(m.totalPlaces && Math.round((m.occupiedPlaces / m.totalPlaces) * 100) > 80) ? 'bg-amber-500' : 'bg-primary'"
                  :style="{ width: `${m.totalPlaces ? Math.round((m.occupiedPlaces / m.totalPlaces) * 100) : 0}%` }"
                ></div>
              </div>
            </div>

            <!-- Product categories -->
            <div v-if="m.productCategories?.length" class="flex flex-wrap gap-1">
              <span
                v-for="(category, i) in m.productCategories"
                :key="i"
                class="text-[9.5px] font-bold text-slate-500 bg-background px-2 py-0.5 rounded-md border border-slate-100/50"
              >
                {{ category }}
              </span>
            </div>

            <!-- Button -->
            <button
              @click="goToMarket(m.id)"
              class="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-all flex items-center justify-center gap-1 shadow-sm"
            >
              Consulter le plan interactif
              <ChevronRight class="w-4 h-4 text-primary" />
            </button>
          </div>
        </div>

      </div>
    </div>

    

  </div>
</template>
