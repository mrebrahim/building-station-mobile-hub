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

    // WPGetAPI typically uses query parameters for authentication
    console.log('Attempting to call Tutor LMS API...');
    console.log('Client ID (first 10 chars):', clientId.substring(0, 10) + '...');
    
    // Try method 1: Simple endpoint without auth (if it's public)
    console.log('Method 1: Trying without authentication...');
    let response = await fetch('https://building-station.com/wpgetapi/tutor-courses', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    let responseText = await response.text();
    console.log('Method 1 Status:', response.status);
    console.log('Method 1 Response (first 200 chars):', responseText.substring(0, 200));

    // Try method 2: With query parameters
    if (!response.ok) {
      console.log('Method 2: Trying with query parameters...');
      const urlWithParams = `https://building-station.com/wpgetapi/tutor-courses?client_id=${clientId}&secret=${secret}`;
      response = await fetch(urlWithParams, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      responseText = await response.text();
      console.log('Method 2 Status:', response.status);
      console.log('Method 2 Response (first 200 chars):', responseText.substring(0, 200));
    }

    // Try method 3: With Basic Auth
    if (!response.ok) {
      console.log('Method 3: Trying with Basic Authentication...');
      const credentials = btoa(`${clientId}:${secret}`);
      response = await fetch('https://building-station.com/wpgetapi/tutor-courses', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${credentials}`,
        },
      });
      responseText = await response.text();
      console.log('Method 3 Status:', response.status);
      console.log('Method 3 Response (first 200 chars):', responseText.substring(0, 200));
    }

    // Try method 4: Common WPGetAPI format
    if (!response.ok) {
      console.log('Method 4: Trying WPGetAPI standard format...');
      response = await fetch('https://building-station.com/wpgetapi/tutor-courses', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'WPGETAPI-Key': clientId,
          'WPGETAPI-Secret': secret,
        },
      });
      responseText = await response.text();
      console.log('Method 4 Status:', response.status);
      console.log('Method 4 Response (first 200 chars):', responseText.substring(0, 200));
    }

    if (!response.ok) {
      console.error(`All methods failed. Final status: ${response.status}`);
      console.error('Final response text:', responseText);
      
      return new Response(
        JSON.stringify({ 
          error: 'Failed to fetch courses from Tutor LMS. Please check the API endpoint and credentials.',
          status: response.status,
          details: 'All authentication methods failed. Check edge function logs for more details.'
        }),
        { 
          status: response.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Try to parse JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse response as JSON:', e);
      return new Response(
        JSON.stringify({ 
          error: 'API returned non-JSON response',
          response: responseText.substring(0, 500)
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
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
