-- Enable real-time for WooCommerce tables
ALTER TABLE public.wc_categories REPLICA IDENTITY FULL;
ALTER TABLE public.wc_products REPLICA IDENTITY FULL;
ALTER TABLE public.wc_product_categories REPLICA IDENTITY FULL;
ALTER TABLE public.wc_sync_logs REPLICA IDENTITY FULL;

-- Add tables to supabase_realtime publication for real-time updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.wc_categories;
ALTER PUBLICATION supabase_realtime ADD TABLE public.wc_products;
ALTER PUBLICATION supabase_realtime ADD TABLE public.wc_product_categories;
ALTER PUBLICATION supabase_realtime ADD TABLE public.wc_sync_logs;