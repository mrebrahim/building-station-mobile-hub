
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import CheckoutHeader from "@/components/checkout/CheckoutHeader";
import OrderSummaryCard from "@/components/checkout/OrderSummaryCard";
import ContactInformation from "@/components/checkout/ContactInformation";
import DeliveryInformation from "@/components/checkout/DeliveryInformation";
import OrderSummaryDetail from "@/components/checkout/OrderSummaryDetail";
import CheckoutFooter from "@/components/checkout/CheckoutFooter";
import PaymentMethod from "@/components/checkout/PaymentMethod";
import { wooCommerceService } from "@/services/woocommerce/index";
import { supabase } from "@/integrations/supabase/client";
import { checkoutSchema } from "@/lib/validation";

const WOOCOMMERCE_URL = "https://building-station.com";

const Checkout = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("qicard");
  const [formData, setFormData] = useState({
    email: "",
    country: "العراق",
    firstName: "",
    lastName: "",
    street: "",
    city: "",
    postalCode: "",
    phone: ""
  });

  const [orderSummary, setOrderSummary] = useState({
    items: [] as any[],
    subtotal: 0,
    shipping: 0,
    discount: 0,
    appliedCoupon: "",
    total: 0
  });

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const subtotal = savedCart.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
    const hasCourses = savedCart.some((item: any) => item.type === 'course');
    if (hasCourses) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!session) {
          toast.error('يجب تسجيل الدخول لشراء الكورسات');
          navigate('/auth?redirect=/checkout');
          return;
        }
      });
    }
    setOrderSummary({ items: savedCart, subtotal, shipping: 0, discount: 0, appliedCoupon: "", total: subtotal });
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDiscountApply = (discountAmount: number, couponCode: string) => {
    setOrderSummary(prev => ({
      ...prev,
      discount: discountAmount,
      appliedCoupon: couponCode,
      total: prev.subtotal - discountAmount
    }));
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    const validation = checkoutSchema.safeParse(formData);
    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      return;
    }

    if (orderSummary.items.length === 0) {
      toast.error("السلة فارغة");
      return;
    }

    setIsSubmitting(true);

    try {
      const isQiCard = paymentMethod === "qicard";

      const orderData = {
        payment_method: isQiCard ? "qicard" : "cod",
        payment_method_title: isQiCard ? "QiCard" : "الدفع عند الاستلام",
        set_paid: false,
        billing: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          address_1: formData.street,
          city: formData.city,
          state: "",
          postcode: formData.postalCode,
          country: "IQ",
          email: formData.email,
          phone: formData.phone
        },
        shipping: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          address_1: formData.street,
          city: formData.city,
          state: "",
          postcode: formData.postalCode,
          country: "IQ"
        },
        line_items: orderSummary.items.map(item => ({
          product_id: item.id,
          quantity: item.quantity
        }))
      };

      const response = await wooCommerceService.createOrder(orderData);

      if (response && response.id) {
        // ✅ لو QiCard - وجّه لصفحة الدفع
        if (isQiCard) {
          toast.success("تم إنشاء الطلب! جاري التوجه لصفحة الدفع...");
          localStorage.removeItem('cart');
          window.dispatchEvent(new Event('cartUpdated'));
          
          // رابط الدفع من WooCommerce
          const paymentUrl = response.payment_url || 
            `${WOOCOMMERCE_URL}/checkout/order-pay/${response.id}/?pay_for_order=true&key=${response.order_key}`;
          
          // فتح صفحة الدفع في نفس النافذة (جوا WebView)
          window.location.href = paymentUrl;
          return;
        }

        // ✅ لو COD - كمّل العملية العادية
        toast.success("تم إنشاء الطلب بنجاح!");
        const hasCourses = orderSummary.items.some(item => item.type === 'course');

        if (hasCourses) {
          const { data: { session } } = await supabase.auth.getSession();
          if (!session) {
            toast.error('يجب تسجيل الدخول لشراء الكورسات');
            navigate('/auth?redirect=/checkout');
            return;
          }
          try {
            const { data, error } = await supabase.functions.invoke('enroll-courses', {
              body: {
                items: orderSummary.items.map(item => ({
                  ...item,
                  type: item.type || 'product',
                  course_id: item.course_id || item.id
                })),
                billing: {
                  first_name: formData.firstName,
                  last_name: formData.lastName,
                  email: formData.email,
                  phone: formData.phone,
                  address_1: formData.street,
                  city: formData.city,
                  country: 'IQ'
                },
                orderId: response.id
              }
            });
            if (data?.success && data.enrolled > 0) {
              toast.success(`✅ تم تسجيلك في ${data.enrolled} كورس بنجاح!`);
              const firstCourse = data.details?.find((d: any) => d.success && d.courseUrl);
              if (firstCourse?.courseUrl) window.open(firstCourse.courseUrl, '_blank');
            }
          } catch (e) {
            toast.error('حدث خطأ في تسجيل الكورسات');
          }
        }

        localStorage.removeItem('cart');
        window.dispatchEvent(new Event('cartUpdated'));
        setTimeout(() => navigate(hasCourses ? '/my-courses' : '/'), 2000);
      } else {
        toast.error("حدث خطأ في إنشاء الطلب");
      }
    } catch (error) {
      console.error("Order creation error:", error);
      toast.error("حدث خطأ في إنشاء الطلب. يرجى المحاولة مرة أخرى");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 rtl">
      <CheckoutHeader />
      <div className="p-4 pb-6">
        <OrderSummaryCard total={orderSummary.total} />
        <ContactInformation
          email={formData.email}
          onEmailChange={(email) => handleInputChange("email", email)}
        />
        <DeliveryInformation
          formData={formData}
          onInputChange={handleInputChange}
        />
        <PaymentMethod
          selectedMethod={paymentMethod}
          onMethodChange={setPaymentMethod}
        />
        <OrderSummaryDetail
          items={orderSummary.items}
          subtotal={orderSummary.subtotal}
          total={orderSummary.total}
          discount={orderSummary.discount}
          onDiscountApply={handleDiscountApply}
        />
        <CheckoutFooter onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
};

export default Checkout;
