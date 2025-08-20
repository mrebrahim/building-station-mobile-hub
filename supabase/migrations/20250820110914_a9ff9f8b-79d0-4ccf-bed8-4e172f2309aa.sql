-- Create partners table
CREATE TABLE public.partners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  website_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (partners should be visible to everyone)
CREATE POLICY "Partners are viewable by everyone" 
ON public.partners 
FOR SELECT 
USING (is_active = true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_partners_updated_at
BEFORE UPDATE ON public.partners
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample partner data
INSERT INTO public.partners (name, logo_url, website_url) VALUES
('شركة التقنية المتقدمة', 'https://via.placeholder.com/200x100/FF0000/FFFFFF?text=شركة+التقنية', 'https://example.com'),
('مؤسسة الابتكار', 'https://via.placeholder.com/200x100/FF0000/FFFFFF?text=مؤسسة+الابتكار', 'https://example.com'),
('شركة المستقبل', 'https://via.placeholder.com/200x100/FF0000/FFFFFF?text=شركة+المستقبل', 'https://example.com'),
('التكنولوجيا الذكية', 'https://via.placeholder.com/200x100/FF0000/FFFFFF?text=التكنولوجيا+الذكية', 'https://example.com'),
('الحلول الرقمية', 'https://via.placeholder.com/200x100/FF0000/FFFFFF?text=الحلول+الرقمية', 'https://example.com');