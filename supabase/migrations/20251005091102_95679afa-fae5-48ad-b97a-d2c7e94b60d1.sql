-- Fix search_path for the new function
DROP FUNCTION IF EXISTS update_category_product_count() CASCADE;

CREATE OR REPLACE FUNCTION update_category_product_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the category's product count
  IF TG_OP = 'INSERT' THEN
    UPDATE wc_categories 
    SET product_count = (
      SELECT COUNT(DISTINCT product_id) 
      FROM wc_product_categories 
      WHERE category_id = NEW.category_id
    )
    WHERE id = NEW.category_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE wc_categories 
    SET product_count = (
      SELECT COUNT(DISTINCT product_id) 
      FROM wc_product_categories 
      WHERE category_id = OLD.category_id
    )
    WHERE id = OLD.category_id;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Recreate trigger
DROP TRIGGER IF EXISTS trigger_update_category_product_count ON wc_product_categories;
CREATE TRIGGER trigger_update_category_product_count
AFTER INSERT OR DELETE ON wc_product_categories
FOR EACH ROW
EXECUTE FUNCTION update_category_product_count();

-- Fix search_path for existing update_updated_at_column function
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;