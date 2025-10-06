-- حذف منتجات ITACA من قاعدة البيانات
-- أولاً: حذف العلاقات من جدول wc_product_categories
DELETE FROM wc_product_categories 
WHERE product_id IN (
  SELECT id FROM wc_products WHERE name ILIKE '%ITACA%'
);

-- ثانياً: حذف المنتجات نفسها
DELETE FROM wc_products 
WHERE name ILIKE '%ITACA%';

-- تحديث عدد المنتجات في الفئات المتأثرة
UPDATE wc_categories 
SET product_count = (
  SELECT COUNT(DISTINCT pc.product_id) 
  FROM wc_product_categories pc 
  WHERE pc.category_id = wc_categories.id
) 
WHERE id IN (
  SELECT DISTINCT category_id 
  FROM wc_product_categories
);