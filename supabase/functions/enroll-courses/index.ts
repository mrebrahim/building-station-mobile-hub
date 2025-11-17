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

    // Get the user
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) {
      throw new Error('User not authenticated');
    }

    // Get the request body
    const { items, billing, orderId } = await req.json();
    
    console.log('Enrolling user in courses:', { userId: user.id, email: user.email, items, orderId });

    // Filter items that are courses
    const courseItems = items.filter((item: any) => item.type === 'course' && item.course_id);

    if (courseItems.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'لا توجد كورسات للتسجيل',
          enrolled: 0
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Step 1: Get or create WooCommerce customer
    let wcCustomerId;
    try {
      // Try to find customer by email
      const customerSearchUrl = `${WC_BASE_URL}/customers?email=${encodeURIComponent(user.email || billing?.email)}`;
      const searchResponse = await fetch(customerSearchUrl, {
        method: 'GET',
        headers: {
          'Authorization': createAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (searchResponse.ok) {
        const customers = await searchResponse.json();
        if (customers && customers.length > 0) {
          wcCustomerId = customers[0].id;
          console.log('Found existing WooCommerce customer:', wcCustomerId);
        }
      }

      // Create customer if not found
      if (!wcCustomerId) {
        console.log('Creating new WooCommerce customer...');
        const createCustomerUrl = `${WC_BASE_URL}/customers`;
        const customerData = {
          email: user.email || billing?.email,
          first_name: billing?.first_name || '',
          last_name: billing?.last_name || '',
          username: (user.email || billing?.email)?.split('@')[0] || `user_${Date.now()}`,
        };

        const createResponse = await fetch(createCustomerUrl, {
          method: 'POST',
          headers: {
            'Authorization': createAuthHeader(),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(customerData),
        });

        if (createResponse.ok) {
          const newCustomer = await createResponse.json();
          wcCustomerId = newCustomer.id;
          console.log('Created new WooCommerce customer:', wcCustomerId);
        } else {
          const errorText = await createResponse.text();
          console.error('Failed to create WooCommerce customer:', errorText);
        }
      }
    } catch (error) {
      console.error('Error getting/creating WooCommerce customer:', error);
    }

    // Step 2: Create WooCommerce order for each course
    const orderResults = [];
    for (const item of courseItems) {
      try {
        const orderData: any = {
          customer_id: wcCustomerId || 0,
          payment_method: 'cod',
          payment_method_title: 'الدفع عند الاستلام',
          set_paid: true,
          billing: billing || {
            first_name: billing?.first_name || '',
            last_name: billing?.last_name || '',
            email: user.email || billing?.email,
          },
          line_items: [
            {
              product_id: item.id,
              quantity: 1,
            }
          ],
          meta_data: [
            {
              key: '_supabase_user_id',
              value: user.id
            },
            {
              key: '_course_id',
              value: item.course_id
            }
          ]
        };

        console.log('Creating WooCommerce order for course:', item.course_id);
        
        const orderUrl = `${WC_BASE_URL}/orders`;
        const orderResponse = await fetch(orderUrl, {
          method: 'POST',
          headers: {
            'Authorization': createAuthHeader(),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData),
        });

        if (orderResponse.ok) {
          const order = await orderResponse.json();
          console.log('WooCommerce order created successfully:', order.id);
          
          // Also save to Supabase for tracking
          const { error: enrollError } = await supabaseClient
            .from('user_courses')
            .insert({
              user_id: user.id,
              course_id: item.course_id,
              product_id: item.id,
              status: 'active'
            });

          if (enrollError) {
            console.error('Error saving enrollment to Supabase:', enrollError);
          }

          orderResults.push({ 
            success: true, 
            courseId: item.course_id, 
            orderId: order.id 
          });
        } else {
          const errorText = await orderResponse.text();
          console.error('Failed to create WooCommerce order:', errorText);
          orderResults.push({ 
            success: false, 
            courseId: item.course_id, 
            error: errorText 
          });
        }
      } catch (error) {
        console.error('Error creating order for course:', item.course_id, error);
        orderResults.push({ 
          success: false, 
          courseId: item.course_id, 
          error: error.message 
        });
      }
    }

    const successful = orderResults.filter(r => r.success).length;
    const failed = orderResults.filter(r => !r.success).length;

    console.log('Final enrollment results:', { successful, failed, details: orderResults });

    return new Response(
      JSON.stringify({ 
        success: successful > 0,
        enrolled: successful,
        failed: failed,
        message: successful > 0 
          ? `تم تسجيلك في ${successful} كورس بنجاح على الموقع`
          : 'فشل التسجيل في الكورسات',
        details: orderResults
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error enrolling in courses:', error);
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
