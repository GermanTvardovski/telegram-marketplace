import React from 'react'
import ReactDOM from 'react-dom/client'

const TestApp = () => {
  return (
    <div style={{ 
      padding: '20px', 
      color: 'white',
      backgroundColor: '#0a0a0f',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#8b5cf6' }}>Telegram Marketplace</h1>
      <p>Тестовый компонент работает!</p>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TestApp />
  </React.StrictMode>
)
