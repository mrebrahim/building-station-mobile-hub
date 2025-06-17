
import ProductCard from "./ProductCard";

interface Product {
  id: number;
  name: string;
  price: string;
  images?: Array<{ src: string; alt?: string }>;
  categories?: Array<{ name: string }>;
  stock_status?: string;
}

interface ProductsSectionProps {
  products: Product[];
  isLoading: boolean;
  isFeatured: boolean;
}

const ProductsSection = ({ products, isLoading, isFeatured }: ProductsSectionProps) => {
  return (
    <div className="px-4 mb-6">
      <h3 className="text-lg font-bold mb-4 text-right text-gray-800">
        {isFeatured ? 'منتجات مميزة' : 'منتجات الكتالوج'}
      </h3>
      {isLoading ? (
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl p-4 shadow-sm animate-pulse border border-gray-100">
              <div className="w-full h-40 bg-gray-200 rounded-lg mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">لا توجد منتجات متاحة حالياً</p>
          <p className="text-sm text-gray-500">يرجى المحاولة لاحقاً أو التحقق من الاتصال بالإنترنت</p>
        </div>
      )}
    </div>
  );
};

export default ProductsSection;
