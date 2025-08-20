import { supabase } from "@/integrations/supabase/client";

export interface Partner {
  id: string;
  name: string;
  logo_url: string;
  website_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const partnersService = {
  async getActivePartners(): Promise<Partner[]> {
    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching partners:', error);
      throw error;
    }

    return data || [];
  }
};