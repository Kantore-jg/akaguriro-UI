<script setup>
import { ref, computed } from 'vue';
import { Plus, Search, Package } from 'lucide-vue-next';
import { useApp } from '../../../../composables/useApp.js';
import { useAdminScope } from '../../../../composables/useAdminScope.js';
import StatCard from '../../StatCard.vue';
import ProductsTable from '../../products/ProductsTable.vue';
import ProductFormDialog from '../../products/ProductFormDialog.vue';
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

const { addProduct, updateProduct, deleteProduct } = useApp();
const {
  isMerchant,
  scopedProducts,
  scopedMarkets,
  scopedMerchants,
  assignedMarketId,
  assignedMerchant,
  findMarket,
  findMerchant,
} = useAdminScope();

const searchQuery = ref('');
const categoryFilter = ref('all');
const formOpen = ref(false);
const deleteOpen = ref(false);
const editingProduct = ref(null);
const productToDelete = ref(null);

const categories = computed(() => {
  const set = new Set(scopedProducts.value.map((p) => p.category));
  return Array.from(set).sort();
});

const filteredProducts = computed(() =>
  scopedProducts.value.filter((p) => {
    const q = searchQuery.value.toLowerCase();
    const matchesQuery =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q);
    const matchesCat = categoryFilter.value === 'all' || p.category === categoryFilter.value;
    return matchesQuery && matchesCat;
  }),
);

const lowStockCount = computed(() =>
  scopedProducts.value.filter((p) => p.stock <= 5).length,
);

const trendingCount = computed(() =>
  scopedProducts.value.filter((p) => p.isTrending).length,
);

const pageTitle = computed(() =>
  isMerchant.value ? 'Mes produits' : 'Catalogue produits',
);

const getMerchantName = (id) => findMerchant(id)?.name || '—';
const getMarketCity = (id) => findMarket(id)?.city || '—';

const openCreate = () => {
  editingProduct.value = null;
  formOpen.value = true;
};

const openEdit = (product) => {
  editingProduct.value = product;
  formOpen.value = true;
};

const openDelete = (product) => {
  productToDelete.value = product;
  deleteOpen.value = true;
};

const handleSubmit = (payload) => {
  if (payload.id) {
    updateProduct(payload);
  } else {
    addProduct(payload);
  }
};

const confirmDelete = () => {
  if (productToDelete.value) {
    deleteProduct(productToDelete.value.id);
  }
  deleteOpen.value = false;
  productToDelete.value = null;
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold text-foreground">{{ pageTitle }}</h1>
        <p class="text-sm text-muted-foreground mt-1">
          Gestion du catalogue et des prix indicatifs
        </p>
      </div>
      <Button @click="openCreate">
        <Plus class="w-4 h-4 mr-2" />
        Ajouter un produit
      </Button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard
        title="Produits référencés"
        :value="scopedProducts.length"
        :icon="Package"
        color="primary"
      />
      <StatCard
        title="En tendance"
        :value="trendingCount"
        :icon="Package"
        color="success"
      />
      <StatCard
        title="Stock faible"
        :value="lowStockCount"
        :icon="Package"
        color="warning"
      />
    </div>

    <Card>
      <CardContent class="p-4">
        <div class="flex flex-col sm:flex-row gap-3">
          <div class="relative flex-1">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input v-model="searchQuery" placeholder="Rechercher un produit..." class="pl-9" />
          </div>
          <Select v-model="categoryFilter">
            <SelectTrigger class="w-full sm:w-48">
              <SelectValue placeholder="Toutes catégories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes catégories</SelectItem>
              <SelectItem v-for="cat in categories" :key="cat" :value="cat">
                {{ cat }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>

    <ProductsTable
      :products="filteredProducts"
      :get-merchant-name="getMerchantName"
      :get-market-city="getMarketCity"
      @edit="openEdit"
      @delete="openDelete"
    />

    <ProductFormDialog
      v-model:open="formOpen"
      :product="editingProduct"
      :markets="scopedMarkets"
      :merchants="scopedMerchants"
      :is-merchant="isMerchant"
      :default-merchant="assignedMerchant"
      :default-market-id="assignedMarketId || ''"
      @submit="handleSubmit"
    />

    <AlertDialog v-model:open="deleteOpen">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer ce produit ?</AlertDialogTitle>
          <AlertDialogDescription>
            Le produit <strong>{{ productToDelete?.name }}</strong> sera retiré du catalogue.
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