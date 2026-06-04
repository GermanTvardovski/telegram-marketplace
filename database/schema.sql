-- Telegram Marketplace Database Schema

-- Создание базы данных
CREATE DATABASE IF NOT EXISTS telegram_marketplace;
\c telegram_marketplace;

-- Таблица пользователей
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    telegram_id BIGINT UNIQUE NOT NULL,
    username VARCHAR(255),
    full_name VARCHAR(255),
    photo_url TEXT,
    rating DECIMAL(3, 2) DEFAULT 0.00,
    reviews_count INTEGER DEFAULT 0,
    active_listings INTEGER DEFAULT 0,
    sold_items INTEGER DEFAULT 0,
    balance DECIMAL(10, 2) DEFAULT 0.00,
    location VARCHAR(255),
    bio TEXT,
    member_since TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица категорий
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    icon VARCHAR(50),
    parent_id INTEGER REFERENCES categories(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица объявлений
CREATE TABLE IF NOT EXISTS listings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(id),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    articul VARCHAR(100) UNIQUE,
    images JSONB,
    location VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active', -- active, archived, sold
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица избранных объявлений
CREATE TABLE IF NOT EXISTS favorite_listings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    listing_id INTEGER REFERENCES listings(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, listing_id)
);

-- Таблица избранных продавцов
CREATE TABLE IF NOT EXISTS favorite_sellers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    seller_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, seller_id)
);

-- Таблица отзывов
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    seller_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    listing_id INTEGER REFERENCES listings(id) ON DELETE SET NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, listing_id)
);

-- Таблица транзакций
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- deposit, withdrawal, purchase, refund
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- pending, completed, failed
    description TEXT,
    tether_wallet VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица заказов
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    listing_id INTEGER REFERENCES listings(id) ON DELETE CASCADE,
    buyer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    seller_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- pending, paid, shipped, delivered, cancelled
    with_guarantee BOOLEAN DEFAULT FALSE,
    guarantee_fee DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица чатов
CREATE TABLE IF NOT EXISTS chats (
    id SERIAL PRIMARY KEY,
    listing_id INTEGER REFERENCES listings(id) ON DELETE CASCADE,
    buyer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    seller_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(buyer_id, seller_id, listing_id)
);

-- Таблица сообщений
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    chat_id INTEGER REFERENCES chats(id) ON DELETE CASCADE,
    sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для улучшения производительности
CREATE INDEX IF NOT EXISTS idx_listings_user_id ON listings(user_id);
CREATE INDEX IF NOT EXISTS idx_listings_category_id ON listings(category_id);
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_created_at ON listings(created_at);
CREATE INDEX IF NOT EXISTS idx_favorite_listings_user_id ON favorite_listings(user_id);
CREATE INDEX IF NOT EXISTS idx_favorite_sellers_user_id ON favorite_sellers(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_seller_id ON reviews(seller_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_buyer_id ON orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_seller_id ON orders(seller_id);
CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON messages(chat_id);

-- Вставка начальных категорий
INSERT INTO categories (name, icon, parent_id) VALUES
('Электроника', '📱', NULL),
('Авто', '🚗', NULL),
('Недвижимость', '🏠', NULL),
('Одежда', '👕', NULL),
('Услуги', '🔧', NULL),
('Хобби', '🎮', NULL),
('Работа', '💼', NULL),
('Животные', '🐕', NULL),
('Детские товары', '🧸', NULL),
('Спорт и отдых', '⚽', NULL)
ON CONFLICT DO NOTHING;

-- Вставка подкатегорий для электроники
INSERT INTO categories (name, parent_id) VALUES
('Смартфоны', 1),
('Ноутбуки', 1),
('Планшеты', 1),
('Аксессуары', 1),
('Игровые консоли', 1)
ON CONFLICT DO NOTHING;

-- Вставка подкатегорий для авто
INSERT INTO categories (name, parent_id) VALUES
('Легковые авто', 2),
('Мотоциклы', 2),
('Запчасти', 2),
('Шины и диски', 2),
('Автозвук', 2)
ON CONFLICT DO NOTHING;

-- Вставка подкатегорий для недвижимости
INSERT INTO categories (name, parent_id) VALUES
('Квартиры', 3),
('Дома', 3),
('Дачи', 3),
('Коммерческая', 3),
('Земельные участки', 3)
ON CONFLICT DO NOTHING;

-- Вставка подкатегорий для одежды
INSERT INTO categories (name, parent_id) VALUES
('Женская одежда', 4),
('Мужская одежда', 4),
('Детская одежда', 4),
('Обувь', 4),
('Аксессуары', 4)
ON CONFLICT DO NOTHING;
