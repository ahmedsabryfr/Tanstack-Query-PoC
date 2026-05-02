<script setup lang="ts">
import { computed } from "vue";
import { useRoute, RouterView } from "vue-router";
import { useIsFetching, useIsMutating } from "@tanstack/vue-query";
import Sidebar from "./components/Sidebar.vue";
import { VueQueryDevtools } from "@tanstack/vue-query-devtools";

import NetworkIndicator from "./components/NetworkIndicator.vue";

const route = useRoute();

// TanStack Query activity indicators
const isFetching = useIsFetching();
const isMutating = useIsMutating();

const isQueryActive = computed(
  () => isFetching.value > 0 || isMutating.value > 0,
);

const currentSection = computed(
  () => (route.meta?.section as string) || "native",
);
const pageTitle = computed(() => (route.meta?.title as string) || "Dashboard");
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
  >
    <!-- Network Activity Indicator -->
    <NetworkIndicator :active="isQueryActive" />

    <div class="flex">
      <!-- Sidebar -->
      <Sidebar :current-section="currentSection" />

      <!-- Main Content -->
      <main class="flex-1 ml-72 p-8">
        <!-- Header -->
        <header class="mb-8">
          <div class="flex items-center gap-4 mb-2">
            <div
              :class="[
                'px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider',
                currentSection === 'native'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
              ]"
            >
              {{
                currentSection === "native"
                  ? "📦 Pinia (Native)"
                  : "⚡ TanStack Query"
              }}
            </div>
          </div>
          <h1 class="text-3xl font-bold text-white">{{ pageTitle }}</h1>
          <p class="text-slate-400 mt-1">
            {{
              currentSection === "native"
                ? "Manual state management with loading, error, and caching handling"
                : "Declarative data fetching with automatic caching and sync"
            }}
          </p>
        </header>

        <!-- Page Content -->
        <RouterView />
      </main>
    </div>
    <VueQueryDevtools />
  </div>
</template>
