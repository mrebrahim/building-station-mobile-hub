import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    console.log('Tutor LMS Proxy: Starting request');

    // Get the secrets from environment
    const clientId = Deno.env.get('TUTOR_LMS_CLIENT_ID');
    const secret = Deno.env.get('TUTOR_LMS_SECRET');

    if (!clientId || !secret) {
      console.error('Missing Tutor LMS credentials');
      return new Response(
        JSON.stringify({ error: 'Missing Tutor LMS credentials' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Try different authentication methods for WPGetAPI
    // Method 1: Try with Basic Auth
    const credentials = btoa(`${clientId}:${secret}`);
    
    // Method 2: Try with query parameters (common for WPGetAPI)
    const tutorApiUrl = `https://building-station.com/wpgetapi/tutor-courses?api_key=${clientId}&api_secret=${secret}`;
    
    console.log('Calling Tutor LMS API with authentication...');
    
    // Try with Basic Auth first
    let response = await fetch('https://building-station.com/wpgetapi/tutor-courses', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${credentials}`,
      },
    });

    // If Basic Auth fails, try with query parameters
    if (!response.ok) {
      console.log('Basic Auth failed, trying with query parameters...');
      response = await fetch(tutorApiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // If both fail, try with custom headers
    if (!response.ok) {
      console.log('Query params failed, trying with custom headers...');
      response = await fetch('https://building-station.com/wpgetapi/tutor-courses', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': clientId,
          'X-API-Secret': secret,
        },
      });
    }

    if (!response.ok) {
      console.error(`Tutor LMS API error: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error('Error details:', errorText);
      
      return new Response(
        JSON.stringify({ 
          error: 'Failed to fetch courses from Tutor LMS',
          status: response.status 
        }),
        { 
          status: response.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

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
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
