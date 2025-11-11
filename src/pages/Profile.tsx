import { ArrowLeft, Globe, HelpCircle, Users, LogOut, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import HelpButton from "@/components/HelpButton";

const Profile = () => {
  return (
    <div className="min-h-screen bg-gray-50 rtl">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <HelpButton />
          
          <h1 className="text-lg font-medium">ملفي الشخصي</h1>
          
          <Link to="/">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </Link>
        </div>
      </header>

      <div className="p-4 pb-32">
        {/* Welcome Section */}
        <div className="text-center mb-8 mt-4">
          <h2 className="text-2xl font-bold mb-2">مرحبا أيها الزائر!</h2>
          <p className="text-gray-600">مرحبا بك في أفضل سوق إلكتروني للأدوات في المنطقة</p>
        </div>

        {/* Login/Register Button */}
        <div className="mb-8">
          <Link to="/auth">
            <Button className="w-full bg-black text-white py-4 rounded-xl text-lg">
              <LogOut className="w-5 h-5 ml-2" />
              تسجيل الدخول / الاشتراك
            </Button>
          </Link>
        </div>

        {/* My Courses Button */}
        <div className="mb-8">
          <Link to="/my-courses">
            <Button className="w-full bg-primary text-primary-foreground py-4 rounded-xl text-lg">
              <GraduationCap className="w-5 h-5 ml-2" />
              كورساتي
            </Button>
          </Link>
        </div>

        {/* Contact Section */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4 text-right">تواصل معنا</h3>
          
          <div className="bg-white rounded-xl overflow-hidden shadow-sm">
            <Link to="/faq" className="flex items-center justify-between p-4 border-b border-gray-100">
              <ArrowLeft className="w-5 h-5 text-gray-400" />
              <div className="flex items-center gap-3">
                <span className="font-medium">الأسئلة الشائعة</span>
                <HelpCircle className="w-5 h-5 text-gray-600" />
              </div>
            </Link>
            
            <Link to="/about-us" className="flex items-center justify-between p-4">
              <ArrowLeft className="w-5 h-5 text-gray-400" />
              <div className="flex items-center gap-3">
                <span className="font-medium">من نحن</span>
                <Users className="w-5 h-5 text-gray-600" />
              </div>
            </Link>
          </div>
        </div>

        {/* Social Media */}
        <div className="flex justify-center gap-6 mb-8">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-xl">📱</span>
          </div>
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-xl">📷</span>
          </div>
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-xl">📺</span>
          </div>
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-xl">📘</span>
          </div>
        </div>

        {/* Footer Links */}
        <div className="text-center text-sm text-gray-500 space-y-2">
          <div className="flex justify-center gap-4">
            <span>شروط الاستخدام</span>
            <span>•</span>
            <span>سياسة الخصوصية</span>
            <span>•</span>
            <span>سياسة الإرجاع</span>
            <span>•</span>
            <span>الدفع والشحن</span>
          </div>
          <p>الإصدار 01.00 | © 2024 Building Station جميع الحقوق محفوظة</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
