import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const WC_BASE_URL = 'https://building-station.com/wp-json/wc/v3';

// Create Basic Auth header using environment variables
function createAuthHeader() {
  const consumerKey = Deno.env.get('WC_CONSUMER_KEY');
  const consumerSecret = Deno.env.get('WC_CONSUMER_SECRET');
  
  if (!consumerKey || !consumerSecret) {
    throw new Error('WooCommerce credentials not configured');
  }
  
  const credentials = btoa(`${consumerKey}:${consumerSecret}`);
  return `Basic ${credentials}`;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get the authenticated user
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) {
      throw new Error('User not authenticated');
    }

    const { email, firstName, lastName } = await req.json();
    
    console.log('Creating WooCommerce customer for user:', { userId: user.id, email });

    // Create customer in WooCommerce
    const customerData = {
      email: email || user.email,
      first_name: firstName || '',
      last_name: lastName || '',
      username: email?.split('@')[0] || user.email?.split('@')[0],
    };

    const wcResponse = await fetch(`${WC_BASE_URL}/customers`, {
      method: 'POST',
      headers: {
        'Authorization': createAuthHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customerData),
    });

    if (!wcResponse.ok) {
      const errorData = await wcResponse.text();
      console.error('WooCommerce API error:', errorData);
      
      // Check if customer already exists
      if (wcResponse.status === 400 && errorData.includes('registration-error-email-exists')) {
        console.log('Customer already exists in WooCommerce');
        return new Response(
          JSON.stringify({ 
            success: true,
            message: 'الحساب موجود بالفعل في WooCommerce',
            exists: true
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`WooCommerce API error: ${errorData}`);
    }

    const wcCustomer = await wcResponse.json();
    console.log('WooCommerce customer created successfully:', wcCustomer.id);

    return new Response(
      JSON.stringify({ 
        success: true,
        customerId: wcCustomer.id,
        message: 'تم إنشاء حساب في WooCommerce بنجاح'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error creating WooCommerce customer:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
});
