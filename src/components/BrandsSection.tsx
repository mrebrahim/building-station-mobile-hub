
import { useQuery } from "@tanstack/react-query";
import { wooCommerceService } from "@/services/woocommerce";
import { Link } from "react-router-dom";

interface Brand {
  id: number;
  name: string;
  slug: string;
  image?: {
    id: number;
    src: string;
    alt?: string;
  };
  count: number;
}

const BrandsSection = () => {
  const { data: brands = [], isLoading } = useQuery({
    queryKey: ['brands-home'],
    queryFn: () => wooCommerceService.getBrands({ per_page: 6 }),
    retry: 3,
    retryDelay: 1000,
  });

  console.log('Brands for home section:', brands);

  if (isLoading) {
    return (
      <section className="px-4 py-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">تسوق حسب العلامات التجارية</h2>
          <div className="w-16 h-6 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <p className="text-sm text-gray-600 mb-4">أفضل العلامات التجارية العالمية</p>
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 animate-pulse">
              <div className="w-full h-16 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (brands.length === 0) {
    return null;
  }

  return (
    <section className="px-4 py-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-800">تسوق حسب العلامات التجارية</h2>
        <Link to="/brands" className="text-blue-500 text-sm font-medium hover:text-blue-600">
          عرض الكل
        </Link>
      </div>
      <p className="text-sm text-gray-600 mb-4">أفضل العلامات التجارية العالمية</p>
      
      <div className="grid grid-cols-3 gap-4">
        {brands.slice(0, 6).map((brand: Brand) => (
          <Link key={brand.id} to="/brands" className="block">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="w-full h-16 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden">
                {brand.image && brand.image.src ? (
                  <img 
                    src={brand.image.src} 
                    alt={brand.image.alt || brand.name}
                    loading="lazy"
                    onError={(e) => {
                      console.error("Brand image failed to load:", e.currentTarget.src);
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.innerHTML = '<span class="text-xl">🏷️</span>';
                    }}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span className="text-xl">🏷️</span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default BrandsSection;
