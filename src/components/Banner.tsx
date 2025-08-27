
import { Link } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";

const Banner = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const banners = [
    {
      id: 1,
      image: "/lovable-uploads/72a7be5e-a822-46e1-8a6f-0355c2eb54f4.png",
      alt: "منتجات ذكية للمنزل - Smart Home",
      link: "/categories"
    },
    {
      id: 2,
      image: "/lovable-uploads/f76dd736-8ac1-4779-8be8-9872936b20fd.png",
      alt: "منتجات كهربائية - Electrical Products",
      link: "/categories"
    },
    {
      id: 3,
      image: "/lovable-uploads/56628d8b-5aed-4b3b-add5-bfe495ad6d4d.png",
      alt: "بديل الخشب - Wood Alternative",
      link: "/categories"
    },
    {
      id: 4,
      image: "/lovable-uploads/eaea70a0-753b-4ca1-9317-1b8e8d0729ba.png",
      alt: "أقفال ذكية - Smart Locks",
      link: "/categories"
    }
  ];

  console.log('Banner component rendered with banners:', banners);

  useEffect(() => {
    if (!api) {
      return;
    }

    const snapList = api.scrollSnapList();
    console.log('Carousel API initialized. Snap list:', snapList);
    console.log('Scroll snap list length:', snapList.length);

    setCount(snapList.length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      const selectedSnap = api.selectedScrollSnap();
      console.log('Carousel slide changed to:', selectedSnap);
      setCurrent(selectedSnap);
    });

    // Force reInit to ensure proper setup in RTL
    api.reInit();
  }, [api]);

  // Auto-slide effect
  useEffect(() => {
    if (!api) {
      return;
    }

    console.log('Setting up auto-slide interval');
    const interval = setInterval(() => {
      const currentIndex = api.selectedScrollSnap();
      const nextIndex = currentIndex + 1;
      console.log('Auto-slide: current index:', currentIndex, 'next index:', nextIndex);
      
      if (nextIndex >= api.scrollSnapList().length) {
        console.log('Auto-slide: going back to first slide');
        api.scrollTo(0);
      } else {
        console.log('Auto-slide: going to next slide:', nextIndex);
        api.scrollTo(nextIndex);
      }
    }, 5000); // 5 seconds

    return () => {
      console.log('Cleaning up auto-slide interval');
      clearInterval(interval);
    };
  }, [api]);

  const scrollToSlide = (index: number) => {
    console.log('Manual slide navigation to index:', index);
    api?.scrollTo(index);
  };

  return (
    <div className="px-4 py-4">
      <Carousel 
        setApi={setApi} 
        className="w-full"
        opts={{
          align: "start",
          loop: true,
          skipSnaps: false,
          containScroll: "trimSnaps",
          direction: "rtl"
        }}
      >
        <CarouselContent className="flex -ml-0">
          {banners.map((banner, index) => {
            console.log('Rendering banner:', index, banner);
            return (
              <CarouselItem key={banner.id} className="basis-full min-w-0 flex-shrink-0">
                <Link to={banner.link} className="block">
                  <div className="relative overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
                    <img 
                      src={banner.image}
                      alt={banner.alt}
                      className="w-full h-56 sm:h-64 md:h-72 object-contain bg-gray-50"
                      loading="lazy"
                      onLoad={() => console.log(`Banner image ${index} loaded successfully`)}
                      onError={(e) => {
                        console.error(`Banner image ${index} failed to load:`, e);
                        // Fallback handling
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                </Link>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
      
      {/* Pagination dots */}
      {count > 1 && (
        <div className="flex justify-center space-x-2 mt-4" dir="ltr">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                current === index ? "bg-red-500" : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Banner;
