import { useState } from "react";
import { ArrowRight, Search, Package, Clock, CheckCircle, XCircle, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import BottomNavigation from "@/components/BottomNavigation";
import { wcFetch } from "@/lib/wooProxy";

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  pending:    { label: "قيد الانتظار", color: "text-yellow-600 bg-yellow-50", icon: Clock },
  processing: { label: "جاري التجهيز", color: "text-blue-600 bg-blue-50",   icon: Package },
  on_hold:    { label: "معلّق",         color: "text-gray-600 bg-gray-100",   icon: Clock },
  completed:  { label: "مكتمل",         color: "text-green-600 bg-green-50",  icon: CheckCircle },
  cancelled:  { label: "ملغى",          color: "text-red-600 bg-red-50",      icon: XCircle },
  shipped:    { label: "تم الشحن",       color: "text-purple-600 bg-purple-50",icon: Truck },
};

const Orders = () => {
  const [email, setEmail] = useState("");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const navigate = useNavigate();

  const searchOrders = async () => {
    if (!email.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const data = await wcFetch<any[]>('orders', {
        search: email,
        per_page: 20,
        orderby: 'date',
        order: 'desc',
      });
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatus = (status: string) => statusConfig[status] || { label: status, color: "text-gray-600 bg-gray-100", icon: Package };

  return (
    <div className="min-h-screen bg-gray-50 rtl pb-24">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center">
            <ArrowRight className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-lg font-bold text-gray-800">طلباتي</h1>
          <div className="w-9" />
        </div>
      </header>

      <div className="p-4">
        {/* Search */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
          <p className="text-sm text-gray-600 mb-3 text-right">ادخل بريدك الإلكتروني لعرض طلباتك</p>
          <div className="flex gap-2">
            <Button
              onClick={searchOrders}
              disabled={loading || !email.trim()}
              className="bg-red-500 hover:bg-red-600 text-white px-4 shrink-0"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </Button>
            <Input
              type="email"
              placeholder="البريد الإلكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && searchOrders()}
              className="flex-1 text-right h-10"
              dir="rtl"
            />
          </div>
        </div>

        {/* Results */}
        {!searched ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-500 text-base">ابحث بالبريد الإلكتروني لعرض طلباتك</p>
          </div>
        ) : loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3 ml-auto mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2 ml-auto mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/4 ml-auto" />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-700 font-medium text-lg mb-2">لا توجد طلبات</p>
            <p className="text-gray-500 text-sm">لم نجد أي طلبات لهذا البريد الإلكتروني</p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-gray-500 text-right mb-2">{orders.length} طلب</p>
            {orders.map((order) => {
              const status = getStatus(order.status);
              const StatusIcon = status.icon;
              return (
                <div key={order.id} className="bg-white rounded-2xl p-4 shadow-sm">
                  {/* Header Row */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${status.color}`}>
                      <StatusIcon className="w-3 h-3" />
                      {status.label}
                    </span>
                    <span className="text-base font-bold text-gray-800">طلب #{order.id}</span>
                  </div>

                  {/* Items */}
                  {order.line_items?.length > 0 && (
                    <div className="mb-3 text-right">
                      {order.line_items.slice(0, 2).map((item: any) => (
                        <p key={item.id} className="text-sm text-gray-600">
                          {item.name} × {item.quantity}
                        </p>
                      ))}
                      {order.line_items.length > 2 && (
                        <p className="text-xs text-gray-400">+{order.line_items.length - 2} منتجات أخرى</p>
                      )}
                    </div>
                  )}

                  {/* Footer Row */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <p className="text-sm text-gray-400">
                      {new Date(order.date_created).toLocaleDateString('ar-EG')}
                    </p>
                    <p className="text-base font-bold text-red-500">
                      {parseFloat(order.total).toLocaleString()} {order.currency}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Orders;
