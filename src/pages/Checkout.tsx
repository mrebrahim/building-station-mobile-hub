
import { useState, useEffect } from "react";
import CheckoutHeader from "@/components/checkout/CheckoutHeader";
import OrderSummaryCard from "@/components/checkout/OrderSummaryCard";
import ContactInformation from "@/components/checkout/ContactInformation";
import DeliveryInformation from "@/components/checkout/DeliveryInformation";
import ShippingMethod from "@/components/checkout/ShippingMethod";
import PaymentMethod from "@/components/checkout/PaymentMethod";
import OrderSummaryDetail from "@/components/checkout/OrderSummaryDetail";
import CheckoutFooter from "@/components/checkout/CheckoutFooter";

const Checkout = () => {
  const [formData, setFormData] = useState({
    email: "",
    country: "العراق",
    firstName: "",
    lastName: "",
    street: "",
    city: "",
    postalCode: "",
    phone: "",
    paymentMethod: "credit",
    codPayment: false
  });

  const [orderSummary, setOrderSummary] = useState({
    items: [] as any[],
    subtotal: 0,
    shipping: 0,
    total: 0
  });

  useEffect(() => {
    // Load cart items from localStorage for checkout
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const subtotal = savedCart.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
    
    setOrderSummary({
      items: savedCart,
      subtotal: subtotal,
      shipping: 0,
      total: subtotal
    });
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log("Order submitted:", formData);
    // Handle order submission
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

        <ShippingMethod />

        <PaymentMethod 
          codPayment={formData.codPayment}
          onCodPaymentChange={(value) => handleInputChange("codPayment", value)}
        />

        <OrderSummaryDetail 
          items={orderSummary.items}
          subtotal={orderSummary.subtotal}
          total={orderSummary.total}
        />

        <CheckoutFooter onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default Checkout;
