
import { useQuery } from "@tanstack/react-query";
import { wooCommerceService } from "@/services/woocommerce";
import Header from "@/components/Header";
import FeaturedCategoriesSection from "@/components/FeaturedCategoriesSection";
import Banner from "@/components/Banner";
import ShortcutsGrid from "@/components/ShortcutsGrid";
import ProductsSection from "@/components/ProductsSection";
import CategoriesSection from "@/components/CategoriesSection";
import BottomNavigation from "@/components/BottomNavigation";

const Index = () => {
  // Fetch categories from WooCommerce
  const { data: apiCategories = [], isLoading: categoriesLoading, error: categoriesError } = useQuery({
    queryKey: ['categories'],
    queryFn: () => wooCommerceService.getCategories({ per_page: 18 }),
    retry: 3,
    retryDelay: 1000,
  });

  // Fetch featured products for the featured section
  const { data: featuredProducts = [], isLoading: featuredLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => wooCommerceService.getProducts({ per_page: 4, featured: true }),
    retry: 3,
    retryDelay: 1000,
  });

  // Fetch catalog products specifically for the "منتجات الكتالوج" section
  const { data: catalogProducts = [], isLoading: catalogLoading } = useQuery({
    queryKey: ['catalog-products'],
    queryFn: () => wooCommerceService.getProducts({ per_page: 8, orderby: 'date', order: 'desc' }),
    retry: 3,
    retryDelay: 1000,
  });

  // Transform API categories to match display format, filtering out empty categories
  const displayCategories = apiCategories
    .filter(cat => cat.count > 0) // Only show categories with products
    .slice(0, 6) // Limit to 6 categories for display
    .map(apiCat => ({
      id: apiCat.id,
      name: apiCat.name,
      count: apiCat.count,
      image: apiCat.image || undefined
    }));

  console.log('API Categories:', apiCategories);
  console.log('Display Categories:', displayCategories);
  console.log('Featured Products:', featuredProducts);
  console.log('Catalog Products:', catalogProducts);
  console.log('Categories Error:', categoriesError);

  return (
    <div className="min-h-screen bg-gray-50 rtl font-sans">
      <Header />
      <Banner />
      <FeaturedCategoriesSection />
      <ShortcutsGrid />
      
      {/* Show featured products if available */}
      {featuredProducts.length > 0 && (
        <ProductsSection 
          products={featuredProducts} 
          isLoading={featuredLoading} 
          isFeatured={true} 
        />
      )}
      
      {/* Always show catalog products section */}
      <ProductsSection 
        products={catalogProducts} 
        isLoading={catalogLoading} 
        isFeatured={false} 
      />
      
      <CategoriesSection 
        categories={displayCategories} 
        isLoading={categoriesLoading} 
      />
      <BottomNavigation />
    </div>
  );
};

export default Index;
