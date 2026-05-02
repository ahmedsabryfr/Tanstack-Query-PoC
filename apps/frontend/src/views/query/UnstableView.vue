<script setup lang="ts">
import { ref } from 'vue'
import { useUnstableOrders } from '../../composables/useOrders'

const { data, isLoading, error, isFetching, refetch, failureCount } = useUnstableOrders()

// Track manual attempts for comparison
const manualAttempts = ref(0)

const handleFetch = () => {
  manualAttempts.value++
  refetch()
}
</script>

<template>
  <div>
    <!-- Demo Info Card -->
    <div class="card mb-6 border-emerald-500/30 bg-emerald-500/5">
      <div class="flex items-start gap-4">
        <div class="text-3xl">⚡</div>
        <div>
          <h3 class="font-bold text-emerald-400 mb-1">Automatic Retries - Watch the Magic!</h3>
          <p class="text-sm text-slate-400">
            This endpoint fails <strong class="text-red-400">50% of the time</strong>, but TanStack Query 
            <strong class="text-emerald-400">automatically retries up to 3 times</strong>! 
            You'll see it keep trying until it succeeds.
          </p>
        </div>
      </div>
    </div>
    
    <!-- Status Card -->
    <div class="card mb-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold text-white">Unstable API Test</h2>
        <div class="flex items-center gap-2">
          <div class="badge badge-info">{{ manualAttempts }} clicks</div>
          <div v-if="failureCount > 0" class="badge badge-warning animate-pulse">
            Retry {{ failureCount }}/3
          </div>
        </div>
      </div>
      
      <p class="text-slate-400 mb-6">
        Click the button and watch TanStack Query automatically retry on failure. 
        Check the console to see retry attempts!
      </p>
      
      <button 
        @click="handleFetch" 
        class="btn btn-primary flex items-center gap-2"
        :disabled="isFetching"
      >
        <template v-if="isFetching">
          <div class="spinner"></div>
          <span>{{ failureCount > 0 ? `Retrying (${failureCount}/3)...` : 'Fetching...' }}</span>
        </template>
        <template v-else>
          <span>🎲</span>
          <span>Roll the Dice (Fetch)</span>
        </template>
      </button>
    </div>
    
    <!-- Retry Progress -->
    <div v-if="isFetching && failureCount > 0" class="card mb-6 border-amber-500/30 bg-amber-500/5">
      <div class="flex items-center gap-4">
        <div class="text-3xl animate-bounce">🔄</div>
        <div>
          <h3 class="font-bold text-amber-400">Automatic Retry in Progress</h3>
          <p class="text-sm text-slate-400">
            Failed {{ failureCount }} time(s). TanStack Query is retrying automatically...
          </p>
          <div class="mt-2 flex gap-2">
            <div 
              v-for="i in 3" 
              :key="i"
              :class="[
                'w-8 h-2 rounded-full',
                i <= failureCount ? 'bg-amber-500' : 'bg-slate-600'
              ]"
            ></div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Loading State (initial) -->
    <div v-if="isLoading" class="card">
      <div class="flex flex-col items-center justify-center py-12">
        <div class="spinner-lg mb-4"></div>
        <p class="text-slate-400">Fetching...</p>
        <p class="text-xs text-slate-500 mt-2">If it fails, we'll retry automatically!</p>
      </div>
    </div>
    
    <!-- Error Result (only after all retries exhausted) -->
    <div v-else-if="error && !isFetching" class="card border-red-500/30 bg-red-500/5">
      <div class="text-center py-8">
        <div class="text-6xl mb-4">💀</div>
        <h3 class="text-xl font-bold text-red-400 mb-2">All Retries Failed!</h3>
        <p class="text-slate-400 mb-4">{{ (error as Error).message }}</p>
        <div class="p-4 rounded-lg bg-slate-800 text-left max-w-md mx-auto">
          <p class="text-xs text-slate-500 mb-2">What happened:</p>
          <ul class="text-sm text-slate-400 space-y-1">
            <li>✅ TanStack tried 3 automatic retries</li>
            <li>❌ All 3 attempts failed (unlucky!)</li>
            <li>💡 Click to try again</li>
          </ul>
        </div>
      </div>
    </div>
    
    <!-- Success Result -->
    <div v-else-if="data" class="card border-emerald-500/30 bg-emerald-500/5">
      <div class="text-center py-8">
        <div class="text-6xl mb-4">🎉</div>
        <h3 class="text-xl font-bold text-emerald-400 mb-2">Success!</h3>
        <p class="text-slate-400 mb-4">{{ data.message }}</p>
        <div v-if="failureCount > 0" class="p-4 rounded-lg bg-slate-800 text-left max-w-md mx-auto">
          <p class="text-xs text-emerald-400">
            ⚡ Succeeded after {{ failureCount }} automatic retry(ies)!
            With Native Pinia, you would have had to click {{ failureCount + 1 }} times.
          </p>
        </div>
      </div>
    </div>
    
    <!-- Initial State -->
    <div v-else class="card text-center py-12">
      <p class="text-slate-500">Click the button above to test automatic retries</p>
    </div>
    
    <!-- Comparison Box -->
    <div class="card mt-6">
      <h3 class="font-bold text-white mb-4">Native vs TanStack Comparison</h3>
      <div class="grid grid-cols-2 gap-4">
        <div class="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
          <h4 class="font-bold text-amber-400 mb-2">❌ Native Pinia</h4>
          <ul class="text-sm text-slate-400 space-y-1">
            <li>• Manual retry implementation</li>
            <li>• User must click multiple times</li>
            <li>• No retry delay/backoff</li>
            <li>• Complex error handling</li>
          </ul>
        </div>
        <div class="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
          <h4 class="font-bold text-emerald-400 mb-2">✅ TanStack Query</h4>
          <ul class="text-sm text-slate-400 space-y-1">
            <li>• Automatic 3 retries</li>
            <li>• Exponential backoff</li>
            <li>• User clicks once</li>
            <li>• Built-in error states</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
