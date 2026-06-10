<template>
  <div class="p-6 max-w-7xl mx-auto space-y-8">
    
    <div class="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
      <h2 class="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
        ✨ Add New Bakery Product
      </h2>
      
      <form @submit.prevent="handleFormSubmit" class="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Product Name</label>
          <input v-model="form.name" type="text" placeholder="e.g., White Bread" required class="w-full border p-2 text-sm rounded-lg" />
        </div>

        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Category</label>
          <select v-model="form.category" required class="w-full border p-2 text-sm rounded-lg bg-white">
            <option value="" disabled>Select Category</option>
            <option value="Bread">Bread</option>
            <option value="Pastry">Pastry</option>
            <option value="Cake">Cake</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Price (KES)</label>
          <input v-model.number="form.selling_price" type="number" min="0" placeholder="150" required class="w-full border p-2 text-sm rounded-lg" />
        </div>

        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Shelf Life / Unit</label>
          <div class="flex gap-2">
            <input v-model.number="form.shelf_life_hours" type="number" placeholder="24" required class="w-1/2 border p-2 text-sm rounded-lg" />
            <select v-model="form.unit" required class="w-1/2 border p-2 text-sm rounded-lg bg-white">
              <option value="pcs">pcs</option>
              <option value="kg">kg</option>
              <option value="pkt">pkt</option>
            </select>
          </div>
        </div>

        <div>
          <button type="submit" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors">
            🚀 Save Product
          </button>
        </div>
      </form>
    </div>

    <div>
      <h2 class="text-xl font-bold text-slate-800 mb-4">Current Inventory Catalog</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <ProductCard 
          v-for="product in productStore.products" 
          :key="product.id" 
          :product="product"
          @delete-product="handleDelete"
          @toggle-status="handleToggle"
        />
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useProductStore } from '../stores/productStore'
import ProductCard from '../components/ProductCard.vue'

const productStore = useProductStore()

// Task 2 Form state setup
const form = ref({
  name: '',
  category: '',
  selling_price: null,
  shelf_life_hours: null,
  unit: 'pcs'
})

const handleFormSubmit = () => {
  productStore.addProduct({ ...form.value })
  // Reset form without breaking anything
  form.value = { name: '', category: '', selling_price: null, shelf_life_hours: null, unit: 'pcs' }
}

// Task 3: Trigger store delete action
const handleDelete = (id) => {
  productStore.deleteProduct(id)
}

// Task 4: Trigger store toggle action
const handleToggle = (id) => {
  productStore.toggleActive(id)
}
</script>