
import { useQuery } from "@tanstack/react-query";
import { wooCommerceService } from "@/services/woocommerce";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import CategoryCard from "@/components/CategoryCard";
import { Button } from "@/components/ui/button";

const Categories = () => {
  // Fetch all categories from WooCommerce API
  const { data: apiCategories = [], isLoading, error } = useQuery({
    queryKey: ['all-categories'],
    queryFn: () => wooCommerceService.getCategories({ per_page: 100 }),
    retry: 3,
    retryDelay: 1000,
  });

  // Transform API categories to display format, filtering for main categories only
  const displayCategories = apiCategories
    .filter(cat => cat.count > 0 && (!cat.parent_id || cat.parent_id === 0)) // Only show parent categories
    .map(apiCat => ({
      id: apiCat.id,
      name: apiCat.name,
      count: apiCat.count,
      image: apiCat.image || undefined,
      parent_id: apiCat.parent_id
    }));

  console.log('All API Categories:', apiCategories);
  console.log('Display Categories:', displayCategories);
  console.log('Categories Error:', error);

  return (
    <div className="min-h-screen bg-gray-50 rtl">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <div className="w-12"></div>
          <h1 className="text-xl font-bold text-gray-800">جميع الفئات</h1>
          <Link to="/">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Categories Content */}
      <div className="px-4 py-6">
        {isLoading ? (
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 18 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-3 text-center shadow-sm animate-pulse border border-gray-100">
                <div className="w-14 h-14 bg-gray-200 rounded-xl mx-auto mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3 mx-auto"></div>
              </div>
            ))}
          </div>
        ) : displayCategories.length > 0 ? (
          <div className="grid grid-cols-3 gap-3">
            {displayCategories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">لا توجد فئات متاحة</h3>
            <p className="text-gray-600 mb-6">يرجى المحاولة لاحقاً أو التحقق من الاتصال بالإنترنت</p>
            <Link to="/">
              <Button variant="outline" className="text-red-500 border-red-500 hover:bg-red-50">
                العودة للرئيسية
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
