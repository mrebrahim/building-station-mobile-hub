
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const BecomeSupplier = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    email: "",
    phone: "",
    businessLicense: "",
    productDescription: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Supplier registration submitted:", formData);
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
          
          <h1 className="text-lg font-medium">انضم كمورد</h1>
          
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
            <h2 className="text-xl font-bold mb-2">انضم إلينا</h2>
            <p className="text-sm">ومع احتياجاتك وكم في منصة Building Station التجارية الأولى</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="fullName" className="text-right block mb-2 text-gray-700">
              الاسم الكامل <span className="text-red-500">*</span>
            </Label>
            <Input
              id="fullName"
              type="text"
              placeholder="أدخل الاسم الكامل هنا"
              value={formData.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              className="text-right"
              required
            />
          </div>

          <div>
            <Label htmlFor="companyName" className="text-right block mb-2 text-gray-700">
              اسم الشركة <span className="text-red-500">*</span>
            </Label>
            <Input
              id="companyName"
              type="text"
              placeholder="أدخل اسم الشركة هنا"
              value={formData.companyName}
              onChange={(e) => handleInputChange("companyName", e.target.value)}
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
            <Label htmlFor="businessLicense" className="text-right block mb-2 text-gray-700">
              العلامة التجارية <span className="text-red-500">*</span>
            </Label>
            <Input
              id="businessLicense"
              type="text"
              placeholder="أدخل العلامة التجارية هنا"
              value={formData.businessLicense}
              onChange={(e) => handleInputChange("businessLicense", e.target.value)}
              className="text-right"
              required
            />
          </div>

          <div>
            <Label htmlFor="productDescription" className="text-right block mb-2 text-gray-700">
              وصف المنتج <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="productDescription"
              placeholder="أدخل وصف المنتج هنا"
              value={formData.productDescription}
              onChange={(e) => handleInputChange("productDescription", e.target.value)}
              className="text-right min-h-[120px]"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              className="w-full bg-black text-white py-4 rounded-xl text-lg hover:bg-gray-800 transition-colors"
            >
              إرسال
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BecomeSupplier;
