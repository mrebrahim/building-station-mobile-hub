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
    const apiKey = Deno.env.get('TUTOR_LMS_CLIENT_ID');
    const apiSecret = Deno.env.get('TUTOR_LMS_SECRET');

    if (!apiKey || !apiSecret) {
      console.error('Missing Tutor LMS credentials');
      return new Response(
        JSON.stringify({ error: 'خطأ في إعدادات الخادم' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Action: List courses (PUBLIC - no auth required)
    if (action === 'list') {
      console.log('Fetching courses list from Tutor LMS REST API...');
      
      const baseUrl = 'https://building-station.com';
      let courses = [];
      let success = false;

      // Method 1: Try Tutor LMS REST API /tutor/v1/courses with Basic Auth
      console.log('Trying Tutor LMS /tutor/v1/courses with Basic Auth...');
      try {
        const credentials = btoa(`${apiKey}:${apiSecret}`);
        const response = await fetch(`${baseUrl}/wp-json/tutor/v1/courses?per_page=100`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${credentials}`,
          },
        });
        
        console.log('Tutor LMS v1 API (Basic Auth) Status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          courses = data.posts || data.data || data.courses || (Array.isArray(data) ? data : []);
          if (courses.length > 0) {
            success = true;
            console.log(`Tutor LMS v1 API success - ${courses.length} courses`);
          }
        }
      } catch (e) {
        console.log('Tutor LMS v1 API (Basic Auth) failed:', e.message);
      }

      // Method 2: Try Tutor LMS without auth (public courses)
      if (!success) {
        console.log('Trying Tutor LMS /tutor/v1/courses without auth...');
        try {
          const response = await fetch(`${baseUrl}/wp-json/tutor/v1/courses?per_page=100`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          });
          
          console.log('Tutor LMS v1 API (no auth) Status:', response.status);
          
          if (response.ok) {
            const data = await response.json();
            courses = data.posts || data.data || data.courses || (Array.isArray(data) ? data : []);
            if (courses.length > 0) {
              success = true;
              console.log(`Tutor LMS v1 API (no auth) success - ${courses.length} courses`);
            }
          }
        } catch (e) {
          console.log('Tutor LMS v1 API (no auth) failed:', e.message);
        }
      }

      // Method 3: Try with query params auth
      if (!success) {
        console.log('Trying Tutor LMS with query params auth...');
        try {
          const response = await fetch(
            `${baseUrl}/wp-json/tutor/v1/courses?api_key=${encodeURIComponent(apiKey)}&api_secret=${encodeURIComponent(apiSecret)}&per_page=100`,
            { method: 'GET', headers: { 'Content-Type': 'application/json' } }
          );
          
          console.log('Tutor LMS v1 API (query params) Status:', response.status);
          
          if (response.ok) {
            const data = await response.json();
            courses = data.posts || data.data || data.courses || (Array.isArray(data) ? data : []);
            if (courses.length > 0) {
              success = true;
              console.log(`Tutor LMS v1 API (query params) success - ${courses.length} courses`);
            }
          }
        } catch (e) {
          console.log('Tutor LMS v1 API (query params) failed:', e.message);
        }
      }

      // Method 4: Fallback to WordPress REST API for courses CPT
      if (!success) {
        console.log('Falling back to WordPress REST API /wp/v2/courses...');
        const response = await fetch(`${baseUrl}/wp-json/wp/v2/courses?_embed&per_page=100`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        
        console.log('WordPress API Status:', response.status);
        
        if (response.ok) {
          courses = await response.json();
          success = true;
          console.log(`WordPress API success - ${courses.length} courses`);
        }
      }

      if (!success || courses.length === 0) {
        console.error('All API attempts failed to return courses');
        return new Response(
          JSON.stringify({ error: 'فشل في جلب الكورسات', code: 'TUTOR_API_ERROR' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log(`Total courses fetched: ${courses.length}`);
      if (courses[0]) {
        console.log('Sample course:', JSON.stringify(courses[0]).substring(0, 500));
      }

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

      // Enroll user via Tutor LMS API - POST /tutor/v1/courses/{id}/enroll
      const credentials = btoa(`${apiKey}:${apiSecret}`);
      const enrollUrl = `https://building-station.com/wp-json/tutor/v1/courses/${course_id}/enroll`;
      
      const enrollResponse = await fetch(enrollUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${credentials}`,
        },
        body: JSON.stringify({
          user_email: user_email || user.email,
        }),
      });

      console.log('Tutor LMS Enroll Response Status:', enrollResponse.status);

      if (!enrollResponse.ok) {
        const errorText = await enrollResponse.text();
        console.error('Tutor LMS enrollment error:', errorText);
        
        // Try alternative enrollment with Basic auth
        const credentials = btoa(`${apiKey}:${apiSecret}`);
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
