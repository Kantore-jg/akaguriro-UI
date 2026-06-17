<script setup>
import Button from '../ui/Button.vue';

defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  actionLabel: { type: String, default: '' },
  actionIcon: { type: [Object, Function], default: null },
});

const emit = defineEmits(['action']);
</script>

<template>
  <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
    <div>
      <h1 class="bs-page-title">{{ title }}</h1>
      <p v-if="subtitle" class="bs-page-subtitle">{{ subtitle }}</p>
    </div>
    <Button
      v-if="actionLabel"
      class="rounded-full shadow-sm"
      @click="emit('action')"
    >
      <component v-if="actionIcon" :is="actionIcon" class="w-4 h-4" />
      {{ actionLabel }}
    </Button>
    <slot name="actions" />
  </div>
</template>