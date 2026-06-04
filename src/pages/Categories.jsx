import { ArrowLeft, ChevronRight, Smartphone, Car, Home as HomeIcon, Shirt, Wrench, Gamepad2, Briefcase, Dog, Baby, Trophy, Building2, Apple } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import '../styles/Categories.css'

const Categories = () => {
  const navigate = useNavigate()

  const allCategories = [
    {
      id: 1,
      name: 'Электроника',
      icon: Smartphone,
      subcategories: ['Смартфоны', 'Ноутбуки', 'Планшеты', 'Аксессуары', 'Игровые консоли']
    },
    {
      id: 2,
      name: 'Авто',
      icon: Car,
      subcategories: ['Легковые авто', 'Мотоциклы', 'Запчасти', 'Шины и диски', 'Автозвук']
    },
    {
      id: 3,
      name: 'Недвижимость',
      icon: HomeIcon,
      subcategories: ['Квартиры', 'Дома', 'Дачи', 'Коммерческая', 'Земельные участки']
    },
    {
      id: 4,
      name: 'Одежда',
      icon: Shirt,
      subcategories: ['Женская одежда', 'Мужская одежда', 'Детская одежда', 'Обувь', 'Аксессуары']
    },
    {
      id: 5,
      name: 'Услуги',
      icon: Wrench,
      subcategories: ['Ремонт', 'Красота', 'Обучение', 'Репетиторы', 'Перевозки']
    },
    {
      id: 6,
      name: 'Хобби',
      icon: Gamepad2,
      subcategories: ['Игры', 'Книги', 'Коллекционирование', 'Музыка', 'Спорт']
    },
    {
      id: 7,
      name: 'Работа',
      icon: Briefcase,
      subcategories: ['IT', 'Маркетинг', 'Продажи', 'Строительство', 'Транспорт']
    },
    {
      id: 8,
      name: 'Животные',
      icon: Dog,
      subcategories: ['Собаки', 'Кошки', 'Птицы', 'Рыбки', 'Товары для животных']
    },
    {
      id: 9,
      name: 'Детские товары',
      icon: Baby,
      subcategories: ['Игрушки', 'Коляски', 'Мебель', 'Одежда', 'Питание']
    },
    {
      id: 10,
      name: 'Спорт и отдых',
      icon: Trophy,
      subcategories: ['Велосипеды', 'Тренажеры', 'Туризм', 'Зимний спорт', 'Водный спорт']
    },
    {
      id: 11,
      name: 'Бизнес',
      icon: Building2,
      subcategories: ['Готовый бизнес', 'Оборудование', 'Сырье', 'Партнерства', 'Франшизы']
    },
    {
      id: 12,
      name: 'Продукты',
      icon: Apple,
      subcategories: ['Овощи и фрукты', 'Мясо', 'Молочные продукты', 'Выпечка', 'Напитки']
    },
  ]

  const handleBack = () => {
    navigate(-1)
  }

  const handleCategoryClick = (category) => {
    // Navigate to home page with category filter
    navigate(`/?category=${category.id}`)
  }

  return (
    <div className="categories-page">
      {/* Header */}
      <div className="page-header">
        <button className="back-button" onClick={handleBack}>
          <ArrowLeft size={24} />
        </button>
        <h1 className="page-title">Все категории</h1>
        <div className="header-spacer"></div>
      </div>

      <div className="container">
        <div className="categories-list">
          {allCategories.map((category) => {
            const Icon = category.icon
            return (
              <div
                key={category.id}
                className="category-item"
                onClick={() => handleCategoryClick(category)}
              >
                <div className="category-info">
                  <Icon className="category-icon" size={32} />
                  <div className="category-details">
                    <h3 className="category-name">{category.name}</h3>
                    <p className="category-subcategories">
                      {category.subcategories.slice(0, 3).join(', ')}
                      {category.subcategories.length > 3 && '...'}
                    </p>
                  </div>
                </div>
                <ChevronRight size={20} className="category-arrow" />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Categories
