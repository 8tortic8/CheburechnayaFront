import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

import heroBg1 from '../assets/images/hero-bq1.jpg'; 
import heroBg2 from '../assets/images/hero-bq2.jpg'; 
import heroBg3 from '../assets/images/hero-bq3.jpq.jpg'; 
import cardBg1 from '../assets/images/image-card.jpg';
import cardBg2 from '../assets/images/image-card2.jpg';
import cardBg3 from '../assets/images/image-card3.jpg';

const HomePage = () => {
  const isAdminAuthenticated = () => {
    const authData = localStorage.getItem('admin_auth');
    if (!authData) return false;
    try {
      const { isAuthenticated } = JSON.parse(authData);
      return isAuthenticated;
    } catch {
      return false;
    }
  };

  const getCartItemCount = () => {
    try {
      const basketData = localStorage.getItem('cheburechnaya_basket');
      if (!basketData) return 0;
      const basket = JSON.parse(basketData);
      return basket.reduce((total, item) => total + item.quantity, 0);
    } catch {
      return 0;
    }
  };

  const cartItemCount = getCartItemCount();

  return (
    <div className="home-page">
      <header className="header">
        <div className="header-container">
          <div className="logo-text-home">
           <span className="logo-home-main">чебуречная</span>
          </div>
          
          <nav className="header__nav">
            <ul className="nav__list">
              <li className="nav__item">
                <Link to="/" className="nav__link active">главная</Link>
              </li>
              <li className="nav__item">
                <Link to="/catalog" className="nav__link">каталог</Link>
              </li>
              <li className="nav__item">
                <Link to="/cart" className="nav__link cart-link">
                  корзина
                  {cartItemCount > 0 && (
                    <span className="cart-count">{cartItemCount}</span>
                  )}
                </Link>
              </li>
              <li className="nav__item">
                <Link to="/checkout" className="nav__link">оформление</Link>
              </li>
              <li className="nav__item">
                <Link to="/about" className="nav__link">о нас</Link>
              </li>
              <li className="nav__item">
                {isAdminAuthenticated() ? (
                  <Link to="/admin/dashboard" className="nav__link admin-link">
                    <span className="admin-icon">⚙️</span> админ
                  </Link>
                ) : (
                  <Link to="/admin/login" className="nav__link admin-link">
                    <span className="admin-icon">🔐</span> админ
                  </Link>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="main-content">
        <div className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">ЧЕБУРЕЧНАЯ</h1>
            <p className="hero-subtitle">Свежие чебуреки с доставкой на дом</p>
            
            <div className="quick-access">
              <Link to="/catalog" className="quick-btn primary">
                <span className="btn-icon">🛍️</span>
                <span className="btn-text">Смотреть каталог</span>
              </Link>
              <Link to="/cart" className="quick-btn secondary">
                <span className="btn-icon">🛒</span>
                <span className="btn-text">
                  Перейти в корзину
                  {cartItemCount > 0 && (
                    <span className="cart-badge">{cartItemCount}</span>
                  )}
                </span>
              </Link>
            </div>
          </div>
          
          <div className="hero-images">
            <div className="side-image">
              <img src={heroBg1} alt="Чебуреки ассорти" className="hero-img" />
              <div className="image-overlay">
                <p className="image-caption">Свежая выпечка</p>
              </div>
            </div>
            
            <div className="side-image">
              <img src={heroBg2} alt="Процесс готовки" className="hero-img" />
              <div className="image-overlay">
                <p className="image-caption">Готовим с любовью</p>
              </div>
            </div>
            
            <div className="side-image">
              <img src={heroBg3} alt="Чебурек крупным планом" className="hero-img" />
              <div className="image-overlay">
                <p className="image-caption">Хрустящая корочка</p>
              </div>
            </div>
          </div>
          
          <div className="background-image-wrapper">
            <div className="tilted-background"></div>
          </div>
        </div>

        <section className="content-section">
          <div className="container">
            <h2 className="section-title">Популярные начинки</h2>
            <p className="section-subtitle">Самые любимые чебуреки наших клиентов</p>
            
            <div className="products-grid">
              <div className="product-card">
                <div className="product-image-container">
                  <img src={cardBg1} alt="Чебурек с мясом" className="product-image" />
                  <div className="product-badge">🔥 Хит продаж</div>
                </div>
                <div className="product-info">
                  <h3 className="product-name">Чебурек с мясом</h3>
                  <p className="product-description">Сочная говядина со специями, луком и зеленью</p>
                  <div className="product-details">
                    <span className="product-weight">150 г</span>
                    <span className="product-calories">🔥 450 ккал</span>
                  </div>
                  <div className="product-footer">
                    <div className="product-price">120 ₽</div>
                    <Link to="/catalog" className="add-to-cart-btn">
                      <span className="btn-icon">🛒</span>
                      <span className="btn-text">В корзину</span>
                    </Link>
                  </div>
                </div>
              </div>
              
              <div className="product-card">
                <div className="product-image-container">
                  <img src={cardBg2} alt="Чебурек с сыром" className="product-image" />
                  <div className="product-badge vegetarian">🌿 Вегетарианский</div>
                </div>
                <div className="product-info">
                  <h3 className="product-name">Чебурек с сыром</h3>
                  <p className="product-description">Сыр сулугуни, зелень и специи в хрустящем тесте</p>
                  <div className="product-details">
                    <span className="product-weight">140 г</span>
                    <span className="product-calories">🔥 380 ккал</span>
                  </div>
                  <div className="product-footer">
                    <div className="product-price">110 ₽</div>
                    <Link to="/catalog" className="add-to-cart-btn">
                      <span className="btn-icon">🛒</span>
                      <span className="btn-text">В корзину</span>
                    </Link>
                  </div>
                </div>
              </div>
              
              <div className="product-card">
                <div className="product-image-container">
                  <img src={cardBg3} alt="Чебурек с картошкой" className="product-image" />
                  <div className="product-badge popular">⭐ Популярный</div>
                </div>
                <div className="product-info">
                  <h3 className="product-name">Чебурек с картошкой</h3>
                  <p className="product-description">Картофель с луком и зеленью по-домашнему</p>
                  <div className="product-details">
                    <span className="product-weight">130 г</span>
                    <span className="product-calories">🔥 320 ккал</span>
                  </div>
                  <div className="product-footer">
                    <div className="product-price">100 ₽</div>
                    <Link to="/catalog" className="add-to-cart-btn">
                      <span className="btn-icon">🛒</span>
                      <span className="btn-text">В корзину</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="view-all-container">
              <Link to="/catalog" className="view-all-btn">
                <span className="btn-text">Посмотреть все товары</span>
                <span className="btn-arrow">→</span>
              </Link>
            </div>
          </div>
        </section>

        <section className="features-section">
          <div className="container">
            <h2 className="section-title">Почему выбирают нас</h2>
            <p className="section-subtitle">Лучшее качество и сервис для наших клиентов</p>
            
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">🚚</div>
                <h3 className="feature-title">Быстрая доставка</h3>
                <p className="feature-description">Доставляем за 30-60 минут в любое время дня. Бесплатная доставка при заказе от 500 ₽.</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">🔥</div>
                <h3 className="feature-title">Всегда свежие</h3>
                <p className="feature-description">Готовим только после получения вашего заказа. Никаких заготовок и разморозки.</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">💰</div>
                <h3 className="feature-title">Доступные цены</h3>
                <p className="feature-description">Качественные продукты по оптимальным ценам. Акции и скидки постоянным клиентам.</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">👨‍🍳</div>
                <h3 className="feature-title">Опытные повара</h3>
                <p className="feature-description">Готовят по традиционным рецептам с 2010 года. Собственные секреты приготовления.</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">🏆</div>
                <h3 className="feature-title">Гарантия качества</h3>
                <p className="feature-description">Используем только свежие продукты от проверенных поставщиков. Контроль на каждом этапе.</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">🔄</div>
                <h3 className="feature-title">Легкий возврат</h3>
                <p className="feature-description">Если что-то не понравилось - вернем деньги. Нам важно ваше доверие и удовлетворение.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="container">
            <div className="cta-content">
              <h2 className="cta-title">Готовы заказать вкусные чебуреки?</h2>
              <p className="cta-description">
                Выберите любимые начинки, оформите заказ и мы доставим их к вам горячими и свежими!
                Более 1000 довольных клиентов каждый месяц.
              </p>
              
              <div className="cta-stats">
                <div className="stat-item">
                  <div className="stat-number">1,000+</div>
                  <div className="stat-label">довольных клиентов</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">30</div>
                  <div className="stat-label">минут доставка</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">24/7</div>
                  <div className="stat-label">принимаем заказы</div>
                </div>
              </div>
              
              <div className="cta-buttons">
                <Link to="/catalog" className="cta-btn primary">
                  <span className="btn-icon">🛍️</span>
                  <span className="btn-text">Выбрать чебуреки</span>
                </Link>
                <Link to="/checkout" className="cta-btn secondary">
                  <span className="btn-icon">⚡</span>
                  <span className="btn-text">Быстрый заказ</span>
                </Link>
                {!isAdminAuthenticated() && (
                  <Link to="/admin/login" className="cta-btn outline">
                    <span className="btn-icon">👨‍🍳</span>
                    <span className="btn-text">Для персонала</span>
                  </Link>
                )}
              </div>
              
              <div className="cta-info">
                <div className="info-item">
                  <span className="info-icon">📞</span>
                  <span className="info-text">Звоните: +7 (999) 123-45-67</span>
                </div>
                <div className="info-item">
                  <span className="info-icon">🕒</span>
                  <span className="info-text">Работаем: ежедневно 9:00-22:00</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="footer-logo">
                <span className="logo-text">ЧЕБУРЕЧНАЯ</span>
                <p className="logo-tagline">Свежие и вкусные чебуреки с 2010 года</p>
              </div>
              <div className="footer-contacts">
                <div className="contact-item">
                  <span className="contact-icon">📍</span>
                  <span className="contact-text">ул. Пушкина, д. Колотушкина</span>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">📞</span>
                  <span className="contact-text">+7 (999) 123-45-67</span>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">✉️</span>
                  <span className="contact-text">order@cheburechnaya.ru</span>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">🕒</span>
                  <span className="contact-text">Ежедневно 9:00-22:00</span>
                </div>
              </div>
            </div>
            
            <div className="footer-section">
              <h3 className="footer-title">Навигация</h3>
              <ul className="footer-links">
                <li><Link to="/" className="footer-link">🏠 Главная</Link></li>
                <li><Link to="/catalog" className="footer-link">🛍️ Каталог</Link></li>
                <li><Link to="/cart" className="footer-link">🛒 Корзина {cartItemCount > 0 && `(${cartItemCount})`}</Link></li>
                <li><Link to="/checkout" className="footer-link">📝 Оформление</Link></li>
                <li><Link to="/about" className="footer-link">📖 О нас</Link></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h3 className="footer-title">Категории</h3>
              <ul className="footer-links">
                <li><Link to="/catalog?category=Мясные" className="footer-link">🥩 Мясные чебуреки</Link></li>
                <li><Link to="/catalog?category=Сырные" className="footer-link">🧀 Сырные чебуреки</Link></li>
                <li><Link to="/catalog?category=Овощные" className="footer-link">🥔 Овощные чебуреки</Link></li>
                <li><Link to="/catalog?category=Грибные" className="footer-link">🍄 Грибные чебуреки</Link></li>
                <li><Link to="/catalog?category=Акция" className="footer-link">🔥 Товары со скидкой</Link></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h3 className="footer-title">Полезные ссылки</h3>
              <ul className="footer-links">
                <li><Link to="/delivery" className="footer-link">🚚 Доставка и оплата</Link></li>
                <li><Link to="/contacts" className="footer-link">📞 Контакты</Link></li>
                <li><Link to="/faq" className="footer-link">❓ FAQ</Link></li>
                <li><Link to="/reviews" className="footer-link">⭐ Отзывы</Link></li>
                {isAdminAuthenticated() ? (
                  <li><Link to="/admin/dashboard" className="footer-link admin">⚙️ Админ панель</Link></li>
                ) : (
                  <li><Link to="/admin/login" className="footer-link admin">🔐 Вход для персонала</Link></li>
                )}
              </ul>
            </div>
          </div>
          
          <div className="footer-bottom">
            <div className="copyright">
              © {new Date().getFullYear()} ЧЕБУРЕЧНАЯ. Все права защищены.
              <span className="copyright-note">ИП Чупракова Д.А. ОГРНИП 123456789012345</span>
            </div>
            
            <div className="footer-social">
              <a href="https://vk.com" className="social-link" target="_blank" rel="noopener noreferrer">📱 VK</a>
              <a href="https://instagram.com" className="social-link" target="_blank" rel="noopener noreferrer">📸 Instagram</a>
              <a href="https://telegram.org" className="social-link" target="_blank" rel="noopener noreferrer">✈️ Telegram</a>
              <a href="https://whatsapp.com" className="social-link" target="_blank" rel="noopener noreferrer">💬 WhatsApp</a>
            </div>
            
            <div className="payment-methods">
              <span className="payment-text">Принимаем к оплате:</span>
              <div className="payment-icons">
                <span className="payment-icon">💳</span>
                <span className="payment-icon">💵</span>
                <span className="payment-icon">📱</span>
                <span className="payment-icon">🏦</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;