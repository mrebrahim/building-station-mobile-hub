import arkaLogo from "@/assets/arka-logo.png";
import itacaLogo from "@/assets/itaca-logo.png";
import asteenLogo from "@/assets/asteeno-logo.png";

const PartnersSection = () => {
  // Static partners data with direct image imports
  const partners = [
    {
      id: 1,
      name: "ARKA",
      logo: arkaLogo,
    },
    {
      id: 2,
      name: "ITACA", 
      logo: itacaLogo,
    },
    {
      id: 3,
      name: "Asteeno Ceramics",
      logo: asteenLogo,
    },
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
          شركاؤنا
        </h2>
        
        <div className="flex justify-center items-center gap-8 flex-wrap">
          {partners.map((partner) => (
            <div 
              key={partner.id}
              className="bg-card border border-border rounded-lg p-6 w-48 h-28 flex items-center justify-center overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;