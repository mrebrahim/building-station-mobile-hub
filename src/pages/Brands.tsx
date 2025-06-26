
import { useQuery } from "@tanstack/react-query";
import { wooCommerceService } from "@/services/woocommerce";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Brand {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: {
    id: number;
    src: string;
    alt?: string;
  };
  count: number;
}

const Brands = () => {
  const navigate = useNavigate();
  
  const { data: brands = [], isLoading, error } = useQuery({
    queryKey: ['brands'],
    queryFn: () => wooCommerceService.getBrands(),
    retry: 3,
    retryDelay: 1000,
  });

  console.log('Brands data:', brands);
  console.log('Brands error:', error);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleForwardClick = () => {
    navigate(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 rtl font-sans">
      <Header />
      
      <div className="px-4 py-6">
        {/* Navigation Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            size="icon"
            onClick={handleForwardClick}
            className="h-10 w-10 rounded-full"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
          
          <h1 className="text-2xl font-bold text-gray-800 text-center">الماركات</h1>
          
          <Button
            variant="outline"
            size="icon"
            onClick={handleBackClick}
            className="h-10 w-10 rounded-full"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-4 shadow-sm animate-pulse border border-gray-100">
                <div className="w-full h-20 bg-gray-200 rounded-lg mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : brands.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {brands.map((brand: Brand) => (
              <Link key={brand.id} to={`/brand/${brand.id}`} className="block">
                <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                  <div className="w-full h-20 bg-gray-50 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                    {brand.image && brand.image.src ? (
                      <img 
                        src={brand.image.src} 
                        alt={brand.image.alt || brand.name}
                        loading="lazy"
                        onError={(e) => {
                          console.error("Brand image failed to load:", e.currentTarget.src);
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement!.innerHTML = '<span class="text-2xl">🏷️</span>';
                        }}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <span className="text-2xl">🏷️</span>
                    )}
                  </div>
                  <h3 className="text-sm font-semibold text-gray-800 leading-tight mb-1">{brand.name}</h3>
                  <p className="text-xs text-gray-400">{brand.count} منتج</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🏷️</div>
            <p className="text-gray-600 mb-4">لا توجد ماركات متاحة حالياً</p>
            <p className="text-sm text-gray-500">يرجى المحاولة لاحقاً أو التحقق من الاتصال بالإنترنت</p>
          </div>
        )}
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Brands;
