<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import {
  Package,
  MapPin,
  FileText,
  Coins,
  TrendingUp,
  DollarSign,
  CheckCircle,
} from 'lucide-vue-next';
import { useAdminScope } from '../../../../composables/useAdminScope.js';
import PageHeader from '../../layout/PageHeader.vue';
import StatCard from '../../StatCard.vue';
import WeeklyBarChart from '../../dashboard/WeeklyBarChart.vue';
import PaymentDonutChart from '../../dashboard/PaymentDonutChart.vue';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import Badge from '../../ui/Badge.vue';
import Button from '../../ui/Button.vue';
import ExcelTransferCard from '../../../../components/ExcelTransferCard.vue';

const router = useRouter();
const {
  isSuperAdmin,
  isMarketAdmin,
  isMerchant,
  assignedMerchant,
  scopedMerchants,
  scopedProducts,
  scopedPendingRequests,
  scopedPendingReceipts,
  scopedApprovedReceiptsTotal,
  scopedOccupiedPlaces,
  scopedTotalPlaces,
  scopedFreePlaces,
  scopedOccupationRate,
  scopedMarketOccupation,
  scopedWeeklyReceiptActivity,
  scopedReceiptStatusBreakdown,
  scopedRequests,
  findMarket,
} = useAdminScope();


const merchantPlaceLabel = computed(() => {
  if (!assignedMerchant.value?.activePlaceNumber) return 'Non assigné';
  return `Étal ${assignedMerchant.value.activePlaceNumber}`;
});

const recentRequests = computed(() =>
  [...scopedRequests.value]
    .sort((a, b) => new Date(b.submittedDate) - new Date(a.submittedDate))
    .slice(0, 5),
);

const statusBadge = (status) => {
  const map = {
    pending: { label: 'En attente', variant: 'secondary' },
    approved: { label: 'Approuvé', variant: 'default' },
    rejected: { label: 'Rejeté', variant: 'destructive' },
  };
  return map[status] || { label: status, variant: 'secondary' };
};

const formatAmount = (n) => Number(n).toLocaleString('fr-FR');
</script>

<template>
  <div class="space-y-6">
    <PageHeader :title="pageTitle" :subtitle="pageSubtitle" />

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <StatCard
        :title="isMerchant ? 'Mes revenus validés' : 'CA validé'"
        :value="`${formatAmount(scopedApprovedReceiptsTotal)} BIF`"
        :icon="DollarSign"
        color="pink"
      />
      <!-- :subtitle="isMerchant ? 'Total de mes reçus approuvés' : 'Reçus approuvés dans votre périmètre'" -->

      <StatCard
        v-if="!isMerchant"
        title="Étals occupés"
        :value="`${scopedOccupiedPlaces} / ${scopedTotalPlaces}`"
        :icon="MapPin"
        :trend="{ value: scopedOccupationRate + '%', isPositive: true }"
        :subtitle="`${scopedFreePlaces} libre(s)`"
        color="success"
      />
      <StatCard
        v-else
        title="Mon emplacement"
        :value="merchantPlaceLabel"
        :icon="MapPin"
        color="success"
      />
      <!-- :subtitle="assignedMerchant?.activeMarketId ? findMarket(assignedMerchant.activeMarketId)?.name : 'Marché non défini'" -->

      <StatCard
        :title="isMerchant ? 'Mes produits' : 'Produits catalogue'"
        :value="scopedProducts.length"
        :icon="CheckCircle"
        color="success"
      />
        <!-- :subtitle="isMerchant ? 'Produits actifs dans mon catalogue' : `${scopedMerchants.length} commerçant(s) actif(s)`" -->

    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <WeeklyBarChart
        title="Activité des 7 derniers jours"
        :data="scopedWeeklyReceiptActivity"
      />
      <!-- subtitle="Nombre de reçus soumis par jour" -->

      <PaymentDonutChart
        title="Répartition des reçus"
        :segments="scopedReceiptStatusBreakdown"
      />
      <!-- subtitle="Montants par statut dans votre périmètre" -->

    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card v-if="!isMerchant" class="bs-card border shadow-sm">
        <CardHeader>
          <CardTitle class="text-base">Occupation par marché</CardTitle>
          <p class="text-sm text-muted-foreground">Taux d'occupation des emplacements</p>
        </CardHeader>
        <CardContent class="space-y-4">
          <div
            v-for="market in scopedMarketOccupation"
            :key="market.id"
            class="space-y-2"
          >
            <div class="flex items-center justify-between text-sm">
              <span class="font-medium">{{ market.name }}</span>
              <span class="text-muted-foreground">
                {{ market.occupied }}/{{ market.total }}
              </span>
            </div>
            <div class="h-2.5 bg-muted rounded-full overflow-hidden">
              <div
                class="h-full bg-primary rounded-full transition-all"
                :style="{ width: `${market.rate}%` }"
              />
            </div>
          </div>
          <p v-if="!scopedMarketOccupation.length" class="text-sm text-muted-foreground">
            Aucun marché dans votre périmètre.
          </p>
        </CardContent>
      </Card>

      <Card :class="['bs-card border shadow-sm', isMerchant && 'lg:col-span-2']">
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
            <span class="text-xs">Demandes ({{ scopedPendingRequests.length }})</span>
          </Button>
          <Button
            variant="outline"
            class="h-auto py-4 flex flex-col gap-2 rounded-xl"
            @click="router.push('/admin/receipts')"
          >
            <Coins class="w-5 h-5" />
            <span class="text-xs">
              {{ isMerchant ? 'Mes reçus' : 'Reçus' }} ({{ scopedPendingReceipts.length }})
            </span>
          </Button>
        </CardContent>
      </Card>
    </div>

    <ExcelTransferCard v-if="isSuperAdmin || isMarketAdmin" />

    <Card v-if="isSuperAdmin || isMarketAdmin" class="bs-card border shadow-sm">
      <CardHeader>
        <CardTitle class="text-base">Demandes récentes</CardTitle>
        <!-- <p class="text-sm text-muted-foreground">Dernières demandes d'octroi d'emplacement</p> -->
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
