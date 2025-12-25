import React, { useState, useEffect } from 'react';
import './CartPage.css';

import cheburekWithMeat from '../assets/images/cheburek-with-meat.jpg';
import cheburekWithCheese from '../assets/images/cheburek-with-cheese.jpg';
import cheburekWithPotatoes from '../assets/images/cheburek-with-potatoes.jpg';
import samsaWithChicken from '../assets/images/samsa-with-chicken.jpg';
import pizzaMargherita from '../assets/images/pizza-margherita.jpg';
import greekSalad from '../assets/images/greek-salad.jpg';
import coffeeLatte from '../assets/images/coffee-latte.jpg';
import blackTea from '../assets/images/black-tea.jpg';
import orangeJuice from '../assets/images/orange-juice.jpg';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const DEFAULT_IMAGES = [
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

  const getProductImage = (productName) => {
    const imageMap = {
      'Чебурек с мясом': cheburekWithMeat,
      'Чебурек с сыром': cheburekWithCheese,
      'Чебурек с картошкой': cheburekWithPotatoes,
      'Самса с курицей': samsaWithChicken,
      'Пицца Маргарита': pizzaMargherita,
      'Греческий салат': greekSalad,
      'Кофе Латте': coffeeLatte,
      'Черный чай': blackTea,
      'Апельсиновый сок': orangeJuice
    };
    return imageMap[productName] || DEFAULT_IMAGES[0];
  };

  useEffect(() => {
    const loadCart = () => {
      try {
        const savedCart = localStorage.getItem('cheburechnaya_basket');
        if (savedCart) {
          setCartItems(JSON.parse(savedCart));
        }
      } catch (error) {
        console.error('Ошибка загрузки корзины:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
    
    window.addEventListener('storage', loadCart);
    return () => window.removeEventListener('storage', loadCart);
  }, []);

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeItem(itemId);
      return;
    }

    const updatedCart = cartItems.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    
    setCartItems(updatedCart);
    localStorage.setItem('cheburechnaya_basket', JSON.stringify(updatedCart));
  };

  const removeItem = (itemId) => {
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCart);
    localStorage.setItem('cheburechnaya_basket', JSON.stringify(updatedCart));
  };

  const clearCart = () => {
    if (window.confirm('Вы уверены, что хотите очистить корзину?')) {
      setCartItems([]);
      localStorage.removeItem('cheburechnaya_basket');
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const proceedToCheckout = () => {
    if (cartItems.length === 0) {
      alert('Корзина пуста. Добавьте товары перед оформлением заказа.');
      return;
    }
    window.location.href = '/checkout';
  };

  if (loading) {
    return (
      <div className="cart-page">
        <header className="cart-header">
          <div className="header-container">
            <div className="header-logo">
              <span className="logo-text">ЧЕБУРЕЧНАЯ</span>
            </div>
            
            <nav className="header-nav">
              <ul className="nav-list">
                <li className="nav-item">
                  <a href="/" className="nav-link">главная</a>
                </li>
                <li className="nav-item">
                  <a href="/catalog" className="nav-link">каталог</a>
                </li>
                <li className="nav-item">
                  <a href="/about" className="nav-link">о нас</a>
                </li>
                <li className="nav-item">
                  <a href="/cart" className="nav-link active">корзина</a>
                </li>
              </ul>
            </nav>
          </div>
          
          <div className="cart-hero">
            <h1 className="cart-title">КОРЗИНА</h1>
            <p className="cart-subtitle">Загрузка ваших товаров...</p>
          </div>
        </header>

        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Загружаем корзину...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <header className="cart-header">
        <div className="header-container">
          <div className="header-logo">
            <span className="logo-text">ЧЕБУРЕЧНАЯ</span>
          </div>
          
          <nav className="header-nav">
            <ul className="nav-list">
              <li className="nav-item">
                <a href="/" className="nav-link">главная</a>
              </li>
              <li className="nav-item">
                <a href="/catalog" className="nav-link">каталог</a>
              </li>
              <li className="nav-item">
                <a href="/about" className="nav-link">о нас</a>
              </li>
              <li className="nav-item">
                <a href="/cart" className="nav-link active">корзина</a>
              </li>
            </ul>
          </nav>
        </div>
        
        <div className="cart-hero">
          <h1 className="cart-title">КОРЗИНА</h1>
          <p className="cart-subtitle">
            {cartItems.length > 0 
              ? `${calculateItemCount()} товаров на сумму ${calculateTotal()} ₽`
              : 'Ваша корзина пуста'}
          </p>
        </div>
      </header>

      <main className="cart-main">
        <div className="container">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">🛒</div>
              <h2>Корзина пуста</h2>
              <p>Добавьте товары из каталога, чтобы оформить заказ</p>
              <a href="/catalog" className="back-to-catalog-btn">
                Перейти в каталог
              </a>
            </div>
          ) : (
            <div className="cart-content">
              <div className="cart-items-section">
                <div className="cart-header-row">
                  <h2>Товары в корзине</h2>
                  <button 
                    className="clear-cart-btn"
                    onClick={clearCart}
                  >
                    🗑️ Очистить корзину
                  </button>
                </div>
                
                <div className="cart-items-list">
                  {cartItems.map((item, index) => {
                    const itemImage = item.image || getProductImage(item.name) || DEFAULT_IMAGES[index % DEFAULT_IMAGES.length];
                    
                    return (
                      <div key={item.id} className="cart-item-card">
                        <div className="cart-item-image">
                          <img 
                            src={itemImage} 
                            alt={item.name}
                            onError={(e) => {
                              e.target.src = DEFAULT_IMAGES[0];
                              e.target.alt = 'Изображение не загружено';
                            }}
                          />
                        </div>
                        
                        <div className="cart-item-info">
                          <h3 className="cart-item-name">{item.name}</h3>
                          <div className="cart-item-details">
                            <span className="cart-item-size">Размер: {item.size}</span>
                            <span className="cart-item-weight">{item.weight} г</span>
                            {item.calories && (
                              <span className="cart-item-calories">🔥 {item.calories} Кал</span>
                            )}
                          </div>
                          
                          <div className="cart-item-price">
                            <span className="price-label">Цена:</span>
                            <span className="price-amount">{item.price} ₽</span>
                          </div>
                        </div>
                        
                        <div className="cart-item-controls">
                          <div className="quantity-control">
                            <button 
                              className="quantity-btn minus"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              −
                            </button>
                            <span className="quantity-value">{item.quantity}</span>
                            <button 
                              className="quantity-btn plus"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              +
                            </button>
                          </div>
                          
                          <div className="cart-item-total">
                            <span className="total-label">Сумма:</span>
                            <span className="total-amount">{item.price * item.quantity} ₽</span>
                          </div>
                          
                          <button 
                            className="remove-item-btn"
                            onClick={() => removeItem(item.id)}
                            title="Удалить из корзины"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="cart-summary-section">
                <div className="summary-card">
                  <h3 className="summary-title">Сводка заказа</h3>
                  
                  <div className="summary-details">
                    <div className="summary-row">
                      <span>Товары ({calculateItemCount()} шт.)</span>
                      <span>{calculateTotal()} ₽</span>
                    </div>
                    
                    <div className="summary-row">
                      <span>Доставка</span>
                      <span>Бесплатно</span>
                    </div>
                    
                    <div className="summary-divider"></div>
                    
                    <div className="summary-row total-row">
                      <span>Итого к оплате</span>
                      <span className="total-amount">{calculateTotal()} ₽</span>
                    </div>
                  </div>
                  
                  <button 
                    className="checkout-btn"
                    onClick={proceedToCheckout}
                  >
                    ПЕРЕЙТИ К ОФОРМЛЕНИЮ
                  </button>
                  
                  <p className="secure-payment">
                    🔒 Безопасная оплата. Ваши данные защищены
                  </p>
                  
                  <div className="continue-shopping">
                    <a href="/catalog" className="continue-link">
                      ← Продолжить покупки
                    </a>
                  </div>
                </div>
                
                <div className="cart-tips">
                  <h4>Полезные советы:</h4>
                  <ul>
                    <li>Заказ будет готов через 15-20 минут</li>
                    <li>Бесплатная доставка при заказе от 500 ₽</li>
                    <li>Вы можете забрать заказ самостоятельно</li>
                    <li>Оплата наличными или картой при получении</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="cart-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>ЧЕБУРЕЧНАЯ</h3>
              <p>Свежие чебуреки с любовью</p>
              <p>Ежедневно с 9:00 до 22:00</p>
            </div>
            
            <div className="footer-section">
              <h3>Контактная информация</h3>
              <p>📞 +7 (999) 123-45-67</p>
              <p>📍 ул. Пушкина, д. Колотушкина</p>
              <p>✉️ info@cheburechnaya.ru</p>
            </div>
            
            <div className="footer-section">
              <h3>Быстрые ссылки</h3>
              <ul className="footer-links">
                <li><a href="/catalog">🛍️ Каталог</a></li>
                <li><a href="/delivery">🚚 Доставка</a></li>
                <li><a href="/about">📖 О нас</a></li>
                <li><a href="/contacts">📞 Контакты</a></li>
              </ul>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} ЧЕБУРЕЧНАЯ. Все права защищены.</p>
            <p className="footer-note">
              Товаров в корзине: {calculateItemCount()} | Общая сумма: {calculateTotal()} ₽
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CartPage;