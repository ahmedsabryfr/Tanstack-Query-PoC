import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'
import App from './App.vue'
import router from './router'
import './style.css'

const app = createApp(App)

// Pinia for native state management demo
app.use(createPinia())

// Vue Query for TanStack demo
app.use(VueQueryPlugin, {
  queryClientConfig: {
    defaultOptions: {
      queries: {
        staleTime: 5000, // 5 seconds
        retry: 3,
        refetchOnWindowFocus: true,
      },
    },
  },
})

app.use(router)
app.mount('#app')
