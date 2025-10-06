-- تحديث عداد المنتجات لجميع الفئات بناءً على عدد المنتجات الفعلية
UPDATE wc_categories 
SET product_count = (
  SELECT COUNT(DISTINCT pc.product_id) 
  FROM wc_product_categories pc 
  WHERE pc.category_id = wc_categories.id
);

-- إنشاء دالة لتحديث عداد المنتجات تلقائياً
CREATE OR REPLACE FUNCTION update_category_product_count()
RETURNS TRIGGER AS $$
BEGIN
  -- تحديث عداد المنتجات للفئة المتأثرة
  UPDATE wc_categories 
  SET product_count = (
    SELECT COUNT(DISTINCT pc.product_id) 
    FROM wc_product_categories pc 
    WHERE pc.category_id = COALESCE(NEW.category_id, OLD.category_id)
  )
  WHERE id = COALESCE(NEW.category_id, OLD.category_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- إنشاء trigger لتحديث العداد تلقائياً عند إضافة أو حذف منتج من فئة
DROP TRIGGER IF EXISTS trigger_update_category_product_count ON wc_product_categories;
CREATE TRIGGER trigger_update_category_product_count
AFTER INSERT OR DELETE ON wc_product_categories
FOR EACH ROW
EXECUTE FUNCTION update_category_product_count();