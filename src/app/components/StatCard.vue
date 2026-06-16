<script setup>
import { Card, CardContent } from './ui/card'

const props = defineProps({
  title: { type: String, required: true },
  value: { type: [String, Number], required: true },
   icon: { type: [Object, Function], required: true }, // Component definition
  trend: { type: Object, default: null }, // { value: string, isPositive: boolean }
  subtitle: { type: String, default: '' },
  color: { type: String, default: 'primary' } // 'primary' | 'secondary' | 'success' | 'warning'
})

const colorClasses = {
  primary: 'bg-primary/10 text-primary',
  secondary: 'bg-secondary/10 text-secondary',
  success: 'bg-green-500/10 text-green-500', // success doesn't exist in default tailwind, using green-500 or custom
  warning: 'bg-yellow-500/10 text-yellow-500',
}
</script>

<template>
  <Card>
    <CardContent class="p-6">
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <p class="text-sm text-muted-foreground mb-1">{{ props.title }}</p>
          <h3 class="text-2xl font-semibold text-foreground mb-1">{{ props.value }}</h3>
          <p v-if="props.subtitle" class="text-xs text-muted-foreground">{{ props.subtitle }}</p>
          <div v-if="props.trend" class="mt-2 flex items-center gap-1">
            <span
              :class="[
                'text-xs font-medium',
                props.trend.isPositive ? 'text-green-500' : 'text-red-500' // success/destructive replacements
              ]"
            >
              {{ props.trend.isPositive ? '↑' : '↓' }} {{ props.trend.value }}
            </span>
            <span class="text-xs text-muted-foreground"></span>
          </div>
        </div>
        <div :class="['w-12 h-12 rounded-lg flex items-center justify-center', colorClasses[props.color] || colorClasses.primary]">
          <component :is="props.icon" class="w-6 h-6" />
        </div>
      </div>
    </CardContent>
  </Card>
</template>
