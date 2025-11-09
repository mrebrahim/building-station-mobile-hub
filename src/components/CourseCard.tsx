import { GraduationCap, BookOpen, User } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Course } from "@/services/courses";

interface CourseCardProps {
  course: Course;
  onDetailsClick: (course: Course) => void;
}

const CourseCard = ({ course, onDetailsClick }: CourseCardProps) => {
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const formatPrice = (price: string | number) => {
    if (!price || price === 0 || price === '0') return 'مجاني';
    return `${price} ر.س`;
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
      
      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={() => onDetailsClick(course)}
          className="w-full"
          variant="outline"
        >
          التفاصيل
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
