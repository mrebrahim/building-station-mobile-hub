import { GraduationCap, BookOpen, User, ShoppingCart } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Course } from "@/services/courses";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

interface CourseCardProps {
  course: Course;
  onDetailsClick: (course: Course) => void;
}

const CourseCard = ({ course, onDetailsClick }: CourseCardProps) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      
      // Check if user is enrolled in this course
      if (user) {
        supabase
          .from('user_courses')
          .select('*')
          .eq('user_id', user.id)
          .eq('course_id', course.id)
          .single()
          .then(({ data }) => {
            setIsEnrolled(!!data);
          });
      }
    });
  }, [course.id]);
  
  const truncateText = (text: string, maxLength: number) => {
    if (!text || typeof text !== 'string') return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const formatPrice = (price: string | number) => {
    if (!price || price === 0 || price === '0' || price === 'مجاني' || price === 'free') return 'مجاني';
    if (typeof price === 'string' && price.includes('ر.س')) return price;
    return `${price} ر.س`;
  };

  const isFree = () => {
    const price = course.price;
    return !price || price === 0 || price === '0' || price === 'مجاني' || price === 'free';
  };

  const handleEnroll = async () => {
    // Check if user is logged in
    if (!user) {
      toast.error('يجب تسجيل الدخول أولاً');
      navigate('/auth?redirect=/all-courses');
      return;
    }

    if (isEnrolled) {
      // Open course directly
      window.open(course.link || `https://building-station.com/courses/${course.slug || course.id}/`, '_blank');
      return;
    }

    // For free courses, enroll directly without cart
    if (isFree()) {
      setIsLoading(true);
      try {
        // Direct enrollment via edge function
        const { data, error } = await supabase.functions.invoke('enroll-courses', {
          body: { 
            items: [{
              id: course.product_id || course.id,
              name: course.title,
              price: 0,
              quantity: 1,
              type: 'course',
              course_id: course.id
            }],
            billing: { email: user.email },
            orderId: null
          }
        });

        if (error) {
          console.error('Enrollment error:', error);
          toast.error('حدث خطأ في التسجيل');
          return;
        }

        if (data?.success) {
          toast.success('تم تسجيلك في الكورس بنجاح!');
          setIsEnrolled(true);
          // Open course in new tab
          const courseUrl = course.link || `https://building-station.com/courses/${course.slug || course.id}/`;
          window.open(courseUrl, '_blank');
        } else {
          toast.error(data?.message || 'حدث خطأ في التسجيل');
        }
      } catch (err) {
        console.error('Enrollment exception:', err);
        toast.error('حدث خطأ في التسجيل');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // For paid courses, add to cart
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((item: any) => item.id === course.product_id);
    
    if (existingItem) {
      toast.info('الكورس موجود بالفعل في السلة');
    } else {
      cart.push({
        id: course.product_id || course.id,
        name: course.title,
        price: course.price,
        quantity: 1,
        image: course.thumbnail,
        type: 'course',
        course_id: course.id
      });
      
      localStorage.setItem('cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('cartUpdated'));
      toast.success('تم إضافة الكورس إلى السلة');
    }
    
    navigate('/cart');
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
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
        
        <p className="text-sm text-muted-foreground mb-3 text-right line-clamp-2">
          {truncateText(course.excerpt, 120)}
        </p>
        
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
        
        <div className="text-xl font-bold text-primary text-right">
          {formatPrice(course.price)}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button 
          onClick={() => onDetailsClick(course)}
          className="flex-1"
          variant="outline"
        >
          التفاصيل
        </Button>
        <Button 
          onClick={handleEnroll}
          className="flex-1"
          variant="default"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="animate-spin mr-2">⏳</span>
          ) : isEnrolled ? (
            <>
              <GraduationCap className="w-4 h-4 ml-2" />
              ابدأ الدراسة
            </>
          ) : (
            <>
              {isFree() ? <GraduationCap className="w-4 h-4 ml-2" /> : <ShoppingCart className="w-4 h-4 ml-2" />}
              {isFree() ? 'سجل مجاناً' : 'اشترِ الآن'}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
