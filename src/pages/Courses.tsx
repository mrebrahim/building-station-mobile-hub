import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, ExternalLink, GraduationCap, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import BottomNavigation from "@/components/BottomNavigation";
import { edgeFunctionGet } from "@/lib/wooProxy";

const fetchCourses = async () => {
  return edgeFunctionGet<any[]>('tutor-lms-proxy', { action: 'list' });
};

const Courses = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const { data: courses = [], isLoading, error } = useQuery({
    queryKey: ['wp-courses'],
    queryFn: fetchCourses,
    staleTime: 1000 * 60 * 5,
  });

  const getImage = (course: any) => {
    return course?._embedded?.['wp:featuredmedia']?.[0]?.source_url || null;
  };

  const getCategories = (course: any) => {
    const terms = course?._embedded?.['wp:term']?.[0] || [];
    return terms.map((t: any) => t.name).slice(0, 2).join(' • ');
  };

  const filtered = courses.filter((c: any) =>
    c.title?.rendered?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 rtl pb-24">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center">
            <ArrowRight className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-lg font-bold text-gray-800">كورساتنا</h1>
          <div className="w-9" />
        </div>
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="ابحث في الكورسات..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-9 text-right h-9 text-sm"
              dir="rtl"
            />
          </div>
        </div>
      </header>

      <div className="p-4">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
                <div className="h-32 bg-gray-200" />
                <div className="p-3">
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <GraduationCap className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">فشل تحميل الكورسات</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <GraduationCap className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">لا توجد كورسات</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-400 text-right mb-3">{filtered.length} كورس</p>
            <div className="grid grid-cols-2 gap-4">
              {filtered.map((course: any) => {
                const image = getImage(course);
                const cats = getCategories(course);
                return (
                  <a
                    key={course.id}
                    href={course.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 active:opacity-80 transition-opacity block"
                  >
                    {/* صورة الكورس */}
                    <div className="relative h-32 bg-gray-100">
                      {image ? (
                        <img src={image} alt={course.title?.rendered} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-50 to-blue-50">
                          <GraduationCap className="w-10 h-10 text-cyan-400" />
                        </div>
                      )}
                      <div className="absolute top-2 left-2 bg-cyan-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                        <ExternalLink className="w-3 h-3" />
                        سجّل
                      </div>
                    </div>

                    {/* بيانات الكورس */}
                    <div className="p-3">
                      <h3
                        className="text-sm font-bold text-gray-800 text-right leading-snug mb-1 line-clamp-2"
                        dangerouslySetInnerHTML={{ __html: course.title?.rendered }}
                      />
                      {cats && (
                        <p className="text-xs text-gray-400 text-right truncate">{cats}</p>
                      )}
                    </div>
                  </a>
                );
              })}
            </div>
          </>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Courses;
