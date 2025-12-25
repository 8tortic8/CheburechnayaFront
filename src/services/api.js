const API_URL = 'http://localhost:5023/api';

const handleResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  
  if (response.status === 204 || !contentType || !contentType.includes('application/json')) {
    return { 
      success: response.ok, 
      status: response.status,
      statusText: response.statusText
    };
  }
  
  try {
    const data = await response.json();
    return { 
      success: response.ok, 
      status: response.status,
      ...data 
    };
  } catch (error) {
    return { 
      success: false, 
      status: response.status,
      error: 'Не удалось прочитать ответ сервера'
    };
  }
};

const handleError = (error) => {
  console.error('API Error:', error);
  return {
    success: false,
    error: error.message || 'Ошибка сети',
    details: 'Проверьте подключение к серверу'
  };
};

export const api = {
  async getSuppliers() {
    try {
      const res = await fetch(`${API_URL}/suppliers`);
      return await res.json();
    } catch (error) {
      return handleError(error);
    }
  },

  async getSupplierById(id) {
    try {
      const res = await fetch(`${API_URL}/suppliers/${id}`);
      return await res.json();
    } catch (error) {
      return handleError(error);
    }
  },

  async createSupplier(data) {
    try {
      const res = await fetch(`${API_URL}/suppliers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return await handleResponse(res);
    } catch (error) {
      return handleError(error);
    }
  },

  async updateSupplier(id, data) {
    try {
      const res = await fetch(`${API_URL}/suppliers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return await handleResponse(res);
    } catch (error) {
      return handleError(error);
    }
  },

  async deleteSupplier(id) {
    try {
      const res = await fetch(`${API_URL}/suppliers/${id}`, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      return await handleResponse(res);
    } catch (error) {
      return handleError(error);
    }
  },

  async getProducts() {
    try {
      const res = await fetch(`${API_URL}/products`);
      return await res.json();
    } catch (error) {
      return handleError(error);
    }
  },

  async getProductById(id) {
    try {
      const res = await fetch(`${API_URL}/products/${id}`);
      return await res.json();
    } catch (error) {
      return handleError(error);
    }
  },

  async createProduct(data) {
    try {
      const res = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: data.productName,
          category: data.category,
          price: parseFloat(data.price),
          costPrice: data.costPrice ? parseFloat(data.costPrice) : null,
          stock: data.stock ? parseInt(data.stock) : 0,
          description: data.description || '',
          sku: data.sku || ''
        })
      });
      return await handleResponse(res);
    } catch (error) {
      return handleError(error);
    }
  },

  async updateProduct(id, data) {
    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return await handleResponse(res);
    } catch (error) {
      return handleError(error);
    }
  },

  async deleteProduct(id) {
    try {
      console.log(`Удаление товара с ID: ${id}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      const result = await handleResponse(res);
      console.log('Результат удаления:', result);
      
      return result;
      
    } catch (error) {
      if (error.name === 'AbortError') {
        return { 
          success: false, 
          error: 'Таймаут запроса',
          details: 'Сервер не ответил за 8 секунд'
        };
      }
      return handleError(error);
    }
  },

  async getEmployees() {
    try {
      const res = await fetch(`${API_URL}/employees`);
      return await res.json();
    } catch (error) {
      return handleError(error);
    }
  },

  async getEmployeeById(id) {
    try {
      const res = await fetch(`${API_URL}/employees/${id}`);
      return await res.json();
    } catch (error) {
      return handleError(error);
    }
  },

  async getPositions() {
    try {
      const res = await fetch(`${API_URL}/positions`);
      return await res.json();
    } catch (error) {
      return handleError(error);
    }
  },

  async createEmployee(data) {
    try {
      const res = await fetch(`${API_URL}/employees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: data.fullName,
          positionId: parseInt(data.positionId),
          phoneNumber: data.phoneNumber,
          hireDate: data.hireDate
        })
      });
      return await handleResponse(res);
    } catch (error) {
      return handleError(error);
    }
  },

  async updateEmployee(id, data) {
    try {
      const res = await fetch(`${API_URL}/employees/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return await handleResponse(res);
    } catch (error) {
      return handleError(error);
    }
  },

  async deleteEmployee(id) {
    try {
      const res = await fetch(`${API_URL}/employees/${id}`, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      return await handleResponse(res);
    } catch (error) {
      return handleError(error);
    }
  },

  async getDeliveries() {
    try {
      const res = await fetch(`${API_URL}/deliveries`);
      return await res.json();
    } catch (error) {
      return handleError(error);
    }
  },

  async getDeliveryById(id) {
    try {
      const res = await fetch(`${API_URL}/deliveries/${id}`);
      return await res.json();
    } catch (error) {
      return handleError(error);
    }
  },

  async createDelivery(data) {
    try {
      const res = await fetch(`${API_URL}/deliveries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supplierId: parseInt(data.supplierId),
          employeeId: parseInt(data.employeeId),
          driverName: data.driverName,
          driverPhone: data.driverPhone,
          vehicleNumber: data.vehicleNumber,
          status: data.status || 'Pending'
        })
      });
      return await handleResponse(res);
    } catch (error) {
      return handleError(error);
    }
  },

  async updateDelivery(id, data) {
    try {
      const res = await fetch(`${API_URL}/deliveries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return await handleResponse(res);
    } catch (error) {
      return handleError(error);
    }
  },

  async updateDeliveryStatus(id, status) {
    try {
      const res = await fetch(`${API_URL}/deliveries/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      return await handleResponse(res);
    } catch (error) {
      return handleError(error);
    }
  },

  async deleteDelivery(id) {
    try {
      const res = await fetch(`${API_URL}/deliveries/${id}`, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      return await handleResponse(res);
    } catch (error) {
      return handleError(error);
    }
  },

  async getOrders() {
    try {
      const res = await fetch(`${API_URL}/orders`);
      return await res.json();
    } catch (error) {
      return handleError(error);
    }
  },

  async getOrderById(id) {
    try {
      const res = await fetch(`${API_URL}/orders/${id}`);
      return await res.json();
    } catch (error) {
      return handleError(error);
    }
  },

  async updateOrderStatus(id, status) {
    try {
      const res = await fetch(`${API_URL}/orders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      return await handleResponse(res);
    } catch (error) {
      return handleError(error);
    }
  },

  async deleteOrder(id) {
    try {
      const res = await fetch(`${API_URL}/orders/${id}`, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      return await handleResponse(res);
    } catch (error) {
      return handleError(error);
    }
  },

  async getDashboardStats() {
    try {
      const res = await fetch(`${API_URL}/dashboard/stats`);
      return await res.json();
    } catch (error) {
      return handleError(error);
    }
  },

  async searchProducts(query) {
    try {
      const res = await fetch(`${API_URL}/products/search?q=${encodeURIComponent(query)}`);
      return await res.json();
    } catch (error) {
      return handleError(error);
    }
  },

  async getCategories() {
    try {
      const res = await fetch(`${API_URL}/products/categories`);
      return await res.json();
    } catch (error) {
      return handleError(error);
    }
  },

  async getProductsByCategory(category) {
    try {
      const res = await fetch(`${API_URL}/products/category/${category}`);
      return await res.json();
    } catch (error) {
      return handleError(error);
    }
  },

  async testConnection() {
    try {
      const res = await fetch(`${API_URL}/health`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      
      if (res.ok) {
        return { success: true, message: 'API работает корректно' };
      } else {
        return { 
          success: false, 
          error: `API вернул статус ${res.status}` 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: 'Не удалось подключиться к API',
        details: error.message
      };
    }
  }
};

export default api;