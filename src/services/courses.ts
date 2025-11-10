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
}

export const fetchCourses = async (): Promise<Course[]> => {
  try {
    // Call the edge function instead of direct API call
    const functionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/tutor-lms-proxy`;
    const response = await fetch(functionUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch courses');
    }
    const data = await response.json();
    
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

      return {
        id: course.id || course.course_id || 0,
        title: stripHtmlTags(getRenderedText(course.title)) || 'بدون عنوان',
        thumbnail: course.featured_image_url || course.thumbnail || course.featured_image || '',
        excerpt: stripHtmlTags(getRenderedText(course.excerpt)) || stripHtmlTags(getRenderedText(course.content)),
        price: course.price || course.meta?.price || 0,
        level: course.level || course.meta?.level || 'مبتدئ',
        lessons_count: course.lessons_count || course.meta?.lessons_count || 0,
        author_name: course.author_name || course.meta?.author_name || 'غير محدد',
        description: getRenderedText(course.content) || getRenderedText(course.description),
        curriculum: course.curriculum || null,
        category: course.category || course.meta?.category || 'عام',
      };
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};
