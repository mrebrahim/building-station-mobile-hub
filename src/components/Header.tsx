
import { Search, Bell } from "lucide-react";
import HelpButton from "./HelpButton";

const Header = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <span className="text-xl font-bold text-red-500">Building Station</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <HelpButton />
          <div className="relative">
            <Bell className="w-6 h-6 text-gray-700" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">2</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Search Bar */}
      <div className="px-4 pb-4">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="البحث عن المنتجات..."
            className="w-full bg-gray-100 border-0 rounded-full py-3 pr-12 pl-4 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
