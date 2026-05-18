<script setup>
import { ref, computed } from 'vue'

const products = ref([
  { id: 1, name: 'Bread', prices: 60, category: 'Bakery', shelf_life: 24 },
  { id: 2, name: 'Cake', prices: 150, category: 'Bakery', shelf_life: 48 },
  { id: 3, name: 'Pastry', prices: 100, category: 'Bakery', shelf_life: 36 },
  { id: 4, name: 'Croissant', prices: 80, category: 'Bakery', shelf_life: 24 },
  { id: 5, name: 'Muffin', prices: 70, category: 'Bakery', shelf_life: 24 },
  { id: 6, name: 'Vanilla Cake', prices: 150, category: 'Bakery', shelf_life: 48 },
])

// 1. State for the search input (Requirement image_3a3af2.png)
const searchQuery = ref('')

// 2. Filter logic: This updates automatically as you type
const filteredProducts = computed(() => {
  return products.value.filter(product => 
    product.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const getStatusClass = (price) => {
  if (price > 100) return 'green';
  if (price === 100) return 'blue'; 
  return 'red';
}
</script>

<template>
  <h1>Bakery Production System</h1>

  <!-- Input field from image_3a3af2.png -->
  <div class="search-container">
    <input 
      v-model="searchQuery" 
      type="text" 
      placeholder="Search products by name..." 
      class="search-input"
    />
  </div>

  <!-- We now loop through filteredProducts instead of products -->
  <div class="product" v-for="product in filteredProducts" :key="product.id">
    <div class="header-row">
      <span :class="['dot', getStatusClass(product.prices)]"></span>
      <h2>{{ product.name }}</h2>
    </div>
    
    <p :class="{ 'high-price': product.prices > 100 }">
      Price: KES {{ product.prices }}
    </p>
    
    <p>Category: {{ product.category }}</p>
    <p>Shelf Life: {{ product.shelf_life }} hours</p>
  </div>

  <!-- Empty state if no results found -->
  <p v-if="filteredProducts.length === 0">No products match your search.</p>
</template>

<style scoped>
.search-container {
  margin-bottom: 2rem;
}

.search-input {
  width: 100%;
  padding: 12px;
  border-radius: 4px;
  border: 1px solid #ddd;
  font-size: 1rem;
}

.product {
  border: 1px solid #ccc;
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 8px;
}

.header-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.dot {
  height: 12px;
  width: 12px;
  border-radius: 50%;
  display: inline-block;
}

.green { background-color: #2ecc71; }
.red   { background-color: #e74c3c; }
.blue  { background-color: #3498db; }

.high-price {
  color: #2ecc71;
  font-weight: bold;
}
</style>