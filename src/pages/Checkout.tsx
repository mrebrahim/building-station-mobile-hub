
import { ArrowLeft, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Checkout = () => {
  const [formData, setFormData] = useState({
    email: "",
    country: "العراق",
    firstName: "",
    lastName: "",
    street: "",
    city: "",
    postalCode: "",
    phone: "",
    paymentMethod: "credit",
    codPayment: false
  });

  const [orderSummary, setOrderSummary] = useState({
    items: [] as any[],
    subtotal: 0,
    shipping: 0,
    total: 0
  });

  useEffect(() => {
    // Load cart items from localStorage for checkout
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const subtotal = savedCart.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
    
    setOrderSummary({
      items: savedCart,
      subtotal: subtotal,
      shipping: 0,
      total: subtotal
    });
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log("Order submitted:", formData);
    // Handle order submission
  };

  return (
    <div className="min-h-screen bg-gray-50 rtl">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <div></div>
          <h1 className="text-lg font-medium">إتمام الشراء</h1>
          <Link to="/cart">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </Link>
        </div>
      </header>

      <div className="p-4 pb-6">
        {/* Order Summary */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium">ملخص الطلب</span>
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </div>
            <div className="text-right">
              <span className="text-xl font-bold">د.ع {orderSummary.total.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-4">معلومات التواصل</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">بريد إلكتروني</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="newsletter"
                className="rounded"
              />
              <label htmlFor="newsletter" className="text-sm">
                أرسل لي أحدث الأخبار والعروض الحصرية من تولمارت!
              </label>
            </div>
          </div>
        </div>

        {/* Delivery Information */}
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-4">توصيل</h2>
          <p className="text-sm text-gray-600 mb-4">
            سيتم استخدام هذا العنوان أيضاً كعنوان الفواتير الخاص بطلبك.
          </p>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="country">البلد/المنطقة</Label>
              <Select value={formData.country} onValueChange={(value) => handleInputChange("country", value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="العراق">العراق</SelectItem>
                  <SelectItem value="الأردن">الأردن</SelectItem>
                  <SelectItem value="لبنان">لبنان</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="firstName">الاسم الأول</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="lastName">اسم العائلة</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="street">اسم الشارع</Label>
              <Input
                id="street"
                value={formData.street}
                onChange={(e) => handleInputChange("street", e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="city">مدينة</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="postalCode">الرمز البريدي (اختياري)</Label>
              <Input
                id="postalCode"
                value={formData.postalCode}
                onChange={(e) => handleInputChange("postalCode", e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="phone">هاتف</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-2">
              <input type="checkbox" id="saveInfo" className="rounded" />
              <label htmlFor="saveInfo" className="text-sm">
                احفظ هذه المعلومات للمرة القادمة
              </label>
            </div>
            
            <div className="flex items-center gap-2">
              <input type="checkbox" id="marketing" className="rounded" />
              <label htmlFor="marketing" className="text-sm">
                أرسل لي رسائل واتساب بالعروض والتخفيضات
              </label>
            </div>
          </div>
        </div>

        {/* Shipping Method */}
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

        {/* Payment Method */}
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
                  <img src="/placeholder.svg" alt="Mastercard" className="w-8 h-6 object-contain" />
                  <img src="/placeholder.svg" alt="Visa" className="w-8 h-6 object-contain" />
                </div>
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="text-4xl mb-2">💳</div>
                  <p className="text-sm text-gray-600">
                    After clicking "ادفع الآن", you will be redirected to خيارات الدفع to complete your purchase securely.
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
                    checked={formData.codPayment}
                    onChange={(e) => handleInputChange("codPayment", e.target.checked.toString())}
                  />
                  <label htmlFor="cod">الدفع عند الاستلام (COD)</label>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Order Summary Detail */}
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-4">ملخص الطلب</h2>
          
          {orderSummary.items.map((item) => (
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
              <span>د.ع {orderSummary.subtotal.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span>شحن</span>
              <span className="text-sm text-gray-500">أدخل عنوان الشحن</span>
            </div>
            
            <div className="flex justify-between text-xl font-bold border-t pt-3">
              <span>المجموع</span>
              <span>د.ع {orderSummary.total.toLocaleString()} IQD</span>
            </div>
          </div>
        </div>

        {/* Complete Order Button */}
        <Button 
          className="w-full bg-black text-white py-3 text-lg font-medium mb-6"
          onClick={handleSubmit}
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
      </div>
    </div>
  );
};

export default Checkout;
