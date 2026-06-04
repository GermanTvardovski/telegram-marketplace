const { Pool } = require('pg');

// Конфигурация подключения к PostgreSQL
const pool = new Pool({
  host: 'localhost',
  port: 5000,
  user: 'postgres',
  password: '123',
  database: 'telegram_marketplace',
});

async function initializeDatabase() {
  try {
    // Тест подключения
    await pool.query('SELECT NOW()');
    console.log('✅ Подключение к PostgreSQL установлено успешно');
    
    // Чтение и выполнение SQL скрипта
    const fs = require('fs');
    const path = require('path');
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Разделение на отдельные команды
    const commands = schema
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));
    
    for (const command of commands) {
      try {
        await pool.query(command);
        console.log('✅ Команда выполнена:', command.substring(0, 50) + '...');
      } catch (error) {
        if (!error.message.includes('already exists')) {
          console.log('⚠️ Ошибка:', error.message);
        }
      }
    }
    
    console.log('✅ База данных успешно инициализирована');
    
    // Проверка таблиц
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('📋 Созданные таблицы:', tables.rows.map(t => t.table_name));
    
  } catch (error) {
    console.error('❌ Ошибка при инициализации базы данных:', error);
  } finally {
    await pool.end();
  }
}

initializeDatabase();
