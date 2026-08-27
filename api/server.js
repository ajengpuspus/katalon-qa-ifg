const express = require('express');
const cors = require('cors');
const db = require('./database');
const { KafkaProducer } = require('../kafka/producer');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// ===== REQUEST LOGGING MIDDLEWARE =====
app.use((req, res, next) => {
  console.log('\n========================================');
  console.log(`📥 ${req.method} ${req.url}`);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  console.log('Body:', JSON.stringify(req.body, null, 2));
  console.log('========================================');
  next();
});

// Initialize Kafka Producer
const producer = new KafkaProducer();

// ==================== API ENDPOINTS ====================

// GET - List all products
app.get('/api/products', (req, res) => {
  try {
    const products = db.prepare('SELECT * FROM products').all();
    console.log('📤 Response: 200 - Found', products.length, 'products');
    res.json({
      success: true,
      data: products,
      count: products.length
    });
  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET - Get product by ID
app.get('/api/products/:id', (req, res) => {
  try {
    console.log('🔍 Getting product ID:', req.params.id);
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    
    if (!product) {
      console.log('📤 Response: 404 - Product not found');
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    
    console.log('📤 Response: 200 - Found product:', product.name);
    res.json({ success: true, data: product });
  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST - Create new product (also sends Kafka event)
app.post('/api/products', async (req, res) => {
  try {
    const { name, price, category, stock } = req.body;
    
    console.log('📦 Creating product:', { name, price, category, stock });
    
    if (!name || !price || !category) {
      console.log('📤 Response: 400 - Missing fields');
      return res.status(400).json({ 
        success: false, 
        error: 'Name, price, and category are required' 
      });
    }

    const result = db.prepare(
      'INSERT INTO products (name, price, category, stock) VALUES (?, ?, ?, ?)'
    ).run(name, price, category, stock || 0);

    const newProduct = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);

    // Send Kafka event (non-blocking, don't fail if Kafka is down)
    try {
      await producer.sendMessage('product-events', {
        event: 'PRODUCT_CREATED',
        data: newProduct,
        timestamp: new Date().toISOString()
      });
      console.log('📤 Kafka event sent');
    } catch (kafkaError) {
      console.log('⚠️ Kafka error (non-fatal):', kafkaError.message);
    }

    console.log('📤 Response: 201 - Product created:', newProduct.id);
    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT - Update product
app.put('/api/products/:id', async (req, res) => {
  try {
    const { name, price, category, stock } = req.body;
    const id = req.params.id;

    console.log('📦 Updating product ID:', id);

    const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    if (!existing) {
      console.log('📤 Response: 404 - Product not found');
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    db.prepare(
      'UPDATE products SET name = ?, price = ?, category = ?, stock = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).run(name || existing.name, price || existing.price, category || existing.category, stock ?? existing.stock, id);

    const updated = db.prepare('SELECT * FROM products WHERE id = ?').get(id);

    // Send Kafka event (non-blocking)
    try {
      await producer.sendMessage('product-events', {
        event: 'PRODUCT_UPDATED',
        data: updated,
        timestamp: new Date().toISOString()
      });
    } catch (kafkaError) {
      console.log('⚠️ Kafka error (non-fatal):', kafkaError.message);
    }

    console.log('📤 Response: 200 - Product updated');
    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE - Delete product
app.delete('/api/products/:id', async (req, res) => {
  try {
    const id = req.params.id;
    console.log('🗑️ Deleting product ID:', id);
    
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    
    if (!product) {
      console.log('📤 Response: 404 - Product not found');
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    db.prepare('DELETE FROM products WHERE id = ?').run(id);

    // Send Kafka event (non-blocking)
    try {
      await producer.sendMessage('product-events', {
        event: 'PRODUCT_DELETED',
        data: product,
        timestamp: new Date().toISOString()
      });
    } catch (kafkaError) {
      console.log('⚠️ Kafka error (non-fatal):', kafkaError.message);
    }

    console.log('📤 Response: 200 - Product deleted');
    res.json({ success: true, message: 'Product deleted', data: product });
  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== HEALTH CHECK ====================
app.get('/api/health', (req, res) => {
  console.log('💚 Health check');
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ==================== START SERVER ====================
app.listen(PORT, () => {
  console.log(`🚀 REST API Server running on http://localhost:${PORT}`);
  console.log(`📋 API Endpoints:`);
  console.log(`   GET    http://localhost:${PORT}/api/products`);
  console.log(`   GET    http://localhost:${PORT}/api/products/:id`);
  console.log(`   POST   http://localhost:${PORT}/api/products`);
  console.log(`   PUT    http://localhost:${PORT}/api/products/:id`);
  console.log(`   DELETE http://localhost:${PORT}/api/products/:id`);
  console.log(`   GET    http://localhost:${PORT}/api/health`);
});

module.exports = app;
