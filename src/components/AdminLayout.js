import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import '../styles/AdminDashboard.css';

const AdminLayout = ({ userInfo, onLogout }) => {
  const location = useLocation();
  
  const navItems = [
    { path: '/admin/dashboard', label: '📊 Дашборд', icon: '📊' },
    { path: '/admin/orders', label: '📋 Заказы', icon: '📋' },
    { path: '/admin/products', label: '🛒 Товары', icon: '🛒' },
    { path: '/admin/deliveries', label: '🚚 Поставки', icon: '🚚' },
    { path: '/admin/employees', label: '👥 Сотрудники', icon: '👥' },
    { path: '/admin/suppliers', label: '🏢 Поставщики', icon: '🏢' },
  ];

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
            </div>
            <button className="ad-logout-btn" onClick={onLogout}>
              Выйти
            </button>
          </div>
        </div>
        
        <nav className="ad-nav-container">
          <ul className="ad-nav-list">
            {navItems.map((item) => (
              <li key={item.path} className="ad-nav-item">
                <Link 
                  to={item.path} 
                  className={`ad-nav-link ${location.pathname === item.path ? 'active' : ''}`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main className="ad-main-content">
        <div className="ad-container">
          <Outlet />
        </div>
      </main>

      <footer className="ad-footer">
        <div className="ad-container">
          <div className="ad-footer-content">
            <div className="ad-footer-section">
              <h3>Техническая поддержка</h3>
              <p>📞 +7 (999) 123-45-67</p>
              <p>📧 admin@cheburechnaya.ru</p>
            </div>
            
            <div className="ad-footer-section">
              <h3>Система</h3>
              <p>Версия 1.0.0</p>
              <p>© {new Date().getFullYear()} ЧЕБУРЕЧНАЯ</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdminLayout;