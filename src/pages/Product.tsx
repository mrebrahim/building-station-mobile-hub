import { ArrowRight, Share2, Heart, Plus, Minus, ShoppingCart, Zap, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import BottomNavigation from "@/components/BottomNavigation";

// ✅ جلب المنتج مباشرة من WooCommerce عبر Vercel proxy
const fetchProduct = async (id: string) => {
  const res = await fetch(`/api/woocommerce?endpoint=products/${id}`);
  if (!res.ok) throw new Error('Product not found');
  return res.json();
};

const fetchRelated = async (categoryId: number, excludeId: number) => {
  const res = await fetch(`/api/woocommerce?endpoint=products&category=${categoryId}&per_page=4&exclude=${excludeId}`);
  if (!res.ok) return [];
  return res.json();
};

const Product = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedVariation, setSelectedVariation] = useState<any>(null);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  const [showFullDesc, setShowFullDesc] = useState(false);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product-wc', id],
    queryFn: () => fetchProduct(id!),
    enabled: !!id,
  });

  // ✅ جلب الـ variations لو variable product
  const { data: variations = [] } = useQuery({
    queryKey: ['variations', id],
    queryFn: async () => {
      const res = await fetch(`/api/woocommerce?endpoint=products/${id}/variations&per_page=100`);
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!product && product.type === 'variable',
  });

  const { data: relatedProducts = [] } = useQuery({
    queryKey: ['related-products-wc', product?.categories?.[0]?.id],
    queryFn: () => fetchRelated(product.categories[0].id, product.id),
    enabled: !!product?.categories?.[0]?.id,
  });

  useEffect(() => {
    if (product) {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      setIsFavorite(favorites.some((f: any) => f.id === product.id));
    }
  }, [product]);

  // ✅ تحديد الـ variation بناءً على الخيارات المختارة
  useEffect(() => {
    if (!variations.length) return;
    const match = variations.find((v: any) =>
      v.attributes.every((attr: any) =>
        selectedAttributes[attr.name] === attr.option
      )
    );
    setSelectedVariation(match || null);
  }, [selectedAttributes, variations]);

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

  // ✅ الحصول على السعر الصح (variation أو المنتج الأصلي)
  const getCurrentPrice = () => {
    if (selectedVariation) return parseFloat(selectedVariation.price) || 0;
    return parseFloat(product?.price) || 0;
  };

  const getCurrentImage = () => {
    if (selectedVariation?.image?.src) return selectedVariation.image.src;
    return product?.images?.[currentImageIndex]?.src;
  };

  const isInStock = () => {
    if (selectedVariation) return selectedVariation.stock_status === 'instock';
    return product?.stock_status === 'instock';
  };

  // ✅ إضافة للسلة
  const handleAddToCart = () => {
    if (!product) return;
    if (product.type === 'variable' && !selectedVariation) {
      toast({ title: "⚠️ اختر المواصفات أولاً", description: "يرجى اختيار جميع الخيارات المتاحة" });
      return;
    }

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartId = selectedVariation ? `${product.id}-${selectedVariation.id}` : product.id;
    const idx = cart.findIndex((i: any) => i.cartId === cartId);

    const cartItem = {
      cartId,
      id: product.id,
      variation_id: selectedVariation?.id || 0,
      name: product.name + (selectedVariation ? ' - ' + Object.values(selectedAttributes).join(', ') : ''),
      price: getCurrentPrice(),
      quantity,
      image: getCurrentImage() || '',
      attributes: selectedAttributes,
    };

    if (idx >= 0) {
      cart[idx].quantity += quantity;
    } else {
      cart.push(cartItem);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    toast({ title: "✅ تم إضافة المنتج للسلة", description: product.name });
  };

  // ✅ اشتري الآن - يضيف للسلة ويروح لـ WooCommerce Checkout
  const handleBuyNow = async () => {
    if (!product) return;
    if (product.type === 'variable' && !selectedVariation) {
      toast({ title: "⚠️ اختر المواصفات أولاً", description: "يرجى اختيار جميع الخيارات المتاحة" });
      return;
    }

    // ✅ إضافة للسلة أولاً
    handleAddToCart();

    // ✅ التوجه لصفحة الـ Checkout الداخلية
    navigate('/checkout');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 rtl flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 rtl flex flex-col items-center justify-center p-4">
        <span className="text-6xl mb-4">📦</span>
        <h2 className="text-xl font-bold mb-2">المنتج غير موجود</h2>
        <Link to="/"><Button className="mt-4 bg-red-500 text-white">العودة للرئيسية</Button></Link>
      </div>
    );
  }

  const price = getCurrentPrice();
  const images = product.images || [];
  const isVariable = product.type === 'variable';

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
        {/* صورة المنتج */}
        <div className="relative bg-white">
          <div className="relative h-72 overflow-hidden">
            {images.length > 0 || selectedVariation?.image ? (
              <img
                src={getCurrentImage()}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <span className="text-6xl">📦</span>
              </div>
            )}

            {/* زرار المفضلة */}
            <button onClick={toggleFavorite}
              className="absolute bottom-4 right-4 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center">
              <Heart className={`w-5 h-5 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
            </button>

            {/* Image dots */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1.5">
                {images.map((_, i) => (
                  <button key={i} onClick={() => setCurrentImageIndex(i)}
                    className={`w-2 h-2 rounded-full ${i === currentImageIndex ? 'bg-cyan-500' : 'bg-gray-300'}`} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* بيانات المنتج */}
        <div className="bg-white px-4 pt-4 pb-4 mt-2">
          {/* الاسم */}
          <h2 className="text-lg font-bold text-gray-800 text-right mb-1"
            dangerouslySetInnerHTML={{ __html: product.name }} />

          {/* السعر */}
          <div className="flex items-center justify-end gap-2 mb-4">
            {product.regular_price && product.regular_price !== product.price && (
              <span className="text-sm text-gray-400 line-through">
                {parseFloat(product.regular_price).toLocaleString()} IQD
              </span>
            )}
            <div className="text-right">
              <span className="text-xl font-bold text-cyan-500">
                {isVariable && !selectedVariation
                  ? product.price_html?.replace(/<[^>]*>/g, '') || 'اختر المواصفات'
                  : price > 0 ? `${price.toLocaleString()} IQD` : 'اتصل للسعر'}
              </span>
              {price > 0 && <p className="text-xs text-gray-400">السعر شامل الضريبة</p>}
            </div>
          </div>

          {/* ✅ Variations - لو Variable Product */}
          {isVariable && product.attributes?.map((attr: any) => (
            <div key={attr.id} className="mb-4">
              <p className="text-sm font-medium text-gray-700 text-right mb-2">{attr.name}</p>
              <div className="flex flex-wrap gap-2 justify-end">
                {attr.options?.map((option: string) => (
                  <button
                    key={option}
                    onClick={() => setSelectedAttributes(prev => ({ ...prev, [attr.name]: option }))}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                      selectedAttributes[attr.name] === option
                        ? 'bg-cyan-500 text-white border-cyan-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-cyan-400'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              {/* تأكيد الـ variation المختار */}
              {selectedVariation && selectedAttributes[attr.name] && (
                <p className="text-xs text-green-600 text-right mt-1">✓ تم الاختيار</p>
              )}
            </div>
          ))}

          {/* الكمية */}
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

          {/* حالة المخزون */}
          <div className="flex justify-end mb-3">
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
              isInStock() ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
            }`}>
              {isInStock() ? '● متوفر' : '● غير متوفر'}
            </span>
          </div>

          {/* الوصف */}
          {product.short_description && (
            <div className="text-sm text-gray-600 leading-relaxed text-right border-t border-gray-100 pt-3"
              dangerouslySetInnerHTML={{ __html: product.short_description }} />
          )}

          {product.description && (
            <div className="border-t border-gray-100 pt-3 mt-2">
              {showFullDesc ? (
                <>
                  <div className="text-sm text-gray-600 leading-relaxed text-right"
                    dangerouslySetInnerHTML={{ __html: product.description }} />
                  <button onClick={() => setShowFullDesc(false)} className="text-cyan-500 text-sm mt-2">إخفاء ▲</button>
                </>
              ) : (
                <button onClick={() => setShowFullDesc(true)} className="text-cyan-500 text-sm flex items-center gap-1 mr-auto">
                  <ChevronDown className="w-4 h-4" /> اقرأ المزيد
                </button>
              )}
            </div>
          )}
        </div>

        {/* منتجات ذات صلة */}
        {relatedProducts.length > 0 && (
          <div className="bg-white p-4 mt-2">
            <h3 className="text-base font-bold mb-3 text-right text-gray-800">منتجات ذات صلة</h3>
            <div className="grid grid-cols-2 gap-3">
              {relatedProducts.slice(0, 4).map((rel: any) => (
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

      {/* ✅ زرارين ثابتين في الأسفل */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 z-50">
        <div className="flex gap-3">
          {/* اشتري الآن */}
          <Button
            onClick={handleBuyNow}
            disabled={!isInStock() || (isVariable && !selectedVariation)}
            className="flex-1 h-12 bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-base rounded-xl gap-2 disabled:opacity-50"
          >
            <Zap className="w-5 h-5" />
            اشتري الآن
          </Button>

          {/* إضافة للسلة */}
          <Button
            onClick={handleAddToCart}
            disabled={!isInStock() || (isVariable && !selectedVariation)}
            className="flex-1 h-12 bg-white hover:bg-gray-50 text-cyan-500 font-bold text-base rounded-xl border-2 border-cyan-500 gap-2 disabled:opacity-50"
          >
            <ShoppingCart className="w-5 h-5" />
            إضافة للسلة
          </Button>
        </div>

        {/* تنبيه لو variable ومش اختار */}
        {isVariable && !selectedVariation && (
          <p className="text-xs text-center text-orange-500 mt-1">اختر المواصفات أولاً للمتابعة</p>
        )}
      </div>
    </div>
  );
};

export default Product;
