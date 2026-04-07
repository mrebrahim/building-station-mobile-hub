import { Users, ShoppingCart, Home as HomeIcon, Grid3X3, ClipboardList } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const BottomNavigation = () => {
  const location = useLocation();
  const [cartCount, setCartCount] = useState(0);
  
  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const totalItems = cart.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0);
      setCartCount(totalItems);
    };
    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    window.addEventListener('cartUpdated', updateCartCount);
    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, [location]);
  
  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="flex justify-around items-center px-1 py-2">
        
        {/* الرئيسية */}
        <Link to="/" className="flex flex-col items-center py-2 px-3 rounded-lg transition-colors min-w-0 flex-1">
          <HomeIcon className={`w-6 h-6 ${isActive("/") ? "text-yellow-500" : "text-gray-400"}`} />
          <span className={`text-xs mt-1 font-medium ${isActive("/") ? "text-yellow-500" : "text-gray-400"}`}>الرئيسية</span>
        </Link>

        {/* التصنيفات */}
        <Link to="/categories" className="flex flex-col items-center py-2 px-3 rounded-lg transition-colors min-w-0 flex-1">
          <Grid3X3 className={`w-6 h-6 ${isActive("/categories") ? "text-yellow-500" : "text-gray-400"}`} />
          <span className={`text-xs mt-1 font-medium ${isActive("/categories") ? "text-yellow-500" : "text-gray-400"}`}>التصنيفات</span>
        </Link>

        {/* السلة */}
        <Link to="/cart" className="flex flex-col items-center py-2 px-3 rounded-lg transition-colors min-w-0 flex-1 relative">
          <div className="relative">
            <ShoppingCart className={`w-6 h-6 ${isActive("/cart") ? "text-yellow-500" : "text-gray-400"}`} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </div>
          <span className={`text-xs mt-1 font-medium ${isActive("/cart") ? "text-yellow-500" : "text-gray-400"}`}>السلة</span>
        </Link>

        {/* طلباتي */}
        <Link to="/orders" className="flex flex-col items-center py-2 px-3 rounded-lg transition-colors min-w-0 flex-1">
          <ClipboardList className={`w-6 h-6 ${isActive("/orders") ? "text-yellow-500" : "text-gray-400"}`} />
          <span className={`text-xs mt-1 font-medium ${isActive("/orders") ? "text-yellow-500" : "text-gray-400"}`}>طلباتي</span>
        </Link>

        {/* ملفي الشخصي */}
        <Link to="/profile" className="flex flex-col items-center py-2 px-3 rounded-lg transition-colors min-w-0 flex-1">
          <Users className={`w-6 h-6 ${isActive("/profile") ? "text-yellow-500" : "text-gray-400"}`} />
          <span className={`text-xs mt-1 font-medium ${isActive("/profile") ? "text-yellow-500" : "text-gray-400"}`}>ملفي الشخصي</span>
        </Link>

      </div>
    </nav>
  );
};

export default BottomNavigation;
