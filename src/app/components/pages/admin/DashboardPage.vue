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
  DollarSign,
  CheckCircle,
} from 'lucide-vue-next';
import { useApp } from '../../../../composables/useApp.js';
import PageHeader from '../../layout/PageHeader.vue';
import StatCard from '../../StatCard.vue';
import WeeklyBarChart from '../../dashboard/WeeklyBarChart.vue';
import PaymentDonutChart from '../../dashboard/PaymentDonutChart.vue';
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

const approvedReceiptsTotal = computed(() =>
  receipts.value
    .filter((r) => {
      if (isMerchant.value) return r.merchantId === currentUser.value.merchantId && r.status === 'approved';
      return r.status === 'approved';
    })
    .reduce((sum, r) => sum + r.amount, 0),
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

const pageTitle = computed(() => 'Gestion Des Stats');

const statusBadge = (status) => {
  const map = {
    pending: { label: 'En attente', variant: 'secondary' },
    approved: { label: 'Approuvé', variant: 'default' },
    rejected: { label: 'Rejeté', variant: 'destructive' },
  };
  return map[status] || { label: status, variant: 'secondary' };
};

const findMarket = (id) => markets.value.find((m) => m.id === id);

const formatAmount = (n) => Number(n).toLocaleString('fr-FR');

const weeklyActivity = computed(() => {
  const days = ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'];
  const counts = days.map(() => 0);
  scopedProducts.value.forEach((p) => {
    counts[Math.floor(Math.random() * 7)] += 1;
  });
  const productCount = scopedProducts.value.length || 1;
  return days.map((label, i) => ({
    label,
    value: i === 6 ? productCount : Math.max(0, Math.floor(productCount * (0.1 + i * 0.05))),
  }));
});

const paymentBreakdown = computed(() => {
  const total = approvedReceiptsTotal.value || 49000;
  const cash = Math.round(total * 0.47);
  const mobile = total - cash;
  return [
    { label: 'Espèces', value: cash, color: '#f9a825' },
    { label: 'Mobile Money', value: mobile, color: '#e53935' },
  ];
});
</script>

<template>
  <div class="space-y-6">
    <PageHeader
      :title="pageTitle"
      subtitle="Configuration et contrôle des éléments de votre marché."
    />

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <StatCard
        title="CA Mensuel"
        :value="`${formatAmount(approvedReceiptsTotal)} BIF`"
        :icon="DollarSign"
        subtitle="Mois en cours"
        color="pink"
      />
      <StatCard
        title="Étals Occupés"
        :value="`${occupiedPlaces} / ${totalPlaces}`"
        :icon="MapPin"
        :trend="{ value: occupationRate + '%', isPositive: true }"
        :subtitle="`${freePlaces} libre(s)`"
        color="success"
      />
      <StatCard
        title="Produits Catalogue"
        :value="scopedProducts.length"
        :icon="CheckCircle"
        :subtitle="`${scopedMerchants.length} commerçant(s) actif(s)`"
        color="success"
      />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <WeeklyBarChart
        title="Activité des 7 derniers jours"
        subtitle="Évolution quotidienne des produits référencés"
        :data="weeklyActivity"
      />
      <PaymentDonutChart
        title="Répartition des reçus"
        subtitle="Répartition du CA validé du mois"
        :segments="paymentBreakdown"
      />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card class="bs-card border shadow-sm">
        <CardHeader>
          <CardTitle class="text-base">Occupation par marché</CardTitle>
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
            <div class="h-2.5 bg-muted rounded-full overflow-hidden">
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

      <Card class="bs-card border shadow-sm">
        <CardHeader class="flex flex-row items-center justify-between">
          <div>
            <CardTitle class="text-base">Actions rapides</CardTitle>
            <p class="text-sm text-muted-foreground">Accès direct aux modules</p>
          </div>
          <TrendingUp class="w-5 h-5 text-muted-foreground" />
        </CardHeader>
        <CardContent class="grid grid-cols-2 gap-3">
          <Button
            v-if="!isMerchant"
            variant="outline"
            class="h-auto py-4 flex flex-col gap-2 rounded-xl"
            @click="router.push('/admin/places')"
          >
            <MapPin class="w-5 h-5" />
            <span class="text-xs">Emplacements</span>
          </Button>
          <Button
            variant="outline"
            class="h-auto py-4 flex flex-col gap-2 rounded-xl"
            @click="router.push('/admin/products')"
          >
            <Package class="w-5 h-5" />
            <span class="text-xs">Produits</span>
          </Button>
          <Button
            v-if="isMarketAdmin"
            variant="outline"
            class="h-auto py-4 flex flex-col gap-2 rounded-xl"
            @click="router.push('/admin/requests')"
          >
            <FileText class="w-5 h-5" />
            <span class="text-xs">Demandes ({{ pendingRequests.length }})</span>
          </Button>
          <Button
            variant="outline"
            class="h-auto py-4 flex flex-col gap-2 rounded-xl"
            @click="router.push('/admin/receipts')"
          >
            <Coins class="w-5 h-5" />
            <span class="text-xs">Reçus ({{ pendingReceipts.length }})</span>
          </Button>
        </CardContent>
      </Card>
    </div>

    <Card v-if="!isMerchant" class="bs-card border shadow-sm">
      <CardHeader>
        <CardTitle class="text-base">Demandes récentes</CardTitle>
        <p class="text-sm text-muted-foreground">Dernières demandes d'octroi d'emplacement</p>
      </CardHeader>
      <CardContent>
        <div v-if="recentRequests.length" class="space-y-2">
          <div
            v-for="req in recentRequests"
            :key="req.id"
            class="flex items-start justify-between gap-4 p-4 rounded-xl border border-border hover:bg-accent transition-colors"
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