import { useState, useEffect, useCallback, useRef } from 'react';

interface Product {
  id: number;
  name: string;
  price: string;
  images?: Array<{ src: string; alt?: string }>;
  categories?: Array<{ name: string }>;
  stock_status?: string;
}

interface UseInfiniteScrollOptions {
  productsPerPage?: number;
  maxProducts?: number;
  triggerDistance?: number;
  loadingDelay?: number;
}

interface UseInfiniteScrollReturn {
  products: Product[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  error: string | null;
  retry: () => void;
  setSentinelRef: (node: HTMLDivElement | null) => void;
}

export const useInfiniteScroll = (
  fetchProducts: (page: number, limit: number) => Promise<Product[]>,
  options: UseInfiniteScrollOptions = {}
): UseInfiniteScrollReturn => {
  const {
    productsPerPage = 12,
    maxProducts = 100,
    triggerDistance = 200,
    loadingDelay = 500
  } = options;

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  
  const loadingRef = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const loadProducts = useCallback(async (pageNumber: number, isInitial = false) => {
    if (loadingRef.current) return;
    
    loadingRef.current = true;
    setError(null);
    
    if (isInitial) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, loadingDelay));
      
      const newProducts = await fetchProducts(pageNumber, productsPerPage);
      
      setProducts(prev => {
        const combined = isInitial ? newProducts : [...prev, ...newProducts];
        // Prevent duplicates
        const unique = combined.filter((product, index, arr) => 
          arr.findIndex(p => p.id === product.id) === index
        );
        return unique;
      });

      // Check if we have more products to load
      const totalLoaded = isInitial ? newProducts.length : products.length + newProducts.length;
      setHasMore(newProducts.length === productsPerPage && totalLoaded < maxProducts);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
      loadingRef.current = false;
    }
  }, [fetchProducts, productsPerPage, maxProducts, loadingDelay, products.length]);

  // Load initial products
  useEffect(() => {
    loadProducts(1, true);
  }, []);

  // Setup intersection observer for infinite scroll
  useEffect(() => {
    if (!sentinelRef.current || !hasMore || isLoading) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !loadingRef.current && hasMore) {
          setPage(prev => {
            const nextPage = prev + 1;
            loadProducts(nextPage);
            return nextPage;
          });
        }
      },
      {
        rootMargin: `${triggerDistance}px`,
      }
    );

    observerRef.current.observe(sentinelRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, isLoading, loadProducts, triggerDistance]);

  const retry = useCallback(() => {
    if (products.length === 0) {
      setPage(1);
      loadProducts(1, true);
    } else {
      loadProducts(page);
    }
  }, [loadProducts, page, products.length]);

  // Expose sentinel ref for the component to use
  const setSentinelRef = useCallback((node: HTMLDivElement | null) => {
    sentinelRef.current = node;
  }, []);

  return {
    products,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    retry,
    setSentinelRef
  };
};