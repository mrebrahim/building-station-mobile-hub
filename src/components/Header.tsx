
import { Search, Bell, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import HelpButton from "./HelpButton";
import { useDataRefresh } from "@/hooks/useDataRefresh";
import { useState } from "react";

const Header = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { refreshAllData } = useDataRefresh();

  const handleRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    try {
      await refreshAllData();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 flex items-center justify-center rounded-full overflow-hidden bg-white shadow-sm">
              <img 
                src="/lovable-uploads/affbbcc3-4fa8-45ef-839a-50be03b7a27c.png" 
                alt="Building Station Logo" 
                className="w-10 h-10 object-contain"
              />
            </div>
            <span className="text-xl font-bold text-navy-blue">Building Station</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
            aria-label="تحديث البيانات"
          >
            <RefreshCw className={`w-5 h-5 text-gray-700 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
          <HelpButton />
          <Link to="/notifications" className="relative">
            <Bell className="w-6 h-6 text-gray-700 hover:text-primary transition-colors" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground text-xs">2</span>
            </div>
          </Link>
        </div>
      </div>
      
      {/* Search Bar */}
      <div className="px-4 pb-4">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="البحث عن المنتجات..."
            className="w-full bg-gray-100 border-0 rounded-full py-3 pr-12 pl-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
