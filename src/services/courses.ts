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
    const response = await fetch('https://building-station.com/wpgetapi/tutor-courses');
    if (!response.ok) {
      throw new Error('Failed to fetch courses');
    }
    const data = await response.json();
    
    // Transform the data to match our interface
    return (Array.isArray(data) ? data : []).map((course: any) => ({
      id: course.id || course.course_id,
      title: course.title || course.post_title,
      thumbnail: course.thumbnail || course.featured_image || '',
      excerpt: course.excerpt || course.short_description || '',
      price: course.price || 0,
      level: course.level || 'مبتدئ',
      lessons_count: course.lessons_count || 0,
      author_name: course.author_name || 'غير محدد',
      description: course.description || course.content || '',
      curriculum: course.curriculum || null,
      category: course.category || 'عام',
    }));
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};
