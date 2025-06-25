
import { supabase } from '@/integrations/supabase/client';

export class WooCommerceAPI {
  async makeRequest(endpoint: string, options: RequestInit = {}) {
    console.log('Making WooCommerce API request via Edge Function to endpoint:', endpoint);
    console.log('Request options:', options);
    
    try {
      // Extract search params from endpoint if they exist
      const [path, searchParams] = endpoint.split('?');
      
      // Use Supabase Edge Function as proxy
      const { data, error } = await supabase.functions.invoke('woocommerce-proxy', {
        body: {
          endpoint: path,
          params: searchParams || '',
          method: options.method || 'GET',
          body: options.body
        }
      });

      if (error) {
        console.error('Edge Function error:', error);
        throw new Error(`Edge Function error: ${error.message}`);
      }

      console.log('WooCommerce API response via Edge Function:', data);
      return data;
    } catch (error) {
      console.error('WooCommerce API request failed via Edge Function:', {
        error: error.message,
        endpoint
      });
      throw error;
    }
  }
}

export const apiClient = new WooCommerceAPI();
