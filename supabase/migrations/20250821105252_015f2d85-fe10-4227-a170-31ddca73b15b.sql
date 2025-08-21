-- Insert sample partners with their logo URLs
INSERT INTO partners (name, logo_url, website_url, is_active) VALUES 
('ARKA', '/src/assets/arka-logo.png', 'https://www.arka.com', true),
('ITACA', '/src/assets/itaca-logo.png', 'https://www.itaca.com', true),
('Asteeno Ceramics', '/src/assets/asteeno-logo.png', 'https://www.asteeno.com', true)
ON CONFLICT (name) DO UPDATE SET 
logo_url = EXCLUDED.logo_url,
website_url = EXCLUDED.website_url,
updated_at = now();