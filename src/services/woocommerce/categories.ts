import { Category, CategoryParams } from './types';

const WC_BASE_URL = 'https://building-station.com/wp-json/wc/v3';

const getAuthHeader = () => {
  const key = import.meta.env.VITE_WC_CONSUMER_KEY;
  const secret = import.meta.env.VITE_WC_CONSUMER_SECRET;
  if (!key || !secret) {
    console.warn('WooCommerce API keys not found in env variables');
    return '';
  }
  return 'Basic ' + btoa(`${key}:${secret}`);
};

const fetchFromWC = async (endpoint: string, params: Record<string, any> = {}): Promise<any> => {
  const url = new URL(`${WC_BASE_URL}${endpoint}`);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined) url.searchParams.append(k, String(v));
  });

  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  const auth = getAuthHeader();
  if (auth) headers['Authorization'] = auth;

  const res = await fetch(url.toString(), { headers });
  if (!res.ok) throw new Error(`WC API error: ${res.status}`);
  return res.json();
};

export class CategoriesService {
  async getCategories(params: CategoryParams = {}): Promise<Category[]> {
    try {
      console.log('Fetching categories from WooCommerce API...');

      const data = await fetchFromWC('/products/categories', {
        per_page: params.per_page || 100,
        page: params.page || 1,
        parent: params.parent,
        orderby: params.orderby || 'name',
        order: params.order || 'asc',
        hide_empty: true,
      });

      const categories: Category[] = data.map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description || '',
        image: cat.image ? { id: cat.image.id, src: cat.image.src, alt: cat.image.alt || cat.name } : undefined,
        count: cat.count || 0,
        parent: cat.parent || 0,
      }));

      console.log('Successfully fetched categories from WooCommerce:', categories.length);
      return categories;
    } catch (error) {
      console.error('Failed to fetch categories from WooCommerce:', error);
      return [];
    }
  }

  async getFeaturedCategories(limit: number = 12): Promise<Category[]> {
    try {
      const all = await this.getCategories({ per_page: 100 });
      return all
        .filter(cat => cat.parent === 0 && cat.count > 0)
        .sort((a, b) => b.count - a.count)
        .slice(0, limit);
    } catch (error) {
      console.error('Failed to fetch featured categories:', error);
      return [];
    }
  }

  async getSubcategories(parentId: number): Promise<Category[]> {
    return this.getCategories({ parent: parentId });
  }

  async hasSubcategories(categoryId: number): Promise<boolean> {
    const subs = await this.getSubcategories(categoryId);
    return subs.length > 0;
  }

  async getCategoryById(id: number): Promise<Category | null> {
    try {
      const data = await fetchFromWC(`/products/categories/${id}`);
      return {
        id: data.id,
        name: data.name,
        slug: data.slug,
        description: data.description || '',
        image: data.image ? { id: data.image.id, src: data.image.src, alt: data.image.alt || data.name } : undefined,
        count: data.count || 0,
        parent: data.parent || 0,
      };
    } catch (error) {
      console.error('Failed to fetch category:', error);
      return null;
    }
  }
}

export const categoriesService = new CategoriesService();
