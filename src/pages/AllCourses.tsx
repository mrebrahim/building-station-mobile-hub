import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchCourses, Course } from "@/services/courses";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import CourseCard from "@/components/CourseCard";
import CourseDetailsDialog from "@/components/CourseDetailsDialog";

const AllCourses = () => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: courses = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['courses'],
    queryFn: fetchCourses,
    retry: 2,
  });

  const handleDetailsClick = (course: Course) => {
    setSelectedCourse(course);
    setDialogOpen(true);
  };

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50" dir="rtl">
        <header className="bg-white shadow-sm sticky top-0 z-50">
          <div className="flex items-center justify-between p-4">
            <div className="w-6"></div>
            <h1 className="text-lg font-medium">جميع الدورات</h1>
            <Link to="/">
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </Link>
          </div>
        </header>

        <div className="p-4">
          <div className="text-center py-16 px-4">
            <div className="text-5xl mb-4">⚠️</div>
            <p className="text-gray-700 font-medium mb-4">تعذّر تحميل الدورات</p>
            <Button onClick={() => refetch()}>إعادة المحاولة</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <div className="w-6"></div>
          <h1 className="text-lg font-medium">جميع الدورات</h1>
          <Link to="/">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </Link>
        </div>
      </header>

      <div className="p-4">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-video w-full rounded-xl" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="text-5xl mb-4">📚</div>
            <p className="text-gray-700 font-medium">لا توجد دورات متاحة حالياً</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => (
              <div key={course.id} className="animate-fade-in">
                <CourseCard 
                  course={course} 
                  onDetailsClick={handleDetailsClick}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedCourse && (
        <CourseDetailsDialog
          course={selectedCourse}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      )}
    </div>
  );
};

export default AllCourses;
