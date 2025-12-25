import React, { useState, useEffect } from 'react';
import './AdminEmployees.css';
import { api } from '../../services/api';

const AdminEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    positionId: '',
    phoneNumber: '',
    hireDate: new Date().toISOString().split('T')[0]
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
      phoneNumber: value
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [employeesData, positionsData] = await Promise.all([
        api.getEmployees(),
        api.getPositions()
      ]);
      
      console.log('Сотрудники:', employeesData);
      console.log('Должности:', positionsData);
      
      setEmployees(Array.isArray(employeesData) ? employeesData : []);
      
      if (Array.isArray(positionsData) && positionsData.length > 0) {
        setPositions(positionsData);
        
        if (!formData.positionId) {
          const firstPosition = positionsData[0];
          const firstPositionId = getField(firstPosition, 'id') || null;
          
          if (firstPositionId !== null && firstPositionId !== undefined) {
            setFormData(prev => ({
              ...prev,
              positionId: String(firstPositionId)
            }));
          }
        }
      } else {
        setPositions([]);
      }
      
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      setEmployees([]);
      setPositions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Отправка данных сотрудника:', formData);
      
      if (!formData.fullName.trim() || !formData.positionId || !formData.phoneNumber.trim()) {
        alert('Пожалуйста, заполните все обязательные поля!');
        return;
      }
      
      if (!validatePhone(formData.phoneNumber)) {
        alert('Введите корректный российский номер телефона!\n\nФормат: +7 (999) 123-45-67\nили: 89991234567\n\n(11 цифр, начинается с 7 или 8)');
        return;
      }
      
      const phoneForServer = formData.phoneNumber.replace(/\D/g, '');
      
      const dataForServer = {
        ...formData,
        phoneNumber: phoneForServer
      };
      
      const result = await api.createEmployee(dataForServer);
      console.log('Сотрудник создан:', result);
      
      if (result.success) {
        alert(result.message || '✅ Сотрудник успешно создан!');
        
        setShowForm(false);
        setFormData({
          fullName: '',
          positionId: positions.length > 0 ? 
            String(getField(positions[0], 'id') || '') : '',
          phoneNumber: '',
          hireDate: new Date().toISOString().split('T')[0]
        });
        
        fetchData();
      } else {
        alert(`❌ Ошибка: ${result.message || 'Не удалось создать сотрудника'}`);
      }
      
    } catch (error) {
      console.error('Ошибка создания сотрудника:', error);
      alert(`❌ Ошибка при создании сотрудника: ${error.message}`);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'phoneNumber') {
      handlePhoneChange(e);
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить этого сотрудника?')) {
      return;
    }
    
    try {
      const result = await api.deleteEmployee(id);
      console.log('Результат удаления:', result);
      
      if (result.success) {
        alert('✅ Сотрудник удален');
        setEmployees(prev => prev.filter(emp => {
          const empId = getField(emp, 'id');
          return empId != id;
        }));
      } else {
        alert(`❌ Ошибка: ${result.message || 'Не удалось удалить сотрудника'}`);
      }
    } catch (error) {
      console.error('Ошибка удаления сотрудника:', error);
      alert('❌ Ошибка при удалении сотрудника');
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
    let managers = 0;
    let cooks = 0;
    let waiters = 0;
    let totalSalary = 0;
    
    employees.forEach(employee => {
      const employeePositionId = getField(employee, 'positionId');
      let positionName = '';
    
      if (employeePositionId && positions.length > 0) {
        const foundPosition = positions.find(position => {
          const positionId = getField(position, 'id');
          return String(positionId) === String(employeePositionId);
        });
        
        if (foundPosition) {
          positionName = getField(foundPosition, 'title') || 
                        getField(foundPosition, 'name') || 
                        getField(foundPosition, 'positionTitle') || 
                        '';
        }
      }
      
      const salary = parseFloat(getField(employee, 'salary')) || 0;
      
      if (positionName.toLowerCase().includes('manager')) managers++;
      if (positionName.toLowerCase().includes('cook')) cooks++;
      if (positionName.toLowerCase().includes('waiter')) waiters++;
      totalSalary += salary;
    });
    
    return { managers, cooks, waiters, totalSalary };
  };

  const stats = calculateStats();

  if (loading) return <div className="ad-loading">Загрузка сотрудников...</div>;

  return (
    <div className="ad-page-container">
      <div className="ad-header-section">
        <h2 className="ad-section-title">Сотрудники</h2>
        <button 
          className="ad-btn-primary"
          onClick={() => setShowForm(!showForm)}
          type="button"
        >
          {showForm ? '✕ Отмена' : '+ Добавить сотрудника'}
        </button>
      </div>

      {showForm && (
        <div className="ad-form-card">
          <h3>Новый сотрудник</h3>
          <form onSubmit={handleSubmit}>
            <div className="ad-form-group">
              <label htmlFor="fullName">ФИО *</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder="Иванов Иван Иванович"
              />
            </div>
            <div className="ad-form-row">
              <div className="ad-form-group">
                <label htmlFor="positionId">Должность *</label>
                <select 
                  id="positionId"
                  name="positionId" 
                  value={formData.positionId} 
                  onChange={handleChange}
                  required
                >
                  <option value="">Выберите должность</option>
                  {positions.map((position, index) => {
                    const positionId = getField(position, 'id') || index + 1;
                    const positionTitle = getField(position, 'title') || 
                                        getField(position, 'Title') || 
                                        getField(position, 'name') || 
                                        `Должность ${positionId}`;
                    const salary = getField(position, 'salary') || getField(position, 'Salary') || 0;
                    
                    return (
                      <option key={positionId} value={String(positionId)}>
                        {positionTitle} ({parseFloat(salary).toFixed(2)} ₽)
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="ad-form-group">
                <label htmlFor="hireDate">Дата приема *</label>
                <input
                  type="date"
                  id="hireDate"
                  name="hireDate"
                  value={formData.hireDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="ad-form-group">
              <label htmlFor="phoneNumber">Телефон *</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                placeholder="+7 (999) 123-45-67"
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
            <button type="submit" className="ad-btn-success">
              Сохранить сотрудника
            </button>
          </form>
        </div>
      )}

      <div className="ad-stats-row">
        <div className="ad-stat-card">
          <div className="ad-stat-icon">👥</div>
          <div className="ad-stat-content">
            <h3>Всего сотрудников</h3>
            <p className="ad-stat-number">{employees.length}</p>
          </div>
        </div>
        <div className="ad-stat-card">
          <div className="ad-stat-icon">👔</div>
          <div className="ad-stat-content">
            <h3>Менеджеров</h3>
            <p className="ad-stat-number">{stats.managers}</p>
          </div>
        </div>
        <div className="ad-stat-card">
          <div className="ad-stat-icon">👨‍🍳</div>
          <div className="ad-stat-content">
            <h3>Поваров</h3>
            <p className="ad-stat-number">{stats.cooks}</p>
          </div>
        </div>
        <div className="ad-stat-card">
          <div className="ad-stat-icon">💼</div>
          <div className="ad-stat-content">
            <h3>Фонд зарплат</h3>
            <p className="ad-stat-number">{stats.totalSalary.toFixed(2)} ₽</p>
          </div>
        </div>
      </div>

      <div className="ad-table-container">
        {employees.length === 0 ? (
          <div className="ad-empty-state">
            <p>Сотрудники не найдены</p>
            <button 
              className="ad-btn-primary"
              onClick={() => setShowForm(true)}
            >
              Добавить первого сотрудника
            </button>
          </div>
        ) : (
          <table className="ad-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>ФИО</th>
                <th>Должность</th>
                <th>Дата приема</th>
                <th>Опыт</th>
                <th>Зарплата</th>
                <th>Заказов</th>
                <th>Телефон</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee, index) => {
                const employeeId = getField(employee, 'id') || index + 1;
                const fullName = getField(employee, 'fullName') || 
                                getField(employee, 'name') || 
                                `Сотрудник ${employeeId}`;
                
                let positionName = 'Не указана';
                const employeePositionId = getField(employee, 'positionId');
                
                if (employeePositionId && positions.length > 0) {
                  const foundPosition = positions.find(position => {
                    const positionId = getField(position, 'id');
                    return String(positionId) === String(employeePositionId);
                  });
                  
                  if (foundPosition) {
                    positionName = getField(foundPosition, 'title') || 
                                  getField(foundPosition, 'name') || 
                                  getField(foundPosition, 'positionTitle') || 
                                  'Должность не найдена';
                  }
                } else {
                  positionName = getField(employee, 'positionName') || 'Не указана';
                }
                
                const hireDateStr = getField(employee, 'hireDate') || new Date().toISOString();
                const salary = parseFloat(getField(employee, 'salary')) || 0;
                const ordersCount = parseInt(getField(employee, 'ordersCount')) || 0;
                const phoneNumber = getField(employee, 'phoneNumber') || 'Не указан';
                
                let experience = 0;
                let formattedDate = '—';
                try {
                  const hireDate = new Date(hireDateStr);
                  if (!isNaN(hireDate.getTime())) {
                    formattedDate = hireDate.toLocaleDateString('ru-RU');
                    experience = Math.floor((new Date() - hireDate) / (1000 * 60 * 60 * 24 * 365.25));
                  }
                } catch (error) {
                  console.error('Ошибка обработки даты:', error);
                }
                
                const experienceText = experience === 0 ? '<1 года' : 
                                     experience === 1 ? '1 год' : 
                                     experience < 5 ? `${experience} года` : 
                                     `${experience} лет`;
                
                const formattedPhone = phoneNumber !== 'Не указан' ? formatPhone(phoneNumber) : phoneNumber;
                
                return (
                  <tr key={employeeId}>
                    <td>{employeeId}</td>
                    <td><strong>{fullName}</strong></td>
                    <td>
                      <span className={`ad-position-badge ${positionName.toLowerCase().replace(/\s+/g, '-')}`}>
                        {positionName}
                      </span>
                    </td>
                    <td>{formattedDate}</td>
                    <td>
                      <span className="ad-experience-badge">
                        {experienceText}
                      </span>
                    </td>
                    <td className="ad-salary">
                      {salary.toFixed(2)} ₽
                    </td>
                    <td>
                      <span className="ad-orders-count">
                        {ordersCount}
                      </span>
                    </td>
                    <td>
                      {phoneNumber !== 'Не указан' ? (
                        <a href={`tel:${phoneNumber.replace(/\D/g, '')}`} className="ad-phone-link">
                          📞 {formattedPhone}
                        </a>
                      ) : (
                        <span className="ad-no-phone">Не указан</span>
                      )}
                    </td>
                    <td>
                      <button className="ad-btn-sm ad-btn-info" title="Редактировать">
                        ✏️
                      </button>
                      <button 
                        className="ad-btn-sm ad-btn-danger"
                        onClick={() => handleDelete(String(employeeId))}
                        title="Удалить сотрудника"
                      >
                        🗑️
                      </button>
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

export default AdminEmployees;