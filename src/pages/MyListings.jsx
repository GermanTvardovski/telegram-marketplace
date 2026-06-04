import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Archive, Eye, Edit3, MoreVertical } from 'lucide-react'
import apiClient from '../utils/api'
import '../styles/MyListings.css'

const MyListings = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('active')
  const [loading, setLoading] = useState(false)
  const [activeListings, setActiveListings] = useState([])
  const [archivedListings, setArchivedListings] = useState([])

  // Load user listings
  useEffect(() => {
    loadUserListings()
  }, [activeTab])

  const loadUserListings = async () => {
    try {
      setLoading(true)
      const status = activeTab === 'active' ? 'active' : 'archived'
      const data = await apiClient.getUserListings('me', status)
      
      if (activeTab === 'active') {
        setActiveListings(data)
      } else {
        setArchivedListings(data)
      }
    } catch (err) {
      console.error('Error loading listings:', err)
      // Use mock data if API fails
      if (activeTab === 'active') {
        setActiveListings([
          {
            id: 1,
            title: 'iPhone 15 Pro Max 256GB',
            price: 95000,
            image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
            location: 'Москва',
            category: 'Электроника',
            condition: 'Новое',
            views: 234,
            createdAt: '2 дня назад',
            status: 'active'
          },
          {
            id: 2,
            title: 'PlayStation 5',
            price: 45000,
            image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400',
            location: 'Казань',
            category: 'Хобби',
            condition: 'Хорошее',
            views: 189,
            createdAt: '5 дней назад',
            status: 'active'
          },
        ])
      } else {
        setArchivedListings([
          {
            id: 3,
            title: 'MacBook Pro 13" M1',
            price: 85000,
            image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
            location: 'Санкт-Петербург',
            category: 'Электроника',
            condition: 'Как новое',
            views: 456,
            soldAt: '15 дней назад',
            status: 'sold'
          },
          {
            id: 4,
            title: 'iPad Air 5',
            price: 42000,
            image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400',
            location: 'Москва',
            category: 'Электроника',
            condition: 'Хорошее',
            views: 123,
            soldAt: '1 месяц назад',
            status: 'sold'
          },
        ])
      }
    } finally {
      setLoading(false)
    }
  }
  
  const handleAddListing = () => {
    navigate('/create-listing')
  }

  const handleListingClick = (listing) => {
    navigate(`/listing/${listing.id}`)
  }

  const handleEditListing = (id) => {
    navigate(`/edit-listing/${id}`)
  }

  const handleArchiveListing = async (id) => {
    try {
      await apiClient.deleteListing(id)
      // Reload listings after archiving - pass activeTab to ensure correct data loading
      if (activeTab === 'active') {
        const data = await apiClient.getUserListings('me', 'active')
        setActiveListings(data || [])
      } else {
        const data = await apiClient.getUserListings('me', 'archived')
        setArchivedListings(data || [])
      }
    } catch (err) {
      console.error('Error archiving listing:', err)
      alert('Не удалось архивировать объявление')
    }
  }

  return (
    <div className="my-listings-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Мои объявления</h1>
          <button className="add-button" onClick={handleAddListing}>
            <Plus size={20} />
            <span>Добавить</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="tabs-container">
          <button
            className={`tab-button ${activeTab === 'active' ? 'active' : ''}`}
            onClick={() => setActiveTab('active')}
          >
            Активные
          </button>
          <button
            className={`tab-button ${activeTab === 'archived' ? 'active' : ''}`}
            onClick={() => setActiveTab('archived')}
          >
            Архивные
          </button>
        </div>

        {/* Content */}
        {activeTab === 'active' ? (
          <div className="tab-content">
            {activeListings.length === 0 ? (
              <div className="empty-state">
                <Archive size={48} className="empty-icon" />
                <p className="empty-text">У вас пока нет активных объявлений</p>
                <button className="add-first-button" onClick={handleAddListing}>
                  <Plus size={20} />
                  Добавить первое объявление
                </button>
              </div>
            ) : (
              <div className="listings-list">
                {activeListings.map((listing) => (
                  <div key={listing.id} className="listing-card clickable" onClick={() => handleListingClick(listing)}>
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
                        <span className="listing-views">
                          <Eye size={14} />
                          {listing.views}
                        </span>
                        <span className="listing-date">{listing.createdAt}</span>
                      </div>
                      <div className="listing-actions">
                        <button
                          className="action-button"
                          onClick={() => handleEditListing(listing.id)}
                        >
                          <Edit3 size={18} />
                          <span>Редактировать</span>
                        </button>
                        <button
                          className="action-button"
                          onClick={() => handleArchiveListing(listing.id)}
                        >
                          <Archive size={18} />
                          <span>Архивировать</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="tab-content">
            {archivedListings.length === 0 ? (
              <div className="empty-state">
                <Archive size={48} className="empty-icon" />
                <p className="empty-text">В архиве пока нет объявлений</p>
              </div>
            ) : (
              <div className="listings-list">
                {archivedListings.map((listing) => (
                  <div key={listing.id} className="listing-card archived clickable" onClick={() => handleListingClick(listing)}>
                    <div className="listing-image">
                      <img src={listing.image} alt={listing.title} />
                      <div className="status-badge">Продано</div>
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
                        <span className="listing-views">
                          <Eye size={14} />
                          {listing.views}
                        </span>
                        <span className="listing-date">Продано {listing.soldAt}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyListings
