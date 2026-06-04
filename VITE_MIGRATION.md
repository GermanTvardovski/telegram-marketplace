# Обновление переменных окружения для Vite

## Проблема

Vite использует другой формат переменных окружения по сравнению с Create React App:
- **Create React App:** `REACT_APP_*`
- **Vite:** `VITE_*`

## Быстрое исправление

### Вариант 1: Обновить существующий .env файл

Откройте файл `.env` в корне проекта и замените переменные окружения:

**Было (Create React App формат):**
```env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_TELEGRAM_BOT_USERNAME=your_bot_username
REACT_APP_MODE=browser
```

**Стало (Vite формат):**
```env
VITE_API_URL=http://localhost:3001
VITE_TELEGRAM_BOT_USERNAME=your_bot_username
VITE_APP_MODE=browser
```

### Вариант 2: Использовать .env.local

Создайте файл `.env.local` в корне проекта с содержимым:
```env
VITE_API_URL=http://localhost:3001
VITE_TELEGRAM_BOT_USERNAME=your_bot_username
VITE_APP_MODE=browser
```

Этот файл имеет приоритет над .env и не попадает в git (рекомендуется для локальной разработки).

## Что было исправлено в коде

### 1. src/utils/api.js
```javascript
// Было
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// Стало  
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
```

### 2. src/contexts/UserContext.jsx
```javascript
// Было
const appMode = process.env.REACT_APP_MODE || 'browser';

// Стало
const appMode = import.meta.env.VITE_APP_MODE || 'browser';
```

## Полный пример .env файла

```env
# Frontend (Vite format)
VITE_API_URL=http://localhost:3001
VITE_TELEGRAM_BOT_USERNAME=your_bot_username

# App Mode: 'browser' or 'telegram'
VITE_APP_MODE=browser

# Backend (остается без изменений)
PORT=3001
JWT_SECRET=your-secret-key-change-in-production
DATABASE_URL=postgresql://postgres:123@localhost:5000/telegram_marketplace

# Payment (остается без изменений)
TETHER_API_ENDPOINT=https://api.example.com
TETHER_API_KEY=your-api-key
TETHER_WALLET_ADDRESS=your-wallet-address
CALLBACK_URL=http://localhost:3001/payment/callback
FRONTEND_URL=http://localhost:3000

# Node Environment (остается без изменений)
NODE_ENV=development
```

## Проверка работы

После обновления переменных окружения:

1. **Перезапустите dev сервер:**
   ```bash
   # Ctrl+C для остановки
   npm run dev
   ```

2. **Откройте браузер:**
   `http://localhost:3000`

3. **Проверьте консоль браузера:**
   - Нет ошибок `process is not defined`
   - Приложение загружается корректно
   - Отображается домашняя страница с категориями

## Troubleshooting

### Все еще ошибка "process is not defined"
- Убедитесь, что .env файл обновлен
- Проверьте, что вы перезапустили dev сервер
- Очистите кэш браузера (Ctrl+F5)

### Переменные не применяются
- Убедитесь, что переменная начинается с `VITE_`
- Перезапустите dev сервер после изменения .env
- Проверьте, что .env файл находится в корне проекта

### Приложение не загружается
- Проверьте консоль браузера на ошибки
- Убедитесь, что все зависимости установлены (`npm install`)
- Проверьте, что dev сервер запущен без ошибок

## Следующие шаги

После исправления переменных окружения:

1. Протестируйте приложение в браузере
2. Проверьте все страницы и навигацию
3. При необходимости переключитесь в Telegram режим
4. Настройте backend для полноценной работы
