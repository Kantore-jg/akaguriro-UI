<script setup>
import { ref, watch, computed } from 'vue';
import { Store, Upload } from 'lucide-vue-next';
import { useApp } from '../../../composables/useApp.js';
import Button from '../ui/Button.vue';
import Input from '../ui/Input.vue';
import Label from '../ui/Label.vue';
import ProductCategoryMultiSelect from './ProductCategoryMultiSelect.vue';
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
  market: { type: Object, default: null },
});

const emit = defineEmits(['update:open', 'submit']);

const { productCategories } = useApp();

const CITIES = ['Bujumbura', 'Gitega', 'Ngozi', 'Rumonge', 'Muyinga', 'Kirundo', 'Makamba'];

const form = ref({
  name: '',
  city: 'Bujumbura',
  location: '',
  description: '',
  totalPlaces: 50,
  productCategoryIds: [],
});

const imageFile = ref(null);
const imagePreview = ref(null);

const isEditing = computed(() => Boolean(props.market?.id));

function resetImage(marketImage = null) {
  imageFile.value = null;
  imagePreview.value = marketImage || null;
}

function onImageChange(e) {
  const file = e.target.files?.[0];
  imageFile.value = file || null;
  imagePreview.value = file ? URL.createObjectURL(file) : props.market?.image || null;
}

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) return;
    if (props.market) {
      form.value = {
        name: props.market.name || '',
        city: props.market.city || 'Bujumbura',
        location: props.market.location || '',
        description: props.market.description || '',
        totalPlaces: props.market.totalPlaces || 50,
        productCategoryIds: [...(props.market.productCategoryIds || [])],
      };
      resetImage(props.market.image || props.market.coverImage);
    } else {
      form.value = {
        name: '',
        city: 'Bujumbura',
        location: '',
        description: '',
        totalPlaces: 50,
        productCategoryIds: [],
      };
      resetImage();
    }
  },
);

const close = () => emit('update:open', false);

const handleSubmit = () => {
  if (!form.value.name.trim() || !form.value.location.trim()) return;
  if (!isEditing.value && !imageFile.value) return;

  emit('submit', {
    ...(props.market || {}),
    name: form.value.name.trim(),
    city: form.value.city,
    location: form.value.location.trim(),
    description: form.value.description.trim(),
    totalPlaces: Number(form.value.totalPlaces) || 0,
    productCategoryIds: form.value.productCategoryIds,
    imageFile: imageFile.value,
  });
  close();
};
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="sm:max-w-lg max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle class="flex items-center gap-2">
          <Store class="w-5 h-5 text-primary" />
          {{ isEditing ? 'Modifier le marché' : 'Nouveau marché' }}
        </DialogTitle>
        <!-- <DialogDescription>
          {{ isEditing ? 'Mettez à jour les informations du marché public.' : 'Enregistrez un nouveau marché dans le réseau Akaguriro.' }}
        </DialogDescription> -->
      </DialogHeader>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="space-y-2">
          <Label for="market-name">Nom du marché</Label>
          <Input id="market-name" v-model="form.name" placeholder="Marché Central de..." required />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label>Ville</Label>
            <Select v-model="form.city">
              <SelectTrigger>
                <SelectValue placeholder="Choisir une ville" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="city in CITIES" :key="city" :value="city">
                  {{ city }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="space-y-2">
            <Label for="market-places">Capacité (étals)</Label>
            <Input id="market-places" v-model.number="form.totalPlaces" type="number" min="1" required />
          </div>
        </div>

        <div class="space-y-2">
          <Label for="market-location">Adresse / Localisation</Label>
          <Input id="market-location" v-model="form.location" placeholder="Quartier, avenue..." required />
        </div>

        <div class="space-y-2">
          <Label for="market-description">Description</Label>
          <textarea
            id="market-description"
            v-model="form.description"
            rows="3"
            class="flex w-full rounded-md border border-input bg-input-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
            placeholder="Description du marché..."
          />
        </div>

        <div class="space-y-2">
          <Label>Types de produits (optionnel)</Label>
          <ProductCategoryMultiSelect
            v-model="form.productCategoryIds"
            :options="productCategories"
            placeholder="Choisir les catégories de produits..."
          />
        </div>

        <div class="space-y-2">
          <Label>Image du marché</Label>
          <div class="flex items-center gap-4">
            <div class="w-20 h-20 rounded-xl bg-muted border overflow-hidden shrink-0">
              <img v-if="imagePreview" :src="imagePreview" alt="Aperçu" class="w-full h-full object-cover" />
            </div>
            <label class="cursor-pointer">
              <span class="inline-flex items-center gap-2 text-xs font-semibold text-primary border border-input px-3 py-2 rounded-lg hover:bg-muted transition-colors">
                <Upload class="w-4 h-4" />
                {{ isEditing ? 'Changer l\'image' : 'Sélectionner une image' }}
              </span>
              <input type="file" accept="image/*" class="hidden" @change="onImageChange" />
            </label>
          </div>
          <p v-if="!isEditing && !imageFile" class="text-xs text-muted-foreground">Image requise pour la création</p>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" @click="close">Annuler</Button>
          <Button type="submit" :disabled="!isEditing && !imageFile">
            {{ isEditing ? 'Enregistrer' : 'Créer le marché' }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>