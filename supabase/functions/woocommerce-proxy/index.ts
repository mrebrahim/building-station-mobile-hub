
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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const endpoint = url.searchParams.get('endpoint');
    const params = url.searchParams.get('params');
    
    if (!endpoint) {
      return new Response(
        JSON.stringify({ error: 'Missing endpoint parameter' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('WooCommerce Proxy - Endpoint:', endpoint);
    console.log('WooCommerce Proxy - Params:', params);

    // Build the WooCommerce API URL
    let woocommerceUrl = `${WC_BASE_URL}${endpoint}`;
    if (params) {
      woocommerceUrl += `?${params}`;
    }

    console.log('WooCommerce Proxy - Making request to:', woocommerceUrl);

    // Make the request to WooCommerce API
    const response = await fetch(woocommerceUrl, {
      method: req.method,
      headers: {
        'Authorization': createAuthHeader(),
        'Content-Type': 'application/json',
        'User-Agent': 'Supabase-Edge-Function'
      },
      body: req.method !== 'GET' ? await req.text() : undefined,
    });

    console.log('WooCommerce API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('WooCommerce API error:', {
        status: response.status,
        statusText: response.statusText,
        errorText,
        url: woocommerceUrl
      });
      
      return new Response(
        JSON.stringify({ 
          error: `WooCommerce API error: ${response.status} - ${response.statusText}`,
          details: errorText
        }),
        { 
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const data = await response.json();
    console.log('WooCommerce API response data count:', Array.isArray(data) ? data.length : 'single object');

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('WooCommerce Proxy error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
