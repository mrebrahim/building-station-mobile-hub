-- تفعيل RLS لجميع الجداول
ALTER TABLE public.wc_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wc_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wc_product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wc_sync_logs ENABLE ROW LEVEL SECURITY;

-- إنشاء سياسات للقراءة العامة للجداول الأساسية
CREATE POLICY "Categories are viewable by everyone" 
ON public.wc_categories 
FOR SELECT 
USING (true);

CREATE POLICY "Products are viewable by everyone" 
ON public.wc_products 
FOR SELECT 
USING (true);

CREATE POLICY "Product categories are viewable by everyone" 
ON public.wc_product_categories 
FOR SELECT 
USING (true);

CREATE POLICY "Sync logs are viewable by everyone" 
ON public.wc_sync_logs 
FOR SELECT 
USING (true);