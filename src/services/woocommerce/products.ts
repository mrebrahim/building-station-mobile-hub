
import { supabase } from '@/integrations/supabase/client';
import { Product, ProductParams } from './types';
import { mockProducts } from '../mockData';

export class ProductsService {
  async getProducts(params: ProductParams = {}): Promise<Product[]> {
    try {
      console.log('Fetching products from local database with params:', params);
      
      let query = supabase
        .from('wc_products')
        .select('*');

      // For category filtering, we need a separate approach
      if (params.category) {
        // Get products that belong to the category through the junction table
        const categoryId = parseInt(params.category);
        const { data: productIds } = await supabase
          .from('wc_product_categories')
          .select('product_id')
          .eq('category_id', categoryId);
        
        if (productIds && productIds.length > 0) {
          const ids = productIds.map(p => p.product_id);
          query = query.in('id', ids);
        } else {
          // No products in this category, return empty
          return [];
        }
      }

      // Filter by featured status
      if (params.featured !== undefined) {
        query = query.eq('featured', params.featured);
      }

      // Apply ordering
      if (params.orderby) {
        const ascending = params.order === 'asc';
        let orderField = params.orderby;
        
        // Map API order fields to database fields
        if (orderField === 'date') orderField = 'date_created';
        else if (orderField === 'modified') orderField = 'date_modified';
        
        query = query.order(orderField, { ascending });
      } else {
        query = query.order('date_modified', { ascending: false });
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
        console.error('Error fetching products from database:', error);
        throw error;
      }
      
      // Transform database format to expected format
      const transformedProducts = await Promise.all((data || []).map(async (product) => {
        console.log('Processing product from DB:', product.name, 'Image URL:', product.image_url);
        
        // Get categories for this product
        const { data: productCategories } = await supabase
          .from('wc_product_categories')
          .select(`
            category_id,
            wc_categories(id, name, slug)
          `)
          .eq('product_id', product.id);
        
        const categories = (productCategories || []).map((pc: any) => ({
          id: pc.wc_categories?.id || 0,
          name: pc.wc_categories?.name || 'Unknown',
          slug: pc.wc_categories?.slug || ''
        }));
        
        return {
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price ? product.price.toString() : '0',
          regular_price: product.regular_price ? product.regular_price.toString() : '0',
          sale_price: product.sale_price ? product.sale_price.toString() : '',
          description: product.description || '',
          short_description: product.short_description || '',
          sku: product.sku || '',
          images: product.image_url ? [{
            id: 0,
            src: product.image_url,
            alt: product.image_alt || product.name
          }] : [],
          categories: categories,
          stock_status: product.stock_status || 'instock',
          manage_stock: product.manage_stock || false,
          stock_quantity: product.stock_quantity || null,
          featured: product.featured || false
        };
      }));
      
      console.log('Successfully fetched products from database:', transformedProducts.length);
      return transformedProducts;
    } catch (error) {
      console.log('Database products failed, using mock products due to error:', error.message);
      let filteredProducts = [...mockProducts];
      
      // Apply filters to mock data
      if (params.category) {
        filteredProducts = filteredProducts.filter(p => 
          p.categories.some(c => c.id.toString() === params.category)
        );
      }
      
      if (params.featured !== undefined) {
        filteredProducts = filteredProducts.filter(p => p.featured === params.featured);
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
      console.log('Fetching product by ID from database:', id);
      
      const { data, error } = await supabase
        .from('wc_products')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching product:', error);
        throw error;
      }
      
      if (!data) {
        throw new Error(`Product with id ${id} not found`);
      }
      
      // Get categories for this product
      const { data: productCategories } = await supabase
        .from('wc_product_categories')
        .select(`
          category_id,
          wc_categories(id, name, slug)
        `)
        .eq('product_id', data.id);
      
      const categories = (productCategories || []).map((pc: any) => ({
        id: pc.wc_categories?.id || 0,
        name: pc.wc_categories?.name || 'Unknown',
        slug: pc.wc_categories?.slug || ''
      }));
      
      const transformedProduct: Product = {
        id: data.id,
        name: data.name,
        slug: data.slug,
        price: data.price ? data.price.toString() : '0',
        regular_price: data.regular_price ? data.regular_price.toString() : '0',
        sale_price: data.sale_price ? data.sale_price.toString() : '',
        description: data.description || '',
        short_description: data.short_description || '',
        sku: data.sku || '',
        images: data.image_url ? [{
          id: 0,
          src: data.image_url,
          alt: data.image_alt || data.name
        }] : [],
        categories: categories,
        stock_status: data.stock_status || 'instock',
        manage_stock: data.manage_stock || false,
        stock_quantity: data.stock_quantity || null,
        featured: data.featured || false
      };
      
      console.log('Successfully fetched product by ID:', transformedProduct.name);
      return transformedProduct;
    } catch (error) {
      console.error('Failed to fetch product by ID:', error);
      // Try to find in mock data as fallback
      const mockProduct = mockProducts.find(p => p.id === id);
      if (!mockProduct) {
        throw new Error(`Product with id ${id} not found`);
      }
      return mockProduct;
    }
  }
}

export const productsService = new ProductsService();
