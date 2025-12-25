import React, { useState, useEffect } from 'react';
import './AdminDeliveries.css';
import { api } from '../../services/api';

const AdminDeliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    supplierId: '',
    employeeId: '',
    driverName: '',
    driverPhone: '',
    vehicleNumber: '',
    status: 'Pending'
  });

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
    } else {
      value = digits;
    }
    
    setFormData({
      ...formData,
      driverPhone: value
    });
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    try {
      console.log('Загружаем поставки...');
      const data = await api.getDeliveries();
      console.log('Полученные данные:', data);
      
      if (Array.isArray(data)) {
        setDeliveries(data);
      } else {
        console.error('API вернул не массив:', data);
        setDeliveries([]);
      }
    } catch (error) {
      console.error('Ошибка загрузки поставок:', error);
      setDeliveries([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!validatePhone(formData.driverPhone)) {
        alert('Введите корректный российский номер телефона водителя!\n\nФормат: +7 (999) 123-45-67\nили: 89991234567\n\n(11 цифр, начинается с 7 или 8)');
        return;
      }
      
      const phoneForServer = formData.driverPhone.replace(/\D/g, '');
      
      const dataForServer = {
        ...formData,
        driverPhone: phoneForServer
      };
      
      const result = await api.createDelivery(dataForServer);
      if (result.success) {
        alert('✅ Поставка успешно создана!');
        setShowForm(false);
        setFormData({
          supplierId: '',
          employeeId: '',
          driverName: '',
          driverPhone: '',
          vehicleNumber: '',
          status: 'Pending'
        });
        fetchDeliveries();
      } else {
        alert(`❌ Ошибка: ${result.message || 'Не удалось создать поставку'}`);
      }
    } catch (error) {
      console.error('Ошибка создания поставки:', error);
      alert('❌ Ошибка при создании поставки');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'driverPhone') {
      handlePhoneChange(e);
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const updateDeliveryStatus = async (deliveryId, newStatus) => {
    try {
      const result = await api.updateDeliveryStatus(deliveryId, newStatus);
      if (result.success) {
        alert('Статус обновлен!');
        setDeliveries(prev => prev.map(delivery => {
          const id = delivery.id || delivery.Id || delivery.ID;
          if (id == deliveryId) {
            return { ...delivery, Status: newStatus };
          }
          return delivery;
        }));
      } else {
        alert(`Ошибка: ${result.message || 'Не удалось обновить статус'}`);
      }
    } catch (error) {
      console.error('Ошибка обновления статуса:', error);
      alert('Ошибка при обновлении статуса');
    }
  };

  const getField = (obj, fieldName) => {
    if (!obj) return null;
    
    const variants = [
      fieldName,
      fieldName.toLowerCase(),
      fieldName.toUpperCase(),
      fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
    ];
    
    for (const variant of variants) {
      if (obj[variant] !== undefined && obj[variant] !== null) {
        return obj[variant];
      }
    }
    
    return null;
  };

  const calculateStats = () => {
    let pending = 0;
    let inTransit = 0;
    let delivered = 0;
    let totalAmount = 0;
    
    deliveries.forEach(delivery => {
      const status = getField(delivery, 'status') || getField(delivery, 'Status') || 'Unknown';
      const amount = parseFloat(getField(delivery, 'totalAmount')) || 
                     parseFloat(getField(delivery, 'TotalAmount')) || 0;
      
      if (status === 'Pending') pending++;
      if (status === 'In Transit') inTransit++;
      if (status === 'Delivered') delivered++;
      totalAmount += amount;
    });
    
    return { pending, inTransit, delivered, totalAmount };
  };

  const stats = calculateStats();

  if (loading) return <div className="ad-loading">Загрузка...</div>;

  return (
    <div className="ad-page-container">
      <div className="ad-header-section">
        <h2 className="ad-section-title">Поставки</h2>
        <button 
          className="ad-btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '✕ Отмена' : '+ Новая поставка'}
        </button>
      </div>

      {showForm && (
        <div className="ad-form-card">
          <h3>Новая поставка</h3>
          <form onSubmit={handleSubmit}>
            <div className="ad-form-row">
              <div className="ad-form-group">
                <label>Поставщик *</label>
                <select 
                  name="supplierId" 
                  value={formData.supplierId} 
                  onChange={handleChange}
                  required
                >
                  <option value="">Выберите поставщика</option>
                  <option value="1">ООО "Мясной двор"</option>
                  <option value="2">ИП "Свежие овощи"</option>
                  <option value="3">ЗАО "Молочные продукты"</option>
                  <option value="4">ООО "Бакалея+"</option>
                </select>
              </div>
              <div className="ad-form-group">
                <label>Ответственный *</label>
                <select 
                  name="employeeId" 
                  value={formData.employeeId} 
                  onChange={handleChange}
                  required
                >
                  <option value="">Выберите сотрудника</option>
                  <option value="5">Волков Денис Андреевич</option>
                  <option value="1">Смирнов Иван Сергеевич</option>
                </select>
              </div>
            </div>
            
            <div className="ad-form-row">
              <div className="ad-form-group">
                <label>Водитель *</label>
                <input
                  type="text"
                  name="driverName"
                  value={formData.driverName}
                  onChange={handleChange}
                  required
                  placeholder="Сергеев Владимир"
                />
              </div>
              <div className="ad-form-group">
                <label>Телефон водителя *</label>
                <input
                  type="tel"
                  name="driverPhone"
                  value={formData.driverPhone}
                  onChange={handleChange}
                  required
                  placeholder="+7 (916) 777-88-99"
                  pattern="^(\+7|8)[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$"
                  title="Формат: +7 (999) 123-45-67 или 89991234567"
                />
                <small style={{
                  color: '#666', 
                  fontSize: '12px',
                  display: 'block',
                  marginTop: '5px'
                }}>
                  Формат: +7 (999) 123-45-67 или 89991234567
                </small>
              </div>
            </div>

            <div className="ad-form-row">
              <div className="ad-form-group">
                <label>Номер машины *</label>
                <input
                  type="text"
                  name="vehicleNumber"
                  value={formData.vehicleNumber}
                  onChange={handleChange}
                  required
                  placeholder="А123ВС777"
                />
              </div>
              <div className="ad-form-group">
                <label>Статус</label>
                <select 
                  name="status" 
                  value={formData.status} 
                  onChange={handleChange}
                >
                  <option value="Pending">Ожидает</option>
                  <option value="In Transit">В пути</option>
                  <option value="Delivered">Доставлено</option>
                </select>
              </div>
            </div>

            <button type="submit" className="ad-btn-success">
              Создать поставку
            </button>
          </form>
        </div>
      )}

      <div className="ad-stats-row">
        <div className="ad-stat-card">
          <div className="ad-stat-icon">🚚</div>
          <div className="ad-stat-content">
            <h3>Всего поставок</h3>
            <p className="ad-stat-number">{deliveries.length}</p>
          </div>
        </div>
        <div className="ad-stat-card">
          <div className="ad-stat-icon">⏳</div>
          <div className="ad-stat-content">
            <h3>Ожидают доставки</h3>
            <p className="ad-stat-number">{stats.pending}</p>
          </div>
        </div>
        <div className="ad-stat-card">
          <div className="ad-stat-icon">🚛</div>
          <div className="ad-stat-content">
            <h3>В пути</h3>
            <p className="ad-stat-number">{stats.inTransit}</p>
          </div>
        </div>
        <div className="ad-stat-card">
          <div className="ad-stat-icon">✅</div>
          <div className="ad-stat-content">
            <h3>Доставлено</h3>
            <p className="ad-stat-number">{stats.delivered}</p>
          </div>
        </div>
      </div>

      <div className="ad-table-container">
        {deliveries.length === 0 ? (
          <div className="ad-empty-state">
            <p>Поставки не найдены</p>
            <button 
              className="ad-btn-primary"
              onClick={() => setShowForm(true)}
            >
              Создать первую поставку
            </button>
          </div>
        ) : (
          <table className="ad-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Дата</th>
                <th>Поставщик</th>
                <th>Ответственный</th>
                <th>Водитель</th>
                <th>Машина</th>
                <th>Товаров</th>
                <th>Сумма</th>
                <th>Статус</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {deliveries.map((delivery, index) => {
                const deliveryId = getField(delivery, 'id') || index + 1;
                const deliveryDate = getField(delivery, 'deliveryDate') || 
                                   getField(delivery, 'DeliveryDate') || 
                                   new Date().toISOString();
                const supplierName = getField(delivery, 'supplierName') || 
                                    getField(delivery, 'SupplierName') || 
                                    'Не указан';
                const employeeName = getField(delivery, 'employeeName') || 
                                    getField(delivery, 'EmployeeName') || 
                                    'Не указан';
                const driverName = getField(delivery, 'driverName') || 
                                  getField(delivery, 'DriverName') || 
                                  'Не указан';
                const driverPhone = getField(delivery, 'driverPhone') || 
                                   getField(delivery, 'DriverPhone') || 
                                   '';
                const vehicleNumber = getField(delivery, 'vehicleNumber') || 
                                    getField(delivery, 'VehicleNumber') || 
                                    'Не указан';
                const itemsCount = getField(delivery, 'itemsCount') || 
                                 getField(delivery, 'ItemsCount') || 0;
                const totalAmount = parseFloat(getField(delivery, 'totalAmount')) || 
                                  parseFloat(getField(delivery, 'TotalAmount')) || 0;
                const status = getField(delivery, 'status') || 
                              getField(delivery, 'Status') || 'Unknown';
                
                let formattedDate = '—';
                try {
                  const date = new Date(deliveryDate);
                  if (!isNaN(date.getTime())) {
                    formattedDate = date.toLocaleDateString('ru-RU');
                  }
                } catch (e) {
                  console.error('Ошибка форматирования даты:', e);
                }
                
                const formattedPhone = driverPhone ? formatPhone(driverPhone) : '';
                
                const idForButtons = deliveryId;
                
                return (
                  <tr key={deliveryId}>
                    <td><strong>#{deliveryId}</strong></td>
                    <td>{formattedDate}</td>
                    <td>{supplierName}</td>
                    <td>{employeeName}</td>
                    <td>
                      <div>
                        <strong>{driverName}</strong>
                        {formattedPhone && <br/>}
                        {formattedPhone && (
                          <small className="ad-phone">
                            <a href={`tel:${driverPhone.replace(/\D/g, '')}`} className="ad-phone-link">
                              📞 {formattedPhone}
                            </a>
                          </small>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className="ad-vehicle-badge">
                        🚛 {vehicleNumber}
                      </span>
                    </td>
                    <td>{itemsCount}</td>
                    <td className="ad-price">
                      {totalAmount.toFixed(2)} ₽
                    </td>
                    <td>
                      <span className={`ad-status-badge ${status.toLowerCase().replace(' ', '-')}`}>
                        {status}
                      </span>
                    </td>
                    <td>
                      <div className="ad-action-buttons">
                        <button className="ad-btn-sm ad-btn-info" title="Просмотр">
                          👁️
                        </button>
                        {status === 'Pending' && (
                          <button 
                            className="ad-btn-sm ad-btn-success"
                            onClick={() => updateDeliveryStatus(idForButtons, 'In Transit')}
                            title="Начать доставку"
                          >
                            🚚
                          </button>
                        )}
                        {status === 'In Transit' && (
                          <button 
                            className="ad-btn-sm ad-btn-success"
                            onClick={() => updateDeliveryStatus(idForButtons, 'Delivered')}
                            title="Завершить доставку"
                          >
                            ✅
                          </button>
                        )}
                        {status !== 'Delivered' && (
                          <button 
                            className="ad-btn-sm ad-btn-danger"
                            onClick={() => updateDeliveryStatus(idForButtons, 'Cancelled')}
                            title="Отменить поставку"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminDeliveries;