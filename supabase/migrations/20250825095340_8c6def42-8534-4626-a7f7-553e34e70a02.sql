-- Remove the shortcuts category from the database
DELETE FROM wc_categories 
WHERE name = 'الاختصارات';

-- Also remove any product associations with this category if they exist
DELETE FROM wc_product_categories 
WHERE category_id IN (
  SELECT id FROM wc_categories WHERE name = 'الاختصارات'
);