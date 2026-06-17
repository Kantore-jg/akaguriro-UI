<!--
  @license
  SPDX-License-Identifier: Apache-2.0
-->

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useApp } from '../composables/useApp.js';
import { usePublicNavigation } from '../composables/usePublicNavigation.js';
import {
  Building2,
  ShoppingBag,
  User,
  LogOut,
  Menu,
  X,
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
  showToast,
} = useApp();

const { goHome, goToTab } = usePublicNavigation();

const ADMIN_ROLES = ['SUPER_ADMIN', 'ADMIN_MARCHE', 'COMMERCANT'];

const isAdminRoute = computed(() => route.path.startsWith('/admin'));
const isLedRoute = computed(() => route.path === '/led');
const isProfileRoute = computed(() => route.path === '/profile');
const isPublicRoute = computed(() => !isAdminRoute.value && !isLedRoute.value && !isProfileRoute.value);
const isLoggedIn = computed(() => Boolean(currentUser.value?.id));
const canAccessAdmin = computed(() => ADMIN_ROLES.includes(currentUser.value?.role));
const userInitials = computed(() => {
  const name = currentUser.value?.name || 'U';
  return name.substring(0, 2).toUpperCase();
});

const mobileMenuOpen = ref(false);
const roleSwitcherOpen = ref(false);

const DEMO_EMAILS = {
  SUPER_ADMIN: 'admin@akaguriro.bi',
  ADMIN_MARCHE: 'admin.bujumbura@akaguriro.bi',
  COMMERCANT: 'commercant@akaguriro.bi',
};

const navItems = [
  { id: 'home', label: 'Accueil', path: '/' },
  { id: 'markets', label: 'Marchés', path: '/markets' },
  { id: 'products', label: 'Produits', path: '/products' },
  { id: 'merchants', label: 'Commerçants', path: '/merchants' },
];

async function handleRoleChange(role) {
  roleSwitcherOpen.value = false;

  if (role === 'VISITOR') {
    await logout();
    router.push('/');
    goToTab('home');
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
  goHome();
}

function handlePublicNav(tab) {
  if (tab === 'auth') {
    router.push('/login');
  } else {
    goToTab(tab);
  }
  mobileMenuOpen.value = false;
}

function goToAdmin() {
  router.push('/admin');
}

function goToLed() {
  router.push('/led');
}

function goToProfile() {
  router.push('/profile');
  mobileMenuOpen.value = false;
}
</script>

<template>
  <header class="sticky top-0 z-50 w-full bg-card text-foreground shadow-sm border-b border-border">
    <div
      v-if="roleSwitcherOpen"
      class="absolute top-14 right-4 bg-card border border-border rounded-xl shadow-xl p-4 z-50 w-72"
    >
      <div class="flex items-center justify-between pb-2 mb-2 border-b border-border">
        <h4 class="text-xs font-bold uppercase tracking-wider text-primary">Simulation de Rôles</h4>
        <button @click="roleSwitcherOpen = false" class="text-muted-foreground hover:text-foreground">
          <X class="w-4 h-4" />
        </button>
      </div>
      <div class="space-y-1.5 text-xs">
        <button
          v-for="(role, label) in [
            ['VISITOR', '👤 Visiteur Public'],
            ['COMMERCANT', '🏪 Commerçant'],
            ['ADMIN_MARCHE', '🏢 Admin Marché'],
            ['SUPER_ADMIN', '🔑 Super Admin'],
          ]"
          :key="role[0]"
          @click="handleRoleChange(role[0])"
          class="w-full py-2 px-3 rounded-lg text-left transition-colors"
          :class="currentUser.role === role[0] ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'"
        >
          {{ role[1] }}
        </button>
      </div>
    </div>

    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-14">
        <div @click="handleLogoClick" class="flex items-center gap-2.5 cursor-pointer group shrink-0">
          <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <Building2 class="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 class="text-base font-bold tracking-tight text-primary">AKAGURIRO</h1>
            <p class="text-[9px] uppercase tracking-wider text-muted-foreground font-medium leading-none">Smart Markets Burundi</p>
          </div>
        </div>

        <nav class="hidden lg:flex items-center gap-1">
          <button
            v-for="item in navItems"
            :key="item.id"
            @click="handlePublicNav(item.id)"
            class="px-4 py-2 text-sm font-medium transition-colors relative"
            :class="isPublicRoute && publicTab === item.id
              ? 'text-primary'
              : 'text-muted-foreground hover:text-foreground'"
          >
            {{ item.label }}
            <span
              v-if="isPublicRoute && publicTab === item.id"
              class="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full"
            />
          </button>
        </nav>

        <div class="flex items-center gap-2">
          <button
            @click="isLedRoute ? router.push('/') : goToLed()"
            class="hidden md:flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border border-border hover:bg-accent transition-colors"
            :class="isLedRoute ? 'bg-primary text-primary-foreground border-primary' : 'text-muted-foreground'"
          >
            <Tv class="w-3.5 h-3.5" />
            LED
          </button>

          <template v-if="!isLoggedIn">
            <button
              @click="handlePublicNav('auth')"
              class="bs-btn-primary text-xs hidden sm:inline-flex"
            >
              Connexion
            </button>
          </template>
          <template v-else>
            <span v-if="isLoggedIn" class="hidden md:inline text-xs text-muted-foreground">
              Connecté : <span class="font-medium text-foreground">{{ currentUser.name }}</span>
            </span>
            <button
              v-if="canAccessAdmin"
              @click="goToAdmin"
              class="hidden sm:flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border border-border hover:bg-accent transition-colors"
              :class="isAdminRoute ? 'text-primary border-primary/30 bg-primary/5' : 'text-muted-foreground'"
            >
              <LayoutDashboard class="w-3.5 h-3.5" />
              Admin
            </button>
            <button
              @click="goToProfile"
              class="w-8 h-8 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center hover:bg-primary/90 transition-colors"
              :title="currentUser.name"
            >
              {{ userInitials }}
            </button>
            <button
              @click="handleRoleChange('VISITOR')"
              class="bs-btn-primary text-xs hidden sm:inline-flex"
              title="Se déconnecter"
            >
              <LogOut class="w-3.5 h-3.5" />
              Déconnexion
            </button>
          </template>

          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="lg:hidden p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent transition-colors"
          >
            <X v-if="mobileMenuOpen" class="w-5 h-5" />
            <Menu v-else class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="mobileMenuOpen"
      class="lg:hidden border-t border-border bg-card px-4 py-4 space-y-2 animate-fadeIn"
    >
      <button
        v-for="item in navItems"
        :key="item.id"
        @click="handlePublicNav(item.id)"
        class="w-full py-2.5 px-3 rounded-lg text-left text-sm font-medium"
        :class="isPublicRoute && publicTab === item.id ? 'bg-primary/10 text-primary' : 'hover:bg-accent'"
      >
        {{ item.label }}
      </button>
      <div class="border-t border-border pt-3 space-y-2">
        <button
          v-if="!isLoggedIn"
          @click="handlePublicNav('auth')"
          class="w-full bs-btn-primary text-center"
        >
          Connexion / Inscription
        </button>
        <template v-else>
          <button @click="goToProfile" class="w-full py-2 rounded-lg text-sm font-medium hover:bg-accent flex items-center justify-center gap-2">
            <User class="w-4 h-4" /> Mon profil
          </button>
          <button
            v-if="canAccessAdmin"
            @click="goToAdmin(); mobileMenuOpen = false"
            class="w-full py-2 rounded-lg text-sm font-medium hover:bg-accent flex items-center justify-center gap-2"
          >
            <LayoutDashboard class="w-4 h-4" /> Espace Admin
          </button>
          <button
            @click="handleRoleChange('VISITOR'); mobileMenuOpen = false"
            class="w-full bs-btn-primary text-center"
          >
            Déconnexion
          </button>
        </template>
      </div>
    </div>
  </header>
</template>