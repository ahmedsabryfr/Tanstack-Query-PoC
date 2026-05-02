<script setup lang="ts">
import { onMounted } from 'vue'
import { useOrderStore } from '../../stores/orderStore'

const orderStore = useOrderStore()

onMounted(() => {
  orderStore.resetUnstable()
})

const handleFetch = () => {
  orderStore.fetchUnstable()
}
</script>

<template>
  <div>
    <!-- Demo Info Card -->
    <div class="card mb-6 border-red-500/30 bg-red-500/5">
      <div class="flex items-start gap-4">
        <div class="text-3xl">💥</div>
        <div>
          <h3 class="font-bold text-red-400 mb-1">Chaos Route - No Retries</h3>
          <p class="text-sm text-slate-400">
            This endpoint fails <strong class="text-red-400">50% of the time</strong>. 
            With native Pinia, when it fails, you just get an error - no automatic retries.
            Compare this with TanStack Query which retries automatically!
          </p>
        </div>
      </div>
    </div>
    
    <!-- Status Card -->
    <div class="card mb-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold text-white">Unstable API Test</h2>
        <div class="badge badge-warning">{{ orderStore.unstableAttempts }} attempts</div>
      </div>
      
      <p class="text-slate-400 mb-6">
        Click the button below to call the unstable endpoint. Each click is a new attempt - 
        there's no automatic retry on failure.
      </p>
      
      <button 
        @click="handleFetch" 
        class="btn btn-primary flex items-center gap-2"
        :disabled="orderStore.unstableLoading"
      >
        <template v-if="orderStore.unstableLoading">
          <div class="spinner"></div>
          <span>Fetching...</span>
        </template>
        <template v-else>
          <span>🎲</span>
          <span>Roll the Dice (Fetch)</span>
        </template>
      </button>
    </div>
    
    <!-- Result Display -->
    <div v-if="orderStore.unstableLoading" class="card">
      <div class="flex flex-col items-center justify-center py-12">
        <div class="spinner-lg mb-4"></div>
        <p class="text-slate-400">Waiting for server...</p>
        <p class="text-xs text-slate-500 mt-2">Will it succeed? 🎲</p>
      </div>
    </div>
    
    <!-- Error Result -->
    <div v-else-if="orderStore.unstableError" class="card border-red-500/30 bg-red-500/5">
      <div class="text-center py-8">
        <div class="text-6xl mb-4">💀</div>
        <h3 class="text-xl font-bold text-red-400 mb-2">Request Failed!</h3>
        <p class="text-slate-400 mb-4">{{ orderStore.unstableError }}</p>
        <div class="p-4 rounded-lg bg-slate-800 text-left max-w-md mx-auto">
          <p class="text-xs text-slate-500 mb-2">With Native Pinia:</p>
          <ul class="text-sm text-slate-400 space-y-1">
            <li>❌ No automatic retry</li>
            <li>❌ User must manually click again</li>
            <li>❌ Poor user experience</li>
          </ul>
        </div>
      </div>
    </div>
    
    <!-- Success Result -->
    <div v-else-if="orderStore.unstableData" class="card border-emerald-500/30 bg-emerald-500/5">
      <div class="text-center py-8">
        <div class="text-6xl mb-4">🎉</div>
        <h3 class="text-xl font-bold text-emerald-400 mb-2">Request Succeeded!</h3>
        <p class="text-slate-400">{{ orderStore.unstableData.message }}</p>
      </div>
    </div>
    
    <!-- Initial State -->
    <div v-else class="card text-center py-12">
      <p class="text-slate-500">Click the button above to test the unstable endpoint</p>
    </div>
  </div>
</template>
