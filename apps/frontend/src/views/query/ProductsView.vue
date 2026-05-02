<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useProducts, useCreateProduct } from '../../composables/useProducts'
import api from '../../api'

// That's it! All loading, error, and caching handled automatically
const { data: products, isLoading, error, isFetching, refetch, dataUpdatedAt } = useProducts()

// Mutation for creating products with optimistic updates
const createProductMutation = useCreateProduct()

const handleAddProduct = () => {
  createProductMutation.mutate()
}

// Silent update - simulates another user adding a product
const silentAdding = ref(false)
const handleSilentUpdate = async () => {
  silentAdding.value = true
  try {
    // Call API directly without using mutation
    await api.post('/products')
    console.log('[Query] Silent update: Product added by "another user" - will auto-sync on window focus or manual refetch!')
  } catch (error) {
    console.error('Silent update failed:', error)
  } finally {
    silentAdding.value = false
  }
}
</script>

<template>
  <div>
    <!-- Demo Info Card -->
    <div class="card mb-6 border-emerald-500/30 bg-emerald-500/5">
      <div class="flex items-start gap-4">
        <div class="text-3xl">⚡</div>
        <div>
          <h3 class="font-bold text-emerald-400 mb-1">TanStack Query Magic</h3>
          <p class="text-sm text-slate-400">
            Data is <strong class="text-emerald-400">cached for 5 seconds</strong>. 
            Click a product, go back, click the same product - <strong class="text-emerald-400">instant!</strong>
            Also try switching tabs and coming back to see background refetch.
          </p>
          <p class="text-xs text-slate-500 mt-2">
            Last updated: {{ dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString() : 'Never' }}
            <span v-if="isFetching && !isLoading" class="text-emerald-400 ml-2">↻ Background refetching...</span>
          </p>
          <p class="text-xs text-emerald-400 mt-2">
            💡 Try <strong>Silent Update</strong> then switch browser tabs and come back - auto-sync magic!
          </p>
        </div>
      </div>
    </div>
    
    <!-- Controls -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-4">
        <button 
          @click="handleAddProduct" 
          class="btn btn-primary flex items-center gap-2"
          :disabled="createProductMutation.isPending.value"
        >
          <template v-if="createProductMutation.isPending.value">
            <div class="spinner"></div>
            <span>Adding...</span>
          </template>
          <template v-else>
            <span>⚡</span>
            <span>Add Product (Instant!)</span>
          </template>
        </button>
        <button 
          @click="handleSilentUpdate" 
          class="btn btn-secondary flex items-center gap-2"
          :disabled="silentAdding"
        >
          <template v-if="silentAdding">
            <div class="spinner"></div>
            <span>Adding...</span>
          </template>
          <template v-else>
            <span>👤</span>
            <span>Silent Update</span>
          </template>
        </button>
        <button @click="refetch()" class="btn btn-secondary flex items-center gap-2">
          <span :class="{ 'animate-spin': isFetching }">🔄</span>
          <span>Refetch</span>
        </button>
        <span v-if="isFetching && !isLoading" class="badge badge-success animate-pulse">
          Background sync
        </span>
      </div>
      <div class="flex items-center gap-2">
        <div v-if="createProductMutation.isPending.value" class="badge badge-success animate-pulse">
          ⚡ Optimistic update - see product appear immediately!
        </div>
        <div v-if="silentAdding" class="badge badge-info animate-pulse">
          👤 Another user is adding...
        </div>
      </div>
    </div>
    
    <!-- Silent Update Info -->
    <div v-if="silentAdding" class="card mb-6 border-emerald-500/30 bg-emerald-500/5">
      <div class="flex items-start gap-4">
        <div class="text-3xl">⚡</div>
        <div>
          <h3 class="font-bold text-emerald-400 mb-1">TanStack Query Auto-Sync</h3>
          <p class="text-sm text-slate-400">
            A product is being added by "another user". After it's added, 
            <strong class="text-emerald-400">switch tabs and come back</strong> to see TanStack Query 
            automatically refetch and sync the new data! Or click "Refetch" manually.
          </p>
        </div>
      </div>
    </div>
    
    <!-- Loading State -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
      <div class="spinner-lg mb-4"></div>
      <p class="text-slate-400">Loading products...</p>
      <p class="text-xs text-slate-500 mt-2">First load takes 2 seconds (server delay)</p>
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="card border-red-500/30 bg-red-500/5">
      <div class="flex items-center gap-4">
        <div class="text-3xl">❌</div>
        <div>
          <h3 class="font-bold text-red-400">Error Loading Products</h3>
          <p class="text-sm text-slate-400">{{ (error as Error).message }}</p>
        </div>
      </div>
    </div>
    
    <!-- Products Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <RouterLink
        v-for="product in products"
        :key="product.id"
        :to="`/query/products/${product.id}`"
        class="card-hover group cursor-pointer relative overflow-hidden"
      >
        <!-- Cache indicator -->
        <div class="absolute top-2 right-2 badge badge-success text-xs">
          ✓ Cached
        </div>
        
        <div class="flex items-center gap-4 mb-4">
          <div class="w-16 h-16 rounded-xl bg-slate-700/50 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
            {{ product.image }}
          </div>
          <div class="flex-1">
            <h3 class="font-bold text-white group-hover:text-primary-400 transition-colors">
              {{ product.name }}
            </h3>
            <p class="text-sm text-slate-400">{{ product.category }}</p>
          </div>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-2xl font-bold text-primary-400">${{ product.price.toFixed(2) }}</span>
          <span class="badge badge-info">{{ product.stock }} in stock</span>
        </div>
      </RouterLink>
    </div>
  </div>
</template>
