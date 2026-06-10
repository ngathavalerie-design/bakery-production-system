<template>
  <div class="p-6 max-w-7xl mx-auto space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-slate-900">Sales Checkout Terminal</h1>
      <p class="text-sm text-slate-500">Reading live status from the centralized product store engine.</p>
    </div>

    <div v-if="activeSalesProducts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div 
        v-for="product in activeSalesProducts" 
        :key="product.id" 
        class="border border-slate-200 bg-white p-4 rounded-xl shadow-sm flex flex-col justify-between"
      >
        <div>
          <span class="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{{ product.category }}</span>
          <h3 class="font-bold text-slate-800 text-base mt-2">{{ product.name }}</h3>
        </div>
        
        <div class="mt-4 flex items-center justify-between">
          <span class="font-extrabold text-slate-900 text-lg">KES {{ product.selling_price }}</span>
          <button class="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-1.5 px-3 rounded-lg transition-colors">
            🛒 Sell Item
          </button>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
      <p class="text-slate-500 font-medium text-sm">No items are currently set as active for sale.</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useProductStore } from '../stores/productStore'

const productStore = useProductStore()

// Task 4: Real-time computed array filtering out anything where product.active is false
const activeSalesProducts = computed(() => {
  return productStore.products.filter(product => product.active === true)
})
</script>