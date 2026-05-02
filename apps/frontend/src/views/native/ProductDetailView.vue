<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useProductStore } from '../../stores/productStore'

const route = useRoute()
const productStore = useProductStore()

const fetchCount = ref(0)

const fetchProduct = async () => {
  const id = Number(route.params.id)
  if (id) {
    fetchCount.value++
    console.log(`[Native Product Detail] Fetching product #${id} (fetch #${fetchCount.value})`)
    await productStore.fetchProduct(id)
  }
}

onMounted(fetchProduct)

// Re-fetch when route param changes
watch(() => route.params.id, fetchProduct)
</script>

<template>
  <div>
    <!-- Back Button -->
    <RouterLink 
      to="/native/products" 
      class="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
    >
      <span>←</span>
      <span>Back to Products</span>
    </RouterLink>
    
    <!-- Demo Info Card -->
    <div class="card mb-6 border-amber-500/30 bg-amber-500/5">
      <div class="flex items-start gap-4">
        <div class="text-3xl">⚠️</div>
        <div>
          <h3 class="font-bold text-amber-400 mb-1">No Cache = Slow Navigation</h3>
          <p class="text-sm text-slate-400">
            You just waited 2 seconds to see this product. Go back to the list and click the same product again - 
            <strong class="text-amber-400">you'll wait another 2 seconds!</strong> There's no caching.
          </p>
          <p class="text-xs text-slate-500 mt-2">
            Times fetched this session: <span class="text-amber-400 font-mono">{{ fetchCount }}</span>
          </p>
        </div>
      </div>
    </div>
    
    <!-- Loading State -->
    <div v-if="productStore.loading" class="card">
      <div class="flex flex-col items-center justify-center py-20">
        <div class="spinner-lg mb-4"></div>
        <p class="text-slate-400">Loading product...</p>
        <p class="text-xs text-slate-500 mt-2">2 second server delay</p>
      </div>
    </div>
    
    <!-- Error State -->
    <div v-else-if="productStore.error" class="card border-red-500/30 bg-red-500/5">
      <div class="flex items-center gap-4">
        <div class="text-3xl">❌</div>
        <div>
          <h3 class="font-bold text-red-400">Error Loading Product</h3>
          <p class="text-sm text-slate-400">{{ productStore.error }}</p>
        </div>
      </div>
    </div>
    
    <!-- Product Detail -->
    <div v-else-if="productStore.currentProduct" class="card">
      <div class="flex flex-col md:flex-row gap-8">
        <!-- Product Image -->
        <div class="w-full md:w-1/3">
          <div class="aspect-square rounded-2xl bg-slate-700/50 flex items-center justify-center text-8xl">
            {{ productStore.currentProduct.image }}
          </div>
        </div>
        
        <!-- Product Info -->
        <div class="flex-1">
          <div class="badge badge-info mb-4">{{ productStore.currentProduct.category }}</div>
          <h1 class="text-3xl font-bold text-white mb-2">{{ productStore.currentProduct.name }}</h1>
          <p class="text-slate-400 mb-6">Product ID: #{{ productStore.currentProduct.id }}</p>
          
          <div class="flex items-end gap-4 mb-6">
            <span class="text-4xl font-bold text-primary-400">${{ productStore.currentProduct.price.toFixed(2) }}</span>
            <span class="text-slate-500 line-through">$299.99</span>
          </div>
          
          <div class="flex items-center gap-4 mb-8">
            <div class="badge badge-success">✓ In Stock</div>
            <span class="text-slate-400">{{ productStore.currentProduct.stock }} units available</span>
          </div>
          
          <RouterLink 
            :to="`/native/orders/new?productId=${productStore.currentProduct.id}`"
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
