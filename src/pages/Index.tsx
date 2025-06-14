
import { Search, Phone, Users, ShoppingCart, Heart, Home as HomeIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { wooCommerceService } from "@/services/woocommerce";

const Index = () => {
  // Fetch categories from WooCommerce
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => wooCommerceService.getCategories({ per_page: 18 }),
  });

  // Fetch featured products from WooCommerce
  const { data: featuredProducts = [], isLoading: productsLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => wooCommerceService.getProducts({ per_page: 4, featured: true }),
  });

  const shortcuts = [
    { name: "كن موردا", icon: "🏪", bgColor: "bg-red-50" },
    { name: "طلب المشتريات", icon: "🛍️", bgColor: "bg-red-50" },
    { name: "قائمة التسعير", icon: "📋", bgColor: "bg-red-50", hasNotification: true },
    { name: "هدايا الأعمال", icon: "🎁", bgColor: "bg-red-50" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 rtl">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2 bg-black text-white px-3 py-2 rounded-full">
            <Phone className="w-4 h-4" />
            <span className="text-sm font-medium">مساعدة</span>
          </div>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">BUILDING STATION</h1>
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
              className="pr-10 py-3 rounded-xl border-gray-200"
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
              <div className={`relative ${shortcut.bgColor} rounded-xl p-4 mb-2`}>
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
        <h3 className="text-lg font-bold mb-4 text-right">منتجات مميزة</h3>
        {productsLoading ? (
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl p-4 shadow-sm animate-pulse">
                <div className="w-full h-32 bg-gray-200 rounded-lg mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {featuredProducts.map((product) => (
              <Link key={product.id} to={`/product/${product.id}`}>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="w-full h-32 bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                      <img 
                        src={product.images[0].src} 
                        alt={product.images[0].alt || product.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <span className="text-3xl">🔧</span>
                    )}
                  </div>
                  <h4 className="text-sm font-medium mb-2" dangerouslySetInnerHTML={{ __html: product.name }}></h4>
                  <p className="text-lg font-bold text-red-600">
                    IQD {product.price ? parseInt(product.price).toLocaleString() : 'اتصل للسعر'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Categories Section */}
      <div className="px-4 mb-20">
        <div className="flex items-center justify-between mb-4">
          <Button variant="outline" className="text-blue-500 border-blue-500">
            عرض الكل
          </Button>
          <h3 className="text-lg font-bold">تسوق حسب الفئة</h3>
        </div>
        
        {categoriesLoading ? (
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl p-4 text-center shadow-sm animate-pulse">
                <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-3"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {categories.map((category) => (
              <div key={category.id} className="bg-white rounded-xl p-4 text-center shadow-sm">
                <div className="w-16 h-16 bg-gray-100 rounded-lg mx-auto mb-3 flex items-center justify-center overflow-hidden">
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
