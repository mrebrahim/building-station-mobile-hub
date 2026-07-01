import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Banner from "@/components/Banner";
import BrandsSection from "@/components/BrandsSection";
import ProductsSection from "@/components/ProductsSection";
import InfiniteProductsSection from "@/components/InfiniteProductsSection";
import BottomNavigation from "@/components/BottomNavigation";
import { wcFetch } from "@/lib/wooProxy";

const fetchMainCategoryId = async (): Promise<number | null> => {
  try {
    const data = await wcFetch<any[]>('products/categories', { slug: 'main', per_page: 1 });
    return data?.[0]?.id ?? null;
  } catch {
    return null;
  }
};

const fetchFeaturedProducts = async (categoryId: number) => {
  try {
    return await wcFetch<any[]>('products', {
      featured: 'true',
      category: categoryId,
      per_page: 4,
      status: 'publish',
    });
  } catch {
    return [];
  }
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
