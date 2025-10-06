
import { Heart, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

interface Product {
  id: number;
  name: string;
  price: string;
  images?: Array<{ src: string; alt?: string }>;
  categories?: Array<{ name: string }>;
  stock_status?: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { toast } = useToast();
  const [isFavorite, setIsFavorite] = useState(false);

  // Check if product is in favorites when component mounts
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const isProductFavorite = favorites.some((fav: any) => fav.id === product.id);
    setIsFavorite(isProductFavorite);
  }, [product.id]);

  const handleAddToCart = (product: Product) => {
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItemIndex = existingCart.findIndex((item: any) => item.id === product.id);
    
    if (existingItemIndex >= 0) {
      existingCart[existingItemIndex].quantity += 1;
    } else {
      existingCart.push({
        id: product.id,
        name: product.name,
        brand: product.categories?.[0]?.name || 'غير محدد',
        price: parseFloat(product.price) || 0,
        quantity: 1,
        image: product.images?.[0]?.src || ''
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(existingCart));
    window.dispatchEvent(new Event('cartUpdated'));
    
    toast({
      title: "تم إضافة المنتج",
      description: `تم إضافة ${product.name} إلى السلة`,
    });
  };

  const toggleFavorite = () => {
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

  return (
    <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 relative hover:shadow-md transition-shadow duration-200">
      {/* Heart Icon */}
      <button onClick={toggleFavorite} className="absolute top-2 left-2 z-10 bg-white/80 backdrop-blur-sm rounded-full p-1.5 hover:bg-white transition-colors">
        <Heart className={`w-4 h-4 ${
          isFavorite ? 'text-red-500 fill-current' : 'text-gray-400 hover:text-red-500'
        }`} />
      </button>
      
      {/* Product Image */}
      <Link to={`/product/${product.id}`}>
        <div className="w-full aspect-square bg-gray-50 rounded-xl mb-2.5 flex items-center justify-center overflow-hidden relative">
          {product.images && product.images.length > 0 && product.images[0].src ? (
            <img
              src={product.images[0].src}
              alt={product.images[0].alt || product.name}
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const fallback = document.createElement('div');
                fallback.className = 'w-full h-full flex items-center justify-center text-4xl text-gray-300';
                fallback.innerHTML = '📦';
                e.currentTarget.parentElement?.appendChild(fallback);
              }}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <span className="text-4xl text-gray-300">📦</span>
          )}
        </div>
      </Link>
      
      {/* Brand Name */}
      {product.categories && product.categories.length > 0 && (
        <p className="text-[10px] text-gray-400 mb-1 font-medium truncate">
          {product.categories[0].name}
        </p>
      )}
      
      {/* Product Name */}
      <Link to={`/product/${product.id}`}>
        <h4 
          className="text-xs font-semibold mb-1.5 text-gray-800 leading-snug hover:text-gray-900 line-clamp-2 min-h-[2.5rem]" 
          dangerouslySetInnerHTML={{ __html: product.name }}
        />
      </Link>
      
      {/* Price */}
      <p className="text-sm font-bold text-black mb-8">
        {product.price ? `${parseInt(product.price).toLocaleString()} IQD` : 'اتصل للسعر'}
      </p>
      
      {/* Add to Cart Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          handleAddToCart(product);
        }}
        className="absolute bottom-2.5 right-2.5 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={product.stock_status !== 'instock'}
        aria-label="إضافة إلى السلة"
      >
        <Plus className="w-5 h-5" />
      </button>
    </div>
  );
};

export default ProductCard;
