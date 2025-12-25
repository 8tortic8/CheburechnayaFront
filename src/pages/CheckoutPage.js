import React, { useState, useEffect } from 'react';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    deliveryType: 'pickup', 
    paymentType: 'cash', 
    comment: ''
  });
  
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  const validatePhone = (phone) => {
    if (!phone) return false;
    
    const cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.length === 11 && (cleaned.startsWith('7') || cleaned.startsWith('8'))) {
      return true;
    }
    
    return false;
  };

  const formatPhone = (phone) => {
    if (!phone) return '';
    
    const cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.length === 11 && (cleaned.startsWith('7') || cleaned.startsWith('8'))) {
      return `+7 (${cleaned.substring(1, 4)}) ${cleaned.substring(4, 7)}-${cleaned.substring(7, 9)}-${cleaned.substring(9, 11)}`;
    }
    
    return phone;
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value;
    
    let digits = value.replace(/\D/g, '');
    
    if (digits.length > 11) {
      digits = digits.substring(0, 11);
    }
    
    if (digits.length === 0) {
      value = '';
      setPhoneError('');
    } else if (digits.startsWith('7')) {
      let formatted = '+7';
      if (digits.length > 1) {
        formatted += ` (${digits.substring(1, 4)}`;
      }
      if (digits.length > 4) {
        formatted += `) ${digits.substring(4, 7)}`;
      }
      if (digits.length > 7) {
        formatted += `-${digits.substring(7, 9)}`;
      }
      if (digits.length > 9) {
        formatted += `-${digits.substring(9, 11)}`;
      }
      value = formatted;
      
      if (digits.length === 11) {
        setPhoneError('');
      } else {
        setPhoneError('Введите 11 цифр');
      }
    } else if (digits.startsWith('8')) {
      let formatted = '8';
      if (digits.length > 1) {
        formatted += ` (${digits.substring(1, 4)}`;
      }
      if (digits.length > 4) {
        formatted += `) ${digits.substring(4, 7)}`;
      }
      if (digits.length > 7) {
        formatted += `-${digits.substring(7, 9)}`;
      }
      if (digits.length > 9) {
        formatted += `-${digits.substring(9, 11)}`;
      }
      value = formatted;
      
      if (digits.length === 11) {
        setPhoneError('');
      } else {
        setPhoneError('Введите 11 цифр');
      }
    } else {
      value = digits;
      setPhoneError('Номер должен начинаться с 7 или 8');
    }
    
    setFormData(prev => ({
      ...prev,
      phone: value
    }));
  };

  useEffect(() => {
    const loadCheckoutData = async () => {
      try {
        const savedCart = localStorage.getItem('cheburechnaya_basket');
        if (savedCart) {
          setCartItems(JSON.parse(savedCart));
        }

        const mockEmployees = [
          { id: 1, name: 'Иванов Иван', position: 'Кассир' },
          { id: 2, name: 'Петрова Анна', position: 'Официант' },
          { id: 3, name: 'Сидоров Алексей', position: 'Менеджер' }
        ];
        
        setEmployees(mockEmployees);
        if (mockEmployees.length > 0) {
          setSelectedEmployee(mockEmployees[0].id);
        }
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCheckoutData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      handlePhoneChange(e);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      alert('Корзина пуста. Добавьте товары перед оформлением заказа.');
      return;
    }

    if (!formData.name || !formData.phone) {
      alert('Пожалуйста, заполните обязательные поля: Имя и Телефон');
      return;
    }

    if (!validatePhone(formData.phone)) {
      alert('Введите корректный российский номер телефона!\n\nФормат: +7 (999) 123-45-67\nили: 89991234567\n\n(11 цифр, начинается с 7 или 8)');
      return;
    }

    setSubmitting(true);

    try {
      const phoneForServer = formData.phone.replace(/\D/g, '');
      
      const orderData = {
        customer: {
          name: formData.name,
          phone: phoneForServer,
          email: formData.email,
          address: formData.address
        },
        orderDetails: {
          items: cartItems.map(item => ({
            productId: item.productId,
            productName: item.name,
            quantity: item.quantity,
            unitPrice: item.price,
            size: item.size
          })),
          totalAmount: calculateTotal(),
          deliveryType: formData.deliveryType,
          paymentType: formData.paymentType,
          employeeId: selectedEmployee,
          comment: formData.comment
        },
        timestamp: new Date().toISOString()
      };

      console.log('Данные для отправки:', orderData);

      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const orderId = Math.floor(Math.random() * 10000) + 1000;
      
      localStorage.removeItem('cheburechnaya_basket');
      
      alert(`Заказ №${orderId} успешно оформлен! Мы свяжемся с вами по номеру ${formatPhone(formData.phone)} для подтверждения.`);
      
      window.location.href = `/order-success/${orderId}`;
      
    } catch (error) {
      console.error('Ошибка оформления заказа:', error);
      alert('Произошла ошибка при оформлении заказа. Пожалуйста, попробуйте еще раз.');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePhoneBlur = () => {
    if (formData.phone && !validatePhone(formData.phone)) {
      setPhoneError('Введите корректный номер телефона');
    } else {
      setPhoneError('');
    }
  };

  if (loading) {
    return (
      <div className="checkout-page">
        <header className="checkout-header">
          <div className="header-container">
            <div className=".logo-text-page">
              <span className="logo-page-main">ЧЕБУРЕЧНАЯ</span>
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
                  <a href="/cart" className="nav-link">корзина</a>
                </li>
              </ul>
            </nav>
          </div>
          
          <div className="checkout-hero">
            <h1 className="checkout-title">ОФОРМЛЕНИЕ ЗАКАЗА</h1>
            <p className="checkout-subtitle">Подготовка данных...</p>
          </div>
        </header>

        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Загружаем данные для оформления...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <header className="checkout-header">
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
                  <a href="/cart" className="nav-link">корзина</a>
                </li>
              </ul>
            </nav>
          </div>
          
          <div className="checkout-hero">
            <h1 className="checkout-title">ОФОРМЛЕНИЕ ЗАКАЗА</h1>
          </div>
        </header>

        <div className="empty-cart-message">
          <h2>Корзина пуста</h2>
          <p>Для оформления заказа добавьте товары в корзину</p>
          <a href="/catalog" className="back-to-catalog-btn">
            Перейти в каталог
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <header className="checkout-header">
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
                <a href="/cart" className="nav-link">корзина</a>
              </li>
            </ul>
          </nav>
        </div>
        
        <div className="checkout-hero">
          <h1 className="checkout-title">ОФОРМЛЕНИЕ ЗАКАЗА</h1>
          <p className="checkout-subtitle">
            Завершите оформление, чтобы получить ваш заказ
          </p>
        </div>
      </header>

      <main className="checkout-main">
        <div className="container">
          <div className="checkout-content">
            <div className="checkout-form-section">
              <h2 className="section-title">Контактная информация</h2>
              
              <form onSubmit={handleSubmitOrder} className="checkout-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">
                      Имя и фамилия <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Введите ваше имя"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="phone">
                      Телефон <span className="required">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      onBlur={handlePhoneBlur}
                      required
                      placeholder="+7 (999) 123-45-67"
                      pattern="^(\+7|8)[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$"
                      title="Формат: +7 (999) 123-45-67 или 89991234567"
                      className={phoneError ? 'input-error' : ''}
                    />
                    {phoneError && (
                      <div className="error-message">{phoneError}</div>
                    )}
                    <small className="phone-hint">
                      Формат: +7 (999) 123-45-67 или 89991234567
                    </small>
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="email@example.com"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="address">Адрес доставки</label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Укажите адрес, если нужна доставка"
                    />
                  </div>
                </div>
                
                <div className="form-group full-width">
                  <label htmlFor="employee">
                    Выберите сотрудника для обслуживания
                  </label>
                  <select
                    id="employee"
                    value={selectedEmployee}
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                    className="employee-select"
                  >
                    {employees.map(employee => (
                      <option key={employee.id} value={employee.id}>
                        {employee.name} ({employee.position})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group full-width">
                  <label>Способ получения</label>
                  <div className="delivery-options">
                    <label className="option-radio">
                      <input
                        type="radio"
                        name="deliveryType"
                        value="pickup"
                        checked={formData.deliveryType === 'pickup'}
                        onChange={handleInputChange}
                      />
                      <span className="radio-custom"></span>
                      <span className="option-label">
                        Самовывоз из ресторана
                        <span className="option-desc">Бесплатно, готово через 15 минут</span>
                      </span>
                    </label>
                    
                    <label className="option-radio">
                      <input
                        type="radio"
                        name="deliveryType"
                        value="delivery"
                        checked={formData.deliveryType === 'delivery'}
                        onChange={handleInputChange}
                      />
                      <span className="radio-custom"></span>
                      <span className="option-label">
                        Доставка курьером
                        <span className="option-desc">+150 ₽, 30-60 минут</span>
                      </span>
                    </label>
                  </div>
                </div>
                
                <div className="form-group full-width">
                  <label>Способ оплаты</label>
                  <div className="payment-options">
                    <label className="option-radio">
                      <input
                        type="radio"
                        name="paymentType"
                        value="cash"
                        checked={formData.paymentType === 'cash'}
                        onChange={handleInputChange}
                      />
                      <span className="radio-custom"></span>
                      <span className="option-label">
                        💵 Наличными при получении
                      </span>
                    </label>
                    
                    <label className="option-radio">
                      <input
                        type="radio"
                        name="paymentType"
                        value="card"
                        checked={formData.paymentType === 'card'}
                        onChange={handleInputChange}
                      />
                      <span className="radio-custom"></span>
                      <span className="option-label">
                        💳 Картой при получении
                      </span>
                    </label>
                  </div>
                </div>
                
                <div className="form-group full-width">
                  <label htmlFor="comment">Комментарий к заказу</label>
                  <textarea
                    id="comment"
                    name="comment"
                    value={formData.comment}
                    onChange={handleInputChange}
                    placeholder="Дополнительные пожелания, аллергии и т.д."
                    rows="4"
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="submit-order-btn"
                  disabled={submitting || !!phoneError}
                >
                  {submitting ? (
                    <>
                      <span className="spinner"></span>
                      Оформление заказа...
                    </>
                  ) : (
                    `ПОДТВЕРДИТЬ ЗАКАЗ НА ${calculateTotal()} ₽`
                  )}
                </button>
                
                <p className="form-note">
                  Нажимая кнопку, вы соглашаетесь с обработкой персональных данных
                </p>
              </form>
            </div>
            
            <div className="checkout-summary-section">
              <div className="summary-card">
                <h3 className="summary-title">Ваш заказ</h3>
                
                <div className="order-items-preview">
                  {cartItems.slice(0, 3).map((item, index) => (
                    <div key={index} className="order-item-preview">
                      <span className="item-name">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="item-price">
                        {item.price * item.quantity} ₽
                      </span>
                    </div>
                  ))}
                  
                  {cartItems.length > 3 && (
                    <div className="more-items">
                      + еще {cartItems.length - 3} товара(ов)
                    </div>
                  )}
                </div>
                
                <div className="summary-totals">
                  <div className="total-row">
                    <span>Товары:</span>
                    <span>{calculateTotal()} ₽</span>
                  </div>
                  
                  <div className="total-row">
                    <span>Доставка:</span>
                    <span>
                      {formData.deliveryType === 'delivery' ? '150 ₽' : 'Бесплатно'}
                    </span>
                  </div>
                  
                  <div className="total-divider"></div>
                  
                  <div className="total-row grand-total">
                    <span>Итого к оплате:</span>
                    <span className="grand-total-amount">
                      {formData.deliveryType === 'delivery' 
                        ? calculateTotal() + 150 
                        : calculateTotal()} ₽
                    </span>
                  </div>
                </div>
                
                <div className="order-tips">
                  <h4>Что дальше?</h4>
                  <ul>
                    <li>1. Подтвердите заказ</li>
                    <li>2. Мы свяжемся с вами для уточнения</li>
                    <li>3. Приготовим ваш заказ</li>
                    <li>4. Доставим или подготовим к самовывозу</li>
                  </ul>
                </div>
                
                <div className="contact-info">
                  <p>📞 Есть вопросы? Звоните: +7 (999) 123-45-67</p>
                  <p>🕒 Режим работы: ежедневно 9:00-22:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="checkout-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>Безопасная оплата</h3>
              <p>🔒 Ваши данные защищены</p>
              <p>💳 Принимаем карты и наличные</p>
            </div>
            
            <div className="footer-section">
              <h3>Гарантии</h3>
              <p>✅ Свежие продукты</p>
              <p>⏱️ Быстрая доставка</p>
              <p>👨‍🍳 Профессиональные повара</p>
            </div>
            
            <div className="footer-section">
              <h3>Возврат</h3>
              <p>🔄 Возврат в течение 24 часов</p>
              <p>📞 Контакт для возвратов: +7 (999) 987-65-43</p>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} ЧЕБУРЕЧНАЯ. Все права защищены.</p>
            <p className="footer-note">
              Оформляя заказ, вы принимаете условия пользовательского соглашения
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CheckoutPage;