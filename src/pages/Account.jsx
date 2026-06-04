import { Star, MapPin, Box, Edit3, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import '../styles/Account.css'

const Account = () => {
  const navigate = useNavigate()
  const { user } = useUser()

  const handleEditProfile = () => {
    // TODO: Implement edit profile
    console.log('Edit profile clicked')
  }

  // Подготовка данных пользователя для компонента
  const userData = {
    username: user?.username || '@username',
    fullName: user?.full_name || 'Александр',
    photo: user?.photo_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alexander',
    rating: user?.rating || 4.8,
    reviews: user?.reviews_count || 127,
    activeListings: user?.active_listings || 15,
    soldItems: user?.sold_items || 234,
    memberSince: user?.member_since || '2023',
    location: user?.location || 'Москва',
    bio: user?.bio || 'Продавец электроники и гаджетов. Гарантия качества на все товары.',
    balance: user?.balance || 15000
  }

  return (
    <div className="account-page">
      <div className="container">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar">
            <img src={userData.photo} alt={userData.fullName} />
          </div>
          <div className="profile-info">
            <h1 className="profile-name">{userData.fullName}</h1>
            <p className="profile-username">{userData.username}</p>
            <div className="profile-stats">
              <div className="stat-item">
                <Star size={16} className="stat-icon" />
                <span className="stat-value">{userData.rating}</span>
                <span className="stat-label">({userData.reviews} отзывов)</span>
              </div>
            </div>
            <div className="cont-ed-b">
                <button className="edit-button-mobile" onClick={handleEditProfile}>
                <Edit3 size={20} />
                <span>Редактировать</span>
                </button>
            </div>
            
          </div>
          <button className="edit-button" onClick={handleEditProfile}>
            <Edit3 size={20} />
          </button>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <Box size={24} className="stat-card-icon" />
            <div className="stat-card-content">
              <span className="stat-card-value">{userData.activeListings}</span>
              <span className="stat-card-label">Активных объявлений</span>
            </div>
          </div>
          <div className="stat-card">
            <Box size={24} className="stat-card-icon" />
            <div className="stat-card-content">
              <span className="stat-card-value">{userData.soldItems}</span>
              <span className="stat-card-label">Продано товаров</span>
            </div>
          </div>
        </div>

        {/* Balance Card */}
        <div className="balance-card">
          <div className="balance-info">
            <span className="balance-label">Баланс</span>
            <span className="balance-value">{userData.balance.toLocaleString()} ₽</span>
          </div>
          <button className="recharge-button" onClick={() => navigate('/balance')}>
            Пополнить
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Additional Info */}
        <div className="info-section">
          <h2 className="info-section-title">О себе</h2>
          <p className="info-text">{userData.bio}</p>
        </div>

        <div className="info-section">
          <h2 className="info-section-title">Локация</h2>
          <div className="location-info">
            <MapPin size={16} className="location-icon" />
            <span className="location-text">{userData.location}</span>
          </div>
        </div>

        <div className="info-section">
          <h2 className="info-section-title">На платформе с</h2>
          <p className="info-text">{userData.memberSince}</p>
        </div>
      </div>
    </div>
  )
}

export default Account
