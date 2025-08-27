import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { wooCommerceService } from "@/services/woocommerce";
import { Button } from "@/components/ui/button";
import CategoryCard from "@/components/CategoryCard";
import CategoryBreadcrumb from "@/components/CategoryBreadcrumb";

const SubCategories = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  
  // Fetch parent category info
  const { data: allCategories = [] } = useQuery({
    queryKey: ['all-categories'],
    queryFn: () => wooCommerceService.getCategories({ per_page: 100 }),
  });

  const parentCategory = allCategories.find(cat => cat.id === parseInt(categoryId || '0'));

  // Fetch subcategories
  const { data: subcategories = [], isLoading } = useQuery({
    queryKey: ['subcategories', categoryId],
    queryFn: () => wooCommerceService.getCategories({ 
      parent: parseInt(categoryId || '0'),
      per_page: 100 
    }),
    enabled: !!categoryId,
  });

  const breadcrumbItems = [
    { name: "جميع الفئات", path: "/categories" },
    { name: parentCategory?.name || "الفئة الرئيسية", path: `/categories` },
  ];

  return (
    <div className="min-h-screen bg-gray-50 rtl">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <div className="w-12"></div>
          <h1 className="text-xl font-bold text-gray-800">
            {parentCategory?.name || "الفئات الفرعية"}
          </h1>
          <Link to="/categories">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100">
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Breadcrumb Navigation */}
      <CategoryBreadcrumb items={breadcrumbItems} />

      {/* Subcategories Content */}
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
        ) : subcategories.length > 0 ? (
          <div className="grid grid-cols-3 gap-3">
            {subcategories.map((subcategory) => (
              <CategoryCard 
                key={subcategory.id} 
                category={subcategory}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📂</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              لا توجد فئات فرعية
            </h3>
            <p className="text-gray-600 mb-6">
              هذه الفئة لا تحتوي على فئات فرعية حالياً
            </p>
            <div className="flex gap-3 justify-center">
              <Link to={`/category/${categoryId}`}>
                <Button variant="outline" className="text-blue-500 border-blue-500 hover:bg-blue-50">
                  عرض المنتجات
                </Button>
              </Link>
              <Link to="/categories">
                <Button variant="outline" className="text-red-500 border-red-500 hover:bg-red-50">
                  العودة للفئات
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubCategories;