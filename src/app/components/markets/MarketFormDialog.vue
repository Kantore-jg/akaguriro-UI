<script setup>
import { ref, watch, computed } from 'vue';
import { Store } from 'lucide-vue-next';
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
  market: { type: Object, default: null },
});

const emit = defineEmits(['update:open', 'submit']);

const CITIES = ['Bujumbura', 'Gitega', 'Ngozi', 'Rumonge', 'Muyinga', 'Kirundo', 'Makamba'];

const form = ref({
  name: '',
  city: 'Bujumbura',
  location: '',
  description: '',
  totalPlaces: 50,
  image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600',
  categoryTags: '',
});

const isEditing = computed(() => Boolean(props.market?.id));

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
        image: props.market.image || '',
        categoryTags: (props.market.categoryTags || []).join(', '),
      };
    } else {
      form.value = {
        name: '',
        city: 'Bujumbura',
        location: '',
        description: '',
        totalPlaces: 50,
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600',
        categoryTags: '',
      };
    }
  },
);

const close = () => emit('update:open', false);

const handleSubmit = () => {
  if (!form.value.name.trim() || !form.value.location.trim()) return;

  const categoryTags = form.value.categoryTags
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);

  emit('submit', {
    ...(props.market || {}),
    name: form.value.name.trim(),
    city: form.value.city,
    location: form.value.location.trim(),
    description: form.value.description.trim(),
    totalPlaces: Number(form.value.totalPlaces) || 0,
    image: form.value.image.trim(),
    coverImage: form.value.image.trim(),
    categoryTags,
  });
  close();
};
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle class="flex items-center gap-2">
          <Store class="w-5 h-5 text-primary" />
          {{ isEditing ? 'Modifier le marché' : 'Nouveau marché' }}
        </DialogTitle>
        <DialogDescription>
          {{ isEditing ? 'Mettez à jour les informations du marché public.' : 'Enregistrez un nouveau marché dans le réseau Akaguriro.' }}
        </DialogDescription>
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
          <Label for="market-tags">Catégories (séparées par virgule)</Label>
          <Input id="market-tags" v-model="form.categoryTags" placeholder="Poissons, Vivres, Textiles" />
        </div>

        <div class="space-y-2">
          <Label for="market-image">URL de l'image</Label>
          <Input id="market-image" v-model="form.image" placeholder="https://..." />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" @click="close">Annuler</Button>
          <Button type="submit">{{ isEditing ? 'Enregistrer' : 'Créer le marché' }}</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>