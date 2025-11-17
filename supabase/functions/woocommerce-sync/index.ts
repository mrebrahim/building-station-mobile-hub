import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const WC_BASE_URL = 'https://building-station.com/wp-json/wc/v3';

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// Create Basic Auth header using environment variables
const createAuthHeader = () => {
  const consumerKey = Deno.env.get('WC_CONSUMER_KEY');
  const consumerSecret = Deno.env.get('WC_CONSUMER_SECRET');
  
  if (!consumerKey || !consumerSecret) {
    throw new Error('WooCommerce credentials not configured');
  }
  
  const credentials = btoa(`${consumerKey}:${consumerSecret}`);
  return `Basic ${credentials}`;
};

// Create sync log entry
async function createSyncLog(syncType: string, status: string, message?: string, errors?: any) {
  const logData = {
    sync_type: syncType,
    status: status,
    message: message || null,
    errors: errors || null,
    completed_at: status !== 'in_progress' ? new Date().toISOString() : null
  };

  const { error } = await supabase
    .from('wc_sync_logs')
    .insert(logData);

  if (error) {
    console.error('Failed to create sync log:', error);
  }
}

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

// Sync categories to database
async function syncCategoriesToDB(categories: any[]) {
  const syncErrors = [];
  let successCount = 0;

  for (const category of categories) {
    try {
      const categoryData = {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        image_url: category.image ? category.image.src : null,
        image_alt: category.image ? category.image.alt || category.name : null,
        parent_id: category.parent || 0,
        menu_order: category.menu_order || 0,
        product_count: category.count || 0
      };

      const { error } = await supabase
        .from('wc_categories')
        .upsert(categoryData, { onConflict: 'id' });

      if (error) {
        console.error(`Failed to sync category ${category.id}:`, error);
        syncErrors.push({ categoryId: category.id, error: error.message });
      } else {
        successCount++;
      }
    } catch (error) {
      console.error(`Error processing category ${category.id}:`, error);
      syncErrors.push({ categoryId: category.id, error: error.message });
    }
  }

  return { successCount, errors: syncErrors };
}

// Sync products to database
async function syncProductsToDB(products: any[]) {
  const syncErrors = [];
  let successCount = 0;

  for (const product of products) {
    try {
      // Skip draft products
      if (product.status === 'draft') {
        continue;
      }

      const productData = {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description || '',
        short_description: product.short_description || '',
        sku: product.sku || null,
        price: product.price ? parseFloat(product.price) : null,
        regular_price: product.regular_price ? parseFloat(product.regular_price) : null,
        sale_price: product.sale_price ? parseFloat(product.sale_price) : null,
        stock_status: product.stock_status || 'instock',
        stock_quantity: product.stock_quantity || null,
        manage_stock: product.manage_stock || false,
        featured: product.featured || false,
        image_url: product.images && product.images.length > 0 ? product.images[0].src : null,
        image_alt: product.images && product.images.length > 0 ? product.images[0].alt || product.name : null,
        date_created: product.date_created || null,
        date_modified: product.date_modified || null
      };

      const { error: productError } = await supabase
        .from('wc_products')
        .upsert(productData, { onConflict: 'id' });

      if (productError) {
        console.error(`Failed to sync product ${product.id}:`, productError);
        syncErrors.push({ productId: product.id, error: productError.message });
        continue;
      }

      // Sync product categories
      if (product.categories && product.categories.length > 0) {
        // First, delete existing category relationships
        await supabase
          .from('wc_product_categories')
          .delete()
          .eq('product_id', product.id);

        // Then insert new relationships
        const categoryRelations = product.categories.map((cat: any) => ({
          product_id: product.id,
          category_id: cat.id
        }));

        const { error: categoryError } = await supabase
          .from('wc_product_categories')
          .insert(categoryRelations);

        if (categoryError) {
          console.error(`Failed to sync product categories for ${product.id}:`, categoryError);
          syncErrors.push({ productId: product.id, error: `Category sync: ${categoryError.message}` });
        }
      }

      successCount++;
    } catch (error) {
      console.error(`Error processing product ${product.id}:`, error);
      syncErrors.push({ productId: product.id, error: error.message });
    }
  }

  return { successCount, errors: syncErrors };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const syncId = crypto.randomUUID();
  console.log(`🔄 Starting WooCommerce data synchronization [${syncId}]...`);
  
  // Create initial sync log
  await createSyncLog('full', 'in_progress', `Started sync ${syncId}`);

  try {
    const syncStartTime = new Date().toISOString();
    
    // Fetch all data in parallel
    console.log('📡 Fetching data from WooCommerce API...');
    const [categories, products] = await Promise.all([
      fetchAllCategories(),
      fetchAllProducts()
    ]);

    console.log(`📦 Fetched ${categories.length} categories and ${products.length} products`);

    // Sync categories to database
    console.log('💾 Syncing categories to database...');
    const categoryResult = await syncCategoriesToDB(categories);
    console.log(`✅ Categories: ${categoryResult.successCount} synced, ${categoryResult.errors.length} errors`);

    // Sync products to database
    console.log('💾 Syncing products to database...');
    const productResult = await syncProductsToDB(products);
    console.log(`✅ Products: ${productResult.successCount} synced, ${productResult.errors.length} errors`);

    const allErrors = [...categoryResult.errors, ...productResult.errors];
    const hasErrors = allErrors.length > 0;

    // Create final sync log
    await createSyncLog(
      'full',
      hasErrors ? 'error' : 'success',
      `Sync ${syncId} completed. Categories: ${categoryResult.successCount}/${categories.length}, Products: ${productResult.successCount}/${products.filter(p => p.status !== 'draft').length}`,
      hasErrors ? allErrors : null
    );

    const syncResult = {
      success: !hasErrors,
      syncId: syncId,
      timestamp: syncStartTime,
      categories: {
        total: categories.length,
        synced: categoryResult.successCount,
        errors: categoryResult.errors.length
      },
      products: {
        total: products.filter(p => p.status !== 'draft').length,
        synced: productResult.successCount,
        errors: productResult.errors.length,
        featured: products.filter(p => p.featured && p.status !== 'draft').length,
        in_stock: products.filter(p => p.stock_status === 'instock' && p.status !== 'draft').length
      },
      errors: hasErrors ? allErrors : []
    };

    if (hasErrors) {
      console.warn(`⚠️ WooCommerce sync completed with ${allErrors.length} errors`);
    } else {
      console.log('✅ WooCommerce sync completed successfully');
    }

    console.log(`📊 Final Stats - Categories: ${categoryResult.successCount}/${categories.length}, Products: ${productResult.successCount}/${products.filter(p => p.status !== 'draft').length}`);

    return new Response(JSON.stringify(syncResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ WooCommerce sync failed:', error);
    
    await createSyncLog(
      'full',
      'error',
      `Sync ${syncId} failed: ${error.message}`,
      { error: error.message, stack: error.stack }
    );
    
    const errorResult = {
      success: false,
      syncId: syncId,
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