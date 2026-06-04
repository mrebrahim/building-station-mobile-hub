import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Banner from "@/components/Banner";
import BrandsSection from "@/components/BrandsSection";
import ProductCard from "@/components/ProductCard";
import { ProductSkeletonGrid } from "@/components/ui/product-skeleton";
import { Button } from "@/components/ui/button";
import BottomNavigation from "@/components/BottomNavigation";

const MAIN_CATALOG_LIMIT = 8;

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

const fetchMainCatalogProducts = async (categoryId: number) => {
  const url = new URL('/api/woocommerce', window.location.origin);
  url.searchParams.append('endpoint', 'products');
  url.searchParams.append('category', String(categoryId));
  url.searchParams.append('per_page', String(MAIN_CATALOG_LIMIT));
  url.searchParams.append('status', 'publish');
  url.searchParams.append('orderby', 'date');
  url.searchParams.append('order', 'desc');
  const res = await fetch(url.toString());
  if (!res.ok) return [];
  return res.json();
};

const Index = () => {
  const { data: mainCategoryId } = useQuery({
    queryKey: ['main-category-id'],
    queryFn: fetchMainCategoryId,
    retry: 2,
    staleTime: 1000 * 60 * 10,
  });

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['main-catalog-products', mainCategoryId],
    queryFn: () => fetchMainCatalogProducts(mainCategoryId!),
    enabled: !!mainCategoryId,
    retry: 2,
  });

  const showSkeleton = mainCategoryId === undefined || isLoading;

  return (
    <div className="min-h-screen bg-gray-50 rtl font-sans">
      <Header />
      <Banner />
      <BrandsSection />

      <section className="py-4 bg-gray-50">
        <div className="px-4 mb-4">
          <h2 className="text-lg font-bold text-gray-800 text-right">كتالوج المنتجات</h2>
        </div>

        {showSkeleton ? (
          <div className="px-4">
            <ProductSkeletonGrid count={MAIN_CATALOG_LIMIT} />
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-3 px-4">
              {products.slice(0, MAIN_CATALOG_LIMIT).map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="flex justify-center mt-6 px-4">
              <Link to="/categories" className="w-full max-w-xs">
                <Button variant="outline" className="w-full">
                  عرض المزيد
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">لا توجد منتجات</p>
          </div>
        )}
      </section>

      <BottomNavigation />
    </div>
  );
};

export default Index;
