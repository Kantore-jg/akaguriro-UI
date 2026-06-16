<script setup>
import { ref, computed } from 'vue';
import { Search, Users, ShieldCheck, Star } from 'lucide-vue-next';
import { useAdminScope } from '../../../../composables/useAdminScope.js';
import StatCard from '../../StatCard.vue';
import MerchantsTable from '../../merchants/MerchantsTable.vue';
import MerchantViewDialog from '../../merchants/MerchantViewDialog.vue';
import Input from '../../ui/Input.vue';
import { Card, CardContent } from '../../ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';

const {
  scopedMerchants,
  scopedMarkets,
  scopedProducts,
  findMarket,
} = useAdminScope();

const searchQuery = ref('');
const marketFilter = ref('all');
const categoryFilter = ref('all');
const viewOpen = ref(false);
const viewingMerchant = ref(null);

const categories = computed(() => {
  const set = new Set(scopedMerchants.value.map((m) => m.category));
  return Array.from(set).sort();
});

const filteredMerchants = computed(() =>
  scopedMerchants.value.filter((m) => {
    const q = searchQuery.value.toLowerCase();
    const matchesQuery =
      !q ||
      m.name.toLowerCase().includes(q) ||
      m.phone.includes(q) ||
      m.category.toLowerCase().includes(q);
    const matchesMarket =
      marketFilter.value === 'all' || m.activeMarketId === marketFilter.value;
    const matchesCategory =
      categoryFilter.value === 'all' || m.category === categoryFilter.value;
    return matchesQuery && matchesMarket && matchesCategory;
  }),
);

const verifiedCount = computed(() =>
  scopedMerchants.value.filter((m) => m.verified).length,
);

const avgRating = computed(() => {
  if (!scopedMerchants.value.length) return '—';
  const avg =
    scopedMerchants.value.reduce((s, m) => s + m.rating, 0) /
    scopedMerchants.value.length;
  return avg.toFixed(1);
});

const getMarketLabel = (marketId) => {
  const m = findMarket(marketId);
  return m ? `${m.city}` : '—';
};

const openView = (merchant) => {
  viewingMerchant.value = merchant;
  viewOpen.value = true;
};

const viewingProductsCount = computed(() => {
  if (!viewingMerchant.value) return 0;
  return scopedProducts.value.filter(
    (p) => p.merchantId === viewingMerchant.value.id,
  ).length;
});
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-semibold text-foreground">Commerçants</h1>
      <p class="text-sm text-muted-foreground mt-1">
        Répertoire des exploitants habilités sur les marchés connectés
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard
        title="Commerçants actifs"
        :value="scopedMerchants.length"
        :icon="Users"
        color="primary"
      />
      <StatCard
        title="Habilités"
        :value="verifiedCount"
        :icon="ShieldCheck"
        color="success"
      />
      <StatCard
        title="Score moyen"
        :value="avgRating"
        :icon="Star"
        color="warning"
      />
    </div>

    <Card>
      <CardContent class="p-4">
        <div class="flex flex-col lg:flex-row gap-3">
          <div class="relative flex-1">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              v-model="searchQuery"
              placeholder="Rechercher par nom, téléphone..."
              class="pl-9"
            />
          </div>
          <Select v-model="marketFilter">
            <SelectTrigger class="w-full lg:w-48">
              <SelectValue placeholder="Tous les marchés" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les marchés</SelectItem>
              <SelectItem v-for="m in scopedMarkets" :key="m.id" :value="m.id">
                {{ m.name }}
              </SelectItem>
            </SelectContent>
          </Select>
          <Select v-model="categoryFilter">
            <SelectTrigger class="w-full lg:w-48">
              <SelectValue placeholder="Toutes filières" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes filières</SelectItem>
              <SelectItem v-for="cat in categories" :key="cat" :value="cat">
                {{ cat }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>

    <MerchantsTable
      :merchants="filteredMerchants"
      :get-market-label="getMarketLabel"
      @view="openView"
    />

    <MerchantViewDialog
      v-model:open="viewOpen"
      :merchant="viewingMerchant"
      :market-name="viewingMerchant ? findMarket(viewingMerchant.activeMarketId)?.name : ''"
      :products-count="viewingProductsCount"
    />
  </div>
</template>