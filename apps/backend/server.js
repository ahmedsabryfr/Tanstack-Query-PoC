import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// ============================================
// DELAY MIDDLEWARE - Simulates slow network
// ============================================
const DELAY_MS = 2000;

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - Adding ${DELAY_MS}ms delay...`);
  setTimeout(next, DELAY_MS);
});

// ============================================
// IN-MEMORY DATA STORE
// ============================================
let products = [
  { id: 1, name: 'Wireless Headphones', price: 199.99, category: 'Electronics', image: '🎧', stock: 50 },
  { id: 2, name: 'Smart Watch', price: 299.99, category: 'Electronics', image: '⌚', stock: 30 },
  { id: 3, name: 'Running Shoes', price: 149.99, category: 'Sports', image: '👟', stock: 100 },
  { id: 4, name: 'Backpack Pro', price: 89.99, category: 'Accessories', image: '🎒', stock: 75 },
  { id: 5, name: 'Coffee Maker', price: 79.99, category: 'Home', image: '☕', stock: 40 },
  { id: 6, name: 'Mechanical Keyboard', price: 159.99, category: 'Electronics', image: '⌨️', stock: 25 },
];

let orders = [
  { id: 1, productId: 1, productName: 'Wireless Headphones', quantity: 2, total: 399.98, status: 'Delivered', createdAt: '2024-01-15' },
  { id: 2, productId: 3, productName: 'Running Shoes', quantity: 1, total: 149.99, status: 'Shipped', createdAt: '2024-01-18' },
  { id: 3, productId: 2, productName: 'Smart Watch', quantity: 1, total: 299.99, status: 'Processing', createdAt: '2024-01-20' },
];

let nextOrderId = 4;
let nextProductId = 7;

// Helper to generate random product data
const productNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
const categories = ['Electronics', 'Sports', 'Home', 'Accessories', 'Fashion', 'Books', 'Toys'];
const emojis = ['📱', '💻', '⚽', '🏀', '🎮', '📚', '🎨', '🎵', '🎬', '✈️', '🚗', '🏠', '👕', '👞', '🎁', '🔧', '🎯', '🎪', '🎭', '🎲'];

function generateRandomProduct() {
  const letter = productNames[(nextProductId - 7) % productNames.length];
  const suffix = Math.floor((nextProductId - 7) / productNames.length);
  const name = `Product ${letter}${suffix > 0 ? suffix : ''}`;
  
  return {
    id: nextProductId++,
    name: name,
    price: parseFloat((Math.random() * 200 + 50).toFixed(2)),
    category: categories[Math.floor(Math.random() * categories.length)],
    image: emojis[Math.floor(Math.random() * emojis.length)],
    stock: Math.floor(Math.random() * 100) + 10,
  };
}

// ============================================
// PRODUCT ENDPOINTS
// ============================================

// GET all products
app.get('/products', (req, res) => {
  console.log(`Returning ${products.length} products`);
  res.json(products);
});

// GET single product
app.get('/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find(p => p.id === id);
  
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  console.log(`Returning product: ${product.name}`);
  res.json(product);
});

// POST create product
app.post('/products', (req, res) => {
  const newProduct = generateRandomProduct();
  products.push(newProduct);
  console.log(`Created product #${newProduct.id}: ${newProduct.name}`);
  res.status(201).json(newProduct);
});

// ============================================
// ORDER ENDPOINTS
// ============================================

// GET all orders
app.get('/orders', (req, res) => {
  console.log(`Returning ${orders.length} orders`);
  res.json(orders);
});

// POST create order
app.post('/orders', (req, res) => {
  const { productId, quantity } = req.body;
  
  const product = products.find(p => p.id === productId);
  if (!product) {
    return res.status(400).json({ error: 'Invalid product ID' });
  }
  
  const newOrder = {
    id: nextOrderId++,
    productId: product.id,
    productName: product.name,
    quantity: quantity || 1,
    total: product.price * (quantity || 1),
    status: 'Processing',
    createdAt: new Date().toISOString().split('T')[0],
  };
  
  orders.unshift(newOrder); // Add to beginning of array
  console.log(`Created order #${newOrder.id} for ${product.name}`);
  res.status(201).json(newOrder);
});

// ============================================
// CHAOS ROUTE - 50% failure rate
// ============================================
app.get('/orders/unstable', (req, res) => {
  const shouldFail = Math.random() < 0.5;
  
  if (shouldFail) {
    console.log('💥 CHAOS: Returning 500 error');
    return res.status(500).json({ 
      error: 'Internal Server Error', 
      message: 'The server decided to fail randomly. This is intentional for demo purposes.' 
    });
  }
  
  console.log('✅ CHAOS: Request succeeded');
  res.json({ 
    success: true, 
    message: 'Lucky! The server responded successfully.',
    orders: orders 
  });
});

// ============================================
// START SERVER
// ============================================
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🚀 Vue Query POC Backend Server                          ║
║                                                            ║
║   Server running at: http://localhost:${PORT}                 ║
║   All requests have a ${DELAY_MS}ms delay                        ║
║                                                            ║
║   Endpoints:                                               ║
║   • GET  /products           - List all products           ║
║   • GET  /products/:id       - Get single product          ║
║   • POST /products           - Create new product          ║
║   • GET  /orders             - List all orders             ║
║   • POST /orders             - Create new order            ║
║   • GET  /orders/unstable    - 50% failure rate (chaos!)   ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
});
