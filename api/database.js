const Database = require('better-sqlite3');
const path = require('path');

// Create SQLite database
const db = new Database(path.join(__dirname, 'products.db'));

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

// Create products table
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    category TEXT NOT NULL,
    stock INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Insert sample data if table is empty
const count = db.prepare('SELECT COUNT(*) as count FROM products').get();
if (count.count === 0) {
  const insert = db.prepare('INSERT INTO products (name, price, category, stock) VALUES (?, ?, ?, ?)');
  
  const sampleProducts = [
    ['Laptop ASUS', 12500000, 'Electronics', 10],
    ['iPhone 15', 18000000, 'Electronics', 5],
    ['Nike Air Max', 1500000, 'Fashion', 20],
    ['Java Programming Book', 150000, 'Books', 50],
    ['Samsung TV 55"', 8500000, 'Electronics', 8]
  ];

  const insertMany = db.transaction((products) => {
    for (const product of products) {
      insert.run(...product);
    }
  });

  insertMany(sampleProducts);
  console.log('✅ Sample data inserted');
}

module.exports = db;
