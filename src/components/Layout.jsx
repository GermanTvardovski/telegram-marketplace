import { useNavigate } from 'react-router-dom'
import { Home, Heart, User, Store, Settings } from 'lucide-react'

const Layout = ({ children }) => {
  const navigate = useNavigate()

  const menuItems = [
    { id: 'home', label: 'Главная', path: '/', icon: Home },
    { id: 'favorites', label: 'Избранное', path: '/favorites', icon: Heart },
    { id: 'my-listings', label: 'Объявления', path: '/my-listings', icon: Store },
    { id: 'account', label: 'Аккаунт', path: '/account', icon: User },
    { id: 'settings', label: 'Настройки', path: '/settings', icon: Settings },
  ]

  return (
    <div style={{
      background: '#1a1a2e',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{
        flex: 1,
        padding: '20px',
        color: 'white',
        paddingBottom: '90px',
        overflowY: 'auto'
      }}>
        {children}
      </div>
      <nav style={{
        position: 'fixed',
        bottom: '0',
        left: '0',
        right: '0',
        height: '70px',
        background: 'rgba(37, 37, 66, 0.95)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(139, 92, 246, 0.2)',
        padding: '8px 0',
        paddingBottom: 'calc(8px + env(safe-area-inset-bottom))',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: '1000',
        boxSizing: 'border-box'
      }}>
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                background: 'transparent',
                border: 'none',
                color: '#a0a0a0',
                cursor: 'pointer',
                padding: '8px 12px',
                borderRadius: '8px',
                minWidth: '60px',
                flex: '1',
                maxWidth: '80px'
              }}
              onClick={() => navigate(item.path)}
            >
              <Icon size={20} />
              <span style={{ fontSize: '11px', fontWeight: 500 }}>{item.label}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}

export default Layout
