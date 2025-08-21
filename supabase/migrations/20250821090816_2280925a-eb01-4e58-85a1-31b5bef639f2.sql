-- Update partner logos with Supabase Storage URLs
UPDATE partners 
SET logo_url = 'https://aegclwuugreshufvisax.supabase.co/storage/v1/object/public/partner-logos/arka-logo.png'
WHERE name = 'ARKA';

UPDATE partners 
SET logo_url = 'https://aegclwuugreshufvisax.supabase.co/storage/v1/object/public/partner-logos/itaca-logo.png'
WHERE name = 'ITACA';

UPDATE partners 
SET logo_url = 'https://aegclwuugreshufvisax.supabase.co/storage/v1/object/public/partner-logos/asteeno-logo.png'
WHERE name = 'Asteeno Ceramics';