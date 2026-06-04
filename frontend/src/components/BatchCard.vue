<!-- src/components/BatchCard.vue -->
<template>
  <div 
    class="bg-neutral-900 border border-neutral-800 rounded-xl p-5 flex flex-col justify-between transition-all hover:border-neutral-700 shadow-sm"
  >
    <div>
      <!-- Header Identity block -->
      <div class="flex justify-between items-start mb-4 gap-2">
        <div>
          <!-- Using product_name and planned_quantity exactly from teacher's blueprint -->
          <h3 class="text-lg font-bold text-white leading-tight">{{ batch.product_name }}</h3>
          <p class="text-xs text-neutral-500 mt-1">Plan: {{ batch.planned_quantity }} units</p>
        </div>
        
        <!-- Dynamic Badges reflecting status properties -->
        <span 
          class="text-[10px] px-2 py-0.5 rounded font-mono font-medium uppercase tracking-wider shrink-0"
          :class="{
            'bg-neutral-800 text-neutral-400 border border-neutral-700': batch.status === 'planned',
            'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20': ['mixing', 'baking'].includes(batch.status),
            'bg-amber-500/10 text-amber-400 border border-amber-500/20': batch.status === 'cooling',
            'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20': batch.status === 'done' && (batch.actual_quantity / batch.planned_quantity >= 0.8),
            'bg-yellow-600/10 text-yellow-500 border border-yellow-500/20': batch.status === 'done' && (batch.actual_quantity / batch.planned_quantity < 0.8),
            'bg-red-500/10 text-red-400 border border-red-500/20': batch.status === 'failed'
          }"
        >
          {{ batch.status === 'done' && (batch.actual_quantity / batch.planned_quantity < 0.8) ? 'Low Yield' : batch.status }}
        </span>
      </div>

      <!-- Task 4: Red Alert Box Indicator for Failed Batches -->
      <div v-if="batch.status === 'failed'" class="bg-red-950/40 border border-red-500/30 rounded-lg p-3 text-xs text-red-300 mb-4 font-medium flex items-center gap-2">
        ❌ This batch run completely failed parameters.
      </div>

      <!-- Timeline & Metric Data Matrix -->
      <div class="space-y-2 text-sm text-neutral-400 mb-4 font-sans">
        <div v-if="batch.started_at" class="flex justify-between text-xs">
          <span>Started At:</span>
          <span class="text-neutral-300 font-mono">{{ batch.started_at }}</span>
        </div>
        <div v-if="batch.completed_at" class="flex justify-between text-xs">
          <span>Completed At:</span>
          <span class="text-neutral-300 font-mono">{{ batch.completed_at }}</span>
        </div>
        <div v-if="batch.actual_quantity !== null" class="flex justify-between border-b border-neutral-800/50 pb-1 pt-1">
          <span>Actual Output:</span>
          <span class="text-neutral-200 font-mono">{{ batch.actual_quantity }} units</span>
        </div>
        <div v-if="batch.wastage_quantity > 0" class="flex justify-between text-red-400 text-xs">
          <span>Wastage Count:</span>
          <span class="font-mono">{{ batch.wastage_quantity }} discarded</span>
        </div>
        <div v-if="batch.status === 'done' && batch.actual_quantity !== null" class="flex justify-between font-mono text-xs pt-1">
          <span>Calculated Yield:</span>
          <span :class="(batch.actual_quantity / batch.planned_quantity) < 0.8 ? 'text-amber-500' : 'text-emerald-400'">
            {{ ((batch.actual_quantity / batch.planned_quantity) * 100).toFixed(0) }}%
          </span>
        </div>
      </div>
    </div>

    <!-- Action Interactive Trigger Area -->
    <div class="mt-2 pt-3 border-t border-neutral-800/60 flex flex-col gap-2">
      <div v-if="batch.status !== 'done' && batch.status !== 'failed'" class="flex justify-between items-center w-full">
        
        <!-- Task 4: Mark Failed text button for Mixing/Baking state blocks -->
        <button 
          v-if="['mixing', 'baking'].includes(batch.status)"
          @click="$emit('mark-failed', batch)"
          class="text-xs text-red-400 hover:text-red-300 transition-colors font-medium hover:underline cursor-pointer"
        >
          ❌ Mark Failed
        </button>
        <div v-else></div>

        <!-- General Advance Pipeline Controls -->
        <button 
          v-if="batch.status === 'cooling'"
          @click="$emit('mark-done', batch)"
          class="bg-amber-600 hover:bg-amber-500 text-white text-xs px-3 py-1.5 rounded-lg transition-colors font-semibold cursor-pointer"
        >
          Mark Done
        </button>
        <button 
          v-else-if="batch.status === 'planned'"
          @click="$emit('advance-status', { batch, nextStatus: 'mixing' })"
          class="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-3 py-1.5 rounded-lg transition-colors font-semibold cursor-pointer"
        >
          Start Mixing
        </button>
        <button 
          v-else-if="batch.status === 'mixing'"
          @click="$emit('advance-status', { batch, nextStatus: 'baking' })"
          class="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-3 py-1.5 rounded-lg transition-colors font-semibold cursor-pointer"
        >
          Start Baking
        </button>
        <button 
          v-else-if="batch.status === 'baking'"
          @click="$emit('advance-status', { batch, nextStatus: 'cooling' })"
          class="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-3 py-1.5 rounded-lg transition-colors font-semibold cursor-pointer"
        >
          Move to Cooling
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
// Task 1 & Teacher's Screenshot Blueprint setup
defineProps({
  batch: {
    type: Object,
    required: true
  }
})

defineEmits(['mark-failed', 'mark-done', 'advance-status'])
</script>