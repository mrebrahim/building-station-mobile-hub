import { useQuery } from "@tanstack/react-query";
import { wooCommerceService } from "@/services/woocommerce";
import Header from "@/components/Header";
import Banner from "@/components/Banner";
import BrandsSection from "@/components/BrandsSection";
import ProductsSection from "@/components/ProductsSection";
import InfiniteProductsSection from "@/components/InfiniteProductsSection";
import CoursesSection from "@/components/CoursesSection";
import PartnersSection from "@/components/PartnersSection";
import BottomNavigation from "@/components/BottomNavigation";

const Index = () => {
  const { data: featuredProducts = [], isLoading: featuredLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => wooCommerceService.getProducts({ per_page: 4, featured: true }),
    retry: 3,
    retryDelay: 1000,
  });

  return (
    <div className="min-h-screen bg-gray-50 rtl font-sans">
      <Header />
      <Banner />
      <CoursesSection />
      <BrandsSection />
      {featuredProducts.length > 0 && (
        <ProductsSection
          products={featuredProducts}
          isLoading={featuredLoading}
          isFeatured={true}
        />
      )}
      <InfiniteProductsSection title="كتالوج المنتجات" />
      <PartnersSection />
      <BottomNavigation />
    </div>
  );
};

export default Index;
