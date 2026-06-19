<script setup>
import { ref, computed, onMounted } from 'vue';
import { Plus, Search, UserCog, UserCheck, UserX } from 'lucide-vue-next';
import { useApp } from '../../../../composables/useApp.js';
import { useAdminScope } from '../../../../composables/useAdminScope.js';
import PageHeader from '../../layout/PageHeader.vue';
import FilterBar from '../../layout/FilterBar.vue';
import StatCard from '../../StatCard.vue';
import UsersTable from '../../users/UsersTable.vue';
import UserFormDialog from '../../users/UserFormDialog.vue';
import Button from '../../ui/Button.vue';
import Input from '../../ui/Input.vue';
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

const {
  currentUser,
  usersLoading,
  loadUsers,
  addUser,
  updateUser,
  deleteUser,
  toggleUserActive,
} = useApp();

const { isSuperAdmin, scopedUsers, scopedMarkets } = useAdminScope();

const searchQuery = ref('');
const roleFilter = ref('all');
const statusFilter = ref('all');
const marketFilter = ref('all');
const formOpen = ref(false);
const deleteOpen = ref(false);
const editingUser = ref(null);
const userToDelete = ref(null);

const ALL_ROLES = [
  { value: 'SUPER_ADMIN', label: 'Super Administrateur' },
  { value: 'ADMIN_MARCHE', label: 'Admin Marché' },
  { value: 'COMMERCANT', label: 'Commerçant' },
  { value: 'USER', label: 'Utilisateur' },
];

const ROLES = computed(() =>
  isSuperAdmin.value
    ? ALL_ROLES
    : ALL_ROLES.filter((r) => ['COMMERCANT', 'USER'].includes(r.value)),
);

onMounted(() => {
  loadUsers();
});

const filteredUsers = computed(() =>
  scopedUsers.value.filter((u) => {
    const q = searchQuery.value.toLowerCase();
    const matchesQuery =
      !q ||
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.phone.includes(q);
    const matchesRole = roleFilter.value === 'all' || u.role === roleFilter.value;
    const matchesStatus =
      statusFilter.value === 'all' ||
      (statusFilter.value === 'active' && u.isActive) ||
      (statusFilter.value === 'inactive' && !u.isActive);
    const matchesMarket =
      marketFilter.value === 'all' || u.marketId === marketFilter.value;
    return matchesQuery && matchesRole && matchesStatus && matchesMarket;
  }),
);

const activeCount = computed(() => scopedUsers.value.filter((u) => u.isActive).length);
const inactiveCount = computed(() => scopedUsers.value.filter((u) => !u.isActive).length);

const openCreate = () => {
  editingUser.value = null;
  formOpen.value = true;
};

const openEdit = (user) => {
  editingUser.value = user;
  formOpen.value = true;
};

const openDelete = (user) => {
  userToDelete.value = user;
  deleteOpen.value = true;
};

const handleFormSubmit = (payload) => {
  if (payload.id) {
    updateUser(payload);
  } else {
    addUser(payload);
  }
};

const confirmDelete = () => {
  if (userToDelete.value) {
    deleteUser(userToDelete.value.id);
  }
  deleteOpen.value = false;
  userToDelete.value = null;
};

const handleToggleActive = (user, isActive) => {
  toggleUserActive(user.id, isActive);
};
</script>

<template>
  <div class="space-y-6">
    <PageHeader
      title="Gestion Des Utilisateurs"
      :subtitle="isSuperAdmin
        ? 'Création, modification et contrôle des accès au système.'
        : 'Gestion des comptes liés à votre marché (commerçants et utilisateurs).'"
      action-label="Ajouter un utilisateur"
      :action-icon="Plus"
      @action="openCreate"
    />

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard
        title="Utilisateurs enregistrés"
        :value="scopedUsers.length"
        :icon="UserCog"
        color="primary"
      />
      <StatCard
        title="Comptes actifs"
        :value="activeCount"
        :icon="UserCheck"
        color="success"
      />
      <StatCard
        title="Comptes désactivés"
        :value="inactiveCount"
        :icon="UserX"
        color="warning"
      />
    </div>

    <FilterBar
      :show-clear="searchQuery || roleFilter !== 'all' || statusFilter !== 'all' || (isSuperAdmin && marketFilter !== 'all')"
      @clear="searchQuery = ''; roleFilter = 'all'; statusFilter = 'all'; marketFilter = 'all'"
    >
      <div class="flex-1 space-y-1 w-full">
        <label class="text-xs font-medium text-muted-foreground">Recherche</label>
        <div class="relative">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input v-model="searchQuery" placeholder="Nom, email, téléphone..." class="pl-9 bg-card" />
        </div>
      </div>
      <div class="space-y-1 w-full lg:w-44">
        <label class="text-xs font-medium text-muted-foreground">Rôle</label>
        <Select v-model="roleFilter">
          <SelectTrigger class="bg-card"><SelectValue placeholder="Tous" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les rôles</SelectItem>
            <SelectItem v-for="r in ROLES" :key="r.value" :value="r.value">{{ r.label }}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div class="space-y-1 w-full lg:w-40">
        <label class="text-xs font-medium text-muted-foreground">Statut</label>
        <Select v-model="statusFilter">
          <SelectTrigger class="bg-card"><SelectValue placeholder="Tous" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="active">Actifs</SelectItem>
            <SelectItem value="inactive">Désactivés</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div v-if="isSuperAdmin" class="space-y-1 w-full lg:w-44">
        <label class="text-xs font-medium text-muted-foreground">Marché</label>
        <Select v-model="marketFilter">
          <SelectTrigger class="bg-card"><SelectValue placeholder="Tous" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les marchés</SelectItem>
            <SelectItem v-for="m in scopedMarkets" :key="m.id" :value="m.id">{{ m.name }}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </FilterBar>

    <UsersTable
      :users="filteredUsers"
      :current-user-id="currentUser.id"
      :loading="usersLoading"
      @edit="openEdit"
      @delete="openDelete"
      @toggle-active="handleToggleActive"
    />

    <UserFormDialog
      v-model:open="formOpen"
      :user="editingUser"
      @submit="handleFormSubmit"
    />

    <AlertDialog v-model:open="deleteOpen">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer cet utilisateur ?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action est irréversible. Le compte
            <strong>{{ userToDelete?.name }}</strong>
            sera définitivement supprimé du système.
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