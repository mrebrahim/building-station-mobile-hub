-- Force update all categories product_count
UPDATE wc_categories 
SET product_count = COALESCE((
  SELECT COUNT(DISTINCT pc.product_id) 
  FROM wc_product_categories pc 
  WHERE pc.category_id = wc_categories.id
), 0);

-- Enable replica identity for realtime updates (if not already set)
DO $$ 
BEGIN
  ALTER TABLE wc_categories REPLICA IDENTITY FULL;
EXCEPTION
  WHEN OTHERS THEN
    NULL;
END $$;

DO $$ 
BEGIN
  ALTER TABLE wc_products REPLICA IDENTITY FULL;
EXCEPTION
  WHEN OTHERS THEN
    NULL;
END $$;

DO $$ 
BEGIN
  ALTER TABLE wc_product_categories REPLICA IDENTITY FULL;
EXCEPTION
  WHEN OTHERS THEN
    NULL;
END $$;