import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import api, { type Order, type UnstableResponse } from '../api'

/**
 * TanStack Query Composables for Orders - "The Clean Way"
 * 
 * Demonstrates:
 * - Declarative data fetching
 * - Optimistic updates with automatic rollback
 * - Query invalidation
 * - Automatic retries on failure
 */

/**
 * Fetch all orders
 */
export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      console.log('[Vue Query] Fetching orders')
      const response = await api.get<Order[]>('/orders')
      return response.data
    },
    staleTime: 5000,
  })
}

/**
 * Create order mutation with optimistic updates
 * 
 * Benefits demonstrated:
 * 1. Optimistic UI update (instant feedback)
 * 2. Automatic rollback on error
 * 3. Query invalidation on success
 * 4. Much simpler than manual implementation
 */
export function useCreateOrder() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (variables: { productId: number; productName: string; price: number; quantity: number }) => {
      console.log('[Vue Query] Creating order with mutation')
      const response = await api.post<Order>('/orders', {
        productId: variables.productId,
        quantity: variables.quantity,
      })
      return response.data
    },
    
    // Optimistic update
    onMutate: async (variables) => {
      console.log('[Vue Query] Optimistic update - adding order immediately')
      
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['orders'] })
      
      // Snapshot the previous value
      const previousOrders = queryClient.getQueryData<Order[]>(['orders'])
      
      // Optimistically update the cache
      const optimisticOrder: Order = {
        id: -Date.now(), // Temp ID
        productId: variables.productId,
        productName: variables.productName,
        quantity: variables.quantity,
        total: variables.price * variables.quantity,
        status: 'Processing',
        createdAt: new Date().toISOString().slice(0, 10),
      }
      
      queryClient.setQueryData<Order[]>(['orders'], (old) => {
        return old ? [optimisticOrder, ...old] : [optimisticOrder]
      })
      
      // Return context with the previous value
      return { previousOrders }
    },
    
    // On error, rollback
    onError: (_err, _variables, context) => {
      console.log('[Vue Query] Error - rolling back optimistic update')
      if (context?.previousOrders) {
        queryClient.setQueryData(['orders'], context.previousOrders)
      }
    },
    
    // On success or error, invalidate to refetch
    onSettled: () => {
      console.log('[Vue Query] Invalidating orders query')
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}

/**
 * Fetch unstable route WITH automatic retries
 * 
 * Benefits:
 * 1. Automatic retries (3 by default)
 * 2. Shows loading state during retries
 * 3. Only shows error if ALL retries fail
 */
export function useUnstableOrders() {
  return useQuery({
    queryKey: ['orders', 'unstable'],
    queryFn: async () => {
      console.log('[Vue Query] Fetching unstable route (will auto-retry on failure)')
      const response = await api.get<UnstableResponse>('/orders/unstable')
      return response.data
    },
    retry: 3, // Number of retries
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // Exponential backoff
    staleTime: 0, // Always refetch for demo purposes
    enabled: false, // Don't auto-fetch, we'll trigger manually
  })
}
