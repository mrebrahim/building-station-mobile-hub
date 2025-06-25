
import { Card, CardContent } from "@/components/ui/card";

const ShippingMethod = () => {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-medium mb-4">طريقة الشحن</h2>
      <Card className="border border-red-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-red-600">الشحن غير متاح</span>
            </div>
            <span className="text-sm text-gray-500">أدخل عنوان الشحن</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShippingMethod;
