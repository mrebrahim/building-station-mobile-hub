
import { Button } from "@/components/ui/button";

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
}

const OrderSummaryDetail = ({ items, subtotal, total }: OrderSummaryDetailProps) => {
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
        <div className="flex justify-between">
          <span>كود خصم أو بطاقة هدية</span>
          <Button variant="outline" size="sm">تفعيل</Button>
        </div>
        
        <div className="flex justify-between text-lg font-medium">
          <span>المجموع الفرعي</span>
          <span>د.ع {subtotal.toLocaleString()}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span>شحن</span>
          <span className="text-sm text-gray-500">أدخل عنوان الشحن</span>
        </div>
        
        <div className="flex justify-between text-xl font-bold border-t pt-3">
          <span>المجموع</span>
          <span>د.ع {total.toLocaleString()} IQD</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummaryDetail;
