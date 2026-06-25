<script setup>
import { ref, computed, onMounted } from 'vue';
import { Plus, Search, Tags } from 'lucide-vue-next';
import { useApp } from '../../../../composables/useApp.js';
import PageHeader from '../../layout/PageHeader.vue';
import FilterBar from '../../layout/FilterBar.vue';
import StatCard from '../../StatCard.vue';
import CategoriesTable from '../../categories/CategoriesTable.vue';
import CategoryFormDialog from '../../categories/CategoryFormDialog.vue';
import Input from '../../ui/Input.vue';
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

const {
  productCategories,
  loadProductCategories,
  addProductCategory,
  updateProductCategory,
  deleteProductCategory,
} = useApp();

const searchQuery = ref('');
const formOpen = ref(false);
const deleteOpen = ref(false);
const editingCategory = ref(null);
const categoryToDelete = ref(null);
const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  await loadProductCategories();
  loading.value = false;
});

const filteredCategories = computed(() =>
  productCategories.value.filter((c) => {
    const q = searchQuery.value.toLowerCase();
    return (
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q)
    );
  }),
);

const openCreate = () => {
  editingCategory.value = null;
  formOpen.value = true;
};

const openEdit = (category) => {
  editingCategory.value = category;
  formOpen.value = true;
};

const openDelete = (category) => {
  categoryToDelete.value = category;
  deleteOpen.value = true;
};

const handleFormSubmit = (payload) => {
  if (payload.id) {
    updateProductCategory(payload);
  } else {
    addProductCategory(payload);
  }
};

const confirmDelete = () => {
  if (categoryToDelete.value) {
    deleteProductCategory(categoryToDelete.value.id);
  }
  deleteOpen.value = false;
  categoryToDelete.value = null;
};
</script>

<template>
  <div class="space-y-6">
    <PageHeader
      title="Catégories de produits"
      subtitle="Gérez les types de produits disponibles dans les marchés."
      action-label="Ajouter une catégorie"
      :action-icon="Plus"
      @action="openCreate"
    />

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <StatCard
        title="Total catégories"
        :value="productCategories.length"
        :icon="Tags"
        color="primary"
      />
      <StatCard
        title="Produits référencés"
        :value="productCategories.reduce((sum, c) => sum + (c.productsCount || 0), 0)"
        :icon="Tags"
        color="secondary"
      />
    </div>

    <FilterBar :show-clear="Boolean(searchQuery)" @clear="searchQuery = ''">
      <div class="flex-1 space-y-1 w-full">
        <label class="text-xs font-medium text-muted-foreground">Recherche</label>
        <div class="relative">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input v-model="searchQuery" placeholder="Nom ou description..." class="pl-9 bg-card" />
        </div>
      </div>
    </FilterBar>

    <CategoriesTable
      :categories="filteredCategories"
      :loading="loading"
      @edit="openEdit"
      @delete="openDelete"
    />

    <CategoryFormDialog
      v-model:open="formOpen"
      :category="editingCategory"
      @submit="handleFormSubmit"
    />

    <AlertDialog v-model:open="deleteOpen">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer cette catégorie ?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action est irréversible. La catégorie
            <strong>{{ categoryToDelete?.name }}</strong>
            sera retirée du catalogue. Les catégories utilisées par des produits ou des marchés ne peuvent pas être supprimées.
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