import { Category, CategoryParams } from './types';

const SUPABASE_URL = 'https://cyyeydswwbbqhehbhhbw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5eWV5ZHN3d2JicWhlaGJoaGJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2OTMxODQsImV4cCI6MjA4OTI2OTE4NH0.6qt4-bYdMAmIdnWqJ1x4AWeYnj_DFO0Ugn34ROTnRwc';

const supabaseFetch = async (query: string): Promise<any[]> => {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${query}`, {
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    }
  });
  if (!res.ok) throw new Error(`Supabase error: ${res.status}`);
  return res.json();
};

const transform = (cat: any): Category => ({
  id: cat.id,
  name: cat.name,
  slug: cat.slug || '',
  description: cat.description || '',
  image: cat.image_url ? { id: 0, src: cat.image_url, alt: cat.image_alt || cat.name } : undefined,
  count: cat.product_count || 0,
  parent: cat.parent_id || 0,
});

export class CategoriesService {
  async getCategories(params: CategoryParams = {}): Promise<Category[]> {
    try {
      let query = 'wc_categories?order=name.asc';
      if (params.parent !== undefined) query += `&parent_id=eq.${params.parent}`;
      if (params.per_page) query += `&limit=${params.per_page}`;

      const data = await supabaseFetch(query);
      console.log(`✅ Supabase categories: ${data.length}`);
      return data.map(transform);
    } catch (error) {
      console.error('Supabase failed, using proxy:', error);
      return this.getFromProxy(params);
    }
  }

  private async getFromProxy(params: CategoryParams = {}): Promise<Category[]> {
    try {
      const url = new URL('/api/woocommerce', window.location.origin);
      url.searchParams.append('endpoint', 'products/categories');
      url.searchParams.append('per_page', String(params.per_page || 100));
      if (params.parent !== undefined) url.searchParams.append('parent', String(params.parent));
      url.searchParams.append('orderby', 'name');
      url.searchParams.append('order', 'asc');
      const res = await fetch(url.toString());
      const data = await res.json();
      return data.map((cat: any) => ({
        id: cat.id, name: cat.name, slug: cat.slug,
        description: cat.description || '',
        image: cat.image ? { id: cat.image.id, src: cat.image.src, alt: cat.image.alt || cat.name } : undefined,
        count: cat.count || 0, parent: cat.parent || 0,
      }));
    } catch (error) {
      console.error('Proxy also failed:', error);
      return [];
    }
  }

  async getFeaturedCategories(limit: number = 12): Promise<Category[]> {
    try {
      const data = await supabaseFetch(`wc_categories?parent_id=eq.0&order=menu_order.asc&limit=${limit}`);
      return data.map(transform);
    } catch {
      const all = await this.getCategories({ per_page: 100 });
      return all.filter(c => c.parent === 0).slice(0, limit);
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
      const data = await supabaseFetch(`wc_categories?id=eq.${id}&limit=1`);
      return data.length ? transform(data[0]) : null;
    } catch { return null; }
  }
}

export const categoriesService = new CategoriesService();
