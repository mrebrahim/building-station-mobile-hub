import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDataRefresh = () => {
  const queryClient = useQueryClient();

  const refreshAllData = async () => {
    try {
      toast.info("🔄 جاري تحديث البيانات من WooCommerce...");
      
      // Invalidate all WooCommerce related queries
      await queryClient.invalidateQueries({ 
        predicate: (query) => {
          const key = query.queryKey[0] as string;
          return key?.includes('products') || key?.includes('categories') || key?.includes('brands');
        }
      });

      // Force refetch all data
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ['products'] }),
        queryClient.refetchQueries({ queryKey: ['categories'] }),
        queryClient.refetchQueries({ queryKey: ['featured-categories'] }),
        queryClient.refetchQueries({ queryKey: ['brands'] }),
        queryClient.refetchQueries({ queryKey: ['brands-home'] }),
      ]);

      toast.success("✅ تم تحديث البيانات بنجاح!");
    } catch (error) {
      console.error('Data refresh error:', error);
      toast.error("❌ حدث خطأ أثناء تحديث البيانات. يرجى المحاولة مرة أخرى.");
    }
  };

  const refreshProducts = async () => {
    try {
      toast.info("🔄 جاري تحديث المنتجات...");
      await queryClient.invalidateQueries({ queryKey: ['products'] });
      await queryClient.refetchQueries({ queryKey: ['products'] });
      toast.success("✅ تم تحديث المنتجات بنجاح!");
    } catch (error) {
      console.error('Products refresh error:', error);
      toast.error("❌ حدث خطأ أثناء تحديث المنتجات.");
    }
  };

  const refreshCategories = async () => {
    try {
      toast.info("🔄 جاري تحديث الفئات...");
      await queryClient.invalidateQueries({ queryKey: ['categories'] });
      await queryClient.invalidateQueries({ queryKey: ['featured-categories'] });
      await queryClient.refetchQueries({ queryKey: ['categories'] });
      await queryClient.refetchQueries({ queryKey: ['featured-categories'] });
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
  };
};