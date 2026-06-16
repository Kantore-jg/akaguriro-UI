<script setup>
import { useApp } from '../composables/useApp.js';
import PublicLEDView from './PublicLEDView.vue';

const { toast } = useApp();
</script>

<template>
  <div class="relative">
    <PublicLEDView />
    <div
      v-if="toast"
      class="fixed bottom-5 right-5 z-50 bg-slate-900 border border-slate-700 p-4 rounded-xl shadow-2xl flex items-center gap-3 text-white"
    >
      <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
      <span class="text-xs font-bold">{{ toast.message }}</span>
    </div>
  </div>
</template>