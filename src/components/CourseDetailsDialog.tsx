import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, BookOpen, User } from "lucide-react";
import { Course } from "@/services/courses";

interface CourseDetailsDialogProps {
  course: Course | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CourseDetailsDialog = ({ course, open, onOpenChange }: CourseDetailsDialogProps) => {
  if (!course) return null;

  const formatPrice = (price: string | number) => {
    if (!price || price === 0 || price === '0') return 'مجاني';
    return `${price} ر.س`;
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
          
          <div className="text-3xl font-bold text-primary text-right">
            {formatPrice(course.price)}
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
