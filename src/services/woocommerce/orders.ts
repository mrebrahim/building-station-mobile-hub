
import { apiClient } from './api';
import { Order } from './types';

export class OrdersService {
  async createOrder(orderData: Order) {
    return apiClient.makeRequest('/orders', {
      method: 'POST',
      body: orderData,
    });
  }
}

export const ordersService = new OrdersService();
