import React, { useState, useEffect } from 'react';
import './AdminSuppliers.css';
import { api } from '../../services/api';

const AdminSuppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '', 
    contactPerson: '', 
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const data = await api.getSuppliers();
      setSuppliers(data);
    } catch (error) {
      console.error('Ошибка:', error);
      setSuppliers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await api.createSupplier(formData);
      if (result.success) {
        alert('Успешно создано!');
        fetchSuppliers(); 
        setFormData({ 
          companyName: '', 
          contactPerson: '', 
          email: '', 
          phone: '', 
          address: '' 
        });
        setShowForm(false);
      }
    } catch (error) {
      alert('Ошибка');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) return <div className="ad-loading">Загрузка...</div>;

  const activeDeliveries = suppliers.reduce((acc, supplier) => 
    acc + (parseInt(supplier?.activeDeliveries) || 0), 0
  );

  return (
    <div className="ad-page-container">
      <div className="ad-header-section">
        <h2 className="ad-section-title">Поставщики</h2>
        <button 
          className="ad-btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '✕ Отмена' : '+ Добавить поставщика'}
        </button>
      </div>

      {showForm && (
        <div className="ad-form-card">
          <h3>Новый поставщик</h3>
          <form onSubmit={handleSubmit}>
            <div className="ad-form-group">
              <label>Название компании *</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
                placeholder="ООО 'Мясной двор'"
              />
            </div>
            <div className="ad-form-group">
              <label>Контактное лицо *</label>
              <input
                type="text"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleChange}
                required
                placeholder="Иванов Иван"
              />
            </div>
            <div className="ad-form-group">
              <label>Телефон *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="+7 (999) 123-45-67"
              />
            </div>
            <div className="ad-form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@mail.ru"
              />
            </div>
            <div className="ad-form-group">
              <label>Адрес</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="г. Москва, ул. Примерная, д. 1"
              />
            </div>
            <button type="submit" className="ad-btn-success">
              Сохранить
            </button>
          </form>
        </div>
      )}

      <div className="ad-stats-row">
        <div className="ad-stat-card">
          <div className="ad-stat-icon">🏢</div>
          <div className="ad-stat-content">
            <h3>Всего поставщиков</h3>
            <p className="ad-stat-number">{suppliers.length}</p>
          </div>
        </div>
        <div className="ad-stat-card">
          <div className="ad-stat-icon">📞</div>
          <div className="ad-stat-content">
            <h3>Контакты</h3>
            <p className="ad-stat-number">{suppliers.length}</p>
          </div>
        </div>
        <div className="ad-stat-card">
          <div className="ad-stat-icon">📦</div>
          <div className="ad-stat-content">
            <h3>Активных поставок</h3>
            <p className="ad-stat-number">{activeDeliveries}</p>
          </div>
        </div>
      </div>

      <div className="ad-table-container">
        <table className="ad-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Компания</th>
              <th>Контактное лицо</th>
              <th>Телефон</th>
              <th>Активные поставки</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier) => {
              const companyName = supplier?.CompanyName || 'Не указано';
              const contactPerson = supplier?.ContactPerson || 'Не указано';
              const phone = supplier?.Phone || 'Не указан';
              const activeDeliveries = parseInt(supplier?.activeDeliveries) || 0;
              
              return (
                <tr key={supplier?.Id || Math.random()}>
                  <td>{supplier?.Id || '?'}</td>
                  <td><strong>{companyName}</strong></td>
                  <td>{contactPerson}</td>
                  <td>
                    <a href={`tel:${phone}`} className="ad-phone-link">
                      📞 {phone}
                    </a>
                  </td>
                  <td>
                    <span className={`ad-status-badge ${activeDeliveries > 0 ? 'active' : 'inactive'}`}>
                      {activeDeliveries}
                    </span>
                  </td>
                  <td>
                    <button className="ad-btn-sm ad-btn-info">✏️</button>
                    <button className="ad-btn-sm ad-btn-danger">🗑️</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminSuppliers;