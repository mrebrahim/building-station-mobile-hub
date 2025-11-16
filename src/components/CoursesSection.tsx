import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import CourseCard from "./CourseCard";
import CourseDetailsDialog from "./CourseDetailsDialog";
import { fetchCourses, Course } from "@/services/courses";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

const CoursesSection = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: courses = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['courses'],
    queryFn: fetchCourses,
    retry: 2,
  });

  // Group courses into slides of 3
  const coursesPerSlide = 3;
  const slides = [];
  for (let i = 0; i < courses.length; i += coursesPerSlide) {
    slides.push(courses.slice(i, i + coursesPerSlide));
  }

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });

    // Auto-scroll functionality
    const autoScroll = setInterval(() => {
      if (api && slides.length > 1) {
        const currentIndex = api.selectedScrollSnap();
        const nextIndex = (currentIndex + 1) % slides.length;
        api.scrollTo(nextIndex);
      }
    }, 5000); // Change slide every 5 seconds

    return () => {
      clearInterval(autoScroll);
    };
  }, [api, slides.length]);

  const scrollToSlide = (index: number) => {
    api?.scrollTo(index);
  };

  const handleDetailsClick = (course: Course) => {
    setSelectedCourse(course);
    setDialogOpen(true);
  };

  if (isError) {
    return (
      <div className="px-4 py-6 bg-white">
        <div className="text-center py-16 px-4">
          <div className="text-5xl mb-4">⚠️</div>
          <p className="text-gray-700 font-medium mb-4">تعذّر تحميل الدورات</p>
          <Button onClick={() => refetch()}>إعادة المحاولة</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 bg-white" dir="rtl">
      {/* Header with View All button */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">الدورات التدريبية</h2>
        <Link to="/all-courses">
          <Button variant="outline" className="text-red-500 border-red-500 hover:bg-red-50 text-sm px-4 py-2">
            عرض الكل
          </Button>
        </Link>
      </div>

      {/* Courses Carousel */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-video w-full rounded-xl" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      ) : courses.length > 0 ? (
        <>
          <Carousel 
            setApi={setApi} 
            className="w-full mb-6"
            opts={{
              align: "start",
              loop: true,
              direction: "rtl"
            }}
          >
            <CarouselContent>
              {slides.map((slide, slideIndex) => (
                <CarouselItem key={slideIndex}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {slide.map((course) => (
                      <div key={course.id} className="animate-fade-in">
                        <CourseCard
                          course={course}
                          onDetailsClick={handleDetailsClick}
                        />
                      </div>
                    ))}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          
          {/* Functional Pagination dots */}
          {count > 1 && (
            <div className="flex justify-center gap-2">
              {Array.from({ length: count }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    current === index + 1 
                      ? "bg-red-500 scale-110" 
                      : "bg-gray-300 hover:bg-gray-400 hover:scale-105"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16 px-4">
          <div className="text-5xl mb-4">📚</div>
          <p className="text-gray-700 font-medium mb-2">لا توجد دورات متاحة حالياً</p>
          <p className="text-sm text-gray-500">يرجى المحاولة لاحقاً</p>
        </div>
      )}

      {/* Details Dialog */}
      <CourseDetailsDialog
        course={selectedCourse}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
};

export default CoursesSection;
