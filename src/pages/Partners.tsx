import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { wooCommerceService } from "@/services/woocommerce";
import BottomNavigation from "@/components/BottomNavigation";

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

const Partners = () => {
  const navigate = useNavigate();

  const { data: brands = [], isLoading } = useQuery({
    queryKey: ['partners-brands'],
    queryFn: () => wooCommerceService.getBrands({ per_page: 100 }),
    retry: 2,
    retryDelay: 1000,
  });

  return (
    <div className="min-h-screen bg-gray-50 rtl pb-24">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center">
            <ArrowRight className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-lg font-bold text-gray-800">شركاؤنا</h1>
          <div className="w-9" />
        </div>
      </header>

      {/* Partners Grid */}
      <div className="p-4">
        <p className="text-gray-500 text-sm text-center mb-6">شركاؤنا الموثوقون في مجال مواد البناء</p>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse min-h-[140px]">
                <div className="w-full h-20 bg-gray-200 rounded-lg mb-3" />
                <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto" />
              </div>
            ))}
          </div>
        ) : brands.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {brands.map((brand: Brand) => (
              <div
                key={brand.id}
                className="bg-white rounded-2xl p-6 flex flex-col items-center justify-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow min-h-[140px]"
              >
                <div className="w-full h-20 flex items-center justify-center mb-3 overflow-hidden">
                  {brand.image?.src ? (
                    <img
                      src={brand.image.src}
                      alt={brand.image.alt || brand.name}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.innerHTML = '<span class="text-3xl">🏷️</span>';
                      }}
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <span className="text-3xl">🏷️</span>
                  )}
                </div>
                <p className="text-sm font-medium text-gray-700 text-center">{brand.name}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🏷️</div>
            <p className="text-gray-600 mb-2">لا يوجد شركاء متاحين حالياً</p>
            <p className="text-sm text-gray-500">يرجى المحاولة لاحقاً</p>
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Partners;
