<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'

const props = defineProps<{
  currentSection: string
}>()

const route = useRoute()

const nativeLinks = [
  { to: '/native/products', label: 'Products', icon: '📦' },
  { to: '/native/orders', label: 'Orders', icon: '📋' },
  { to: '/native/orders/new', label: 'Create Order', icon: '➕' },
  { to: '/native/unstable', label: 'Unstable API', icon: '💥' },
]

const queryLinks = [
  { to: '/query/products', label: 'Products', icon: '📦' },
  { to: '/query/orders', label: 'Orders', icon: '📋' },
  { to: '/query/orders/new', label: 'Create Order', icon: '➕' },
  { to: '/query/unstable', label: 'Unstable API', icon: '💥' },
]

const isActive = (path: string) => route.path === path || route.path.startsWith(path + '/')
</script>

<template>
  <aside class="fixed left-0 top-0 h-screen w-72 bg-slate-800/50 backdrop-blur-xl border-r border-slate-700/50 p-6 overflow-y-auto">
    <!-- Logo -->
    <div class="flex items-center gap-3 mb-8">
      <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-xl">
        🛒
      </div>
      <div>
        <h1 class="text-lg font-bold text-white">Vue Query POC</h1>
        <p class="text-xs text-slate-400">Compare fetching strategies</p>
      </div>
    </div>
    
    <!-- Native Section -->
    <div class="mb-8">
      <div class="flex items-center gap-2 mb-4">
        <div class="w-2 h-2 rounded-full bg-amber-400"></div>
        <h2 class="text-xs font-bold uppercase tracking-wider text-amber-400">
          Native (Pinia)
        </h2>
      </div>
      <nav class="space-y-1">
        <RouterLink
          v-for="link in nativeLinks"
          :key="link.to"
          :to="link.to"
          :class="[
            'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
            isActive(link.to)
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
          ]"
        >
          <span class="text-lg">{{ link.icon }}</span>
          <span class="font-medium">{{ link.label }}</span>
        </RouterLink>
      </nav>
    </div>
    
    <!-- Divider -->
    <div class="border-t border-slate-700 my-6"></div>
    
    <!-- Query Section -->
    <div class="mb-8">
      <div class="flex items-center gap-2 mb-4">
        <div class="w-2 h-2 rounded-full bg-emerald-400"></div>
        <h2 class="text-xs font-bold uppercase tracking-wider text-emerald-400">
          TanStack Query
        </h2>
      </div>
      <nav class="space-y-1">
        <RouterLink
          v-for="link in queryLinks"
          :key="link.to"
          :to="link.to"
          :class="[
            'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
            isActive(link.to)
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
          ]"
        >
          <span class="text-lg">{{ link.icon }}</span>
          <span class="font-medium">{{ link.label }}</span>
        </RouterLink>
      </nav>
    </div>
    
    <!-- Info Box -->
    <div class="card mt-auto">
      <h3 class="font-bold text-white mb-2">💡 Demo Tips</h3>
      <ul class="text-xs text-slate-400 space-y-2">
        <li>• Click a product, go back, click again</li>
        <li>• Create an order in both sections</li>
        <li>• Try the unstable API repeatedly</li>
        <li>• Watch for network activity indicator</li>
      </ul>
    </div>
  </aside>
</template>
