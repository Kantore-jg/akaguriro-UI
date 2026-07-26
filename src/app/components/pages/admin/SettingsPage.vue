<script setup>
import { computed, onMounted, ref } from 'vue';
import { RefreshCw, ShieldCheck, Save } from 'lucide-vue-next';
import { useApp } from '../../../../composables/useApp.js';
import { getErrorMessage } from '../../../../api/client.js';
import { fetchRolePermissions, updateRolePermissions } from '../../../../api/services/data.js';
import PageHeader from '../../layout/PageHeader.vue';
import Button from '../../ui/Button.vue';
import Badge from '../../ui/Badge.vue';
import { Checkbox } from '../../ui/checkbox';
import { Card, CardContent } from '../../ui/card';
import Separator from '../../ui/Separator.vue';

const { showToast } = useApp();

const loading = ref(false);
const savingRoleId = ref(null);
const roles = ref([]);
const permissions = ref([]);
const dirtyRoles = ref(new Map());

const groupedPermissions = computed(() => {
  const groups = {};
  permissions.value.forEach((permission) => {
    if (!groups[permission.group]) {
      groups[permission.group] = [];
    }
    groups[permission.group].push(permission);
  });

  return Object.entries(groups).map(([group, items]) => ({
    group,
    items,
  }));
});

async function loadPermissions() {
  loading.value = true;
  try {
    const payload = await fetchRolePermissions();
    roles.value = payload.roles;
    permissions.value = payload.permissions;
    dirtyRoles.value = new Map();
  } catch (error) {
    showToast(getErrorMessage(error, 'Impossible de charger les permissions'), 'error');
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  void loadPermissions();
});

function isChecked(role, permissionName) {
  return (dirtyRoles.value.get(role.id) || role.permissions || []).includes(permissionName);
}

function normalizePermissions(list) {
  return [...new Set(list)].sort();
}

function setRolePermission(role, permissionName, checked) {
  const current = new Set(dirtyRoles.value.get(role.id) || role.permissions || []);
  if (checked) {
    current.add(permissionName);
  } else {
    current.delete(permissionName);
  }

  const next = Array.from(current);
  const map = new Map(dirtyRoles.value);
  if (normalizePermissions(next).join('|') === normalizePermissions(role.permissions || []).join('|')) {
    map.delete(role.id);
  } else {
    map.set(role.id, next);
  }
  dirtyRoles.value = map;
}

function resetRole(role) {
  const map = new Map(dirtyRoles.value);
  map.delete(role.id);
  dirtyRoles.value = map;
}

function rolePermissions(role) {
  return dirtyRoles.value.get(role.id) || role.permissions || [];
}

function rolePermissionsCount(role) {
  return rolePermissions(role).length;
}

const hasChanges = computed(() => dirtyRoles.value.size > 0);

async function saveRole(role) {
  if (!role.editable) return;

  savingRoleId.value = role.id;
  try {
    const updated = await updateRolePermissions(role.id, rolePermissions(role));
    roles.value = roles.value.map((item) =>
      item.id === role.id ? { ...item, permissions: updated.permissions } : item,
    );
    const map = new Map(dirtyRoles.value);
    map.delete(role.id);
    dirtyRoles.value = map;
    showToast(`Rôle "${role.label}" mis à jour`, 'success');
  } catch (error) {
    showToast(getErrorMessage(error, 'Impossible de mettre à jour ce rôle'), 'error');
  } finally {
    savingRoleId.value = null;
  }
}

async function refresh() {
  await loadPermissions();
}
</script>

<template>
  <div class="space-y-6">


    <div class="grid gap-4 md:grid-cols-3">
      <Card>
        <CardContent class="p-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-muted-foreground">Rôles</p>
              <p class="text-2xl font-bold">{{ roles.length }}</p>
            </div>
            <ShieldCheck class="w-5 h-5 text-primary" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent class="p-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-muted-foreground">Permissions</p>
              <p class="text-2xl font-bold">{{ permissions.length }}</p>
            </div>
            <ShieldCheck class="w-5 h-5 text-primary" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent class="p-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-muted-foreground">Modifications en attente</p>
              <p class="text-2xl font-bold">{{ dirtyRoles.size }}</p>
            </div>
            <Save class="w-5 h-5 text-primary" />
          </div>
        </CardContent>
      </Card>
    </div>

    <div v-if="loading" class="text-sm text-muted-foreground">
      Chargement des rôles et permissions...
    </div>

    <div v-else class="space-y-4">
      <Card v-for="role in roles" :key="role.id">
        <CardContent class="p-6 space-y-5">
          <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div class="flex items-center gap-2">
                <h2 class="text-lg font-semibold">{{ role.label }}</h2>
                <Badge variant="secondary">
                  {{ rolePermissionsCount(role) }} permissions
                </Badge>
                <Badge v-if="!role.editable" class="bg-muted text-muted-foreground">
                  Protégé
                </Badge>
              </div>
              <p class="text-sm text-muted-foreground">
                Cochez les permissions à accorder à ce rôle puis enregistrez.
              </p>
            </div>

            <div class="flex items-center gap-2">
              <Button
                v-if="role.editable"
                variant="outline"
                :disabled="savingRoleId === role.id || !dirtyRoles.has(role.id)"
                @click="resetRole(role)"
              >
                Réinitialiser
              </Button>
              <Button
                :disabled="savingRoleId === role.id || !role.editable || !dirtyRoles.has(role.id)"
                @click="saveRole(role)"
              >
                <Save class="w-4 h-4" />
                {{ savingRoleId === role.id ? 'Sauvegarde...' : 'Enregistrer' }}
              </Button>
            </div>
          </div>

          <Separator />

          <div class="space-y-5">
            <div v-for="group in groupedPermissions" :key="group.group" class="space-y-3">
              <h3 class="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                {{ group.group }}
              </h3>
              <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                <label
                  v-for="permission in group.items"
                  :key="permission.id"
                  class="flex items-start gap-3 rounded-xl border border-border bg-card px-4 py-3 hover:border-primary/40 transition-colors"
                  :class="!role.editable && 'opacity-70'"
                >
                  <Checkbox
                    :checked="isChecked(role, permission.name)"
                    :disabled="!role.editable"
                    @update:checked="(checked) => setRolePermission(role, permission.name, checked)"
                  />
                  <div class="min-w-0">
                    <div class="font-medium leading-tight">{{ permission.label }}</div>
                    <div class="text-xs text-muted-foreground break-all">{{ permission.name }}</div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
