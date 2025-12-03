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
    // Handles WordPress REST API response format with _embedded data
    const coursesArray = Array.isArray(data) ? data : [];
    
    return coursesArray.map((course: any) => {
      const stripHtmlTags = (html: string) => {
        if (!html) return '';
        return html.replace(/<[^>]*>/g, '').trim();
      };

      // Get title - WordPress REST API uses title.rendered
      const getTitle = () => {
        if (course.title?.rendered) return stripHtmlTags(course.title.rendered);
        if (course.post_title) return course.post_title;
        return 'بدون عنوان';
      };

      // Get thumbnail from _embedded wp:featuredmedia
      const getThumbnail = () => {
        // WordPress REST API with _embed
        const featuredMedia = course._embedded?.['wp:featuredmedia']?.[0];
        if (featuredMedia?.source_url) return featuredMedia.source_url;
        if (featuredMedia?.media_details?.sizes?.large?.source_url) {
          return featuredMedia.media_details.sizes.large.source_url;
        }
        // Tutor LMS format
        if (course.thumbnail_url) return course.thumbnail_url;
        return '';
      };

      // Get excerpt
      const getExcerpt = () => {
        if (course.excerpt?.rendered) return stripHtmlTags(course.excerpt.rendered);
        if (course.post_excerpt) return stripHtmlTags(course.post_excerpt);
        return '';
      };

      // Get author name from _embedded
      const getAuthorName = () => {
        const author = course._embedded?.author?.[0];
        if (author?.name) return author.name;
        if (course.post_author?.display_name) return course.post_author.display_name;
        return 'غير محدد';
      };

      // Get category from _embedded wp:term
      const getCategory = () => {
        const terms = course._embedded?.['wp:term'];
        if (Array.isArray(terms) && terms[0]?.[0]?.name) {
          return terms[0][0].name;
        }
        if (Array.isArray(course.course_category) && course.course_category[0]?.name) {
          return course.course_category[0].name;
        }
        return 'عام';
      };

      // Get content
      const getContent = () => {
        if (course.content?.rendered) return course.content.rendered;
        if (course.post_content) return course.post_content;
        return '';
      };

      const courseData = {
        id: course.id || course.ID || 0,
        title: getTitle(),
        thumbnail: getThumbnail(),
        excerpt: getExcerpt().substring(0, 150),
        price: 'مجاني', // Default to free
        level: 'مبتدئ',
        lessons_count: 0,
        author_name: getAuthorName(),
        description: getContent(),
        curriculum: null,
        category: getCategory(),
        product_id: course.id || course.ID,
        slug: course.slug || course.post_name || '',
        link: course.link || `https://building-station.com/courses/${course.slug || course.id}/`,
      };
      
      return courseData;
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};
