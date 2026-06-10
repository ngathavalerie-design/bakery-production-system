<template>
  <div class="border border-slate-200 bg-white p-4 rounded-xl shadow-sm flex flex-col justify-between transition-all" :class="{ 'opacity-50': !product.active }">
    <div>
      <div class="flex justify-between items-start">
        <span class="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
          {{ product.category }}
        </span>
        
        <button 
          @click="$emit('toggle-status', product.id)" 
          type="button"
          class="text-xs px-2 py-0.5 rounded font-medium border transition-colors"
          :class="product.active ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-300'"
        >
          {{ product.active ? '🟢 Active' : '⚪ Inactive' }}
        </button>
      </div>
      
      <h3 class="font-bold text-slate-800 text-base mt-2">{{ product.name }}</h3>
      
      <div class="text-xs text-slate-500 mt-1 flex gap-2">
        <span>⏳ {{ product.shelf_life_hours }} hrs life</span>
        <span>•</span>
        <span>Per {{ product.unit }}</span>
      </div>
    </div>
    
    <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
      <span class="font-extrabold text-slate-900 text-lg">
        KES {{ product.selling_price }}
      </span>
      
      <button 
        @click="$emit('delete-product', product.id)" 
        type="button" 
        class="text-xs font-bold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2.5 py-1.5 rounded-lg border border-red-200 transition-colors"
      >
        🗑️ Delete
      </button>
    </div>
  </div>
</template>

<script setup>
// Props stay exactly as you had them setup
defineProps({
  product: {
    type: Object,
    required: true
  }
})

// Adding custom event definitions for Tasks 3 and 4
defineEmits(['delete-product', 'toggle-status'])
</script>