-- Create categories table to store WooCommerce categories
CREATE TABLE public.wc_categories (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  image_alt TEXT,
  parent_id INTEGER DEFAULT 0,
  menu_order INTEGER DEFAULT 0,
  product_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create products table to store WooCommerce products
CREATE TABLE public.wc_products (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  short_description TEXT,
  sku TEXT,
  price DECIMAL(10,2),
  regular_price DECIMAL(10,2),
  sale_price DECIMAL(10,2),
  stock_status TEXT DEFAULT 'instock',
  stock_quantity INTEGER,
  manage_stock BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  image_url TEXT,
  image_alt TEXT,
  date_created TIMESTAMP WITH TIME ZONE,
  date_modified TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create product categories relationship table
CREATE TABLE public.wc_product_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id INTEGER NOT NULL,
  category_id INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(product_id, category_id)
);

-- Create sync logs table to track synchronization status
CREATE TABLE public.wc_sync_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sync_type TEXT NOT NULL, -- 'categories', 'products', 'full'
  status TEXT NOT NULL, -- 'success', 'error', 'in_progress'
  message TEXT,
  categories_count INTEGER DEFAULT 0,
  products_count INTEGER DEFAULT 0,
  errors JSONB,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better performance
CREATE INDEX idx_wc_categories_parent ON public.wc_categories(parent_id);
CREATE INDEX idx_wc_categories_slug ON public.wc_categories(slug);
CREATE INDEX idx_wc_products_slug ON public.wc_products(slug);
CREATE INDEX idx_wc_products_featured ON public.wc_products(featured);
CREATE INDEX idx_wc_products_stock_status ON public.wc_products(stock_status);
CREATE INDEX idx_wc_product_categories_product ON public.wc_product_categories(product_id);
CREATE INDEX idx_wc_product_categories_category ON public.wc_product_categories(category_id);
CREATE INDEX idx_wc_sync_logs_type ON public.wc_sync_logs(sync_type);
CREATE INDEX idx_wc_sync_logs_status ON public.wc_sync_logs(status);

-- Create trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_wc_categories_updated_at
  BEFORE UPDATE ON public.wc_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wc_products_updated_at
  BEFORE UPDATE ON public.wc_products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();