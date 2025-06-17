
import { Search, Phone, Users, ShoppingCart, Heart, Home as HomeIcon, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { wooCommerceService } from "@/services/woocommerce";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();

  // Fetch categories from WooCommerce
  const { data: categories = [], isLoading: categoriesLoading, error: categoriesError } = useQuery({
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

  console.log('Categories:', categories);
  console.log('Featured Products:', featuredProducts);
  console.log('All Products:', allProducts);
  console.log('Products to Show:', productsToShow);
  console.log('Categories Error:', categoriesError);

  const handleAddToCart = (product: any) => {
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItemIndex = existingCart.findIndex((item: any) => item.id === product.id);
    
    if (existingItemIndex >= 0) {
      existingCart[existingItemIndex].quantity += 1;
    } else {
      existingCart.push({
        id: product.id,
        name: product.name,
        brand: product.categories?.[0]?.name || 'غير محدد',
        price: parseFloat(product.price) || 0,
        quantity: 1,
        image: product.images?.[0]?.src || ''
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(existingCart));
    
    toast({
      title: "تم إضافة المنتج",
      description: `تم إضافة ${product.name} إلى السلة`,
    });
  };

  const shortcuts = [
    { name: "كن موردا", icon: "🏪", bgColor: "bg-gray-50" },
    { name: "طلب المشتريات", icon: "🛍️", bgColor: "bg-gray-50" },
    { name: "قائمة التسعير", icon: "📋", bgColor: "bg-gray-50", hasNotification: true },
    { name: "هدايا الأعمال", icon: "🎁", bgColor: "bg-gray-50" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 rtl font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full">
            <Phone className="w-4 h-4" />
            <span className="text-sm font-medium">مساعدة</span>
          </div>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-500">BUILDING STATION</h1>
            <p className="text-xs text-gray-500">مرحبا بكم في</p>
          </div>
          
          <div className="w-12"></div>
        </div>
        
        {/* Search Bar */}
        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
            <Input 
              placeholder="ماذا تبحث عن؟" 
              className="pr-10 py-3 rounded-xl border-gray-200 bg-gray-50"
            />
          </div>
        </div>
      </header>

      {/* Banner */}
      <div className="px-4 py-4">
        <div className="bg-gradient-to-r from-gray-800 to-gray-600 rounded-xl p-6 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-xl font-bold mb-2">"تصفح مجموعتنا"</h2>
            <p className="text-gray-200 text-sm">من أفضل الأدوات والمعدات</p>
          </div>
          <div className="absolute left-4 top-4 opacity-20">
            <div className="w-20 h-20 bg-white rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Shortcuts */}
      <div className="px-4 mb-6">
        <h3 className="text-lg font-bold mb-4 text-right">الاختصارات</h3>
        <div className="grid grid-cols-4 gap-3">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="text-center">
              <div className={`relative ${shortcut.bgColor} rounded-xl p-4 mb-2 border border-gray-100`}>
                <div className="text-2xl">{shortcut.icon}</div>
                {shortcut.hasNotification && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    0
                  </div>
                )}
              </div>
              <span className="text-xs text-gray-700 font-medium">{shortcut.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div className="px-4 mb-6">
        <h3 className="text-lg font-bold mb-4 text-right text-gray-800">
          {featuredProducts.length > 0 ? 'منتجات مميزة' : 'منتجات الكتالوج'}
        </h3>
        {isProductsLoading ? (
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl p-4 shadow-sm animate-pulse border border-gray-100">
                <div className="w-full h-40 bg-gray-200 rounded-lg mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : productsToShow.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {productsToShow.map((product) => (
              <div key={product.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 relative">
                {/* Heart Icon */}
                <Heart className="absolute top-3 left-3 w-5 h-5 text-gray-300 hover:text-red-500 cursor-pointer z-10" />
                
                {/* Product Image */}
                <Link to={`/product/${product.id}`}>
                  <div className="w-full h-40 bg-gray-50 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                      <img 
                        src={product.images[0].src} 
                        alt={product.images[0].alt || product.name}
                        className="w-full h-full object-contain hover:scale-105 transition-transform duration-200"
                      />
                    ) : (
                      <span className="text-4xl text-gray-300">📦</span>
                    )}
                  </div>
                </Link>
                
                {/* Brand Name */}
                {product.categories && product.categories.length > 0 && (
                  <p className="text-xs text-gray-500 mb-1 font-medium">
                    العلامة التجارية {product.categories[0].name}
                  </p>
                )}
                
                {/* Product Name */}
                <Link to={`/product/${product.id}`}>
                  <h4 className="text-sm font-medium mb-2 text-gray-700 leading-tight hover:text-gray-900" 
                      dangerouslySetInnerHTML={{ __html: product.name }}>
                  </h4>
                </Link>
                
                {/* Price */}
                <p className="text-lg font-bold text-black mb-3">
                  {product.price ? `IQD ${parseInt(product.price).toLocaleString()}` : 'اتصل للسعر'}
                </p>
                
                {/* Add to Cart Button */}
                <button
                  onClick={() => handleAddToCart(product)}
                  className="absolute bottom-3 right-3 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors duration-200 shadow-lg"
                  disabled={product.stock_status !== 'instock'}
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">لا توجد منتجات متاحة حالياً</p>
            <p className="text-sm text-gray-500">يرجى المحاولة لاحقاً أو التحقق من الاتصال بالإنترنت</p>
          </div>
        )}
      </div>

      {/* Categories Section */}
      <div className="px-4 mb-20">
        <div className="flex items-center justify-between mb-4">
          <Button variant="outline" className="text-red-500 border-red-500 hover:bg-red-50">
            عرض الكل
          </Button>
          <h3 className="text-lg font-bold text-gray-800">تسوق حسب الفئة</h3>
        </div>
        
        {categoriesLoading ? (
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl p-4 text-center shadow-sm animate-pulse border border-gray-100">
                <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-3"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-3 gap-4">
            {categories.map((category) => (
              <div key={category.id} className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                <div className="w-16 h-16 bg-gray-50 rounded-lg mx-auto mb-3 flex items-center justify-center overflow-hidden">
                  {category.image && category.image.src ? (
                    <img 
                      src={category.image.src} 
                      alt={category.image.alt || category.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-2xl">📦</span>
                  )}
                </div>
                <h4 className="text-sm font-medium text-gray-800 leading-tight">{category.name}</h4>
                <p className="text-xs text-gray-500 mt-1">{category.count} منتج</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">لا توجد فئات متاحة حالياً</p>
            <p className="text-sm text-gray-500">يرجى المحاولة لاحقاً أو التحقق من الاتصال بالإنترنت</p>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around items-center">
          <Link to="/profile" className="flex flex-col items-center py-2">
            <Users className="w-5 h-5 text-gray-400" />
            <span className="text-xs text-gray-400 mt-1">الملف الشخصي</span>
          </Link>
          
          <Link to="/cart" className="flex flex-col items-center py-2">
            <ShoppingCart className="w-5 h-5 text-gray-400" />
            <span className="text-xs text-gray-400 mt-1">السلة</span>
          </Link>
          
          <div className="flex flex-col items-center py-2">
            <Heart className="w-5 h-5 text-gray-400" />
            <span className="text-xs text-gray-400 mt-1">قائمة عروض الأسعار</span>
          </div>
          
          <div className="flex flex-col items-center py-2">
            <HomeIcon className="w-5 h-5 text-red-500" />
            <span className="text-xs text-red-500 mt-1">الرئيسية</span>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Index;
