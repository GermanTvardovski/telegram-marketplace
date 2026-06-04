import { useState } from 'react'
import { Bell, Shield, Moon, Sun, Globe, HelpCircle, LogOut, ChevronRight } from 'lucide-react'
import '../styles/Settings.css'

const Settings = () => {
  const [darkMode, setDarkMode] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const [language, setLanguage] = useState('ru')

  const settingsSections = [
    {
      title: 'Общие',
      items: [
        {
          icon: Bell,
          label: 'Уведомления',
          type: 'toggle',
          value: notifications,
          onChange: setNotifications
        },
        {
          icon: darkMode ? Moon : Sun,
          label: 'Темная тема',
          type: 'toggle',
          value: darkMode,
          onChange: setDarkMode
        },
        {
          icon: Globe,
          label: 'Язык',
          type: 'select',
          value: language,
          options: ['ru', 'en'],
          onChange: setLanguage
        },
      ]
    },
    {
      title: 'Безопасность',
      items: [
        {
          icon: Shield,
          label: 'Приватность',
          type: 'navigation',
          onClick: () => console.log('Privacy clicked')
        },
        {
          icon: Shield,
          label: 'Изменить пароль',
          type: 'navigation',
          onClick: () => console.log('Change password clicked')
        },
      ]
    },
    {
      title: 'Поддержка',
      items: [
        {
          icon: HelpCircle,
          label: 'Помощь',
          type: 'navigation',
          onClick: () => console.log('Help clicked')
        },
        {
          icon: HelpCircle,
          label: 'О приложении',
          type: 'navigation',
          onClick: () => console.log('About clicked')
        },
      ]
    },
    {
      title: 'Аккаунт',
      items: [
        {
          icon: LogOut,
          label: 'Выйти',
          type: 'danger',
          onClick: () => console.log('Logout clicked')
        },
      ]
    }
  ]

  const handleToggleChange = (item) => {
    item.onChange(!item.value)
  }

  return (
    <div className="settings-page">
      <div className="container">
        <h1 className="page-title">Настройки</h1>

        {settingsSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="settings-section">
            <h2 className="section-title">{section.title}</h2>
            <div className="settings-list">
              {section.items.map((item, itemIndex) => {
                const Icon = item.icon
                return (
                  <div
                    key={itemIndex}
                    className={`settings-item ${item.type === 'danger' ? 'danger' : ''}`}
                    onClick={item.type === 'navigation' || item.type === 'danger' ? item.onClick : undefined}
                  >
                    <div className="settings-item-left">
                      <Icon size={20} className="settings-item-icon" />
                      <span className="settings-item-label">{item.label}</span>
                    </div>
                    <div className="settings-item-right">
                      {item.type === 'toggle' && (
                        <div
                          className={`toggle-switch ${item.value ? 'active' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleToggleChange(item)
                          }}
                        >
                          <div className="toggle-slider"></div>
                        </div>
                      )}
                      {item.type === 'select' && (
                        <div className="select-value">
                          {item.value === 'ru' ? 'Русский' : 'English'}
                          <ChevronRight size={16} />
                        </div>
                      )}
                      {item.type === 'navigation' && (
                        <ChevronRight size={16} className="chevron-icon" />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Settings
