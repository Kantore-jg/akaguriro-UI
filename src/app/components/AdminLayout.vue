<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useApp } from '../../composables/useApp.js';
import {
  LayoutDashboard,
  Store,
  MapPin,
  Users,
  Package,
  FileText,
  Coins,
  Menu,
  X,
  Bell,
  LogOut,
  User,
  ChevronDown,
  Eye,
  Building2,
} from 'lucide-vue-next';
import Button from './ui/Button.vue';
import Badge from './ui/Badge.vue';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

const sidebarOpen = ref(true);
const route = useRoute();
const router = useRouter();
const { currentUser, markets, requests, receipts } = useApp();

const isSuperAdmin = computed(() => currentUser.value.role === 'SUPER_ADMIN');
const isMarketAdmin = computed(() => currentUser.value.role === 'ADMIN_MARCHE');
const isMerchant = computed(() => currentUser.value.role === 'COMMERCANT');

const pendingRequestsCount = computed(
  () => requests.value.filter((r) => r.status === 'pending').length,
);
const pendingReceiptsCount = computed(
  () => receipts.value.filter((r) => r.status === 'pending').length,
);

const userInitials = computed(() => {
  const name = currentUser.value?.name || 'U';
  return name.substring(0, 2).toUpperCase();
});

const roleLabel = computed(() =>
  (currentUser.value?.role || '').replace(/_/g, ' '),
);

const navigation = computed(() => {
  const items = [
    {
      id: 'dashboard',
      name: 'Tableau de bord',
      icon: LayoutDashboard,
      path: '/admin',
      exact: true,
    },
  ];

  if (isSuperAdmin.value) {
    items.push(
      {
        id: 'markets',
        name: `Marchés (${markets.value.length})`,
        icon: Store,
        path: '/admin/markets',
      },
      {
        id: 'places',
        name: 'Emplacements',
        icon: MapPin,
        path: '/admin/places',
      },
      {
        id: 'merchants',
        name: 'Commerçants',
        icon: Users,
        path: '/admin/merchants',
      },
    );
  }

  if (isMarketAdmin.value) {
    items.push(
      {
        id: 'places',
        name: 'Emplacements',
        icon: MapPin,
        path: '/admin/places',
      },
      {
        id: 'merchants',
        name: 'Commerçants',
        icon: Users,
        path: '/admin/merchants',
      },
      {
        id: 'requests',
        name: 'Demandes',
        icon: FileText,
        path: '/admin/requests',
        badge: pendingRequestsCount.value,
      },
    );
  }

  items.push({
    id: 'products',
    name: 'Produits',
    icon: Package,
    path: '/admin/products',
  });

  if (!isMerchant.value) {
    items.push({
      id: 'receipts',
      name: 'Reçus de paiement',
      icon: Coins,
      path: '/admin/receipts',
      badge: pendingReceiptsCount.value,
    });
  } else {
    items.push({
      id: 'receipts',
      name: 'Mes reçus',
      icon: Coins,
      path: '/admin/receipts',
    });
  }

  return items;
});

const isActive = (item) => {
  if (item.exact) return route.path === item.path;
  return route.path === item.path || route.path.startsWith(`${item.path}/`);
};

const navigate = (path) => {
  if (route.path !== path) router.push(path);
};

const goToPortal = () => router.push('/');
</script>

<template>
  <div class="min-h-screen flex bg-background">
    <aside
      :class="[
        'transition-all duration-300 bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col fixed lg:sticky top-0 h-screen z-30 overflow-hidden',
        sidebarOpen ? 'w-64' : 'w-0',
      ]"
    >
      <div class="p-6 border-b border-sidebar-border">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <Building2 class="w-6 h-6 text-white" />
          </div>
          <div class="flex-1 min-w-0">
            <h1 class="text-sm font-semibold text-sidebar-foreground truncate">Akaguriro</h1>
            <p class="text-xs text-sidebar-foreground/65">Gestion des marchés</p>
          </div>
        </div>
      </div>

      <div class="px-4 py-3 border-b border-sidebar-border">
        <p class="text-[10px] uppercase tracking-wider text-sidebar-foreground/50 mb-1">Session</p>
        <p class="text-sm font-medium truncate">{{ currentUser.name }}</p>
        <p class="text-[10px] text-primary font-semibold uppercase mt-0.5">{{ roleLabel }}</p>
      </div>

      <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
        <button
          v-for="item in navigation"
          :key="item.id"
          @click="navigate(item.path)"
          :class="[
            'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left',
            isActive(item)
              ? 'bg-primary text-white'
              : 'text-sidebar-foreground hover:bg-sidebar-accent',
          ]"
        >
          <component :is="item.icon" class="w-5 h-5 shrink-0" />
          <span class="text-sm flex-1">{{ item.name }}</span>
          <Badge
            v-if="item.badge"
            class="bg-destructive text-white text-[10px] px-1.5 py-0"
          >
            {{ item.badge }}
          </Badge>
        </button>
      </nav>

      <div class="p-4 border-t border-sidebar-border">
        <button
          @click="goToPortal"
          class="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-sidebar-accent text-sidebar-foreground hover:bg-sidebar-accent/80 transition-colors text-sm"
        >
          <Eye class="w-4 h-4" />
          Portail public
        </button>
      </div>
    </aside>

    <div class="flex-1 flex flex-col min-h-screen">
      <header class="h-16 bg-white border-b border-border flex items-center justify-between px-4 lg:px-6 sticky top-0 z-20">
        <div class="flex items-center gap-4">
          <Button variant="ghost" size="sm" @click="sidebarOpen = !sidebarOpen">
            <Menu v-if="!sidebarOpen" class="w-5 h-5" />
            <X v-else class="w-5 h-5 lg:hidden" />
            <Menu v-if="sidebarOpen" class="w-5 h-5 hidden lg:block" />
          </Button>
          <div>
            <h2 class="text-lg font-semibold text-foreground">Espace Administratif</h2>
            <p class="text-xs text-muted-foreground">Plateforme Akaguriro — République du Burundi</p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <Button variant="ghost" size="sm" class="relative">
            <Bell class="w-5 h-5" />
            <Badge
              v-if="pendingRequestsCount + pendingReceiptsCount > 0"
              class="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs bg-destructive"
            >
              {{ pendingRequestsCount + pendingReceiptsCount }}
            </Badge>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button variant="ghost" size="sm" class="gap-2">
                <Avatar class="w-8 h-8">
                  <AvatarFallback class="bg-primary text-white text-xs">
                    {{ userInitials }}
                  </AvatarFallback>
                </Avatar>
                <div class="hidden lg:block text-left">
                  <p class="text-xs font-medium">{{ currentUser.name }}</p>
                  <p class="text-xs text-muted-foreground">{{ roleLabel }}</p>
                </div>
                <ChevronDown class="w-4 h-4 hidden lg:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" class="w-56">
              <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem @click="goToPortal">
                <Eye class="w-4 h-4 mr-2" />
                Portail public
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem @click="goToPortal">
                <LogOut class="w-4 h-4 mr-2" />
                Quitter l'espace admin
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main class="flex-1 p-4 lg:p-6 overflow-auto admin-bg">
        <router-view />
      </main>
    </div>

    <div
      v-if="sidebarOpen"
      class="fixed inset-0 bg-black/50 z-20 lg:hidden"
      @click="sidebarOpen = false"
    />
  </div>
</template>

<style scoped>
.admin-bg {
  position: relative;
  min-height: calc(100vh - 4rem);
}

.admin-bg::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('/burundi-bg.png');
  background-size: cover;
  background-position: center;
  filter: blur(1px);
  opacity: 0.35;
  z-index: 0;
  pointer-events: none;
}

.admin-bg > :deep(*) {
  position: relative;
  z-index: 1;
}
</style>