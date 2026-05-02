<script setup lang="ts">
defineProps<{
  active: boolean
}>()
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-300"
    enter-from-class="opacity-0 -translate-y-full"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition-all duration-300"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 -translate-y-full"
  >
    <div 
      v-if="active"
      class="fixed top-0 left-0 right-0 z-50 h-1 bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500 animate-pulse"
    >
      <!-- Animated shimmer effect -->
      <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
    </div>
  </Transition>
  
  <!-- Corner indicator -->
  <Transition
    enter-active-class="transition-all duration-300"
    enter-from-class="opacity-0 scale-75"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transition-all duration-300"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-75"
  >
    <div 
      v-if="active"
      class="fixed top-4 right-4 z-50 flex items-center gap-2 px-3 py-2 bg-slate-800/90 backdrop-blur-sm rounded-full border border-slate-600"
    >
      <div class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
      <span class="text-xs font-medium text-slate-300">Fetching...</span>
    </div>
  </Transition>
</template>

<style scoped>
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 1.5s infinite;
}
</style>
