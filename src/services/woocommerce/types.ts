
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

export interface ProductParams {
  page?: number;
  per_page?: number;
  category?: string;
  search?: string;
  orderby?: string;
  order?: string;
  featured?: boolean;
  exclude?: number[];
}

export interface CategoryParams {
  page?: number;
  per_page?: number;
  orderby?: string;
  order?: string;
}
