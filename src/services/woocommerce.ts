
const WC_BASE_URL = 'https://building-station.com/wp-json/wc/v3';
const CONSUMER_KEY = 'ck_549af4e85bfb7e60c35d627e71620088a2a98850';
const CONSUMER_SECRET = 'cs_9988845035f54ac5e79c2155c099a977c8fc56d1';

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
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': createAuthHeader(),
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`WooCommerce API error: ${response.status}`);
    }

    return response.json();
  }

  async getProducts(params: {
    page?: number;
    per_page?: number;
    category?: string;
    search?: string;
    orderby?: string;
    order?: string;
  } = {}): Promise<Product[]> {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.per_page) searchParams.append('per_page', params.per_page.toString());
    if (params.category) searchParams.append('category', params.category);
    if (params.search) searchParams.append('search', params.search);
    if (params.orderby) searchParams.append('orderby', params.orderby);
    if (params.order) searchParams.append('order', params.order);

    const queryString = searchParams.toString();
    const endpoint = `/products${queryString ? `?${queryString}` : ''}`;
    
    return this.makeRequest(endpoint);
  }

  async getProduct(id: number): Promise<Product> {
    return this.makeRequest(`/products/${id}`);
  }

  async getCategories(params: {
    page?: number;
    per_page?: number;
    orderby?: string;
    order?: string;
  } = {}): Promise<Category[]> {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.per_page) searchParams.append('per_page', params.per_page.toString());
    if (params.orderby) searchParams.append('orderby', params.orderby);
    if (params.order) searchParams.append('order', params.order);

    const queryString = searchParams.toString();
    const endpoint = `/products/categories${queryString ? `?${queryString}` : ''}`;
    
    return this.makeRequest(endpoint);
  }

  async createOrder(orderData: Order) {
    return this.makeRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }
}

export const wooCommerceService = new WooCommerceService();
