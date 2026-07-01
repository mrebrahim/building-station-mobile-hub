import { useQuery } from "@tanstack/react-query";
import { ArrowRight, ChevronDown, ChevronUp, Users, GraduationCap } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import BottomNavigation from "@/components/BottomNavigation";
import { wcFetch } from "@/lib/wooProxy";

interface Category {
  id: number;
  name: string;
  slug: string;
  parent: number;
  count: number;
  image?: { src: string; alt: string };
}

const fetchAllCategories = async (): Promise<Category[]> => {
  const data = await wcFetch<any[]>('products/categories', {
    per_page: 100,
    orderby: 'name',
    order: 'asc',
  });
  return (data || []).map((cat: any) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    parent: cat.parent || 0,
    count: cat.count || 0,
    image: cat.image ? { src: cat.image.src, alt: cat.image.alt || cat.name } : undefined,
  }));
};

const Categories = () => {
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());
  const navigate = useNavigate();

  const { data: allCategories = [], isLoading } = useQuery({
    queryKey: ['wc-categories-direct'],
    queryFn: fetchAllCategories,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  const parentCategories = allCategories
    .filter(cat => cat.parent === 0)
    .sort((a, b) => a.name.localeCompare(b.name, 'ar'));

  const getSubCategories = (parentId: number) =>
    allCategories.filter(cat => cat.parent === parentId);

  const toggleCategory = (id: number) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 rtl pb-24">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center">
            <ArrowRight className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-lg font-bold text-gray-800">التصنيفات</h1>
          <div className="w-9" />
        </div>
      </header>

      {/* Categories List */}
      <div className="bg-white mt-2">
        {isLoading ? (
          <div className="divide-y divide-gray-100">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="px-4 py-4 animate-pulse flex justify-end">
                <div className="h-5 bg-gray-200 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {parentCategories.map((category) => {
              const subCategories = getSubCategories(category.id);
              const isExpanded = expandedCategories.has(category.id);
              const hasSubCategories = subCategories.length > 0;

              return (
                <div key={category.id}>
                  <div
                    className="flex items-center justify-between px-4 py-4 bg-white active:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => {
                      if (hasSubCategories) {
                        toggleCategory(category.id);
                      } else {
                        navigate(`/category/${category.id}`);
                      }
                    }}
                  >
                    <div className="text-gray-400 w-6 flex justify-center">
                      {hasSubCategories && (
                        isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />
                      )}
                    </div>
                    <span className="text-base font-medium text-gray-800">{category.name}</span>
                  </div>

                  {hasSubCategories && isExpanded && (
                    <div className="bg-gray-50">
                      {subCategories.map((sub) => (
                        <Link key={sub.id} to={`/category/${sub.id}`}
                          className="flex items-center justify-end px-8 py-3 border-b border-gray-100 last:border-b-0 active:bg-gray-100 transition-colors">
                          <span className="text-sm text-gray-700">{sub.name}</span>
                        </Link>
                      ))}
                      <Link to={`/category/${category.id}`}
                        className="flex items-center justify-end px-8 py-3 active:bg-gray-100 transition-colors">
                        <span className="text-sm text-red-500 font-medium">عرض الكل ›</span>
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ✅ زرار كورساتنا */}
      <div className="px-4 mt-4">
        <Link to="/courses">
          <div className="flex items-center justify-between bg-white border border-gray-200 rounded-2xl px-4 py-4 shadow-sm active:bg-gray-50 transition-colors">
            <ArrowRight className="w-5 h-5 text-gray-400" />
            <div className="flex items-center gap-3">
              <span className="text-base font-medium text-gray-800">كورساتنا</span>
              <div className="w-10 h-10 bg-cyan-50 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-cyan-500" />
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* ✅ زرار شركاؤنا */}
      <div className="px-4 mt-4">
        <Link to="/partners">
          <div className="flex items-center justify-between bg-white border border-gray-200 rounded-2xl px-4 py-4 shadow-sm active:bg-gray-50 transition-colors">
            <ArrowRight className="w-5 h-5 text-gray-400" />
            <div className="flex items-center gap-3">
              <span className="text-base font-medium text-gray-800">شركاؤنا</span>
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-500" />
              </div>
            </div>
          </div>
        </Link>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Categories;
