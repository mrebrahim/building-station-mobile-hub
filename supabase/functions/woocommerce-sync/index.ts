import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const WC_BASE_URL = 'https://building-station.com/wp-json/wc/v3';
const CONSUMER_KEY = 'ck_cd0cb2feaca27a3c317b1c1d33689f29e0d15029';
const CONSUMER_SECRET = 'cs_378a4cbddf6425f9e88d1d32bdb47fac18cf27d3';

// Create Basic Auth header
const createAuthHeader = () => {
  const credentials = btoa(`${CONSUMER_KEY}:${CONSUMER_SECRET}`);
  return `Basic ${credentials}`;
};

// Fetch all categories with pagination
async function fetchAllCategories() {
  const allCategories = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    try {
      const response = await fetch(`${WC_BASE_URL}/products/categories?per_page=100&page=${page}`, {
        headers: {
          'Authorization': createAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error(`Failed to fetch categories page ${page}:`, response.statusText);
        break;
      }

      const categories = await response.json();
      allCategories.push(...categories);

      // Check if we have more pages
      const totalPages = response.headers.get('X-WP-TotalPages');
      hasMore = totalPages ? page < parseInt(totalPages) : categories.length === 100;
      page++;
    } catch (error) {
      console.error(`Error fetching categories page ${page}:`, error);
      break;
    }
  }

  return allCategories;
}

// Fetch all products with pagination
async function fetchAllProducts() {
  const allProducts = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    try {
      const response = await fetch(`${WC_BASE_URL}/products?per_page=100&page=${page}`, {
        headers: {
          'Authorization': createAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error(`Failed to fetch products page ${page}:`, response.statusText);
        break;
      }

      const products = await response.json();
      allProducts.push(...products);

      // Check if we have more pages
      const totalPages = response.headers.get('X-WP-TotalPages');
      hasMore = totalPages ? page < parseInt(totalPages) : products.length === 100;
      page++;
    } catch (error) {
      console.error(`Error fetching products page ${page}:`, error);
      break;
    }
  }

  return allProducts;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🔄 Starting WooCommerce data synchronization...');
    
    const syncStartTime = new Date().toISOString();
    
    // Fetch all data in parallel
    const [categories, products] = await Promise.all([
      fetchAllCategories(),
      fetchAllProducts()
    ]);

    console.log(`📦 Fetched ${categories.length} categories and ${products.length} products`);

    // Transform categories
    const transformedCategories = categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      image: cat.image && cat.image.src ? {
        id: cat.image.id || 0,
        src: cat.image.src,
        alt: cat.image.alt || cat.name
      } : null,
      count: cat.count,
      parent: cat.parent || 0
    }));

    // Transform products and link to categories
    const transformedProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      regular_price: product.regular_price,
      sale_price: product.sale_price,
      description: product.description,
      short_description: product.short_description,
      sku: product.sku,
      images: product.images || [],
      categories: product.categories || [],
      stock_status: product.stock_status,
      manage_stock: product.manage_stock,
      stock_quantity: product.stock_quantity,
      featured: product.featured,
      date_created: product.date_created,
      date_modified: product.date_modified
    }));

    const syncResult = {
      success: true,
      timestamp: syncStartTime,
      categories: {
        total: transformedCategories.length,
        new: transformedCategories.filter(cat => cat.count > 0).length,
        data: transformedCategories
      },
      products: {
        total: transformedProducts.length,
        featured: transformedProducts.filter(p => p.featured).length,
        in_stock: transformedProducts.filter(p => p.stock_status === 'instock').length,
        data: transformedProducts
      }
    };

    console.log('✅ WooCommerce sync completed successfully');
    console.log(`📊 Categories: ${syncResult.categories.total} total, ${syncResult.categories.new} with products`);
    console.log(`📊 Products: ${syncResult.products.total} total, ${syncResult.products.featured} featured, ${syncResult.products.in_stock} in stock`);

    return new Response(JSON.stringify(syncResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ WooCommerce sync failed:', error);
    
    const errorResult = {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
      details: error.stack
    };

    return new Response(JSON.stringify(errorResult), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});