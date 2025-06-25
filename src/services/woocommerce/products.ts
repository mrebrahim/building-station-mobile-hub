
import { apiClient } from './api';
import { Product, ProductParams } from './types';
import { mockProducts } from '../mockData';

export class ProductsService {
  async getProducts(params: ProductParams = {}): Promise<Product[]> {
    try {
      const searchParams = new URLSearchParams();
      
      if (params.page) searchParams.append('page', params.page.toString());
      if (params.per_page) searchParams.append('per_page', params.per_page.toString());
      if (params.category) searchParams.append('category', params.category);
      if (params.search) searchParams.append('search', params.search);
      if (params.orderby) searchParams.append('orderby', params.orderby);
      if (params.order) searchParams.append('order', params.order);
      if (params.featured) searchParams.append('featured', 'true');
      if (params.exclude && params.exclude.length > 0) {
        searchParams.append('exclude', params.exclude.join(','));
      }

      const queryString = searchParams.toString();
      const endpoint = `/products${queryString ? `?${queryString}` : ''}`;
      
      return await apiClient.makeRequest(endpoint);
    } catch (error) {
      console.log('Using mock products due to API error');
      // Filter mock products based on parameters
      let filteredProducts = [...mockProducts];
      
      if (params.featured) {
        filteredProducts = filteredProducts.filter(p => p.featured);
      }
      
      if (params.category) {
        filteredProducts = filteredProducts.filter(p => 
          p.categories.some(c => c.id.toString() === params.category)
        );
      }
      
      if (params.exclude && params.exclude.length > 0) {
        filteredProducts = filteredProducts.filter(p => !params.exclude!.includes(p.id));
      }
      
      if (params.per_page) {
        filteredProducts = filteredProducts.slice(0, params.per_page);
      }
      
      return filteredProducts;
    }
  }

  async getProduct(id: number): Promise<Product> {
    try {
      return await apiClient.makeRequest(`/products/${id}`);
    } catch (error) {
      console.log('Using mock product due to API error');
      const product = mockProducts.find(p => p.id === id);
      if (!product) {
        throw new Error(`Product with id ${id} not found`);
      }
      return product;
    }
  }
}

export const productsService = new ProductsService();
