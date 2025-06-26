
import { apiClient } from './api';

interface Brand {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: {
    id: number;
    src: string;
    alt?: string;
  };
  count: number;
}

interface BrandParams {
  page?: number;
  per_page?: number;
  orderby?: string;
  order?: 'asc' | 'desc';
}

export class BrandsService {
  async getBrands(params: BrandParams = {}): Promise<Brand[]> {
    try {
      const searchParams = new URLSearchParams();
      
      if (params.page) searchParams.append('page', params.page.toString());
      if (params.per_page) searchParams.append('per_page', params.per_page.toString());
      if (params.orderby) searchParams.append('orderby', params.orderby);
      if (params.order) searchParams.append('order', params.order);

      const queryString = searchParams.toString();
      const endpoint = `/products/brands${queryString ? `?${queryString}` : ''}`;
      
      console.log('Attempting to fetch brands from endpoint:', endpoint);
      const data = await apiClient.makeRequest(endpoint);
      
      // Transform the API response to match our Brand interface
      const transformedBrands = data.map((apiBrand: any) => {
        console.log('Processing brand:', apiBrand.name, 'Image data:', apiBrand.image);
        
        // Handle different image data structures from WooCommerce API
        let imageData = undefined;
        if (apiBrand.image && 
            apiBrand.image.src && 
            apiBrand.image.src !== '' && 
            apiBrand.image._type !== 'undefined' &&
            apiBrand.image.value !== 'undefined') {
          imageData = {
            id: apiBrand.image.id || 0,
            src: apiBrand.image.src,
            alt: apiBrand.image.alt || apiBrand.name
          };
        }
        
        return {
          id: apiBrand.id,
          name: apiBrand.name,
          slug: apiBrand.slug,
          description: apiBrand.description,
          image: imageData,
          count: apiBrand.count || 0
        };
      });
      
      console.log('Successfully fetched and transformed brands:', transformedBrands);
      return transformedBrands;
    } catch (error) {
      console.log('Brands API failed, returning empty array due to error:', error.message);
      // Return empty array when API fails
      return [];
    }
  }
}

export const brandsService = new BrandsService();
