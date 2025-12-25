import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const API_BASE_URL = 'http://localhost:5023';
  
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalProducts: 0,
    lowStockProducts: 0,
    todayOrders: 0,
    monthlyRevenue: 0
  });
  
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [apiAvailable, setApiAvailable] = useState(true);
  const [lastUpdate, setLastUpdate] = useState('');

  useEffect(() => {
    const authData = localStorage.getItem('admin_auth');
    if (!authData) {
      window.location.href = '/admin/login';
      return;
    }
    
    try {
      const auth = JSON.parse(authData);
      setUserInfo(auth);
    } catch (error) {
      window.location.href = '/admin/login';
    }
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      const statsResponse = await fetch(`${API_BASE_URL}/api/dashboard/stats`);
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }
      
      const ordersResponse = await fetch(`${API_BASE_URL}/api/dashboard/recent-orders`);
      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json();
        setRecentOrders(ordersData);
      }
      
      const productsResponse = await fetch(`${API_BASE_URL}/api/dashboard/popular-products`);
      if (productsResponse.ok) {
        const productsData = await productsResponse.json();
        setTopProducts(productsData);
      }
      
      setApiAvailable(true);
      setLastUpdate(new Date().toLocaleTimeString('ru-RU'));
      
    } catch (error) {
      console.log('Ошибка загрузки данных:', error);
      setApiAvailable(false);
      
      setStats({
        totalOrders: 4,
        totalRevenue: 2480,
        pendingOrders: 1,
        completedOrders: 2,
        totalProducts: 9,
        lowStockProducts: 0,
        todayOrders: 0,
        monthlyRevenue: 0
      });
      
      setRecentOrders([
        { id: 1, customer: 'Иван Петров', amount: 1250, status: 'Completed', time: '10:30' },
        { id: 2, customer: 'Мария Сидорова', amount: 890, status: 'Completed', time: '09:45' },
        { id: 3, customer: 'Алексей Иванов', amount: 340, status: 'Pending', time: '09:15' }
      ]);
      
      setTopProducts([
        { productId: 1, productName: 'Чебурек с мясом', salesCount: 45, revenue: 6750 },
        { productId: 2, productName: 'Чебурек с сыром', salesCount: 38, revenue: 5320 },
        { productId: 3, productName: 'Пицца Маргарита', salesCount: 22, revenue: 9900 }
      ]);
      
      setLastUpdate(new Date().toLocaleTimeString('ru-RU'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo) {
      loadDashboardData();
      
      const interval = setInterval(loadDashboardData, 30000);
      return () => clearInterval(interval);
    }
  }, [userInfo]);

  const handleLogout = () => {
    if (window.confirm('Вы уверены, что хотите выйти?')) {
      localStorage.removeItem('admin_auth');
      window.location.href = '/admin/login';
    }
  };

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  const formatCurrency = (amount) => {
    return `${formatNumber(amount)} ₽`;
  };

  const handleRefresh = async () => {
    await loadDashboardData();
  };

  if (loading) {
    return (
      <div className="ad-dashboard-container">
        <header className="ad-header">
          <div className="ad-header-container">
            <div className="ad-dashboard-logo">
              <span className="ad-logo-main">ЧЕБУРЕЧНАЯ</span>
              <span className="ad-logo-subtext">АДМИН ПАНЕЛЬ</span>
            </div>
          </div>
        </header>
        
        <div className="ad-loading-container">
          <div className="ad-loading-spinner"></div>
          <p>{apiAvailable ? 'Загрузка данных с сервера...' : 'Загрузка тестовых данных...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ad-dashboard-container">
      <header className="ad-header">
        <div className="ad-header-container">
          <div className="ad-dashboard-logo">
            <span className="ad-logo-main">ЧЕБУРЕЧНАЯ</span>
            <span className="ad-logo-subtext">АДМИН ПАНЕЛЬ</span>
          </div>
          
          <div className="ad-header-user">
            <div className="ad-user-info">
              <span className="ad-user-name">
                {userInfo?.fullName || userInfo?.username || 'Администратор'}
              </span>
              <span className="ad-user-role">
                {userInfo?.role === 'manager' ? '👔 Менеджер' : 
                 userInfo?.role === 'cook' ? '👨‍🍳 Повар' :
                 userInfo?.role === 'waiter' ? '💼 Официант' :
                 userInfo?.role === 'cashier' ? '💵 Кассир' :
                 userInfo?.role === 'buyer' ? '📦 Закупщик' : 'Сотрудник'}
              </span>
              <span className="ad-api-status-indicator">
                {apiAvailable ? '🟢 API онлайн' : '🟡 Тестовый режим'}
              </span>
            </div>
            <button className="ad-logout-btn" onClick={handleLogout}>
              Выйти
            </button>
          </div>
        </div>
        
        <nav className="ad-nav-container">
          <ul className="ad-nav-list">
            <li className="ad-nav-item">
              <a href="/admin/dashboard" className="ad-nav-link active">
                📊 Дашборд
              </a>
            </li>
            <li className="ad-nav-item">
              <a href="/admin/orders" className="ad-nav-link">
                📋 Заказы
              </a>
            </li>
            <li className="ad-nav-item">
              <a href="/admin/products" className="ad-nav-link">
                🛒 Товары
              </a>
            </li>
            <li className="ad-nav-item">
              <a href="/admin/deliveries" className="ad-nav-link">
                🚚 Поставки
              </a>
            </li>
            <li className="ad-nav-item">
              <a href="/admin/employees" className="ad-nav-link">
                👥 Сотрудники
              </a>
            </li>
          </ul>
        </nav>
      </header>

      <main className="ad-main-content">
        <div className="ad-container">
          <div className="ad-dashboard-welcome">
            <div className="ad-welcome-header">
              <div>
                <h1 className="ad-welcome-title">Добро пожаловать, {userInfo?.fullName || userInfo?.username || 'Администратор'}!</h1>
                <p className="ad-welcome-subtitle">
                  Обзор статистики и ключевых показателей
                </p>
              </div>
              <button className="ad-refresh-btn" onClick={handleRefresh}>
                🔄 Обновить данные
              </button>
            </div>
            
            <div className="ad-current-time">
              <span className="ad-time-label">Текущее время:</span>
              <span className="ad-time-value">{new Date().toLocaleString('ru-RU')}</span>
              <span className="ad-time-label">Последнее обновление:</span>
              <span className="ad-time-value">{lastUpdate || 'Только что'}</span>
              <span className={`ad-data-source ${apiAvailable ? 'api-online' : 'api-offline'}`}>
                {apiAvailable ? '📡 Данные с сервера' : '💻 Тестовые данные'}
              </span>
            </div>
          </div>

          <div className="ad-stats-grid">
            <div className="ad-stat-card revenue">
              <div className="ad-stat-icon">💰</div>
              <div className="ad-stat-info">
                <h3 className="ad-stat-title">Общая выручка</h3>
                <p className="ad-stat-value">{formatCurrency(stats.totalRevenue)}</p>
                <div className="ad-stat-details">
                  <span className="ad-stat-detail">За сегодня: {formatCurrency(stats.monthlyRevenue / 30)}</span>
                  <span className="ad-stat-detail">За месяц: {formatCurrency(stats.monthlyRevenue)}</span>
                </div>
              </div>
            </div>
            
            <div className="ad-stat-card orders">
              <div className="ad-stat-icon">📋</div>
              <div className="ad-stat-info">
                <h3 className="ad-stat-title">Всего заказов</h3>
                <p className="ad-stat-value">{formatNumber(stats.totalOrders)}</p>
                <div className="ad-stat-details">
                  <span className="ad-stat-detail">Завершено: {formatNumber(stats.completedOrders)}</span>
                  <span className="ad-stat-detail">Сегодня: {formatNumber(stats.todayOrders)}</span>
                </div>
              </div>
            </div>
            
            <div className="ad-stat-card pending">
              <div className="ad-stat-icon">⏳</div>
              <div className="ad-stat-info">
                <h3 className="ad-stat-title">Ожидают обработки</h3>
                <p className="ad-stat-value">{formatNumber(stats.pendingOrders)}</p>
                <div className="ad-stat-details">
                  <span className="ad-stat-detail warning">
                    {stats.pendingOrders > 5 ? '⚠️ Требуется внимание' : '✅ Все под контролем'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="ad-stat-card products">
              <div className="ad-stat-icon">🛒</div>
              <div className="ad-stat-info">
                <h3 className="ad-stat-title">Товары</h3>
                <p className="ad-stat-value">{formatNumber(stats.totalProducts)}</p>
                <div className="ad-stat-details">
                  <span className="ad-stat-detail">
                    {stats.lowStockProducts > 0 
                      ? `⚠️ ${stats.lowStockProducts} с низким запасом`
                      : `✅ ${stats.totalProducts - (stats.lowStockProducts || 0)} с полным запасом`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="ad-dashboard-sections">
            <div className="ad-section-card recent-orders">
              <div className="ad-section-header">
                <h2 className="ad-section-title">Последние заказы</h2>
                <div className="ad-section-header-right">
                  <a href="/admin/orders" className="ad-section-link">
                    Посмотреть все →
                  </a>
                </div>
              </div>
              
              <div className="ad-orders-table">
                {recentOrders.length === 0 ? (
                  <div className="ad-no-data">
                    <p>Нет данных о заказах</p>
                  </div>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>ID заказа</th>
                        <th>Клиент</th>
                        <th>Сумма</th>
                        <th>Статус</th>
                        <th>Время</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map(order => (
                        <tr key={order.id}>
                          <td className="ad-order-id">#{order.id}</td>
                          <td className="ad-order-customer">{order.customer}</td>
                          <td className="ad-order-amount">{formatCurrency(order.amount)}</td>
                          <td className={`ad-order-status ad-status-${order.status.toLowerCase()}`}>
                            {order.status === 'Pending' ? '⏳ Ожидает' :
                             order.status === 'Processing' ? '🔄 В обработке' :
                             order.status === 'Completed' ? '✅ Завершен' : order.status}
                          </td>
                          <td className="ad-order-time">{order.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            <div className="ad-section-card system-info">
              <div className="ad-section-header">
                <h2 className="ad-section-title">Системная информация</h2>
              </div>
              
              <div className="ad-system-stats">
                <div className="ad-system-stat">
                  <span className="ad-stat-label">Версия системы:</span>
                  <span className="ad-stat-value">1.0.0</span>
                </div>
                
                <div className="ad-system-stat">
                  <span className="ad-stat-label">Последнее обновление:</span>
                  <span className="ad-stat-value">{lastUpdate || 'Только что'}</span>
                </div>
                
                <div className="ad-system-stat">
                  <span className="ad-stat-label">База данных:</span>
                  <span className={`ad-stat-value ${apiAvailable ? 'online' : 'offline'}`}>
                    {apiAvailable ? '🟢 Онлайн' : '🟡 Тестовая'}
                  </span>
                </div>
                
                <div className="ad-system-stat">
                  <span className="ad-stat-label">API сервер:</span>
                  <span className={`ad-stat-value ${apiAvailable ? 'online' : 'offline'}`}>
                    {apiAvailable ? '🟢 Онлайн' : '🔴 Оффлайн'}
                  </span>
                </div>
                
                <div className="ad-system-stat">
                  <span className="ad-stat-label">Режим работы:</span>
                  <span className="ad-stat-value">
                    {apiAvailable ? 'Реальный' : 'Тестовый'}
                  </span>
                </div>
                
                <div className="ad-system-stat">
                  <span className="ad-stat-label">Активных сессий:</span>
                  <span className="ad-stat-value">1</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="ad-footer">
        <div className="ad-container">
          <div className="ad-footer-content">
            <div className="ad-footer-section">
              <h3>Техническая поддержка</h3>
              <p>📞 +7 (999) 123-45-67 (доб. 100)</p>
              <p>📧 admin-support@cheburechnaya.ru</p>
              <p>🕒 Круглосуточно</p>
            </div>
            
            <div className="ad-footer-section">
              <h3>Статус системы</h3>
              <p className={apiAvailable ? 'ad-status-online' : 'ad-status-offline'}>
                {apiAvailable ? '🟢 Система работает в штатном режиме' : '🟡 Тестовый режим'}
              </p>
              <p>Последнее обновление: {lastUpdate}</p>
              <p>Заказов в системе: {stats.totalOrders}</p>
            </div>
          </div>
          
          <div className="ad-footer-bottom">
            <p>© {new Date().getFullYear()} ЧЕБУРЕЧНАЯ. Административная панель.</p>
            <p className={`ad-footer-note ${apiAvailable ? '' : 'test-mode'}`}>
              {apiAvailable 
                ? `Версия 1.0.0 | Обновлено: ${lastUpdate}` 
                : '⚠️ РАБОТАЕТ В ТЕСТОВОМ РЕЖИМЕ'}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdminDashboard;