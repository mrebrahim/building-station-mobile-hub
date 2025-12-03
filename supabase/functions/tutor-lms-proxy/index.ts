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
    const url = new URL(req.url);
    const action = url.searchParams.get('action') || 'list';
    
    // Get the secrets from environment
    const clientId = Deno.env.get('TUTOR_LMS_CLIENT_ID');
    const secret = Deno.env.get('TUTOR_LMS_SECRET');

    if (!clientId || !secret) {
      console.error('Missing Tutor LMS credentials');
      return new Response(
        JSON.stringify({ error: 'خطأ في إعدادات الخادم' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const credentials = btoa(`${clientId}:${secret}`);

    // Action: List courses (PUBLIC - no auth required)
    if (action === 'list') {
      console.log('Fetching courses list (public)...');
      
      // Try Tutor LMS REST API first for complete course data
      const tutorApiUrl = 'https://building-station.com/wp-json/tutor/v1/courses?per_page=100';
      
      let response = await fetch(tutorApiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${credentials}`,
        },
      });

      console.log('Tutor LMS API Response Status:', response.status);

      // If Tutor API fails, fallback to WordPress REST API
      if (!response.ok) {
        console.log('Tutor API failed, trying WordPress REST API...');
        const wpApiUrl = 'https://building-station.com/wp-json/wp/v2/courses?_embed&per_page=100';
        
        response = await fetch(wpApiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${credentials}`,
          },
        });
        
        console.log('WordPress API Response Status:', response.status);
      }

      if (!response.ok) {
        console.error('All API attempts failed:', response.status);
        return new Response(
          JSON.stringify({ error: 'فشل في جلب الكورسات', code: 'TUTOR_API_ERROR' }),
          { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const data = await response.json();
      
      // Handle different response formats - Tutor LMS returns { posts: [...] }
      const courses = data.posts || data.data || data.courses || (Array.isArray(data) ? data : []);
      console.log(`Successfully fetched ${Array.isArray(courses) ? courses.length : 0} courses`);
      console.log('Sample course structure:', courses[0] ? JSON.stringify(courses[0]).substring(0, 500) : 'No courses');

      return new Response(
        JSON.stringify(courses),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Action: Enroll user in course (REQUIRES AUTH)
    if (action === 'enroll') {
      const authHeader = req.headers.get('Authorization');
      if (!authHeader) {
        return new Response(
          JSON.stringify({ error: 'يجب تسجيل الدخول أولاً', code: 'AUTH_REQUIRED' }),
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
          JSON.stringify({ error: 'غير مصرح', code: 'AUTH_FAILED' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const body = await req.json();
      const { course_id, user_email } = body;

      if (!course_id) {
        return new Response(
          JSON.stringify({ error: 'معرف الكورس مطلوب', code: 'MISSING_COURSE_ID' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log(`Enrolling user ${user.email} in course ${course_id}...`);

      // Enroll user in Tutor LMS via WordPress REST API
      const enrollUrl = `https://building-station.com/wp-json/tutor/v1/enrollments`;
      
      const enrollResponse = await fetch(enrollUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${credentials}`,
        },
        body: JSON.stringify({
          course_id: course_id,
          user_email: user_email || user.email,
        }),
      });

      console.log('Tutor LMS Enroll Response Status:', enrollResponse.status);

      if (!enrollResponse.ok) {
        const errorText = await enrollResponse.text();
        console.error('Tutor LMS enrollment error:', errorText);
        
        // Try alternative enrollment endpoint
        const altEnrollUrl = `https://building-station.com/wp-json/tutor/v1/course-enrolled`;
        const altResponse = await fetch(altEnrollUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${credentials}`,
          },
          body: JSON.stringify({
            course_id: course_id,
            student_email: user_email || user.email,
          }),
        });

        if (!altResponse.ok) {
          console.error('Alternative enrollment also failed');
          return new Response(
            JSON.stringify({ 
              error: 'فشل في التسجيل بالكورس', 
              code: 'ENROLLMENT_FAILED',
              details: errorText 
            }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const altData = await altResponse.json();
        return new Response(
          JSON.stringify({ success: true, data: altData }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const enrollData = await enrollResponse.json();
      console.log('Enrollment successful:', enrollData);

      return new Response(
        JSON.stringify({ success: true, data: enrollData }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Action: Get user's enrolled courses (REQUIRES AUTH)
    if (action === 'my-courses') {
      const authHeader = req.headers.get('Authorization');
      if (!authHeader) {
        return new Response(
          JSON.stringify({ error: 'يجب تسجيل الدخول أولاً', code: 'AUTH_REQUIRED' }),
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
        return new Response(
          JSON.stringify({ error: 'غير مصرح', code: 'AUTH_FAILED' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Get enrolled courses from Supabase
      const { data: enrolledCourses, error: dbError } = await supabaseClient
        .from('user_courses')
        .select('*')
        .eq('user_id', user.id);

      if (dbError) {
        console.error('Database error:', dbError);
        return new Response(
          JSON.stringify({ error: 'فشل في جلب الكورسات', code: 'DB_ERROR' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, courses: enrolledCourses || [] }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'إجراء غير معروف', code: 'UNKNOWN_ACTION' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Tutor LMS Proxy error:', error);
    return new Response(
      JSON.stringify({ error: 'حدث خطأ في الخادم', code: 'INTERNAL_ERROR' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
