import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AdminLogin from './pages/admin/AdminLogin';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrders from './pages/admin/AdminOrders';
import AdminProducts from './pages/admin/AdminProducts';
import AdminEmployees from './pages/admin/AdminEmployees';
import AdminDeliveries from './pages/admin/AdminDeliveries';
import AdminSuppliers from './pages/admin/AdminSuppliers';

const ProtectedRoute = ({ children }) => {
  const authData = localStorage.getItem('admin_auth');
  
  if (!authData) {
    return <Navigate to="/admin/login" />;
  }
  
  try {
    const { isAuthenticated } = JSON.parse(authData);
    return isAuthenticated ? children : <Navigate to="/admin/login" />;
  } catch (error) {
    console.error('Ошибка парсинга authData:', error);
    return <Navigate to="/admin/login" />;
  }
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          
          <Route path="/admin/login" element={<AdminLogin />} />
          
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin/orders" 
            element={
              <ProtectedRoute>
                <AdminOrders />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin/products" 
            element={
              <ProtectedRoute>
                <AdminProducts />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin/employees" 
            element={
              <ProtectedRoute>
                <AdminEmployees />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin/deliveries" 
            element={
              <ProtectedRoute>
                <AdminDeliveries />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin/suppliers" 
            element={
              <ProtectedRoute>
                <AdminSuppliers />
              </ProtectedRoute>
            } 
          />
          
          <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;