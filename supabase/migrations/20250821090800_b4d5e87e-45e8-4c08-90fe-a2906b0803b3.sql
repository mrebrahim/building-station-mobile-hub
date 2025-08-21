-- Create storage bucket for partner logos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('partner-logos', 'partner-logos', true, 5242880, ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml']);

-- Create RLS policies for partner logos bucket
CREATE POLICY "Partner logos are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'partner-logos');

CREATE POLICY "Admins can upload partner logos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'partner-logos');

CREATE POLICY "Admins can update partner logos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'partner-logos');

CREATE POLICY "Admins can delete partner logos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'partner-logos');