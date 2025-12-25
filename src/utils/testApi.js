import { api } from '../services/api';

export const testApiConnection = async () => {
  console.log('🔍 Тестирование подключения к API...');
  
  try {
    const products = await api.getProducts();
    console.log('✅ Товары загружены:', products.length);
    
    const suppliers = await api.getSuppliers();
    console.log('✅ Поставщики загружены:', suppliers.length);
    
    const employees = await api.getEmployees();
    console.log('✅ Сотрудники загружены:', employees.length);
    
    console.log('🎉 Все API работают корректно!');
    return true;
  } catch (error) {
    console.error('❌ Ошибка подключения к API:', error);
    console.log('⚠️ Проверьте:');
    console.log('1. Запущен ли бэкенд на порту 5023');
    console.log('2. URL: http://localhost:5023/api');
    console.log('3. CORS настройки на сервере');
    return false;
  }
};

