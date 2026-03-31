import { useState } from "react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
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
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
  });
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const createWooCommerceCustomer = async (email: string, firstName: string, lastName: string, phone: string) => {
    try {
      await supabase.functions.invoke('create-woocommerce-customer', {
        body: { email, firstName, lastName, phone }
      });
    } catch (err) {
      console.error('WooCommerce customer error:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (!formData.email || !formData.password) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    if (!isLogin && formData.password !== formData.confirmPassword) {
      toast.error('كلمتا المرور غير متطابقتين');
      return;
    }
    if (!isLogin && formData.password.length < 6) {
      toast.error('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (error) { toast.error('خطأ في تسجيل الدخول: ' + error.message); return; }
        createWooCommerceCustomer(formData.email, formData.firstName, formData.lastName, formData.phone);
        toast.success('تم تسجيل الدخول بنجاح!');
        navigate(redirectTo);
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              first_name: formData.firstName,
              last_name: formData.lastName,
              phone: formData.phone,
            }
          }
        });
        if (error) { toast.error('خطأ في إنشاء الحساب: ' + error.message); return; }
        if (data.user) {
          await createWooCommerceCustomer(formData.email, formData.firstName, formData.lastName, formData.phone);
        }
        toast.success('تم إنشاء الحساب بنجاح!');
        navigate(redirectTo);
      }
    } catch (error) {
      toast.error('حدث خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 rtl">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <div className="w-6"></div>
          <h1 className="text-lg font-medium">
            {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
          </h1>
          <Link to="/profile">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </Link>
        </div>
      </header>

      <div className="p-6">
        <div className="text-center mb-8">
          <div className="w-24 h-24 flex items-center justify-center mx-auto mb-4 rounded-full overflow-hidden bg-white shadow-lg">
            <img src="/lovable-uploads/affbbcc3-4fa8-45ef-839a-50be03b7a27c.png" alt="Building Station" className="w-20 h-20 object-contain" />
          </div>
          <h2 className="text-2xl font-bold mb-2">{isLogin ? 'مرحباً بعودتك!' : 'انضم إلينا'}</h2>
          <p className="text-gray-600">{isLogin ? 'سجل دخولك للاستمتاع بجميع المزايا' : 'أنشئ حسابك الآن واستمتع بتجربة تسوق مميزة'}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="grid grid-cols-2 gap-3">
              <Input type="text" placeholder="الاسم الأول" value={formData.firstName} onChange={(e) => handleInputChange('firstName', e.target.value)} className="h-12 text-right" dir="rtl" />
              <Input type="text" placeholder="اسم العائلة" value={formData.lastName} onChange={(e) => handleInputChange('lastName', e.target.value)} className="h-12 text-right" dir="rtl" />
            </div>
          )}

          <Input type="email" placeholder="البريد الإلكتروني" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} className="w-full h-12 text-right" dir="rtl" />

          {!isLogin && (
            <Input type="tel" placeholder="رقم الهاتف (اختياري)" value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} className="w-full h-12 text-right" dir="rtl" />
          )}

          <div className="relative">
            <Input type={showPassword ? 'text' : 'password'} placeholder="كلمة المرور" value={formData.password} onChange={(e) => handleInputChange('password', e.target.value)} className="w-full h-12 text-right pr-12" dir="rtl" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-3 top-1/2 transform -translate-y-1/2">
              {showPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
            </button>
          </div>

          {!isLogin && (
            <Input type="password" placeholder="تأكيد كلمة المرور" value={formData.confirmPassword} onChange={(e) => handleInputChange('confirmPassword', e.target.value)} className="w-full h-12 text-right" dir="rtl" />
          )}

          <Button type="submit" disabled={loading} className="w-full h-12 bg-red-500 hover:bg-red-600 text-white font-bold text-base">
            {loading ? 'جاري المعالجة...' : isLogin ? 'تسجيل الدخول' : 'إنشاء الحساب'}
          </Button>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-600">
            {isLogin ? 'ليس لديك حساب؟' : 'لديك حساب بالفعل؟'}
            <button onClick={() => setIsLogin(!isLogin)} className="text-red-500 font-medium mr-2 hover:underline">
              {isLogin ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
