<script setup>
import { ref, watch } from 'vue';
import { Upload } from 'lucide-vue-next';
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

const props = defineProps({
  open: { type: Boolean, default: false },
  merchant: { type: Object, default: null },
  marketName: { type: String, default: '' },
  marketId: { type: [Number, String], default: null },
});

const emit = defineEmits(['update:open', 'submit']);

const month = ref('Juin 2026');
const amount = ref(35000);
const file = ref(null);
const fileName = ref('');

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) return;
    month.value = 'Juin 2026';
    amount.value = 35000;
    file.value = null;
    fileName.value = '';
  },
);

const close = () => emit('update:open', false);

const onFileChange = (e) => {
  const selected = e.target.files?.[0];
  file.value = selected || null;
  fileName.value = selected?.name || '';
};

const handleSubmit = () => {
  if (!props.merchant || amount.value <= 0 || !file.value) return;
  emit('submit', {
    merchantId: props.merchant.id,
    merchantName: props.merchant.name,
    marketId: props.marketId,
    marketName: props.marketName,
    month: month.value,
    amount: Number(amount.value),
    file: file.value,
    reference: month.value,
  });
  close();
};
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle class="flex items-center gap-2">
          <Upload class="w-5 h-5 text-primary" />
          Transmettre un reçu
        </DialogTitle>
        <DialogDescription>
          Téléversez votre quittance de redevance mensuelle (PDF ou image).
        </DialogDescription>
      </DialogHeader>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="space-y-2">
          <Label for="rec-month">Mois de redevance</Label>
          <Input id="rec-month" v-model="month" required />
        </div>
        <div class="space-y-2">
          <Label for="rec-amount">Montant (BIF)</Label>
          <Input id="rec-amount" v-model.number="amount" type="number" min="1" required />
        </div>
        <div class="space-y-2">
          <Label for="rec-file">Fichier justificatif</Label>
          <Input id="rec-file" type="file" accept="image/*,.pdf" @change="onFileChange" required />
          <p v-if="fileName" class="text-xs text-muted-foreground">{{ fileName }}</p>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" @click="close">Annuler</Button>
          <Button type="submit" :disabled="!file">Soumettre</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>