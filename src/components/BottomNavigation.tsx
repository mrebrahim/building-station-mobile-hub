
import { Users, ShoppingCart, Heart, Home as HomeIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const BottomNavigation = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 safe-area-pb">
      <div className="flex justify-around items-center px-2 py-2">
        <Link to="/" className="flex flex-col items-center py-3 px-4 rounded-lg transition-colors hover:bg-gray-50 min-w-0 flex-1">
          <HomeIcon className={`w-6 h-6 ${isActive("/") ? "text-primary" : "text-gray-400"}`} />
          <span className={`text-xs mt-1 font-medium ${isActive("/") ? "text-primary" : "text-gray-400"}`}>
            الرئيسية
          </span>
        </Link>
        
        <Link to="/favorites" className="flex flex-col items-center py-3 px-4 rounded-lg transition-colors hover:bg-gray-50 min-w-0 flex-1">
          <Heart className={`w-6 h-6 ${isActive("/favorites") ? "text-primary" : "text-gray-400"}`} />
          <span className={`text-xs mt-1 font-medium ${isActive("/favorites") ? "text-primary" : "text-gray-400"}`}>
            المفضلة
          </span>
        </Link>
        
        <Link to="/cart" className="flex flex-col items-center py-3 px-4 rounded-lg transition-colors hover:bg-gray-50 min-w-0 flex-1">
          <ShoppingCart className={`w-6 h-6 ${isActive("/cart") ? "text-primary" : "text-gray-400"}`} />
          <span className={`text-xs mt-1 font-medium ${isActive("/cart") ? "text-primary" : "text-gray-400"}`}>
            السلة
          </span>
        </Link>
        
        <Link to="/profile" className="flex flex-col items-center py-3 px-4 rounded-lg transition-colors hover:bg-gray-50 min-w-0 flex-1">
          <Users className={`w-6 h-6 ${isActive("/profile") ? "text-primary" : "text-gray-400"}`} />
          <span className={`text-xs mt-1 font-medium ${isActive("/profile") ? "text-primary" : "text-gray-400"}`}>
            ملفي الشخصي
          </span>
        </Link>
      </div>
    </nav>
  );
};

export default BottomNavigation;
