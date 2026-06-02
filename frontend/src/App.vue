<template>
  <div class="min-h-screen bg-neutral-950 text-neutral-200 font-sans">
    
    <nav class="bg-neutral-900 border-b border-neutral-800 p-4 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-2">
          <span class="text-xl font-bold text-indigo-400">🍞 Bakery ProductionSystem</span>
        </div>
        
        <div class="flex items-center gap-6 text-sm font-medium">
          <RouterLink 
            to="/" 
            class="text-neutral-400 hover:text-white transition-colors"
            active-class="text-white font-semibold"
          >
            Products 
          </RouterLink>
          
          <RouterLink 
            to="/dashboard" 
            class="bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 px-3 py-1.5 rounded-lg hover:bg-indigo-600 hover:text-white transition-all"
            active-class="bg-indigo-600 !text-white border-transparent"
          >
            📋 Ingredients
          </RouterLink>
        </div>
      </div>
    </nav>

    <main>
      <RouterView />
    </main>

  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>