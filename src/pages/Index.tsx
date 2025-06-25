
import { useQuery } from "@tanstack/react-query";
import { wooCommerceService } from "@/services/woocommerce";
import Header from "@/components/Header";
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

  // Fetch all products first, then featured products as fallback
  const { data: allProducts = [], isLoading: allProductsLoading } = useQuery({
    queryKey: ['all-products'],
    queryFn: () => wooCommerceService.getProducts({ per_page: 8 }),
    retry: 3,
    retryDelay: 1000,
  });

  // Try to get featured products, but fallback to regular products
  const { data: featuredProducts = [], isLoading: featuredLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => wooCommerceService.getProducts({ per_page: 4, featured: true }),
    retry: 3,
    retryDelay: 1000,
  });

  // Use featured products if available, otherwise use first 4 regular products
  const productsToShow = featuredProducts.length > 0 ? featuredProducts : allProducts.slice(0, 4);
  const isProductsLoading = featuredLoading || allProductsLoading;

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
  console.log('All Products:', allProducts);
  console.log('Products to Show:', productsToShow);
  console.log('Categories Error:', categoriesError);

  return (
    <div className="min-h-screen bg-gray-50 rtl font-sans">
      <Header />
      <Banner />
      <ShortcutsGrid />
      <ProductsSection 
        products={productsToShow} 
        isLoading={isProductsLoading} 
        isFeatured={featuredProducts.length > 0} 
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
