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

    // Call WordPress REST API for courses
    const tutorApiUrl = 'https://building-station.com/wp-json/wp/v2/courses';
    
    console.log('Calling WordPress REST API for courses...');
    console.log('Using API endpoint:', tutorApiUrl);
    
    // Use the API Key and Secret as Basic Authentication
    const credentials = btoa(`${clientId}:${secret}`);
    
    const response = await fetch(tutorApiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${credentials}`,
      },
    });

    console.log('API Response Status:', response.status);
    const responseText = await response.text();
    console.log('Response (first 300 chars):', responseText.substring(0, 300));

    if (!response.ok) {
      console.error(`Tutor LMS API error: ${response.status}`);
      console.error('Error response:', responseText);
      
      return new Response(
        JSON.stringify({ 
          error: 'Failed to fetch courses from Tutor LMS',
          status: response.status,
          details: responseText.substring(0, 500)
        }),
        { 
          status: response.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Parse JSON response
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse JSON:', e);
      return new Response(
        JSON.stringify({ 
          error: 'Invalid JSON response from API',
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
