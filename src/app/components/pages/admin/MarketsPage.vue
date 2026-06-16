<script setup>
import { ref, computed } from 'vue';
import { Plus, Search, Store } from 'lucide-vue-next';
import { useApp } from '../../../../composables/useApp.js';
import StatCard from '../../StatCard.vue';
import MarketsTable from '../../markets/MarketsTable.vue';
import MarketFormDialog from '../../markets/MarketFormDialog.vue';
import MarketViewDialog from '../../markets/MarketViewDialog.vue';
import Button from '../../ui/Button.vue';
import Input from '../../ui/Input.vue';
import { Card, CardContent } from '../../ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../ui/alert-dialog';

const { markets, places, merchants, products, addMarket, updateMarket, deleteMarket } = useApp();

const searchQuery = ref('');
const cityFilter = ref('all');
const formOpen = ref(false);
const viewOpen = ref(false);
const deleteOpen = ref(false);
const editingMarket = ref(null);
const viewingMarket = ref(null);
const marketToDelete = ref(null);

const cities = computed(() => {
  const set = new Set(markets.value.map((m) => m.city));
  return Array.from(set).sort();
});

const filteredMarkets = computed(() => {
  return markets.value.filter((m) => {
    const q = searchQuery.value.toLowerCase();
    const matchesQuery =
      !q ||
      m.name.toLowerCase().includes(q) ||
      m.city.toLowerCase().includes(q) ||
      m.location.toLowerCase().includes(q);
    const matchesCity = cityFilter.value === 'all' || m.city === cityFilter.value;
    return matchesQuery && matchesCity;
  });
});

const totalPlaces = computed(() =>
  markets.value.reduce((sum, m) => sum + m.totalPlaces, 0),
);

const totalOccupied = computed(() =>
  markets.value.reduce((sum, m) => sum + m.occupiedPlaces, 0),
);

const avgOccupation = computed(() => {
  if (!totalPlaces.value) return 0;
  return Math.round((totalOccupied.value / totalPlaces.value) * 100);
});

const getMarketStats = (marketId) => ({
  places: places.value.filter((p) => p.marketId === marketId).length,
  merchants: merchants.value.filter((m) => m.activeMarketId === marketId).length,
  products: products.value.filter((p) => p.marketId === marketId).length,
});

const openCreate = () => {
  editingMarket.value = null;
  formOpen.value = true;
};

const openEdit = (market) => {
  editingMarket.value = market;
  formOpen.value = true;
};

const openView = (market) => {
  viewingMarket.value = market;
  viewOpen.value = true;
};

const openDelete = (market) => {
  marketToDelete.value = market;
  deleteOpen.value = true;
};

const handleFormSubmit = (payload) => {
  if (payload.id) {
    updateMarket({
      ...payload,
      occupiedPlaces: Math.min(payload.occupiedPlaces ?? 0, payload.totalPlaces),
    });
  } else {
    addMarket(payload);
  }
};

const confirmDelete = () => {
  if (marketToDelete.value) {
    deleteMarket(marketToDelete.value.id);
  }
  deleteOpen.value = false;
  marketToDelete.value = null;
};

const viewingStats = computed(() => {
  if (!viewingMarket.value) return { places: 0, merchants: 0, products: 0 };
  return getMarketStats(viewingMarket.value.id);
});
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold text-foreground">Marchés Publics</h1>
        <p class="text-sm text-muted-foreground mt-1">
          Registre national des marchés connectés au réseau Akaguriro
        </p>
      </div>
      <Button @click="openCreate">
        <Plus class="w-4 h-4 mr-2" />
        Nouveau marché
      </Button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard
        title="Marchés enregistrés"
        :value="markets.length"
        :icon="Store"
        color="primary"
      />
      <StatCard
        title="Capacité totale"
        :value="totalPlaces"
        :icon="Store"
        :subtitle="`${totalOccupied} étals occupés`"
        color="secondary"
      />
      <StatCard
        title="Taux d'occupation moyen"
        :value="avgOccupation + '%'"
        :icon="Store"
        :trend="{ value: '—', isPositive: avgOccupation < 85 }"
        color="success"
      />
    </div>

    <Card>
      <CardContent class="p-4">
        <div class="flex flex-col sm:flex-row gap-3">
          <div class="relative flex-1">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              v-model="searchQuery"
              placeholder="Rechercher par nom, ville ou adresse..."
              class="pl-9"
            />
          </div>
          <Select v-model="cityFilter">
            <SelectTrigger class="w-full sm:w-48">
              <SelectValue placeholder="Toutes les villes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les villes</SelectItem>
              <SelectItem v-for="city in cities" :key="city" :value="city">
                {{ city }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>

    <MarketsTable
      :markets="filteredMarkets"
      @view="openView"
      @edit="openEdit"
      @delete="openDelete"
    />

    <MarketFormDialog
      v-model:open="formOpen"
      :market="editingMarket"
      @submit="handleFormSubmit"
    />

    <MarketViewDialog
      v-model:open="viewOpen"
      :market="viewingMarket"
      :places-count="viewingStats.places"
      :merchants-count="viewingStats.merchants"
      :products-count="viewingStats.products"
      @edit="openEdit"
    />

    <AlertDialog v-model:open="deleteOpen">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer ce marché ?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action est irréversible. Le marché
            <strong>{{ marketToDelete?.name }}</strong>
            sera retiré du registre. Les marchés avec des emplacements ou produits associés ne peuvent pas être supprimés.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction
            class="bg-destructive text-white hover:bg-destructive/90"
            @click="confirmDelete"
          >
            Supprimer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>