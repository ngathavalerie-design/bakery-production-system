<template>
  <div class="w-full min-h-screen bg-neutral-950 text-neutral-100 p-4 sm:p-6 lg:p-8">
    <div class="w-full px-2 sm:px-4">

      <div class="mb-6">
        <h1 class="text-2xl font-bold text-white">Bakery Enterprise Workspace</h1>
        <p class="text-neutral-400 text-sm">Production execution, inventory control, and checkout terminal</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6 mb-8 w-full">
        <div class="bg-neutral-900 border border-neutral-800 p-5 rounded-xl shadow-sm">
          <p class="text-xs uppercase tracking-wider text-neutral-500 mb-1">Stock Value</p>
          <p class="text-2xl font-bold font-mono text-emerald-400">KES {{ totalStockValue.toLocaleString() }}</p>
        </div>
        <div class="bg-neutral-900 border border-neutral-800 p-5 rounded-xl shadow-sm">
          <p class="text-xs uppercase tracking-wider text-neutral-500 mb-1">In Progress Batches</p>
          <p class="text-2xl font-bold font-mono text-indigo-400">{{ batchStats.inProgress }}</p>
        </div>
        <div class="bg-neutral-900 border border-neutral-800 p-5 rounded-xl shadow-sm">
          <p class="text-xs uppercase tracking-wider text-neutral-500 mb-1">Low Yield Runs</p>
          <p class="text-2xl font-bold font-mono text-amber-500">{{ batchStats.lowYield }}</p>
        </div>
        <div class="bg-neutral-900 border border-neutral-800 p-5 rounded-xl shadow-sm">
          <p class="text-xs uppercase tracking-wider text-neutral-500 mb-1">Cash Revenue</p>
          <p class="text-2xl font-bold font-mono text-amber-500">KES {{ revenueStats.cash.toLocaleString() }}</p>
        </div>
        <div class="bg-neutral-900 border border-neutral-800 p-5 rounded-xl shadow-sm">
          <p class="text-xs uppercase tracking-wider text-neutral-500 mb-1">M-Pesa Revenue</p>
          <p class="text-2xl font-bold font-mono text-indigo-400">KES {{ revenueStats.mpesa.toLocaleString() }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10 items-start">
        <div class="lg:col-span-1 bg-neutral-900 border border-neutral-800 rounded-xl p-5">
          <h2 class="text-base font-bold text-white mb-4">Raw Material Stock</h2>
          <div class="space-y-3">
            <div v-for="ing in sortedIngredients" :key="ing.id" class="p-3 bg-neutral-950 border border-neutral-800/60 rounded-lg flex justify-between items-center text-xs">
              <div>
                <p class="font-semibold text-neutral-200">{{ ing.name }}</p>
                <p class="text-[10px] text-neutral-500 font-mono">Reorder: {{ ing.reorder_level }} {{ ing.unit }}</p>
              </div>
              <div class="text-right">
                <p class="font-bold font-mono" :class="ing.current_stock <= ing.reorder_level ? 'text-red-400' : 'text-neutral-300'">{{ ing.current_stock }} {{ ing.unit }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-2 bg-neutral-900 border border-neutral-800 rounded-xl p-5">
          <h2 class="text-base font-bold text-white mb-4">Live Production Batches</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div v-for="batch in batches" :key="batch.id" class="p-4 bg-neutral-950 border border-neutral-800 rounded-xl flex flex-col justify-between">
              <div>
                <div class="flex justify-between items-start mb-2">
                  <h3 class="text-sm font-bold text-white leading-tight">{{ batch.product_name }}</h3>
                  <span class="text-[9px] px-1.5 py-0.5 rounded font-mono font-medium uppercase bg-neutral-800 text-neutral-400">{{ batch.status }}</span>
                </div>
                <p class="text-xs text-neutral-500 font-mono mb-2">Target Plan: {{ batch.planned_quantity }} units</p>
                <div v-if="batch.status === 'failed'" class="text-[11px] text-red-400 bg-red-950/20 p-2 rounded border border-red-900/40 mb-2">❌ Run Parameters Failed</div>
              </div>
              <div class="mt-2 pt-2 border-t border-neutral-800 flex justify-between items-center">
                <button v-if="['mixing', 'baking'].includes(batch.status)" @click="batch.status = 'failed'" class="text-[11px] text-red-400 hover:underline cursor-pointer">Mark Failed</button>
                <div v-else></div>
                <button v-if="batch.status === 'planned'" @click="batch.status = 'mixing'; batch.started_at = 'Now'" class="bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] px-2.5 py-1 rounded cursor-pointer">Start Mixing</button>
                <button v-else-if="batch.status === 'mixing'" @click="batch.status = 'baking'" class="bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] px-2.5 py-1 rounded cursor-pointer">Move to Oven</button>
                <button v-else-if="batch.status === 'baking'" @click="batch.status = 'cooling'" class="bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] px-2.5 py-1 rounded cursor-pointer">Move to Cooling</button>
                <button v-else-if="batch.status === 'cooling'" @click="openCompletionPanel(batch)" class="bg-amber-600 hover:bg-amber-500 text-white text-[11px] px-2.5 py-1 rounded cursor-pointer">Complete Run</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="activeCompletionBatch" class="mb-10 bg-neutral-900 border border-indigo-500/40 rounded-xl p-6 max-w-xl mx-auto shadow-2xl">
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-base font-bold text-white">Complete Production Run: {{ activeCompletionBatch.product_name }}</h3>
          <button @click="activeCompletionBatch = null" class="text-neutral-500 hover:text-white cursor-pointer">&#10005;</button>
        </div>
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-xs text-neutral-400 uppercase mb-1">Actual Output Units</label>
            <input type="number" v-model.number="formActual" class="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-white font-mono" />
          </div>
          <div>
            <label class="block text-xs text-neutral-400 uppercase mb-1">Wastage Discarded</label>
            <input type="number" v-model.number="formWaste" class="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-white font-mono" />
          </div>
        </div>
        <button @click="confirmBatchSettlement" class="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg font-bold text-xs cursor-pointer">Confirm Output and Restock Shelf</button>
      </div>

      <hr class="border-neutral-900 mb-8" />

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start w-full">
        <div class="lg:col-span-2 bg-neutral-900 border border-neutral-800 rounded-xl p-5">
          <h2 class="text-base font-bold text-white mb-4">Bakery Storefront Showcase</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div 
              v-for="product in products" :key="product.id"
              @click="selectProduct(product)"
              class="bg-neutral-950 border border-neutral-800/80 rounded-xl p-4 cursor-pointer transition-all hover:border-neutral-700 relative overflow-hidden"
              :class="{'border-indigo-500 ring-1 ring-indigo-500/20': selectedProduct?.id === product.id}"
            >
              <div class="absolute right-3 top-3">
                <span class="text-[9px] px-2 py-0.5 rounded-full font-mono font-semibold"
                  :class="product.available_stock === 0 ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'">
                  {{ product.available_stock === 0 ? 'Out of Stock' : `${product.available_stock} Available` }}
                </span>
              </div>
              <h3 class="text-sm font-bold text-white pr-16">{{ product.name }}</h3>
              <p class="text-xs font-mono text-emerald-400 mt-1">KES {{ product.price }}</p>
            </div>
          </div>
        </div>

        <div class="bg-neutral-900 border border-neutral-800 rounded-xl p-5 min-h-[340px] flex flex-col justify-between">
          <div v-if="selectedProduct" class="flex flex-col h-full justify-between flex-1">
            <div>
              <div class="flex justify-between items-center border-b border-neutral-800 pb-2 mb-4">
                <h3 class="text-xs uppercase tracking-wider text-indigo-400 font-mono font-bold">POS Checkout Terminal</h3>
                <button @click="selectedProduct = null" class="text-neutral-500 hover:text-white cursor-pointer">&#10005;</button>
              </div>
              <p class="text-sm font-bold text-white mb-3">{{ selectedProduct.name }}</p>

              <div class="space-y-3 text-xs">
                <div>
                  <label class="block text-neutral-400 mb-1">Quantity</label>
                  <input type="number" v-model.number="checkoutForm.quantity" min="1" :max="selectedProduct.available_stock" class="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-white font-mono" />
                </div>
                <div>
                  <label class="block text-neutral-400 mb-1">Payment Method</label>
                  <select v-model="checkoutForm.payment_method" class="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-white">
                    <option value="Cash">💵 Cash</option>
                    <option value="M-Pesa">📱 M-Pesa</option>
                  </select>
                </div>
                <div v-if="checkoutForm.payment_method === 'M-Pesa'">
                  <label class="block text-neutral-400 mb-1">M-Pesa Ref Code</label>
                  <input type="text" v-model="checkoutForm.mpesa_code" placeholder="e.g. TBD47FH92K" maxlength="10" class="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-white font-mono uppercase tracking-wider" />
                  <span v-if="validationErrors.mpesa" class="text-[10px] text-red-400 mt-1 block">❌ {{ validationErrors.mpesa }}</span>
                </div>
              </div>

              <div class="bg-neutral-950 border border-neutral-850 p-3 rounded-lg mt-4 text-xs font-mono flex justify-between items-center">
                <span class="text-neutral-500">Checkout Bill:</span>
                <span class="text-emerald-400 font-bold text-sm">KES {{ (checkoutForm.quantity * selectedProduct.price).toLocaleString() }}</span>
              </div>
            </div>
            <button @click="submitTransaction" class="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-2 rounded-lg mt-4 cursor-pointer">Finalize Dispatch Sale</button>
          </div>

          <div v-else class="flex flex-col h-full justify-between flex-1">
            <div>
              <h3 class="text-xs uppercase tracking-wider text-neutral-400 font-mono font-bold border-b border-neutral-800 pb-2 mb-3">Session Sales History</h3>
              <div v-if="salesHistory.length === 0" class="text-center py-10 text-neutral-600 text-xs">📋 No sales processed yet during this shift.</div>
              <div v-else class="space-y-2 max-h-[240px] overflow-y-auto pr-1">
                <div v-for="sale in salesHistory" :key="sale.id" class="p-2.5 bg-neutral-950 border border-neutral-850 rounded-lg flex justify-between items-center text-[11px]">
                  <div>
                    <p class="font-bold text-neutral-300 leading-tight">{{ sale.product_name }}</p>
                    <p class="text-[10px] text-neutral-500 font-mono mt-0.5">{{ sale.quantity }} pcs &middot; {{ sale.payment_method }} <span v-if="sale.mpesa_code" class="text-indigo-400">({{ sale.mpesa_code }})</span></p>
                  </div>
                  <p class="font-bold font-mono text-emerald-400">KES {{ sale.total_price }}</p>
                </div>
              </div>
            </div>
            <p class="text-[10px] text-neutral-500 bg-neutral-950 p-2.5 rounded border border-dashed border-neutral-800 text-center mt-3">💡 Click on any store product card layout to trigger a dispatch POS order entry sheet.</p>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'

// --- EXISTING RECIPE RAW MATERIALS INGREDIENT STATE ARRAY ---
const ingredients = ref([
  { id: 1, name: 'Wheat Flour', current_stock: 85, reorder_level: 25, unit: 'kg', cost_per_unit: 110 },
  { id: 2, name: 'Sugar', current_stock: 12, reorder_level: 15, unit: 'kg', cost_per_unit: 140 },
  { id: 3, name: 'Butter', current_stock: 30, reorder_level: 10, unit: 'kg', cost_per_unit: 650 },
  { id: 5, name: 'Milk', current_stock: 0, reorder_level: 12, unit: 'L', cost_per_unit: 70 }
])

// --- BATCH PRODUCTION WORKFLOW PIPELINE ARCHIVE STATE ARRAY ---
const batches = ref([
  { id: 101, product_name: 'Sweet Croissants', product_id: 4, planned_quantity: 20, actual_quantity: 20, wastage_quantity: 0, status: 'done', started_at: '04:15', completed_at: '06:45' },
  { id: 103, product_name: 'Blueberry Muffins', product_id: 5, planned_quantity: 24, actual_quantity: null, wastage_quantity: 0, status: 'planned', started_at: null, completed_at: null },
  { id: 105, product_name: 'Ginger Cookies', product_id: 11, planned_quantity: 40, actual_quantity: null, wastage_quantity: 0, status: 'cooling', started_at: '06:45', completed_at: null }
])

// --- TASK 4: STOREFRONT DISPATCH TARGET PRODUCT STATE ARRAY WITH STOCK LEVEL METRIC FIELDS ---
const products = ref([
  { id: 4, name: 'Sweet Croissants', price: 150, available_stock: 20, category: 'Pastries' }, // Pre-loaded with 20 units baked by batch 101!
  { id: 5, name: 'Blueberry Muffins', price: 100, available_stock: 0, category: 'Cakes' },
  { id: 11, name: 'Ginger Cookies', price: 50, available_stock: 5, category: 'Pastries' }
])

// --- TASK 1: PERSISTENT COMPLIANCE AUDIT DISPATCH SALES HISTORY LEDGER STATE ARRAY ---
const salesHistory = ref([
  { id: 1, product_name: 'Ginger Cookies', quantity: 2, total_price: 100, payment_method: 'Cash', mpesa_code: null, timestamp: '11:14' }
])

// Context Form Elements State Handlers
const activeCompletionBatch = ref(null)
const formActual = ref(0)
const formWaste = ref(0)

const selectedProduct = ref(null)
const checkoutForm = reactive({ quantity: 1, payment_method: 'Cash', mpesa_code: '' })
const validationErrors = reactive({ mpesa: '' })

// Batch Processing Metrical Loops Engine Calculators
const batchStats = computed(() => {
  let completed = 0, inProgress = 0, lowYield = 0, failed = 0
  batches.value.forEach(b => {
    if (b.status === 'failed') failed++
    else if (b.status === 'done') {
      completed++
      if ((b.actual_quantity / b.planned_quantity) < 0.8) lowYield++
    } else if (['mixing', 'baking', 'cooling'].includes(b.status)) inProgress++
  })
  return { completed, inProgress, lowYield, failed }
})

const lowStockCount = computed(() => ingredients.value.filter(i => i.current_stock <= i.reorder_level).length)
const totalStockValue = computed(() => ingredients.value.reduce((acc, i) => acc + (i.current_stock * i.cost_per_unit), 0))
const sortedIngredients = computed(() => [...ingredients.value].sort((a, b) => (b.current_stock === 0 ? 2 : 1) - (a.current_stock === 0 ? 2 : 1)))

// TASK 2: Computed Revenue Processing Split Optimization Calculations Engine (Cash vs M-Pesa metrics totals)
const revenueStats = computed(() => {
  let cashSum = 0, mpesaSum = 0
  salesHistory.value.forEach(s => {
    if (s.payment_method === 'Cash') cashSum += s.total_price
    else if (s.payment_method === 'M-Pesa') mpesaSum += s.total_price
  })
  return { cash: cashSum, mpesa: mpesaSum, total: cashSum + mpesaSum }
})

// Complete Run trigger binds: Automatically increments task 4 available stock counts when baking workflow settles!
const openCompletionPanel = (batch) => {
  activeCompletionBatch.value = batch
  formActual.value = batch.planned_quantity
  formWaste.value = 0
}

const confirmBatchSettlement = () => {
  if (!activeCompletionBatch.value) return
  activeCompletionBatch.value.actual_quantity = formActual.value
  activeCompletionBatch.value.wastage_quantity = formWaste.value
  activeCompletionBatch.value.status = 'done'

  // Look up matching store item product reference on the shelf map array to restock automatically
  const matchedProduct = products.value.find(p => p.id === activeCompletionBatch.value.product_id)
  if (matchedProduct) {
    matchedProduct.available_stock += formActual.value
  }

  activeCompletionBatch.value = null
}

const selectProduct = (p) => {
  if (p.available_stock === 0) return
  selectedProduct.value = p
  checkoutForm.quantity = 1
  checkoutForm.payment_method = 'Cash'
  checkoutForm.mpesa_code = ''
  validationErrors.mpesa = ''
}

// TASK 3 & TASK 4 Action execution checkout submissions
const submitTransaction = () => {
  validationErrors.mpesa = ''

  if (checkoutForm.payment_method === 'M-Pesa') {
    const code = checkoutForm.mpesa_code.trim().toUpperCase()
    // Regex matches 10 characters total, starting with a letter digit token
    const mpesaRegex = /^[A-Z][A-Z0-9]{9}$/
    
    if (!code || !mpesaRegex.test(code)) {
      validationErrors.mpesa = 'Invalid Code. Reference must be exactly 10 characters and start with a letter.'
      return
    }
  }

  // Task 4: Deduct purchased items from available product shelf stocks quantities indexes arrays
  selectedProduct.value.available_stock -= checkoutForm.quantity

  // Task 1: Append record entry log data models onto current execution shifts history stacks ledger
  salesHistory.value.unshift({
    id: Date.now(),
    product_name: selectedProduct.value.name,
    quantity: checkoutForm.quantity,
    total_price: checkoutForm.quantity * selectedProduct.value.price,
    payment_method: checkoutForm.payment_method,
    mpesa_code: checkoutForm.payment_method === 'M-Pesa' ? checkoutForm.mpesa_code.trim().toUpperCase() : null
  })

  selectedProduct.value = null
}
</script>
<style scoped>
/* ==========================================================================
   VIBRANT & CLASSY PREMIUM WORKSPACE THEME
   Removes the boring plain white sheets and brings in luxury colors.
   ========================================================================== */

/* 1. Dashboard Heading Aesthetics */
h1, h2, .text-3xl {
  color: #0f172a !important;
  font-weight: 800 !important;
  letter-spacing: -0.02em !important;
}

/* 2. Custom Colored Accent Cards for Metrics */
/* Instead of plain white, we give each metric card depth and subtle colors */
.grid > div {
  background: #ffffff !important;
  border-radius: 12px !important;
  padding: 20px !important;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04) !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 8px !important;
  position: relative !important;
  overflow: hidden !important;
  border: 1px solid #e2e8f0 !important;
}

/* Give each specific card a distinct, colorful top indicator bar */
.grid > div:nth-child(1) { border-top: 4px solid #10b981 !important; background: linear-gradient(to bottom right, #f0fdf4, #ffffff) !important; } /* Green for Stock Value */
.grid > div:nth-child(2) { border-top: 4px solid #3b82f6 !important; background: linear-gradient(to bottom right, #eff6ff, #ffffff) !important; } /* Blue for In Progress */
.grid > div:nth-child(3) { border-top: 4px solid #ef4444 !important; background: linear-gradient(to bottom right, #fef2f2, #ffffff) !important; } /* Red for Low Yield */
.grid > div:nth-child(4) { border-top: 4px solid #f59e0b !important; background: linear-gradient(to bottom right, #fffbeb, #ffffff) !important; } /* Amber for Cash Revenue */
.grid > div:nth-child(5) { border-top: 4px solid #8b5cf6 !important; background: linear-gradient(to bottom right, #f5f3ff, #ffffff) !important; } /* Purple for M-Pesa Revenue */

/* 3. High-Contrast Text inside Metrics */
.text-xs, [class*="text-neutral"] {
  color: #475569 !important;
  font-weight: 700 !important;
  text-transform: uppercase !important;
  letter-spacing: 0.05em !important;
  font-size: 0.75rem !important;
}

/* Beautiful color styles for numbers */
.grid > div:nth-child(1) .text-2xl, .text-emerald-400 { color: #065f46 !important; font-weight: 800 !important; }
.grid > div:nth-child(2) .text-2xl, .text-indigo-400 { color: #1e40af !important; font-weight: 800 !important; }
.grid > div:nth-child(3) .text-2xl { color: #991b1b !important; font-weight: 800 !important; }
.grid > div:nth-child(4) .text-2xl { color: #92400e !important; font-weight: 800 !important; }
.grid > div:nth-child(5) .text-2xl { color: #5b21b6 !important; font-weight: 800 !important; }

/* 4. Lower Sections: Raw Material & Live Production Containers */
main > div:nth-of-type(2),
.mt-8 {
  background-color: #ffffff !important;
  border: 1px solid #e2e8f0 !important;
  border-radius: 16px !important;
  padding: 24px !important;
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.03) !important;
}

/* Individual inner item list cards (like Sweet Croissants, Blueberry Muffins) */
.bg-white, [class*="bg-neutral-50"] {
  background: #f8fafc !important; /* Soft premium slate gray fill */
  border: 1px solid #cbd5e1 !important;
  border-radius: 10px !important;
  padding: 16px !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02) !important;
}

/* 5. Classy Interactive Buttons */
button {
  background: linear-gradient(135deg, #4f46e5 0%, #3730a3 100%) !important;
  color: #ffffff !important;
  font-weight: 600 !important;
  letter-spacing: 0.01em !important;
  padding: 10px 20px !important;
  border-radius: 8px !important;
  border: none !important;
  box-shadow: 0 4px 10px rgba(79, 70, 229, 0.25) !important;
  cursor: pointer !important;
  transition: all 0.2s ease !important;
}

button:hover {
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%) !important;
  box-shadow: 0 6px 14px rgba(79, 70, 229, 0.35) !important;
}
</style>