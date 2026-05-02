<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useProductStore } from '../../stores/productStore'
import { useOrderStore } from '../../stores/orderStore'

const route = useRoute()
const router = useRouter()
const productStore = useProductStore()
const orderStore = useOrderStore()

const selectedProductId = ref<number | null>(null)
const quantity = ref(1)
const useOptimistic = ref(false)

onMounted(async () => {
  // Load products for selection
  await productStore.fetchProducts()
  
  // Pre-select product if passed in URL
  const productId = route.query.productId
  if (productId) {
    selectedProductId.value = Number(productId)
  }
})

const selectedProduct = ref<any>(null)

const handleProductSelect = (productId: number) => {
  selectedProductId.value = productId
  selectedProduct.value = productStore.products.find(p => p.id === productId)
}

const handleSubmit = async () => {
  if (!selectedProductId.value || !selectedProduct.value) return
  
  try {
    if (useOptimistic.value) {
      // Show how complex manual optimistic updates are
      await orderStore.createOrderOptimistic(
        selectedProductId.value,
        selectedProduct.value.name,
        selectedProduct.value.price,
        quantity.value
      )
    } else {
      // Standard approach - wait for server
      await orderStore.createOrder(selectedProductId.value, quantity.value)
    }
    router.push('/native/orders')
  } catch (error) {
    console.error('Failed to create order:', error)
  }
}
</script>

<template>
  <div>
    <!-- Back Button -->
    <RouterLink 
      to="/native/orders" 
      class="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
    >
      <span>←</span>
      <span>Back to Orders</span>
    </RouterLink>
    
    <!-- Demo Info Card -->
    <div class="card mb-6 border-amber-500/30 bg-amber-500/5">
      <div class="flex items-start gap-4">
        <div class="text-3xl">⏱️</div>
        <div>
          <h3 class="font-bold text-amber-400 mb-1">Slow Order Creation</h3>
          <p class="text-sm text-slate-400">
            After clicking "Create Order", you'll see a loading spinner for <strong class="text-amber-400">2+ seconds</strong> 
            while waiting for the server. Toggle "Optimistic" to see how complex manual optimistic updates are.
          </p>
        </div>
      </div>
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Order Form -->
      <div class="card">
        <h2 class="text-xl font-bold text-white mb-6">Create New Order</h2>
        
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Product Selection -->
          <div>
            <label class="block text-sm font-medium text-slate-400 mb-2">Select Product</label>
            <div v-if="productStore.loading" class="text-slate-500">Loading products...</div>
            <select 
              v-else
              v-model="selectedProductId"
              @change="handleProductSelect(selectedProductId!)"
              class="input"
              required
            >
              <option :value="null" disabled>Choose a product...</option>
              <option 
                v-for="product in productStore.products" 
                :key="product.id" 
                :value="product.id"
              >
                {{ product.image }} {{ product.name }} - ${{ product.price.toFixed(2) }}
              </option>
            </select>
          </div>
          
          <!-- Quantity -->
          <div>
            <label class="block text-sm font-medium text-slate-400 mb-2">Quantity</label>
            <input 
              type="number" 
              v-model="quantity" 
              min="1" 
              max="10" 
              class="input"
              required
            />
          </div>
          
          <!-- Optimistic Toggle -->
          <div class="flex items-center gap-3">
            <input 
              type="checkbox" 
              id="optimistic" 
              v-model="useOptimistic"
              class="w-5 h-5 rounded bg-slate-700 border-slate-600 text-primary-500 focus:ring-primary-500"
            />
            <label for="optimistic" class="text-sm text-slate-400">
              Use optimistic update (see manual implementation complexity)
            </label>
          </div>
          
          <!-- Submit Button -->
          <button 
            type="submit" 
            class="btn btn-primary w-full flex items-center justify-center gap-2"
            :disabled="orderStore.creating || !selectedProductId"
          >
            <template v-if="orderStore.creating">
              <div class="spinner"></div>
              <span>Creating Order...</span>
            </template>
            <template v-else>
              <span>🛒</span>
              <span>Create Order</span>
            </template>
          </button>
          
          <!-- Error Display -->
          <div v-if="orderStore.createError" class="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
            <p class="text-sm text-red-400">{{ orderStore.createError }}</p>
          </div>
        </form>
      </div>
      
      <!-- Order Preview -->
      <div class="card">
        <h2 class="text-xl font-bold text-white mb-6">Order Preview</h2>
        
        <div v-if="selectedProduct" class="space-y-4">
          <div class="flex items-center gap-4 p-4 rounded-lg bg-slate-700/30">
            <div class="w-16 h-16 rounded-xl bg-slate-600/50 flex items-center justify-center text-3xl">
              {{ selectedProduct.image }}
            </div>
            <div>
              <h3 class="font-bold text-white">{{ selectedProduct.name }}</h3>
              <p class="text-sm text-slate-400">{{ selectedProduct.category }}</p>
            </div>
          </div>
          
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-slate-400">Unit Price</span>
              <span class="text-white">${{ selectedProduct.price.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Quantity</span>
              <span class="text-white">{{ quantity }}</span>
            </div>
            <div class="border-t border-slate-600 pt-2 flex justify-between">
              <span class="font-bold text-white">Total</span>
              <span class="font-bold text-primary-400">${{ (selectedProduct.price * quantity).toFixed(2) }}</span>
            </div>
          </div>
        </div>
        
        <div v-else class="text-center py-12 text-slate-500">
          Select a product to see preview
        </div>
      </div>
    </div>
  </div>
</template>
