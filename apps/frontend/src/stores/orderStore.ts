import { defineStore } from 'pinia'
import { ref } from 'vue'
import api, { type Order, type UnstableResponse } from '../api'

/**
 * Native Pinia Store for Orders - "The Messy Way"
 * 
 * Demonstrates the complexity of:
 * - Manual optimistic updates
 * - Rollback on failure
 * - Manual cache invalidation
 * - Error handling without retries
 */
export const useOrderStore = defineStore('orders', () => {
  // Manual state management
  const orders = ref<Order[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const creating = ref(false)
  const createError = ref<string | null>(null)
  
  // For unstable route demo
  const unstableLoading = ref(false)
  const unstableError = ref<string | null>(null)
  const unstableData = ref<UnstableResponse | null>(null)
  const unstableAttempts = ref(0)
  
  /**
   * Fetch all orders
   */
  async function fetchOrders() {
    console.log('[Native Store] Fetching orders')
    
    loading.value = true
    error.value = null
    
    try {
      const response = await api.get<Order[]>('/orders')
      orders.value = response.data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch orders'
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Create order - WITHOUT optimistic updates
   * 
   * Problems demonstrated:
   * 1. User sees a loading spinner for 2+ seconds
   * 2. UI doesn't update until server confirms
   * 3. Poor perceived performance
   */
  async function createOrder(productId: number, quantity: number = 1) {
    console.log('[Native Store] Creating order (no optimistic update)')
    
    creating.value = true
    createError.value = null
    
    try {
      const response = await api.post<Order>('/orders', { productId, quantity })
      
      // Only after server confirms, update the UI
      // User had to wait 2+ seconds for this!
      orders.value.unshift(response.data)
      
      return response.data
    } catch (e: any) {
      createError.value = e.message || 'Failed to create order'
      throw e
    } finally {
      creating.value = false
    }
  }
  
  /**
   * Create order - WITH manual optimistic updates
   * 
   * This shows how complex manual optimistic updates are:
   * 1. We have to create a fake order with temp ID
   * 2. Insert it into the list
   * 3. Replace it with real data on success
   * 4. Roll back on failure
   */
  async function createOrderOptimistic(productId: number, productName: string, price: number, quantity: number = 1) {
    console.log('[Native Store] Creating order with manual optimistic update')
    
    creating.value = true
    createError.value = null
    
    // Create optimistic order with temp ID
    const tempId = -Date.now() // Negative ID to identify it
    const optimisticOrder: Order = {
      id: tempId,
      productId,
      productName,
      quantity,
      total: price * quantity,
      status: 'Processing',
      createdAt: new Date().toISOString().slice(0, 10),
    }
    
    // Insert optimistic order
    orders.value.unshift(optimisticOrder)
    
    try {
      const response = await api.post<Order>('/orders', { productId, quantity })
      
      // Replace optimistic order with real one
      const index = orders.value.findIndex(o => o.id === tempId)
      if (index !== -1) {
        orders.value[index] = response.data
      }
      
      return response.data
    } catch (e: any) {
      // ROLLBACK: Remove the optimistic order
      orders.value = orders.value.filter(o => o.id !== tempId)
      createError.value = e.message || 'Failed to create order'
      throw e
    } finally {
      creating.value = false
    }
  }
  
  /**
   * Fetch unstable route - NO automatic retries
   * 
   * Problems:
   * 1. Fails ~50% of the time
   * 2. User has to manually click "Retry"
   * 3. No automatic retry logic
   */
  async function fetchUnstable() {
    console.log('[Native Store] Fetching unstable route (no auto-retry)')
    
    unstableLoading.value = true
    unstableError.value = null
    unstableAttempts.value++
    
    try {
      const response = await api.get<UnstableResponse>('/orders/unstable')
      unstableData.value = response.data
    } catch (e: any) {
      unstableError.value = e.response?.data?.message || e.message || 'Server error'
      unstableData.value = null
    } finally {
      unstableLoading.value = false
    }
  }
  
  // Reset store
  function reset() {
    orders.value = []
    loading.value = false
    error.value = null
    creating.value = false
    createError.value = null
  }
  
  function resetUnstable() {
    unstableLoading.value = false
    unstableError.value = null
    unstableData.value = null
    unstableAttempts.value = 0
  }
  
  return {
    // State
    orders,
    loading,
    error,
    creating,
    createError,
    unstableLoading,
    unstableError,
    unstableData,
    unstableAttempts,
    
    // Actions
    fetchOrders,
    createOrder,
    createOrderOptimistic,
    fetchUnstable,
    reset,
    resetUnstable,
  }
})
