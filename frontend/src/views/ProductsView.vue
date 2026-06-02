<template>
  <div class="w-full min-h-screen bg-neutral-950 text-neutral-100 p-4 sm:p-6 lg:p-8">
    <div class="w-full px-2 sm:px-4">
      
      <div class="flex justify-end items-center mb-6 w-full">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search products..." 
          class="bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white outline-none w-full sm:w-80 focus:border-indigo-500"
        />
      </div>

      <div class="bg-neutral-900 border border-neutral-800 rounded-xl p-4 mb-8 flex flex-wrap justify-between items-center gap-4 text-sm w-full shadow-sm">
        <div class="flex items-center gap-4 flex-wrap">
          <span class="flex items-center gap-2"><span class="w-2.5 h-2.5 bg-red-500 rounded-full"></span>{{ categoryCounts.urgent }} Urgent</span>
          <span class="text-neutral-700 hidden sm:inline">|</span>
          <span class="flex items-center gap-2"><span class="w-2.5 h-2.5 bg-green-500 rounded-full"></span>{{ categoryCounts.fast }} Fast Sellers</span>
          <span class="text-neutral-700 hidden sm:inline">|</span>
          <span class="flex items-center gap-2"><span class="w-2.5 h-2.5 bg-blue-500 rounded-full"></span>{{ categoryCounts.long }} Long Shelf</span>
        </div>
        
        <label class="flex items-center gap-2 cursor-pointer text-neutral-400 select-none hover:text-neutral-200 transition-colors">
          <input 
            type="checkbox" 
            v-model="showInactive" 
            class="rounded border-neutral-700 bg-neutral-800 text-indigo-600 focus:ring-0 w-4 h-4" 
          />
          <span>Show inactive items</span>
        </label>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 w-full">
        <ProductCard 
          v-for="prod in filteredProducts" 
          :key="prod.id"
          :id="prod.id"
          :name="prod.name"
          :price="prod.price"
          :category="prod.category"
          :shelf-life-hours="prod.shelf_life_hours"
          :isActive="prod.is_active" 
          @toggle-active="toggleActive(prod)"
          @select-product="selectProduct(prod)"
        />
      </div>

      <div v-if="selectedProduct" class="mt-8 bg-neutral-900 border border-indigo-500/40 rounded-xl p-6 max-w-xl mx-auto shadow-2xl">
        <div class="flex justify-between items-start mb-4">
          <div>
            <span class="text-xs text-indigo-400 font-mono uppercase tracking-wider">Terminal Drawer</span>
            <h3 class="text-lg font-bold text-white">Log Sale: {{ selectedProduct.name }}</h3>
          </div>
          <button @click="selectedProduct = null" class="text-neutral-500 hover:text-white text-lg">&#10005;</button>
        </div>
        
        <div class="grid grid-cols-2 gap-4 items-center mb-6">
          <div>
            <label class="block text-xs text-neutral-400 uppercase mb-1">Units</label>
            <input type="number" v-model.number="saleQuantity" min="1" class="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-white outline-none focus:border-indigo-500" />
          </div>
          <div>
            <span class="block text-xs text-neutral-400 uppercase mb-1">Total Pricing</span>
            <span class="text-xl font-bold text-emerald-400 font-mono">KES {{ saleTotal }}</span>
          </div>
        </div>
        
        <button @click="confirmSale" class="w-full bg-indigo-600 text-white rounded-lg py-2.5 font-bold hover:bg-indigo-500 transition-colors shadow-lg">
          Complete Cash Transaction
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ProductCard from '../ProductCard.vue'

const searchQuery = ref('')
const showInactive = ref(false)
const selectedProduct = ref(null)
const saleQuantity = ref(1)

const products = ref([
  { id: 1, name: 'Bread', price: 60, category: 'bakery', shelf_life_hours: 24, is_active: true },
  { id: 2, name: 'Cake', price: 150, category: 'bakery', shelf_life_hours: 48, is_active: true },
  { id: 3, name: 'Pastry', price: 100, category: 'bakery', shelf_life_hours: 36, is_active: true },
  { id: 4, name: 'Croissant', price: 80, category: 'bakery', shelf_life_hours: 24, is_active: true },
  { id: 5, name: 'Muffin', price: 70, category: 'bakery', shelf_life_hours: 24, is_active: true },
  { id: 6, name: 'Vanilla Cake', price: 150, category: 'bakery', shelf_life_hours: 48, is_active: true },
  { id: 7, name: 'Brown Bread', price: 65, category: 'bread', shelf_life_hours: 24, is_active: true },
  { id: 8, name: 'Cinnamon Roll', price: 40, category: 'pastry', shelf_life_hours: 12, is_active: true },
  { id: 9, name: 'Meat Pie', price: 80, category: 'pastry', shelf_life_hours: 8, is_active: true },
  { id: 11, name: 'Ginger Cookies', price: 110, category: 'pastry', shelf_life_hours: 72, is_active: true },
  { id: 12, name: 'Loaf', price: 45, category: 'bread', shelf_life_hours: 6, is_active: false } // <-- Changed here
])

const saleTotal = computed(() => {
  if (!selectedProduct.value) return 0
  return selectedProduct.value.price * (saleQuantity.value || 0)
})

const selectProduct = (product) => {
  selectedProduct.value = product
  saleQuantity.value = 1 
}

const confirmSale = () => {
  alert(`Transaction Completed!\nItem: ${selectedProduct.value.name}\nTotal: KES ${saleTotal.value}`)
  selectedProduct.value = null
}

const categoryCounts = computed(() => {
  const counts = { urgent: 0, fast: 0, long: 0 }
  products.value.forEach(p => {
    if (p.shelf_life_hours <= 12) counts.urgent++
    else if (p.shelf_life_hours <= 48) counts.fast++
    else counts.long++
  })
  return counts
})

const toggleActive = (product) => {
  product.is_active = !product.is_active
  if (!product.is_active && selectedProduct.value?.id === product.id) {
    selectedProduct.value = null
  }
}

const filteredProducts = computed(() => {
  return products.value.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesActiveStatus = showInactive.value ? true : p.is_active
    return matchesSearch && matchesActiveStatus
  })
})
</script>