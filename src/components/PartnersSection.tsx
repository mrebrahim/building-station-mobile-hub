import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { partnersService } from "@/services/partners";
import { cn } from "@/lib/utils";

// Import partner logos
import arkaLogo from "@/assets/arka-logo.png";
import itacaLogo from "@/assets/itaca-logo.png";
import asteenLogo from "@/assets/asteeno-logo.png";

// Logo mapping for local images
const logoMap: Record<string, string> = {
  'arka-logo': arkaLogo,
  'itaca-logo': itacaLogo,
  'asteeno-logo': asteenLogo,
};

const PartnersSection = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const autoPlayRef = useRef<NodeJS.Timeout>();

  const { data: partners = [], isLoading, error } = useQuery({
    queryKey: ['partners'],
    queryFn: partnersService.getActivePartners,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  });

  // Filter partners that have valid logos
  const validPartners = partners.filter(partner => 
    logoMap[partner.logo_url] || partner.logo_url
  );

  // Initialize carousel API and set up event listeners
  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  // Auto-scroll functionality
  useEffect(() => {
    if (!api || validPartners.length === 0) return;

    const startAutoPlay = () => {
      autoPlayRef.current = setInterval(() => {
        if (api.canScrollNext()) {
          api.scrollNext();
        } else {
          api.scrollTo(0);
        }
      }, 3000); // 3 seconds
    };

    const stopAutoPlay = () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };

    startAutoPlay();

    // Pause auto-scroll on hover
    const carousel = api.rootNode();
    if (carousel) {
      carousel.addEventListener('mouseenter', stopAutoPlay);
      carousel.addEventListener('mouseleave', startAutoPlay);
    }

    return () => {
      stopAutoPlay();
      if (carousel) {
        carousel.removeEventListener('mouseenter', stopAutoPlay);
        carousel.removeEventListener('mouseleave', startAutoPlay);
      }
    };
  }, [api, validPartners.length]);

  const scrollPrev = () => {
    api?.scrollPrev();
  };

  const scrollNext = () => {
    api?.scrollNext();
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">شركاؤنا</h2>
          <div className="flex justify-center items-center space-x-4 rtl:space-x-reverse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-48 h-24 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || validPartners.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-background animate-fade-in">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
          شركاؤنا
        </h2>
        
        <div className="relative max-w-6xl mx-auto">
          <Carousel
            setApi={setApi}
            className="w-full"
            opts={{
              align: "start",
              loop: true,
              direction: "rtl",
              dragFree: true,
              containScroll: "trimSnaps",
            }}
          >
            <CarouselContent className="-mr-2 md:-mr-4">
              {validPartners.map((partner) => {
                const logoSrc = logoMap[partner.logo_url] || partner.logo_url;
                
                return (
                  <CarouselItem 
                    key={partner.id} 
                    className="pr-2 md:pr-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
                  >
                    <div className="bg-card border border-border rounded-lg p-4 h-28 flex items-center justify-center overflow-hidden hover:shadow-lg transition-shadow duration-300">
                      {logoSrc ? (
                        <img
                          src={logoSrc}
                          alt={partner.name}
                          className="w-full h-full object-contain"
                          loading="eager"
                          decoding="async"
                          style={{ 
                            maxWidth: '100%', 
                            maxHeight: '100%',
                            imageRendering: 'crisp-edges'
                          }}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="text-muted-foreground text-sm font-medium">
                          {partner.name}
                        </div>
                      )}
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>

            {/* Navigation Buttons */}
            {validPartners.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full border-2 hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
                  onClick={scrollPrev}
                  aria-label="الشريك السابق"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full border-2 hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
                  onClick={scrollNext}
                  aria-label="الشريك التالي"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}
          </Carousel>

          {/* Pagination Dots */}
          {count > 1 && (
            <div className="flex justify-center space-x-2 rtl:space-x-reverse mt-8">
              {Array.from({ length: count }, (_, index) => (
                <button
                  key={index}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-200",
                    current === index + 1
                      ? "bg-primary w-8"
                      : "bg-muted hover:bg-muted-foreground/50"
                  )}
                  onClick={() => api?.scrollTo(index)}
                  aria-label={`انتقل إلى الشريك ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;