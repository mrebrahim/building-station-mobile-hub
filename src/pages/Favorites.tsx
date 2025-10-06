
import { ArrowLeft, Heart, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface FavoriteProduct {
  id: number;
  name: string;
  price: string;
  image: string;
  brand: string;
}

const Favorites = () => {
  const { toast } = useToast();
  const [favoriteProducts, setFavoriteProducts] = useState<FavoriteProduct[]>([]);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavoriteProducts(favorites);
  }, []);

  const removeFromFavorites = (productId: number) => {
    const updatedFavorites = favoriteProducts.filter(product => product.id !== productId);
    setFavoriteProducts(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    window.dispatchEvent(new Event('favoritesUpdated'));
    
    toast({
      title: "تم الحذف",
      description: "تم حذف المنتج من المفضلة",
    });
  };

  const addToCart = (product: FavoriteProduct) => {
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItemIndex = existingCart.findIndex((item: any) => item.id === product.id);
    
    if (existingItemIndex >= 0) {
      existingCart[existingItemIndex].quantity += 1;
    } else {
      existingCart.push({
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: parseFloat(product.price) || 0,
        quantity: 1,
        image: product.image
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(existingCart));
    window.dispatchEvent(new Event('cartUpdated'));
    
    toast({
      title: "تم إضافة المنتج",
      description: `تم إضافة ${product.name} إلى السلة`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 rtl">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <span className="text-lg font-bold">المفضلة</span>
          </div>
          <Link to="/">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </Link>
        </div>
      </header>

      <div className="p-4 pb-32">
        {favoriteProducts.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-600 mb-2">لا توجد منتجات مفضلة</h2>
            <p className="text-gray-500 mb-6">ابدأ بإضافة منتجات إلى قائمة المفضلة</p>
            <Link 
              to="/" 
              className="bg-black text-white px-6 py-3 rounded-lg font-medium inline-block"
            >
              تصفح المنتجات
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {favoriteProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 relative">
                {/* Remove from favorites button */}
                <button
                  onClick={() => removeFromFavorites(product.id)}
                  className="absolute top-3 left-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors z-10"
                >
                  <Heart className="w-4 h-4 fill-current" />
                </button>
                
                {/* Product Image */}
                <Link to={`/product/${product.id}`}>
                  <div className="w-full h-40 bg-gray-50 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain hover:scale-105 transition-transform duration-200"
                      />
                    ) : (
                      <span className="text-4xl text-gray-400">📦</span>
                    )}
                  </div>
                </Link>
                
                {/* Brand Name */}
                <p className="text-xs text-gray-500 mb-1 font-medium">
                  العلامة التجارية {product.brand}
                </p>
                
                {/* Product Name */}
                <Link to={`/product/${product.id}`}>
                  <h4 className="text-sm font-medium mb-2 text-gray-700 leading-tight hover:text-gray-900" 
                      dangerouslySetInnerHTML={{ __html: product.name }}>
                  </h4>
                </Link>
                
                {/* Price */}
                <p className="text-lg font-bold text-black mb-3">
                  {product.price ? `IQD ${parseInt(product.price).toLocaleString()}` : 'اتصل للسعر'}
                </p>
                
                {/* Add to Cart Button */}
                <button
                  onClick={() => addToCart(product)}
                  className="absolute bottom-3 right-3 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors duration-200 shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
