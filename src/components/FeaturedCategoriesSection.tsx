
import { useQuery } from "@tanstack/react-query";
import { wooCommerceService } from "@/services/woocommerce";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface Category {
  id: number;
  name: string;
  count: number;
  image?: { src: string; alt?: string };
}

const FeaturedCategoriesSection = () => {
  // Fetch categories from WooCommerce API
  const { data: apiCategories = [], isLoading } = useQuery({
    queryKey: ['featured-categories'],
    queryFn: () => wooCommerceService.getCategories({ per_page: 8 }),
    retry: 3,
    retryDelay: 1000,
  });

  // Transform API categories to display format, filtering out empty categories
  const displayCategories = apiCategories
    .filter(cat => cat.count > 0) // Only show categories with products
    .slice(0, 8) // Limit to 8 categories
    .map(apiCat => ({
      id: apiCat.id,
      name: apiCat.name,
      count: apiCat.count,
      image: apiCat.image || undefined
    }));

  return (
    <div className="px-4 py-6 bg-white">
      {/* Header with View All button */}
      <div className="flex items-center justify-between mb-4">
        <Link to="/categories">
          <Button variant="outline" className="text-red-500 border-red-500 hover:bg-red-50 text-sm px-4 py-2">
            عرض الكل
          </Button>
        </Link>
        <h2 className="text-xl font-bold text-gray-800">تسوق حسب الفئة</h2>
      </div>

      {/* Categories Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-gray-50 rounded-2xl p-4 text-center shadow-sm animate-pulse">
              <div className="w-full h-24 bg-gray-200 rounded-xl mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
            </div>
          ))}
        </div>
      ) : displayCategories.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
            {displayCategories.map((category) => (
              <Link key={category.id} to={`/category/${category.id}`} className="block">
                <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                  <div className="w-full h-24 bg-gray-50 rounded-xl mb-3 flex items-center justify-center overflow-hidden">
                    {category.image && category.image.src ? (
                      <img 
                        src={category.image.src} 
                        alt={category.image.alt || category.name}
                        loading="lazy"
                        onError={(e) => {
                          console.error("Category image failed to load:", e.currentTarget.src);
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement!.innerHTML = '<span class="text-2xl">📦</span>';
                        }}
                        onLoad={() => console.log("Successfully loaded category image:", category.image?.src)}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <span className="text-2xl">📦</span>
                    )}
                  </div>
                  <h3 className="text-sm font-semibold text-gray-800 leading-tight">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
          
          {/* Pagination dots */}
          <div className="flex justify-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">📦</div>
          <p className="text-gray-600 mb-4">لا توجد فئات متاحة حالياً</p>
          <p className="text-sm text-gray-500">يرجى المحاولة لاحقاً أو التحقق من الاتصال بالإنترنت</p>
        </div>
      )}
    </div>
  );
};

export default FeaturedCategoriesSection;
