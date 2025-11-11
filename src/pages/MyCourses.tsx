import { useState, useEffect } from "react";
import { ArrowLeft, GraduationCap, BookOpen, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { fetchCourses, Course } from "@/services/courses";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const MyCourses = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadEnrolledCourses = async () => {
      try {
        // Check if user is logged in
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          toast.error('يجب تسجيل الدخول أولاً');
          navigate('/auth');
          return;
        }

        setUser(user);

        // Get user's enrolled courses
        const { data: userCourses, error } = await supabase
          .from('user_courses')
          .select('*')
          .eq('user_id', user.id);

        if (error) throw error;

        if (!userCourses || userCourses.length === 0) {
          setEnrolledCourses([]);
          setLoading(false);
          return;
        }

        // Fetch all courses
        const allCourses = await fetchCourses();
        
        // Filter courses that user is enrolled in
        const enrolled = allCourses.filter(course => 
          userCourses.some(uc => uc.course_id === course.id)
        );

        setEnrolledCourses(enrolled);
      } catch (error) {
        console.error('Error loading enrolled courses:', error);
        toast.error('حدث خطأ في تحميل الكورسات');
      } finally {
        setLoading(false);
      }
    };

    loadEnrolledCourses();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <div className="w-6"></div>
          <h1 className="text-lg font-medium">كورساتي</h1>
          <Link to="/">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </Link>
        </div>
      </header>

      <div className="p-4">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-video w-full rounded-xl" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ) : enrolledCourses.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="text-5xl mb-4">📚</div>
            <p className="text-gray-700 font-medium mb-2">لم تسجل في أي كورسات بعد</p>
            <p className="text-sm text-gray-500 mb-4">ابدأ رحلتك التعليمية الآن</p>
            <Link 
              to="/" 
              className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            >
              تصفح الكورسات
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {enrolledCourses.map((course) => (
              <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="aspect-video overflow-hidden bg-muted">
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                      <GraduationCap className="w-16 h-16 text-muted-foreground" />
                    </div>
                  )}
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-2 text-right line-clamp-2">
                    {course.title}
                  </h3>
                  
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3 justify-end flex-wrap">
                    <div className="flex items-center gap-1">
                      <span>{course.author_name}</span>
                      <User className="w-3 h-3" />
                    </div>
                    <div className="flex items-center gap-1">
                      <span>{course.level}</span>
                      <GraduationCap className="w-3 h-3" />
                    </div>
                    <div className="flex items-center gap-1">
                      <span>{course.lessons_count} درس</span>
                      <BookOpen className="w-3 h-3" />
                    </div>
                  </div>
                  
                  <div className="bg-primary/10 text-primary px-3 py-2 rounded-lg text-center font-medium">
                    متاح الآن
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;
