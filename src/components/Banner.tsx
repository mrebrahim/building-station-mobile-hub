
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
      image: "/lovable-uploads/86d58d52-96fe-4e34-946e-66010b49a622.png",
      alt: "مجموعتنا - Building Station",
      link: "/categories"
    },
    {
      id: 2,
      image: "/lovable-uploads/d7aa46b0-6cd7-4fbb-9007-dbad270642a1.png",
      alt: "أفضل الماركات العالمية",
      link: "/brands"
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
        api.scrollTo(0); // Go back to first slide
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
          containScroll: "trimSnaps"
        }}
      >
        <CarouselContent className="flex">
          {banners.map((banner, index) => {
            console.log('Rendering banner:', index, banner);
            return (
              <CarouselItem key={banner.id} className="flex-shrink-0 w-full">
                <Link to={banner.link} className="block">
                  <div className="relative overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
                    <img 
                      src={banner.image}
                      alt={banner.alt}
                      className="w-full h-40 sm:h-48 object-cover"
                      loading="lazy"
                      onLoad={() => console.log(`Banner image ${index} loaded successfully`)}
                      onError={() => console.error(`Banner image ${index} failed to load`)}
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
        <div className="flex justify-center space-x-2 mt-4">
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
