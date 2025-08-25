import { supabase } from '@/integrations/supabase/client';
import { Category, CategoryParams } from './types';
import { mockCategories } from '../mockData';

export class CategoriesService {
  async getCategories(params: CategoryParams = {}): Promise<Category[]> {
    try {
      console.log('Fetching categories from local database...');
      
      let query = supabase
        .from('wc_categories')
        .select('*');

      // Filter by parent if specified
      if (params.parent !== undefined) {
        query = query.eq('parent_id', params.parent);
      }

      // Apply ordering
      if (params.orderby) {
        const ascending = params.order === 'asc';
        query = query.order(params.orderby, { ascending });
      } else {
        query = query.order('menu_order', { ascending: true });
      }

      // Apply pagination
      if (params.per_page) {
        query = query.limit(params.per_page);
        if (params.page && params.page > 1) {
          const offset = (params.page - 1) * params.per_page;
          query = query.range(offset, offset + params.per_page - 1);
        }
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching categories from database:', error);
        throw error;
      }
      
      // Transform database format to expected format
      const transformedCategories = (data || []).map(cat => {
        console.log('Processing category from DB:', cat.name, 'Image URL:', cat.image_url);
        
        return {
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          description: cat.description || '',
          image: cat.image_url ? {
            id: 0,
            src: cat.image_url,
            alt: cat.image_alt || cat.name
          } : undefined,
          count: cat.product_count || 0,
          parent: cat.parent_id || 0
        };
      });
      
      console.log('Successfully fetched categories from database:', transformedCategories.length);
      return transformedCategories;
    } catch (error) {
      console.log('Database categories failed, using mock categories due to error:', error.message);
      let filteredCategories = [...mockCategories];
      
      if (params.per_page) {
        filteredCategories = filteredCategories.slice(0, params.per_page);
      }
      
      return filteredCategories;
    }
  }

  // Get featured categories (with images and products)
  async getFeaturedCategories(limit: number = 12): Promise<Category[]> {
    try {
      console.log('Fetching featured categories from database...');
      
      const { data, error } = await supabase
        .from('wc_categories')
        .select('*')
        .not('image_url', 'is', null)
        .gt('product_count', 0)
        .order('product_count', { ascending: false })
        .limit(limit);
      
      if (error) {
        console.error('Error fetching featured categories:', error);
        throw error;
      }
      
      // Transform categories to display format
      const transformedCategories = (data || []).map(cat => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description || '',
        image: {
          id: 0,
          src: cat.image_url,
          alt: cat.image_alt || cat.name
        },
        count: cat.product_count || 0,
        parent: cat.parent_id || 0
      }));
      
      console.log('Successfully fetched featured categories:', transformedCategories.length);
      return transformedCategories;
    } catch (error) {
      console.error('Failed to fetch featured categories:', error);
      // Return first few mock categories with images as fallback
      return mockCategories.filter(cat => cat.image).slice(0, limit);
    }
  }

  // Get subcategories for a parent category
  async getSubcategories(parentId: number): Promise<Category[]> {
    return this.getCategories({ parent: parentId });
  }

  // Check if category has subcategories
  async hasSubcategories(categoryId: number): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('wc_categories')
        .select('id')
        .eq('parent_id', categoryId)
        .limit(1);
      
      if (error) return false;
      return (data || []).length > 0;
    } catch (error) {
      return false;
    }
  }

  // Get category by ID
  async getCategoryById(id: number): Promise<Category | null> {
    try {
      const { data, error } = await supabase
        .from('wc_categories')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching category:', error);
        throw error;
      }
      
      if (!data) return null;
      
      return {
        id: data.id,
        name: data.name,
        slug: data.slug,
        description: data.description || '',
        image: data.image_url ? {
          id: 0,
          src: data.image_url,
          alt: data.image_alt || data.name
        } : undefined,
        count: data.product_count || 0,
        parent: data.parent_id || 0
      };
    } catch (error) {
      console.error('Failed to fetch category:', error);
      return null;
    }
  }
}

export const categoriesService = new CategoriesService();