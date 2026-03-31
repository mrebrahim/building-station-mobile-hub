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
import { Link } from "react-router-dom";
import { Grid3X3 } from "lucide-react";

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

      {/* ✅ زرار التصنيفات */}
      <div className="px-4 py-4 bg-white border-b border-gray-100">
        <Link to="/categories">
          <div className="flex items-center justify-between bg-gradient-to-l from-red-50 to-white border border-red-200 rounded-2xl px-4 py-3 shadow-sm active:scale-95 transition-transform">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center">
                <Grid3X3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-base font-bold text-gray-800">التصنيفات</p>
                <p className="text-xs text-gray-500">تصفح جميع أقسام المنتجات</p>
              </div>
            </div>
            <div className="text-red-500 text-xl">‹</div>
          </div>
        </Link>
      </div>

      {/* Courses Section */}
      <CoursesSection />

      <BrandsSection />

      {/* Featured products */}
      {featuredProducts.length > 0 && (
        <ProductsSection
          products={featuredProducts}
          isLoading={featuredLoading}
          isFeatured={true}
        />
      )}

      {/* Catalog products */}
      <InfiniteProductsSection title="كتالوج المنتجات" />

      <PartnersSection />
      <BottomNavigation />
    </div>
  );
};

export default Index;
