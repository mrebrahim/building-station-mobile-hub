
import { Users, ShoppingCart, Heart, Home as HomeIcon } from "lucide-react";
import { Link } from "react-router-dom";

const BottomNavigation = () => {
  return (
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
  );
};

export default BottomNavigation;
