import { useState, useEffect } from 'react'
import { X, Upload, Image as ImageIcon, Plus, ArrowRight } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import apiClient from '../utils/api'
import '../styles/CreateListing.css'

const CreateListing = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    images: [],
    condition: 'new',
    location: ''
  })

  // Load existing listing data if editing
  useEffect(() => {
    if (id) {
      setIsEditing(true)
      loadListingData(id)
    }
  }, [id])

  const loadListingData = async (listingId) => {
    try {
      setLoading(true)
      const data = await apiClient.getListingById(listingId)
      setFormData({
        title: data.title || '',
        description: data.description || '',
        price: data.price || '',
        category: data.category || '',
        images: data.images || [],
        condition: data.condition || 'new',
        location: data.location || ''
      })
      // Load preview images if they exist
      if (data.images && data.images.length > 0) {
        setPreviewImages(data.images.map(img => ({ preview: img })))
      }
    } catch (err) {
      setError('Не удалось загрузить данные объявления')
      console.error('Error loading listing:', err)
    } finally {
      setLoading(false)
    }
  }

  const [previewImages, setPreviewImages] = useState([])

  const categories = [
    { id: 'electronics', name: 'Электроника' },
    { id: 'auto', name: 'Авто' },
    { id: 'realty', name: 'Недвижимость' },
    { id: 'clothing', name: 'Одежда' },
    { id: 'services', name: 'Услуги' },
    { id: 'hobby', name: 'Хобби' },
    { id: 'work', name: 'Работа' },
    { id: 'other', name: 'Прочее' },
  ]

  const conditions = [
    { id: 'new', label: 'Новое' },
    { id: 'like_new', label: 'Как новое' },
    { id: 'good', label: 'Хорошее' },
    { id: 'acceptable', label: 'Приемлемое' },
  ]

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    const newPreviews = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }))
    setPreviewImages([...previewImages, ...newPreviews])
    setFormData({
      ...formData,
      images: [...formData.images, ...files]
    })
  }

  const handleRemoveImage = (index) => {
    const newPreviews = previewImages.filter((_, i) => i !== index)
    const newImages = formData.images.filter((_, i) => i !== index)
    setPreviewImages(newPreviews)
    setFormData({
      ...formData,
      images: newImages
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title || !formData.price || !formData.category) {
      setError('Пожалуйста, заполните все обязательные поля')
      return
    }

    try {
      setLoading(true)
      setError('')

      const listingData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        condition: formData.condition,
        location: formData.location,
        images: previewImages.map(img => img.preview)
      }

      if (isEditing) {
        await apiClient.updateListing(id, listingData)
      } else {
        await apiClient.createListing(listingData)
      }

      navigate('/my-listings')
    } catch (err) {
      setError(isEditing ? 'Не удалось обновить объявление' : 'Не удалось создать объявление')
      console.error('Error saving listing:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="create-listing-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">{isEditing ? 'Редактировать объявление' : 'Создать объявление'}</h1>
          <button className="close-button" onClick={() => navigate('/my-listings')}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form className="create-form" onSubmit={handleSubmit}>
          {/* Images Upload */}
          <div className="form-section">
            <h2 className="section-title">Фотографии</h2>
            <div className="image-upload-area">
              <label className="upload-label">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="file-input"
                />
                <div className="upload-placeholder">
                  <Plus size={32} />
                  <span>Добавить фото</span>
                </div>
              </label>
              
              {previewImages.length > 0 && (
                <div className="image-previews">
                  {previewImages.map((img, index) => (
                    <div key={index} className="image-preview">
                      <img src={img.preview} alt={`Preview ${index}`} />
                      <button
                        type="button"
                        className="remove-image-btn"
                        onClick={() => handleRemoveImage(index)}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Title */}
          <div className="form-section">
            <h2 className="section-title">Название</h2>
            <input
              type="text"
              className="form-input"
              placeholder="Название товара"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              disabled={loading}
            />
          </div>

          {/* Location */}
          <div className="form-section">
            <h2 className="section-title">Локация</h2>
            <input
              type="text"
              className="form-input"
              placeholder="Город или регион"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
              disabled={loading}
            />
          </div>

          {/* Category */}
          <div className="form-section">
            <h2 className="section-title">Категория</h2>
            <select
              className="form-input"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            >
              <option value="">Выберите категорию</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>



          {/* Condition */}
          <div className="form-section">
            <h2 className="section-title">Состояние</h2>
            <div className="condition-options">
              {conditions.map((condition) => (
                <button
                  key={condition.id}
                  type="button"
                  className={`condition-button ${formData.condition === condition.id ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, condition: condition.id })}
                >
                  {condition.label}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="form-section">
            <h2 className="section-title">Описание</h2>
            <textarea
              className="form-textarea"
              placeholder="Подробное описание товара"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={5}
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-button" disabled={loading}>
            <span>{loading ? 'Сохранение...' : (isEditing ? 'Сохранить изменения' : 'Опубликовать объявление')}</span>
            {!loading && <ArrowRight size={20} />}
          </button>
        </form>
      </div>
    </div>
  )
}

export default CreateListing