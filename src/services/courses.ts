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
  duration?: string; // Course duration
  ratings?: {
    rating_avg: string;
    rating_count: string;
  } | null;
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
    // Handles Tutor LMS API response format
    const coursesArray = Array.isArray(data) ? data : [];
    
    return coursesArray.map((course: any) => {
      const stripHtmlTags = (html: string) => {
        if (!html) return '';
        return html.replace(/<[^>]*>/g, '').trim();
      };

      // Get course level from additional_info
      const getLevel = () => {
        const levelArray = course.additional_info?.course_level;
        if (Array.isArray(levelArray) && levelArray.length > 0) {
          const level = levelArray[0];
          // Translate to Arabic
          const levelMap: Record<string, string> = {
            'beginner': 'مبتدئ',
            'intermediate': 'متوسط',
            'advanced': 'متقدم',
            'expert': 'خبير'
          };
          return levelMap[level?.toLowerCase()] || level || 'مبتدئ';
        }
        return 'مبتدئ';
      };

      // Get price - check if course is free
      const getPrice = () => {
        const priceType = course.additional_info?.course_price_type;
        if (Array.isArray(priceType) && priceType[0] === 'free') {
          return 'مجاني';
        }
        if (course.price && course.price !== '') {
          return course.price;
        }
        return 'مجاني';
      };

      // Get author name
      const getAuthorName = () => {
        if (course.post_author?.display_name) return course.post_author.display_name;
        return 'غير محدد';
      };

      // Get course duration
      const getDuration = () => {
        const duration = course.additional_info?.course_duration;
        if (Array.isArray(duration) && duration[0]) {
          const hours = duration[0].hours || '0';
          const minutes = duration[0].minutes || '0';
          return `${hours} ساعة ${minutes} دقيقة`;
        }
        return '';
      };

      // Get category
      const getCategory = () => {
        if (Array.isArray(course.course_category) && course.course_category.length > 0) {
          return course.course_category[0].name;
        }
        return 'عام';
      };

      // Get course link
      const getCourseLink = () => {
        const slug = course.post_name || course.ID;
        return `https://building-station.com/courses/${slug}/`;
      };

      const courseData = {
        id: course.ID || course.id || 0,
        title: course.post_title || 'بدون عنوان',
        thumbnail: course.thumbnail_url || '',
        excerpt: stripHtmlTags(course.post_excerpt || '').substring(0, 150),
        price: getPrice(),
        level: getLevel(),
        lessons_count: 0, // Will be fetched separately if needed
        author_name: getAuthorName(),
        description: course.post_content || '',
        curriculum: null,
        category: getCategory(),
        product_id: course.ID || course.id,
        slug: course.post_name || '',
        link: getCourseLink(),
        duration: getDuration(),
        ratings: course.ratings || null,
      };
      
      return courseData;
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};
