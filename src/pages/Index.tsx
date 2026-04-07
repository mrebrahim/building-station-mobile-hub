import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Banner from "@/components/Banner";
import BrandsSection from "@/components/BrandsSection";
import ProductsSection from "@/components/ProductsSection";
import InfiniteProductsSection from "@/components/InfiniteProductsSection";
import BottomNavigation from "@/components/BottomNavigation";

// ✅ جلب المنتجات المميزة من WooCommerce API
const fetchFeaturedProducts = async () => {
  const url = new URL('/api/woocommerce', window.location.origin);
  url.searchParams.append('endpoint', 'products');
  url.searchParams.append('featured', 'true');
  url.searchParams.append('per_page', '4');
  url.searchParams.append('status', 'publish');
  const res = await fetch(url.toString());
  if (!res.ok) return [];
  return res.json();
};

const Index = () => {
  const { data: featuredProducts = [], isLoading: featuredLoading } = useQuery({
    queryKey: ['featured-products-wc'],
    queryFn: fetchFeaturedProducts,
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
      <InfiniteProductsSection title="كتالوج المنتجات" />
      <BottomNavigation />
    </div>
  );
};

export default Index;
