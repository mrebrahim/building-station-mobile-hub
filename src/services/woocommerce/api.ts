
import { WC_BASE_URL, createAuthHeader } from './config';

export class WooCommerceAPI {
  async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${WC_BASE_URL}${endpoint}`;
    
    console.log('Making WooCommerce API request to:', url);
    console.log('Request options:', options);
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Authorization': createAuthHeader(),
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      console.log('WooCommerce API response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('WooCommerce API error details:', {
          status: response.status,
          statusText: response.statusText,
          errorText,
          url
        });
        throw new Error(`WooCommerce API error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log('WooCommerce API response data:', data);
      return data;
    } catch (error) {
      console.error('WooCommerce API request failed with detailed error:', {
        error: error.message,
        url,
        endpoint
      });
      throw error;
    }
  }
}

export const apiClient = new WooCommerceAPI();
