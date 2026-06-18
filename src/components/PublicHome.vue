<!--
  @license
  SPDX-License-Identifier: Apache-2.0
-->

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useApp } from '../composables/useApp.js';
import { usePublicNavigation } from '../composables/usePublicNavigation.js';

const router = useRouter();
import {
  Search,
  MapPin,
  TrendingUp,
  Store,
  Users,
  Package,
  LayoutGrid,
  ChevronRight,
  CheckCircle,
  Sparkles,
} from 'lucide-vue-next';

const {
  markets,
  products,
  merchants,
} = useApp();

const { goToTab, goToMarket, goToProduct } = usePublicNavigation();

const searchQuery = ref('');
const searchCategory = ref('all');
const searchMarket = ref('all');

const totalMarketsCount = computed(() => markets.value.length);
const totalMerchantsCount = computed(() => merchants.value.length);
const totalProductsCount = computed(() => products.value.length);
const totalAvailablePlaces = computed(() =>
  markets.value.reduce((sum, m) => sum + (m.totalPlaces - m.occupiedPlaces), 0)
);

const categories = computed(() => [
  { name: 'Poissons', icon: '🐟', count: products.value.filter(p => p.category === 'Poissons').length },
  { name: 'Café & Thé', icon: '☕', count: products.value.filter(p => p.category === 'Café & Thé').length },
  { name: 'Fruits & Légumes', icon: '🥑', count: products.value.filter(p => p.category === 'Fruits & Légumes').length },
  { name: 'Vivres', icon: '🌾', count: products.value.filter(p => p.category === 'Vivres').length },
  { name: 'Textiles', icon: '👕', count: products.value.filter(p => p.category === 'Textiles').length },
]);

function handleHeroSearchSubmit(e) {
  e.preventDefault();
  goToTab('products');
}
</script>

<template>
  <div class="space-y-16 pb-20">

    <!-- 1. HERO SECTION -->
    <!-- <section class="relative overflow-hidden bg-slate-900 text-white py-12 lg:py-24 px-4 sm:px-6 lg:px-8">
      <div class="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_30%,#000_70%,transparent_100%)] opacity-35" />

      <div class="relative mx-auto max-w-7xl">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          <div class="lg:col-span-7 space-y-6">
            

            <h2 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.1] font-display">
              Retrouvez facilement les <span class="bg-gradient-to-r from-primary-400 to-primary-300 text-transparent bg-clip-text">produits</span> et <span class="bg-gradient-to-r from-teal-300 to-emerald-400 text-transparent bg-clip-text">commerçants</span> du Burundi
            </h2>

            <p class="text-slate-300 text-base sm:text-lg max-w-xl leading-relaxed">
              Akaguriro digitalise les marchés de Bujumbura, Gitega, Ngozi et Rumonge. Explorez l'emplacement exact des étals, comparez les prix nationaux en temps réel et contactez directement les marchands locaux.
            </p>

            <form @submit="handleHeroSearchSubmit" class="bg-slate-800/90 border border-slate-700/60 p-2 rounded-2xl shadow-2xl max-w-2xl flex flex-col sm:flex-row gap-2 transition-all">
              <div class="flex-1 flex items-center gap-2 px-3 py-2 bg-slate-900/60 rounded-xl">
                <Search class="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Chercher un produit (ex. Mukeke, Avocat...)"
                  v-model="searchQuery"
                  class="w-full bg-transparent border-0 text-white text-sm outline-none placeholder:text-slate-500"
                />
              </div>

              <div class="sm:w-44 flex items-center gap-2 px-3 py-2 bg-slate-900/60 rounded-xl text-xs text-slate-300">
                <MapPin class="w-4 h-4 text-primary shrink-0" />
                <select
                  v-model="searchMarket"
                  class="bg-transparent border-0 outline-none w-full cursor-pointer text-slate-300 font-medium"
                >
                  <option value="all" class="bg-slate-800 text-white">Tous Marchés</option>
                  <option v-for="m in markets" :key="m.id" :value="m.id" class="bg-slate-800 text-white">{{ m.city }}</option>
                </select>
              </div>

              <button
                type="submit"
                class="bg-gradient-to-r from-primary-500 to-primary-500 hover:from-primary-600 hover:to-primary-600 font-bold px-6 py-3 rounded-xl text-slate-950 text-sm transition-all shadow-lg hover:scale-[1.01]"
              >
                Trouver
              </button>
            </form>

            <div class="flex flex-wrap items-center gap-6 text-xs text-slate-400 pt-2 font-medium">
              <span class="flex items-center gap-1.5"><CheckCircle class="w-4 h-4 text-primary" /> Éclairage LED Intelligent</span>
              <span class="flex items-center gap-1.5"><CheckCircle class="w-4 h-4 text-primary" /> Plans Indoor Interactifs</span>
              <span class="flex items-center gap-1.5"><CheckCircle class="w-4 h-4 text-primary" /> Catalogues Commerçants Vérifiés</span>
            </div>
          </div>

          <div class="lg:col-span-5 relative">
            <div class="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary-500 to-primary-500 opacity-20 blur-xl"></div>
            <div class="relative rounded-2xl overflow-hidden border border-slate-700 aspect-[4/3] shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=650"
                alt="Marché Africain Moderne"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              
            </div>
          </div>

        </div>
      </div>
    </section> -->

    <!-- 2. CATEGORIES INSPIRATION BAR -->
    <section class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <!-- <h3 class="text-sm font-bold text-primary uppercase tracking-wider">Filières Actives</h3> -->
          <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-display">Explorer par Catégories</h2>
        </div>
        <button
          @click="goToTab('products')"
          class="text-xs font-bold text-primary hover:text-primary flex items-center gap-1.5 self-start"
        >
          Tous les produits
          <ChevronRight class="w-4 h-4" />
        </button>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div
          v-for="(cat, idx) in categories"
          :key="idx"
          @click="goToTab('products')"
          class="bg-white hover:bg-primary/5/40 p-4 rounded-2xl border border-slate-100 hover:border-primary/20 transition-all cursor-pointer shadow-sm flex flex-col items-center text-center group"
        >
          <span class="text-3xl mb-2.5 group-hover:scale-110 transition-transform duration-200">{{ cat.icon }}</span>
          <h5 class="text-xs sm:text-sm font-bold text-slate-800">{{ cat.name }}</h5>
          <p class="text-[11px] text-slate-400 mt-1 font-medium">{{ cat.count }} articles en vente</p>
        </div>
      </div>
    </section>

    <!-- 3. POPULAR MARKETS SECTION -->
    <section class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <!-- <h3 class="text-sm font-bold text-primary uppercase tracking-wider">Infrastructures du Pays</h3> -->
          <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-display">Nos Marchés Publics Connectés</h2>
        </div>
        <button
          @click="goToTab('markets')"
          class="text-xs font-bold text-primary hover:text-primary flex items-center gap-1.5 self-start"
        >
          Afficher la liste complète
          <ChevronRight class="w-4 h-4" />
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="m in markets"
          :key="m.id"
          class="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col group"
        >
          <div class="relative h-44 w-full overflow-hidden">
            <img
              :src="m.image"
              :alt="m.name"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <!-- <div class="absolute top-3 left-3 bg-slate-900/80 text-white font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1 backdrop-blur-sm">
              <MapPin class="w-3 h-3 text-primary" />
              {{ m.city }}
            </div> -->
          </div>

          <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
            <div class="space-y-2">
              <h4 class="text-base font-extrabold text-slate-900 tracking-tight leading-snug group-hover:text-primary transition-colors">
                {{ m.name }}
              </h4>
              <p class="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {{ m.description }}
              </p>
            </div>

            <div class="space-y-3 pt-2">
              <div class="grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-600 border-t border-slate-100 pt-3">
                <div>
                  <span class="text-slate-400 block text-[10px]">CO-LOCATAIRES :</span>
                  <span class="text-slate-900 text-xs font-bold">{{ m.occupiedPlaces }} actifs</span>
                </div>
                <div>
                  <span class="text-slate-400 block text-[10px]">PLACES LIBRES :</span>
                  <span
                    class="text-xs font-bold"
                    :class="(m.totalPlaces - m.occupiedPlaces) > 0 ? 'text-primary' : 'text-amber-600'"
                  >
                    {{ m.totalPlaces - m.occupiedPlaces }} dispos
                  </span>
                </div>
              </div>

              <button
                @click="goToMarket(m.id)"
                class="w-full bg-background hover:bg-primary/5 hover:text-primary text-slate-700 font-bold transition-all py-2 rounded-xl text-xs flex items-center justify-center gap-1 border border-slate-100"
              >
                Visiter le Marché
                <ChevronRight class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 4. STATISTICS PANEL -->
    <section class="bg-slate-100/70 border-y border-slate-200/50 py-12 px-4">
      <div class="mx-auto max-w-7xl">
        <div class="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <h3 class="text-sm font-bold text-primary uppercase tracking-wider">Indicateurs Digitaux</h3>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">La Smart City en Chiffres</h2>
          <p class="text-slate-500 text-xs sm:text-sm">
            Suivi statistique réactif de nos places d'étalage et flux de produits nationaux.
          </p>
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">

          <div class="bg-white p-6 rounded-2xl border border-slate-200/40 shadow-sm flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
              <Store class="w-6 h-6" />
            </div>
            <div>
              <span class="text-[11px] text-slate-400 block font-semibold uppercase">Marchés Digitalisés</span>
              <span class="text-2xl font-extrabold text-slate-900">{{ totalMarketsCount }}</span>
              <span class="text-[10px] text-primary block font-semibold">100% de fiabilité</span>
            </div>
          </div>

          <div class="bg-white p-6 rounded-2xl border border-slate-200/40 shadow-sm flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Users class="w-6 h-6" />
            </div>
            <div>
              <span class="text-[11px] text-slate-400 block font-semibold uppercase">Commerçants Enregistrés</span>
              <span class="text-2xl font-extrabold text-slate-900">{{ totalMerchantsCount }}</span>
              <span class="text-[10px] text-primary block font-semibold">+4 recrutés ce mois</span>
            </div>
          </div>

          <div class="bg-white p-6 rounded-2xl border border-slate-200/40 shadow-sm flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <Package class="w-6 h-6" />
            </div>
            <div>
              <span class="text-[11px] text-slate-400 block font-semibold uppercase">Produits en Ligne</span>
              <span class="text-2xl font-extrabold text-slate-900">{{ totalProductsCount }}</span>
              <span class="text-[10px] text-primary block font-semibold">Mis à jour régulièrement</span>
            </div>
          </div>

          <div class="bg-white p-6 rounded-2xl border border-slate-200/40 shadow-sm flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
              <LayoutGrid class="w-6 h-6" />
            </div>
            <div>
              <span class="text-[11px] text-slate-400 block font-semibold uppercase">Emplacements Libres</span>
              <span class="text-2xl font-extrabold text-slate-900 text-primary">{{ totalAvailablePlaces }}</span>
              <span class="text-[10px] text-amber-500 block font-semibold">Disponibles à la demande</span>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- 5. TRENDING PRODUCTS SECTION -->
    <section class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h3 class="text-sm font-bold text-primary uppercase tracking-wider">Catalogue National</h3>
          <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-display">Produits Tendances</h2>
        </div>
        <button
          @click="goToTab('products')"
          class="text-xs font-bold text-primary hover:text-primary flex items-center gap-1.5 self-start"
        >
          Explorer tout le catalogue
          <ChevronRight class="w-4 h-4" />
        </button>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        <div
          v-for="p in products.slice(0, 4)"
          :key="p.id"
          @click="goToProduct(p.id)"
          class="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer p-3.5 space-y-3 group"
        >
          <div class="relative rounded-xl overflow-hidden bg-background aspect-square">
            <img
              :src="p.image"
              :alt="p.name"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <span
              v-if="p.isTrending"
              class="absolute top-2.5 left-2.5 bg-yellow-400 text-slate-900 font-extrabold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center gap-0.5 shadow-sm"
            >
              <TrendingUp class="w-3 h-3" />
              Tendance
            </span>
            <span
              v-if="p.stock <= 5"
              class="absolute bottom-2.5 right-2.5 bg-red-100 text-red-700 font-bold text-[9px] px-2 py-0.5 rounded border border-red-200"
            >
              Stock Faible
            </span>
          </div>

          <div class="space-y-1">
            <span class="text-[10px] font-bold text-primary uppercase tracking-wide">
              {{ p.category }}
            </span>
            <h4 class="text-xs sm:text-sm font-extrabold text-slate-800 line-clamp-1 group-hover:text-primary transition-colors">
              {{ p.name }}
            </h4>
            <p class="text-[11px] text-slate-400 font-medium">
              {{ markets.find(m => m.id === p.marketId)?.city }} • Étale {{ p.placeNumber }}
            </p>
          </div>

          <div class="border-t border-slate-50 pt-2.5 flex items-center justify-between">
            <div>
              <span class="text-xs sm:text-sm font-extrabold text-primary">
                {{ p.price.toLocaleString('fr-FR') }} BIF
              </span>
              <span class="text-[9.5px] text-slate-400 ml-1">/ {{ p.unit }}</span>
            </div>
            <span class="text-[10px] font-bold bg-background text-slate-600 px-2 py-1 rounded-lg hover:bg-primary group-hover:bg-primary group-hover:text-white transition-colors">
              Détails
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- 6. PROMOTIONAL SUB-HERO FOR MERCHANTS -->
    <section class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- <div class="bg-gradient-to-r from-teal-900 to-emerald-900 rounded-3xl p-8 sm:p-12 relative overflow-hidden text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8"> -->
        
        <div class="shrink-0 flex flex-col sm:flex-row gap-3 relative w-full sm:w-auto">
          <button
            @click="goToTab('request')"
            class="bg-primary hover:bg-emerald-400 transition-all text-slate-950 font-bold px-5 py-3 rounded-xl text-xs sm:text-sm shadow-md text-center"
          >
            Demander une place
          </button>
          <button
            @click="router.push('/login')"
            class="bg-primary hover:bg-emerald-400 transition-all text-slate-950 font-bold px-5 py-3 rounded-xl text-xs sm:text-sm shadow-md text-center"
          >
            Créer mon compte
          </button>
        </div>
      <!-- </div> -->
    </section>

  </div>
</template>
