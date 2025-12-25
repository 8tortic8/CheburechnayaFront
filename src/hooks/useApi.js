import { useState, useCallback } from 'react';
import { api } from '../services/api';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const callApi = useCallback(async (apiCall, ...args) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiCall(...args);
      return result;
    } catch (err) {
      setError(err.message || 'Произошла ошибка');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getProducts = useCallback(() => callApi(api.getProducts), [callApi]);
  const createProduct = useCallback((data) => callApi(api.createProduct, data), [callApi]);
  const updateProduct = useCallback((id, data) => callApi(api.updateProduct, id, data), [callApi]);
  const deleteProduct = useCallback((id) => callApi(api.deleteProduct, id), [callApi]);

  const getSuppliers = useCallback(() => callApi(api.getSuppliers), [callApi]);
  const createSupplier = useCallback((data) => callApi(api.createSupplier, data), [callApi]);
  const updateSupplier = useCallback((id, data) => callApi(api.updateSupplier, id, data), [callApi]);
  const deleteSupplier = useCallback((id) => callApi(api.deleteSupplier, id), [callApi]);

  const getEmployees = useCallback(() => callApi(api.getEmployees), [callApi]);
  const createEmployee = useCallback((data) => callApi(api.createEmployee, data), [callApi]);

  return {
    loading,
    error,
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getSuppliers,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    getEmployees,
    createEmployee,
  };
};