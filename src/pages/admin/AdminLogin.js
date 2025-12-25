import React, { useState, useEffect } from 'react';
import './AdminLogin.css';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    employeeId: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [apiAvailable, setApiAvailable] = useState(true);
  const API_BASE_URL = 'http://localhost:5023'; 

  useEffect(() => {
    const checkApi = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/check`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        if (response.ok) {
          setApiAvailable(true);
        } else {
          setApiAvailable(false);
        }
      } catch (error) {
        console.log('API недоступен:', error);
        setApiAvailable(false);
      }
    };
    
    checkApi();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!credentials.username || !credentials.password || !credentials.employeeId) {
      setError('Все поля обязательны для заполнения');
      setLoading(false);
      return;
    }

    try {
      if (apiAvailable) {
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: credentials.username,
            employeeId: credentials.employeeId,
            password: credentials.password
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Неверные учетные данные');
        }
        
        const authData = await response.json();
        console.log('Успешный вход:', authData);
        
        localStorage.setItem('admin_auth', JSON.stringify({
          isAuthenticated: true,
          employeeId: authData.employeeId,
          username: authData.fullName || authData.username,
          fullName: authData.fullName,
          role: authData.role,
          position: authData.position,
          salary: authData.salary,
          hireDate: authData.hireDate,
          phoneNumber: authData.phoneNumber,
          timestamp: new Date().toISOString()
        }));
        
        window.location.href = '/admin/dashboard';
      } else {
        const mockEmployees = [
          { id: 1, username: 'admin', password: 'admin123', employeeId: '1', role: 'manager' },
          { id: 2, username: 'Smirnov Ivan Sergeevich', password: '+7 (999) 111-22-33', employeeId: '1', role: 'manager' },
          { id: 3, username: 'Petrova Anna Vladimirovna', password: '+7 (999) 222-33-44', employeeId: '2', role: 'cook' }
        ];
        
        const employee = mockEmployees.find(
          emp => emp.username === credentials.username && 
                 emp.password === credentials.password &&
                 emp.employeeId === credentials.employeeId
        );
        
        if (!employee) {
          throw new Error('Неверные учетные данные');
        }
        
        localStorage.setItem('admin_auth', JSON.stringify({
          isAuthenticated: true,
          employeeId: employee.employeeId,
          username: employee.username,
          role: employee.role,
          timestamp: new Date().toISOString()
        }));
        
        window.location.href = '/admin/dashboard';
      }
      
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Ошибка авторизации');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const authData = localStorage.getItem('admin_auth');
    if (authData) {
      try {
        const { isAuthenticated } = JSON.parse(authData);
        if (isAuthenticated) {
          window.location.href = '/admin/dashboard';
        }
      } catch (error) {
        localStorage.removeItem('admin_auth');
      }
    }
  }, []);

  return (
    <div className="admin-login-page">
      <header className="admin-login-header">
        <div className="header-container">
          <div className="admin-dashboard-logo">
            <span className="admin-logo-main">ЧЕБУРЕЧНАЯ</span>
            <span className="logo-subtext">АДМИН ПАНЕЛЬ</span>
          </div>
          
          <nav className="header-nav">
            <ul className="nav-list">
              <li className="nav-item">
                <a href="/" className="nav-link">Вернуться на сайт</a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="admin-login-main">
        <div className="container">
          <div className="login-wrapper">
            <div className="login-card">
              <div className="login-header">
                <h1 className="login-title">Вход в админ панель</h1>
                <p className="login-subtitle">Только для авторизованного персонала</p>
                
                <div className={`api-status ${apiAvailable ? 'online' : 'offline'}`}>
                  <span className="status-dot"></span>
                  {apiAvailable ? 'API подключен' : 'API недоступен (тестовый режим)'}
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="login-form">
                {error && (
                  <div className="error-message">
                    ⚠️ {error}
                    {!apiAvailable && (
                      <div className="test-credentials">
                        <p><strong>Тестовые данные:</strong></p>
                        <p>Логин: <code>admin</code> | ID: <code>1</code> | Пароль: <code>admin123</code></p>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="form-group">
                  <label htmlFor="username">
                    <span className="label-icon">👤</span>
                    Имя пользователя
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={credentials.username}
                    onChange={handleInputChange}
                    placeholder="Введите имя пользователя"
                    required
                    disabled={loading}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="employeeId">
                    <span className="label-icon">🆔</span>
                    ID сотрудника
                  </label>
                  <input
                    type="text"
                    id="employeeId"
                    name="employeeId"
                    value={credentials.employeeId}
                    onChange={handleInputChange}
                    placeholder="Введите ID сотрудника"
                    required
                    disabled={loading}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="password">
                    <span className="label-icon">🔒</span>
                    Пароль
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={credentials.password}
                    onChange={handleInputChange}
                    placeholder="Введите пароль"
                    required
                    disabled={loading}
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="login-button"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      {apiAvailable ? 'Подключение к серверу...' : 'Проверка данных...'}
                    </>
                  ) : (
                    'ВОЙТИ В СИСТЕМУ'
                  )}
                </button>
                
                <div className="login-info">
                  <p className="info-text">
                    ⚠️ Доступ только для сотрудников с соответствующими правами
                  </p>
                  <p className="info-text">
                    📞 Техподдержка: +7 (999) 123-45-67 (доб. 100)
                  </p>
                </div>
              </form>
              
              <div className="login-footer">
                <p className="security-notice">
                  🔐 {apiAvailable ? 'Ваша сессия защищена' : 'Работаем в тестовом режиме'}
                </p>
                <p className="version-info">
                  Версия системы: 1.0.0 | База данных: CheburechnayaDB
                </p>
              </div>
            </div>
            
            <div className="login-sidebar">
              <div className="sidebar-card">
                <h3 className="sidebar-title">Роли в системе</h3>
                
                <div className="roles-list">
                  <div className="role-item">
                    <div className="role-icon">👔</div>
                    <div className="role-info">
                      <h4>Менеджер</h4>
                      <p>Полный доступ ко всем функциям</p>
                    </div>
                  </div>
                  
                  <div className="role-item">
                    <div className="role-icon">👨‍🍳</div>
                    <div className="role-info">
                      <h4>Повар</h4>
                      <p>Управление заказами и кухней</p>
                    </div>
                  </div>
                  
                  <div className="role-item">
                    <div className="role-icon">💼</div>
                    <div className="role-info">
                      <h4>Закупщик</h4>
                      <p>Управление поставками и складом</p>
                    </div>
                  </div>
                  
                  <div className="role-item">
                    <div className="role-icon">💵</div>
                    <div className="role-info">
                      <h4>Кассир</h4>
                      <p>Работа с заказами и оплатами</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="system-status">
                <h4>Статус системы</h4>
                <div className="status-item">
                  <span className="status-label">База данных:</span>
                  <span className="status-value online">🟢 Онлайн</span>
                </div>
                <div className="status-item">
                  <span className="status-label">API сервер:</span>
                  <span className={`status-value ${apiAvailable ? 'online' : 'offline'}`}>
                    {apiAvailable ? '🟢 Онлайн' : '🔴 Оффлайн'}
                  </span>
                </div>
                <div className="status-item">
                  <span className="status-label">Время работы:</span>
                  <span className="status-value">{new Date().toLocaleTimeString('ru-RU')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="admin-login-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>Техническая информация</h3>
              <p><strong>Backend:</strong> ASP.NET Core Web API</p>
              <p><strong>Frontend:</strong> React.js 18+</p>
              <p><strong>База данных:</strong> SQL Server</p>
            </div>
            
            <div className="footer-section">
              <h3>Безопасность</h3>
              <p>🔒 256-битное шифрование</p>
              <p>👁️‍🗨️ Ведение логов всех действий</p>
              <p>🛡️ Защита от SQL-инъекций</p>
            </div>
            
            <div className="footer-section">
              <h3>Поддержка</h3>
              <p>📞 Техподдержка: +7 (999) 123-45-67</p>
              <p>📧 Email: support@cheburechnaya.ru</p>
              <p>🕒 Круглосуточно</p>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} ЧЕБУРЕЧНАЯ. Административная панель.</p>
            <p className="footer-note">
              Несанкционированный доступ преследуется по закону
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdminLogin;