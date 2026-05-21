<template>
  <div class="p-6 max-w-7xl mx-auto min-h-screen text-gray-200 bg-[#1a1a1a]">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <h1 class="text-3xl font-bold text-gray-100">Bakery Production System</h1>
      <input 
        type="text" 
        v-model="searchQuery" 
        placeholder="Search products by name..." 
        class="bg-[#2a2a2a] border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-indigo-500 w-full md:w-64"
      />
    </div>

    <div class="mb-6 p-4 bg-[#222222] rounded border border-gray-800 flex flex-wrap gap-4 items-center justify-between text-sm">
      <div class="flex gap-4 font-medium">
        <span>🔴 {{ categoryCounts.urgent }} urgent</span>
        <span>|</span>
        <span>🟡 {{ categoryCounts.fast }} fast sellers</span>
        <span>|</span>
        <span>🟢 {{ categoryCounts.long }} long shelf life</span>
      </div>

      <label class="flex items-center space-x-2 text-gray-400 cursor-pointer select-none">
        <input 
          type="checkbox" 
          v-model="showInactive" 
          class="rounded bg-[#333] border-gray-600 text-indigo-600 focus:ring-0"
        />
        <span>Show inactive products</span>
      </label>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
      <div 
        v-for="product in filteredProducts" 
        :key="product.id"
        :class="['border rounded-xl p-5 relative flex flex-col justify-between bg-[#242424]', !product.is_active ? 'opacity-40 border-gray-800' : 'border-gray-700 hover:border-gray-500']"
      >
        <button 
          @click="toggleActive(product)"
          :class="['absolute top-3 right-3 text-xs px-2 py-0.5 rounded font-medium border transition-colors', product.is_active ? 'bg-green-950 text-green-400 border-green-800 hover:bg-green-900' : 'bg-gray-800 text-gray-400 border-gray-600 hover:bg-gray-700']"
        >
          {{ product.is_active ? 'Active' : 'Inactive' }}
        </button>

        <div class="mb-4">
          <div class="flex items-center gap-2 text-xl font-bold text-gray-100">
            <span :class="[
              'w-3 h-3 rounded-full inline-block',
              product.shelf_life_hours <= 12 ? 'bg-red-500' : product.shelf_life_hours <= 48 ? 'bg-yellow-500' : 'bg-green-500'
            ]"></span>
            <h2>{{ product.name }}</h2>
          </div>
          
          <p class="text-sm text-gray-400 mt-2">Category: <span class="capitalize">{{ product.category }}</span></p>
          <p class="text-md font-semibold text-green-400 mt-1">Price: KES {{ product.price }}</p>
          <p class="text-sm text-gray-400 mt-1">Shelf Life: {{ product.shelf_life_hours }} hours</p>
        </div>

        <div class="mt-4 pt-4 border-t border-gray-800 flex flex-col gap-3">
          <div class="flex items-center justify-between text-xs">
            <span class="text-gray-500">Status Status:</span>
            <span v-if="product.shelf_life_hours <= 12" class="px-2 py-0.5 text-xs font-semibold rounded bg-red-950 text-red-400 border border-red-900">
              Urgent
            </span>
            <span v-else-if="product.shelf_life_hours <= 48" class="px-2 py-0.5 text-xs font-semibold rounded bg-yellow-950 text-yellow-400 border border-yellow-900">
              Fast Seller
            </span>
            <span v-else class="px-2 py-0.5 text-xs font-semibold rounded bg-green-950 text-green-400 border border-green-900">
              Long shelf life
            </span>
          </div>

          <button 
            @click="selectProduct(product)"
            :disabled="!product.is_active"
            class="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded hover:bg-indigo-700 disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors text-center"
          >
            Sell
          </button>
        </div>
      </div>
    </div>

    <div v-if="selectedProduct" class="bg-[#242424] border border-indigo-900 rounded-xl p-6 shadow-xl max-w-xl mx-auto mt-8">
      <div class="flex justify-between items-start mb-4">
        <div>
          <h3 class="text-lg font-bold text-indigo-400">Confirm Sale</h3>
          <p class="text-sm text-gray-300">Product: <strong class="text-white">{{ selectedProduct.name }}</strong></p>
          <p class="text-sm text-gray-300">Unit Price: KES {{ selectedProduct.price }}</p>
        </div>
        <button @click="selectedProduct = null" class="text-gray-500 hover:text-gray-300 font-bold text-sm">
          Cancel
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end mb-4">
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-indigo-400 mb-1">Quantity</label>
          <input 
            type="number" 
            v-model.number="saleQuantity" 
            min="1" 
            class="w-full rounded bg-[#2d2d2d] border border-gray-700 p-2 text-white font-medium focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div class="bg-[#2d2d2d] p-2 rounded border border-gray-700 flex flex-col justify-center h-[42px]">
          <span class="text-[10px] font-bold uppercase text-gray-500 leading-none">Total Price</span>
          <span class="text-lg font-black text-green-400">KES {{ saleTotal }}</span>
        </div>
      </div>

      <button 
        @click="confirmSale"
        class="w-full bg-indigo-600 text-white font-bold py-2.5 px-4 rounded hover:bg-indigo-700 transition-colors shadow"
      >
        Confirm Sale
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const searchQuery = ref('')

// Task 1: Existing base products + 4 new bakery capstone spec products
const products = ref([
  { id: 1, name: 'Bread', price: 60, category: 'bakery', shelf_life_hours: 24, is_active: true },
  { id: 2, name: 'Cake', price: 150, category: 'bakery', shelf_life_hours: 48, is_active: true },
  { id: 3, name: 'Brown Bread', price: 65, category: 'bread', shelf_life_hours: 24, is_active: true },
  { id: 4, name: 'Cinnamon Roll', price: 40, category: 'pastry', shelf_life_hours: 12, is_active: true },
  { id: 5, name: 'Meat Pie', price: 80, category: 'pastry', shelf_life_hours: 8, is_active: true },
  { id: 6, name: 'Chapati', price: 20, category: 'bread', shelf_life_hours: 8, is_active: true },
  { id: 7, name: 'Long Life Biscuit', price: 100, category: 'bakery', shelf_life_hours: 72, is_active: true } // Added to demonstrate the 48h+ green badge
])

// Task 2: Sale Panel Ref State Management
const selectedProduct = ref(null)
const saleQuantity = ref(1)

const saleTotal = computed(() => {
  if (!selectedProduct.value) return 0
  return selectedProduct.value.price * (saleQuantity.value || 0)
})

const selectProduct = (product) => {
  selectedProduct.value = product
  saleQuantity.value = 1 
}

const confirmSale = () => {
  alert(`Sale Confirmed!\n${saleQuantity.value}x ${selectedProduct.value.name} for KES ${saleTotal.value}`)
  selectedProduct.value = null
}

// Task 3: Category Count Tracker
const categoryCounts = computed(() => {
  const counts = { urgent: 0, fast: 0, long: 0 }
  products.value.forEach(p => {
    if (p.shelf_life_hours <= 12) counts.urgent++
    else if (p.shelf_life_hours <= 48) counts.fast++
    else counts.long++
  })
  return counts
})

// Task 4: Inactive State Filtering Logic
const showInactive = ref(false)

const toggleActive = (product) => {
  product.is_active = !product.is_active
  if (!product.is_active && selectedProduct.value?.id === product.id) {
    selectedProduct.value = null
  }
}

// Combines your existing Search feature with the Task 4 Show Inactive filter
const filteredProducts = computed(() => {
  return products.value.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesActiveStatus = showInactive.value ? true : p.is_active
    return matchesSearch && matchesActiveStatus
  })
})
</script>