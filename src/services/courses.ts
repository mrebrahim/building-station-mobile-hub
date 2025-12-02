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
    // Handles both Tutor LMS API and WordPress REST API response formats
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
        // Tutor LMS API format
        if (course.thumbnail_url) return course.thumbnail_url;
        if (course.course_thumbnail) return course.course_thumbnail;
        if (course.image) return course.image;
        
        // WordPress REST API format
        if (course._embedded?.['wp:featuredmedia']?.[0]?.source_url) {
          return course._embedded['wp:featuredmedia'][0].source_url;
        }
        if (course._embedded?.['wp:featuredmedia']?.[0]?.media_details?.sizes?.large?.source_url) {
          return course._embedded['wp:featuredmedia'][0].media_details.sizes.large.source_url;
        }
        
        // Direct properties
        if (course.featured_image_url) return course.featured_image_url;
        if (course.featured_media_url) return course.featured_media_url;
        if (course.thumbnail) return course.thumbnail;
        if (course.featured_image) return course.featured_image;
        
        // Meta
        if (course.meta?.featured_image) return course.meta.featured_image;
        
        return '';
      };

      // Get title (handles both formats)
      const getTitle = () => {
        if (course.post_title) return course.post_title;
        if (course.course_title) return course.course_title;
        return stripHtmlTags(getRenderedText(course.title)) || 'بدون عنوان';
      };

      // Get lessons count (Tutor LMS specific fields)
      const getLessonsCount = () => {
        if (course.total_lessons) return parseInt(course.total_lessons) || 0;
        if (course.lesson_count) return parseInt(course.lesson_count) || 0;
        if (course.lessons_count) return parseInt(course.lessons_count) || 0;
        if (course.course_content?.total_lessons) return parseInt(course.course_content.total_lessons) || 0;
        if (course.meta?.lessons_count) return parseInt(course.meta.lessons_count) || 0;
        return 0;
      };

      // Get course price
      const getPrice = () => {
        if (course.course_price) return course.course_price;
        if (course.regular_price) return course.regular_price;
        if (course.sale_price) return course.sale_price;
        if (course.price) return course.price;
        if (course.meta?.price) return course.meta.price;
        return 0;
      };

      // Get course level
      const getLevel = () => {
        if (course.course_level) return course.course_level;
        if (course.difficulty_level) return course.difficulty_level;
        if (course.level) return course.level;
        if (course.meta?.level) return course.meta.level;
        return 'مبتدئ';
      };

      // Get author name
      const getAuthorName = () => {
        if (course.author?.display_name) return course.author.display_name;
        if (course.instructor_name) return course.instructor_name;
        if (course.author_name) return course.author_name;
        if (course.meta?.author_name) return course.meta.author_name;
        return 'غير محدد';
      };

      // Get course link
      const getCourseLink = () => {
        if (course.course_permalink) return course.course_permalink;
        if (course.permalink) return course.permalink;
        if (course.link) return course.link;
        if (course.guid?.rendered) return course.guid.rendered;
        return `https://building-station.com/courses/${course.slug || course.post_name || course.id}/`;
      };

      const courseData = {
        id: course.id || course.course_id || course.ID || 0,
        title: getTitle(),
        thumbnail: getFeaturedImage(),
        excerpt: stripHtmlTags(course.post_excerpt || course.short_description || getRenderedText(course.excerpt) || getRenderedText(course.content)).substring(0, 150),
        price: getPrice(),
        level: getLevel(),
        lessons_count: getLessonsCount(),
        author_name: getAuthorName(),
        description: course.post_content || getRenderedText(course.content) || getRenderedText(course.description),
        curriculum: course.curriculum || course.course_content || null,
        category: course.category || course.course_category || course.meta?.category || 'عام',
        product_id: course.product_id || course.wc_product_id || course.meta?.product_id || course.id,
        slug: course.slug || course.post_name || '',
        link: getCourseLink(),
      };
      
      // Log sample course for debugging
      if (course.id === data[0]?.id) {
        console.log('📚 Sample course data:', {
          title: courseData.title,
          thumbnail: courseData.thumbnail,
          hasImage: !!courseData.thumbnail,
          price: courseData.price,
          lessons: courseData.lessons_count,
          link: courseData.link
        });
      }
      
      return courseData;
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};
