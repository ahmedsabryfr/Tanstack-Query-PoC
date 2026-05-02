<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useProducts } from '../../composables/useProducts'
import { useCreateOrder } from '../../composables/useOrders'

const route = useRoute()
const router = useRouter()

// Simple! useProducts handles everything
const { data: products, isLoading: productsLoading } = useProducts()

// Mutation with optimistic updates built-in
const createOrderMutation = useCreateOrder()

const selectedProductId = ref<number | null>(null)
const quantity = ref(1)

// Pre-select product if passed in URL
watch(() => route.query.productId, (productId) => {
  if (productId) {
    selectedProductId.value = Number(productId)
  }
}, { immediate: true })

const selectedProduct = computed(() => {
  if (!selectedProductId.value || !products.value) return null
  return products.value.find(p => p.id === selectedProductId.value)
})

const handleSubmit = async () => {
  if (!selectedProduct.value) return
  
  // Optimistic update happens automatically!
  await createOrderMutation.mutateAsync({
    productId: selectedProduct.value.id,
    productName: selectedProduct.value.name,
    price: selectedProduct.value.price,
    quantity: quantity.value,
  })
  
  router.push('/query/orders')
}
</script>

<template>
  <div>
    <!-- Back Button -->
    <RouterLink 
      to="/query/orders" 
      class="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
    >
      <span>←</span>
      <span>Back to Orders</span>
    </RouterLink>
    
    <!-- Demo Info Card -->
    <div class="card mb-6 border-emerald-500/30 bg-emerald-500/5">
      <div class="flex items-start gap-4">
        <div class="text-3xl">⚡</div>
        <div>
          <h3 class="font-bold text-emerald-400 mb-1">Optimistic Updates - Instant Feedback!</h3>
          <p class="text-sm text-slate-400">
            Click "Create Order" and you'll be redirected <strong class="text-emerald-400">immediately</strong> to the orders list
            where your new order already appears! The server syncs in the background. Compare with Native version.
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
            <div v-if="productsLoading" class="text-slate-500">Loading products...</div>
            <select 
              v-else
              v-model="selectedProductId"
              class="input"
              required
            >
              <option :value="null" disabled>Choose a product...</option>
              <option 
                v-for="product in products" 
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
          
          <!-- Submit Button -->
          <button 
            type="submit" 
            class="btn btn-primary w-full flex items-center justify-center gap-2"
            :disabled="createOrderMutation.isPending.value || !selectedProductId"
          >
            <template v-if="createOrderMutation.isPending.value">
              <div class="spinner"></div>
              <span>Creating...</span>
            </template>
            <template v-else>
              <span>⚡</span>
              <span>Create Order (Instant!)</span>
            </template>
          </button>
          
          <!-- Note about optimistic update -->
          <p class="text-xs text-slate-500 text-center">
            You'll be redirected immediately - the order appears in the list 
            <span class="text-emerald-400">before the server responds</span>!
          </p>
          
          <!-- Error Display -->
          <div v-if="createOrderMutation.error.value" class="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
            <p class="text-sm text-red-400">{{ (createOrderMutation.error.value as Error).message }}</p>
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
          
          <!-- Optimistic update preview -->
          <div class="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
            <p class="text-xs text-emerald-400">
              ⚡ This order will appear in your list <strong>immediately</strong> after clicking Create!
            </p>
          </div>
        </div>
        
        <div v-else class="text-center py-12 text-slate-500">
          Select a product to see preview
        </div>
      </div>
    </div>
  </div>
</template>
