import { defineStore } from 'pinia'
import { ref } from 'vue'
import api, { type Product } from '../api'

/**
 * Native Pinia Store - "The Messy Way"
 * 
 * This demonstrates the traditional approach with manual state management.
 * Notice how we need to manually track:
 * - Loading states
 * - Error states
 * - Caching logic (or lack thereof)
 */
export const useProductStore = defineStore('products', () => {
  // Manual state management - we have to track everything ourselves
  const products = ref<Product[]>([])
  const currentProduct = ref<Product | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // Track last fetch time for "manual caching" demo
  const lastFetchTime = ref<number | null>(null)
  
  // Request counter to show duplicate requests
  let requestCount = 0
  
  /**
   * Fetch all products
   * 
   * Problems demonstrated:
   * 1. No automatic caching - fetches every time
   * 2. Manual loading/error state management
   * 3. Race conditions if called multiple times quickly
   */
  async function fetchProducts() {
    requestCount++
    const currentRequest = requestCount
    console.log(`[Native Store] Fetching products (request #${currentRequest})`)
    
    loading.value = true
    error.value = null
    
    try {
      const response = await api.get<Product[]>('/products')
      
      // Race condition: only update if this is still the latest request
      // But this is a naive implementation - real apps need more complex logic
      if (currentRequest === requestCount) {
        products.value = response.data
        lastFetchTime.value = Date.now()
      } else {
        console.log(`[Native Store] Ignoring stale response from request #${currentRequest}`)
      }
    } catch (e: any) {
      if (currentRequest === requestCount) {
        error.value = e.message || 'Failed to fetch products'
      }
    } finally {
      if (currentRequest === requestCount) {
        loading.value = false
      }
    }
  }
  
  /**
   * Fetch single product
   * 
   * Problems demonstrated:
   * 1. Always fetches from server - no cached product lookup
   * 2. Clears currentProduct on each call (flash of empty state)
   */
  async function fetchProduct(id: number) {
    console.log(`[Native Store] Fetching product #${id}`)
    
    loading.value = true
    error.value = null
    currentProduct.value = null // This causes a flash of empty content
    
    try {
      const response = await api.get<Product>(`/products/${id}`)
      currentProduct.value = response.data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch product'
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Naive caching attempt
   * Check if we should refetch (if data is older than 5 seconds)
   * 
   * Problems:
   * 1. We have to implement this logic ourselves
   * 2. It's easy to get wrong
   * 3. No background refetch - data just gets stale
   */
  function shouldRefetch(): boolean {
    if (!lastFetchTime.value) return true
    const staleTime = 5000 // 5 seconds
    return Date.now() - lastFetchTime.value > staleTime
  }
  
  /**
   * Create product - without optimistic updates
   * 
   * Problems:
   * 1. User waits 2+ seconds for server response
   * 2. Must manually refetch to see new product in list
   * 3. No immediate feedback
   */
  const creating = ref(false)
  const createError = ref<string | null>(null)
  
  async function createProduct() {
    console.log('[Native Store] Creating product (no optimistic update)')
    
    creating.value = true
    createError.value = null
    
    try {
      const response = await api.post<Product>('/products')
      
      // After 2+ seconds, add to list
      products.value.push(response.data)
      
      return response.data
    } catch (e: any) {
      createError.value = e.message || 'Failed to create product'
      throw e
    } finally {
      creating.value = false
    }
  }
  
  // Reset store
  function reset() {
    products.value = []
    currentProduct.value = null
    loading.value = false
    error.value = null
    lastFetchTime.value = null
    creating.value = false
    createError.value = null
  }
  
  return {
    // State
    products,
    currentProduct,
    loading,
    error,
    lastFetchTime,
    creating,
    createError,
    
    // Actions
    fetchProducts,
    fetchProduct,
    shouldRefetch,
    createProduct,
    reset,
  }
})
