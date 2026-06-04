<template>
  <div class="w-full min-h-screen bg-neutral-950 text-neutral-100 p-4 sm:p-6 lg:p-8">
    <div class="w-full px-2 sm:px-4">

      <div class="mb-6">
        <p class="text-neutral-400 text-sm">Live Production Line & Batch Control</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6 mb-8 w-full">
        <div class="bg-neutral-900 border border-neutral-800 p-5 rounded-xl">
          <p class="text-xs uppercase tracking-wider text-neutral-500 mb-1">Total Batches</p>
          <p class="text-2xl font-bold font-mono text-white">{{ stats.total }}</p>
        </div>
        <div class="bg-neutral-900 border border-neutral-800 p-5 rounded-xl">
          <p class="text-xs uppercase tracking-wider text-neutral-500 mb-1">Completed</p>
          <p class="text-2xl font-bold font-mono text-emerald-400">{{ stats.completed }}</p>
        </div>
        <div class="bg-neutral-900 border border-neutral-800 p-5 rounded-xl">
          <p class="text-xs uppercase tracking-wider text-neutral-500 mb-1">In Progress</p>
          <p class="text-2xl font-bold font-mono text-indigo-400">{{ stats.inProgress }}</p>
        </div>
        <div class="bg-neutral-900 border border-neutral-800 p-5 rounded-xl">
          <p class="text-xs uppercase tracking-wider text-neutral-500 mb-1">Low Yield (&lt;80%)</p>
          <p class="text-2xl font-bold font-mono text-amber-500">{{ stats.lowYield }}</p>
        </div>
        <div class="bg-neutral-900 border border-neutral-800 p-5 rounded-xl">
          <p class="text-xs uppercase tracking-wider text-neutral-500 mb-1">Failed Runs</p>
          <p class="text-2xl font-bold font-mono text-red-500">{{ stats.failed }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 w-full mb-8">
        <BatchCard 
          v-for="item in batches" 
          :key="item.id" 
          :batch="item"
          @mark-failed="handleMarkFailed"
          @mark-done="handleOpenCompletionPanel"
          @advance-status="handleAdvanceStatus"
        />
      </div>

      <div v-if="activeCompletionBatch" class="mt-8 bg-neutral-900 border border-indigo-500/40 rounded-xl p-6 max-w-xl mx-auto shadow-2xl">
        <div class="flex justify-between items-start mb-4">
          <div>
            <span class="text-xs text-indigo-400 font-mono uppercase tracking-wider">Production Output Settlement</span>
            <h3 class="text-lg font-bold text-white">Complete Run: {{ activeCompletionBatch.product_name }}</h3>
          </div>
          <button @click="activeCompletionBatch = null" class="text-neutral-500 hover:text-white text-lg cursor-pointer">&#10005;</button>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center mb-6">
          <div>
            <label class="block text-xs text-neutral-400 uppercase mb-1 font-medium">Actual Produced Qty</label>
            <input 
              type="number" 
              v-model.number="formActual" 
              min="0" 
              class="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-white outline-none focus:border-indigo-500 font-mono" 
            />
          </div>
          <div>
            <label class="block text-xs text-neutral-400 uppercase mb-1 font-medium">Wastage Units</label>
            <input 
              type="number" 
              v-model.number="formWaste" 
              min="0" 
              class="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-white outline-none focus:border-indigo-500 font-mono" 
            />
          </div>
        </div>
        
        <button 
          @click="confirmBatchSettlement" 
          class="w-full bg-indigo-600 text-white rounded-lg py-2.5 font-bold hover:bg-indigo-500 transition-colors shadow-lg text-sm cursor-pointer"
        >
          Confirm Production Entry
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import BatchCard from '../components/BatchCard.vue' // Imports with the corrected capital "C"

// Task 1: Dataset structured exactly matching the teacher's ERD columns mapping layout
const batches = ref([
  { id: 1, product_name: 'Chocolate Cake', product_id: 2, planned_quantity: 20, actual_quantity: 18, wastage_quantity: 2, status: 'done', started_at: '06:30', completed_at: '09:00' },
  { id: 2, product_name: 'Cinnamon Roll', product_id: 8, planned_quantity: 30, actual_quantity: null, wastage_quantity: 0, status: 'planned', started_at: null, completed_at: null },
  { id: 3, product_name: 'White Bread', product_id: 1, planned_quantity: 50, actual_quantity: 35, wastage_quantity: 15, status: 'done', started_at: '05:00', completed_at: '07:00' },
  { id: 4, product_name: 'Meat Pie', product_id: 9, planned_quantity: 40, actual_quantity: null, wastage_quantity: 0, status: 'baking', started_at: '10:00', completed_at: null }
])

const activeCompletionBatch = ref(null)
const formActual = ref(0)
const formWaste = ref(0)

// Task 2: Computed metrics monitoring engine calculation loops
const stats = computed(() => {
  const total = batches.value.length
  let completed = 0
  let inProgress = 0
  let lowYield = 0
  let failed = 0

  batches.value.forEach(b => {
    if (b.status === 'failed') {
      failed++
    } else if (b.status === 'done') {
      completed++
      if ((b.actual_quantity / b.planned_quantity) < 0.8) {
        lowYield++
      }
    } else if (['mixing', 'baking', 'cooling'].includes(b.status)) {
      inProgress++
    }
  })

  return { total, completed, inProgress, lowYield, failed }
})

// Handles stepping forward down the line
const handleAdvanceStatus = ({ batch, nextStatus }) => {
  batch.status = nextStatus
  if (nextStatus === 'mixing') {
    batch.started_at = getCurrentTime()
  }
}

// Task 3: Opens input settlement form drawer panel
const handleOpenCompletionPanel = (batch) => {
  activeCompletionBatch.value = batch
  formActual.value = batch.planned_quantity
  formWaste.value = 0
}

const confirmBatchSettlement = () => {
  if (!activeCompletionBatch.value) return
  
  activeCompletionBatch.value.actual_quantity = formActual.value
  activeCompletionBatch.value.wastage_quantity = formWaste.value
  activeCompletionBatch.value.status = 'done'
  activeCompletionBatch.value.completed_at = getCurrentTime()

  activeCompletionBatch.value = null
}

// Task 4: Mark Failed status value state update
const handleMarkFailed = (batch) => {
  batch.status = 'failed'
}

const getCurrentTime = () => {
  const now = new Date()
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
}
</script>