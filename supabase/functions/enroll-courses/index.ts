import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.2';

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
    // Create Supabase client with the auth header from the request
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader) {
      console.error('❌ No Authorization header provided');
      return new Response(
        JSON.stringify({ 
          error: 'يجب تسجيل الدخول أولاً', 
          success: false,
          code: 'AUTH_REQUIRED'
        }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    // Get the user (verify_jwt = true already ensures authentication at gateway level)
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();

    if (authError) {
      console.error('❌ Auth error:', authError.message);
      return new Response(
        JSON.stringify({ 
          error: 'خطأ في التحقق من الهوية', 
          success: false,
          code: 'AUTH_ERROR',
          details: authError.message
        }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!user) {
      console.error('❌ No user found in JWT');
      return new Response(
        JSON.stringify({ 
          error: 'يجب تسجيل الدخول أولاً', 
          success: false,
          code: 'NO_USER'
        }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('✅ User authenticated:', user.id, user.email);

    // Get the request body
    const { items, billing, orderId } = await req.json();
    
    console.log('📥 Request data:', { 
      userId: user.id, 
      email: user.email, 
      itemCount: items?.length,
      orderId 
    });

    if (!items || !Array.isArray(items) || items.length === 0) {
      console.error('❌ No items provided');
      return new Response(
        JSON.stringify({ 
          success: false,
          message: 'لا توجد عناصر في الطلب',
          enrolled: 0
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Filter items that are courses and ensure course_id is set
    const courseItems = items
      .filter((item: any) => item.type === 'course')
      .map((item: any) => ({
        ...item,
        course_id: item.course_id || item.id // Fallback to id if course_id is missing
      }))
      .filter((item: any) => item.course_id); // Only include items with valid course_id

    if (courseItems.length === 0) {
      console.log('⚠️ No courses found in order');
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'لا توجد كورسات للتسجيل',
          enrolled: 0,
          failed: 0
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`📚 Processing enrollment for ${courseItems.length} course(s)...`);

    // Enroll user in each course
    const enrollmentResults = [];
    
    for (const item of courseItems) {
      try {
        console.log(`➡️ Enrolling in course ${item.course_id} (Product ID: ${item.id})`);
        
        // Check if already enrolled
        const { data: existingEnrollment } = await supabaseClient
          .from('user_courses')
          .select('id')
          .eq('user_id', user.id)
          .eq('course_id', item.course_id)
          .maybeSingle();

        if (existingEnrollment) {
          console.log(`ℹ️ User already enrolled in course ${item.course_id}`);
          enrollmentResults.push({ 
            success: true, 
            courseId: item.course_id,
            message: 'Already enrolled'
          });
          continue;
        }

        // Save enrollment to database
        const { error: enrollError } = await supabaseClient
          .from('user_courses')
          .insert({
            user_id: user.id,
            course_id: item.course_id,
            product_id: item.id,
            status: 'active'
          });

        if (enrollError) {
          console.error(`❌ Error enrolling in course ${item.course_id}:`, enrollError);
          enrollmentResults.push({ 
            success: false, 
            courseId: item.course_id,
            error: enrollError.message
          });
        } else {
          console.log(`✅ Successfully enrolled in course ${item.course_id}`);
          enrollmentResults.push({ 
            success: true, 
            courseId: item.course_id,
            orderId: orderId
          });
        }
      } catch (error) {
        console.error(`❌ Exception enrolling in course ${item.course_id}:`, error);
        enrollmentResults.push({ 
          success: false, 
          courseId: item.course_id,
          error: error.message
        });
      }
    }

    const successful = enrollmentResults.filter(r => r.success).length;
    const failed = enrollmentResults.filter(r => !r.success).length;

    console.log(`📊 Enrollment summary: ${successful} succeeded, ${failed} failed`);

    return new Response(
      JSON.stringify({ 
        success: successful > 0,
        enrolled: successful,
        failed: failed,
        message: successful > 0 
          ? `تم تسجيلك في ${successful} كورس بنجاح!`
          : 'فشل التسجيل في الكورسات',
        details: enrollmentResults
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('❌ Fatal error in enroll-courses:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'حدث خطأ في الخادم',
        message: 'فشل التسجيل في الكورسات',
        enrolled: 0,
        code: 'INTERNAL_ERROR'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
