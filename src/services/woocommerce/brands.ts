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

const transformBrand = (apiBrand: any): Brand => {
  let imageData: Brand['image'] | undefined;
  const rawImage = apiBrand.image;
  if (rawImage && typeof rawImage === 'object' && rawImage.src && rawImage.src !== '') {
    imageData = {
      id: rawImage.id || 0,
      src: rawImage.src,
      alt: rawImage.alt || apiBrand.name,
    };
  } else if (apiBrand.thumbnail && typeof apiBrand.thumbnail === 'string' && apiBrand.thumbnail !== '') {
    imageData = { id: 0, src: apiBrand.thumbnail, alt: apiBrand.name };
  }

  return {
    id: apiBrand.id,
    name: apiBrand.name,
    slug: apiBrand.slug,
    description: apiBrand.description || '',
    image: imageData,
    count: apiBrand.count || 0,
  };
};

const fetchBrandsFromProxy = async (params: BrandParams, namespace?: string): Promise<any[]> => {
  const url = new URL('/api/woocommerce', window.location.origin);
  url.searchParams.append('endpoint', 'products/brands');
  if (namespace) url.searchParams.append('namespace', namespace);
  if (params.page) url.searchParams.append('page', String(params.page));
  if (params.per_page) url.searchParams.append('per_page', String(params.per_page));
  url.searchParams.append('orderby', params.orderby || 'name');
  url.searchParams.append('order', params.order || 'asc');

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Brands proxy failed: ${res.status}`);
  const data = await res.json();
  return Array.isArray(data) ? data : [];
};

export class BrandsService {
  async getBrands(params: BrandParams = {}): Promise<Brand[]> {
    try {
      const data = await fetchBrandsFromProxy(params);
      return data.map(transformBrand);
    } catch (error: any) {
      console.error('Brands fetch failed:', error?.message);
      return [];
    }
  }
}

export const brandsService = new BrandsService();
