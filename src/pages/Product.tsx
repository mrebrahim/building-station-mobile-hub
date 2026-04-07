import { ArrowRight, Share2, Heart, Plus, Minus, ShoppingCart, Zap, Barcode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { wooCommerceService } from "@/services/woocommerce";
import BottomNavigation from "@/components/BottomNavigation";

const Product = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => wooCommerceService.getProduct(parseInt(id!)),
    enabled: !!id,
  });

  const { data: relatedProducts = [] } = useQuery({
    queryKey: ['related-products', product?.categories?.[0]?.id],
    queryFn: () => wooCommerceService.getProducts({
      per_page: 4,
      category: product?.categories?.[0]?.id?.toString(),
      exclude: [product?.id]
    }),
    enabled: !!product?.categories?.[0]?.id,
  });

  useEffect(() => {
    if (product) {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      setIsFavorite(favorites.some((fav: any) => fav.id === product.id));
    }
  }, [product]);

  const toggleFavorite = () => {
    if (!product) return;
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (isFavorite) {
      localStorage.setItem('favorites', JSON.stringify(favorites.filter((f: any) => f.id !== product.id)));
      setIsFavorite(false);
    } else {
      favorites.push({ id: product.id, name: product.name, price: product.price, image: product.images?.[0]?.src || '' });
      localStorage.setItem('favorites', JSON.stringify(favorites));
      setIsFavorite(true);
    }
    window.dispatchEvent(new Event('favoritesUpdated'));
  };

  const handleAddToCart = () => {
    if (!product) return;
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const idx = cart.findIndex((i: any) => i.id === product.id);
    if (idx >= 0) {
      cart[idx].quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: parseFloat(product.price) || 0,
        quantity,
        image: product.images?.[0]?.src || ''
      });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    toast({ title: "✅ تم إضافة المنتج للسلة", description: product.name });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 rtl flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 rtl flex flex-col items-center justify-center p-4">
        <span className="text-6xl mb-4">📦</span>
        <h2 className="text-xl font-bold mb-2 text-gray-800">المنتج غير موجود</h2>
        <Link to="/"><Button className="mt-4 bg-red-500 text-white">العودة للرئيسية</Button></Link>
      </div>
    );
  }

  const price = parseFloat(product.price) || 0;
  const images = product.images || [];
  const sku = product.sku || `#${product.id}`;
  const inStock = product.stock_status === 'instock';

  return (
    <div className="min-h-screen bg-gray-50 rtl">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <Share2 className="w-5 h-5 text-gray-500 cursor-pointer" />
          <h1 className="text-base font-bold text-gray-800 flex-1 text-center px-2 truncate"
            dangerouslySetInnerHTML={{ __html: product.name }} />
          <button onClick={() => navigate(-1)} className="w-8 h-8 flex items-center justify-center">
            <ArrowRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </header>

      <div className="pb-32">
        {/* Image */}
        <div className="relative bg-white">
          <div className="relative h-72 overflow-hidden">
            {images.length > 0 ? (
              <img
                src={images[currentImageIndex]?.src}
                alt={images[currentImageIndex]?.alt || product.name}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <span className="text-6xl">📦</span>
              </div>
            )}

            {/* Favorite button */}
            <button
              onClick={toggleFavorite}
              className="absolute bottom-4 right-4 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center"
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
            </button>

            {/* Image dots */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1.5">
                {images.map((_, i) => (
                  <button key={i} onClick={() => setCurrentImageIndex(i)}
                    className={`w-2 h-2 rounded-full ${i === currentImageIndex ? 'bg-red-500' : 'bg-gray-300'}`} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="bg-white px-4 pt-4 pb-2 mt-2">
          {/* Name */}
          <h2 className="text-lg font-bold text-gray-800 text-right mb-1"
            dangerouslySetInnerHTML={{ __html: product.name }} />

          {/* Price */}
          <div className="flex items-center justify-end gap-2 mb-4">
            {product.regular_price && product.regular_price !== product.price && (
              <span className="text-sm text-gray-400 line-through">{parseFloat(product.regular_price).toLocaleString()}</span>
            )}
            <span className="text-xl font-bold text-cyan-500">
              {price > 0 ? `${price.toLocaleString()} IQD` : 'اتصل للسعر'}
            </span>
            <span className="text-sm text-gray-500">السعر شامل الضريبة</span>
          </div>

          {/* Quantity */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-2">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center">
                <Minus className="w-4 h-4 text-gray-600" />
              </button>
              <span className="text-lg font-bold min-w-[2rem] text-center">{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)}
                className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center">
                <Plus className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <span className="text-base font-bold text-gray-700">الكمية</span>
          </div>

          {/* SKU / Model Number */}
          <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 mb-4">
            <span className="text-base font-medium text-gray-700">{sku}</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">رقم الموديل</span>
              <Barcode className="w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Stock status */}
          <div className="flex justify-end mb-2">
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${inStock ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
              {inStock ? '● متوفر' : '● غير متوفر'}
            </span>
          </div>

          {/* Short Description */}
          {product.short_description && (
            <div className="text-sm text-gray-600 leading-relaxed text-right mt-2"
              dangerouslySetInnerHTML={{ __html: product.short_description }} />
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="bg-white p-4 mt-2">
            <h3 className="text-base font-bold mb-3 text-right text-gray-800">منتجات ذات صلة</h3>
            <div className="grid grid-cols-2 gap-3">
              {relatedProducts.slice(0, 4).map((rel) => (
                <Link key={rel.id} to={`/product/${rel.id}`}>
                  <div className="border border-gray-100 rounded-xl p-3 bg-white">
                    {rel.images?.[0] ? (
                      <img src={rel.images[0].src} alt={rel.name} className="w-full h-28 object-contain mb-2" />
                    ) : (
                      <div className="w-full h-28 bg-gray-100 rounded-lg mb-2 flex items-center justify-center">
                        <span className="text-2xl">📦</span>
                      </div>
                    )}
                    <p className="text-xs font-medium text-gray-700 truncate text-right"
                      dangerouslySetInnerHTML={{ __html: rel.name }} />
                    <p className="text-sm font-bold text-cyan-500 text-right mt-1">
                      {rel.price ? `${parseFloat(rel.price).toLocaleString()} IQD` : 'اتصل'}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ✅ Bottom Action Buttons - زرارين ثابتين في الأسفل */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 z-50">
        <div className="flex gap-3">
          {/* اشتري الآن */}
          <Button
            onClick={handleBuyNow}
            disabled={!inStock}
            className="flex-1 h-12 bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-base rounded-xl flex items-center justify-center gap-2"
          >
            <Zap className="w-5 h-5" />
            اشتري الآن
          </Button>

          {/* إضافة للسلة */}
          <Button
            onClick={handleAddToCart}
            disabled={!inStock}
            className="flex-1 h-12 bg-white hover:bg-gray-50 text-cyan-500 font-bold text-base rounded-xl border-2 border-cyan-500 flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-5 h-5" />
            إضافة للسلة
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Product;
