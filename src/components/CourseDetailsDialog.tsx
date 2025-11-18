import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { GraduationCap, BookOpen, User, ShoppingCart } from "lucide-react";
import { Course } from "@/services/courses";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

interface CourseDetailsDialogProps {
  course: Course | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CourseDetailsDialog = ({ course, open, onOpenChange }: CourseDetailsDialogProps) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  
  useEffect(() => {
    if (!course) return;
    
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
  }, [course]);
  
  if (!course) return null;

  const formatPrice = (price: string | number) => {
    if (!price || price === 0 || price === '0') return 'مجاني';
    return `${price} ر.س`;
  };

  const handleEnroll = async () => {
    // Check if user is logged in
    if (!user) {
      toast.error('يجب تسجيل الدخول أولاً');
      onOpenChange(false);
      navigate('/auth');
      return;
    }

    if (isEnrolled) {
      toast.info('أنت مسجل بالفعل في هذا الكورس');
      onOpenChange(false);
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
    
    // Close dialog and navigate to cart
    onOpenChange(false);
    navigate('/cart');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-right text-2xl">{course.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {course.thumbnail && (
            <div className="aspect-video overflow-hidden rounded-lg bg-muted">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
            </div>
          )}
          
          <div className="flex items-center gap-4 justify-end flex-wrap text-sm">
            <div className="flex items-center gap-2">
              <span>{course.author_name}</span>
              <User className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2">
              <span>{course.level}</span>
              <GraduationCap className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2">
              <span>{course.lessons_count} درس</span>
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            {isEnrolled ? (
              <a
                href={course.link || `https://building-station.com/courses/${course.id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button 
                  size="lg"
                  className="gap-2"
                >
                  <GraduationCap className="w-5 h-5" />
                  ابدأ الدراسة
                </Button>
              </a>
            ) : (
              <Button 
                onClick={handleEnroll}
                size="lg"
                className="gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                {course.price && course.price !== 0 ? 'اشترِ الآن' : 'سجل مجاناً'}
              </Button>
            )}
            <div className="text-3xl font-bold text-primary">
              {formatPrice(course.price)}
            </div>
          </div>
          
          <Tabs defaultValue="description" className="w-full" dir="rtl">
            <TabsList className="w-full">
              <TabsTrigger value="description" className="flex-1">الوصف</TabsTrigger>
              {course.curriculum && (
                <TabsTrigger value="curriculum" className="flex-1">المنهج</TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="description" className="text-right space-y-4">
              <div 
                className="prose prose-sm max-w-none text-right"
                dangerouslySetInnerHTML={{ 
                  __html: course.description || course.excerpt || 'لا يوجد وصف متاح' 
                }}
              />
            </TabsContent>
            
            {course.curriculum && (
              <TabsContent value="curriculum" className="text-right">
                <div className="space-y-4">
                  {/* Add curriculum rendering logic based on API structure */}
                  <p className="text-muted-foreground">محتوى المنهج سيتم عرضه هنا</p>
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CourseDetailsDialog;
