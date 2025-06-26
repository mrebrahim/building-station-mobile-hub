
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

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  // Auto-slide effect
  useEffect(() => {
    if (!api) {
      return;
    }

    const interval = setInterval(() => {
      const currentIndex = api.selectedScrollSnap();
      const nextIndex = currentIndex + 1;
      
      if (nextIndex >= api.scrollSnapList().length) {
        api.scrollTo(0); // Go back to first slide
      } else {
        api.scrollTo(nextIndex);
      }
    }, 5000); // 5 seconds

    return () => clearInterval(interval);
  }, [api]);

  const scrollToSlide = (index: number) => {
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
        }}
      >
        <CarouselContent>
          {banners.map((banner) => (
            <CarouselItem key={banner.id}>
              <Link to={banner.link} className="block">
                <div className="relative overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
                  <img 
                    src={banner.image}
                    alt={banner.alt}
                    className="w-full h-40 sm:h-48 object-cover"
                    loading="lazy"
                  />
                </div>
              </Link>
            </CarouselItem>
          ))}
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
