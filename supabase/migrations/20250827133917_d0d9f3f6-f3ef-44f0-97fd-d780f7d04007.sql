-- إضافة العلاقة المفقودة بين جداول المنتجات والفئات
ALTER TABLE public.wc_product_categories 
ADD CONSTRAINT fk_wc_product_categories_category_id 
FOREIGN KEY (category_id) REFERENCES public.wc_categories(id) ON DELETE CASCADE;

ALTER TABLE public.wc_product_categories 
ADD CONSTRAINT fk_wc_product_categories_product_id 
FOREIGN KEY (product_id) REFERENCES public.wc_products(id) ON DELETE CASCADE;