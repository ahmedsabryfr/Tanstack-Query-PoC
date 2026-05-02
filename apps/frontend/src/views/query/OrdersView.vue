<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useOrders } from '../../composables/useOrders'

const { data: orders, isLoading, error, isFetching, refetch } = useOrders()

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'Delivered': return 'badge-success'
    case 'Shipped': return 'badge-info'
    case 'Processing': return 'badge-warning'
    default: return 'badge-info'
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
          <h3 class="font-bold text-emerald-400 mb-1">Optimistic Updates + Auto Sync</h3>
          <p class="text-sm text-slate-400">
            Create a new order and watch it appear <strong class="text-emerald-400">instantly</strong> in this list,
            even before the server responds! Compare with Native version which waits 2+ seconds.
          </p>
          <span v-if="isFetching && !isLoading" class="text-xs text-emerald-400">
            ↻ Syncing with server...
          </span>
        </div>
      </div>
    </div>
    
    <!-- Controls -->
    <div class="flex items-center justify-between mb-6">
      <RouterLink to="/query/orders/new" class="btn btn-primary flex items-center gap-2">
        <span>➕</span>
        <span>Create Order</span>
      </RouterLink>
      <button @click="refetch()" class="btn btn-secondary flex items-center gap-2">
        <span :class="{ 'animate-spin': isFetching }">🔄</span>
        <span>Refresh</span>
      </button>
    </div>
    
    <!-- Loading State -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
      <div class="spinner-lg mb-4"></div>
      <p class="text-slate-400">Loading orders...</p>
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="card border-red-500/30 bg-red-500/5">
      <div class="flex items-center gap-4">
        <div class="text-3xl">❌</div>
        <div>
          <h3 class="font-bold text-red-400">Error Loading Orders</h3>
          <p class="text-sm text-slate-400">{{ (error as Error).message }}</p>
        </div>
      </div>
    </div>
    
    <!-- Orders List -->
    <div v-else class="space-y-4">
      <div v-if="!orders?.length" class="card text-center py-12">
        <p class="text-slate-400">No orders yet. Create your first order!</p>
      </div>
      
      <TransitionGroup name="list">
        <div
          v-for="order in orders"
          :key="order.id"
          :class="[
            'card flex items-center justify-between transition-all duration-300',
            order.id < 0 ? 'border-emerald-500/30 bg-emerald-500/5' : ''
          ]"
        >
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-slate-700/50 flex items-center justify-center text-2xl">
              📦
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="font-bold text-white">{{ order.productName }}</h3>
                <span v-if="order.id < 0" class="badge badge-success text-xs animate-pulse">
                  ⚡ Optimistic
                </span>
              </div>
              <p class="text-sm text-slate-400">
                Order #{{ order.id < 0 ? 'SYNCING...' : order.id }} • {{ order.createdAt }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-6">
            <div class="text-right">
              <p class="text-lg font-bold text-primary-400">${{ order.total.toFixed(2) }}</p>
              <p class="text-xs text-slate-500">Qty: {{ order.quantity }}</p>
            </div>
            <div :class="getStatusBadgeClass(order.status)">
              {{ order.status }}
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
