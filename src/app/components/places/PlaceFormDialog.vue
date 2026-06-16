<script setup>
import { ref, watch } from 'vue';
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
  defaultMarketId: { type: String, default: '' },
});

const emit = defineEmits(['update:open', 'submit']);

const form = ref({
  id: '',
  marketId: '',
  blockName: '',
  rowName: '',
  category: '',
});

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) return;
    form.value = {
      id: '',
      marketId: props.defaultMarketId || props.markets[0]?.id || '',
      blockName: '',
      rowName: '',
      category: '',
    };
  },
);

const close = () => emit('update:open', false);

const handleSubmit = () => {
  if (!form.value.id.trim() || !form.value.marketId) return;
  emit('submit', {
    id: form.value.id.trim(),
    marketId: form.value.marketId,
    blockName: form.value.blockName.trim() || 'Bloc A',
    rowName: form.value.rowName.trim() || 'Allée 1',
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
        <DialogDescription>Ajouter un étal au registre du marché.</DialogDescription>
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
        <div class="grid grid-cols-2 gap-3">
          <div class="space-y-2">
            <Label for="block">Bloc</Label>
            <Input id="block" v-model="form.blockName" placeholder="Bloc A" />
          </div>
          <div class="space-y-2">
            <Label for="row">Allée</Label>
            <Input id="row" v-model="form.rowName" placeholder="Allée 1" />
          </div>
        </div>
        <div class="space-y-2">
          <Label for="category">Filière (optionnel)</Label>
          <Input id="category" v-model="form.category" placeholder="Poissonnerie" />
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" @click="close">Annuler</Button>
          <Button type="submit">Créer</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>