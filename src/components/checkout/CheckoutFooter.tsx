
import { Button } from "@/components/ui/button";

interface CheckoutFooterProps {
  onSubmit: () => void;
}

const CheckoutFooter = ({ onSubmit }: CheckoutFooterProps) => {
  return (
    <>
      {/* Complete Order Button */}
      <Button 
        className="w-full bg-black text-white py-3 text-lg font-medium mb-6"
        onClick={onSubmit}
      >
        ادفع الآن
      </Button>

      {/* Footer Links */}
      <div className="flex justify-center gap-4 text-sm text-gray-600">
        <a href="#" className="underline">سياسة الاسترجاع</a>
        <a href="#" className="underline">سياسة الشحن</a>
        <a href="#" className="underline">سياسة الخصوصية</a>
      </div>
      <div className="text-center mt-2">
        <a href="#" className="text-sm text-gray-600 underline">شروط الخدمة</a>
      </div>
    </>
  );
};

export default CheckoutFooter;
