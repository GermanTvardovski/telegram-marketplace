import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, Trash2 } from 'lucide-react'
import apiClient from '../utils/api'
import '../styles/Favorites.css'

const Favorites = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [favoriteListings, setFavoriteListings] = useState([])

  useEffect(() => {
    loadFavorites()
  }, [])

  const loadFavorites = async () => {
    try {
      setLoading(true)
      const data = await apiClient.getFavoriteListings()
      setFavoriteListings(data || [])
    } catch (err) {
      console.error('Error loading favorites:', err)
      // Use mock data if API fails
      setFavoriteListings([
        {
          id: 1,
          title: 'iPhone 15 Pro Max 256GB',
          price: 95000,
          image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
          location: 'Москва',
          category: 'Электроника',
          condition: 'Новое',
          seller: { id: 1, name: 'Алексей', rating: 4.8 },
          views: 234,
          createdAt: '2 дня назад'
        },
        {
          id: 2,
          title: 'MacBook Pro 14" M3',
          price: 189000,
          image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
          location: 'Санкт-Петербург',
          category: 'Электроника',
          condition: 'Как новое',
          seller: { id: 2, name: 'Мария', rating: 4.9 },
          views: 189,
          createdAt: '5 дней назад'
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleListingClick = (listing) => {
    navigate(`/listing/${listing.id}`)
  }

  const handleRemoveListing = async (id) => {
    try {
      await apiClient.removeFavoriteListing(id)
      loadFavorites()
    } catch (err) {
      console.error('Error removing listing from favorites:', err)
      alert('Не удалось удалить из избранного')
    }
  }

  return (
    <div className="favorites-page">
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          <div style={{ color: 'var(--text-secondary)' }}>Загрузка...</div>
        </div>
      ) : (
        <div className="container">
          <h1 className="page-title">Избранное</h1>
          <div className="listings-list">
            {favoriteListings.length === 0 ? (
              <div className="empty-state">
                <Heart size={48} className="empty-icon" />
                <p className="empty-text">У вас пока нет избранных объявлений</p>
              </div>
            ) : (
              favoriteListings.map((listing) => (
                <div key={listing.id} className="listing-card-horizontal" onClick={() => handleListingClick(listing)}>
                  <div className="listing-image">
                    <img src={listing.image} alt={listing.title} />
                  </div>
                  <div className="listing-content">
                    <div className="listing-header">
                      <h3 className="listing-title">{listing.title}</h3>
                      <span className="listing-condition">{listing.condition}</span>
                    </div>
                    <p className="listing-category">{listing.category}</p>
                    <p className="listing-price">{listing.price.toLocaleString()} ₽</p>
                    <div className="listing-meta">
                      <span className="listing-location">{listing.location}</span>
                      <span className="listing-seller">{listing.seller.name}</span>
                      <span className="listing-rating">⭐ {listing.seller.rating}</span>
                    </div>
                    <div className="listing-footer">
                      <span className="listing-views">{listing.views} просмотров</span>
                      <span className="listing-date">{listing.createdAt}</span>
                    </div>
                  </div>
                  <button
                    className="remove-button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemoveListing(listing.id)
                    }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Favorites