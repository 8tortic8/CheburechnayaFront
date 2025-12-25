import React, { useState, useEffect, useCallback, useMemo } from 'react'; 
import { Link } from 'react-router-dom'; 
import './CatalogPage.css'; 

import cheburekWithMeat from '../assets/images/cheburek-with-meat.jpg';
import cheburekWithCheese from '../assets/images/cheburek-with-cheese.jpg';
import cheburekWithPotatoes from '../assets/images/cheburek-with-potatoes.jpg';
import samsaWithChicken from '../assets/images/samsa-with-chicken.jpg';
import pizzaMargherita from '../assets/images/pizza-margherita.jpg';
import greekSalad from '../assets/images/greek-salad.jpg';
import coffeeLatte from '../assets/images/coffee-latte.jpg';
import blackTea from '../assets/images/black-tea.jpg';
import orangeJuice from '../assets/images/orange-juice.jpg';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5023/api';

const PLACEHOLDER_IMAGES = [
  cheburekWithMeat,
  cheburekWithCheese,
  cheburekWithPotatoes,
  samsaWithChicken,
  pizzaMargherita,
  greekSalad,
  coffeeLatte,
  blackTea,
  orangeJuice
];

const SIZE_VARIANTS = [
  { id: 'small', size: 'Маленький', multiplier: 1.0, description: 'Классический размер' },
  { id: 'medium', size: 'Средний', multiplier: 1.5, description: 'Популярный выбор' },
  { id: 'large', size: 'Большой', multiplier: 2.0, description: 'Для больших компаний' }
];

const TEST_PRODUCTS = [
  {
    id: 1,
    name: 'Чебурек с мясом',
    description: 'Сочный чебурек с начинкой из отборной говядины, лука и специй. Хрустящее тесто и ароматная начинка.',
    category: 'Мясные',
    calories: 450,
    weight: 150,
    image: cheburekWithMeat,
    price: 120,
    isAvailable: true,
    rating: 4.8,
    cookTime: 15,
    variants: SIZE_VARIANTS.map(v => ({
      id: v.id,
      size: v.size,
      price: Math.round(120 * v.multiplier),
      weight: Math.round(150 * v.multiplier)
    }))
  },
  {
    id: 2,
    name: 'Чебурек с сыром',
    description: 'Нежный чебурек с сырной начинкой. Идеальное сочетание хрустящего теста и тягучего сыра.',
    category: 'Сырные',
    calories: 380,
    weight: 140,
    image: cheburekWithCheese,
    price: 110,
    isAvailable: true,
    rating: 4.6,
    cookTime: 12,
    variants: SIZE_VARIANTS.map(v => ({
      id: v.id,
      size: v.size,
      price: Math.round(110 * v.multiplier),
      weight: Math.round(140 * v.multiplier)
    }))
  },
  {
    id: 3,
    name: 'Чебурек с картошкой',
    description: 'Вегетарианский чебурек с картофельной начинкой, зеленью и специями. Питательно и вкусно.',
    category: 'Вегетарианские',
    calories: 320,
    weight: 130,
    image: cheburekWithPotatoes,
    price: 100,
    isAvailable: true,
    rating: 4.4,
    cookTime: 10,
    variants: SIZE_VARIANTS.map(v => ({
      id: v.id,
      size: v.size,
      price: Math.round(100 * v.multiplier),
      weight: Math.round(130 * v.multiplier)
    }))
  },
  {
    id: 4,
    name: 'Чебурек с грибами',
    description: 'Ароматный чебурек с лесными грибами, луком и сметаной. Настоящее лесное наслаждение.',
    category: 'Грибные',
    calories: 290,
    weight: 135,
    image: samsaWithChicken,
    price: 115,
    isAvailable: false, 
    rating: 4.7,
    cookTime: 18,
    variants: SIZE_VARIANTS.map(v => ({
      id: v.id,
      size: v.size,
      price: Math.round(115 * v.multiplier),
      weight: Math.round(135 * v.multiplier)
    }))
  }
];

/**
 * Форматирует данные продукта из API в единый формат
 * @param {Object} product - Сырые данные продукта из API
 * @param {number} index - Индекс продукта в массиве
 * @returns {Object} Отформатированный продукт
 */
const formatProductFromAPI = (product, index) => {
  const getRussianName = (englishName) => {
    const nameMap = {
      'Cheburek with meat': 'Чебурек с мясом',
      'Cheburek with cheese': 'Чебурек с сыром',
      'Cheburek with potatoes': 'Чебурек с картошкой',
      'Samsa with chicken': 'Самса с курицей',
      'Pizza Margherita': 'Пицца Маргарита',
      'Greek salad': 'Греческий салат',
      'Coffee Latte': 'Кофе Латте',
      'Black tea': 'Черный чай',
      'Orange juice': 'Апельсиновый сок'
    };
    return nameMap[englishName] || englishName;
  };

  const getDescription = (name, category) => {
    const descriptions = {
      'Чебурек с мясом': 'Сочный чебурек с начинкой из отборной говядины, лука и специй. Хрустящее тесто и ароматная начинка.',
      'Чебурек с сыром': 'Нежный чебурек с сырной начинкой. Идеальное сочетание хрустящего теста и тягучего сыра.',
      'Чебурек с картошкой': 'Вегетарианский чебурек с картофельной начинкой, зеленью и специями. Питательно и вкусно.',
      'Самса с курицей': 'Ароматная самса с куриной начинкой и специями.',
      'Пицца Маргарита': 'Классическая итальянская пицца с томатным соусом, моцареллой и базиликом.',
      'Греческий салат': 'Свежий салат с огурцами, помидорами, оливками, сыром фета и оливковым маслом.',
      'Кофе Латте': 'Нежный кофе с молочной пенкой.',
      'Черный чай': 'Ароматный черный чай.',
      'Апельсиновый сок': 'Свежевыжатый апельсиновый сок.'
    };
    return descriptions[name] || `Вкусный ${name.toLowerCase()} из категории ${category}.`;
  };

  const getProductImage = (englishName) => {
    const imageMap = {
      'Cheburek with meat': cheburekWithMeat,
      'Cheburek with cheese': cheburekWithCheese,
      'Cheburek with potatoes': cheburekWithPotatoes,
      'Samsa with chicken': samsaWithChicken,
      'Pizza Margherita': pizzaMargherita,
      'Greek salad': greekSalad,
      'Coffee Latte': coffeeLatte,
      'Black tea': blackTea,
      'Orange juice': orangeJuice
    };
    return imageMap[englishName] || PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length];
  };

  const englishName = product.productName || product.name || `Product ${index + 1}`;
  const russianName = getRussianName(englishName);
  
  const englishCategory = product.category || 'Bakery';
  const russianCategory = englishCategory === 'Bakery' ? 'Выпечка' : 
                         englishCategory === 'Pizza' ? 'Пицца' :
                         englishCategory === 'Salads' ? 'Салаты' :
                         englishCategory === 'Drinks' ? 'Напитки' : englishCategory;
  
  const getCaloriesAndWeight = (name, category) => {
    switch (category) {
      case 'Bakery': return { calories: 400, weight: 150 };
      case 'Pizza': return { calories: 800, weight: 350 };
      case 'Salads': return { calories: 250, weight: 200 };
      case 'Drinks': return { calories: 100, weight: 300 };
      default: return { calories: 300, weight: 150 };
    }
  };

  const { calories, weight } = getCaloriesAndWeight(russianName, englishCategory);
  const basePrice = product.price || 100;
  const description = getDescription(russianName, russianCategory);
  const productImage = getProductImage(englishName);

  return {
    id: product.id || index + 1,
    
    name: russianName,
    description: description,
    
    category: russianCategory,
    calories: calories,
    weight: weight,
    cookTime: 15, 
    
    price: basePrice,
    isAvailable: true, 
    rating: 4.5, 
    
    imageUrl: '',
    image: productImage,
    
    variants: englishCategory === 'Bakery' ? SIZE_VARIANTS.map(variant => ({
      id: variant.id,
      size: variant.size,
      description: variant.description,
      price: Math.round(basePrice * variant.multiplier),
      weight: Math.round(weight * variant.multiplier)
    })) : [
      {
        id: 'standard',
        size: 'Стандартный',
        description: 'Стандартная порция',
        price: basePrice,
        weight: weight
      }
    ],
    
    tags: [russianCategory.toLowerCase()],
    ingredients: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

/**
 * Получает сохраненную корзину из localStorage
 * @returns {Array} Массив товаров в корзине
 */
const getBasketFromStorage = () => {
  try {
    const basketData = localStorage.getItem('cheburechnaya_basket');
    return basketData ? JSON.parse(basketData) : [];
  } catch (error) {
    console.error('Ошибка при чтении корзины из localStorage:', error);
    return [];
  }
};

/**
 * Сохраняет корзину в localStorage
 * @param {Array} basket - Массив товаров для сохранения
 */
const saveBasketToStorage = (basket) => {
  try {
    localStorage.setItem('cheburechnaya_basket', JSON.stringify(basket));
  } catch (error) {
    console.error('Ошибка при сохранении корзины в localStorage:', error);
  }
};

/**
 * Генерирует уникальный ID для товара в корзине
 * @param {number|string} productId - ID продукта
 * @param {string} sizeId - ID размера
 * @returns {string} Уникальный идентификатор
 */
const generateBasketItemId = (productId, sizeId) => {
  return `${productId}_${sizeId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const CatalogPage = () => {
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); 
  const [basketCount, setBasketCount] = useState(0); 
  const [selectedSizes, setSelectedSizes] = useState({}); 
  const [categories, setCategories] = useState([]); 
  const [selectedCategory, setSelectedCategory] = useState('all'); 
  const [sortBy, setSortBy] = useState('default'); 
  const [apiStatus, setApiStatus] = useState('checking'); 

  useEffect(() => {
    checkApiStatus();
    
    fetchProducts();
    
    initializeBasket();
    
    const apiCheckInterval = setInterval(checkApiStatus, 30000); 
    
    return () => {
      clearInterval(apiCheckInterval);
    };
  }, []); 

  useEffect(() => {
    console.log('Корзина обновлена, товаров:', basketCount);
  }, [basketCount]);

  const checkApiStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        timeout: 5000 
      });
      
      if (response.ok) {
        setApiStatus('online');
      } else {
        setApiStatus('offline');
      }
    } catch (error) {
      console.warn('API недоступен:', error.message);
      setApiStatus('offline');
    }
  };

  const fetchProducts = async () => {
    if (apiStatus === 'offline') {
      loadTestData();
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setApiStatus('checking');
      
      console.log(`Загрузка продуктов из API: ${API_BASE_URL}/products`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); 
      
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`Получено ${data.length} продуктов от API`);
      console.log('Сырые данные от API:', data); 
      
      const formattedProducts = Array.isArray(data) 
        ? data.map(formatProductFromAPI)
        : [];
      
      setProducts(formattedProducts);
      setApiStatus('online');
      
      extractCategories(formattedProducts);
      
    } catch (error) {
      console.error('Ошибка загрузки продуктов:', error);
      
      let errorMessage = 'Не удалось загрузить продукты';
      if (error.name === 'AbortError') {
        errorMessage = 'Таймаут запроса. Проверьте подключение к интернету.';
      } else if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Ошибка сети. Проверьте подключение к интернету.';
      } else {
        errorMessage = `Ошибка: ${error.message}`;
      }
      
      setError(errorMessage);
      setApiStatus('offline');
      
      loadTestData();
    } finally {
      setLoading(false);
    }
  };

  /**
   * Извлекает уникальные категории из списка продуктов
   * @param {Array} products - Список продуктов
   */
  const extractCategories = (products) => {
    const uniqueCategories = [...new Set(products.map(p => p.category).filter(Boolean))];
    setCategories(['all', ...uniqueCategories]);
  };

  const initializeBasket = () => {
    const savedBasket = getBasketFromStorage();
    setBasketCount(savedBasket.length);
  };

  /**
   * Обрабатывает выбор размера продукта
   * @param {number|string} productId - ID продукта
   * @param {string} sizeId - ID выбранного размера
   */
  const handleSizeSelect = (productId, sizeId) => {
    setSelectedSizes(prev => ({
      ...prev,
      [productId]: sizeId
    }));
  };

  /**
   * Добавляет товар в корзину
   * @param {Object} product - Объект продукта
   */
  const handleAddToBasket = (product) => {
    const sizeId = selectedSizes[product.id];
    if (!sizeId) {
      alert('Пожалуйста, выберите размер продукта');
      return;
    }
    
    if (!product.isAvailable) {
      alert('Этот продукт временно недоступен');
      return;
    }
    
    const selectedProductVariant = product.variants?.find(v => v.id === sizeId);
    
    if (!selectedProductVariant) {
      alert('Ошибка: выбранный размер не найден');
      return;
    }
    
    const finalPrice = selectedProductVariant.price;
    const finalWeight = selectedProductVariant.weight;
    const selectedSizeName = selectedProductVariant.size; 
    
    const basketItem = {
      id: generateBasketItemId(product.id, sizeId),
      productId: product.id,
      name: product.name,
      size: selectedSizeName, 
      sizeId: sizeId,
      price: finalPrice,
      weight: finalWeight,
      image: product.image || product.imageUrl || PLACEHOLDER_IMAGES[0],
      quantity: 1,
      calories: product.calories,
      addedAt: new Date().toISOString(),
      description: product.description,
      category: product.category
    };
    
    const currentBasket = getBasketFromStorage();
    
    const existingItemIndex = currentBasket.findIndex(
      item => item.productId === product.id && item.sizeId === sizeId
    );
    
    if (existingItemIndex > -1) {
      currentBasket[existingItemIndex].quantity += 1;
      currentBasket[existingItemIndex].updatedAt = new Date().toISOString();
    } else {
      currentBasket.push(basketItem);
    }
    
    saveBasketToStorage(currentBasket);
    
    const newCount = currentBasket.reduce((sum, item) => sum + item.quantity, 0);
    setBasketCount(newCount);
    
    showNotification(`${product.name} (${selectedSizeName}) добавлен в корзину за ${finalPrice} ₽`);
    
    playAddToCartSound();
  };

  /**
   * Показывает уведомление пользователю
   * @param {string} message - Текст уведомления
   */
  const showNotification = (message) => {
    alert(message);
  };

  const playAddToCartSound = () => {
  };

  const handleRefresh = () => {
    fetchProducts();
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const loadTestData = () => {
    console.log('Загрузка тестовых данных...');
    
    const formattedTestProducts = TEST_PRODUCTS.map((product, index) => 
      formatProductFromAPI(product, index)
    );
    
    setProducts(formattedTestProducts);
    setError(null);
    setApiStatus('offline');
    
    extractCategories(formattedTestProducts);
    
    console.log('Тестовые данные загружены:', formattedTestProducts.length, 'продуктов');
  };

  /**
   * Обрабатывает изменение категории
   * @param {Event} event - Событие изменения
   */
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  /**
   * Обрабатывает изменение сортировки
   @param {Event} event
   */
  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };


  const handleClearBasket = () => {
    if (window.confirm('Вы уверены, что хотите очистить корзину?')) {
      saveBasketToStorage([]);
      setBasketCount(0);
      alert('Корзина очищена');
    }
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    if (selectedCategory !== 'all') {
      result = result.filter(product => product.category === selectedCategory);
    }
    
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'calories-asc':
        result.sort((a, b) => a.calories - b.calories);
        break;
      case 'calories-desc':
        result.sort((a, b) => b.calories - a.calories);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'rating-desc':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }
    
    return result;
  }, [products, searchQuery, selectedCategory, sortBy]);

  const stats = useMemo(() => ({
    total: products.length,
    filtered: filteredProducts.length,
    available: products.filter(p => p.isAvailable).length,
    unavailable: products.filter(p => !p.isAvailable).length,
    totalCalories: products.reduce((sum, p) => sum + p.calories, 0),
    averagePrice: products.length > 0 
      ? Math.round(products.reduce((sum, p) => sum + p.price, 0) / products.length)
      : 0
  }), [products, filteredProducts.length]);

  if (loading && products.length === 0) {
    return (
      <div className="catalog-page">
        <header className="catalog-header">
          <div className="header-container">
            <div className="header-logo">
              <span className="logo-text">ЧЕБУРЕЧНАЯ</span>
            </div>
            
            <nav className="header-nav">
              <ul className="nav-list">
                <li className="nav-item">
                  <Link to="/" className="nav-link">главная</Link>
                </li>
                <li className="nav-item">
                  <Link to="/catalog" className="nav-link active">каталог</Link>
                </li>
                <li className="nav-item">
                  <Link to="/about" className="nav-link">о нас</Link>
                </li>
              </ul>
            </nav>
            
            <div className="header-actions">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Поиск..."
                  className="search-input"
                  value=""
                  readOnly
                  disabled
                />
                <span className="search-icon">🔍</span>
              </div>
              
              <Link to="/cart" className="cart-link">
                <span className="cart-icon">🛒</span>
                <li className="nav-item">
                  <Link to="/profile" className="nav-link">корзина</Link>
                </li>
                {basketCount > 0 && (
                <span className="cart-count">{basketCount}</span>
              )}
              </Link>
            </div>
          </div>
          
          <div className="catalog-hero">
            <h1 className="catalog-title">ЧЕБУРЕЧНАЯ</h1>
            <p className="catalog-subtitle">
              {apiStatus === 'checking' ? 'Проверяем подключение к API...' : 'Загрузка меню...'}
            </p>
          </div>
        </header>

        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Загружаем свежие продукты из базы данных...</p>
          <p className="text-light">Пожалуйста, подождите</p>
          {apiStatus === 'offline' && (
            <div className="api-error">
              <p>API временно недоступен. Используем локальные данные...</p>
              <button onClick={loadTestData} className="test-data-btn">
                Загрузить тестовые данные сейчас
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="catalog-page">
      
      <header className="catalog-header">
        <div className="header-container">
          <div className="header-logo">
            <span className="logo-text">ЧЕБУРЕЧНАЯ</span>
          </div>
          
          <nav className="header-nav">
            <ul className="nav-list">
              <li className="nav-item">
                <Link to="/" className="nav-link">главная</Link>
              </li>
              <li className="nav-item">
                <Link to="/catalog" className="nav-link active">каталог</Link>
              </li>
              <li className="nav-item">
                <Link to="/about" className="nav-link">о нас</Link>
              </li>
            </ul>
          </nav>
          
          <div className="header-actions">
            <div className="search-container">
              <input
                type="text"
                placeholder="Поиск..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Поиск продуктов"
              />
              <span className="search-icon">🔍</span>
              {searchQuery && (
                <button 
                  className="clear-search-button"
                  onClick={handleClearSearch}
                  aria-label="Очистить поиск"
                >
                  ✕
                </button>
              )}
            </div>
            
            <Link to="/cart" className="cart-link-page">
              <span className="cart-icon">🛒</span>
              <span className="cart-text">корзина</span>
              {basketCount > 0 && (
                <span className="cart-count">{basketCount}</span>
              )}
            </Link>
          </div>
        </div>

        <div className="catalog-hero">
          <h1 className="catalog-title">ЧЕБУРЕЧНАЯ</h1>
          <p className="catalog-subtitle">
            {apiStatus === 'online' 
              ? `${stats.total} свежих продуктов из базы данных`
              : 'Работаем в офлайн режиме'}
          </p>
        </div>
      </header>

      <main className="catalog-main">
        <div className="container">
          
          <div className="control-panel">
            <div className="control-group">
              <button 
                className="refresh-button" 
                onClick={handleRefresh}
                disabled={loading}
              >
                {loading ? '⏳ Загрузка...' : '🔄 Обновить из API'}
              </button>
              
              <div className="api-status">
                <span className={`status-indicator ${apiStatus}`}>
                  {apiStatus === 'online' ? '✅ API онлайн' : 
                   apiStatus === 'offline' ? '⚠️ API офлайн' : 
                   '⏳ Проверка...'}
                </span>
              </div>
            </div>
            
            <div className="control-group">
              <div className="filter-control">
                <label htmlFor="category-filter" className="filter-label">
                  Категория:
                </label>
                <select
                  id="category-filter"
                  className="filter-select"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'Все категории' : category}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="filter-control">
                <label htmlFor="sort-filter" className="filter-label">
                  Сортировка:
                </label>
                <select
                  id="sort-filter"
                  className="filter-select"
                  value={sortBy}
                  onChange={handleSortChange}
                >
                  <option value="default">По умолчанию</option>
                  <option value="price-asc">Цена (по возрастанию)</option>
                  <option value="price-desc">Цена (по убыванию)</option>
                  <option value="calories-asc">Калории (по возрастанию)</option>
                  <option value="calories-desc">Калории (по убыванию)</option>
                  <option value="name-asc">Название (А-Я)</option>
                  <option value="name-desc">Название (Я-А)</option>
                  <option value="rating-desc">По рейтингу</option>
                </select>
              </div>
            </div>
            
            <div className="control-group">
              <div className="products-counter">
                <span className="counter-item">
                  Всего: <strong>{stats.total}</strong>
                </span>
                <span className="counter-item">
                  Найдено: <strong>{stats.filtered}</strong>
                </span>
                <span className="counter-item">
                  Доступно: <strong>{stats.available}</strong>
                </span>
              </div>
              
              {basketCount > 0 && (
                <button 
                  className="clear-basket-button"
                  onClick={handleClearBasket}
                  title="Очистить корзину"
                >
                  🗑️ Очистить корзину
                </button>
              )}
            </div>
            
            {error && (
              <div className="api-error">
                <div className="error-content">
                  <span className="error-icon">⚠️</span>
                  <div className="error-text">
                    <strong>Ошибка API:</strong> {error}
                  </div>
                </div>
                <button onClick={loadTestData} className="test-data-btn">
                  Использовать локальные данные
                </button>
              </div>
            )}
          </div>

          <div className="products-catalog-grid">
            {filteredProducts.map((product, index) => {
              const selectedSizeId = selectedSizes[product.id];
              const selectedSize = product.variants?.find(v => v.id === selectedSizeId);
              
              return (
                <div 
                  key={`${product.id}_${index}`} 
                  className={`product-card-catalog ${!product.isAvailable ? 'unavailable' : ''}`}
                >
                  {!product.isAvailable && (
                    <div className="unavailable-badge">
                      Нет в наличии
                    </div>
                  )}
                  
                  {product.rating >= 4.5 && (
                    <div className="popular-badge">
                      ⭐ Популярный
                    </div>
                  )}
                  
                  <div className="product-image-container">
                    <img 
                      src={product.image || product.imageUrl || PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length]} 
                      alt={product.name}
                      className="product-image-catalog"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = PLACEHOLDER_IMAGES[0];
                        e.target.alt = 'Изображение не загружено';
                      }}
                    />
                    <div className="calories-badge">
                      <span className="calories-icon">🔥</span>
                      <span className="calories-text">{product.calories} Кал</span>
                    </div>
                    
                    {product.cookTime && (
                      <div className="cook-time-badge">
                        ⏱️ {product.cookTime} мин
                      </div>
                    )}
                  </div>

                  <div className="product-info-catalog">
                    <div className="product-header">
                      <h2 className="product-name-catalog">{product.name}</h2>
                      {product.rating > 0 && (
                        <div className="product-rating">
                          <span className="rating-stars">
                            {'★'.repeat(Math.floor(product.rating))}
                            {'☆'.repeat(5 - Math.floor(product.rating))}
                          </span>
                          <span className="rating-value">{product.rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="product-category">
                      <span className="category-badge">{product.category}</span>
                    </div>
                    
                    <p className="product-description-catalog">
                      {product.description}
                    </p>
                    
                    <div className="product-details">
                      <div className="detail-item">
                        <span className="detail-label">Вес:</span>
                        <span className="detail-value">{product.weight} г</span>
                      </div>
                      
                      {product.tags && product.tags.length > 0 && (
                        <div className="product-tags">
                          {product.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="product-tag">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="size-selector">
                      <label className="size-label">Выберите размер:</label>
                      <div className="size-options">
                        {(product.variants || []).map(variant => (
                          <button
                            key={variant.id}
                            className={`size-option ${selectedSizes[product.id] === variant.id ? 'selected' : ''}`}
                            onClick={() => handleSizeSelect(product.id, variant.id)}
                            disabled={!product.isAvailable}
                            title={variant.description}
                          >
                            <span className="size-name">{variant.size}</span>
                            <span className="size-price">{variant.price} ₽</span>
                            <span className="size-weight">{variant.weight} г</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="product-footer-catalog">
                      <div className="price-info">
                        <span className="price-label">
                          {selectedSize ? 'Выбранная цена:' : 'Базовая цена:'}
                        </span>
                        <span className="price-amount">
                          {selectedSize ? `${selectedSize.price} ₽` : `${product.price} ₽`}
                        </span>
                        {selectedSize && (
                          <span className="size-hint">
                            Размер: {selectedSize.size} • {selectedSize.weight} г
                          </span>
                        )}
                      </div>
                      
                      <button 
                        className={`add-to-cart-catalog ${!selectedSizes[product.id] || !product.isAvailable ? 'disabled' : ''}`}
                        onClick={() => handleAddToBasket(product)}
                        disabled={!selectedSizes[product.id] || !product.isAvailable}
                        title={!selectedSizes[product.id] ? 'Выберите размер' : !product.isAvailable ? 'Продукт временно недоступен' : 'Добавить в корзину'}
                      >
                        <span className="button-text">
                          {!product.isAvailable ? 'Нет в наличии' : 
                           !selectedSizes[product.id] ? 'ВЫБЕРИТЕ РАЗМЕР' : 'В КОРЗИНУ'}
                        </span>
                        {product.isAvailable && selectedSizes[product.id] && (
                          <span className="button-icon">🛒</span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredProducts.length === 0 && searchQuery && (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h3>Ничего не найдено</h3>
              <p>По запросу "{searchQuery}" не найдено ни одного продукта</p>
              <button 
                className="clear-search"
                onClick={handleClearSearch}
              >
                Показать все продукты
              </button>
            </div>
          )}

          {products.length === 0 && !loading && (
            <div className="no-products">
              <div className="no-products-icon">😕</div>
              <h3>Продукты не найдены</h3>
              <p>В базе данных нет доступных продуктов</p>
              <div className="no-products-actions">
                <button onClick={handleRefresh} className="refresh-button">
                  Попробовать снова
                </button>
                <button onClick={loadTestData} className="test-data-btn">
                  Загрузить демо-данные
                </button>
              </div>
            </div>
          )}

          {filteredProducts.length > 0 && (
            <div className="stats-panel">
              <div className="stat-item">
                <span className="stat-label">Средняя цена:</span>
                <span className="stat-value">{stats.averagePrice} ₽</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Общая калорийность:</span>
                <span className="stat-value">{stats.totalCalories} Кал</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Недоступно:</span>
                <span className="stat-value">{stats.unavailable}</span>
              </div>
            </div>
          )}

        </div>
      </main>

      <section className="cafe-info">
        <div className="container">
          <h2 className="info-title">Реальные данные из базы</h2>
          <div className="info-content">
            <p>
              Все продукты загружаются напрямую из вашей базы данных через CheburechnayaAPI.
              Мы используем актуальные цены, описания и информацию о калорийности.
            </p>
            <p>
              <strong>API статус:</strong> {apiStatus === 'online' ? '🟢 Подключено' : '🔴 Офлайн'}
            </p>
            <p className="api-url">
              <strong>API URL:</strong> {API_BASE_URL}/products
            </p>
            <div className="info-tips">
              <h4>Советы по использованию:</h4>
              <ul>
                <li>Выберите размер перед добавлением в корзину</li>
                <li>Используйте поиск для быстрого нахождения продуктов</li>
                <li>Фильтруйте по категориям для удобной навигации</li>
                <li>Сортируйте продукты по цене, калориям или рейтингу</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <footer className="catalog-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>Техническая информация</h3>
              <p><strong>Backend:</strong> ASP.NET Core Web API</p>
              <p><strong>Frontend:</strong> React.js 18+</p>
              <p><strong>База данных:</strong> SQL Server / PostgreSQL</p>
              <p><strong>Стили:</strong> CSS3 с Flexbox/Grid</p>
            </div>
            <div className="footer-section">
              <h3>Статус системы</h3>
              <p><strong>API:</strong> {apiStatus === 'online' ? '🟢 Работает' : '🔴 Офлайн'}</p>
              <p><strong>Продуктов загружено:</strong> {products.length}</p>
              <p><strong>В корзине:</strong> {basketCount} товар(ов)</p>
              <p><strong>Версия:</strong> 1.0.0</p>
            </div>
            <div className="footer-section">
              <h3>Быстрые ссылки</h3>
              <ul className="footer-links">
                <li><Link to="/cart">🛒 Перейти в корзину</Link></li>
                <li><button onClick={handleRefresh}>🔄 Обновить данные</button></li>
                <li><Link to="/admin">⚙️ Панель администратора</Link></li>
                <li><Link to="/docs">📚 Документация API</Link></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} ЧЕБУРЕЧНАЯ. Все права защищены.</p>
            <p className="footer-note">
              Данные загружаются из CheburechnayaAPI. Обновлено: {new Date().toLocaleString('ru-RU')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CatalogPage;