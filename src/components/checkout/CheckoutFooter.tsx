
import { Button } from "@/components/ui/button";

interface CheckoutFooterProps {
  onSubmit: () => void;
  isSubmitting?: boolean;
}

const CheckoutFooter = ({ onSubmit, isSubmitting = false }: CheckoutFooterProps) => {
  return (
    <>
      {/* Complete Order Button */}
      <Button 
        onClick={onSubmit}
        disabled={isSubmitting}
        className="w-full bg-black text-white hover:bg-gray-800 py-3 text-lg font-medium disabled:opacity-50 mb-6"
      >
        {isSubmitting ? "جاري المعالجة..." : "ادفع الآن"}
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
