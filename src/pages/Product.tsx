
import { ArrowLeft, Heart, Share, ChevronLeft, ChevronRight, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  // Sample product data - in a real app this would come from an API
  const product = {
    id: 1,
    name: "نظارات حماية يوفكس أستروسبك 2.0",
    brand: "uvex",
    price: 12500,
    sku: "9164246",
    availability: "متوفر",
    description: "نظارات يوفكس أستروسبك 2.0 توفر حماية فائقة للعينين بتصميم عصري وخفيف الوزن يناسب الاستخدام الصناعي والمخبري.",
    images: [
      "/placeholder.svg",
      "/placeholder.svg"
    ],
    specifications: [
      "Material: High quality",
      "PVC",
      "Size available: L",
      "Weight: 120-130g/ pair",
      "Use for gardener, cleaner etc",
      "Packaging"
    ]
  };

  const relatedProducts = [
    {
      id: 2,
      name: "Latex Gloves",
      brand: "INGCO العلامة التجارية",
      price: 2250,
      image: "/placeholder.svg"
    },
    {
      id: 3,
      name: "Knitted & PVC Dots XL Gloves",
      brand: "INGCO العلامة التجارية", 
      price: 1000,
      image: "/placeholder.svg"
    }
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const handleAddToCart = () => {
    // Get existing cart from localStorage
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if product already exists in cart
    const existingItemIndex = existingCart.findIndex((item: any) => item.id === product.id);
    
    if (existingItemIndex >= 0) {
      // Update quantity if product exists
      existingCart[existingItemIndex].quantity += quantity;
    } else {
      // Add new product to cart
      existingCart.push({
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        quantity: quantity,
        image: product.images[0]
      });
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(existingCart));
    
    toast({
      title: "تم إضافة المنتج",
      description: `تم إضافة ${product.name} إلى السلة`,
    });
  };

  const handleQuantityChange = (change: number) => {
    setQuantity(Math.max(1, quantity + change));
  };

  return (
    <div className="min-h-screen bg-gray-50 rtl">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Share className="w-6 h-6 text-gray-600" />
            <Heart 
              className={`w-6 h-6 cursor-pointer ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-600'}`}
              onClick={() => setIsFavorite(!isFavorite)}
            />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-black text-white px-3 py-1 rounded-full text-sm">
              عرض السلة
            </div>
            <div className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm">
              عرض قائمة طلب الأسعار
            </div>
          </div>
          
          <Link to="/">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </Link>
        </div>
      </header>

      <div className="pb-32">
        {/* Image Carousel */}
        <div className="relative bg-white">
          <div className="relative h-80 overflow-hidden">
            <img 
              src={product.images[currentImageIndex]} 
              alt={product.name}
              className="w-full h-full object-contain"
            />
            
            {/* Image navigation */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {product.images.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full ${index === currentImageIndex ? 'bg-black' : 'bg-gray-300'}`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
            
            {/* Image counter */}
            <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-sm">
              {currentImageIndex + 1}/{product.images.length}
            </div>
            
            {/* Pause button */}
            <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full">
              <div className="w-2 h-2 bg-white"></div>
              <div className="w-2 h-2 bg-white mt-1"></div>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="bg-white p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">رمز المنتج: {product.sku}</span>
            <img src="/placeholder.svg" alt={product.brand} className="h-8" />
          </div>
          
          <h1 className="text-xl font-bold mb-2">{product.name}</h1>
          
          <div className="flex items-center justify-between mb-4">
            <span className="text-green-600 text-sm font-medium">{product.availability}</span>
            <span className="text-2xl font-bold">IQD {product.price.toLocaleString()}</span>
          </div>
          
          <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
          
          <button className="text-blue-500 text-sm mt-2">اقرأ المزيد</button>
        </div>

        {/* Specifications */}
        <div className="bg-white p-4 mb-4">
          <h3 className="text-lg font-bold mb-4">الوصف</h3>
          <div className="space-y-2">
            {product.specifications.map((spec, index) => (
              <div key={index} className="flex items-center">
                <span className="text-gray-600">• {spec}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Related Products */}
        <div className="bg-white p-4">
          <h3 className="text-lg font-bold mb-4 text-center">منتجات ذات صلة</h3>
          <div className="grid grid-cols-2 gap-4">
            {relatedProducts.map((relatedProduct) => (
              <div key={relatedProduct.id} className="border border-gray-200 rounded-xl p-3">
                <div className="relative mb-3">
                  <img src={relatedProduct.image} alt={relatedProduct.name} className="w-full h-32 object-contain" />
                  <Heart className="absolute top-2 right-2 w-5 h-5 text-gray-400" />
                  <div className="absolute bottom-2 left-2 w-8 h-8 bg-black rounded-full flex items-center justify-center">
                    <Plus className="w-4 h-4 text-white" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mb-1">{relatedProduct.brand}</p>
                <h4 className="text-sm font-medium mb-2">{relatedProduct.name}</h4>
                <p className="text-lg font-bold">IQD {relatedProduct.price.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Add to Cart Section */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="text-lg font-medium px-3">{quantity}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuantityChange(1)}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <span className="text-sm text-gray-500">العدد</span>
        </div>
        
        <Button 
          className="w-full bg-black text-white py-3 text-lg font-medium"
          onClick={handleAddToCart}
        >
          <div className="flex items-center justify-between w-full">
            <span>إضافة المنتج</span>
            <span>IQD {(product.price * quantity).toLocaleString()}</span>
          </div>
        </Button>
      </div>
    </div>
  );
};

export default Product;
