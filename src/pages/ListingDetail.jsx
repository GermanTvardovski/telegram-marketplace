import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Heart, Share2, MapPin, Star, ShieldCheck, ShoppingCart, Package, ArrowLeft } from 'lucide-react'
import '../styles/ListingDetail.css'

const ListingDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isFavorite, setIsFavorite] = useState(false)

  // Mock listing data
  const listing = {
    id: parseInt(id),
    title: 'iPhone 15 Pro Max 256GB',
    price: 95000,
    articul: 'IP15PM-256-TITAN',
    description: 'Новый iPhone 15 Pro Max 256GB в титановом корпусе. Оригинальный аппарат, куплен в официальном магазине Apple. Комплектация полная: коробка, зарядное устройство, кабель, инструкция. Гарантия 1 год.',
    images: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800',
      'https://images.unsplash.com/photo-1567581935884-3349723552ca?w=800',
    ],
    location: 'Москва, Центр',
    category: 'Электроника',
    createdAt: '2 дня назад',
    views: 234,
    seller: {
      id: 1,
      name: 'Алексей',
      username: '@alex_tech',
      photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
      rating: 4.8,
      reviews: 127,
      activeListings: 15,
      soldItems: 234
    }
  }

  const handleFavorite = () => {
    setIsFavorite(!isFavorite)
  }

  const handleShare = () => {
    console.log('Share listing')
  }

  const handleBuy = () => {
    console.log('Buy without guarantee')
  }

  const handleBuyWithGuarantee = () => {
    console.log('Buy with guarantee')
  }

  const handleSellerClick = () => {
    navigate(`/seller/${listing.seller.id}`)
  }

  return (
    <div className="listing-detail-page">
      {/* Header */}
      <div className="detail-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={24} />
        </button>
        <div className="header-actions">
          <button className="action-button" onClick={handleFavorite}>
            <Heart size={24} className={isFavorite ? 'favorited' : ''} />
          </button>
          <button className="action-button" onClick={handleShare}>
            <Share2 size={24} />
          </button>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="image-gallery">
        <div className="main-image">
          <img src={listing.images[0]} alt={listing.title} />
        </div>
        <div className="thumbnail-list">
          {listing.images.map((image, index) => (
            <div key={index} className={`thumbnail ${index === 0 ? 'active' : ''}`}>
              <img src={image} alt={`${listing.title} ${index + 1}`} />
            </div>
          ))}
        </div>
      </div>

      <div className="container">
        {/* Title and Price */}
        <div className="listing-header">
          <h1 className="listing-title">{listing.title}</h1>
          <div className="listing-price">{listing.price.toLocaleString()} ₽</div>
        </div>

        {/* Articul */}
        <div className="listing-articul">
          <span className="articul-label">Артикул:</span>
          <span className="articul-value">{listing.articul}</span>
        </div>

        {/* Location and Date */}
        <div className="listing-meta">
          <div className="meta-item">
            <MapPin size={16} />
            <span>{listing.location}</span>
          </div>
          <div className="meta-item">
            <span>{listing.createdAt}</span>
          </div>
          <div className="meta-item">
            <span>{listing.views} просмотров</span>
          </div>
        </div>

        {/* Description */}
        <div className="description-section">
          <h2 className="section-title">Описание</h2>
          <p className="description-text">{listing.description}</p>
        </div>

        {/* Seller Info */}
        <div className="seller-section">
          <div className="seller-header">
            <h2 className="section-title">Продавец</h2>
            <div className="seller-rating">
              <Star size={16} />
              <span>{listing.seller.rating}</span>
              <span className="reviews-count">({listing.seller.reviews} отзывов)</span>
            </div>
          </div>
          <button className="seller-card" onClick={handleSellerClick}>
            <div className="seller-avatar">
              <img src={listing.seller.photo} alt={listing.seller.name} />
            </div>
            <div className="seller-info">
              <div className="seller-name">{listing.seller.name}</div>
              <div className="seller-username">{listing.seller.username}</div>
              <div className="seller-stats">
                <span>{listing.seller.activeListings} активных</span>
                <span>•</span>
                <span>{listing.seller.soldItems} продано</span>
              </div>
            </div>
            <div className="seller-arrow">
              <ArrowLeft size={20} style={{ transform: 'rotate(180deg)' }} />
            </div>
          </button>
        </div>

        {/* Purchase Buttons */}
        <div className="purchase-section">
          <button className="purchase-button primary" onClick={handleBuy}>
            <ShoppingCart size={20} />
            <span>Купить</span>
          </button>
          <button className="purchase-button secondary" onClick={handleBuyWithGuarantee}>
            <ShieldCheck size={20} />
            <span>Купить с гарантом</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ListingDetail
