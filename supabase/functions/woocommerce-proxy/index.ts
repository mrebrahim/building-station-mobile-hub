import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const WC_BASE_URL = 'https://building-station.com/wp-json/wc/v3';

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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'غير مصرح' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      console.error('Authentication failed:', authError);
      return new Response(
        JSON.stringify({ error: 'غير مصرح' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse the request body to get the endpoint and parameters
    const requestBody = await req.json();
    const { endpoint, params, method = 'GET', body } = requestBody;
    
    if (!endpoint) {
      console.error('Missing endpoint in request body');
      return new Response(
        JSON.stringify({ error: 'معامل نقطة النهاية مفقود' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('WooCommerce Proxy - User:', user.id, 'Endpoint:', endpoint);

    // Build the WooCommerce API URL
    let woocommerceUrl = `${WC_BASE_URL}${endpoint}`;
    if (params) {
      woocommerceUrl += `?${params}`;
    }

    // Make the request to WooCommerce API
    const response = await fetch(woocommerceUrl, {
      method: method,
      headers: {
        'Authorization': createAuthHeader(),
        'Content-Type': 'application/json',
        'User-Agent': 'Supabase-Edge-Function'
      },
      body: method !== 'GET' && body ? JSON.stringify(body) : undefined,
    });

    console.log('WooCommerce API response status:', response.status);

    if (!response.ok) {
      console.error('WooCommerce API error:', response.status, response.statusText);
      
      return new Response(
        JSON.stringify({ 
          error: 'فشل طلب WooCommerce',
          code: 'WC_API_ERROR'
        }),
        { 
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const data = await response.json();
    console.log('WooCommerce API success - data count:', Array.isArray(data) ? data.length : 'single object');

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('WooCommerce Proxy error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'حدث خطأ في الخادم',
        code: 'INTERNAL_ERROR'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
