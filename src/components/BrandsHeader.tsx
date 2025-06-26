
import { ArrowLeft, Phone, X, Mail, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const BrandsHeader = () => {
  const navigate = useNavigate();
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const handleBackClick = () => {
    console.log('Back button clicked');
    // Try to go back in history, if no history go to home
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const helpOptions = [
    {
      id: 1,
      title: "الأسئلة الشائعة",
      icon: MessageCircle,
      action: () => {
        console.log('FAQ option clicked');
        setIsHelpOpen(false);
        navigate('/faq');
      }
    },
    {
      id: 2,
      title: "بريد الكتروني",
      icon: Mail,
      action: () => {
        console.log('Email option clicked');
        window.location.href = 'mailto:support@buildingstation.com';
      }
    },
    {
      id: 3,
      title: "اتصال",
      icon: Phone,
      action: () => {
        console.log('Phone option clicked');
        window.location.href = 'tel:+966123456789';
      }
    },
    {
      id: 4,
      title: "واتساب",
      icon: MessageCircle,
      action: () => {
        console.log('WhatsApp option clicked');
        window.open('https://wa.me/966123456789', '_blank');
      }
    }
  ];

  console.log('BrandsHeader render, isHelpOpen:', isHelpOpen);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="flex items-center justify-between p-4">
        <button 
          onClick={handleBackClick}
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="العودة للخلف"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        
        <div className="flex-1"></div>
        
        <Sheet open={isHelpOpen} onOpenChange={setIsHelpOpen}>
          <SheetTrigger asChild>
            <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-colors">
              <Phone className="w-4 h-4" />
              <span className="text-sm font-medium">مساعدة</span>
            </button>
          </SheetTrigger>
          
          <SheetContent side="top" className="h-auto p-0 rounded-b-2xl">
            <div className="bg-white">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <button 
                  onClick={() => setIsHelpOpen(false)}
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
                
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-red-500">TOOLMART</h2>
                </div>
                
                <div className="w-10"></div>
              </div>
              
              {/* Help Options Grid */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {helpOptions.map((option) => {
                    const IconComponent = option.icon;
                    return (
                      <button
                        key={option.id}
                        onClick={option.action}
                        className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
                      >
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm">
                          <IconComponent className="w-6 h-6 text-gray-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-800">{option.title}</span>
                      </button>
                    );
                  })}
                </div>
                
                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <button className="bg-gray-100 text-gray-800 py-3 px-6 rounded-xl font-medium hover:bg-gray-200 transition-colors">
                    طلب المشتريات
                  </button>
                  <button className="bg-gray-100 text-gray-800 py-3 px-6 rounded-xl font-medium hover:bg-gray-200 transition-colors">
                    كن موردًا
                  </button>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default BrandsHeader;
