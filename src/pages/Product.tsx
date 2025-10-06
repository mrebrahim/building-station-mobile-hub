import { ArrowLeft, Heart, Share, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { wooCommerceService } from "@/services/woocommerce";

const Product = () => {
  const { id } = useParams();
  const { toast } = useToast();
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Fetch product data from WooCommerce
  const { data: product, isLoading: productLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => wooCommerceService.getProduct(parseInt(id!)),
    enabled: !!id,
  });

  // Fetch related products
  const { data: relatedProducts = [] } = useQuery({
    queryKey: ['related-products', product?.categories?.[0]?.id],
    queryFn: () => wooCommerceService.getProducts({ 
      per_page: 4, 
      category: product?.categories?.[0]?.id?.toString(),
      exclude: [product?.id]
    }),
    enabled: !!product?.categories?.[0]?.id,
  });

  // Check if product is in favorites when product loads
  useEffect(() => {
    if (product) {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      const isProductFavorite = favorites.some((fav: any) => fav.id === product.id);
      setIsFavorite(isProductFavorite);
    }
  }, [product]);

  const toggleFavorite = () => {
    if (!product) return;
    
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    if (isFavorite) {
      // Remove from favorites
      const updatedFavorites = favorites.filter((fav: any) => fav.id !== product.id);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      setIsFavorite(false);
      toast({
        title: "تم الحذف",
        description: `تم حذف ${product.name} من المفضلة`,
      });
    } else {
      // Add to favorites
      const favoriteProduct = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0]?.src || '',
        brand: product.categories?.[0]?.name || 'غير محدد'
      };
      favorites.push(favoriteProduct);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      setIsFavorite(true);
      toast({
        title: "تم الإضافة",
        description: `تم إضافة ${product.name} إلى المفضلة`,
      });
    }
  };

  if (productLoading) {
    return (
      <div className="min-h-screen bg-gray-50 rtl">
        <header className="bg-white shadow-sm sticky top-0 z-50">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-gray-200 px-3 py-1 rounded-full text-sm animate-pulse h-8 w-20"></div>
            </div>
            <Link to="/">
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </Link>
          </div>
        </header>
        <div className="p-4">
          <div className="bg-white rounded-xl p-4 animate-pulse">
            <div className="h-80 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-6 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 rtl flex items-center justify-center p-4">
        <div className="text-center">
          <div className="mb-6">
            <span className="text-8xl">📦</span>
          </div>
          <h2 className="text-2xl font-bold mb-3 text-gray-800">المنتج غير موجود</h2>
          <p className="text-gray-600 mb-6">عذراً، لا يمكن العثور على هذا المنتج</p>
          <Link to="/">
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 text-lg rounded-lg">
              العودة للرئيسية
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItemIndex = existingCart.findIndex((item: any) => item.id === product.id);
    
    if (existingItemIndex >= 0) {
      existingCart[existingItemIndex].quantity += quantity;
    } else {
      existingCart.push({
        id: product.id,
        name: product.name,
        brand: product.categories?.[0]?.name || 'غير محدد',
        price: parseFloat(product.price) || 0,
        quantity: quantity,
        image: product.images?.[0]?.src || ''
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(existingCart));
    
    toast({
      title: "تم إضافة المنتج",
      description: `تم إضافة ${product.name} إلى السلة`,
    });
  };

  const handleQuantityChange = (change: number) => {
    setQuantity(Math.max(1, quantity + change));
  };

  const productPrice = parseFloat(product.price) || 0;
  const productImages = product.images || [];

  return (
    <div className="min-h-screen bg-gray-50 rtl">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Share className="w-6 h-6 text-gray-600" />
            <Heart 
              className={`w-6 h-6 cursor-pointer ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-600'}`}
              onClick={toggleFavorite}
            />
          </div>
          
          <div className="flex items-center gap-4">
            <Link to="/cart" className="bg-black text-white px-3 py-1 rounded-full text-sm">
              عرض السلة
            </Link>
            <Link to="/favorites" className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm">
              عرض المفضلة
            </Link>
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
            {productImages.length > 0 ? (
              <img 
                src={productImages[currentImageIndex]?.src} 
                alt={productImages[currentImageIndex]?.alt || product.name}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <span className="text-6xl">📦</span>
              </div>
            )}
            
            {/* Image navigation */}
            {productImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {productImages.map((_, index) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full ${index === currentImageIndex ? 'bg-black' : 'bg-gray-300'}`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            )}
            
            {/* Image counter */}
            {productImages.length > 1 && (
              <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-sm">
                {currentImageIndex + 1}/{productImages.length}
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="bg-white p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">رمز المنتج: {product.sku || product.id}</span>
            {product.categories && product.categories.length > 0 && (
              <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                {product.categories[0].name}
              </span>
            )}
          </div>
          
          <h1 className="text-xl font-bold mb-2" dangerouslySetInnerHTML={{ __html: product.name }}></h1>
          
          <div className="flex items-center justify-between mb-4">
            <span className={`text-sm font-medium ${product.stock_status === 'instock' ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock_status === 'instock' ? 'متوفر' : 'غير متوفر'}
            </span>
            <span className="text-2xl font-bold">
              {productPrice > 0 ? `IQD ${productPrice.toLocaleString()}` : 'اتصل للسعر'}
            </span>
          </div>
          
          {product.short_description && (
            <div 
              className="text-gray-600 text-sm leading-relaxed mb-2"
              dangerouslySetInnerHTML={{ __html: product.short_description }}
            />
          )}
          
          {product.description && !showFullDescription && (
            <button 
              onClick={() => setShowFullDescription(true)}
              className="text-blue-500 text-sm mt-2 hover:text-blue-600 transition-colors"
            >
              اقرأ المزيد
            </button>
          )}
        </div>

        {/* Full Description */}
        {product.description && showFullDescription && (
          <div className="bg-white p-4 mb-4">
            <h3 className="text-lg font-bold mb-4">الوصف التفصيلي</h3>
            <div 
              className="text-gray-600 text-sm leading-relaxed mb-4"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
            <button 
              onClick={() => setShowFullDescription(false)}
              className="text-blue-500 text-sm hover:text-blue-600 transition-colors"
            >
              إخفاء
            </button>
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="bg-white p-4">
            <h3 className="text-lg font-bold mb-4 text-center">منتجات ذات صلة</h3>
            <div className="grid grid-cols-2 gap-4">
              {relatedProducts.slice(0, 4).map((relatedProduct) => (
                <Link key={relatedProduct.id} to={`/product/${relatedProduct.id}`}>
                  <div className="border border-gray-200 rounded-xl p-3">
                    <div className="relative mb-3">
                      {relatedProduct.images && relatedProduct.images.length > 0 ? (
                        <img 
                          src={relatedProduct.images[0].src} 
                          alt={relatedProduct.images[0].alt || relatedProduct.name}
                          className="w-full h-32 object-contain" 
                        />
                      ) : (
                        <div className="w-full h-32 bg-gray-100 flex items-center justify-center">
                          <span className="text-3xl">📦</span>
                        </div>
                      )}
                      <Heart className="absolute top-2 right-2 w-5 h-5 text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-500 mb-1">
                      {relatedProduct.categories?.[0]?.name || 'غير محدد'}
                    </p>
                    <h4 className="text-sm font-medium mb-2" dangerouslySetInnerHTML={{ __html: relatedProduct.name }}></h4>
                    <p className="text-lg font-bold">
                      {relatedProduct.price ? `IQD ${parseInt(relatedProduct.price).toLocaleString()}` : 'اتصل للسعر'}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Add to Cart Section */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-300 p-4 shadow-[0_-4px_12px_rgba(0,0,0,0.1)] z-50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
              className="h-10 w-10 rounded-full border-2 border-gray-300 hover:border-black hover:bg-gray-50"
            >
              <Minus className="w-5 h-5" />
            </Button>
            <span className="text-xl font-bold px-4 min-w-[3rem] text-center">{quantity}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuantityChange(1)}
              className="h-10 w-10 rounded-full border-2 border-gray-300 hover:border-black hover:bg-gray-50"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>
          <span className="text-base font-semibold text-gray-700">الكمية</span>
        </div>
        
        <Button 
          className="w-full bg-black hover:bg-gray-800 text-white py-4 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleAddToCart}
          disabled={product.stock_status !== 'instock'}
        >
          <div className="flex items-center justify-between w-full px-2">
            <span className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              {product.stock_status === 'instock' ? 'إضافة إلى السلة' : 'غير متوفر'}
            </span>
            <span className="font-bold">
              {productPrice > 0 ? `${(productPrice * quantity).toLocaleString()} IQD` : 'اتصل للسعر'}
            </span>
          </div>
        </Button>
      </div>
    </div>
  );
};

export default Product;
