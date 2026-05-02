<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useProductStore } from '../../stores/productStore'
import api from '../../api'

const productStore = useProductStore()

// Track fetch count for demo purposes
const fetchCount = ref(0)

onMounted(async () => {
  // Always fetch - no caching in native approach
  fetchCount.value++
  console.log(`[Native Products] Fetching products (fetch #${fetchCount.value})`)
  await productStore.fetchProducts()
})

// Manual refetch
const handleRefetch = async () => {
  fetchCount.value++
  await productStore.fetchProducts()
}

// Add product - waits for server
const handleAddProduct = async () => {
  await productStore.createProduct()
}

// Silent update - simulates another user adding a product
const silentAdding = ref(false)
const handleSilentUpdate = async () => {
  silentAdding.value = true
  try {
    // Call API directly without updating Pinia store
    await api.post('/products')
    console.log('[Native] Silent update: Product added by "another user" - need manual refetch to see it!')
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
    <div class="card mb-6 border-amber-500/30 bg-amber-500/5">
      <div class="flex items-start gap-4">
        <div class="text-3xl">⚠️</div>
        <div>
          <h3 class="font-bold text-amber-400 mb-1">Native Pinia Demo</h3>
          <p class="text-sm text-slate-400">
            Notice: Every time you visit this page, it <strong class="text-amber-400">fetches from the server</strong> (2 second wait).
            Try clicking a product, going back, then clicking the same product again.
          </p>
          <p class="text-xs text-slate-500 mt-2">
            Fetch count this session: <span class="text-amber-400 font-mono">{{ fetchCount }}</span>
          </p>
          <p class="text-xs text-amber-400 mt-2">
            💡 Try <strong>Silent Update</strong> to simulate another user adding a product - you'll need to manually refetch!
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
          :disabled="productStore.creating"
        >
          <template v-if="productStore.creating">
            <div class="spinner"></div>
            <span>Adding...</span>
          </template>
          <template v-else>
            <span>➕</span>
            <span>Add Product</span>
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
        <button @click="handleRefetch" class="btn btn-secondary flex items-center gap-2">
          <span>🔄</span>
          <span>Refetch</span>
        </button>
        <span v-if="productStore.lastFetchTime" class="text-xs text-slate-500">
          Last fetch: {{ new Date(productStore.lastFetchTime).toLocaleTimeString() }}
        </span>
      </div>
      <div class="flex items-center gap-2">
        <div v-if="productStore.creating" class="badge badge-warning animate-pulse">
          Waiting 2s for server...
        </div>
        <div v-if="silentAdding" class="badge badge-info animate-pulse">
          👤 Another user is adding...
        </div>
      </div>
    </div>
    
    <!-- Silent Update Info -->
    <div v-if="silentAdding" class="card mb-6 border-sky-500/30 bg-sky-500/5">
      <div class="flex items-start gap-4">
        <div class="text-3xl">👤</div>
        <div>
          <h3 class="font-bold text-sky-400 mb-1">Simulating Another User</h3>
          <p class="text-sm text-slate-400">
            A product is being added to the database, but <strong class="text-sky-400">your UI won't update</strong> 
            automatically. You need to click <strong class="text-sky-400">"Refetch"</strong> to see it!
          </p>
        </div>
      </div>
    </div>
    
    <!-- Loading State -->
    <div v-if="productStore.loading" class="flex flex-col items-center justify-center py-20">
      <div class="spinner-lg mb-4"></div>
      <p class="text-slate-400">Loading products...</p>
      <p class="text-xs text-slate-500 mt-2">This takes 2 seconds due to server delay</p>
    </div>
    
    <!-- Error State -->
    <div v-else-if="productStore.error" class="card border-red-500/30 bg-red-500/5">
      <div class="flex items-center gap-4">
        <div class="text-3xl">❌</div>
        <div>
          <h3 class="font-bold text-red-400">Error Loading Products</h3>
          <p class="text-sm text-slate-400">{{ productStore.error }}</p>
        </div>
      </div>
    </div>
    
    <!-- Products Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <RouterLink
        v-for="product in productStore.products"
        :key="product.id"
        :to="`/native/products/${product.id}`"
        class="card-hover group cursor-pointer"
      >
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
