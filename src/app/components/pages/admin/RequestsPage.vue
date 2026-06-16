<script setup>
import { ref, computed } from 'vue';
import { FileText, Search, CheckCircle, XCircle } from 'lucide-vue-next';
import { useApp } from '../../../../composables/useApp.js';
import { useAdminScope } from '../../../../composables/useAdminScope.js';
import StatCard from '../../StatCard.vue';
import Badge from '../../ui/Badge.vue';
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

const { updateRequestStatus } = useApp();
const { scopedRequests, scopedMarkets, findMarket } = useAdminScope();

const searchQuery = ref('');
const statusFilter = ref('all');

const filteredRequests = computed(() =>
  scopedRequests.value.filter((r) => {
    const q = searchQuery.value.toLowerCase();
    const matchesQuery =
      !q ||
      r.merchantName.toLowerCase().includes(q) ||
      r.activityType.toLowerCase().includes(q);
    const matchesStatus = statusFilter.value === 'all' || r.status === statusFilter.value;
    return matchesQuery && matchesStatus;
  }),
);

const pendingCount = computed(() =>
  scopedRequests.value.filter((r) => r.status === 'pending').length,
);

const statusBadge = (status) => {
  const map = {
    pending: { label: 'En attente', variant: 'secondary' },
    approved: { label: 'Approuvé', variant: 'default' },
    rejected: { label: 'Rejeté', variant: 'destructive' },
  };
  return map[status] || { label: status, variant: 'secondary' };
};
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-semibold text-foreground">Demandes d'emplacement</h1>
      <p class="text-sm text-muted-foreground mt-1">
        Validation des dossiers d'octroi d'étals par la mairie
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard title="Total dossiers" :value="scopedRequests.length" :icon="FileText" color="primary" />
      <StatCard title="En attente" :value="pendingCount" :icon="FileText" color="warning" />
      <StatCard
        title="Traités"
        :value="scopedRequests.length - pendingCount"
        :icon="FileText"
        color="success"
      />
    </div>

    <Card>
      <CardContent class="p-4 flex flex-col sm:flex-row gap-3">
        <div class="relative flex-1">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input v-model="searchQuery" placeholder="Rechercher un candidat..." class="pl-9" />
        </div>
        <Select v-model="statusFilter">
          <SelectTrigger class="w-full sm:w-44">
            <SelectValue placeholder="Tous statuts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous statuts</SelectItem>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="approved">Approuvé</SelectItem>
            <SelectItem value="rejected">Rejeté</SelectItem>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>

    <div v-if="!filteredRequests.length" class="text-center py-16 rounded-lg border border-border bg-card text-muted-foreground text-sm">
      Aucun dossier trouvé.
    </div>

    <div v-else class="space-y-4">
      <Card v-for="item in filteredRequests" :key="item.id">
        <CardContent class="p-5 space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div>
              <h3 class="font-semibold text-foreground">{{ item.merchantName }}</h3>
              <p class="text-sm text-muted-foreground">{{ item.merchantPhone }}</p>
              <p class="text-xs text-muted-foreground mt-1">
                {{ findMarket(item.requestedMarketId)?.name }} — {{ item.submittedDate }}
              </p>
            </div>
            <Badge :variant="statusBadge(item.status).variant">
              {{ statusBadge(item.status).label }}
            </Badge>
          </div>

          <div class="text-sm bg-muted/40 rounded-lg p-4 space-y-1 border border-border">
            <p><span class="font-medium">Activité :</span> {{ item.activityType }}</p>
            <p><span class="font-medium">Filière :</span> {{ item.category }}</p>
            <p class="text-muted-foreground">{{ item.description }}</p>
          </div>

          <div v-if="item.status === 'pending'" class="flex gap-2 justify-end">
            <Button
              variant="outline"
              class="text-destructive border-destructive/30 hover:bg-destructive/10"
              @click="updateRequestStatus(item.id, 'rejected')"
            >
              <XCircle class="w-4 h-4 mr-2" />
              Rejeter
            </Button>
            <Button @click="updateRequestStatus(item.id, 'approved')">
              <CheckCircle class="w-4 h-4 mr-2" />
              Approuver & assigner
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>