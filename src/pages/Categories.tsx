
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

  const handleSubcategoryExpand = (categoryId: number, subcategories: Category[]) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

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
        <div className="flex items-center justify-between p-4">
          <div className="w-12"></div>
          <h1 className="text-xl font-bold text-gray-800">جميع الفئات</h1>
          <Link to="/">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100">
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Breadcrumb Navigation */}
      <CategoryBreadcrumb items={breadcrumbItems} />

      {/* Search and Filter Section */}
      <div className="px-4 py-4 bg-white border-b border-gray-100">
        <div className="flex gap-3 items-center">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="البحث في الفئات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <Button variant="outline" size="icon" className="border-gray-200 hover:bg-gray-50">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

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
              <EnhancedCategoryCard 
                key={category.id} 
                category={category}
                onSubcategoryClick={(subcategories) => handleSubcategoryExpand(category.id, subcategories)}
                showSubcategories={expandedCategories.has(category.id)}
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
