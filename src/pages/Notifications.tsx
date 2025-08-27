import { ArrowLeft, Package, Truck, ShoppingCart, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Notifications = () => {
  const notifications = [
    {
      id: 1,
      type: "order",
      title: "تم تأكيد طلبك",
      message: "تم تأكيد طلب رقم #12345 وسيتم شحنه قريباً",
      time: "منذ دقيقتين",
      icon: <Package className="w-5 h-5" />,
      read: false
    },
    {
      id: 2,
      type: "shipping",
      title: "طلبك في الطريق",
      message: "طلب رقم #12344 خرج للتوصيل وسيصل خلال ساعة",
      time: "منذ ساعة",
      icon: <Truck className="w-5 h-5" />,
      read: false
    },
    {
      id: 3,
      type: "cart",
      title: "عناصر في سلة المشتريات",
      message: "لديك 3 عناصر في سلة المشتريات منتظرة الإتمام",
      time: "منذ يوم",
      icon: <ShoppingCart className="w-5 h-5" />,
      read: true
    },
    {
      id: 4,
      type: "message",
      title: "رسالة من خدمة العملاء",
      message: "تم الرد على استفسارك حول المنتج",
      time: "منذ يومين",
      icon: <MessageCircle className="w-5 h-5" />,
      read: true
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 rtl">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <div className="w-6"></div>
          <h1 className="text-lg font-medium">الإشعارات</h1>
          <Link to="/">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </Link>
        </div>
      </header>

      <div className="p-4 pb-32">
        {notifications.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">لا توجد إشعارات</h3>
            <p className="text-gray-600">ستظهر إشعاراتك هنا عند وصولها</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-xl p-4 shadow-sm border-r-4 ${
                  notification.read 
                    ? 'border-r-gray-200' 
                    : 'border-r-primary'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${
                    notification.read ? 'bg-gray-100' : 'bg-primary/10'
                  }`}>
                    <div className={
                      notification.read ? 'text-gray-600' : 'text-primary'
                    }>
                      {notification.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`font-medium ${
                        notification.read ? 'text-gray-900' : 'text-gray-900'
                      }`}>
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-2">
                      {notification.message}
                    </p>
                    <span className="text-xs text-gray-400">
                      {notification.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;