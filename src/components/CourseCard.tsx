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
    if (!price || price === 0 || price === '0') return 'مجاني';
    return `${price} ر.س`;
  };

  const handleEnroll = async () => {
    // Check if user is logged in
    if (!user) {
      toast.error('يجب تسجيل الدخول أولاً');
      navigate('/auth');
      return;
    }

    if (isEnrolled) {
      toast.info('أنت مسجل بالفعل في هذا الكورس');
      navigate('/my-courses');
      return;
    }

    if (!course.product_id) {
      toast.error('عذراً، لا يمكن التسجيل في هذا الكورس حالياً');
      return;
    }

    // Get current cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if course already in cart
    const existingItem = cart.find((item: any) => item.id === course.product_id);
    
    if (existingItem) {
      toast.info('الكورس موجود بالفعل في السلة');
    } else {
      // Add course to cart as a product
      cart.push({
        id: course.product_id,
        name: course.title,
        price: course.price,
        quantity: 1,
        image: course.thumbnail,
        type: 'course',
        course_id: course.id
      });
      
      localStorage.setItem('cart', JSON.stringify(cart));
      toast.success('تم إضافة الكورس إلى السلة');
    }
    
    // Navigate to cart
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
        {isEnrolled ? (
          <a
            href={course.link || `https://building-station.com/courses/${course.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <Button 
              className="w-full"
              variant="default"
            >
              <GraduationCap className="w-4 h-4 ml-2" />
              ابدأ الدراسة
            </Button>
          </a>
        ) : (
          <Button 
            onClick={handleEnroll}
            className="flex-1"
            variant="default"
          >
            <ShoppingCart className="w-4 h-4 ml-2" />
            {course.price && course.price !== 0 ? 'اشترِ الآن' : 'سجل مجاناً'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
