<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import {
  Store,
  Users,
  Package,
  MapPin,
  FileText,
  Coins,
  TrendingUp,
  Calendar,
} from 'lucide-vue-next';
import { useApp } from '../../../../composables/useApp.js';
import StatCard from '../../StatCard.vue';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import Badge from '../../ui/Badge.vue';
import Button from '../../ui/Button.vue';

const router = useRouter();
const {
  currentUser,
  markets,
  merchants,
  products,
  places,
  requests,
  receipts,
} = useApp();

const isSuperAdmin = computed(() => currentUser.value.role === 'SUPER_ADMIN');
const isMarketAdmin = computed(() => currentUser.value.role === 'ADMIN_MARCHE');
const isMerchant = computed(() => currentUser.value.role === 'COMMERCANT');

const assignedMarketId = computed(() =>
  isMarketAdmin.value ? (currentUser.value.marketId || 'm1') : null,
);

const scopedMarkets = computed(() => {
  if (isSuperAdmin.value) return markets.value;
  if (assignedMarketId.value) {
    return markets.value.filter((m) => m.id === assignedMarketId.value);
  }
  return markets.value;
});

const totalPlaces = computed(() =>
  places.value
    .filter((p) => !assignedMarketId.value || p.marketId === assignedMarketId.value)
    .length,
);

const occupiedPlaces = computed(() =>
  places.value.filter(
    (p) =>
      p.status === 'occupée' &&
      (!assignedMarketId.value || p.marketId === assignedMarketId.value),
  ).length,
);

const freePlaces = computed(() => totalPlaces.value - occupiedPlaces.value);

const scopedMerchants = computed(() => {
  if (isMerchant.value) {
    return merchants.value.filter((m) => m.id === currentUser.value.merchantId);
  }
  if (assignedMarketId.value) {
    return merchants.value.filter((m) => m.activeMarketId === assignedMarketId.value);
  }
  return merchants.value;
});

const scopedProducts = computed(() => {
  if (isMerchant.value) {
    return products.value.filter((p) => p.merchantId === currentUser.value.merchantId);
  }
  if (assignedMarketId.value) {
    return products.value.filter((p) => p.marketId === assignedMarketId.value);
  }
  return products.value;
});

const pendingRequests = computed(() =>
  requests.value.filter(
    (r) =>
      r.status === 'pending' &&
      (!assignedMarketId.value || r.requestedMarketId === assignedMarketId.value),
  ),
);

const pendingReceipts = computed(() =>
  receipts.value.filter((r) => {
    if (isMerchant.value) {
      return r.merchantId === currentUser.value.merchantId && r.status === 'pending';
    }
    if (assignedMarketId.value) {
      const merchantIds = merchants.value
        .filter((m) => m.activeMarketId === assignedMarketId.value)
        .map((m) => m.id);
      return merchantIds.includes(r.merchantId) && r.status === 'pending';
    }
    return r.status === 'pending';
  }),
);

const recentRequests = computed(() =>
  [...requests.value]
    .filter(
      (r) =>
        !assignedMarketId.value || r.requestedMarketId === assignedMarketId.value,
    )
    .sort((a, b) => new Date(b.submittedDate) - new Date(a.submittedDate))
    .slice(0, 5),
);

const occupationRate = computed(() => {
  if (!totalPlaces.value) return 0;
  return Math.round((occupiedPlaces.value / totalPlaces.value) * 100);
});

const pageTitle = computed(() => {
  if (isSuperAdmin.value) return 'Tableau de Bord National';
  if (isMarketAdmin.value) return 'Tableau de Bord Mairie';
  return 'Mon Espace Commerçant';
});

const statusBadge = (status) => {
  const map = {
    pending: { label: 'En attente', variant: 'secondary' },
    approved: { label: 'Approuvé', variant: 'default' },
    rejected: { label: 'Rejeté', variant: 'destructive' },
  };
  return map[status] || { label: status, variant: 'secondary' };
};

const findMarket = (id) => markets.value.find((m) => m.id === id);
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold text-foreground">{{ pageTitle }}</h1>
        <p class="text-sm text-muted-foreground mt-1">
          Vue d'ensemble de l'activité des marchés connectés
        </p>
      </div>
      <div class="flex items-center gap-2 text-sm">
        <Calendar class="w-4 h-4 text-muted-foreground" />
        <span class="text-muted-foreground">Période :</span>
        <span class="font-medium">Juin 2026</span>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        v-if="!isMerchant"
        title="Marchés connectés"
        :value="scopedMarkets.length"
        :icon="Store"
        :trend="{ value: '—', isPositive: true }"
        color="primary"
      />
      <StatCard
        title="Étals occupés"
        :value="`${occupiedPlaces} / ${totalPlaces}`"
        :icon="MapPin"
        :trend="{ value: occupationRate + '%', isPositive: true }"
        :subtitle="`${freePlaces} libres`"
        color="secondary"
      />
      <StatCard
        title="Commerçants actifs"
        :value="scopedMerchants.length"
        :icon="Users"
        :trend="{ value: '—', isPositive: true }"
        color="success"
      />
      <StatCard
        title="Produits catalogue"
        :value="scopedProducts.length"
        :icon="Package"
        :trend="{ value: '—', isPositive: true }"
        color="warning"
      />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Occupation par marché</CardTitle>
          <p class="text-sm text-muted-foreground">Taux d'occupation des emplacements</p>
        </CardHeader>
        <CardContent class="space-y-4">
          <div
            v-for="market in scopedMarkets"
            :key="market.id"
            class="space-y-2"
          >
            <div class="flex items-center justify-between text-sm">
              <span class="font-medium">{{ market.name }}</span>
              <span class="text-muted-foreground">
                {{ market.occupiedPlaces }}/{{ market.totalPlaces }}
              </span>
            </div>
            <div class="h-2 bg-muted rounded-full overflow-hidden">
              <div
                class="h-full bg-primary rounded-full transition-all"
                :style="{
                  width: `${Math.round((market.occupiedPlaces / market.totalPlaces) * 100)}%`,
                }"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Actions rapides</CardTitle>
            <p class="text-sm text-muted-foreground">Accès direct aux modules</p>
          </div>
          <TrendingUp class="w-5 h-5 text-muted-foreground" />
        </CardHeader>
        <CardContent class="grid grid-cols-2 gap-3">
          <Button
            v-if="!isMerchant"
            variant="outline"
            class="h-auto py-4 flex flex-col gap-2"
            @click="router.push('/admin/places')"
          >
            <MapPin class="w-5 h-5" />
            <span class="text-xs">Emplacements</span>
          </Button>
          <Button
            variant="outline"
            class="h-auto py-4 flex flex-col gap-2"
            @click="router.push('/admin/products')"
          >
            <Package class="w-5 h-5" />
            <span class="text-xs">Produits</span>
          </Button>
          <Button
            v-if="isMarketAdmin"
            variant="outline"
            class="h-auto py-4 flex flex-col gap-2"
            @click="router.push('/admin/requests')"
          >
            <FileText class="w-5 h-5" />
            <span class="text-xs">Demandes ({{ pendingRequests.length }})</span>
          </Button>
          <Button
            variant="outline"
            class="h-auto py-4 flex flex-col gap-2"
            @click="router.push('/admin/receipts')"
          >
            <Coins class="w-5 h-5" />
            <span class="text-xs">Reçus ({{ pendingReceipts.length }})</span>
          </Button>
        </CardContent>
      </Card>
    </div>

    <Card v-if="!isMerchant">
      <CardHeader>
        <CardTitle>Demandes récentes</CardTitle>
        <p class="text-sm text-muted-foreground">Dernières demandes d'octroi d'emplacement</p>
      </CardHeader>
      <CardContent>
        <div v-if="recentRequests.length" class="space-y-3">
          <div
            v-for="req in recentRequests"
            :key="req.id"
            class="flex items-start justify-between gap-4 p-4 rounded-lg border border-border hover:bg-accent transition-colors"
          >
            <div class="min-w-0">
              <h4 class="font-medium text-sm">{{ req.merchantName }}</h4>
              <p class="text-sm text-muted-foreground truncate">{{ req.activityType }}</p>
              <p class="text-xs text-muted-foreground mt-1">
                {{ findMarket(req.requestedMarketId)?.name }} — {{ req.submittedDate }}
              </p>
            </div>
            <Badge :variant="statusBadge(req.status).variant">
              {{ statusBadge(req.status).label }}
            </Badge>
          </div>
        </div>
        <p v-else class="text-sm text-muted-foreground py-4">Aucune demande récente.</p>
      </CardContent>
    </Card>
  </div>
</template>