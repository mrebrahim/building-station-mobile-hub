import { useQuery } from "@tanstack/react-query";
import { categoriesService } from "@/services/woocommerce/categories";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";

interface Category {
  id: number;
  name: string;
  count: number;
  image?: { src: string; alt?: string };
}

const FeaturedCategoriesSection = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  // Fetch categories from local database
  const { data: apiCategories = [], isLoading, error } = useQuery({
    queryKey: ['featured-categories'],
    queryFn: () => categoriesService.getFeaturedCategories(12),
    staleTime: 1000 * 30, // 30 seconds
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: 3,
    retryDelay: 1000,
  });

  // Transform categories to display format
  const displayCategories = apiCategories.map(apiCat => ({
    id: apiCat.id,
    name: apiCat.name,
    slug: apiCat.slug || '',
    description: apiCat.description || '',
    count: apiCat.count,
    image: apiCat.image || undefined,
    parent: apiCat.parent || 0
  }));

  // Group categories into slides of 6 (3x2 grid per slide)
  const categoriesPerSlide = 6;
  const slides = [];
  for (let i = 0; i < displayCategories.length; i += categoriesPerSlide) {
    slides.push(displayCategories.slice(i, i + categoriesPerSlide));
  }

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });

    // Auto-scroll functionality
    const autoScroll = setInterval(() => {
      if (api && slides.length > 1) {
        const currentIndex = api.selectedScrollSnap();
        const nextIndex = (currentIndex + 1) % slides.length;
        api.scrollTo(nextIndex);
      }
    }, 5000); // Change slide every 5 seconds

    return () => {
      clearInterval(autoScroll);
    };
  }, [api, slides.length]);

  const scrollToSlide = (index: number) => {
    api?.scrollTo(index);
  };

  return (
    <div className="px-4 py-6 bg-white">
      {/* Header with View All button */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">تسوق حسب الفئة</h2>
        <Link to="/categories">
          <Button variant="outline" className="text-red-500 border-red-500 hover:bg-red-50 text-sm px-4 py-2">
            عرض الكل
          </Button>
        </Link>
      </div>

      {/* Categories Carousel */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-gray-50 rounded-2xl p-4 text-center shadow-sm animate-pulse">
              <div className="w-full h-24 bg-gray-200 rounded-xl mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
            </div>
          ))}
        </div>
      ) : displayCategories.length > 0 ? (
        <>
          <Carousel 
            setApi={setApi} 
            className="w-full mb-6"
            opts={{
              align: "start",
              loop: true,
              direction: "rtl"
            }}
          >
            <CarouselContent>
              {slides.map((slide, slideIndex) => (
                <CarouselItem key={slideIndex}>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {slide.map((category) => (
                      <Link key={category.id} to={`/category/${category.id}`} className="block">
                        <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 hover:scale-105">
                          <div className="w-full h-24 bg-gray-50 rounded-xl mb-3 flex items-center justify-center overflow-hidden">
                            {category.image && category.image.src ? (
                              <img 
                                src={category.image.src} 
                                alt={category.image.alt || category.name}
                                loading="lazy"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                  e.currentTarget.parentElement!.innerHTML = '<span class="text-3xl">📦</span>';
                                }}
                                className="w-full h-full object-cover rounded-xl"
                              />
                            ) : (
                              <span className="text-3xl">📦</span>
                            )}
                          </div>
                          <h3 className="text-sm font-semibold text-gray-800 leading-tight mb-1">{category.name}</h3>
                          <p className="text-xs text-gray-500">{category.count} منتج</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          
          {/* Functional Pagination dots */}
          {count > 1 && (
            <div className="flex justify-center gap-2">
              {Array.from({ length: count }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    current === index + 1 
                      ? "bg-red-500 scale-110" 
                      : "bg-gray-300 hover:bg-gray-400 hover:scale-105"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">📦</div>
          <p className="text-gray-600 mb-4">لا توجد فئات متاحة حالياً</p>
          <p className="text-sm text-gray-500 mb-4">يرجى المحاولة لاحقاً أو التحقق من الاتصال بالإنترنت</p>
          {error && (
            <div className="text-xs text-red-500 mt-2">
              خطأ في التحميل: {error.message}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FeaturedCategoriesSection;