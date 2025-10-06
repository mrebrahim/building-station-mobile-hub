-- Update product_count for all categories based on actual product associations
UPDATE wc_categories
SET product_count = COALESCE(
  (SELECT COUNT(DISTINCT pc.product_id)
   FROM wc_product_categories pc
   WHERE pc.category_id = wc_categories.id),
  0
)
WHERE product_count = 0;

-- Verify the update
SELECT id, name, product_count 
FROM wc_categories 
WHERE product_count > 0 
ORDER BY product_count DESC 
LIMIT 10;