<template>
  <div class="app-container">
    
    <div class="header-row">
      <h1 class="main-title">Bakery Production System</h1>
      <input 
        type="text" 
        v-model="searchQuery" 
        placeholder="Search products by name..." 
        class="search-bar"
      />
    </div>

    <div class="status-strip">
      <div class="counters-group">
        <span class="counter-item"><span class="dot red-dot"></span>{{ categoryCounts.urgent }} urgent</span>
        <span class="divider">|</span>
        <span class="counter-item"><span class="dot yellow-dot"></span>{{ categoryCounts.fast }} fast sellers</span>
        <span class="divider">|</span>
        <span class="counter-item"><span class="dot green-dot"></span>{{ categoryCounts.long }} long shelf life</span>
      </div>

      <label class="filter-toggle">
        <input type="checkbox" v-model="showInactive" class="checkbox-input" />
        <span>Show inactive products</span>
      </label>
    </div>

    <div class="products-grid">
      <div 
        v-for="product in filteredProducts" 
        :key="product.id"
        class="product-card"
        :style="!product.is_active ? 'opacity: 0.35;' : ''"
      >
        <button 
          @click="toggleActive(product)"
          :class="['status-toggle-btn', product.is_active ? 'btn-active' : 'btn-inactive']"
        >
          {{ product.is_active ? 'Active' : 'Inactive' }}
        </button>

        <div class="card-body">
          <div class="title-row">
            <span :class="['status-dot', getDotClass(product.shelf_life_hours)]"></span>
            <h2 class="product-name">{{ product.name }}</h2>
          </div>
          
          <div class="metadata-rows">
            <p class="meta-text">
              Price: 
              <span :style="product.price >= 150 ? 'color: #4caf50; font-weight: bold;' : 'color: #9e9e9e;'">
                KES {{ product.price }}
              </span>
            </p>
            <p class="meta-text">Category: <span class="val-text">{{ product.category }}</span></p>
            <p class="meta-text">Shelf Life: <span class="val-text">{{ product.shelf_life_hours }} hours</span></p>
          </div>
        </div>

        <div class="card-footer">
          <div class="shelf-status-row">
            <span class="label">Shelf Status:</span>
            <span :class="['status-badge-text', getStatusTextClass(product.shelf_life_hours)]">
              {{ getStatusText(product.shelf_life_hours) }}
            </span>
          </div>

          <button 
            @click="selectProduct(product)"
            :disabled="!product.is_active"
            class="sell-action-btn"
          >
            Sell
          </button>
        </div>
      </div>
    </div>

    <div v-if="selectedProduct" class="checkout-panel">
      <div class="panel-header">
        <div>
          <span class="panel-tag">Order Terminal</span>
          <h3 class="panel-title">Confirm Sale: {{ selectedProduct.name }}</h3>
        </div>
        <button @click="selectedProduct = null" class="close-btn">&#10005;</button>
      </div>

      <div class="panel-body-grid">
        <div class="input-box">
          <label class="input-label">Quantity</label>
          <input type="number" v-model.number="saleQuantity" min="1" class="qty-field" />
        </div>
        <div class="total-box">
          <span class="total-label">Total Price</span>
          <span class="total-value">KES {{ saleTotal }}</span>
        </div>
      </div>

      <button @click="confirmSale" class="submit-sale-btn">
        Confirm Transaction
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const searchQuery = ref('')

// Complete Bakery Product Array Inventory Listing (With Chapati Removed)
const products = ref([
  { id: 1, name: 'Bread', price: 60, category: 'bakery', shelf_life_hours: 24, is_active: true },
  { id: 2, name: 'Cake', price: 150, category: 'bakery', shelf_life_hours: 48, is_active: true },
  { id: 3, name: 'Pastry', price: 100, category: 'bakery', shelf_life_hours: 36, is_active: true },
  { id: 4, name: 'Croissant', price: 80, category: 'bakery', shelf_life_hours: 24, is_active: true },
  { id: 5, name: 'Muffin', price: 70, category: 'bakery', shelf_life_hours: 24, is_active: true },
  { id: 6, name: 'Vanilla Cake', price: 150, category: 'bakery', shelf_life_hours: 48, is_active: true },
  // Assignment required items:
  { id: 7, name: 'Brown Bread', price: 65, category: 'bread', shelf_life_hours: 24, is_active: true },
  { id: 8, name: 'Cinnamon Roll', price: 40, category: 'pastry', shelf_life_hours: 12, is_active: true },
  { id: 9, name: 'Meat Pie', price: 80, category: 'pastry', shelf_life_hours: 8, is_active: true },
  // Demonstration unit over 48 hours to trigger the long shelf logic condition safely
  { id: 11, name: 'Ginger Cookies', price: 110, category: 'pastry', shelf_life_hours: 72, is_active: true }
])

// Task 2 Transaction Handlers
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
  alert(`Transaction Logged Successfully!\nItem: ${selectedProduct.value.name}\nQuantity: ${saleQuantity.value}\nTotal: KES ${saleTotal.value}`)
  selectedProduct.value = null
}

// Task 3 Dynamic Computations
const categoryCounts = computed(() => {
  const counts = { urgent: 0, fast: 0, long: 0 }
  products.value.forEach(p => {
    if (p.shelf_life_hours <= 12) counts.urgent++
    else if (p.shelf_life_hours <= 48) counts.fast++
    else counts.long++
  })
  return counts
})

const getDotClass = (hours) => {
  if (hours <= 12) return 'dot-red'
  if (hours <= 48) return 'dot-green'
  return 'dot-blue'
}

const getStatusText = (hours) => {
  if (hours <= 12) return 'Urgent'
  if (hours <= 48) return 'Fast Seller'
  return 'Long shelf life'
}

const getStatusTextClass = (hours) => {
  if (hours <= 12) return 'txt-red'
  if (hours <= 48) return 'txt-green'
  return 'txt-blue'
}

// Task 4 Filtering Engines
const showInactive = ref(false)

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

<style scoped>
/* Strict CSS Stylesheet Injection guaranteeing clean box grid layouts matching your specifications */
.app-container {
  padding: 32px;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
  background-color: #1a1a1a;
  color: #9e9e9e;
  font-family: sans-serif;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.main-title {
  font-size: 36px;
  color: #d4d4d4;
  font-weight: normal;
  margin: 0;
}

.search-bar {
  background-color: #2a2a2a;
  border: 1px solid #4a4a4a;
  border-radius: 6px;
  padding: 8px 16px;
  color: #ffffff;
  width: 280px;
  outline: none;
}

.status-strip {
  background-color: #222222;
  border: 1px solid #333333;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #d4d4d4;
}

.counters-group {
  display: flex;
  align-items: center;
  gap: 16px;
}

.counter-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.divider {
  color: #444444;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}
.red-dot { background-color: #f44336; }
.yellow-dot { background-color: #ffeb3b; }
.green-dot { background-color: #4caf50; }

.filter-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 12px;
  color: #9e9e9e;
}

/* Explicit Grid Rules Creating your Balanced Boxes */
.products-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-bottom: 32px;
}

@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: 1fr;
  }
}

.product-card {
  background-color: #242424;
  border: 1px solid #555555;
  border-radius: 12px;
  padding: 24px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.status-toggle-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
  cursor: pointer;
  background: transparent;
}
.btn-active { color: #4caf50; border: 1px solid #2e7d32; }
.btn-inactive { color: #f44336; border: 1px solid #c62828; }

.title-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
}
.dot-red { background-color: #f44336; }
.dot-green { background-color: #4caf50; }
.dot-blue { background-color: #2196f3; }

.product-name {
  font-size: 24px;
  color: #d4d4d4;
  font-weight: normal;
  margin: 0;
}

.metadata-rows {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 15px;
}

.meta-text {
  margin: 0;
  color: #9e9e9e;
}

.val-text {
  color: #d4d4d4;
}

.card-footer {
  margin-top: 24px;
  padding-top: 16px;
}

.shelf-status-row {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  margin-bottom: 12px;
}

.txt-red { color: #f44336; font-weight: bold; }
.txt-green { color: #4caf50; font-weight: bold; }
.txt-blue { color: #2196f3; font-weight: bold; }

.sell-action-btn {
  width: 100%;
  background-color: #333333;
  border: 1px solid #555555;
  color: #ffffff;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
}
.sell-action-btn:hover {
  background-color: #444444;
}
.sell-action-btn:disabled {
  opacity: 0.2;
  cursor: not-allowed;
}

/* Elegant Checkout System Drop panel design */
.checkout-panel {
  background-color: #242424;
  border: 1px solid #4f46e5;
  border-radius: 12px;
  padding: 24px;
  max-width: 500px;
  margin: 32px auto 0 auto;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.panel-tag {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #818cf8;
}

.panel-title {
  font-size: 18px;
  color: #ffffff;
  margin: 4px 0 0 0;
}

.close-btn {
  background: transparent;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 16px;
}

.panel-body-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  align-items: center;
  margin-bottom: 24px;
}

.input-label, .total-label {
  display: block;
  font-size: 10px;
  text-transform: uppercase;
  color: #666;
  margin-bottom: 6px;
}

.qty-field {
  width: 100%;
  background-color: #1a1a1a;
  border: 1px solid #444;
  border-radius: 6px;
  padding: 8px;
  color: #fff;
  outline: none;
}

.total-value {
  display: block;
  font-size: 20px;
  font-weight: bold;
  color: #4caf50;
}

.submit-sale-btn {
  width: 100%;
  background-color: #4f46e5;
  color: #fff;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}
.submit-sale-btn:hover {
  background-color: #4338ca;
}
</style>