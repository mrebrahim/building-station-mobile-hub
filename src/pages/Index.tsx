import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Banner from "@/components/Banner";
import BrandsSection from "@/components/BrandsSection";
import ProductsSection from "@/components/ProductsSection";
import InfiniteProductsSection from "@/components/InfiniteProductsSection";
import BottomNavigation from "@/components/BottomNavigation";

// ✅ جلب ID تصنيف "main" من WooCommerce
const fetchMainCategoryId = async (): Promise<number | null> => {
  const url = new URL('/api/woocommerce', window.location.origin);
  url.searchParams.append('endpoint', 'products/categories');
  url.searchParams.append('slug', 'main');
  url.searchParams.append('per_page', '1');
  const res = await fetch(url.toString());
  if (!res.ok) return null;
  const data = await res.json();
  return data?.[0]?.id ?? null;
};

// ✅ جلب المنتجات المميزة من تصنيف main فقط
const fetchFeaturedProducts = async (categoryId: number) => {
  const url = new URL('/api/woocommerce', window.location.origin);
  url.searchParams.append('endpoint', 'products');
  url.searchParams.append('featured', 'true');
  url.searchParams.append('category', String(categoryId));
  url.searchParams.append('per_page', '4');
  url.searchParams.append('status', 'publish');
  const res = await fetch(url.toString());
  if (!res.ok) return [];
  return res.json();
};

const Index = () => {
  // ✅ جلب ID تصنيف main أولاً
  const { data: mainCategoryId } = useQuery({
    queryKey: ['main-category-id'],
    queryFn: fetchMainCategoryId,
    retry: 2,
    staleTime: 1000 * 60 * 10, // cache لـ 10 دقايق
  });

  const { data: featuredProducts = [], isLoading: featuredLoading } = useQuery({
    queryKey: ['featured-products-wc', mainCategoryId],
    queryFn: () => fetchFeaturedProducts(mainCategoryId!),
    enabled: !!mainCategoryId,
    retry: 2,
  });

  return (
    <div className="min-h-screen bg-gray-50 rtl font-sans">
      <Header />
      <Banner />
      <BrandsSection />
      {featuredProducts.length > 0 && (
        <ProductsSection
          products={featuredProducts}
          isLoading={featuredLoading}
          isFeatured={true}
        />
      )}
      <InfiniteProductsSection title="كتالوج المنتجات" categoryId={mainCategoryId ?? undefined} />
      <BottomNavigation />
    </div>
  );
};

export default Index;
