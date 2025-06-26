
import { productsService } from './products';
import { categoriesService } from './categories';
import { ordersService } from './orders';
import { brandsService } from './brands';

class WooCommerceService {
  async getProducts(params: any = {}) {
    return productsService.getProducts(params);
  }

  async getProduct(id: number) {
    return productsService.getProduct(id);
  }

  async getCategories(params: any = {}) {
    return categoriesService.getCategories(params);
  }

  async getBrands(params: any = {}) {
    return brandsService.getBrands(params);
  }

  async createOrder(orderData: any) {
    return ordersService.createOrder(orderData);
  }
}

export const wooCommerceService = new WooCommerceService();

// Re-export types for convenience
export * from './types';
