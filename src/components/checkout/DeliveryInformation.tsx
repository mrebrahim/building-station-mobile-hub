
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DeliveryInformationProps {
  formData: {
    country: string;
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    postalCode: string;
    phone: string;
  };
  onInputChange: (field: string, value: string) => void;
}

const DeliveryInformation = ({ formData, onInputChange }: DeliveryInformationProps) => {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-medium mb-4">توصيل</h2>
      <p className="text-sm text-gray-600 mb-4">
        سيتم استخدام هذا العنوان أيضاً كعنوان الفواتير الخاص بطلبك.
      </p>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="country">البلد/المنطقة</Label>
          <Select value={formData.country} onValueChange={(value) => onInputChange("country", value)}>
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
            onChange={(e) => onInputChange("firstName", e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="lastName">اسم العائلة</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => onInputChange("lastName", e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="street">اسم الشارع</Label>
          <Input
            id="street"
            value={formData.street}
            onChange={(e) => onInputChange("street", e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="city">مدينة</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => onInputChange("city", e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="postalCode">الرمز البريدي (اختياري)</Label>
          <Input
            id="postalCode"
            value={formData.postalCode}
            onChange={(e) => onInputChange("postalCode", e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="phone">هاتف</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => onInputChange("phone", e.target.value)}
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
  );
};

export default DeliveryInformation;
