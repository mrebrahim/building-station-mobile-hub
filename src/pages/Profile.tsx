import { useEffect, useState } from "react";
import { ArrowLeft, HelpCircle, Users, LogOut, LogIn, User, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import HelpButton from "@/components/HelpButton";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import BottomNavigation from "@/components/BottomNavigation";

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ جلب الـ session الحالية
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // ✅ الاستماع لتغييرات الـ auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('تم تسجيل الخروج بنجاح');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 rtl pb-24">
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

      <div className="p-4">
        {user ? (
          /* ✅ المستخدم مسجّل دخول */
          <>
            {/* بيانات المستخدم */}
            <div className="bg-white rounded-2xl p-6 mb-4 shadow-sm text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-10 h-10 text-red-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-1">
                {user.user_metadata?.first_name
                  ? `${user.user_metadata.first_name} ${user.user_metadata.last_name || ''}`
                  : 'مرحباً بك!'}
              </h2>
              <div className="flex items-center justify-center gap-2 text-gray-500 text-sm mt-2">
                <Mail className="w-4 h-4" />
                <span>{user.email}</span>
              </div>
              {user.user_metadata?.phone && (
                <div className="flex items-center justify-center gap-2 text-gray-500 text-sm mt-1">
                  <Phone className="w-4 h-4" />
                  <span>{user.user_metadata.phone}</span>
                </div>
              )}
            </div>

            {/* خيارات الحساب */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm mb-4">
              <Link to="/faq" className="flex items-center justify-between p-4 border-b border-gray-100 active:bg-gray-50">
                <ArrowLeft className="w-5 h-5 text-gray-400" />
                <div className="flex items-center gap-3">
                  <span className="font-medium">الأسئلة الشائعة</span>
                  <HelpCircle className="w-5 h-5 text-gray-600" />
                </div>
              </Link>
              <Link to="/about-us" className="flex items-center justify-between p-4 active:bg-gray-50">
                <ArrowLeft className="w-5 h-5 text-gray-400" />
                <div className="flex items-center gap-3">
                  <span className="font-medium">من نحن</span>
                  <Users className="w-5 h-5 text-gray-600" />
                </div>
              </Link>
            </div>

            {/* زرار تسجيل الخروج */}
            <Button
              onClick={handleLogout}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-xl text-base font-bold"
            >
              <LogOut className="w-5 h-5 ml-2" />
              تسجيل الخروج
            </Button>
          </>
        ) : (
          /* ✅ المستخدم غير مسجّل */
          <>
            <div className="text-center mb-8 mt-4">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-12 h-12 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2">مرحبا أيها الزائر!</h2>
              <p className="text-gray-600">سجّل دخولك للاستمتاع بجميع المزايا</p>
            </div>

            <div className="mb-4">
              <Link to="/auth">
                <Button className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-xl text-lg font-bold">
                  <LogIn className="w-5 h-5 ml-2" />
                  تسجيل الدخول / الاشتراك
                </Button>
              </Link>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden shadow-sm mb-4">
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
          </>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Profile;
