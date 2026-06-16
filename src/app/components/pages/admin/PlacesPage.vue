<script setup>
import { ref, computed } from 'vue';
import { Plus, Search, MapPin } from 'lucide-vue-next';
import { useApp } from '../../../../composables/useApp.js';
import { useAdminScope } from '../../../../composables/useAdminScope.js';
import StatCard from '../../StatCard.vue';
import PlacesTable from '../../places/PlacesTable.vue';
import PlaceAssignDialog from '../../places/PlaceAssignDialog.vue';
import PlaceFormDialog from '../../places/PlaceFormDialog.vue';
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

const { updatePlaceStatus, addPlace } = useApp();
const {
  isSuperAdmin,
  scopedMarkets,
  scopedPlaces,
  scopedMerchants,
  assignedMarketId,
  findMarket,
  findMerchant,
} = useAdminScope();

const searchQuery = ref('');
const marketFilter = ref('all');
const statusFilter = ref('all');
const assignOpen = ref(false);
const formOpen = ref(false);
const selectedPlace = ref(null);

const filteredPlaces = computed(() =>
  scopedPlaces.value.filter((p) => {
    const q = searchQuery.value.toLowerCase();
    const matchesQuery =
      !q ||
      p.id.toLowerCase().includes(q) ||
      p.blockName.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q);
    const matchesMarket = marketFilter.value === 'all' || p.marketId === marketFilter.value;
    const matchesStatus = statusFilter.value === 'all' || p.status === statusFilter.value;
    return matchesQuery && matchesMarket && matchesStatus;
  }),
);

const occupiedCount = computed(() =>
  scopedPlaces.value.filter((p) => p.status === 'occupée').length,
);
const freeCount = computed(() =>
  scopedPlaces.value.filter((p) => p.status === 'libre').length,
);
const maintenanceCount = computed(() =>
  scopedPlaces.value.filter((p) => p.status === 'maintenance').length,
);

const getMarketName = (id) => findMarket(id)?.name || '—';
const getMerchant = (id) => (id ? findMerchant(id) : null);

const openAssign = (place) => {
  selectedPlace.value = place;
  assignOpen.value = true;
};

const handleAssign = ({ placeId, marketId, status, merchantId }) => {
  updatePlaceStatus(placeId, marketId, status, merchantId);
};

const handleAddPlace = (payload) => {
  const exists = scopedPlaces.value.some(
    (p) => p.id === payload.id && p.marketId === payload.marketId,
  );
  if (exists) return;
  addPlace(payload);
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold text-foreground">Emplacements</h1>
        <p class="text-sm text-muted-foreground mt-1">
          Cartographie et affectation des étals par marché
        </p>
      </div>
      <Button v-if="isSuperAdmin" @click="formOpen = true">
        <Plus class="w-4 h-4 mr-2" />
        Nouvel emplacement
      </Button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatCard title="Total étals" :value="scopedPlaces.length" :icon="MapPin" color="primary" />
      <StatCard title="Occupés" :value="occupiedCount" :icon="MapPin" color="success" />
      <StatCard title="Libres" :value="freeCount" :icon="MapPin" color="secondary" />
      <StatCard title="Maintenance" :value="maintenanceCount" :icon="MapPin" color="warning" />
    </div>

    <Card>
      <CardContent class="p-4">
        <div class="flex flex-col lg:flex-row gap-3">
          <div class="relative flex-1">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input v-model="searchQuery" placeholder="Rechercher par code, bloc..." class="pl-9" />
          </div>
          <Select v-model="marketFilter">
            <SelectTrigger class="w-full lg:w-52">
              <SelectValue placeholder="Tous les marchés" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les marchés</SelectItem>
              <SelectItem v-for="m in scopedMarkets" :key="m.id" :value="m.id">
                {{ m.name }}
              </SelectItem>
            </SelectContent>
          </Select>
          <Select v-model="statusFilter">
            <SelectTrigger class="w-full lg:w-44">
              <SelectValue placeholder="Tous statuts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous statuts</SelectItem>
              <SelectItem value="libre">Libre</SelectItem>
              <SelectItem value="occupée">Occupée</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>

    <PlacesTable
      :places="filteredPlaces"
      :get-merchant="getMerchant"
      :get-market-name="getMarketName"
      @assign="openAssign"
    />

    <PlaceAssignDialog
      v-model:open="assignOpen"
      :place="selectedPlace"
      :merchants="scopedMerchants"
      :market-name="selectedPlace ? getMarketName(selectedPlace.marketId) : ''"
      @submit="handleAssign"
    />

    <PlaceFormDialog
      v-model:open="formOpen"
      :markets="scopedMarkets"
      :default-market-id="assignedMarketId || ''"
      @submit="handleAddPlace"
    />
  </div>
</template>