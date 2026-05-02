<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useOrderStore } from '../../stores/orderStore'

const orderStore = useOrderStore()

onMounted(() => {
  orderStore.fetchOrders()
})

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
    <div class="card mb-6 border-amber-500/30 bg-amber-500/5">
      <div class="flex items-start gap-4">
        <div class="text-3xl">📋</div>
        <div>
          <h3 class="font-bold text-amber-400 mb-1">Orders List (Native)</h3>
          <p class="text-sm text-slate-400">
            When you create a new order, you'll wait for the server to confirm before seeing it here.
            Compare this with the TanStack version which updates <strong class="text-amber-400">instantly</strong>.
          </p>
        </div>
      </div>
    </div>
    
    <!-- Controls -->
    <div class="flex items-center justify-between mb-6">
      <RouterLink to="/native/orders/new" class="btn btn-primary flex items-center gap-2">
        <span>➕</span>
        <span>Create Order</span>
      </RouterLink>
      <button @click="orderStore.fetchOrders" class="btn btn-secondary flex items-center gap-2">
        <span>🔄</span>
        <span>Refresh</span>
      </button>
    </div>
    
    <!-- Loading State -->
    <div v-if="orderStore.loading" class="flex flex-col items-center justify-center py-20">
      <div class="spinner-lg mb-4"></div>
      <p class="text-slate-400">Loading orders...</p>
    </div>
    
    <!-- Error State -->
    <div v-else-if="orderStore.error" class="card border-red-500/30 bg-red-500/5">
      <div class="flex items-center gap-4">
        <div class="text-3xl">❌</div>
        <div>
          <h3 class="font-bold text-red-400">Error Loading Orders</h3>
          <p class="text-sm text-slate-400">{{ orderStore.error }}</p>
        </div>
      </div>
    </div>
    
    <!-- Orders List -->
    <div v-else class="space-y-4">
      <div v-if="orderStore.orders.length === 0" class="card text-center py-12">
        <p class="text-slate-400">No orders yet. Create your first order!</p>
      </div>
      
      <div
        v-for="order in orderStore.orders"
        :key="order.id"
        :class="[
          'card flex items-center justify-between',
          order.id < 0 ? 'border-amber-500/30 animate-pulse' : ''
        ]"
      >
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-slate-700/50 flex items-center justify-center text-2xl">
            📦
          </div>
          <div>
            <h3 class="font-bold text-white">{{ order.productName }}</h3>
            <p class="text-sm text-slate-400">
              Order #{{ order.id < 0 ? 'PENDING' : order.id }} • {{ order.createdAt }}
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
    </div>
  </div>
</template>
