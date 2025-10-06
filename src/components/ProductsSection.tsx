
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
    <div className="px-3 mb-6">
      <h3 className="text-lg font-bold mb-3.5 text-right text-gray-900">
        {isFeatured ? 'منتجات مميزة' : 'منتجات الكتالوج'}
      </h3>
      {isLoading ? (
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-3 shadow-sm animate-pulse border border-gray-100">
              <div className="w-full aspect-square bg-gray-200 rounded-xl mb-2.5"></div>
              <div className="h-3 bg-gray-200 rounded mb-2 w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 gap-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 px-4">
          <div className="text-5xl mb-3">📦</div>
          <p className="text-gray-700 font-medium mb-2">لا توجد منتجات متاحة حالياً</p>
          <p className="text-sm text-gray-500">يرجى المحاولة لاحقاً أو التحقق من الاتصال بالإنترنت</p>
        </div>
      )}
    </div>
  );
};

export default ProductsSection;
