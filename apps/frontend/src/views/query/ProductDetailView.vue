<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useProduct } from '../../composables/useProducts'

const route = useRoute()
const productId = computed(() => Number(route.params.id))

// One line! Automatic caching, loading states, etc.
const { data: product, isLoading, error, isFetching, dataUpdatedAt } = useProduct(productId)
</script>

<template>
  <div>
    <!-- Back Button -->
    <RouterLink 
      to="/query/products" 
      class="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
    >
      <span>←</span>
      <span>Back to Products</span>
    </RouterLink>
    
    <!-- Demo Info Card -->
    <div class="card mb-6 border-emerald-500/30 bg-emerald-500/5">
      <div class="flex items-start gap-4">
        <div class="text-3xl">⚡</div>
        <div>
          <h3 class="font-bold text-emerald-400 mb-1">Instant Cache Hit!</h3>
          <p class="text-sm text-slate-400">
            If you visited this product before (within 5 seconds), it loaded <strong class="text-emerald-400">instantly from cache</strong>!
            Go back and click the same product again to see the difference.
          </p>
          <p class="text-xs text-slate-500 mt-2">
            Cached at: {{ dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString() : 'Loading...' }}
            <span v-if="isFetching && !isLoading" class="text-emerald-400 ml-2">↻ Background sync...</span>
          </p>
        </div>
      </div>
    </div>
    
    <!-- Loading State -->
    <div v-if="isLoading" class="card">
      <div class="flex flex-col items-center justify-center py-20">
        <div class="spinner-lg mb-4"></div>
        <p class="text-slate-400">Loading product...</p>
        <p class="text-xs text-slate-500 mt-2">First load only - subsequent visits are instant!</p>
      </div>
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="card border-red-500/30 bg-red-500/5">
      <div class="flex items-center gap-4">
        <div class="text-3xl">❌</div>
        <div>
          <h3 class="font-bold text-red-400">Error Loading Product</h3>
          <p class="text-sm text-slate-400">{{ (error as Error).message }}</p>
        </div>
      </div>
    </div>
    
    <!-- Product Detail -->
    <div v-else-if="product" class="card relative">
      <!-- Cache status badge -->
      <div class="absolute top-6 right-6 badge badge-success">
        ✓ Cached
      </div>
      
      <div class="flex flex-col md:flex-row gap-8">
        <!-- Product Image -->
        <div class="w-full md:w-1/3">
          <div class="aspect-square rounded-2xl bg-slate-700/50 flex items-center justify-center text-8xl">
            {{ product.image }}
          </div>
        </div>
        
        <!-- Product Info -->
        <div class="flex-1">
          <div class="badge badge-info mb-4">{{ product.category }}</div>
          <h1 class="text-3xl font-bold text-white mb-2">{{ product.name }}</h1>
          <p class="text-slate-400 mb-6">Product ID: #{{ product.id }}</p>
          
          <div class="flex items-end gap-4 mb-6">
            <span class="text-4xl font-bold text-primary-400">${{ product.price.toFixed(2) }}</span>
            <span class="text-slate-500 line-through">$299.99</span>
          </div>
          
          <div class="flex items-center gap-4 mb-8">
            <div class="badge badge-success">✓ In Stock</div>
            <span class="text-slate-400">{{ product.stock }} units available</span>
          </div>
          
          <RouterLink 
            :to="`/query/orders/new?productId=${product.id}`"
            class="btn btn-primary inline-flex items-center gap-2"
          >
            <span>🛒</span>
            <span>Add to Cart</span>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
