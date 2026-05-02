import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { computed, type Ref } from 'vue'
import api, { type Product } from '../api'

/**
 * TanStack Query Composables for Products - "The Clean Way"
 * 
 * Notice how simple this is compared to the Pinia store:
 * - No manual loading/error state
 * - Automatic caching
 * - Automatic background refetch
 * - Request deduplication
 */

/**
 * Fetch all products
 * 
 * Benefits:
 * 1. Automatic caching (staleTime: 5000ms from global config)
 * 2. Automatic background refetch on window focus
 * 3. Request deduplication (multiple components can use this)
 * 4. Loading/error states provided automatically
 */
export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      console.log('[Vue Query] Fetching products')
      const response = await api.get<Product[]>('/products')
      return response.data
    },
    staleTime: 5000, // Data is fresh for 5 seconds
  })
}

/**
 * Fetch single product
 * 
 * Benefits:
 * 1. Each product is cached separately by ID
 * 2. If we already fetched this product, it's instant
 * 3. Background refetch keeps it fresh
 */
export function useProduct(id: Ref<number> | number) {
  const productId = computed(() => typeof id === 'number' ? id : id.value)
  
  return useQuery({
    queryKey: ['products', productId],
    queryFn: async () => {
      console.log(`[Vue Query] Fetching product #${productId.value}`)
      const response = await api.get<Product>(`/products/${productId.value}`)
      return response.data
    },
    staleTime: 5000,
    enabled: computed(() => productId.value > 0),
  })
}

/**
 * Create product mutation with optimistic updates
 * 
 * Benefits:
 * 1. Optimistic UI update (instant feedback)
 * 2. Automatic rollback on error
 * 3. Query invalidation on success
 * 4. Much simpler than manual implementation
 */
export function useCreateProduct() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async () => {
      console.log('[Vue Query] Creating product with mutation')
      const response = await api.post<Product>('/products')
      return response.data
    },
    
    // Optimistic update
    onMutate: async () => {
      console.log('[Vue Query] Optimistic update - adding product immediately')
      
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['products'] })
      
      // Snapshot the previous value
      const previousProducts = queryClient.getQueryData<Product[]>(['products'])
      
      // Optimistically update the cache with a temp product
      const optimisticProduct: Product = {
        id: -Date.now(), // Temp ID
        name: 'Loading...', // Will be replaced with real data
        price: 0,
        category: 'Pending',
        image: '⏳',
        stock: 0,
      }
      
      queryClient.setQueryData<Product[]>(['products'], (old) => {
        return old ? [...old, optimisticProduct] : [optimisticProduct]
      })
      
      // Return context with the previous value
      return { previousProducts }
    },
    
    // On error, rollback
    onError: (_err, _variables, context) => {
      console.log('[Vue Query] Error - rolling back optimistic update')
      if (context?.previousProducts) {
        queryClient.setQueryData(['products'], context.previousProducts)
      }
    },
    
    // On success or error, invalidate to refetch
    onSettled: () => {
      console.log('[Vue Query] Invalidating products query')
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

