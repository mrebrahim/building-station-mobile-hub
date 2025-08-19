import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const useDataRefresh = () => {
  const queryClient = useQueryClient();

  const triggerWooCommerceSync = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('woocommerce-sync');
      
      if (error) {
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('WooCommerce sync error:', error);
      throw error;
    }
  };

  const refreshAllData = async () => {
    try {
      toast.info("🔄 جاري مزامنة البيانات من WooCommerce...", {
        duration: 10000,
      });
      
      // Trigger WooCommerce sync
      const syncResult = await triggerWooCommerceSync();
      
      if (!syncResult.success) {
        throw new Error(syncResult.error || 'فشل في المزامنة');
      }
      
      // Invalidate all cached data
      await queryClient.invalidateQueries({ 
        predicate: (query) => {
          const key = query.queryKey[0] as string;
          return key?.includes('wc-') || key?.includes('products') || key?.includes('categories') || key?.includes('brands');
        }
      });

      // Force refetch all data
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ['wc-products'] }),
        queryClient.refetchQueries({ queryKey: ['wc-categories'] }),
        queryClient.refetchQueries({ queryKey: ['wc-featured-categories'] }),
        queryClient.refetchQueries({ queryKey: ['products'] }),
        queryClient.refetchQueries({ queryKey: ['categories'] }),
        queryClient.refetchQueries({ queryKey: ['featured-categories'] }),
        queryClient.refetchQueries({ queryKey: ['brands'] }),
        queryClient.refetchQueries({ queryKey: ['brands-home'] }),
      ]);

      // Show detailed success message
      const { categories, products } = syncResult;
      const message = `✅ تم تحديث البيانات بنجاح!\n📂 الفئات: ${categories.synced}/${categories.total}\n📦 المنتجات: ${products.synced}/${products.total}`;
      
      if (syncResult.errors && syncResult.errors.length > 0) {
        toast.warning(`⚠️ ${message}\n❌ ${syncResult.errors.length} خطأ في المزامنة`, {
          duration: 8000,
        });
      } else {
        toast.success(message, {
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('Data refresh error:', error);
      toast.error(`❌ حدث خطأ أثناء مزامنة البيانات: ${error.message}`, {
        duration: 8000,
      });
    }
  };

  const refreshProducts = async () => {
    try {
      toast.info("🔄 جاري تحديث المنتجات...");
      
      // Invalidate product-related queries
      await queryClient.invalidateQueries({ 
        predicate: (query) => {
          const key = query.queryKey[0] as string;
          return key?.includes('wc-product') || key?.includes('products');
        }
      });
      
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ['wc-products'] }),
        queryClient.refetchQueries({ queryKey: ['products'] }),
      ]);
      
      toast.success("✅ تم تحديث المنتجات بنجاح!");
    } catch (error) {
      console.error('Products refresh error:', error);
      toast.error("❌ حدث خطأ أثناء تحديث المنتجات.");
    }
  };

  const refreshCategories = async () => {
    try {
      toast.info("🔄 جاري تحديث الفئات...");
      
      // Invalidate category-related queries
      await queryClient.invalidateQueries({ 
        predicate: (query) => {
          const key = query.queryKey[0] as string;
          return key?.includes('wc-categor') || key?.includes('categories');
        }
      });
      
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ['wc-categories'] }),
        queryClient.refetchQueries({ queryKey: ['wc-featured-categories'] }),
        queryClient.refetchQueries({ queryKey: ['categories'] }),
        queryClient.refetchQueries({ queryKey: ['featured-categories'] }),
      ]);
      
      toast.success("✅ تم تحديث الفئات بنجاح!");
    } catch (error) {
      console.error('Categories refresh error:', error);
      toast.error("❌ حدث خطأ أثناء تحديث الفئات.");
    }
  };

  return {
    refreshAllData,
    refreshProducts,
    refreshCategories,
    triggerWooCommerceSync,
  };
};