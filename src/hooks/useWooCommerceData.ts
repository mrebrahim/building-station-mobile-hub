import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

// Hook for real-time data updates
export const useRealTimeUpdates = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Subscribe to categories changes
    const categoriesChannel = supabase
      .channel('wc-categories-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'wc_categories'
        },
        (payload) => {
          console.log('Categories changed:', payload);
          // Invalidate all category-related queries
          queryClient.invalidateQueries({ queryKey: ['wc-categories'] });
          queryClient.invalidateQueries({ queryKey: ['wc-featured-categories'] });
          queryClient.invalidateQueries({ queryKey: ['wc-category'] });
        }
      )
      .subscribe();

    // Subscribe to products changes
    const productsChannel = supabase
      .channel('wc-products-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'wc_products'
        },
        (payload) => {
          console.log('Products changed:', payload);
          // Invalidate all product-related queries
          queryClient.invalidateQueries({ queryKey: ['wc-products'] });
          queryClient.invalidateQueries({ queryKey: ['wc-product'] });
        }
      )
      .subscribe();

    // Subscribe to product-category relationships changes
    const productCategoriesChannel = supabase
      .channel('wc-product-categories-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'wc_product_categories'
        },
        (payload) => {
          console.log('Product categories changed:', payload);
          // Invalidate product and category queries
          queryClient.invalidateQueries({ queryKey: ['wc-products'] });
          queryClient.invalidateQueries({ queryKey: ['wc-categories'] });
          queryClient.invalidateQueries({ queryKey: ['wc-featured-categories'] });
        }
      )
      .subscribe();

    // Subscribe to sync logs changes
    const syncLogsChannel = supabase
      .channel('wc-sync-logs-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'wc_sync_logs'
        },
        (payload) => {
          console.log('Sync logs changed:', payload);
          queryClient.invalidateQueries({ queryKey: ['wc-sync-logs'] });
          
          // If sync completed successfully, refresh all data
          if (payload.new && typeof payload.new === 'object' && 'status' in payload.new && payload.new.status === 'success') {
            queryClient.invalidateQueries({ queryKey: ['wc-products'] });
            queryClient.invalidateQueries({ queryKey: ['wc-categories'] });
            queryClient.invalidateQueries({ queryKey: ['wc-featured-categories'] });
          }
        }
      )
      .subscribe();

    // Cleanup subscriptions
    return () => {
      supabase.removeChannel(categoriesChannel);
      supabase.removeChannel(productsChannel);
      supabase.removeChannel(productCategoriesChannel);
      supabase.removeChannel(syncLogsChannel);
    };
  }, [queryClient]);
};

// Hook to get categories from database
export const useCategories = () => {
  return useQuery({
    queryKey: ['wc-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('wc_categories')
        .select('*')
        .order('menu_order', { ascending: true });
      
      if (error) {
        console.error('Error fetching categories:', error);
        throw error;
      }
      
      return data || [];
    },
    staleTime: 1000 * 30, // 30 seconds
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};

// Hook to get products from database
export const useProducts = (options?: {
  categoryId?: number;
  featured?: boolean;
  limit?: number;
  orderBy?: 'date_created' | 'date_modified' | 'name' | 'price';
  order?: 'asc' | 'desc';
}) => {
  return useQuery({
    queryKey: ['wc-products', options],
    queryFn: async () => {
      let query = supabase
        .from('wc_products')
        .select(`
          *,
          wc_product_categories!inner(
            category_id,
            wc_categories(id, name, slug)
          )
        `);

      // Filter by category if specified
      if (options?.categoryId) {
        query = query.eq('wc_product_categories.category_id', options.categoryId);
      }

      // Filter by featured if specified
      if (options?.featured !== undefined) {
        query = query.eq('featured', options.featured);
      }

      // Apply ordering
      const orderBy = options?.orderBy || 'date_modified';
      const order = options?.order || 'desc';
      query = query.order(orderBy, { ascending: order === 'asc' });

      // Apply limit
      if (options?.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching products:', error);
        throw error;
      }
      
      return data || [];
    },
    staleTime: 1000 * 30, // 30 seconds
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};

// Hook to get featured categories (categories with products and images)
export const useFeaturedCategories = (limit: number = 12) => {
  return useQuery({
    queryKey: ['wc-featured-categories', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('wc_categories')
        .select('*')
        .not('image_url', 'is', null)
        .gt('product_count', 0)
        .order('product_count', { ascending: false })
        .limit(limit);
      
      if (error) {
        console.error('Error fetching featured categories:', error);
        throw error;
      }
      
      return data || [];
    },
    staleTime: 1000 * 30, // 30 seconds
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};

// Hook to get sync logs
export const useSyncLogs = (limit: number = 10) => {
  return useQuery({
    queryKey: ['wc-sync-logs', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('wc_sync_logs')
        .select('*')
        .order('started_at', { ascending: false })
        .limit(limit);
      
      if (error) {
        console.error('Error fetching sync logs:', error);
        throw error;
      }
      
      return data || [];
    },
    staleTime: 1000 * 30, // 30 seconds
    gcTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Hook to trigger manual sync
export const useTriggerSync = () => {
  return async () => {
    try {
      const { data, error } = await supabase.functions.invoke('woocommerce-sync');
      
      if (error) {
        console.error('Error triggering sync:', error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Failed to trigger sync:', error);
      throw error;
    }
  };
};

// Hook to get product by ID
export const useProduct = (productId: number) => {
  return useQuery({
    queryKey: ['wc-product', productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('wc_products')
        .select(`
          *,
          wc_product_categories(
            category_id,
            wc_categories(id, name, slug)
          )
        `)
        .eq('id', productId)
        .single();
      
      if (error) {
        console.error('Error fetching product:', error);
        throw error;
      }
      
      return data;
    },
    staleTime: 1000 * 60 * 1, // 1 minute
    gcTime: 1000 * 60 * 10, // 10 minutes
    enabled: !!productId,
  });
};

// Hook to get category by ID
export const useCategory = (categoryId: number) => {
  return useQuery({
    queryKey: ['wc-category', categoryId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('wc_categories')
        .select('*')
        .eq('id', categoryId)
        .single();
      
      if (error) {
        console.error('Error fetching category:', error);
        throw error;
      }
      
      return data;
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
    enabled: !!categoryId,
  });
};