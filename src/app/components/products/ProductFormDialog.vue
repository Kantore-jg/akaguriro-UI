<script setup>
import { ref, watch, computed } from 'vue';
import { Package } from 'lucide-vue-next';
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

const CATEGORIES = ['Poissons', 'Café & Thé', 'Fruits & Légumes', 'Vivres', 'Textiles'];

const props = defineProps({
  open: { type: Boolean, default: false },
  product: { type: Object, default: null },
  markets: { type: Array, default: () => [] },
  merchants: { type: Array, default: () => [] },
  isMerchant: { type: Boolean, default: false },
  defaultMerchant: { type: Object, default: null },
  defaultMarketId: { type: String, default: '' },
});

const emit = defineEmits(['update:open', 'submit']);

const form = ref({
  name: '',
  price: 10000,
  category: 'Fruits & Légumes',
  unit: 'kg',
  description: '',
  stock: 50,
  image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400',
  marketId: '',
  merchantId: '',
  available: true,
  isTrending: false,
});

const isEditing = computed(() => Boolean(props.product?.id));

const merchantsForMarket = computed(() => {
  if (!form.value.marketId) return props.merchants;
  return props.merchants.filter((m) => m.activeMarketId === form.value.marketId);
});

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) return;
    if (props.product) {
      form.value = {
        name: props.product.name,
        price: props.product.price,
        category: props.product.category,
        unit: props.product.unit,
        description: props.product.description || '',
        stock: props.product.stock,
        image: props.product.image,
        marketId: props.product.marketId,
        merchantId: props.product.merchantId,
        available: props.product.available ?? true,
        isTrending: props.product.isTrending ?? false,
      };
    } else {
      const merchant = props.defaultMerchant;
      form.value = {
        name: '',
        price: 10000,
        category: 'Fruits & Légumes',
        unit: 'kg',
        description: '',
        stock: 50,
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400',
        marketId: merchant?.activeMarketId || props.defaultMarketId || props.markets[0]?.id || '',
        merchantId: merchant?.id || props.merchants[0]?.id || '',
        available: true,
        isTrending: false,
      };
    }
  },
);

watch(
  () => form.value.marketId,
  () => {
    if (props.isMerchant) return;
    const stillValid = merchantsForMarket.value.some((m) => m.id === form.value.merchantId);
    if (!stillValid && merchantsForMarket.value.length) {
      form.value.merchantId = merchantsForMarket.value[0].id;
    }
  },
);

const close = () => emit('update:open', false);

const handleSubmit = () => {
  if (!form.value.name.trim() || form.value.price <= 0) return;

  const merchant = props.merchants.find((m) => m.id === form.value.merchantId);
  emit('submit', {
    ...(props.product || {}),
    name: form.value.name.trim(),
    price: Number(form.value.price),
    category: form.value.category,
    unit: form.value.unit.trim(),
    description: form.value.description.trim(),
    stock: Number(form.value.stock),
    image: form.value.image.trim(),
    marketId: form.value.marketId,
    merchantId: form.value.merchantId,
    placeNumber: merchant?.activePlaceId || 'A-01',
    available: form.value.available,
    isTrending: form.value.isTrending,
  });
  close();
};
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle class="flex items-center gap-2">
          <Package class="w-5 h-5 text-primary" />
          {{ isEditing ? 'Modifier le produit' : 'Nouveau produit' }}
        </DialogTitle>
        <DialogDescription>
          Référencez un article dans le catalogue national des marchés.
        </DialogDescription>
      </DialogHeader>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="space-y-2">
          <Label for="p-name">Désignation</Label>
          <Input id="p-name" v-model="form.name" placeholder="ex. Mukeke frais" required />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="space-y-2">
            <Label for="p-price">Prix (BIF)</Label>
            <Input id="p-price" v-model.number="form.price" type="number" min="1" required />
          </div>
          <div class="space-y-2">
            <Label for="p-unit">Unité</Label>
            <Input id="p-unit" v-model="form.unit" placeholder="kg" required />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="space-y-2">
            <Label>Catégorie</Label>
            <Select v-model="form.category">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="cat in CATEGORIES" :key="cat" :value="cat">
                  {{ cat }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="space-y-2">
            <Label for="p-stock">Stock</Label>
            <Input id="p-stock" v-model.number="form.stock" type="number" min="0" />
          </div>
        </div>

        <template v-if="!isMerchant">
          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-2">
              <Label>Marché</Label>
              <Select v-model="form.marketId">
                <SelectTrigger>
                  <SelectValue placeholder="Marché" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="m in markets" :key="m.id" :value="m.id">
                    {{ m.name }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="space-y-2">
              <Label>Commerçant</Label>
              <Select v-model="form.merchantId">
                <SelectTrigger>
                  <SelectValue placeholder="Commerçant" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="m in merchantsForMarket" :key="m.id" :value="m.id">
                    {{ m.name }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </template>

        <div class="space-y-2">
          <Label for="p-desc">Description</Label>
          <textarea
            id="p-desc"
            v-model="form.description"
            rows="3"
            class="flex w-full rounded-md border border-input bg-input-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
          />
        </div>

        <div class="space-y-2">
          <Label for="p-image">URL image</Label>
          <Input id="p-image" v-model="form.image" />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" @click="close">Annuler</Button>
          <Button type="submit">{{ isEditing ? 'Enregistrer' : 'Ajouter' }}</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>