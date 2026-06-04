import { ArrowLeft, MapPin, Star, Box, Heart, MessageCircle } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import '../styles/SellerProfile.css'

const SellerProfile = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  // Mock seller data
  const seller = {
    id: parseInt(id),
    name: 'Алексей',
    username: '@alex_tech',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    rating: 4.8,
    reviews: 127,
    activeListings: 15,
    soldItems: 234,
    memberSince: '2023',
    location: 'Москва',
    bio: 'Продавец электроники и гаджетов. Гарантия качества на все товары.',
    isFavorite: false
  }

  const sellerListings = [
    {
      id: 1,
      title: 'iPhone 15 Pro Max 256GB',
      price: 95000,
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
      category: 'Электроника'
    },
    {
      id: 2,
      title: 'MacBook Pro 14" M3',
      price: 189000,
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
      category: 'Электроника'
    },
    {
      id: 3,
      title: 'PlayStation 5',
      price: 45000,
      image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400',
      category: 'Хобби'
    },
    {
      id: 4,
      title: 'AirPods Pro 2',
      price: 18000,
      image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400',
      category: 'Электроника'
    },
  ]

  const handleBack = () => {
    navigate(-1)
  }

  const handleMessage = () => {
    console.log('Message seller')
  }

  const handleFavorite = () => {
    console.log('Toggle favorite seller')
  }

  const handleListingClick = (listingId) => {
    navigate(`/listing/${listingId}`)
  }

  return (
    <div className="seller-profile-page">
      {/* Header */}
      <div className="profile-header">
        <button className="back-button" onClick={handleBack}>
          <ArrowLeft size={24} />
        </button>
        <h1 className="page-title">Профиль продавца</h1>
        <div className="header-spacer"></div>
      </div>

      <div className="container">
        {/* Profile Card */}
        <div className="profile-card">
          <div className="profile-avatar-large">
            <img src={seller.photo} alt={seller.name} />
          </div>
          <div className="profile-info">
            <h2 className="profile-name">{seller.name}</h2>
            <p className="profile-username">{seller.username}</p>
            <div className="profile-rating">
              <Star size={16} />
              <span className="rating-value">{seller.rating}</span>
              <span className="reviews-count">({seller.reviews} отзывов)</span>
            </div>
          </div>
          <div className="profile-actions">
            <button className="action-button secondary" onClick={handleFavorite}>
              <Heart size={20} className={seller.isFavorite ? 'favorited' : ''} />
            </button>
            <button className="action-button primary" onClick={handleMessage}>
              <MessageCircle size={20} />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-item">
            <Box size={24} className="stat-icon" />
            <div className="stat-content">
              <span className="stat-value">{seller.activeListings}</span>
              <span className="stat-label">Активных</span>
            </div>
          </div>
          <div className="stat-item">
            <Box size={24} className="stat-icon" />
            <div className="stat-content">
              <span className="stat-value">{seller.soldItems}</span>
              <span className="stat-label">Продано</span>
            </div>
          </div>
          <div className="stat-item">
            <Star size={24} className="stat-icon" />
            <div className="stat-content">
              <span className="stat-value">{seller.rating}</span>
              <span className="stat-label">Рейтинг</span>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="bio-section">
          <p className="bio-text">{seller.bio}</p>
        </div>

        {/* Location */}
        <div className="location-section">
          <MapPin size={16} className="location-icon" />
          <span className="location-text">{seller.location}</span>
        </div>

        {/* Member Since */}
        <div className="info-section">
          <span className="info-label">На платформе с {seller.memberSince}</span>
        </div>

        {/* Listings */}
        <div className="listings-section">
          <h3 className="section-title">Объявления продавца</h3>
          <div className="listings-grid">
            {sellerListings.map((listing) => (
              <div
                key={listing.id}
                className="listing-card"
                onClick={() => handleListingClick(listing.id)}
              >
                <div className="listing-image">
                  <img src={listing.image} alt={listing.title} />
                </div>
                <div className="listing-content">
                  <h4 className="listing-title">{listing.title}</h4>
                  <p className="listing-price">{listing.price.toLocaleString()} ₽</p>
                  <p className="listing-category">{listing.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SellerProfile
