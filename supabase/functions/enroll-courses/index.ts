import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

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
    const { items } = await req.json();
    
    console.log('Enrolling user in courses:', { userId: user.id, items });

    // Filter items that are courses
    const courseItems = items.filter((item: any) => item.type === 'course' && item.course_id);

    if (courseItems.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'No courses to enroll',
          enrolled: 0
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Enroll user in each course
    const enrollmentPromises = courseItems.map((item: any) => {
      return supabaseClient
        .from('user_courses')
        .insert({
          user_id: user.id,
          course_id: item.course_id,
          product_id: item.id,
          status: 'active'
        })
        .select()
        .single();
    });

    const results = await Promise.allSettled(enrollmentPromises);
    
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected');

    console.log('Enrollment results:', { successful, failed: failed.length });

    if (failed.length > 0) {
      console.error('Failed enrollments:', failed);
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        enrolled: successful,
        failed: failed.length,
        message: `تم تسجيلك في ${successful} كورس بنجاح`
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
