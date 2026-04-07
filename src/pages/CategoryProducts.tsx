import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Search } from "lucide-react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { ProductSkeletonGrid } from "@/components/ui/product-skeleton";
import BottomNavigation from "@/components/BottomNavigation";

// ✅ جلب المنتجات من WooCommerce API
const fetchCategoryProducts = async (categoryId: string) => {
  const url = new URL('/api/woocommerce', window.location.origin);
  url.searchParams.append('endpoint', 'products');
  url.searchParams.append('category', categoryId);
  url.searchParams.append('per_page', '50');
  url.searchParams.append('status', 'publish');
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Failed');
  return res.json();
};

const fetchCategory = async (categoryId: string) => {
  const url = new URL('/api/woocommerce', window.location.origin);
  url.searchParams.append('endpoint', `products/categories/${categoryId}`);
  const res = await fetch(url.toString());
  if (!res.ok) return null;
  return res.json();
};

const CategoryProducts = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: category } = useQuery({
    queryKey: ['category', categoryId],
    queryFn: () => fetchCategory(categoryId!),
    enabled: !!categoryId,
  });

  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['category-products-wc', categoryId],
    queryFn: () => fetchCategoryProducts(categoryId!),
    enabled: !!categoryId,
  });

  const displayProducts = products.filter((p: any) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 rtl pb-24">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center">
            <ArrowRight className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-base font-bold text-gray-800">{category?.name || 'المنتجات'}</h1>
          <div className="w-9" />
        </div>

        {/* Search */}
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="ابحث في المنتجات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-9 text-right h-9 text-sm"
              dir="rtl"
            />
          </div>
        </div>
      </header>

      <div className="p-4">
        {isLoading ? (
          <ProductSkeletonGrid count={6} />
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-gray-500">فشل تحميل المنتجات</p>
          </div>
        ) : displayProducts.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-5xl mb-4 block">📦</span>
            <p className="text-gray-500">{searchTerm ? 'لا توجد نتائج' : 'لا توجد منتجات في هذا التصنيف'}</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-400 text-right mb-3">{displayProducts.length} منتج</p>
            <div className="grid grid-cols-2 gap-3">
              {displayProducts.map((product: any) => (
                <ProductCard key={product.id} product={{
                  id: product.id,
                  name: product.name,
                  price: product.price || '0',
                  regular_price: product.regular_price || '0',
                  images: product.images || [],
                  categories: product.categories || [],
                  stock_status: product.stock_status || 'instock',
                  featured: product.featured || false,
                }} />
              ))}
            </div>
          </>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default CategoryProducts;
