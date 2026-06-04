import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Search, Grid3x3, ArrowRight, Smartphone, Car, Home as HomeIcon, Shirt, Wrench, Gamepad2, Briefcase, Filter } from 'lucide-react'
import '../styles/Home.css'

const Home = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [filteredListings, setFilteredListings] = useState([])
  const [sortBy, setSortBy] = useState('newest')

  // Filter listings based on category and search query
  useEffect(() => {
    const categoryParam = searchParams.get('category')
    if (categoryParam) {
      setSelectedCategory(parseInt(categoryParam))
    } else {
      setSelectedCategory(null)
    }

    let filtered = popularListings

    // Filter by category
    if (selectedCategory) {
      const category = categories.find(cat => cat.id === selectedCategory)
      if (category) {
        filtered = filtered.filter(listing => listing.category === category.name)
      }
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(listing =>
        listing.title.toLowerCase().includes(query) ||
        listing.category.toLowerCase().includes(query) ||
        listing.location.toLowerCase().includes(query)
      )
    }

    // Sort listings
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price_low':
          return a.price - b.price
        case 'price_high':
          return b.price - a.price
        case 'newest':
        default:
          return b.id - a.id
      }
    })

    setFilteredListings(filtered)
  }, [searchParams, searchQuery, sortBy])

  const categories = [
    { id: 1, name: 'Электроника', icon: Smartphone, color: '#8b5cf6' },
    { id: 2, name: 'Авто', icon: Car, color: '#10b981' },
    { id: 3, name: 'Недвижимость', icon: HomeIcon, color: '#f59e0b' },
    { id: 4, name: 'Одежда', icon: Shirt, color: '#ef4444' },
    { id: 5, name: 'Услуги', icon: Wrench, color: '#06b6d4' },
    { id: 6, name: 'Хобби', icon: Gamepad2, color: '#ec4899' },
    { id: 7, name: 'Работа', icon: Briefcase, color: '#84cc16' },
  ]

  const popularListings = [
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
    {
      id: 3,
      title: 'PlayStation 5',
      price: 45000,
      image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400',
      location: 'Казань',
      category: 'Хобби',
      condition: 'Хорошее',
      seller: { id: 3, name: 'Дмитрий', rating: 4.7 },
      views: 312,
      createdAt: '1 неделя назад'
    },
  ]

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleCategoryClick = (category) => {
    navigate(`/?category=${category.id}`)
  }

  const handleListingClick = (listing) => {
    navigate(`/listing/${listing.id}`)
  }

  const handleAllCategories = () => {
    navigate('/categories')
  }

  const clearCategoryFilter = () => {
    navigate('/')
  }

  return (
    <div className="home-page">
      <div className="container">
        {/* Search */}
        <div className="search-wrapper">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            className="search-input"
            placeholder="Поиск объявлений..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>

        {/* Categories */}
        <section className="categories-section">
          <div className="section-header">
            <h2 className="section-title">Категории</h2>
            <button className="see-all-btn" onClick={handleAllCategories}>
              Все
              <ArrowRight size={16} />
            </button>
          </div>
          {selectedCategory && (
            <div className="active-filter">
              <span className="filter-label">Фильтр:</span>
              <span className="filter-value">
                {categories.find(cat => cat.id === selectedCategory)?.name}
              </span>
              <button className="clear-filter" onClick={clearCategoryFilter}>
                ✕
              </button>
            </div>
          )}
          <div className="categories-grid">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <button
                  key={category.id}
                  className="category-card"
                  onClick={() => handleCategoryClick(category)}
                  style={{ '--accent-color': category.color }}
                >
                  <Icon className="category-icon" size={28} />
                  <span className="category-name">{category.name}</span>
                </button>
              )
            })}
            <button
              className="category-card category-more"
              onClick={handleAllCategories}
            >
              <Grid3x3 size={24} />
              <span className="category-name">Прочее</span>
            </button>
          </div>
        </section>

        {/* Popular Listings */}
        <section className="popular-section">
          <div className="section-header">
            <h2 className="section-title">
              {selectedCategory ? 'Объявления в категории' : 'Популярные объявления'}
            </h2>
            <div className="sort-controls">
              <Filter size={16} className="sort-icon" />
              <select
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Сначала новые</option>
                <option value="price_low">Сначала дешевые</option>
                <option value="price_high">Сначала дорогие</option>
              </select>
            </div>
          </div>
          {filteredListings.length > 0 ? (
            <div className="listings-list">
              {filteredListings.map((listing) => (
              <div
                key={listing.id}
                className="listing-card-horizontal"
                onClick={() => handleListingClick(listing)}
              >
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
              </div>
            ))}
          </div>
          ) : (
            <div className="empty-state">
              <p className="empty-text">
                {searchQuery ? 'По вашему запросу ничего не найдено' : 'В этой категории пока нет объявлений'}
              </p>
              {(selectedCategory || searchQuery) && (
                <button className="clear-all-filters" onClick={() => {
                  navigate('/')
                  setSearchQuery('')
                }}>
                  Сбросить фильтры
                </button>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default Home
