import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface OrderSummaryDetailProps {
  items: OrderItem[];
  subtotal: number;
  total: number;
  discount: number;
  onDiscountApply: (discount: number, code: string) => void;
}

const OrderSummaryDetail = ({ items, subtotal, total, discount, onDiscountApply }: OrderSummaryDetailProps) => {
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");

  // أكواد الخصم المتاحة (يمكن إضافة المزيد)
  const availableCoupons: { [key: string]: number } = {
    "SAVE10": 10, // خصم 10%
    "SAVE20": 20, // خصم 20%
    "WELCOME": 15, // خصم 15%
  };

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    
    if (!code) {
      toast.error("الرجاء إدخال كود الخصم");
      return;
    }

    if (availableCoupons[code]) {
      const discountPercent = availableCoupons[code];
      const discountAmount = (subtotal * discountPercent) / 100;
      
      setAppliedCoupon(code);
      onDiscountApply(discountAmount, code);
      
      toast.success(`تم تطبيق خصم ${discountPercent}%`);
    } else {
      toast.error("كود الخصم غير صحيح");
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode("");
    setAppliedCoupon("");
    onDiscountApply(0, "");
    toast.success("تم إلغاء كود الخصم");
  };

  return (
    <div className="mb-6">
      <h2 className="text-lg font-medium mb-4">ملخص الطلب</h2>
      
      {items.map((item) => (
        <div key={item.id} className="flex items-center gap-4 mb-4">
          <div className="relative">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
              {item.image && item.image !== '' ? (
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  onError={(e) => {
                    console.error("Checkout item image failed to load:", e.currentTarget.src);
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.innerHTML = '<span class="text-2xl text-gray-400">📦</span>';
                  }}
                  onLoad={() => console.log("Successfully loaded checkout item image:", item.image)}
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="text-2xl text-gray-400">📦</span>
              )}
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gray-500 text-white text-xs rounded-full flex items-center justify-center">
              {item.quantity}
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-medium">{item.name}</h3>
            <p className="text-lg font-bold">د.ع {item.price.toLocaleString()}</p>
          </div>
        </div>
      ))}

      <div className="space-y-3 border-t pt-4">
        <div className="space-y-2">
          <span className="text-sm font-medium">كود خصم أو بطاقة هدية</span>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="أدخل كود الخصم"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              disabled={!!appliedCoupon}
              className="flex-1"
            />
            {appliedCoupon ? (
              <Button 
                variant="destructive" 
                size="sm"
                onClick={handleRemoveCoupon}
              >
                إلغاء
              </Button>
            ) : (
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleApplyCoupon}
              >
                تفعيل
              </Button>
            )}
          </div>
          {appliedCoupon && (
            <p className="text-sm text-green-600">
              ✓ تم تطبيق كود: {appliedCoupon}
            </p>
          )}
        </div>
        
        <div className="flex justify-between text-lg font-medium">
          <span>المجموع الفرعي</span>
          <span>د.ع {subtotal.toLocaleString()}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span>شحن</span>
          <span className="text-sm text-gray-500">مجاناً</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>الخصم</span>
            <span>- د.ع {discount.toLocaleString()}</span>
          </div>
        )}
        
        <div className="flex justify-between text-xl font-bold border-t pt-3">
          <span>المجموع</span>
          <span>د.ع {total.toLocaleString()} IQD</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummaryDetail;
