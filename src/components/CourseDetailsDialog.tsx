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
  const [isLoading, setIsLoading] = useState(false);
  
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

  const formatPrice = (price: string | number) => {
    if (!price || price === 0 || price === '0') return 'مجاني';
    return `${price} ر.س`;
  };

  const isFree = () => {
    const price = course?.price;
    return !price || price === 0 || price === '0' || price === 'مجاني' || price === 'free';
  };
  
  if (!course) return null;

  const handleEnroll = async () => {
    if (!course) return;

    // Check if user is logged in
    if (!user) {
      toast.error('يجب تسجيل الدخول أولاً');
      onOpenChange(false);
      navigate('/auth?redirect=/all-courses');
      return;
    }

    if (isEnrolled) {
      // Open course directly
      onOpenChange(false);
      window.open(course.link || `https://building-station.com/courses/${course.slug || course.id}/`, '_blank');
      return;
    }

    // For free courses, enroll directly
    if (isFree()) {
      setIsLoading(true);
      try {
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
          onOpenChange(false);
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
            <Button 
              onClick={handleEnroll}
              size="lg"
              className="gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="animate-spin">⏳</span>
              ) : isEnrolled ? (
                <>
                  <GraduationCap className="w-5 h-5" />
                  ابدأ الدراسة
                </>
              ) : (
                <>
                  {isFree() ? <GraduationCap className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
                  {isFree() ? 'سجل مجاناً' : 'اشترِ الآن'}
                </>
              )}
            </Button>
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
