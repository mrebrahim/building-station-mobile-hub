
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

const FAQ = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqs = [
    {
      question: "ما هو تولمارت؟",
      answer: "تولمارت هو منصة تجارة إلكترونية متخصصة في بيع الأدوات والمعدات الصناعية والمنزلية، نوفر مجموعة واسعة من المنتجات عالية الجودة بأفضل الأسعار."
    },
    {
      question: "هل يقدم تولمارت خدمات B2B؟",
      answer: "نعم، نحن نقدم خدمات مخصصة للشركات والمؤسسات التجارية مع عروض أسعار خاصة وخدمات الدفع الآجل وإدارة الحسابات المخصصة."
    },
    {
      question: "كيف يساعد تولمارت الشركات؟",
      answer: "نوفر للشركات حلول شاملة تشمل: أسعار الجملة، خدمة العملاء المخصصة، التوصيل السريع، وإدارة المخزون والطلبات بطريقة احترافية."
    },
    {
      question: "ما هي الصناعات التي يخدمها تولمارت؟",
      answer: "نخدم مجموعة واسعة من الصناعات بما في ذلك: البناء والتشييد، الصناعات التحويلية، الخدمات الفندقية، ورش السيارات، والعديد من القطاعات الأخرى."
    },
    {
      question: "ما هو مستقبل تولمارت؟",
      answer: "نسعى لأن نكون المنصة الرائدة في المنطقة لتوفير الأدوات والمعدات، مع التوسع في الخدمات الرقمية وتطوير تقنيات جديدة لخدمة عملائنا بشكل أفضل."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 rtl">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <div className="w-6"></div>
          
          <h1 className="text-lg font-medium">الأسئلة الشائعة</h1>
          
          <Link to="/profile">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </Link>
        </div>
      </header>

      <div className="p-4 pb-32">
        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Collapsible key={index} open={openItems.includes(index)} onOpenChange={() => toggleItem(index)}>
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <CollapsibleTrigger className="w-full p-4 text-right hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <svg 
                      className={`w-5 h-5 text-gray-400 transition-transform ${openItems.includes(index) ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    <span className="font-medium text-gray-800">{faq.question}</span>
                  </div>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <div className="px-4 pb-4 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">
                    {faq.answer}
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
