
import { useQuery } from "@tanstack/react-query";
import { wooCommerceService } from "@/services/woocommerce";
import { ArrowRight } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";

const CategoryProducts = () => {
  const { categoryId } = useParams<{ categoryId: string }>();

  // Fetch category details
  const { data: allCategories = [] } = useQuery({
    queryKey: ['all-categories'],
    queryFn: () => wooCommerceService.getCategories({ per_page: 100 }),
  });

  const currentCategory = allCategories.find(cat => cat.id.toString() === categoryId);

  // Fetch products for this category
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['category-products', categoryId],
    queryFn: () => wooCommerceService.getProducts({ 
      category: categoryId,
      per_page: 50 
    }),
    enabled: !!categoryId,
  });

  console.log('Category Products - Category ID:', categoryId);
  console.log('Category Products - Current Category:', currentCategory);
  console.log('Category Products - Products:', products);
  console.log('Category Products - Error:', error);

  return (
    <div className="min-h-screen bg-gray-50 rtl">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <div className="w-12"></div>
          <h1 className="text-xl font-bold text-gray-800">
            {currentCategory ? currentCategory.name : 'منتجات الفئة'}
          </h1>
          <Link to="/categories">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Products Content */}
      <div className="px-4 py-6">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 animate-pulse">
                <div className="w-full h-40 bg-gray-200 rounded-lg mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">لا توجد منتجات متاحة</h3>
            <p className="text-gray-600 mb-6">
              {currentCategory 
                ? `لا توجد منتجات في فئة "${currentCategory.name}" حالياً`
                : 'لا توجد منتجات في هذه الفئة حالياً'
              }
            </p>
            <Link to="/categories">
              <Button variant="outline" className="text-red-500 border-red-500 hover:bg-red-50">
                العودة للفئات
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryProducts;
