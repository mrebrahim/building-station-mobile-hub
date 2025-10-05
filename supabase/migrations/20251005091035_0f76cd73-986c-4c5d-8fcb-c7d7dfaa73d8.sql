-- Update product_count for all categories based on actual product relationships
UPDATE wc_categories 
SET product_count = COALESCE((
  SELECT COUNT(DISTINCT pc.product_id) 
  FROM wc_product_categories pc 
  WHERE pc.category_id = wc_categories.id
), 0);

-- Create function to update product count
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
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update product_count
DROP TRIGGER IF EXISTS trigger_update_category_product_count ON wc_product_categories;
CREATE TRIGGER trigger_update_category_product_count
AFTER INSERT OR DELETE ON wc_product_categories
FOR EACH ROW
EXECUTE FUNCTION update_category_product_count();