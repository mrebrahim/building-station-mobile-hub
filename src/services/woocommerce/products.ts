import { Product, ProductParams } from './types';
import { wcFetch } from '@/lib/wooProxy';

const transformProduct = (p: any): Product => ({
  id: p.id,
  name: p.name,
  slug: p.slug || '',
  price: p.price || '0',
  regular_price: p.regular_price || '0',
  sale_price: p.sale_price || '',
  description: p.description || '',
  short_description: p.short_description || '',
  sku: p.sku || '',
  images: (p.images || []).map((img: any) => ({ id: img.id, src: img.src, alt: img.alt || p.name })),
  categories: (p.categories || []).map((c: any) => ({ id: c.id, name: c.name, slug: c.slug })),
  stock_status: p.stock_status || 'instock',
  manage_stock: p.manage_stock || false,
  stock_quantity: p.stock_quantity || null,
  featured: p.featured || false,
  type: p.type || 'simple',
  attributes: p.attributes || [],
  variations: p.variations || [],
  price_html: p.price_html || '',
});

export class ProductsService {
  async getProducts(params: ProductParams = {}): Promise<Product[]> {
    try {
      const wcParams: Record<string, any> = {
        per_page: params.per_page || 20,
        page: params.page || 1,
        status: 'publish',
      };
      if (params.category) wcParams.category = params.category;
      if (params.featured !== undefined) wcParams.featured = params.featured;
      if (params.orderby) wcParams.orderby = params.orderby;
      if (params.order) wcParams.order = params.order;
      if (params.search) wcParams.search = params.search;
      if (params.exclude?.length) wcParams.exclude = params.exclude.join(',');

      const data = await wcFetch('products', wcParams);
      return Array.isArray(data) ? data.map(transformProduct) : [];
    } catch (error) {
      console.error('❌ WooCommerce products fetch failed:', error);
      return [];
    }
  }

  async getProduct(id: number): Promise<Product> {
    const data = await wcFetch(`products/${id}`);
    return transformProduct(data);
  }
}

export const productsService = new ProductsService();
