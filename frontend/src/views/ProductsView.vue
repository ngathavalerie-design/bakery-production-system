<template>
  <div class="products-view p-6 max-w-7xl mx-auto">
    <h1 class="text-3xl font-bold mb-6 text-gray-800">Bakery Inventory & Sales</h1>

    <!-- Task 3: Shelf Life Category Counter -->
    <div class="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200 flex flex-wrap gap-4 items-center justify-between">
      <div class="text-sm font-medium text-gray-700 flex gap-4">
        <span>🔴 {{ categoryCounts.urgent }} urgent</span>
        <span>|</span>
        <span>🟡 {{ categoryCounts.fast }} fast sellers</span>
        <span>|</span>
        <span>🟢 {{ categoryCounts.long }} long shelf life</span>
      </div>

      <!-- Task 4: Filter Option Toggle -->
      <label class="flex items-center space-x-2 text-sm font-medium text-gray-600 cursor-pointer">
        <input 
          type="checkbox" 
          v-model="showInactive" 
          class="rounded text-indigo-600 focus:ring-indigo-500"
        />
        <span>Show inactive products</span>
      </label>
    </div>

    <!-- Products Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
      <div 
        v-for="product in filteredProducts" 
        :key="product.id"
        :class="['border rounded-xl p-5 shadow-sm transition-all relative flex flex-col justify-between bg-white', !product.is_active ? 'opacity-50 border-gray-200 bg-gray-50' : 'border-gray-200 hover:shadow-md']"
      >
        <!-- Task 4: Active/Inactive Toggle Button -->
        <button 
          @click="toggleActive(product)"
          :class="['absolute top-3 right-3 text-xs px-2 py-1 rounded-md font-medium border transition-colors', product.is_active ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200']"
        >
          {{ product.is_active ? 'Active' : 'Inactive' }}
        </button>

        <div class="mb-4">
          <span class="text-xs font-bold uppercase tracking-wide text-gray-400">{{ product.category }}</span>
          <h2 class="text-xl font-bold text-gray-800 mt-1">{{ product.name }}</h2>
          <p class="text-2xl font-black text-indigo-600 mt-2">
            KES {{ product.price }} <span class="text-xs font-normal text-gray-500">/ {{ product.unit }}</span>
          </p>
        </div>

        <div class="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-3">
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-500">Shelf Life:</span>
            
            <!-- Task 3: Badge Status Logic -->
            <span v-if="product.shelf_life_hours <= 12" class="px-2 py-0.5 text-xs font-semibold rounded-full bg-red-100 text-red-800">
              Urgent
            </span>
            <span v-else-if="product.shelf_life_hours <= 48" class="px-2 py-0.5 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
              Fast Seller
            </span>
            <span v-else class="px-2 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-800">
              Long shelf life
            </span>
          </div>

          <!-- Task 2: Trigger Panel instead of Alert -->
          <button 
            @click="selectProduct(product)"
            :disabled="!product.is_active"
            class="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-center"
          >
            Sell
          </button>
        </div>
      </div>
    </div>

    <!-- Task 2: Sale Confirmation Panel -->
    <div v-if="selectedProduct" class="bg-indigo-50 border border-indigo-100 rounded-xl p-6 shadow-inner max-w-xl mx-auto">
      <div class="flex justify-between items-start mb-4">
        <div>
          <h3 class="text-lg font-bold text-indigo-900">Confirm Sale</h3>
          <p class="text-sm text-indigo-700">Product: <strong>{{ selectedProduct.name }}</strong></p>
          <p class="text-sm text-indigo-700">Unit Price: KES {{ selectedProduct.price }}</p>
        </div>
        <button @click="selectedProduct = null" class="text-indigo-400 hover:text-indigo-600 font-bold text-sm">
          Cancel
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end mb-4">
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">Quantity</label>
          <input 
            type="number" 
            v-model.number="saleQuantity" 
            min="1" 
            class="w-full rounded-lg border-indigo-200 bg-white p-2.5 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800 font-medium shadow-sm"
          />
        </div>
        <div class="bg-white p-2.5 rounded-lg border border-indigo-100 shadow-sm flex flex-col justify-center">
          <span class="text-xs font-bold uppercase tracking-wider text-indigo-400">Total Price</span>
          <span class="text-xl font-black text-indigo-600">KES {{ saleTotal }}</span>
        </div>
      </div>

      <button 
        @click="confirmSale"
        class="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
      >
        Confirm Sale
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Task 1: Complete baseline items + 4 new bakery capstone spec products
const products = ref([
  { id: 1, name: 'White Bread', price: 60, category: 'bread', shelf_life_hours: 24, unit: 'loaf', is_active: true },
  { id: 2, name: 'Croissant', price: 50, category: 'pastry', shelf_life_hours: 12, unit: 'piece', is_active: true },
  { id: 3, name: 'Brown Bread', price: 65, category: 'bread', shelf_life_hours: 24, unit: 'loaf', is_active: true },
  { id: 4, name: 'Cinnamon Roll', price: 40, category: 'pastry', shelf_life_hours: 12, unit: 'piece', is_active: true },
  { id: 5, name: 'Meat Pie', price: 80, category: 'pastry', shelf_life_hours: 8, unit: 'piece', is_active: true },
  { id: 6, name: 'Chapati', price: 20, category: 'bread', shelf_life_hours: 8, unit: 'piece', is_active: true },
])

// Task 2: Sale State Management
const selectedProduct = ref(null)
const saleQuantity = ref(1)

const saleTotal = computed(() => {
  if (!selectedProduct.value) return 0
  return selectedProduct.value.price * (saleQuantity.value || 0)
})

const selectProduct = (product) => {
  selectedProduct.value = product
  saleQuantity.value = 1 // reset quantity context
}

const confirmSale = () => {
  alert(`Sale Confirmed!\n${saleQuantity.value}x ${selectedProduct.value.name} for KES ${saleTotal.value}`)
  selectedProduct.value = null
}

// Task 3: Computed Counter Metrics
const categoryCounts = computed(() => {
  const counts = { urgent: 0, fast: 0, long: 0 }
  products.value.forEach(p => {
    if (p.shelf_life_hours <= 12) counts.urgent++
    else if (p.shelf_life_hours <= 48) counts.fast++
    else counts.long++
  })
  return counts
})

// Task 4: Inactive Toggles & Dynamic Filters
const showInactive = ref(false)

const toggleActive = (product) => {
  product.is_active = !product.is_active
  // Automatically close panel if active state is flipped off on selected product
  if (!product.is_active && selectedProduct.value?.id === product.id) {
    selectedProduct.value = null
  }
}

const filteredProducts = computed(() => {
  if (showInactive.value) {
    return products.value
  }
  return products.value.filter(p => p.is_active)
})
</script>