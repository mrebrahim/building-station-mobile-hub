
import { ArrowLeft, Heart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Cart = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);

  useEffect(() => {
    // Load cart items from localStorage
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(savedCart);
  }, []);

  const removeItem = (id: number) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const updateQuantity = (id: number, quantity: number) => {
    const updatedCart = cartItems.map(item => 
      item.id === id ? { ...item, quantity } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-gray-50 rtl">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <Heart className="w-6 h-6 text-gray-400" />
          
          <div className="flex items-center gap-2">
            <span className="text-lg font-medium">السلة</span>
            <span className="text-sm text-gray-500">({cartItems.length} عناصر)</span>
          </div>
          
          <Link to="/">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </Link>
        </div>
      </header>

      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-xl font-medium text-gray-600 mb-2">السلة فارغة</h2>
          <p className="text-gray-500 mb-6">لا توجد منتجات في السلة</p>
          <Link to="/">
            <Button>تصفح المنتجات</Button>
          </Link>
        </div>
      ) : (
        <div className="p-4 pb-32">
          {/* Cart Items */}
          <div className="space-y-4 mb-6">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-3xl">🧤</div>
                  </div>
                  
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">{item.brand}</p>
                    <h3 className="font-medium mb-2">{item.name}</h3>
                    <p className="text-lg font-bold">IQD {item.price.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 border-red-200"
                  >
                    <Trash2 className="w-4 h-4 ml-2" />
                    إزالة
                  </Button>
                  
                  <Select 
                    value={item.quantity.toString()} 
                    onValueChange={(value) => updateQuantity(item.id, parseInt(value))}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Checkout Bar */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-black text-white p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-lg font-medium">إتمام الشراء</span>
            <ArrowLeft className="w-5 h-5" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold">IQD {total.toLocaleString()}</span>
            <span className="text-sm text-gray-300">{cartItems.length} عناصر</span>
          </div>
          <Link to="/checkout">
            <Button className="w-full mt-3 bg-white text-black hover:bg-gray-100">
              إتمام الشراء
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Cart;
