<template>
  <div class="w-full min-h-screen bg-neutral-950 text-neutral-100 p-4 sm:p-6 lg:p-8">
    <div class="w-full px-2 sm:px-4">
      
      <div class="mb-6">
        <p class="text-neutral-400 text-sm">Ingredient Stock Management Control</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8 w-full">
        
        <div 
          class="p-6 rounded-xl border transition-all shadow-sm flex items-center gap-4"
          :class="lowStockCount > 0 
            ? 'bg-red-950/40 border-red-500/30 text-red-200' 
            : 'bg-neutral-900 border-neutral-800 text-neutral-400'"
        >
          <span class="text-2xl text-red-400 animate-pulse">⚠</span>
          <div>
            <p class="text-lg font-semibold text-white">{{ lowStockCount }} ingredients</p>
            <p class="text-sm text-neutral-400">Require immediate reordering</p>
          </div>
        </div>

        <div class="bg-neutral-900 border border-neutral-800 p-6 rounded-xl flex items-center gap-4 shadow-sm">
          <span class="text-2xl text-emerald-400">💰</span>
          <div>
            <p class="text-sm text-neutral-400">Total Stock Value</p>
            <p class="text-2xl font-mono font-bold text-emerald-400">KES {{ totalStockValue.toLocaleString() }}</p>
          </div>
        </div>

      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 w-full">
        <div 
          v-for="ing in sortedIngredients" 
          :key="ing.id"
          class="bg-neutral-900 border border-neutral-800 rounded-xl p-5 sm:p-6 flex flex-col justify-between shadow-sm hover:border-neutral-700 transition-colors"
        >
          <div>
            <div class="flex items-center justify-between mb-5 gap-2">
              <div class="flex items-center gap-2.5 min-w-0">
                <span 
                  class="w-2.5 h-2.5 rounded-full shrink-0"
                  :class="{
                    'bg-red-500': ing.current_stock === 0,
                    'bg-amber-500': ing.current_stock > 0 && ing.current_stock <= ing.reorder_level,
                    'bg-emerald-500': ing.current_stock > ing.reorder_level
                  }"
                ></span>
                <h3 class="text-lg font-bold text-white truncate">{{ ing.name }}</h3>
              </div>
              
              <span 
                class="text-[10px] sm:text-xs px-2 py-0.5 rounded font-mono font-medium shrink-0 uppercase tracking-wider"
                :class="{
                  'bg-red-500/10 text-red-400 border border-red-500/20': ing.current_stock === 0,
                  'bg-amber-500/10 text-amber-400 border border-amber-500/20': ing.current_stock > 0 && ing.current_stock <= ing.reorder_level,
                  'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20': ing.current_stock > ing.reorder_level
                }"
              >
                {{ ing.current_stock === 0 ? 'Empty' : (ing.current_stock <= ing.reorder_level ? 'Warning' : 'Healthy') }}
              </span>
            </div>

            <div class="space-y-3 text-sm text-neutral-400">
              <div class="flex justify-between items-center border-b border-neutral-800/50 pb-1.5">
                <span>Current Stock:</span>
                <span class="text-neutral-200 font-mono font-medium">{{ ing.current_stock }} {{ ing.unit }}</span>
              </div>
              <div class="flex justify-between items-center border-b border-neutral-800/50 pb-1.5">
                <span>Reorder Threshold:</span>
                <span class="text-neutral-300 font-mono">{{ ing.reorder_level }} {{ ing.unit }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span>Cost Per Unit:</span>
                <span class="text-neutral-300 font-mono">KES {{ ing.cost_per_unit }}/{{ ing.unit }}</span>
              </div>
            </div>
          </div>

          <div class="mt-6 pt-4 border-t border-neutral-800 flex justify-between items-center text-xs text-neutral-500">
            <span class="uppercase tracking-wider font-medium">Value on Hand</span>
            <span class="text-base font-bold text-neutral-200 font-mono">KES {{ (ing.current_stock * ing.cost_per_unit).toLocaleString() }}</span>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const ingredients = ref([
  { id: 1, name: 'Yeast', current_stock: 2, reorder_level: 1, unit: 'kg', cost_per_unit: 800 },
  { id: 2, name: 'Sugar', current_stock: 30, reorder_level: 10, unit: 'kg', cost_per_unit: 150 },
  { id: 3, name: 'Cocoa Powder', current_stock: 5, reorder_level: 3, unit: 'kg', cost_per_unit: 600 },
  { id: 4, name: 'Butter', current_stock: 8, reorder_level: 5, unit: 'kg', cost_per_unit: 500 },
  { id: 5, name: 'Milk', current_stock: 20, reorder_level: 10, unit: 'litres', cost_per_unit: 70 },
  { id: 6, name: 'Flour', current_stock: 50, reorder_level: 20, unit: 'kg', cost_per_unit: 120 },
  { id: 7, name: 'Salt', current_stock: 0, reorder_level: 2, unit: 'kg', cost_per_unit: 50 } 
])

const lowStockCount = computed(() => {
  return ingredients.value.filter(ing => ing.current_stock <= ing.reorder_level).length
})

const totalStockValue = computed(() => {
  return ingredients.value.reduce((total, ing) => total + (ing.current_stock * ing.cost_per_unit), 0)
})

const sortedIngredients = computed(() => {
  return [...ingredients.value].sort((a, b) => {
    const getScore = (ing) => {
      if (ing.current_stock === 0) return 3
      if (ing.current_stock <= ing.reorder_level) return 2
      return 1
    }
    return getScore(b) - getScore(a)
  })
})
</script>