
import { Search, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";

const Header = () => {
  return (
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
  );
};

export default Header;
