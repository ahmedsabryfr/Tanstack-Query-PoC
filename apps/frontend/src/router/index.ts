import { createRouter, createWebHistory } from 'vue-router'

// Native (Pinia) Views
import NativeProductsView from '../views/native/ProductsView.vue'
import NativeProductDetailView from '../views/native/ProductDetailView.vue'
import NativeOrdersView from '../views/native/OrdersView.vue'
import NativeCreateOrderView from '../views/native/CreateOrderView.vue'
import NativeUnstableView from '../views/native/UnstableView.vue'

// Query (TanStack) Views
import QueryProductsView from '../views/query/ProductsView.vue'
import QueryProductDetailView from '../views/query/ProductDetailView.vue'
import QueryOrdersView from '../views/query/OrdersView.vue'
import QueryCreateOrderView from '../views/query/CreateOrderView.vue'
import QueryUnstableView from '../views/query/UnstableView.vue'

const routes = [
  // Redirect root to native products
  { path: '/', redirect: '/native/products' },
  
  // Native (Pinia) Routes
  { 
    path: '/native/products', 
    name: 'native-products',
    component: NativeProductsView,
    meta: { section: 'native', title: 'Products' }
  },
  { 
    path: '/native/products/:id', 
    name: 'native-product-detail',
    component: NativeProductDetailView,
    meta: { section: 'native', title: 'Product Detail' }
  },
  { 
    path: '/native/orders', 
    name: 'native-orders',
    component: NativeOrdersView,
    meta: { section: 'native', title: 'Orders' }
  },
  { 
    path: '/native/orders/new', 
    name: 'native-create-order',
    component: NativeCreateOrderView,
    meta: { section: 'native', title: 'Create Order' }
  },
  { 
    path: '/native/unstable', 
    name: 'native-unstable',
    component: NativeUnstableView,
    meta: { section: 'native', title: 'Unstable API' }
  },
  
  // Query (TanStack) Routes
  { 
    path: '/query/products', 
    name: 'query-products',
    component: QueryProductsView,
    meta: { section: 'query', title: 'Products' }
  },
  { 
    path: '/query/products/:id', 
    name: 'query-product-detail',
    component: QueryProductDetailView,
    meta: { section: 'query', title: 'Product Detail' }
  },
  { 
    path: '/query/orders', 
    name: 'query-orders',
    component: QueryOrdersView,
    meta: { section: 'query', title: 'Orders' }
  },
  { 
    path: '/query/orders/new', 
    name: 'query-create-order',
    component: QueryCreateOrderView,
    meta: { section: 'query', title: 'Create Order' }
  },
  { 
    path: '/query/unstable', 
    name: 'query-unstable',
    component: QueryUnstableView,
    meta: { section: 'query', title: 'Unstable API' }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
