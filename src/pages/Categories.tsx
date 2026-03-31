import { useQuery } from "@tanstack/react-query";
import { wooCommerceService } from "@/services/woocommerce";
import { ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import BottomNavigation from "@/components/BottomNavigation";

const Categories = () => {
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());
  const navigate = useNavigate();

  const { data: apiCategories = [], isLoading } = useQuery({
    queryKey: ['all-categories'],
    queryFn: () => wooCommerceService.getCategories({ per_page: 100 }),
    retry: 3,
    retryDelay: 1000,
  });

  const parentCategories = apiCategories
    .filter(cat => (!cat.parent || cat.parent === 0) && cat.count > 0)
    .sort((a, b) => a.name.localeCompare(b.name, 'ar'));

  const getSubCategories = (parentId: number) =>
    apiCategories.filter(cat => cat.parent === parentId && cat.count > 0);

  const toggleCategory = (id: number) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 rtl pb-20">
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
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="px-4 py-4 animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-1/3 ml-auto" />
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
                  {/* Parent Category Row */}
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
                    {/* Left: chevron */}
                    <div className="text-gray-400 w-6 flex justify-center">
                      {hasSubCategories && (
                        isExpanded
                          ? <ChevronUp className="w-5 h-5" />
                          : <ChevronDown className="w-5 h-5" />
                      )}
                    </div>

                    {/* Right: name + image */}
                    <div className="flex items-center gap-2">
                      <span className="text-base font-medium text-gray-800">{category.name}</span>
                      {category.image?.src && (
                        <img
                          src={category.image.src}
                          alt={category.name}
                          className="w-8 h-8 rounded-lg object-cover"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      )}
                    </div>
                  </div>

                  {/* Sub Categories Accordion */}
                  {hasSubCategories && isExpanded && (
                    <div className="bg-gray-50">
                      {subCategories.map((sub) => (
                        <Link
                          key={sub.id}
                          to={`/category/${sub.id}`}
                          className="flex items-center justify-end px-8 py-3 border-b border-gray-100 last:border-b-0 active:bg-gray-100 transition-colors"
                        >
                          <span className="text-sm text-gray-700">{sub.name}</span>
                        </Link>
                      ))}
                      <Link
                        to={`/category/${category.id}`}
                        className="flex items-center justify-end px-8 py-3 active:bg-gray-100 transition-colors"
                      >
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

      <BottomNavigation />
    </div>
  );
};

export default Categories;
