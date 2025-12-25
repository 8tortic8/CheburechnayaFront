export const formatPrice = (price) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(price);
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const getStatusColor = (status) => {
  const statuses = {
    'active': 'success',
    'inactive': 'danger',
    'pending': 'warning',
    'completed': 'info',
    'delivered': 'success',
    'shipped': 'primary',
    'cancelled': 'danger',
    'processing': 'warning'
  };
  return statuses[status?.toLowerCase()] || 'secondary';
};

export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const isValidPhone = (phone) => {
  const re = /^\+?[1-9]\d{1,14}$/;
  return re.test(phone.replace(/\D/g, ''));
};

export const toCamelCase = (str) => {
  return str.replace(/([-_][a-z])/g, (group) =>
    group.toUpperCase().replace('-', '').replace('_', '')
  );
};

export const generateTempId = () => {
  return 'temp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

export const isEmptyObject = (obj) => {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
};

export const deepCopy = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

export const delay = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};