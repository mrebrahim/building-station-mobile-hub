
import { useQuery } from "@tanstack/react-query";
import { wooCommerceService } from "@/services/woocommerce";
import { ArrowRight, Search, Filter } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CategoryProducts = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'price'>('name');

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

  // Filter and sort products
  const displayProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name, 'ar');
      } else {
        const priceA = parseFloat(a.price) || 0;
        const priceB = parseFloat(b.price) || 0;
        return priceA - priceB;
      }
    });

  console.log('Category Products - Category ID:', categoryId);
  console.log('Category Products - Current Category:', currentCategory);
  console.log('Category Products - Products:', products);
  console.log('Category Products - Display Products:', displayProducts);
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

      {/* Search and Filter Section */}
      <div className="px-3 py-3 bg-white border-b border-gray-100">
        <div className="flex gap-2 items-center">
          <div className="relative flex-1">
            <Search className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="البحث في المنتجات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-9 text-sm h-9 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            className="w-9 h-9 border-gray-200 hover:bg-gray-50"
            onClick={() => setShowFilterMenu(!showFilterMenu)}
          >
            <Filter className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Filter Menu */}
        {showFilterMenu && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs font-medium text-gray-700 mb-2">ترتيب حسب:</p>
            <div className="flex gap-2">
              <Button
                variant={sortBy === 'name' ? 'default' : 'outline'}
                size="sm"
                className="flex-1 text-xs h-8"
                onClick={() => setSortBy('name')}
              >
                الاسم
              </Button>
              <Button
                variant={sortBy === 'price' ? 'default' : 'outline'}
                size="sm"
                className="flex-1 text-xs h-8"
                onClick={() => setSortBy('price')}
              >
                السعر
              </Button>
            </div>
          </div>
        )}
      </div>

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
        ) : displayProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {displayProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">لا توجد منتجات تطابق البحث</h3>
            <p className="text-gray-600 mb-6">جرب البحث بكلمات مختلفة</p>
            <Button 
              variant="outline" 
              onClick={() => setSearchTerm('')}
              className="text-blue-500 border-blue-500 hover:bg-blue-50"
            >
              مسح البحث
            </Button>
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
