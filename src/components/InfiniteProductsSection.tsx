import { useCallback } from "react";
import ProductCard from "./ProductCard";
import { ProductSkeletonGrid } from "./ui/product-skeleton";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { Button } from "./ui/button";
import { Loader2, RefreshCw } from "lucide-react";

interface Product {
  id: number;
  name: string;
  price: string;
  images?: Array<{ src: string; alt?: string }>;
  categories?: Array<{ name: string }>;
  stock_status?: string;
}

// ✅ جلب المنتجات من WooCommerce API مباشرة
const fetchProductsFromWC = async (page: number, limit: number): Promise<Product[]> => {
  const url = new URL('/api/woocommerce', window.location.origin);
  url.searchParams.append('endpoint', 'products');
  url.searchParams.append('per_page', String(limit));
  url.searchParams.append('page', String(page));
  url.searchParams.append('status', 'publish');
  url.searchParams.append('orderby', 'date');
  url.searchParams.append('order', 'desc');

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('فشل تحميل المنتجات');
  const data = await res.json();

  return (Array.isArray(data) ? data : []).map((p: any) => ({
    id: p.id,
    name: p.name,
    price: p.price || '0',
    regular_price: p.regular_price || '0',
    sale_price: p.sale_price || '',
    images: (p.images || []).map((img: any) => ({ src: img.src, alt: img.alt || p.name })),
    categories: (p.categories || []).map((c: any) => ({ name: c.name })),
    stock_status: p.stock_status || 'instock',
  }));
};

interface InfiniteProductsSectionProps {
  title?: string;
}

const InfiniteProductsSection = ({ title = "كتالوج المنتجات" }: InfiniteProductsSectionProps) => {
  const fetchProducts = useCallback(fetchProductsFromWC, []);

  const {
    products,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    loadMore,
    retry
  } = useInfiniteScroll(fetchProducts, { pageSize: 20 });

  return (
    <section className="py-4 bg-gray-50">
      <div className="px-4 mb-4">
        <h2 className="text-lg font-bold text-gray-800 text-right">{title}</h2>
      </div>

      {isLoading && products.length === 0 ? (
        <div className="px-4">
          <ProductSkeletonGrid count={8} />
        </div>
      ) : error && products.length === 0 ? (
        <div className="text-center py-12 px-4">
          <p className="text-gray-500 mb-4">فشل تحميل المنتجات</p>
          <Button onClick={retry} variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            إعادة المحاولة
          </Button>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">لا توجد منتجات</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 px-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product as any} />
            ))}
          </div>

          <div className="flex justify-center mt-6 px-4">
            {isLoadingMore ? (
              <div className="flex items-center gap-2 text-gray-500">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm">جاري التحميل...</span>
              </div>
            ) : hasMore ? (
              <Button onClick={loadMore} variant="outline" className="w-full max-w-xs">
                تحميل المزيد
              </Button>
            ) : products.length > 0 ? (
              <p className="text-sm text-gray-400">تم عرض جميع المنتجات ({products.length})</p>
            ) : null}
          </div>
        </>
      )}
    </section>
  );
};

export default InfiniteProductsSection;
