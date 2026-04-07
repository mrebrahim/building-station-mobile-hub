import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNavigation from "@/components/BottomNavigation";
import arkaLogo from "@/assets/arka-logo.png";
import itacaLogo from "@/assets/itaca-logo.png";
import asteenLogo from "@/assets/asteeno-logo.png";

const partners = [
  { id: 1, name: "ARKA", logo: arkaLogo, description: "شركة أركا" },
  { id: 2, name: "ITACA", logo: itacaLogo, description: "شركة إيتاكا" },
  { id: 3, name: "Asteeno Ceramics", logo: asteenLogo, description: "أستينو للسيراميك" },
];

const Partners = () => {
  const navigate = useNavigate();

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

        <div className="grid grid-cols-2 gap-4">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="bg-white rounded-2xl p-6 flex flex-col items-center justify-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow min-h-[140px]"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="max-w-full max-h-20 object-contain mb-3"
              />
              <p className="text-sm font-medium text-gray-700 text-center">{partner.description}</p>
            </div>
          ))}
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Partners;
