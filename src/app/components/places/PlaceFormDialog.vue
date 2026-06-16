<script setup>
import { ref, watch, computed } from 'vue';
import Button from '../ui/Button.vue';
import Input from '../ui/Input.vue';
import Label from '../ui/Label.vue';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

const props = defineProps({
  open: { type: Boolean, default: false },
  markets: { type: Array, default: () => [] },
  blocks: { type: Array, default: () => [] },
  defaultMarketId: { type: String, default: '' },
  defaultBlockId: { type: [String, Number], default: '' },
});

const emit = defineEmits(['update:open', 'submit', 'create-block']);

const form = ref({
  id: '',
  marketId: '',
  blockId: '',
  category: '',
});

const blocksForMarket = computed(() =>
  props.blocks.filter((b) => String(b.marketId) === String(form.value.marketId)),
);

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) return;
    form.value = {
      id: '',
      marketId: props.defaultMarketId || props.markets[0]?.id || '',
      blockId: props.defaultBlockId ? String(props.defaultBlockId) : '',
      category: '',
    };
  },
);

watch(
  () => form.value.marketId,
  () => {
    const stillValid = blocksForMarket.value.some(
      (b) => String(b.id) === String(form.value.blockId),
    );
    if (!stillValid) {
      form.value.blockId = blocksForMarket.value[0]?.id
        ? String(blocksForMarket.value[0].id)
        : '';
    }
  },
);

const close = () => emit('update:open', false);

const handleSubmit = () => {
  if (!form.value.id.trim() || !form.value.marketId || !form.value.blockId) return;
  emit('submit', {
    id: form.value.id.trim(),
    marketId: form.value.marketId,
    blockId: Number(form.value.blockId) || form.value.blockId,
    category: form.value.category.trim() || undefined,
  });
  close();
};
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Nouvel emplacement</DialogTitle>
        <DialogDescription>Ajouter un étal dans un bloc du marché.</DialogDescription>
      </DialogHeader>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="space-y-2">
          <Label for="place-id">Code étal</Label>
          <Input id="place-id" v-model="form.id" placeholder="ex. A-04" required />
        </div>

        <div class="space-y-2">
          <Label>Marché</Label>
          <Select v-model="form.marketId">
            <SelectTrigger>
              <SelectValue placeholder="Choisir un marché" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="m in markets" :key="m.id" :value="m.id">
                {{ m.name }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <Label>Bloc</Label>
            <button
              type="button"
              class="text-xs font-semibold text-primary hover:underline"
              @click="emit('create-block', form.marketId)"
            >
              + Nouveau bloc
            </button>
          </div>
          <Select v-model="form.blockId" :disabled="!blocksForMarket.length">
            <SelectTrigger>
              <SelectValue :placeholder="blocksForMarket.length ? 'Choisir un bloc' : 'Aucun bloc — créez-en un'" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                v-for="b in blocksForMarket"
                :key="b.id"
                :value="String(b.id)"
              >
                {{ b.name }}{{ b.code ? ` (${b.code})` : '' }}
              </SelectItem>
            </SelectContent>
          </Select>
          <p v-if="!blocksForMarket.length" class="text-xs text-muted-foreground">
            Créez d'abord un bloc pour ce marché.
          </p>
        </div>

        <div class="space-y-2">
          <Label for="category">Filière (optionnel)</Label>
          <Input id="category" v-model="form.category" placeholder="Poissonnerie" />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" @click="close">Annuler</Button>
          <Button type="submit" :disabled="!form.blockId">Créer</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>