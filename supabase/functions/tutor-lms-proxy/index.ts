import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    console.log('Tutor LMS Proxy: Request from user', user.id);

    // Get the secrets from environment
    const clientId = Deno.env.get('TUTOR_LMS_CLIENT_ID');
    const secret = Deno.env.get('TUTOR_LMS_SECRET');

    if (!clientId || !secret) {
      console.error('Missing Tutor LMS credentials');
      return new Response(
        JSON.stringify({ error: 'خطأ في إعدادات الخادم' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Call WordPress REST API for courses
    const tutorApiUrl = 'https://building-station.com/wp-json/wp/v2/courses';
    
    console.log('Calling WordPress REST API for courses...');
    
    // Use the API Key and Secret as Basic Authentication
    const credentials = btoa(`${clientId}:${secret}`);
    
    // Add _embed parameter to get featured images
    const response = await fetch(`${tutorApiUrl}?_embed`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${credentials}`,
      },
    });

    console.log('API Response Status:', response.status);

    if (!response.ok) {
      console.error('WordPress API error:', response.status);
      
      return new Response(
        JSON.stringify({ 
          error: 'فشل في جلب الكورسات',
          code: 'TUTOR_API_ERROR'
        }),
        { 
          status: response.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Parse JSON response
    const data = await response.json();
    console.log(`Successfully fetched ${Array.isArray(data) ? data.length : 0} courses`);

    return new Response(
      JSON.stringify(data),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Tutor LMS Proxy error:', error);
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
