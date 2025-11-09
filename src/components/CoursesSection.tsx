import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import CourseCard from "./CourseCard";
import CourseDetailsDialog from "./CourseDetailsDialog";
import { fetchCourses, Course } from "@/services/courses";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const CoursesSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const itemsPerPage = 9;

  const { data: courses = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['courses'],
    queryFn: fetchCourses,
    retry: 2,
  });

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set(courses.map(c => c.category).filter(Boolean));
    return Array.from(cats);
  }, [courses]);

  // Filter and sort courses
  const filteredCourses = useMemo(() => {
    let filtered = [...courses];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(course => course.category === selectedCategory);
    }

    // Level filter
    if (selectedLevel !== "all") {
      filtered = filtered.filter(course => course.level === selectedLevel);
    }

    // Sorting
    switch (sortBy) {
      case "newest":
        // Assuming courses come newest first from API
        break;
      case "price-low":
        filtered.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case "price-high":
        filtered.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case "rating":
        // Add rating logic if available
        break;
    }

    return filtered;
  }, [courses, searchQuery, selectedCategory, selectedLevel, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedLevel, sortBy]);

  const handleDetailsClick = (course: Course) => {
    setSelectedCourse(course);
    setDialogOpen(true);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedLevel("all");
    setSortBy("newest");
  };

  if (isError) {
    return (
      <div className="px-3 mb-6">
        <div className="text-center py-16 px-4">
          <div className="text-5xl mb-4">⚠️</div>
          <p className="text-gray-700 font-medium mb-4">تعذّر تحميل الدورات</p>
          <Button onClick={() => refetch()}>إعادة المحاولة</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-3 mb-6" dir="rtl">
      <h2 className="text-2xl font-bold mb-4 text-right text-gray-900">الدورات المتاحة</h2>
      
      {/* Filters */}
      <div className="mb-6 space-y-3">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="ابحث عن دورة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10 text-right"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="كل التصنيفات" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل التصنيفات</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedLevel} onValueChange={setSelectedLevel}>
            <SelectTrigger>
              <SelectValue placeholder="كل المستويات" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل المستويات</SelectItem>
              <SelectItem value="مبتدئ">مبتدئ</SelectItem>
              <SelectItem value="متوسط">متوسط</SelectItem>
              <SelectItem value="متقدم">متقدم</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="الترتيب" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">الأحدث</SelectItem>
              <SelectItem value="rating">الأعلى تقييمًا</SelectItem>
              <SelectItem value="price-low">الأقل سعرًا</SelectItem>
              <SelectItem value="price-high">الأعلى سعرًا</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Courses Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-video w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      ) : paginatedCourses.length === 0 ? (
        <div className="text-center py-16 px-4">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-gray-700 font-medium mb-2">لا توجد دورات مطابقة</p>
          <p className="text-sm text-gray-500 mb-4">جرب تعديل معايير البحث</p>
          <Button onClick={handleResetFilters} variant="outline">
            إعادة تعيين الفلاتر
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {paginatedCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onDetailsClick={handleDetailsClick}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
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
