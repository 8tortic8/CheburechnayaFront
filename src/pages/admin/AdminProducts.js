import React, { useState, useEffect } from 'react';
import './AdminProducts.css';
import { api } from '../../services/api';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    productName: '', 
    description: '',
    price: '',
    costPrice: '',
    stock: '',
    category: '',
    supplierId: '',
    sku: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      console.log('Загружаем товары...');
      const data = await api.getProducts();
      console.log('Полученные товары:', data);
      console.log('Тип данных:', typeof data);
      console.log('Длина:', Array.isArray(data) ? data.length : 'не массив');
      
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        console.error('API вернул не массив:', data);
        setProducts([]);
      }
    } catch (error) {
      console.error('Ошибка загрузки товаров:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Отправляем данные:', formData);
      
      const productData = {
        productName: formData.productName,
        category: formData.category,
        price: parseFloat(formData.price) || 0,
        costPrice: formData.costPrice ? parseFloat(formData.costPrice) : null,
        description: formData.description || '',
        stock: formData.stock ? parseInt(formData.stock) : 0,
        sku: formData.sku || ''
      };
      
      const result = await api.createProduct(productData);
      console.log('Результат создания:', result);
      
      if (result.success) {
        alert('✅ Товар успешно создан!');
        fetchProducts();
        setFormData({ 
          productName: '', 
          description: '', 
          price: '', 
          costPrice: '', 
          stock: '', 
          category: '', 
          supplierId: '', 
          sku: '' 
        });
        setShowForm(false);
      } else {
        alert(`❌ Ошибка: ${result.message || 'Не удалось создать товар'}`);
      }
    } catch (error) {
      console.error('Ошибка создания товара:', error);
      alert('❌ Ошибка при создании товара');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'price' || name === 'costPrice' || name === 'stock'
        ? (value === '' ? '' : parseFloat(value) || '')
        : value
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот товар?')) {
      return;
    }
    
    console.log('Удаляем товар с ID:', id);
    
    try {
      const result = await api.deleteProduct(id);
      console.log('Результат удаления:', result);
      
      if (result.success) {
        alert('✅ Товар успешно удален!');
        setProducts(prev => prev.filter(product => {
          const productId = product.id || product.Id || product.ID;
          return productId != id; 
        }));
      } else {
        alert(`❌ Ошибка: ${result.error || result.message || 'Неизвестная ошибка'}`);
      }
    } catch (error) {
      console.error('Ошибка удаления:', error);
      alert('❌ Ошибка при удалении товара');
    }
  };

  const getProductField = (product, fieldName) => {
    const variants = [
      fieldName,
      fieldName.toLowerCase(),
      fieldName.charAt(0).toUpperCase() + fieldName.slice(1),
      fieldName.toUpperCase()
    ];
    
    for (const variant of variants) {
      if (product[variant] !== undefined && product[variant] !== null) {
        return product[variant];
      }
    }
    
    return null;
  };

  const calculateStats = () => {
    let totalValue = 0;
    let totalProfit = 0;
    let profitMarginSum = 0;
    let validProducts = 0;
    
    products.forEach(product => {
      const price = parseFloat(getProductField(product, 'price')) || 0;
      const costPrice = parseFloat(getProductField(product, 'costPrice')) || 0;
      const stock = parseInt(getProductField(product, 'stock')) || 0;
      
      const productValue = costPrice * stock;
      const productProfit = (price - costPrice) * stock;
      const profitMargin = costPrice > 0 ? ((price - costPrice) / costPrice) * 100 : 0;
      
      totalValue += productValue;
      totalProfit += productProfit;
      profitMarginSum += profitMargin;
      if (costPrice > 0) validProducts++;
    });
    
    const avgMargin = validProducts > 0 ? profitMarginSum / validProducts : 0;
    
    return {
      totalValue,
      totalProfit,
      avgMargin: Math.round(avgMargin)
    };
  };

  const stats = calculateStats();

  if (loading) return <div className="ad-loading">Загрузка...</div>;

  const categories = ['Bakery', 'Pizza', 'Salads', 'Drinks', 'Soups', 'Desserts'];

  return (
    <div className="ad-page-container">
      <div className="ad-header-section">
        <h2 className="ad-section-title">Товары</h2>
        <button 
          className="ad-btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '✕ Отмена' : '+ Добавить товар'}
        </button>
      </div>

      {showForm && (
        <div className="ad-form-card">
          <h3>Новый товар</h3>
          <form onSubmit={handleSubmit}>
            <div className="ad-form-group">
              <label>Название товара *</label>
              <input
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                required
                placeholder="Чебурек с мясом"
              />
            </div>
            <div className="ad-form-group">
              <label>Категория *</label>
              <select 
                name="category" 
                value={formData.category} 
                onChange={handleChange}
                required
              >
                <option value="">Выберите категорию</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="ad-form-row">
              <div className="ad-form-group">
                <label>Цена продажи (₽) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder="150.00"
                />
              </div>
              <div className="ad-form-group">
                <label>Себестоимость (₽)</label>
                <input
                  type="number"
                  name="costPrice"
                  value={formData.costPrice}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="80.00"
                />
              </div>
            </div>
            <div className="ad-form-group">
              <label>Количество на складе</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                placeholder="100"
              />
            </div>
            <div className="ad-form-group">
              <label>Описание</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Описание товара..."
                rows="3"
              />
            </div>
            <button type="submit" className="ad-btn-success">
              Сохранить товар
            </button>
          </form>
        </div>
      )}

      <div className="ad-stats-row">
        <div className="ad-stat-card">
          <div className="ad-stat-icon">🛒</div>
          <div className="ad-stat-content">
            <h3>Всего товаров</h3>
            <p className="ad-stat-number">{products.length}</p>
          </div>
        </div>
        <div className="ad-stat-card">
          <div className="ad-stat-icon">💰</div>
          <div className="ad-stat-content">
            <h3>Общая стоимость</h3>
            <p className="ad-stat-number">{stats.totalValue.toFixed(2)} ₽</p>
          </div>
        </div>
        <div className="ad-stat-card">
          <div className="ad-stat-icon">📊</div>
          <div className="ad-stat-content">
            <h3>Средняя наценка</h3>
            <p className="ad-stat-number">{stats.avgMargin}%</p>
          </div>
        </div>
        <div className="ad-stat-card">
          <div className="ad-stat-icon">💵</div>
          <div className="ad-stat-content">
            <h3>Общая прибыль</h3>
            <p className="ad-stat-number">{stats.totalProfit.toFixed(2)} ₽</p>
          </div>
        </div>
      </div>

      <div className="ad-table-container">
        {products.length === 0 ? (
          <div className="ad-empty-state">
            <p>Товары не найдены</p>
            <button 
              className="ad-btn-primary"
              onClick={() => setShowForm(true)}
            >
              Добавить первый товар
            </button>
          </div>
        ) : (
          <table className="ad-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Название</th>
                <th>Категория</th>
                <th>Цена (₽)</th>
                <th>Себестоимость (₽)</th>
                <th>Прибыль (₽)</th>
                <th>Наценка</th>
                <th>Остаток</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => {
                const productName = getProductField(product, 'productName') || 
                                   getProductField(product, 'name') || 
                                   `Товар ${index + 1}`;
                const category = getProductField(product, 'category') || '—';
                const price = parseFloat(getProductField(product, 'price')) || 0;
                const costPrice = parseFloat(getProductField(product, 'costPrice')) || 0;
                const stock = parseInt(getProductField(product, 'stock')) || 0;
                const productId = getProductField(product, 'id') || 
                                 getProductField(product, 'Id') || 
                                 (index + 1);
                
                const profitPerUnit = price - costPrice;
                const totalProfit = profitPerUnit * stock;
                const profitMargin = costPrice > 0 ? ((price - costPrice) / costPrice) * 100 : 0;
                
                return (
                  <tr key={productId}>
                    <td>{productId}</td>
                    <td><strong>{productName}</strong></td>
                    <td>
                      <span className={`ad-category-badge ${category.toLowerCase()}`}>
                        {category}
                      </span>
                    </td>
                    <td className="ad-price">{price.toFixed(2)} ₽</td>
                    <td className="ad-cost">
                      {costPrice > 0 ? `${costPrice.toFixed(2)} ₽` : '—'}
                    </td>
                    <td className={profitPerUnit > 0 ? 'ad-profit-positive' : 'ad-profit-neutral'}>
                      {profitPerUnit > 0 ? `${profitPerUnit.toFixed(2)} ₽` : '—'}
                    </td>
                    <td>
                      <span className={`ad-margin-badge ${profitMargin > 50 ? 'high' : profitMargin > 20 ? 'medium' : 'low'}`}>
                        {profitMargin > 0 ? `${profitMargin.toFixed(1)}%` : '—'}
                      </span>
                    </td>
                    <td>
                      <span className={`ad-stock-badge ${stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                        {stock} шт.
                      </span>
                    </td>
                    <td>
                      <button className="ad-btn-sm ad-btn-info">✏️</button>
                      <button 
                        className="ad-btn-sm ad-btn-danger"
                        onClick={() => handleDelete(productId)}
                        title="Удалить товар"
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

export default AdminProducts;