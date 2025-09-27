
import { Card, CardContent } from "@/components/ui/card";

interface PaymentMethodProps {
  codPayment: boolean;
  onCodPaymentChange: (value: string) => void;
}

const PaymentMethod = ({ codPayment, onCodPaymentChange }: PaymentMethodProps) => {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-medium mb-4">طريقة الدفع</h2>
      <p className="text-sm text-gray-600 mb-4">
        يجب أن يتطابق عنوان إرسال الفاتورة الخاص بطريقة الدفع الخاصة بك مع عنوان الشحن. جميع المعاملات آمنة ومشفرة.
      </p>

      <div className="space-y-4">
        <Card className="border-2 border-gray-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium">خيارات الدفع</span>
              <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
            <div className="flex gap-2 mb-4">
              <div className="w-12 h-8 bg-gradient-to-r from-red-400 to-orange-400 rounded flex items-center justify-center text-white text-xs font-bold">
                MC
              </div>
              <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded flex items-center justify-center text-white text-xs font-bold">
                VISA
              </div>
            </div>
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
              <div className="text-4xl mb-2">💳</div>
              <p className="text-sm text-gray-600">
                بعد النقر على "ادفع الآن"، سيتم توجيهك إلى صفحة الدفع الآمنة لإكمال عملية الشراء.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <input 
                type="radio" 
                id="cod" 
                name="payment"
                checked={codPayment}
                onChange={(e) => onCodPaymentChange(e.target.checked.toString())}
              />
              <label htmlFor="cod">الدفع عند الاستلام (COD)</label>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentMethod;
