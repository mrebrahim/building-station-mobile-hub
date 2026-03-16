import { Card, CardContent } from "@/components/ui/card";

interface PaymentMethodProps {
  selectedMethod: string;
  onMethodChange: (method: string) => void;
}

const PaymentMethod = ({ selectedMethod, onMethodChange }: PaymentMethodProps) => {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-medium mb-4">طريقة الدفع</h2>
      <p className="text-sm text-gray-600 mb-4">
        جميع المعاملات آمنة ومشفرة.
      </p>

      <div className="space-y-3">
        {/* QiCard */}
        <Card
          className={`border-2 cursor-pointer transition-all ${
            selectedMethod === "qicard" ? "border-orange-500 bg-orange-50" : "border-gray-200"
          }`}
          onClick={() => onMethodChange("qicard")}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedMethod === "qicard" ? "border-orange-500" : "border-gray-300"
              }`}>
                {selectedMethod === "qicard" && (
                  <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="w-12 h-8 bg-gradient-to-r from-orange-500 to-yellow-400 rounded flex items-center justify-center text-white text-xs font-bold shadow">
                  QI
                </div>
                <div>
                  <p className="font-medium text-sm">QiCard</p>
                  <p className="text-xs text-gray-500">الدفع ببطاقة QiCard العراقية</p>
                </div>
              </div>
            </div>
            {selectedMethod === "qicard" && (
              <div className="mt-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                <p className="text-xs text-orange-700 text-center">
                  🔒 بعد تأكيد الطلب، سيتم توجيهك لصفحة الدفع الآمنة بـ QiCard
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cash on Delivery */}
        <Card
          className={`border-2 cursor-pointer transition-all ${
            selectedMethod === "cod" ? "border-gray-800 bg-gray-50" : "border-gray-200"
          }`}
          onClick={() => onMethodChange("cod")}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedMethod === "cod" ? "border-gray-800" : "border-gray-300"
              }`}>
                {selectedMethod === "cod" && (
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-800" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="w-12 h-8 bg-gray-700 rounded flex items-center justify-center text-white text-xs font-bold shadow">
                  💵
                </div>
                <div>
                  <p className="font-medium text-sm">الدفع عند الاستلام</p>
                  <p className="text-xs text-gray-500">ادفع نقداً عند استلام الطلب</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentMethod;
