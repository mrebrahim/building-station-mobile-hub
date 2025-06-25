import { mockCategories, mockProducts } from './mockData';

const WC_BASE_URL = 'https://building-station.com/wp-json/wc/v3';
const CONSUMER_KEY = 'ck_cd0cb2feaca27a3c317b1c1d33689f29e0d15029';
const CONSUMER_SECRET = 'cs_378a4cbddf6425f9e88d1d32bdb47fac18cf27d3';

// Create Basic Auth header
const createAuthHeader = () => {
  const credentials = btoa(`${CONSUMER_KEY}:${CONSUMER_SECRET}`);
  return `Basic ${credentials}`;
};

export interface Product {
  id: number;
  name: string;
  slug: string;
  price: string;
  regular_price: string;
  sale_price: string;
  description: string;
  short_description: string;
  sku: string;
  images: Array<{
    id: number;
    src: string;
    alt: string;
  }>;
  categories: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  stock_status: string;
  manage_stock: boolean;
  stock_quantity: number;
  featured: boolean;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image?: {
    id: number;
    src: string;
    alt: string;
  };
  count: number;
}

export interface Order {
  billing: {
    first_name: string;
    last_name: string;
    address_1: string;
    address_2?: string;
    city: string;
    state?: string;
    postcode?: string;
    country: string;
    email: string;
    phone: string;
  };
  shipping: {
    first_name: string;
    last_name: string;
    address_1: string;
    address_2?: string;
    city: string;
    state?: string;
    postcode?: string;
    country: string;
  };
  line_items: Array<{
    product_id: number;
    quantity: number;
  }>;
  payment_method: string;
  payment_method_title: string;
  set_paid?: boolean;
}

class WooCommerceService {
  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${WC_BASE_URL}${endpoint}`;
    
    console.log('Making WooCommerce API request to:', url);
    console.log('Request options:', options);
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Authorization': createAuthHeader(),
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      console.log('WooCommerce API response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('WooCommerce API error details:', {
          status: response.status,
          statusText: response.statusText,
          errorText,
          url
        });
        throw new Error(`WooCommerce API error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log('WooCommerce API response data:', data);
      return data;
    } catch (error) {
      console.error('WooCommerce API request failed with detailed error:', {
        error: error.message,
        url,
        endpoint
      });
      throw error;
    }
  }

  async getProducts(params: {
    page?: number;
    per_page?: number;
    category?: string;
    search?: string;
    orderby?: string;
    order?: string;
    featured?: boolean;
    exclude?: number[];
  } = {}): Promise<Product[]> {
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
      
      return await this.makeRequest(endpoint);
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
      return await this.makeRequest(`/products/${id}`);
    } catch (error) {
      console.log('Using mock product due to API error');
      const product = mockProducts.find(p => p.id === id);
      if (!product) {
        throw new Error(`Product with id ${id} not found`);
      }
      return product;
    }
  }

  async getCategories(params: {
    page?: number;
    per_page?: number;
    orderby?: string;
    order?: string;
  } = {}): Promise<Category[]> {
    try {
      const searchParams = new URLSearchParams();
      
      if (params.page) searchParams.append('page', params.page.toString());
      if (params.per_page) searchParams.append('per_page', params.per_page.toString());
      if (params.orderby) searchParams.append('orderby', params.orderby);
      if (params.order) searchParams.append('order', params.order);

      const queryString = searchParams.toString();
      const endpoint = `/products/categories${queryString ? `?${queryString}` : ''}`;
      
      console.log('Attempting to fetch categories from endpoint:', endpoint);
      const data = await this.makeRequest(endpoint);
      
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

  async createOrder(orderData: Order) {
    return this.makeRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }
}

export const wooCommerceService = new WooCommerceService();
