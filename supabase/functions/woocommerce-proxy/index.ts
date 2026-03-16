import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const WC_BASE_URL = 'https://building-station.com/wp-json/wc/v3';

// ✅ Endpoints مسموح بيها بدون Login
const PUBLIC_ENDPOINTS = [
  '/products/brands',
  '/products/categories',
  '/products',
  '/orders',  // ✅ إنشاء أوردر مسموح بدون login
  '/coupons',
];

const createAuthHeader = () => {
  const consumerKey = Deno.env.get('WC_CONSUMER_KEY');
  const consumerSecret = Deno.env.get('WC_CONSUMER_SECRET');
  if (!consumerKey || !consumerSecret) {
    throw new Error('WooCommerce credentials not configured');
  }
  const credentials = btoa(`${consumerKey}:${consumerSecret}`);
  return `Basic ${credentials}`;
};

const isPublicEndpoint = (endpoint: string, method: string): boolean => {
  // GET requests للمنتجات والفئات - عامة
  if (method === 'GET') {
    const getPublic = ['/products', '/products/categories', '/products/brands'];
    if (getPublic.some(pub => endpoint.startsWith(pub))) return true;
  }
  // POST /orders - إنشاء أوردر مسموح بدون login
  if (method === 'POST' && endpoint.startsWith('/orders')) return true;
  // GET /orders - لو محتاج تتبع أوردر
  if (method === 'GET' && endpoint.startsWith('/orders')) return true;
  return false;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestBody = await req.json();
    const { endpoint, params, method = 'GET', body } = requestBody;

    if (!endpoint) {
      return new Response(
        JSON.stringify({ error: 'Missing endpoint' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const isPublic = isPublicEndpoint(endpoint, method);
    console.log(`WooCommerce Proxy - ${method} ${endpoint} - Public: ${isPublic}`);

    // ✅ لو مش public - تحقق من Login
    if (!isPublic) {
      const authHeader = req.headers.get('Authorization');
      if (!authHeader) {
        return new Response(
          JSON.stringify({ error: 'غير مصرح' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // بناء الـ URL
    let woocommerceUrl = `${WC_BASE_URL}${endpoint}`;
    if (params) woocommerceUrl += `?${params}`;

    // الطلب لـ WooCommerce
    const response = await fetch(woocommerceUrl, {
      method: method,
      headers: {
        'Authorization': createAuthHeader(),
        'Content-Type': 'application/json',
        'User-Agent': 'BuildingStation-App/1.0'
      },
      body: method !== 'GET' && body ? JSON.stringify(body) : undefined,
    });

    console.log(`WooCommerce response: ${response.status}`);

    const responseText = await response.text();
    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      data = { error: responseText };
    }

    if (!response.ok) {
      console.error('WooCommerce error:', data);
      return new Response(
        JSON.stringify({ error: 'فشل طلب WooCommerce', details: data }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Proxy error:', error);
    return new Response(
      JSON.stringify({ error: 'حدث خطأ في الخادم', message: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
