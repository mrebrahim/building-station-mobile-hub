
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import CheckoutHeader from "@/components/checkout/CheckoutHeader";
import OrderSummaryCard from "@/components/checkout/OrderSummaryCard";
import ContactInformation from "@/components/checkout/ContactInformation";
import DeliveryInformation from "@/components/checkout/DeliveryInformation";
import OrderSummaryDetail from "@/components/checkout/OrderSummaryDetail";
import CheckoutFooter from "@/components/checkout/CheckoutFooter";
import { wooCommerceService } from "@/services/woocommerce/index";
import { supabase } from "@/integrations/supabase/client";
import { checkoutSchema } from "@/lib/validation";

const Checkout = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    // Load cart items from localStorage for checkout
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const subtotal = savedCart.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
    
    // Check if cart contains courses and user is not authenticated
    const hasCourses = savedCart.some((item: any) => item.type === 'course');
    
    if (hasCourses) {
      // Check authentication status
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!session) {
          toast.error('يجب تسجيل الدخول لشراء الكورسات');
          navigate('/auth?redirect=/checkout');
          return;
        }
      });
    }
    
    setOrderSummary({
      items: savedCart,
      subtotal: subtotal,
      shipping: 0,
      discount: 0,
      appliedCoupon: "",
      total: subtotal
    });
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDiscountApply = (discountAmount: number, couponCode: string) => {
    const newTotal = orderSummary.subtotal - discountAmount;
    setOrderSummary(prev => ({
      ...prev,
      discount: discountAmount,
      appliedCoupon: couponCode,
      total: newTotal
    }));
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    // Validate input using zod schema
    const validation = checkoutSchema.safeParse(formData);
    
    if (!validation.success) {
      const error = validation.error.errors[0];
      toast.error(error.message);
      return;
    }
    
    if (orderSummary.items.length === 0) {
      toast.error("السلة فارغة");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare order data for WooCommerce
      const orderData = {
        payment_method: "cod",
        payment_method_title: "الدفع عند الاستلام",
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
      
      console.log("Creating WooCommerce order:", orderData);
      
      // Create order through WooCommerce API
      const response = await wooCommerceService.createOrder(orderData);
      
      console.log("WooCommerce order response:", response);
      
      if (response && response.id) {
        toast.success("تم إنشاء الطلب بنجاح!");
        
        // Check if there are any courses in the order and enroll the user
        const hasCourses = orderSummary.items.some(item => item.type === 'course');
        
        if (hasCourses) {
          // Verify user is authenticated before enrolling
          const { data: { session } } = await supabase.auth.getSession();
          
          if (!session) {
            toast.error('يجب تسجيل الدخول لشراء الكورسات');
            navigate('/auth?redirect=/checkout');
            return;
          }

          console.log('📚 Enrolling user in courses...');
          
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
            
            if (error) {
              console.error('❌ Enrollment error:', error);
              toast.error('تم إنشاء الطلب لكن حدث خطأ في تسجيل الكورسات');
            } else if (data?.success) {
              console.log('✅ Enrollment successful:', data);
              if (data.enrolled > 0) {
                toast.success(`✅ تم تسجيلك في ${data.enrolled} كورس بنجاح!`);
              }
            }
          } catch (enrollError: any) {
            console.error('❌ Course enrollment exception:', enrollError);
            if (enrollError?.message?.includes('AUTH_REQUIRED')) {
              toast.error('انتهت جلستك. يرجى تسجيل الدخول مرة أخرى');
              navigate('/auth?redirect=/checkout');
            } else {
              toast.error('حدث خطأ في تسجيل الكورسات');
            }
          }
        }
        
        // Clear cart
        localStorage.removeItem('cart');
        window.dispatchEvent(new Event('cartUpdated'));
        
        // Redirect to success page or order confirmation
        setTimeout(() => {
          if (hasCourses) {
            navigate('/my-courses');
          } else {
            navigate('/');
          }
        }, 2000);
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
