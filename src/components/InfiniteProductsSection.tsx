import { useCallback } from "react";
import ProductCard from "./ProductCard";
import { ProductSkeletonGrid } from "./ui/product-skeleton";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { Button } from "./ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: number;
  name: string;
  price: string;
  images?: Array<{ src: string; alt?: string }>;
  categories?: Array<{ name: string }>;
  stock_status?: string;
}

// Fetch products from database
const fetchProductsFromDB = async (page: number, limit: number): Promise<Product[]> => {
  const startIndex = (page - 1) * limit;
  
  const { data: products, error } = await supabase
    .from('wc_products')
    .select(`
      id,
      name,
      price,
      image_url,
      image_alt,
      stock_status
    `)
    .order('date_created', { ascending: false })
    .range(startIndex, startIndex + limit - 1);

  if (error) {
    console.error('Error fetching products:', error);
    throw new Error('فشل تحميل المنتجات');
  }

  // Transform database products to match expected format
  return (products || []).map(product => ({
    id: product.id,
    name: product.name,
    price: product.price?.toString() || '0',
    images: product.image_url ? [{
      src: product.image_url,
      alt: product.image_alt || product.name
    }] : [],
    stock_status: product.stock_status || 'instock'
  }));
};

interface InfiniteProductsSectionProps {
  title?: string;
}

const InfiniteProductsSection = ({ title = "كتالوج المنتجات" }: InfiniteProductsSectionProps) => {
  const fetchProducts = useCallback(fetchProductsFromDB, []);
  
  const {
    products,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    retry,
    setSentinelRef,
    loadMore,
    shouldShowLoadMoreButton
  } = useInfiniteScroll(fetchProducts, {
    productsPerPage: 20,
    maxProducts: 1000,
    triggerDistance: 200,
    loadingDelay: 300,
    autoLoadLimit: 40
  });

  if (isLoading) {
    return (
      <div className="px-3 mb-6">
        <h3 className="text-lg font-bold mb-3.5 text-right text-gray-900">{title}</h3>
        <ProductSkeletonGrid count={12} />
      </div>
    );
  }

  if (error && products.length === 0) {
    return (
      <div className="px-3 mb-6">
        <h3 className="text-lg font-bold mb-3.5 text-right text-gray-900">{title}</h3>
        <div className="text-center py-10 px-4">
          <div className="text-5xl mb-3">⚠️</div>
          <p className="text-red-600 font-medium mb-2">حدث خطأ في تحميل المنتجات</p>
          <p className="text-gray-600 mb-4 text-sm">{error}</p>
          <Button 
            onClick={retry}
            variant="outline"
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            إعادة المحاولة
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-3 mb-6">
      <h3 className="text-lg font-bold mb-3.5 text-right text-gray-900">{title}</h3>
      
      {products.length > 0 ? (
        <>
          <div className="grid grid-cols-2 gap-3">
            {products.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-in"
                style={{ animationDelay: `${(index % 12) * 50}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* Loading more indicator */}
          {isLoadingMore && (
            <div className="mt-4">
              <ProductSkeletonGrid count={4} />
            </div>
          )}

          {/* Load More Button - shows after 30 products */}
          {shouldShowLoadMoreButton && hasMore && !isLoadingMore && (
            <div className="text-center mt-5">
              <Button
                onClick={loadMore}
                variant="outline"
                className="text-primary border-primary hover:bg-primary hover:text-primary-foreground px-8 py-2.5 text-base font-medium rounded-xl active:scale-95 transition-all"
              >
                عرض المزيد من المنتجات
              </Button>
            </div>
          )}

          {/* Sentinel element for intersection observer (only for initial auto-load) */}
          {hasMore && !isLoadingMore && !shouldShowLoadMoreButton && (
            <div
              ref={setSentinelRef}
              className="flex items-center justify-center py-6"
            >
              <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
            </div>
          )}

          {/* End of products message */}
          {!hasMore && products.length > 0 && (
            <div className="text-center py-8">
              <p className="text-gray-700 font-medium">تم عرض جميع المنتجات المتاحة</p>
              <p className="text-sm text-gray-500 mt-2">
                إجمالي {products.length} منتج
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-10 px-4">
          <div className="text-5xl mb-3">📦</div>
          <p className="text-gray-700 font-medium mb-2">لا توجد منتجات متاحة حالياً</p>
          <p className="text-sm text-gray-500">يرجى المحاولة لاحقاً أو التحقق من الاتصال بالإنترنت</p>
        </div>
      )}
    </div>
  );
};

export default InfiniteProductsSection;