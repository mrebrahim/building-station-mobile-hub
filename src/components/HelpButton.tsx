
import { Phone, X, Mail, MessageCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const HelpButton = () => {
  const navigate = useNavigate();
  const [isHelpOpen, setIsHelpOpen] = useState(false);

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

  console.log('HelpButton render, isHelpOpen:', isHelpOpen);

  return (
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
  );
};

export default HelpButton;
