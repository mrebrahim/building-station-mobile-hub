export interface Course {
  id: number;
  title: string;
  thumbnail: string;
  excerpt: string;
  price: string | number;
  level: string;
  lessons_count: number;
  author_name: string;
  description?: string;
  curriculum?: any;
  category?: string;
  product_id?: number; // WooCommerce Product ID for enrollment
  slug?: string; // WordPress course slug for direct links
  link?: string; // Full WordPress permalink
}

export const fetchCourses = async (): Promise<Course[]> => {
  try {
    // Call the edge function directly (public - no auth required for listing)
    const response = await fetch(
      'https://aegclwuugreshufvisax.supabase.co/functions/v1/tutor-lms-proxy?action=list',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch courses: ' + response.statusText);
    }
    
    const data = await response.json();
    
    console.log('Courses fetched successfully:', data.length);
    console.log('Sample course data:', data[0] ? JSON.stringify(data[0]).substring(0, 300) : 'No courses');
    
    // Transform the data to match our interface
    // WordPress REST API returns objects with 'rendered' properties
    return (Array.isArray(data) ? data : []).map((course: any) => {
      const getRenderedText = (field: any) => {
        if (!field) return '';
        if (typeof field === 'string') return field;
        if (typeof field === 'object' && field.rendered) return field.rendered;
        return '';
      };

      const stripHtmlTags = (html: string) => {
        if (!html) return '';
        return html.replace(/<[^>]*>/g, '').trim();
      };
      
      // Extract featured image from various possible locations
      const getFeaturedImage = () => {
        // Priority 1: Check _embedded for featured image (most reliable)
        if (course._embedded?.['wp:featuredmedia']?.[0]?.source_url) {
          return course._embedded['wp:featuredmedia'][0].source_url;
        }
        
        // Priority 2: Check media_details for better quality
        if (course._embedded?.['wp:featuredmedia']?.[0]?.media_details?.sizes?.large?.source_url) {
          return course._embedded['wp:featuredmedia'][0].media_details.sizes.large.source_url;
        }
        
        // Priority 3: Check direct properties
        if (course.featured_image_url) return course.featured_image_url;
        if (course.featured_media_url) return course.featured_media_url;
        if (course.thumbnail) return course.thumbnail;
        if (course.featured_image) return course.featured_image;
        
        // Priority 4: Check meta
        if (course.meta?.featured_image) return course.meta.featured_image;
        
        // Fallback: return empty string
        return '';
      };

      const courseData = {
        id: course.id || course.course_id || 0,
        title: stripHtmlTags(getRenderedText(course.title)) || 'بدون عنوان',
        thumbnail: getFeaturedImage(),
        excerpt: stripHtmlTags(getRenderedText(course.excerpt)) || stripHtmlTags(getRenderedText(course.content)).substring(0, 150),
        price: course.price || course.meta?.price || 0,
        level: course.level || course.meta?.level || 'مبتدئ',
        lessons_count: course.lessons_count || course.meta?.lessons_count || 0,
        author_name: course.author_name || course.meta?.author_name || 'غير محدد',
        description: getRenderedText(course.content) || getRenderedText(course.description),
        curriculum: course.curriculum || null,
        category: course.category || course.meta?.category || 'عام',
        product_id: course.product_id || course.meta?.product_id || course.id, // Use course ID as fallback
        slug: course.slug || course.post_name || '',
        link: course.link || `https://building-station.com/courses/${course.slug || course.id}/`,
      };
      
      // Log sample course for debugging
      if (course.id === data[0]?.id) {
        console.log('📚 Sample course data:', {
          title: courseData.title,
          thumbnail: courseData.thumbnail,
          hasImage: !!courseData.thumbnail,
          price: courseData.price,
          lessons: courseData.lessons_count
        });
      }
      
      return courseData;
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};
