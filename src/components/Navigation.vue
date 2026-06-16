<!--
  @license
  SPDX-License-Identifier: Apache-2.0
-->

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useApp } from '../composables/useApp.js';
import {
  Building2,
  ShoppingBag,
  User,
  LogOut,
  Menu,
  X,
  ShieldAlert,
  LayoutDashboard,
  Tv,
} from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();
const {
  currentUser,
  login,
  logout,
  publicTab,
  setPublicTab,
  setSelectedMarketId,
  setSelectedProductId,
  showToast,
} = useApp();

const isAdminRoute = computed(() => route.path.startsWith('/admin'));
const isLedRoute = computed(() => route.path === '/led');
const isPublicRoute = computed(() => !isAdminRoute.value && !isLedRoute.value);

const mobileMenuOpen = ref(false);
const globalSearchRaw = ref('');
const roleSwitcherOpen = ref(false);

const DEMO_EMAILS = {
  SUPER_ADMIN: 'admin@akaguriro.bi',
  ADMIN_MARCHE: 'admin.bujumbura@akaguriro.bi',
  COMMERCANT: 'commercant@akaguriro.bi',
};

async function handleRoleChange(role) {
  roleSwitcherOpen.value = false;

  if (role === 'VISITOR') {
    await logout();
    router.push('/');
    setPublicTab('home');
    return;
  }

  const email = DEMO_EMAILS[role];
  if (!email) return;

  try {
    await login(email, 'password');
    router.push('/admin');
  } catch {
    showToast('Connexion API impossible — vérifiez que le backend est démarré', 'error');
  }
}

function handleLogoClick() {
  router.push('/');
  setPublicTab('home');
  setSelectedMarketId(null);
  setSelectedProductId(null);
}

const publicPaths = {
  home: '/',
  markets: '/markets',
  products: '/products',
  merchants: '/merchants',
  auth: '/auth',
  request: '/request',
};

function handlePublicNav(tab) {
  router.push(publicPaths[tab] || '/');
  setPublicTab(tab);
  setSelectedMarketId(null);
  setSelectedProductId(null);
  mobileMenuOpen.value = false;
}

function goToAdmin() {
  router.push('/admin');
}

function goToLed() {
  router.push('/led');
}
</script>

<template>
  <header class="sticky top-0 z-50 w-full bg-slate-900 text-white shadow-md border-b border-slate-800">
    <!-- Simulation Banner & Config Switcher -->
    <div class="bg-emerald-600 text-[11.5px] font-medium tracking-wide py-1 text-center md:px-4 px-2 flex justify-between items-center select-none">
      <div class="flex items-center gap-1">
        <span class="inline-block w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
        <span><strong>DÉMO INTERACTIVE :</strong> Mode Actuel: <strong>{{ currentUser.role }}</strong> ({{ currentUser.name }})</span>
      </div>
      <div class="flex items-center gap-3">
        <button
          @click="roleSwitcherOpen = !roleSwitcherOpen"
          class="bg-slate-900/40 hover:bg-slate-900/70 border border-white/20 transition-all rounded px-2 py-0.5 text-xs flex items-center gap-1 font-bold"
        >
          <ShieldAlert class="w-3 h-3 text-yellow-300" />
          Changer de Rôle / Mode
        </button>
      </div>
    </div>

    <!-- Role Switcher Floating Panel -->
    <div
      v-if="roleSwitcherOpen"
      class="absolute top-10 right-2 md:right-8 bg-slate-800 border border-slate-700 rounded-lg shadow-2xl p-4 z-50 w-72 text-slate-100"
    >
      <div class="flex items-center justify-between pb-2 mb-2 border-b border-slate-700">
        <h4 class="text-xs font-bold uppercase tracking-wider text-emerald-400">Simulation de Rôles</h4>
        <button @click="roleSwitcherOpen = false" class="text-slate-400 hover:text-white">
          <X class="w-4 h-4" />
        </button>
      </div>
      <p class="text-[11px] text-slate-300 mb-3 leading-relaxed">
        Sélectionnez un profil pour tester les différentes vues et autorisations de la plateforme :
      </p>
      <div class="space-y-1.5 text-xs">
        <button
          @click="handleRoleChange('VISITOR')"
          class="w-full py-1.5 px-3 rounded text-left flex items-center justify-between transition-colors"
          :class="currentUser.role === 'VISITOR' && isPublicRoute ? 'bg-emerald-600 text-white' : 'bg-slate-700/50 hover:bg-slate-700'"
        >
          <span>👤 Visiteur Public (Anonyme)</span>
          <span v-if="currentUser.role === 'VISITOR'" class="text-[10px] bg-slate-900 px-1.5 py-0.2 rounded font-semibold text-emerald-300">Actif</span>
        </button>
        <button
          @click="handleRoleChange('COMMERCANT')"
          class="w-full py-1.5 px-3 rounded text-left flex items-center justify-between transition-colors"
          :class="currentUser.role === 'COMMERCANT' && isAdminRoute ? 'bg-emerald-600 text-white' : 'bg-slate-700/50 hover:bg-slate-700'"
        >
          <span>🏪 Commerçant (Anésie N.)</span>
          <span v-if="currentUser.role === 'COMMERCANT'" class="text-[10px] bg-slate-900 px-1.5 py-0.2 rounded font-semibold text-emerald-300">Actif</span>
        </button>
        <button
          @click="handleRoleChange('ADMIN_MARCHE')"
          class="w-full py-1.5 px-3 rounded text-left flex items-center justify-between transition-colors"
          :class="currentUser.role === 'ADMIN_MARCHE' && isAdminRoute ? 'bg-emerald-600 text-white' : 'bg-slate-700/50 hover:bg-slate-700'"
        >
          <span>🏢 Admin Marché (Pierre N.)</span>
          <span v-if="currentUser.role === 'ADMIN_MARCHE'" class="text-[10px] bg-slate-900 px-1.5 py-0.2 rounded font-semibold text-emerald-300">Actif</span>
        </button>
        <button
          @click="handleRoleChange('SUPER_ADMIN')"
          class="w-full py-1.5 px-3 rounded text-left flex items-center justify-between transition-colors"
          :class="currentUser.role === 'SUPER_ADMIN' && isAdminRoute ? 'bg-emerald-600 text-white' : 'bg-slate-700/50 hover:bg-slate-700'"
        >
          <span>🔑 Super Administrateur (Gilbert)</span>
          <span v-if="currentUser.role === 'SUPER_ADMIN'" class="text-[10px] bg-slate-900 px-1.5 py-0.2 rounded font-semibold text-emerald-300">Actif</span>
        </button>
      </div>

      <div class="border-t border-slate-700 py-1.5 mt-3 flex items-center justify-between">
        <span class="text-[11px] text-slate-300 font-medium">Bascule rapide d'écran :</span>
        <div class="flex gap-1">
          <button
            @click="router.push('/'); roleSwitcherOpen = false"
            class="p-1 rounded hover:bg-slate-700 text-slate-300 hover:text-white"
            :class="isPublicRoute ? 'text-emerald-400 font-bold' : ''"
            title="Secteur Public"
          >
            <ShoppingBag class="w-4 h-4 inline" />
          </button>
          <button
            @click="goToAdmin(); roleSwitcherOpen = false"
            class="p-1 rounded hover:bg-slate-700 text-slate-300 hover:text-white"
            :class="isAdminRoute ? 'text-emerald-400 font-bold' : ''"
            title="Espace Admin"
          >
            <LayoutDashboard class="w-4 h-4 inline" />
          </button>
          <button
            @click="goToLed(); roleSwitcherOpen = false"
            class="p-1 rounded hover:bg-slate-700 text-slate-300 hover:text-white"
            :class="isLedRoute ? 'text-emerald-400 font-bold' : ''"
            title="Écran LED Public"
          >
            <Tv class="w-4 h-4 inline" />
          </button>
        </div>
      </div>
    </div>

    <!-- Main Bar -->
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">

      <!-- Brand logo -->
      <div @click="handleLogoClick" class="flex items-center gap-2.5 cursor-pointer group shrink-0">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
          <Building2 class="w-5 h-5 text-slate-950" />
        </div>
        <div>
          <h1 class="text-[19px] font-extrabold tracking-tight font-display bg-gradient-to-r from-emerald-400 to-teal-300 text-transparent bg-clip-text">
            Akaguriro
          </h1>
          <p class="text-[9.5px] uppercase tracking-wider text-slate-400 font-semibold leading-none -mt-0.5">Smart Markets Burundi</p>
        </div>
      </div>

      <!-- Desktop Quick Nav Links -->
      <nav class="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-200">
        <button
          @click="handlePublicNav('home')"
          class="transition-colors py-1 hover:text-emerald-400"
          :class="isPublicRoute && publicTab === 'home' ? 'text-emerald-400 border-b-2 border-emerald-400' : ''"
        >
          Accueil
        </button>
        <button
          @click="handlePublicNav('markets')"
          class="transition-colors py-1 hover:text-emerald-400"
          :class="isPublicRoute && publicTab === 'markets' ? 'text-emerald-400 border-b-2 border-emerald-400' : ''"
        >
          Marchés
        </button>
        <button
          @click="handlePublicNav('products')"
          class="transition-colors py-1 hover:text-emerald-400"
          :class="isPublicRoute && publicTab === 'products' ? 'text-emerald-400 border-b-2 border-emerald-400' : ''"
        >
          Produits
        </button>
        <button
          @click="handlePublicNav('merchants')"
          class="transition-colors py-1 hover:text-emerald-400"
          :class="isPublicRoute && publicTab === 'merchants' ? 'text-emerald-400 border-b-2 border-emerald-400' : ''"
        >
          Commerçants
        </button>

        <template v-if="currentUser.role === 'VISITOR'">
          <button
            @click="handlePublicNav('auth')"
            class="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-4 py-1.5 rounded-lg text-xs transition-all shadow shadow-emerald-700/30"
          >
            Nous rejoindre (Connexion)
          </button>
        </template>
        <template v-else>
          <div class="flex items-center gap-2 pl-4 border-l border-slate-800">
            <button
              @click="goToAdmin"
              class="transition-all px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5"
              :class="isAdminRoute ? 'bg-slate-800 text-emerald-400' : 'bg-slate-800/40 hover:bg-slate-800 text-slate-300'"
            >
              <LayoutDashboard class="w-3.5 h-3.5 text-emerald-500" />
              Mon Espace Admin
            </button>
            <button
              @click="handleRoleChange('VISITOR')"
              class="p-1.5 text-slate-400 hover:text-red-400 rounded-lg transition-colors"
              title="Se déconnecter"
            >
              <LogOut class="w-4 h-4" />
            </button>
          </div>
        </template>
      </nav>

      <!-- Global actions: Screen Toggle & Mobile Menu -->
      <div class="flex items-center gap-2">
        <button
          @click="isLedRoute ? router.push('/') : goToLed()"
          class="hidden md:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all"
          :class="isLedRoute ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-800/50 text-slate-300 border-slate-700 hover:bg-slate-800'"
          title="Affichage Écran LED Public"
        >
          <Tv class="w-3.5 h-3.5" />
          Écran LED
        </button>

        <div class="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 rounded-full border border-slate-700/60 text-xs">
          <User class="w-3.5 h-3.5 text-emerald-400" />
          <span class="max-w-[70px] truncate hidden sm:inline text-slate-300">{{ currentUser.name.split(' ')[0] }}</span>
          <span class="px-1 text-[9px] font-bold bg-slate-900 rounded text-emerald-400 uppercase tracking-tight">{{ currentUser.role.replace('_', ' ') }}</span>
        </div>

        <button
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="lg:hidden p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X v-if="mobileMenuOpen" class="w-6 h-6" />
          <Menu v-else class="w-6 h-6" />
        </button>
      </div>

    </div>

    <!-- Mobile Drawer Navigation Menu -->
    <div
      v-if="mobileMenuOpen"
      class="lg:hidden block bg-slate-900 border-t border-slate-800 px-4 py-4 space-y-3 absolute top-[90px] left-0 w-full shadow-2xl z-40 animate-fadeIn text-slate-200"
    >
      <div class="space-y-1">
        <button
          @click="handlePublicNav('home')"
          class="w-full py-2.5 px-3 rounded-lg text-left font-medium block"
          :class="isPublicRoute && publicTab === 'home' ? 'bg-slate-800 text-emerald-400' : 'hover:bg-slate-800'"
        >
          Accueil du portail
        </button>
        <button
          @click="handlePublicNav('markets')"
          class="w-full py-2.5 px-3 rounded-lg text-left font-medium block"
          :class="isPublicRoute && publicTab === 'markets' ? 'bg-slate-800 text-emerald-400' : 'hover:bg-slate-800'"
        >
          Marchés du Burundi
        </button>
        <button
          @click="handlePublicNav('products')"
          class="w-full py-2.5 px-3 rounded-lg text-left font-medium block"
          :class="isPublicRoute && publicTab === 'products' ? 'bg-slate-800 text-emerald-400' : 'hover:bg-slate-800'"
        >
          Produits en vente
        </button>
        <button
          @click="handlePublicNav('merchants')"
          class="w-full py-2.5 px-3 rounded-lg text-left font-medium block"
          :class="isPublicRoute && publicTab === 'merchants' ? 'bg-slate-800 text-emerald-400' : 'hover:bg-slate-800'"
        >
          Commerçants actifs
        </button>
        <button
          @click="goToLed(); mobileMenuOpen = false"
          class="w-full py-2.5 px-3 rounded-lg text-left font-medium flex items-center gap-2 border border-slate-800 text-blue-400"
          :class="isLedRoute ? 'bg-slate-800' : 'hover:bg-slate-800'"
        >
          <Tv class="w-4 h-4" />
          Écran publicitaire LED de marché
        </button>
      </div>

      <div class="border-t border-slate-800 pt-3">
        <template v-if="currentUser.role === 'VISITOR'">
          <button
            @click="handlePublicNav('auth')"
            class="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 rounded-lg text-center text-xs block transition-all"
          >
            S'enregistrer / Connexion
          </button>
        </template>
        <template v-else>
          <div class="space-y-2">
            <button
              @click="goToAdmin(); mobileMenuOpen = false"
              class="w-full bg-slate-800 hover:bg-slate-700 text-emerald-400 font-semibold py-2 rounded-lg text-center text-xs flex items-center justify-center gap-2 transition-all"
            >
              <LayoutDashboard class="w-4 h-4" />
              Aller au Dashboard Administratif
            </button>
            <button
              @click="handleRoleChange('VISITOR'); mobileMenuOpen = false"
              class="w-full bg-red-950/20 text-red-400 hover:bg-red-950/40 font-semibold py-2 rounded-lg text-center text-xs flex items-center justify-center gap-2 transition-all"
            >
              <LogOut class="w-3.5 h-3.5" />
              Se déconnecter
            </button>
          </div>
        </template>
      </div>
    </div>
  </header>
</template>
