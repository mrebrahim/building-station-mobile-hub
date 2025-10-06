
import { useQuery } from "@tanstack/react-query";
import { wooCommerceService } from "@/services/woocommerce";
import { ArrowRight, Search, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import EnhancedCategoryCard from "@/components/EnhancedCategoryCard";
import CategoryBreadcrumb from "@/components/CategoryBreadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Category } from "@/services/woocommerce/types";

const Categories = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedParent, setSelectedParent] = useState<number | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());

  // Fetch all categories from WooCommerce API
  const { data: apiCategories = [], isLoading, error } = useQuery({
    queryKey: ['all-categories'],
    queryFn: () => wooCommerceService.getCategories({ per_page: 100 }),
    retry: 3,
    retryDelay: 1000,
  });

  // Transform and filter categories
  const displayCategories = apiCategories
    .filter(cat => {
      const hasProducts = cat.count > 0;
      const matchesSearch = cat.name.toLowerCase().includes(searchTerm.toLowerCase());
      const isParentCategory = !cat.parent || cat.parent === 0;
      return hasProducts && matchesSearch && isParentCategory;
    })
    .map(apiCat => ({
      id: apiCat.id,
      name: apiCat.name,
      slug: apiCat.slug,
      description: apiCat.description || '',
      count: apiCat.count,
      image: apiCat.image || undefined,
      parent: apiCat.parent || 0
    }));


  const breadcrumbItems = [
    { name: "جميع الفئات", path: "/categories" }
  ];

  console.log('All API Categories:', apiCategories);
  console.log('Display Categories:', displayCategories);
  console.log('Categories Error:', error);

  return (
    <div className="min-h-screen bg-gray-50 rtl">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="flex items-center justify-between p-3">
          <div className="w-10"></div>
          <h1 className="text-lg font-bold text-gray-800">جميع الفئات</h1>
          <Link to="/">
            <Button variant="ghost" size="icon" className="w-9 h-9 rounded-full hover:bg-gray-100">
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Breadcrumb Navigation */}
      <CategoryBreadcrumb items={breadcrumbItems} />

      {/* Search and Filter Section */}
      <div className="px-3 py-3 bg-white border-b border-gray-100">
        <div className="flex gap-2 items-center">
          <div className="relative flex-1">
            <Search className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="البحث في الفئات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-9 text-sm h-9 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <Button variant="outline" size="icon" className="w-9 h-9 border-gray-200 hover:bg-gray-50">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Categories Content */}
      <div className="px-3 py-4 pb-20">
        {isLoading ? (
          <div className="grid grid-cols-3 gap-2.5">
            {Array.from({ length: 18 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-2.5 text-center shadow-sm animate-pulse border border-gray-100">
                <div className="w-12 h-12 bg-gray-200 rounded-lg mx-auto mb-1.5"></div>
                <div className="h-2.5 bg-gray-200 rounded mb-1"></div>
                <div className="h-2 bg-gray-200 rounded w-2/3 mx-auto"></div>
              </div>
            ))}
          </div>
        ) : displayCategories.length > 0 ? (
          <div className="grid grid-cols-3 gap-2.5">
            {displayCategories.map((category) => (
              <EnhancedCategoryCard 
                key={category.id} 
                category={category}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {searchTerm ? 'لا توجد فئات تطابق البحث' : 'لا توجد فئات متاحة'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? 'جرب البحث بكلمات مختلفة أو امسح مربع البحث لعرض جميع الفئات' 
                : 'يرجى المحاولة لاحقاً أو التحقق من الاتصال بالإنترنت'
              }
            </p>
            <div className="flex gap-3 justify-center">
              {searchTerm && (
                <Button 
                  variant="outline" 
                  onClick={() => setSearchTerm('')}
                  className="text-blue-500 border-blue-500 hover:bg-blue-50"
                >
                  مسح البحث
                </Button>
              )}
              <Link to="/">
                <Button variant="outline" className="text-red-500 border-red-500 hover:bg-red-50">
                  العودة للرئيسية
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
