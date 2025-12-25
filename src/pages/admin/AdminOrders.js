import React, { useState, useEffect } from 'react';
import './AdminOrders.css';
import { api } from '../../services/api';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [suppliers, setSuppliers] = useState([]);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchOrders();
    fetchSuppliers();
    fetchEmployees();
  }, []);

  const fetchOrders = async () => {
    try {
      console.log('Загружаем заказы...');
      const data = await api.getOrders();
      console.log('Полученные заказы:', data);
      console.log('Тип данных:', typeof data);
      console.log('Первый заказ:', data[0]);
      
      if (Array.isArray(data)) {
        setOrders(data);
      } else {
        console.error('API вернул не массив:', data);
        setOrders([]);
      }
    } catch (error) {
      console.error('Ошибка загрузки заказов:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const data = await api.getSuppliers();
      setSuppliers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Ошибка загрузки поставщиков:', error);
      setSuppliers([]);
    }
  };

  const fetchEmployees = async () => {
    try {
      const data = await api.getEmployees();
      setEmployees(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Ошибка загрузки сотрудников:', error);
      setEmployees([]);
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

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const result = await api.updateOrderStatus(orderId, newStatus);
      if (result.success) {
        alert('Статус обновлен!');
        setOrders(prev => prev.map(order => {
          const id = getField(order, 'id');
          if (id == orderId) {
            return { ...order, Status: newStatus };
          }
          return order;
        }));
      } else {
        alert(`Ошибка: ${result.message || 'Не удалось обновить статус'}`);
      }
    } catch (error) {
      console.error('Ошибка обновления статуса:', error);
      alert('Ошибка при обновлении статуса');
    }
  };

  const viewOrderDetails = async (orderId) => {
    try {
      const data = await api.getOrderById(orderId);
      console.log('Детали заказа:', data);
      setSelectedOrder(data);
    } catch (error) {
      console.error('Ошибка загрузки деталей:', error);
      alert('Не удалось загрузить детали заказа');
    }
  };

  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(order => getField(order, 'status') === statusFilter);

  const calculateStats = () => {
    let pending = 0;
    let completed = 0;
    let totalRevenue = 0;
    
    orders.forEach(order => {
      const status = getField(order, 'status') || '';
      const amount = parseFloat(getField(order, 'totalAmount')) || 0;
      
      if (status === 'Pending') pending++;
      if (status === 'Completed') completed++;
      totalRevenue += amount;
    });
    
    return { pending, completed, totalRevenue };
  };

  const stats = calculateStats();

  if (loading) return <div className="ad-loading">Загрузка заказов...</div>;

  return (
    <div className="ad-page-container">
      <div className="ad-header-section">
        <h2 className="ad-section-title">Заказы</h2>
        <div className="ad-filter-buttons">
          <button 
            className={`ad-filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            Все
          </button>
          <button 
            className={`ad-filter-btn ${statusFilter === 'Pending' ? 'active' : ''}`}
            onClick={() => setStatusFilter('Pending')}
          >
            ⏳ Ожидают
          </button>
          <button 
            className={`ad-filter-btn ${statusFilter === 'Processing' ? 'active' : ''}`}
            onClick={() => setStatusFilter('Processing')}
          >
            🔄 В обработке
          </button>
          <button 
            className={`ad-filter-btn ${statusFilter === 'Completed' ? 'active' : ''}`}
            onClick={() => setStatusFilter('Completed')}
          >
            ✅ Завершено
          </button>
        </div>
      </div>

      <div className="ad-stats-row">
        <div className="ad-stat-card">
          <div className="ad-stat-icon">📋</div>
          <div className="ad-stat-content">
            <h3>Всего заказов</h3>
            <p className="ad-stat-number">{orders.length}</p>
          </div>
        </div>
        <div className="ad-stat-card">
          <div className="ad-stat-icon">⏳</div>
          <div className="ad-stat-content">
            <h3>Ожидают</h3>
            <p className="ad-stat-number">{stats.pending}</p>
          </div>
        </div>
        <div className="ad-stat-card">
          <div className="ad-stat-icon">✅</div>
          <div className="ad-stat-content">
            <h3>Завершено</h3>
            <p className="ad-stat-number">{stats.completed}</p>
          </div>
        </div>
        <div className="ad-stat-card">
          <div className="ad-stat-icon">💰</div>
          <div className="ad-stat-content">
            <h3>Общая выручка</h3>
            <p className="ad-stat-number">{stats.totalRevenue.toFixed(2)} ₽</p>
          </div>
        </div>
      </div>

      <div className="ad-table-container">
        {orders.length === 0 ? (
          <div className="ad-empty-state">
            <p>Заказы не найдены</p>
            <p className="ad-empty-subtext">Создайте первый заказ</p>
          </div>
        ) : (
          <table className="ad-table">
            <thead>
              <tr>
                <th>№</th>
                <th>Дата и время</th>
                <th>Сотрудник</th>
                <th>Товаров</th>
                <th>Сумма</th>
                <th>Статус</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, index) => {
                const orderId = getField(order, 'id') || index + 1;
                const orderDate = getField(order, 'orderDate') || 
                                 getField(order, 'createdAt') || 
                                 new Date().toISOString();
                const employeeName = getField(order, 'employeeName') || 
                                    getField(order, 'employee') || 
                                    'Не указан';
                const itemsCount = getField(order, 'itemsCount') || 0;
                const totalAmount = parseFloat(getField(order, 'totalAmount')) || 0;
                const status = getField(order, 'status') || 'Unknown';
                
                let formattedDate = '—';
                try {
                  const date = new Date(orderDate);
                  if (!isNaN(date.getTime())) {
                    formattedDate = date.toLocaleString('ru-RU');
                  }
                } catch (e) {
                  console.error('Ошибка форматирования даты:', e);
                }
                
                return (
                  <tr key={orderId}>
                    <td><strong>#{orderId}</strong></td>
                    <td>{formattedDate}</td>
                    <td>{employeeName}</td>
                    <td>{itemsCount}</td>
                    <td className="ad-price">
                      {totalAmount.toFixed(2)} ₽
                    </td>
                    <td>
                      <span className={`ad-status-badge ${status.toLowerCase()}`}>
                        {status}
                      </span>
                    </td>
                    <td>
                      <div className="ad-action-buttons">
                        <button 
                          className="ad-btn-sm ad-btn-info"
                          onClick={() => viewOrderDetails(orderId)}
                          title="Просмотр деталей"
                        >
                          👁️
                        </button>
                        {status === 'Pending' && (
                          <>
                            <button 
                              className="ad-btn-sm ad-btn-success"
                              onClick={() => handleStatusChange(orderId, 'Processing')}
                              title="Начать обработку"
                            >
                              🔄
                            </button>
                            <button 
                              className="ad-btn-sm ad-btn-danger"
                              onClick={() => handleStatusChange(orderId, 'Cancelled')}
                              title="Отменить заказ"
                            >
                              ✕
                            </button>
                          </>
                        )}
                        {status === 'Processing' && (
                          <button 
                            className="ad-btn-sm ad-btn-success"
                            onClick={() => handleStatusChange(orderId, 'Completed')}
                            title="Завершить заказ"
                          >
                            ✅
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

      {selectedOrder && (
        <div className="ad-modal-overlay">
          <div className="ad-modal">
            <div className="ad-modal-header">
              <h3>Заказ #{getField(selectedOrder.order || selectedOrder, 'id') || '?'}</h3>
              <button 
                className="ad-modal-close"
                onClick={() => setSelectedOrder(null)}
              >
                ✕
              </button>
            </div>
            <div className="ad-modal-body">
              <div className="ad-order-info">
                <p><strong>Дата:</strong> {
                  (() => {
                    const dateStr = getField(selectedOrder.order || selectedOrder, 'orderDate');
                    if (!dateStr) return 'Не указана';
                    try {
                      return new Date(dateStr).toLocaleString('ru-RU');
                    } catch {
                      return dateStr;
                    }
                  })()
                }</p>
                <p><strong>Сотрудник:</strong> {getField(selectedOrder.order || selectedOrder, 'employeeName') || 'Не указан'}</p>
                <p><strong>Телефон:</strong> {getField(selectedOrder.order || selectedOrder, 'employeePhone') || 'Не указан'}</p>
                <p><strong>Статус:</strong> 
                  <span className={`ad-status-badge ${(getField(selectedOrder.order || selectedOrder, 'status') || 'unknown').toLowerCase()}`}>
                    {getField(selectedOrder.order || selectedOrder, 'status') || 'Unknown'}
                  </span>
                </p>
                <p><strong>Общая сумма:</strong> {
                  (parseFloat(getField(selectedOrder.order || selectedOrder, 'totalAmount')) || 0).toFixed(2)
                } ₽</p>
              </div>
              
              <h4>Товары в заказе:</h4>
              {selectedOrder.items && selectedOrder.items.length > 0 ? (
                <table className="ad-table">
                  <thead>
                    <tr>
                      <th>Товар</th>
                      <th>Категория</th>
                      <th>Количество</th>
                      <th>Цена за шт.</th>
                      <th>Сумма</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item, index) => {
                      const subtotal = parseFloat(getField(item, 'subtotal')) || 0;
                      const unitPrice = parseFloat(getField(item, 'unitPrice')) || 0;
                      const quantity = getField(item, 'quantity') || 0;
                      
                      return (
                        <tr key={index}>
                          <td>{getField(item, 'productName') || 'Неизвестный товар'}</td>
                          <td>{getField(item, 'category') || '—'}</td>
                          <td>{quantity}</td>
                          <td>{unitPrice.toFixed(2)} ₽</td>
                          <td>{subtotal.toFixed(2)} ₽</td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="4" className="ad-text-right"><strong>Итого:</strong></td>
                      <td>
                        <strong>
                          {(parseFloat(getField(selectedOrder.order || selectedOrder, 'totalAmount')) || 0).toFixed(2)} ₽
                        </strong>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              ) : (
                <p className="ad-empty-subtext">Товары не найдены</p>
              )}
            </div>
            <div className="ad-modal-footer">
              <button 
                className="ad-btn-secondary"
                onClick={() => setSelectedOrder(null)}
              >
                Закрыть
              </button>
              <button 
                className="ad-btn-primary"
                onClick={() => window.print()}
              >
                🖨️ Печать
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;