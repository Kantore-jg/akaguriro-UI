<script setup>
import { UserRound, MoreHorizontal, Settings2 } from 'lucide-vue-next';
import Badge from '../ui/Badge.vue';
import Button from '../ui/Button.vue';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

defineProps({
  places: { type: Array, required: true },
  getMerchant: { type: Function, required: true },
  getMarketName: { type: Function, required: true },
});

const emit = defineEmits(['assign']);

const statusVariant = (status) => {
  if (status === 'occupée') return 'default';
  if (status === 'libre') return 'secondary';
  return 'outline';
};

const statusLabel = (status) => {
  const map = { occupée: 'Occupée', libre: 'Libre', maintenance: 'Maintenance' };
  return map[status] || status;
};
</script>

<template>
  <div class="rounded-lg border border-border bg-card">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Étal</TableHead>
          <TableHead>Marché</TableHead>
          <TableHead>Bloc / Allée</TableHead>
          <TableHead>Filière</TableHead>
          <TableHead>Occupant</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead class="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-if="!places.length">
          <TableCell colspan="7" class="text-center py-8 text-muted-foreground">
            Aucun emplacement trouvé.
          </TableCell>
        </TableRow>
        <TableRow v-for="place in places" :key="place.id + place.marketId">
          <TableCell class="font-medium">{{ place.id }}</TableCell>
          <TableCell class="text-sm">{{ getMarketName(place.marketId) }}</TableCell>
          <TableCell class="text-sm text-muted-foreground">
            {{ place.blockName }} · {{ place.rowName }}
          </TableCell>
          <TableCell>{{ place.category || '—' }}</TableCell>
          <TableCell>
            <div v-if="getMerchant(place.merchantId)" class="flex items-center gap-2">
              <img
                :src="getMerchant(place.merchantId).image"
                class="w-7 h-7 rounded-md object-cover"
              />
              <span class="text-sm">{{ getMerchant(place.merchantId).name }}</span>
            </div>
            <span v-else class="text-sm text-muted-foreground italic">Aucun</span>
          </TableCell>
          <TableCell>
            <Badge :variant="statusVariant(place.status)">
              {{ statusLabel(place.status) }}
            </Badge>
          </TableCell>
          <TableCell class="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal class="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem @click="emit('assign', place)">
                  <Settings2 class="w-4 h-4 mr-2" />
                  Gérer l'affectation
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>