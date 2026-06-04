# Telegram Marketplace - Mini App

Платформа для продажи и покупки товаров в стиле Авито, созданная как Telegram Mini App.

## 🚀 Возможности

- **Пользователи**: Профиль с рейтингом, балансом и историей
- **Объявления**: Создание, поиск, категории, избранное
- **Продавцы**: Профили продавцов с рейтингами и отзывами
- **Оплата**: Внутренний баланс с пополнением через Tether (USDT)
- **Telegram интеграция**: Полная поддержка Telegram WebApp SDK
- **Темный дизайн**: Современный UI в темных тонах с фиолетовыми акцентами

## 📋 Требования

- Node.js 16+ 
- PostgreSQL 12+ (на localhost:5000 с паролем 123)
- npm или yarn

## 🛠 Установка и запуск

### 1. Клонирование и установка зависимостей

```bash
cd telegram-marketplace
npm install
```

### 2. Настройка базы данных PostgreSQL

Убедитесь, что PostgreSQL запущен на `localhost:5000` с паролем `123`.

Настройка базы данных:
```bash
cd database
npm install
npm run setup
```

### 3. Настройка переменных окружения

Скопируйте `.env` файл и настройте параметры:
```bash
cp .env.example .env
```

Основные параметры:
- `REACT_APP_API_URL` - URL backend сервера
- `DATABASE_URL` - строка подключения к PostgreSQL
- `JWT_SECRET` - секретный ключ для JWT токенов
- `TETHER_WALLET_ADDRESS` - адрес кошелька для приема USDT

### 4. Запуск Backend сервера

```bash
cd server
npm install
npm run dev
```

Backend будет доступен на `http://localhost:3001`

### 5. Запуск Frontend приложения

В корневой папке проекта:
```bash
npm run dev
```

Frontend будет доступен на `http://localhost:3000`

## 📱 Telegram Mini App настройка

### Создание бота

1. Создайте бота через [@BotFather](https://t.me/botfather)
2. Получите токен бота
3. Настройте WebApp

### Настройка WebApp

1. Задеплойте frontend приложение (Vercel, Netlify, etc.)
2. В BotFather настройте WebApp URL:
   - `/menu` - главное меню
   - Или используйте inline mode

### Локальная разработка

Для локальной разработки используйте Telegram WebApp simulator или тестируйте напрямую в браузере.

## 🗄 Структура базы данных

### Основные таблицы:
- `users` - пользователи
- `categories` - категории и подкатегории  
- `listings` - объявления
- `favorite_listings` - избранные объявления
- `favorite_sellers` - избранные продавцы
- `reviews` - отзывы
- `transactions` - транзакции баланса
- `orders` - заказы
- `chats` - чаты между пользователями
- `messages` - сообщения

## 📁 Структура проекта

```
telegram-marketplace/
├── src/
│   ├── components/       # React компоненты
│   ├── pages/           # Страницы приложения
│   ├── styles/          # CSS стили
│   ├── contexts/        # React Context API
│   ├── hooks/           # Custom hooks
│   └── utils/           # Утилиты и API клиент
├── server/              # Backend API
│   ├── index.js         # Express сервер
│   ├── payment.js       # Tether платежи
│   └── package.json
├── database/            # PostgreSQL настройка
│   ├── schema.sql       # SQL схема
│   ├── setup.js         # Скрипт инициализации
│   └── package.json
├── public/              # Статические файлы
├── index.html           # HTML вход
├── vite.config.js       # Vite конфигурация
└── package.json         # Зависимости
```

## 🎨 Страницы приложения

### Главная (`/`)
- Поиск объявлений
- Категории (7 основных + "Прочее")
- Популярные объявления

### Аккаунт (`/account`)
- Профиль пользователя
- Рейтинг и статистика
- Баланс с пополнением
- Настройки профиля

### Избранное (`/favorites`)
- Избранные объявления
- Избранные продавцы

### Мои объявления (`/my-listings`)
- Активные объявления
- Архивные объявления

### Объявление (`/listing/:id`)
- Фото, описание, цена
- Информация о продавце
- Покупка / Покупка с гарантом

### Профиль продавца (`/seller/:id`)
- Все объявления продавца
- Рейтинг и отзывы
- Контакт

### Категории (`/categories`)
- Все категории с подкатегориями

### Баланс (`/balance`)
- Пополнение через Tether (USDT)
- История транзакций

## 💳 Система оплаты

### Tether (USDT) интеграция

Пополнение баланса через криптовалюту USDT:
- Сеть: TRC20
- Минимум: 100 ₽ (~1.05 USDT)
- Максимум: 100,000 ₽ (~1,050 USDT)
- Комиссия: ~1 USDT
- Время обработки: 5-30 минут

### Процесс пополнения:
1. Пользователь вводит сумму и свой кошелек USDT
2. Система создает платеж и генерирует адрес
3. Пользователь переводит USDT на указанный адрес
4. Система проверяет транзакцию в блокчейне
5. Баланс автоматически пополняется

## 🔒 Безопасность

- JWT токены для авторизации
- Хеширование паролей (bcrypt)
- Валидация данных на сервере
- Защита от SQL инъекций (parameterized queries)

## 🚢 Деплой

### Frontend (Vercel)
```bash
npm run build
# Задеплойте папку dist на Vercel
```

### Backend (Heroku/Render)
```bash
# Настройте переменные окружения
# Задеплойте сервер
```

### Database (Supabase/Neon)
- Используйте облачный PostgreSQL
- Обновите DATABASE_URL

## 📝 API Документация

### Авторизация
- `POST /auth/telegram` - Авторизация через Telegram

### Пользователи
- `GET /user/me` - Текущий пользователь
- `GET /user/:id` - Данные пользователя по ID

### Объявления
- `GET /listings` - Список объявлений
- `GET /listings/:id` - Детали объявления
- `POST /listings` - Создание объявления

### Избранное
- `GET /favorites/listings` - Избранные объявления
- `GET /favorites/sellers` - Избранные продавцы
- `POST /favorites/listings/:id` - Добавить в избранное
- `DELETE /favorites/listings/:id` - Удалить из избранного

### Платежи
- `POST /payment/create` - Создать платеж
- `POST /payment/check/:id` - Проверить статус

## 🐛 Troubleshooting

### PostgreSQL connection error
- Убедитесь, что PostgreSQL запущен на localhost:5000
- Проверьте пароль (123)

### CORS errors
- Проверьте настройки CORS в server/index.js
- Убедитесь, что фронтенд и backend на одном домене в продакшене

### Telegram WebApp not working
- Убедитесь, что используете HTTPS в продакшене
- Проверьте правильность URL в BotFather

## 📄 Лицензия

MIT License

## 👥 Поддержка

Для вопросов и поддержки создайте issue в репозитории.
