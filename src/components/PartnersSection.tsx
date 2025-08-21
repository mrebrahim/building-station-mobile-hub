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
  'ARKA': arkaLogo,
  'ITACA': itacaLogo,
  'Asteeno Ceramics': asteenLogo,
};

const PartnersSection = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const autoPlayRef = useRef<NodeJS.Timeout>();
  const [validPartners, setValidPartners] = useState<any[]>([]);
  const [loadingImages, setLoadingImages] = useState(true);

  const { data: partners = [], isLoading, error } = useQuery({
    queryKey: ['partners'],
    queryFn: partnersService.getActivePartners,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  });

  // Filter partners with valid images
  useEffect(() => {
    if (partners.length === 0) {
      setValidPartners([]);
      setLoadingImages(false);
      return;
    }

    const checkImages = async () => {
      const validPartnersArray: any[] = [];
      
      for (const partner of partners) {
        const imageUrl = logoMap[partner.name] || partner.logo_url;
        
        // Check if image exists and is valid
        try {
          if (logoMap[partner.name]) {
            // Local images are always valid
            validPartnersArray.push(partner);
          } else if (partner.logo_url) {
            // For remote images, check if they load
            await new Promise((resolve, reject) => {
              const img = new Image();
              img.onload = () => resolve(true);
              img.onerror = () => reject(false);
              img.src = partner.logo_url;
            });
            validPartnersArray.push(partner);
          }
        } catch {
          // Skip partners with invalid images
          console.log(`Skipping partner ${partner.name} due to invalid image`);
        }
      }
      
      setValidPartners(validPartnersArray);
      setLoadingImages(false);
    };

    checkImages();
  }, [partners]);

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


  if (isLoading || loadingImages) {
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
              {validPartners.map((partner) => (
                <CarouselItem 
                  key={partner.id} 
                  className="pr-2 md:pr-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
                >
                  <div
                    className="bg-card border border-border rounded-lg p-4 h-28 flex items-center justify-center overflow-hidden"
                  >
                    <img
                      src={logoMap[partner.name] || partner.logo_url}
                      alt={partner.name}
                      className="w-full h-full object-contain"
                      loading="eager"
                      decoding="async"
                      style={{ 
                        maxWidth: '100%', 
                        maxHeight: '100%',
                        imageRendering: 'crisp-edges'
                      }}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Navigation Buttons */}
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