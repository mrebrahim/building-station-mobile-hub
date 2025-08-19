import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { wooCommerceService } from "@/services/woocommerce";
import { ArrowRight } from "lucide-react";
import CategoryCard from "@/components/CategoryCard";
import { Button } from "@/components/ui/button";

const SubCategories = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  
  // Fetch all categories to find parent and sub-categories
  const { data: apiCategories = [], isLoading, error } = useQuery({
    queryKey: ['all-categories'],
    queryFn: () => wooCommerceService.getCategories({ per_page: 100 }),
    retry: 3,
    retryDelay: 1000,
  });

  // Find the parent category
  const parentCategory = apiCategories.find(cat => cat.id === parseInt(categoryId || '0'));
  
  // Get sub-categories
  const subCategories = apiCategories
    .filter(cat => cat.parent_id === parseInt(categoryId || '0') && cat.count > 0)
    .map(apiCat => ({
      id: apiCat.id,
      name: apiCat.name,
      count: apiCat.count,
      image: apiCat.image || undefined
    }));

  // If no sub-categories, show products directly
  if (!isLoading && subCategories.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 rtl">
        <header className="bg-white shadow-sm sticky top-0 z-50">
          <div className="flex items-center justify-between p-4">
            <div className="w-12"></div>
            <h1 className="text-xl font-bold text-gray-800">{parentCategory?.name || 'منتجات الفئة'}</h1>
            <Link to="/categories">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </header>

        <div className="px-4 py-6">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🛍️</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">سيتم عرض المنتجات هنا</h3>
            <p className="text-gray-600 mb-6">لا توجد فئات فرعية، عرض المنتجات مباشرة</p>
            <Link to={`/category/${categoryId}`}>
              <Button className="bg-red-500 hover:bg-red-600 text-white">
                عرض المنتجات
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 rtl">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <div className="w-12"></div>
          <h1 className="text-xl font-bold text-gray-800">{parentCategory?.name || 'الفئات الفرعية'}</h1>
          <Link to="/categories">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Sub-Categories Content */}
      <div className="px-4 py-6">
        {isLoading ? (
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-3 text-center shadow-sm animate-pulse border border-gray-100">
                <div className="w-14 h-14 bg-gray-200 rounded-xl mx-auto mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3 mx-auto"></div>
              </div>
            ))}
          </div>
        ) : subCategories.length > 0 ? (
          <div className="grid grid-cols-3 gap-3">
            {subCategories.map((category) => (
              <Link key={category.id} to={`/category/${category.id}`} className="block">
                <div className="bg-white rounded-2xl p-3 text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                  <div className="w-14 h-14 bg-gray-50 rounded-xl mx-auto mb-2 flex items-center justify-center overflow-hidden">
                    {category.image && category.image.src ? (
                      <img 
                        src={category.image.src} 
                        alt={category.image.alt || category.name}
                        loading="lazy"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <span className="text-xl">📦</span>
                    )}
                  </div>
                  <h4 className="text-xs font-semibold text-gray-800 leading-tight mb-1">{category.name}</h4>
                  <p className="text-xs text-gray-400">{category.count} منتج</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">لا توجد فئات فرعية</h3>
            <p className="text-gray-600 mb-6">يرجى الرجوع أو اختيار فئة أخرى</p>
            <Link to="/categories">
              <Button variant="outline" className="text-red-500 border-red-500 hover:bg-red-50">
                الرجوع للفئات
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubCategories;