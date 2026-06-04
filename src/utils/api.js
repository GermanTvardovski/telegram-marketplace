import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class ApiClient {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Добавляем токен к каждому запросу
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Обработка ошибок
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth methods
  async authWithTelegram(telegramData) {
    const response = await this.client.post('/auth/telegram', telegramData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  }

  async getCurrentUser() {
    const response = await this.client.get('/user/me');
    return response.data;
  }

  async getUserById(userId) {
    const response = await this.client.get(`/user/${userId}`);
    return response.data;
  }

  // Categories methods
  async getCategories() {
    const response = await this.client.get('/categories');
    return response.data;
  }

  async getSubcategories(categoryId) {
    const response = await this.client.get(`/categories/${categoryId}/subcategories`);
    return response.data;
  }

  // Listings methods
  async getListings(params = {}) {
    const response = await this.client.get('/listings', { params });
    return response.data;
  }

  async getListingById(listingId) {
    const response = await this.client.get(`/listings/${listingId}`);
    return response.data;
  }

  async createListing(listingData) {
    const response = await this.client.post('/listings', listingData);
    return response.data;
  }

  async updateListing(listingId, listingData) {
    const response = await this.client.put(`/listings/${listingId}`, listingData);
    return response.data;
  }

  async deleteListing(listingId) {
    const response = await this.client.delete(`/listings/${listingId}`);
    return response.data;
  }

  async getUserListings(userId, status) {
    const params = status ? { status } : {};
    const response = await this.client.get(`/user/${userId}/listings`, { params });
    return response.data;
  }

  // Favorites methods
  async getFavoriteListings() {
    const response = await this.client.get('/favorites/listings');
    return response.data;
  }

  async addFavoriteListing(listingId) {
    const response = await this.client.post(`/favorites/listings/${listingId}`);
    return response.data;
  }

  async removeFavoriteListing(listingId) {
    const response = await this.client.delete(`/favorites/listings/${listingId}`);
    return response.data;
  }

  async getFavoriteSellers() {
    const response = await this.client.get('/favorites/sellers');
    return response.data;
  }

  async addFavoriteSeller(sellerId) {
    const response = await this.client.post(`/favorites/sellers/${sellerId}`);
    return response.data;
  }

  async removeFavoriteSeller(sellerId) {
    const response = await this.client.delete(`/favorites/sellers/${sellerId}`);
    return response.data;
  }

  // Balance and transactions methods
  async getBalance() {
    const response = await this.client.get('/balance');
    return response.data;
  }

  async createDeposit(amount, tetherWallet) {
    const response = await this.client.post('/payment/create', {
      amount,
      tether_wallet: tetherWallet,
    });
    return response.data;
  }

  async checkPaymentStatus(transactionId) {
    const response = await this.client.post(`/payment/check/${transactionId}`);
    return response.data;
  }

  async getTransactions() {
    const response = await this.client.get('/transactions');
    return response.data;
  }

  // Health check
  async healthCheck() {
    const response = await this.client.get('/health');
    return response.data;
  }
}

const apiClient = new ApiClient();

export default apiClient;
