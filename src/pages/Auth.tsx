import { useState } from "react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (!formData.email || !formData.password) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      toast.error("كلمات المرور غير متطابقة");
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) {
          toast.error("خطأ في تسجيل الدخول: " + error.message);
          return;
        }

        toast.success("تم تسجيل الدخول بنجاح!");
        navigate('/');
      } else {
        const redirectUrl = `${window.location.origin}/`;
        
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: redirectUrl
          }
        });

        if (error) {
          toast.error("خطأ في إنشاء الحساب: " + error.message);
          return;
        }

        toast.success("تم إنشاء الحساب بنجاح! يرجى التحقق من بريدك الإلكتروني");
      }
    } catch (error) {
      console.error("Auth error:", error);
      toast.error("حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 rtl">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <div className="w-6"></div>
          <h1 className="text-lg font-medium">
            {isLogin ? "تسجيل الدخول" : "إنشاء حساب جديد"}
          </h1>
          <Link to="/profile">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </Link>
        </div>
      </header>

      <div className="p-6">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-primary-foreground font-bold text-2xl">B</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">
            {isLogin ? "مرحباً بعودتك!" : "انضم إلينا"}
          </h2>
          <p className="text-gray-600">
            {isLogin 
              ? "سجل دخولك للاستمتاع بجميع المزايا" 
              : "أنشئ حسابك الآن واستمتع بتجربة تسوق مميزة"
            }
          </p>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="البريد الإلكتروني"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="w-full h-12 text-right"
              dir="rtl"
            />
          </div>

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="كلمة المرور"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className="w-full h-12 text-right pr-12"
              dir="rtl"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-3 top-1/2 transform -translate-y-1/2"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5 text-gray-400" />
              ) : (
                <Eye className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>

          {!isLogin && (
            <div>
              <Input
                type="password"
                placeholder="تأكيد كلمة المرور"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                className="w-full h-12 text-right"
                dir="rtl"
              />
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {loading 
              ? "جاري المعالجة..." 
              : isLogin 
                ? "تسجيل الدخول" 
                : "إنشاء الحساب"
            }
          </Button>
        </form>

        {/* Toggle Auth Mode */}
        <div className="text-center mt-6">
          <p className="text-gray-600">
            {isLogin ? "ليس لديك حساب؟" : "لديك حساب بالفعل؟"}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary font-medium mr-2 hover:underline"
            >
              {isLogin ? "إنشاء حساب جديد" : "تسجيل الدخول"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;