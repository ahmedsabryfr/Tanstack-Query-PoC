import axios from 'axios'

const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const api = axios.create({
  baseURL: apiBaseUrl,
  timeout: 30000,
})

// Request interceptor for logging
api.interceptors.request.use((config) => {
  console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`)
  return config
})

// Response interceptor for logging
api.interceptors.response.use(
  (response) => {
    console.log(`[API] Response: ${response.status}`)
    return response
  },
  (error) => {
    console.error(`[API] Error: ${error.response?.status || error.message}`)
    return Promise.reject(error)
  }
)

export default api

// Types
export interface Product {
  id: number
  name: string
  price: number
  category: string
  image: string
  stock: number
}

export interface Order {
  id: number
  productId: number
  productName: string
  quantity: number
  total: number
  status: string
  createdAt: string
}

export interface UnstableResponse {
  success: boolean
  message: string
  orders?: Order[]
  error?: string
}
