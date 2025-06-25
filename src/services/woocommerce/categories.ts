
import { apiClient } from './api';
import { Category, CategoryParams } from './types';
import { mockCategories } from '../mockData';

export class CategoriesService {
  async getCategories(params: CategoryParams = {}): Promise<Category[]> {
    try {
      const searchParams = new URLSearchParams();
      
      if (params.page) searchParams.append('page', params.page.toString());
      if (params.per_page) searchParams.append('per_page', params.per_page.toString());
      if (params.orderby) searchParams.append('orderby', params.orderby);
      if (params.order) searchParams.append('order', params.order);

      const queryString = searchParams.toString();
      const endpoint = `/products/categories${queryString ? `?${queryString}` : ''}`;
      
      console.log('Attempting to fetch categories from endpoint:', endpoint);
      const data = await apiClient.makeRequest(endpoint);
      
      // Transform the API response to match our Category interface
      const transformedCategories = data.map((apiCategory: any) => ({
        id: apiCategory.id,
        name: apiCategory.name,
        slug: apiCategory.slug,
        description: apiCategory.description,
        image: apiCategory.image ? {
          id: apiCategory.image.id,
          src: apiCategory.image.src,
          alt: apiCategory.image.alt || apiCategory.name
        } : undefined,
        count: apiCategory.count
      }));
      
      console.log('Successfully fetched and transformed categories:', transformedCategories);
      return transformedCategories;
    } catch (error) {
      console.log('Categories API failed, using mock categories due to error:', error.message);
      let filteredCategories = [...mockCategories];
      
      if (params.per_page) {
        filteredCategories = filteredCategories.slice(0, params.per_page);
      }
      
      return filteredCategories;
    }
  }
}

export const categoriesService = new CategoriesService();
