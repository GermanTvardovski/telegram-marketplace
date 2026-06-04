const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const TetherPayment = require('./payment');

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Tether payment
const tetherPayment = new TetherPayment();

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  host: 'localhost',
  port: 5000,
  user: 'postgres',
  password: '123',
  database: 'telegram_marketplace',
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connected successfully at:', res.rows[0].now);
  }
});

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Auth routes
app.post('/auth/telegram', async (req, res) => {
  try {
    const { telegram_id, username, full_name, photo_url } = req.body;

    // Check if user exists
    const userResult = await pool.query(
      'SELECT * FROM users WHERE telegram_id = $1',
      [telegram_id]
    );

    let user;

    if (userResult.rows.length === 0) {
      // Create new user
      const insertResult = await pool.query(
        `INSERT INTO users (telegram_id, username, full_name, photo_url) 
         VALUES ($1, $2, $3, $4) 
         RETURNING *`,
        [telegram_id, username, full_name, photo_url]
      );
      user = insertResult.rows[0];
    } else {
      user = userResult.rows[0];
      
      // Update user info if changed
      await pool.query(
        `UPDATE users 
         SET username = $1, full_name = $2, photo_url = $3, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $4`,
        [username, full_name, photo_url, user.id]
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, telegramId: user.telegram_id },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        telegram_id: user.telegram_id,
        username: user.username,
        full_name: user.full_name,
        photo_url: user.photo_url,
        rating: user.rating,
        balance: user.balance,
      }
    });
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// Get current user
app.get('/user/me', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];
    res.json({
      id: user.id,
      telegram_id: user.telegram_id,
      username: user.username,
      full_name: user.full_name,
      photo_url: user.photo_url,
      rating: user.rating,
      reviews_count: user.reviews_count,
      active_listings: user.active_listings,
      sold_items: user.sold_items,
      balance: user.balance,
      location: user.location,
      bio: user.bio,
      member_since: user.member_since,
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user data' });
  }
});

// Get user by ID
app.get('/user/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];
    res.json({
      id: user.id,
      username: user.username,
      full_name: user.full_name,
      photo_url: user.photo_url,
      rating: user.rating,
      reviews_count: user.reviews_count,
      active_listings: user.active_listings,
      sold_items: user.sold_items,
      location: user.location,
      bio: user.bio,
      member_since: user.member_since,
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user data' });
  }
});

// Categories routes
app.get('/categories', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM categories WHERE parent_id IS NULL ORDER BY id'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to get categories' });
  }
});

app.get('/categories/:id/subcategories', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM categories WHERE parent_id = $1 ORDER BY id',
      [req.params.id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get subcategories error:', error);
    res.status(500).json({ error: 'Failed to get subcategories' });
  }
});

// Listings routes
app.get('/listings', async (req, res) => {
  try {
    const { category_id, search, limit = 20, offset = 0 } = req.query;
    
    let query = `
      SELECT l.*, u.username, u.full_name, u.rating as seller_rating, u.photo_url as seller_photo
      FROM listings l
      JOIN users u ON l.user_id = u.id
      WHERE l.status = 'active'
    `;
    const params = [];
    let paramCount = 0;

    if (category_id) {
      paramCount++;
      query += ` AND l.category_id = $${paramCount}`;
      params.push(category_id);
    }

    if (search) {
      paramCount++;
      query += ` AND (l.title ILIKE $${paramCount} OR l.description ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    query += ` ORDER BY l.created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get listings error:', error);
    res.status(500).json({ error: 'Failed to get listings' });
  }
});

app.get('/listings/:id', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT l.*, u.username, u.full_name, u.rating as seller_rating, u.photo_url as seller_photo, 
              u.active_listings as seller_active_listings, u.sold_items as seller_sold_items
       FROM listings l
       JOIN users u ON l.user_id = u.id
       WHERE l.id = $1`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    // Increment view count
    await pool.query(
      'UPDATE listings SET views = views + 1 WHERE id = $1',
      [req.params.id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get listing error:', error);
    res.status(500).json({ error: 'Failed to get listing' });
  }
});

app.post('/listings', authenticateToken, async (req, res) => {
  try {
    const { title, description, price, category_id, articul, images, location } = req.body;

    const result = await pool.query(
      `INSERT INTO listings (user_id, title, description, price, category_id, articul, images, location)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [req.user.userId, title, description, price, category_id, articul, images, location]
    );

    // Update user's active listings count
    await pool.query(
      'UPDATE users SET active_listings = active_listings + 1 WHERE id = $1',
      [req.user.userId]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create listing error:', error);
    res.status(500).json({ error: 'Failed to create listing' });
  }
});

app.get('/user/:userId/listings', async (req, res) => {
  try {
    const { status } = req.query;
    let query = 'SELECT * FROM listings WHERE user_id = $1';
    const params = [req.params.userId];

    if (status) {
      query += ' AND status = $2';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get user listings error:', error);
    res.status(500).json({ error: 'Failed to get user listings' });
  }
});

// Favorites routes
app.get('/favorites/listings', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT l.*, u.username, u.full_name, u.rating as seller_rating
       FROM favorite_listings fl
       JOIN listings l ON fl.listing_id = l.id
       JOIN users u ON l.user_id = u.id
       WHERE fl.user_id = $1
       ORDER BY fl.created_at DESC`,
      [req.user.userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get favorite listings error:', error);
    res.status(500).json({ error: 'Failed to get favorite listings' });
  }
});

app.post('/favorites/listings/:listingId', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `INSERT INTO favorite_listings (user_id, listing_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, listing_id) DO NOTHING
       RETURNING *`,
      [req.user.userId, req.params.listingId]
    );
    res.status(201).json(result.rows[0] || { message: 'Already in favorites' });
  } catch (error) {
    console.error('Add favorite listing error:', error);
    res.status(500).json({ error: 'Failed to add favorite listing' });
  }
});

app.delete('/favorites/listings/:listingId', authenticateToken, async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM favorite_listings WHERE user_id = $1 AND listing_id = $2',
      [req.user.userId, req.params.listingId]
    );
    res.json({ message: 'Removed from favorites' });
  } catch (error) {
    console.error('Remove favorite listing error:', error);
    res.status(500).json({ error: 'Failed to remove favorite listing' });
  }
});

app.get('/favorites/sellers', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.*, COUNT(DISTINCT l.id) as listing_count
       FROM favorite_sellers fs
       JOIN users u ON fs.seller_id = u.id
       LEFT JOIN listings l ON u.id = l.user_id AND l.status = 'active'
       WHERE fs.user_id = $1
       GROUP BY u.id
       ORDER BY fs.created_at DESC`,
      [req.user.userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get favorite sellers error:', error);
    res.status(500).json({ error: 'Failed to get favorite sellers' });
  }
});

app.post('/favorites/sellers/:sellerId', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `INSERT INTO favorite_sellers (user_id, seller_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, seller_id) DO NOTHING
       RETURNING *`,
      [req.user.userId, req.params.sellerId]
    );
    res.status(201).json(result.rows[0] || { message: 'Already in favorites' });
  } catch (error) {
    console.error('Add favorite seller error:', error);
    res.status(500).json({ error: 'Failed to add favorite seller' });
  }
});

app.delete('/favorites/sellers/:sellerId', authenticateToken, async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM favorite_sellers WHERE user_id = $1 AND seller_id = $2',
      [req.user.userId, req.params.sellerId]
    );
    res.json({ message: 'Removed from favorites' });
  } catch (error) {
    console.error('Remove favorite seller error:', error);
    res.status(500).json({ error: 'Failed to remove favorite seller' });
  }
});

// Balance and transactions routes
app.get('/balance', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT balance FROM users WHERE id = $1',
      [req.user.userId]
    );
    res.json({ balance: result.rows[0].balance });
  } catch (error) {
    console.error('Get balance error:', error);
    res.status(500).json({ error: 'Failed to get balance' });
  }
});

app.post('/balance/deposit', authenticateToken, async (req, res) => {
  try {
    const { amount, tether_wallet } = req.body;

    // Create transaction record
    const transactionResult = await pool.query(
      `INSERT INTO transactions (user_id, type, amount, status, description, tether_wallet)
       VALUES ($1, 'deposit', $2, 'pending', 'Deposit via Tether', $3)
       RETURNING *`,
      [req.user.userId, amount, tether_wallet]
    );

    res.status(201).json(transactionResult.rows[0]);
  } catch (error) {
    console.error('Deposit error:', error);
    res.status(500).json({ error: 'Failed to create deposit transaction' });
  }
});

app.get('/transactions', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM transactions WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: 'Failed to get transactions' });
  }
});

// Payment routes
app.post('/payment/create', authenticateToken, async (req, res) => {
  try {
    const { amount } = req.body;
    
    // Конвертируем рубли в USDT
    const amountInUSDT = tetherPayment.convertRubToUSD(amount);
    
    // Создаем платеж
    const payment = await tetherPayment.createPayment(req.user.userId, amountInUSDT, 'Deposit to marketplace balance');
    
    if (!payment.success) {
      return res.status(500).json({ error: 'Failed to create payment' });
    }
    
    // Сохраняем транзакцию в базе данных
    const transactionResult = await pool.query(
      `INSERT INTO transactions (user_id, type, amount, status, description, tether_wallet)
       VALUES ($1, 'deposit', $2, 'pending', 'Deposit via Tether', $3)
       RETURNING *`,
      [req.user.userId, amount, payment.payment_address]
    );
    
    res.json({
      ...payment,
      transaction_id: transactionResult.rows[0].id,
      amount_rub: amount,
      amount_usdt: amountInUSDT,
    });
  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({ error: 'Failed to create payment' });
  }
});

app.post('/payment/check/:transactionId', authenticateToken, async (req, res) => {
  try {
    // Получаем транзакцию из базы
    const transactionResult = await pool.query(
      'SELECT * FROM transactions WHERE id = $1 AND user_id = $2',
      [req.params.transactionId, req.user.userId]
    );
    
    if (transactionResult.rows.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    const transaction = transactionResult.rows[0];
    
    // Если транзакция уже завершена, возвращаем статус
    if (transaction.status === 'completed') {
      return res.json({
        status: 'completed',
        amount: transaction.amount,
      });
    }
    
    // Проверяем статус платежа (в реальном проекте здесь будет проверка через blockchain API)
    const paymentStatus = await tetherPayment.checkPaymentStatus(transaction.tether_wallet);
    
    if (paymentStatus.status === 'completed') {
      // Обновляем баланс пользователя
      await pool.query(
        'UPDATE users SET balance = balance + $1 WHERE id = $2',
        [transaction.amount, req.user.userId]
      );
      
      // Обновляем статус транзакции
      await pool.query(
        'UPDATE transactions SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        ['completed', transaction.id]
      );
      
      res.json({
        status: 'completed',
        amount: transaction.amount,
      });
    } else {
      res.json({
        status: 'pending',
      });
    }
  } catch (error) {
    console.error('Check payment error:', error);
    res.status(500).json({ error: 'Failed to check payment status' });
  }
});

app.post('/payment/callback', async (req, res) => {
  try {
    const callbackData = req.body;
    
    // Обрабатываем callback от платежной системы
    const result = await tetherPayment.handlePaymentCallback(callbackData);
    
    if (result.success) {
      // Находим транзакцию по payment_id (в реальном проекте нужно хранить payment_id)
      // Здесь упрощенная логика
      
      res.json({ success: true });
    } else {
      res.json({ success: false, status: result.status });
    }
  } catch (error) {
    console.error('Payment callback error:', error);
    res.status(500).json({ error: 'Failed to process callback' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
