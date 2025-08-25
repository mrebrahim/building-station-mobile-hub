import { Skeleton } from "@/components/ui/skeleton";

const ProductSkeleton = () => {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      {/* Heart Icon Skeleton */}
      <Skeleton className="absolute top-3 left-3 w-5 h-5 rounded-full" />
      
      {/* Product Image Skeleton */}
      <Skeleton className="w-full h-40 bg-gray-200 rounded-lg mb-3" />
      
      {/* Brand Name Skeleton */}
      <Skeleton className="h-3 w-24 mb-2 bg-gray-200" />
      
      {/* Product Name Skeleton */}
      <Skeleton className="h-4 w-full mb-1 bg-gray-200" />
      <Skeleton className="h-4 w-3/4 mb-3 bg-gray-200" />
      
      {/* Price Skeleton */}
      <Skeleton className="h-6 w-20 mb-3 bg-gray-200" />
      
      {/* Add to Cart Button Skeleton */}
      <Skeleton className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-gray-200" />
    </div>
  );
};

const ProductSkeletonGrid = ({ count = 12 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <ProductSkeleton key={index} />
      ))}
    </div>
  );
};

export { ProductSkeleton, ProductSkeletonGrid };