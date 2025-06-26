
import { useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const PurchaseRequest = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    description: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Purchase request submitted:", formData);
    // Handle form submission here
  };

  const handleBackClick = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 rtl">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <div className="w-6"></div>
          
          <h1 className="text-lg font-medium">إرسال طلب التسعير</h1>
          
          <button 
            onClick={handleBackClick}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="العودة للخلف"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </header>

      <div className="p-4">
        {/* Hero Banner */}
        <div className="relative mb-6 rounded-xl overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 text-right">
            <h2 className="text-xl font-bold mb-2">مشتريات الشركات</h2>
            <div className="text-sm space-y-1">
              <div className="flex items-center justify-end gap-2">
                <span>أسعار منافسة</span>
                <span>🏷️</span>
              </div>
              <div className="flex items-center justify-end gap-2">
                <span>توريد دون وسطاء</span>
                <span>📦</span>
              </div>
              <div className="flex items-center justify-end gap-2">
                <span>بسعر مباشر</span>
                <span>💰</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-right block mb-2 text-gray-700">
              الاسم <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="أدخل الاسم هنا"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="text-right"
              required
            />
          </div>

          <div>
            <Label htmlFor="company" className="text-right block mb-2 text-gray-700">
              الشركة <span className="text-red-500">*</span>
            </Label>
            <Input
              id="company"
              type="text"
              placeholder="أدخل الشركة هنا"
              value={formData.company}
              onChange={(e) => handleInputChange("company", e.target.value)}
              className="text-right"
              required
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-right block mb-2 text-gray-700">
              بريد إلكتروني <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="أدخل بريد إلكتروني هنا"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="text-right"
              required
            />
          </div>

          <div>
            <Label htmlFor="phone" className="text-right block mb-2 text-gray-700">
              الهاتف <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="أدخل الهاتف هنا"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className="text-right"
              required
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-right block mb-2 text-gray-700">
              الوصف <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="أدخل الوصف هنا"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="text-right min-h-[120px]"
              required
            />
          </div>

          {/* File Upload Section */}
          <div className="text-center py-8">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <Upload className="w-8 h-8 text-gray-500" />
              </div>
              <span className="text-gray-600">تحميل الملفات</span>
              <input
                type="file"
                multiple
                className="hidden"
                id="file-upload"
                accept="image/*,.pdf,.doc,.docx"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer text-blue-500 underline"
              >
                اختر الملفات
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              className="w-full bg-black text-white py-4 rounded-xl text-lg hover:bg-gray-800 transition-colors"
            >
              إرسال الطلب
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PurchaseRequest;
