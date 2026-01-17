import axios from 'axios';

const baseURL = process.env.WOOCOMMERCE_URL;
const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY;
const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET;

const wooApi = axios.create({
  baseURL: `${baseURL}/wp-json/wc/v3`,
  auth: {
    username: consumerKey,
    password: consumerSecret
  }
});

export async function testConnection() {
  try {
    const response = await wooApi.get('/system_status');
    return { success: true, message: 'Connected to WooCommerce' };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || error.message };
  }
}

export async function getProducts(page = 1, perPage = 100) {
  const response = await wooApi.get('/products', {
    params: { page, per_page: perPage }
  });
  return {
    products: response.data,
    totalPages: parseInt(response.headers['x-wp-totalpages'] || '1'),
    total: parseInt(response.headers['x-wp-total'] || '0')
  };
}

export async function getAllProducts() {
  let allProducts = [];
  let page = 1;
  let totalPages = 1;

  do {
    const result = await getProducts(page, 100);
    allProducts = allProducts.concat(result.products);
    totalPages = result.totalPages;
    page++;
  } while (page <= totalPages);

  return allProducts;
}

export async function getProduct(id) {
  const response = await wooApi.get(`/products/${id}`);
  return response.data;
}

export async function updateProduct(id, data) {
  const response = await wooApi.put(`/products/${id}`, data);
  return response.data;
}

export async function updateInventory(id, stockQuantity) {
  return updateProduct(id, { stock_quantity: stockQuantity });
}

export async function getOrders(status = 'any', page = 1, perPage = 100) {
  const response = await wooApi.get('/orders', {
    params: { status, page, per_page: perPage }
  });
  return {
    orders: response.data,
    totalPages: parseInt(response.headers['x-wp-totalpages'] || '1'),
    total: parseInt(response.headers['x-wp-total'] || '0')
  };
}

export async function getOrder(id) {
  const response = await wooApi.get(`/orders/${id}`);
  return response.data;
}

export async function updateOrder(id, data) {
  const response = await wooApi.put(`/orders/${id}`, data);
  return response.data;
}

export async function getCategories() {
  const response = await wooApi.get('/products/categories', {
    params: { per_page: 100 }
  });
  return response.data;
}

export async function getCustomers(page = 1, perPage = 100) {
  const response = await wooApi.get('/customers', {
    params: { page, per_page: perPage }
  });
  return {
    customers: response.data,
    totalPages: parseInt(response.headers['x-wp-totalpages'] || '1'),
    total: parseInt(response.headers['x-wp-total'] || '0')
  };
}

export async function getAllCustomers() {
  let allCustomers = [];
  let page = 1;
  let totalPages = 1;

  do {
    const result = await getCustomers(page, 100);
    allCustomers = allCustomers.concat(result.customers);
    totalPages = result.totalPages;
    page++;
  } while (page <= totalPages);

  return allCustomers;
}

export async function getCustomer(id) {
  const response = await wooApi.get(`/customers/${id}`);
  return response.data;
}

export async function getSalesReport(dateMin, dateMax) {
  const response = await wooApi.get('/reports/sales', {
    params: { 
      date_min: dateMin,
      date_max: dateMax
    }
  });
  return response.data;
}

export async function getTopSellers(period = 'week') {
  const response = await wooApi.get('/reports/top_sellers', {
    params: { period }
  });
  return response.data;
}

export async function getCoupons() {
  const response = await wooApi.get('/coupons', {
    params: { per_page: 100 }
  });
  return response.data;
}

export async function getPaymentGateways() {
  const response = await wooApi.get('/payment_gateways');
  return response.data;
}

export async function getShippingZones() {
  const response = await wooApi.get('/shipping/zones');
  return response.data;
}
