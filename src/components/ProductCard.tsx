
import { Heart, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

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
    
    toast({
      title: "تم إضافة المنتج",
      description: `تم إضافة ${product.name} إلى السلة`,
    });
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 relative">
      {/* Heart Icon */}
      <Heart className="absolute top-3 left-3 w-5 h-5 text-gray-300 hover:text-red-500 cursor-pointer z-10" />
      
      {/* Product Image */}
      <Link to={`/product/${product.id}`}>
        <div className="w-full h-40 bg-gray-50 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
          {product.images && product.images.length > 0 ? (
            <img 
              src={product.images[0].src} 
              alt={product.images[0].alt || product.name}
              className="w-full h-full object-contain hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <span className="text-4xl text-gray-300">📦</span>
          )}
        </div>
      </Link>
      
      {/* Brand Name */}
      {product.categories && product.categories.length > 0 && (
        <p className="text-xs text-gray-500 mb-1 font-medium">
          العلامة التجارية {product.categories[0].name}
        </p>
      )}
      
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
        onClick={() => handleAddToCart(product)}
        className="absolute bottom-3 right-3 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors duration-200 shadow-lg"
        disabled={product.stock_status !== 'instock'}
      >
        <Plus className="w-5 h-5" />
      </button>
    </div>
  );
};

export default ProductCard;
