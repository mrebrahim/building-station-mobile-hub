
import { Search, Phone, Users, ShoppingCart, Heart, Home as HomeIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  const categories = [
    { id: 1, name: "الأدوات اليدوية", icon: "🔨", image: "/placeholder.svg" },
    { id: 2, name: "المعدات الصناعية", icon: "⚙️", image: "/placeholder.svg" },
    { id: 3, name: "المواد الدعائية", icon: "📦", image: "/placeholder.svg" },
    { id: 4, name: "المنزل والمكتب", icon: "🏠", image: "/placeholder.svg" },
    { id: 5, name: "تخزين الأدوات", icon: "📋", image: "/placeholder.svg" },
    { id: 6, name: "أدوات القياس والتخطيط", icon: "📏", image: "/placeholder.svg" },
    { id: 7, name: "تجهيزات كهربائية", icon: "⚡", image: "/placeholder.svg" },
    { id: 8, name: "تجهيزات السلامة العامة", icon: "🦺", image: "/placeholder.svg" },
    { id: 9, name: "الالكترونيات والأجهزة", icon: "💻", image: "/placeholder.svg" },
    { id: 10, name: "حلول الإنارة", icon: "💡", image: "/placeholder.svg" },
    { id: 11, name: "التدفئة والتهوية", icon: "🌡️", image: "/placeholder.svg" },
    { id: 12, name: "قطع السيارات", icon: "🚗", image: "/placeholder.svg" },
    { id: 13, name: "المعدات الهيدروليكية والرفع", icon: "🏗️", image: "/placeholder.svg" },
    { id: 14, name: "أنظمة التثبيت", icon: "🔩", image: "/placeholder.svg" },
    { id: 15, name: "مولدات الطاقة", icon: "⚡", image: "/placeholder.svg" },
    { id: 16, name: "المواد العازلة واللاصقة", icon: "🧲", image: "/placeholder.svg" },
    { id: 17, name: "المنتجات الخارجية والحديقة", icon: "🌿", image: "/placeholder.svg" },
    { id: 18, name: "الزيوت والكيماويات", icon: "🧪", image: "/placeholder.svg" }
  ];

  const shortcuts = [
    { name: "كن موردا", icon: "🏪", bgColor: "bg-red-50" },
    { name: "طلب المشتريات", icon: "🛍️", bgColor: "bg-red-50" },
    { name: "قائمة التسعير", icon: "📋", bgColor: "bg-red-50", hasNotification: true },
    { name: "هدايا الأعمال", icon: "🎁", bgColor: "bg-red-50" }
  ];

  // Sample featured products
  const featuredProducts = [
    { id: 1, name: "نظارات حماية يوفكس", price: 12500, image: "/placeholder.svg" },
    { id: 2, name: "قفازات PVC", price: 2250, image: "/placeholder.svg" },
    { id: 3, name: "خوذة أمان", price: 15000, image: "/placeholder.svg" },
    { id: 4, name: "أحذية السلامة", price: 35000, image: "/placeholder.svg" }
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
        <div className="grid grid-cols-2 gap-4">
          {featuredProducts.map((product) => (
            <Link key={product.id} to={`/product/${product.id}`}>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="w-full h-32 bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                  <span className="text-3xl">🔧</span>
                </div>
                <h4 className="text-sm font-medium mb-2">{product.name}</h4>
                <p className="text-lg font-bold text-red-600">IQD {product.price.toLocaleString()}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Categories Section */}
      <div className="px-4 mb-20">
        <div className="flex items-center justify-between mb-4">
          <Button variant="outline" className="text-blue-500 border-blue-500">
            عرض الكل
          </Button>
          <h3 className="text-lg font-bold">تسوق حسب الفئة</h3>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          {categories.map((category) => (
            <div key={category.id} className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="w-16 h-16 bg-gray-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <span className="text-2xl">{category.icon}</span>
              </div>
              <h4 className="text-sm font-medium text-gray-800 leading-tight">{category.name}</h4>
            </div>
          ))}
        </div>
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
