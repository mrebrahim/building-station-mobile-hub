import { useCallback } from "react";
import ProductCard from "./ProductCard";
import { ProductSkeletonGrid } from "./ui/product-skeleton";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { Button } from "./ui/button";
import { Loader2, RefreshCw } from "lucide-react";

interface Product {
  id: number;
  name: string;
  price: string;
  images?: Array<{ src: string; alt?: string }>;
  categories?: Array<{ name: string }>;
  stock_status?: string;
}

// Mock building materials data
const mockBuildingProducts: Product[] = [
  // Page 1 (12 products)
  { id: 1, name: "طوب أحمر عادي", price: "250", categories: [{ name: "مواد البناء" }], stock_status: "instock", images: [{ src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", alt: "طوب أحمر" }] },
  { id: 2, name: "اسمنت بورتلاند", price: "12000", categories: [{ name: "اسمنت" }], stock_status: "instock", images: [{ src: "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400", alt: "اسمنت" }] },
  { id: 3, name: "حديد تسليح 12 ملم", price: "850000", categories: [{ name: "حديد" }], stock_status: "instock", images: [{ src: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=400", alt: "حديد تسليح" }] },
  { id: 4, name: "رمل أبيض ناعم", price: "45000", categories: [{ name: "رمل وحصى" }], stock_status: "instock", images: [{ src: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400", alt: "رمل" }] },
  { id: 5, name: "بلاط سيراميك 60x60", price: "35000", categories: [{ name: "بلاط" }], stock_status: "instock", images: [{ src: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400", alt: "بلاط سيراميك" }] },
  { id: 6, name: "أنابيب PVC قطر 4 إنش", price: "25000", categories: [{ name: "صحية" }], stock_status: "instock", images: [{ src: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400", alt: "أنابيب PVC" }] },
  { id: 7, name: "كابل كهرباء 2.5 ملم", price: "185000", categories: [{ name: "كهرباء" }], stock_status: "instock", images: [{ src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", alt: "كابل كهرباء" }] },
  { id: 8, name: "دهان أبيض داخلي", price: "75000", categories: [{ name: "دهانات" }], stock_status: "instock", images: [{ src: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400", alt: "دهان" }] },
  { id: 9, name: "مسامير خشب 5 سم", price: "15000", categories: [{ name: "مسامير" }], stock_status: "instock", images: [{ src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", alt: "مسامير" }] },
  { id: 10, name: "زجاج شفاف 4 ملم", price: "45000", categories: [{ name: "زجاج" }], stock_status: "instock", images: [{ src: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400", alt: "زجاج" }] },
  { id: 11, name: "باب خشبي داخلي", price: "125000", categories: [{ name: "أبواب" }], stock_status: "instock", images: [{ src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", alt: "باب خشبي" }] },
  { id: 12, name: "شبك حديد للنوافذ", price: "85000", categories: [{ name: "شبك" }], stock_status: "instock", images: [{ src: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=400", alt: "شبك حديد" }] },
  
  // Page 2 (12 products)
  { id: 13, name: "حصى مغسول حجم متوسط", price: "55000", categories: [{ name: "رمل وحصى" }], stock_status: "instock", images: [{ src: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400", alt: "حصى" }] },
  { id: 14, name: "اسمنت أبيض", price: "18000", categories: [{ name: "اسمنت" }], stock_status: "instock", images: [{ src: "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400", alt: "اسمنت أبيض" }] },
  { id: 15, name: "حديد زاوية 5x5 سم", price: "125000", categories: [{ name: "حديد" }], stock_status: "instock", images: [{ src: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=400", alt: "حديد زاوية" }] },
  { id: 16, name: "طوب حراري", price: "450", categories: [{ name: "مواد البناء" }], stock_status: "instock", images: [{ src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", alt: "طوب حراري" }] },
  { id: 17, name: "بلاط رخام أبيض", price: "65000", categories: [{ name: "بلاط" }], stock_status: "instock", images: [{ src: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400", alt: "رخام" }] },
  { id: 18, name: "مضخة مياه 1 حصان", price: "265000", categories: [{ name: "معدات" }], stock_status: "instock", images: [{ src: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400", alt: "مضخة مياه" }] },
  { id: 19, name: "سلك كهرباء 1.5 ملم", price: "95000", categories: [{ name: "كهرباء" }], stock_status: "instock", images: [{ src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", alt: "سلك كهرباء" }] },
  { id: 20, name: "دهان خارجي مقاوم", price: "125000", categories: [{ name: "دهانات" }], stock_status: "instock", images: [{ src: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400", alt: "دهان خارجي" }] },
  { id: 21, name: "براغي معدنية متنوعة", price: "25000", categories: [{ name: "مسامير" }], stock_status: "instock", images: [{ src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", alt: "براغي" }] },
  { id: 22, name: "زجاج مقوى 6 ملم", price: "75000", categories: [{ name: "زجاج" }], stock_status: "instock", images: [{ src: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400", alt: "زجاج مقوى" }] },
  { id: 23, name: "باب ألمنيوم خارجي", price: "185000", categories: [{ name: "أبواب" }], stock_status: "instock", images: [{ src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", alt: "باب ألمنيوم" }] },
  { id: 24, name: "شبك فولاذي مجلفن", price: "115000", categories: [{ name: "شبك" }], stock_status: "instock", images: [{ src: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=400", alt: "شبك فولاذي" }] },

  // Continue with more pages...
  // Page 3
  { id: 25, name: "خرسانة جاهزة", price: "85000", categories: [{ name: "خرسانة" }], stock_status: "instock", images: [{ src: "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400", alt: "خرسانة" }] },
  { id: 26, name: "بلوك خرساني عادي", price: "1200", categories: [{ name: "مواد البناء" }], stock_status: "instock", images: [{ src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", alt: "بلوك" }] },
  { id: 27, name: "حديد شبك قطر 8 ملم", price: "45000", categories: [{ name: "حديد" }], stock_status: "instock", images: [{ src: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=400", alt: "حديد شبك" }] },
  { id: 28, name: "رمل أصفر خشن", price: "35000", categories: [{ name: "رمل وحصى" }], stock_status: "instock", images: [{ src: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400", alt: "رمل أصفر" }] },
  { id: 29, name: "بلاط جرانيت 80x80", price: "95000", categories: [{ name: "بلاط" }], stock_status: "instock", images: [{ src: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400", alt: "جرانيت" }] },
  { id: 30, name: "صنبور مياه عادي", price: "35000", categories: [{ name: "صحية" }], stock_status: "instock", images: [{ src: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400", alt: "صنبور" }] },
  { id: 31, name: "مفتاح كهرباء مفرد", price: "15000", categories: [{ name: "كهرباء" }], stock_status: "instock", images: [{ src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", alt: "مفتاح كهرباء" }] },
  { id: 32, name: "معجون حوائط", price: "45000", categories: [{ name: "دهانات" }], stock_status: "instock", images: [{ src: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400", alt: "معجون" }] },
  { id: 33, name: "مسامير خرسانة", price: "35000", categories: [{ name: "مسامير" }], stock_status: "instock", images: [{ src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", alt: "مسامير خرسانة" }] },
  { id: 34, name: "مرايا حمام", price: "55000", categories: [{ name: "زجاج" }], stock_status: "instock", images: [{ src: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400", alt: "مرايا" }] },
  { id: 35, name: "باب حديدي مقوى", price: "225000", categories: [{ name: "أبواب" }], stock_status: "instock", images: [{ src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", alt: "باب حديدي" }] },
  { id: 36, name: "شبك أمان للشرفات", price: "155000", categories: [{ name: "شبك" }], stock_status: "instock", images: [{ src: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=400", alt: "شبك أمان" }] },

  // Continue adding more products up to 72 total (6 pages)...
  // Page 4
  { id: 37, name: "كتل خرسانية معزولة", price: "1800", categories: [{ name: "مواد البناء" }], stock_status: "instock", images: [{ src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", alt: "كتل معزولة" }] },
  { id: 38, name: "اسمنت مقاوم للأملاح", price: "16000", categories: [{ name: "اسمنت" }], stock_status: "instock", images: [{ src: "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400", alt: "اسمنت مقاوم" }] },
  { id: 39, name: "قضبان حديد 16 ملم", price: "950000", categories: [{ name: "حديد" }], stock_status: "instock", images: [{ src: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=400", alt: "قضبان حديد" }] },
  { id: 40, name: "حصى صغير مدكوك", price: "38000", categories: [{ name: "رمل وحصى" }], stock_status: "instock", images: [{ src: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400", alt: "حصى مدكوك" }] },
  { id: 41, name: "بلاط رخام كرارا", price: "185000", categories: [{ name: "بلاط" }], stock_status: "instock", images: [{ src: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400", alt: "رخام كرارا" }] },
  { id: 42, name: "خزان مياه 1000 لتر", price: "285000", categories: [{ name: "صحية" }], stock_status: "instock", images: [{ src: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400", alt: "خزان مياه" }] },
  { id: 43, name: "لوحة كهرباء رئيسية", price: "185000", categories: [{ name: "كهرباء" }], stock_status: "instock", images: [{ src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", alt: "لوحة كهرباء" }] },
  { id: 44, name: "دهان اكريليك ملون", price: "95000", categories: [{ name: "دهانات" }], stock_status: "instock", images: [{ src: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400", alt: "دهان اكريليك" }] },
  { id: 45, name: "مسامير التثبيت السريع", price: "28000", categories: [{ name: "مسامير" }], stock_status: "instock", images: [{ src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", alt: "مسامير تثبيت" }] },
  { id: 46, name: "زجاج ملون للديكور", price: "125000", categories: [{ name: "زجاج" }], stock_status: "instock", images: [{ src: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400", alt: "زجاج ملون" }] },
  { id: 47, name: "باب منزلق ألمنيوم", price: "325000", categories: [{ name: "أبواب" }], stock_status: "instock", images: [{ src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", alt: "باب منزلق" }] },
  { id: 48, name: "شبك حماية للحدائق", price: "75000", categories: [{ name: "شبك" }], stock_status: "instock", images: [{ src: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=400", alt: "شبك حدائق" }] },

  // Page 5
  { id: 49, name: "قواعد خرسانية جاهزة", price: "145000", categories: [{ name: "خرسانة" }], stock_status: "instock", images: [{ src: "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400", alt: "قواعد خرسانية" }] },
  { id: 50, name: "طوب رملي مضغوط", price: "380", categories: [{ name: "مواد البناء" }], stock_status: "instock", images: [{ src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", alt: "طوب رملي" }] },
  { id: 51, name: "قطاعات حديد مربعة", price: "185000", categories: [{ name: "حديد" }], stock_status: "instock", images: [{ src: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=400", alt: "قطاعات مربعة" }] },
  { id: 52, name: "رمل أحمر للطوب", price: "42000", categories: [{ name: "رمل وحصى" }], stock_status: "instock", images: [{ src: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400", alt: "رمل أحمر" }] },
  { id: 53, name: "بلاط موزاييك ملون", price: "155000", categories: [{ name: "بلاط" }], stock_status: "instock", images: [{ src: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400", alt: "موزاييك" }] },
  { id: 54, name: "مرحاض افرنجي", price: "185000", categories: [{ name: "صحية" }], stock_status: "instock", images: [{ src: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400", alt: "مرحاض" }] },
  { id: 55, name: "قاطع كهرباء رئيسي", price: "125000", categories: [{ name: "كهرباء" }], stock_status: "instock", images: [{ src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", alt: "قاطع كهرباء" }] },
  { id: 56, name: "أساس دهان أبيض", price: "65000", categories: [{ name: "دهانات" }], stock_status: "instock", images: [{ src: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400", alt: "أساس دهان" }] },
  { id: 57, name: "صواميل وبراغي متنوعة", price: "18000", categories: [{ name: "مسامير" }], stock_status: "instock", images: [{ src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", alt: "صواميل" }] },
  { id: 58, name: "واجهات زجاجية", price: "285000", categories: [{ name: "زجاج" }], stock_status: "instock", images: [{ src: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400", alt: "واجهات زجاجية" }] },
  { id: 59, name: "بوابة حديدية كبيرة", price: "485000", categories: [{ name: "أبواب" }], stock_status: "instock", images: [{ src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", alt: "بوابة حديدية" }] },
  { id: 60, name: "شبك تسليح للخرسانة", price: "165000", categories: [{ name: "شبك" }], stock_status: "instock", images: [{ src: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=400", alt: "شبك تسليح" }] },

  // Page 6 (Final page)
  { id: 61, name: "خلطة اسفلت جاهزة", price: "125000", categories: [{ name: "خرسانة" }], stock_status: "instock", images: [{ src: "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400", alt: "اسفلت" }] },
  { id: 62, name: "بلوك عازل للصوت", price: "2200", categories: [{ name: "مواد البناء" }], stock_status: "instock", images: [{ src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", alt: "بلوك عازل" }] },
  { id: 63, name: "سلك شائك للحماية", price: "85000", categories: [{ name: "حديد" }], stock_status: "instock", images: [{ src: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=400", alt: "سلك شائك" }] },
  { id: 64, name: "تراب أحمر للردم", price: "28000", categories: [{ name: "رمل وحصى" }], stock_status: "instock", images: [{ src: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400", alt: "تراب أحمر" }] },
  { id: 65, name: "بلاط حجر طبيعي", price: "225000", categories: [{ name: "بلاط" }], stock_status: "instock", images: [{ src: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400", alt: "حجر طبيعي" }] },
  { id: 66, name: "مغسلة رخام طبيعي", price: "325000", categories: [{ name: "صحية" }], stock_status: "instock", images: [{ src: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400", alt: "مغسلة رخام" }] },
  { id: 67, name: "كشاف LED خارجي", price: "95000", categories: [{ name: "كهرباء" }], stock_status: "instock", images: [{ src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", alt: "كشاف LED" }] },
  { id: 68, name: "دهان مقاوم للرطوبة", price: "145000", categories: [{ name: "دهانات" }], stock_status: "instock", images: [{ src: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400", alt: "دهان مقاوم" }] },
  { id: 69, name: "مسامير رش للمعادن", price: "32000", categories: [{ name: "مسامير" }], stock_status: "instock", images: [{ src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", alt: "مسامير رش" }] },
  { id: 70, name: "ألواح زجاج عاكسة", price: "185000", categories: [{ name: "زجاج" }], stock_status: "instock", images: [{ src: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400", alt: "زجاج عاكس" }] },
  { id: 71, name: "باب مصفح للخزائن", price: "225000", categories: [{ name: "أبواب" }], stock_status: "instock", images: [{ src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", alt: "باب مصفح" }] },
  { id: 72, name: "شبك زراعي بلاستيكي", price: "45000", categories: [{ name: "شبك" }], stock_status: "instock", images: [{ src: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=400", alt: "شبك زراعي" }] },
];

// Mock API function to simulate pagination
const fetchBuildingProducts = async (page: number, limit: number): Promise<Product[]> => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500));
  
  return mockBuildingProducts.slice(startIndex, endIndex);
};

interface InfiniteProductsSectionProps {
  title?: string;
}

const InfiniteProductsSection = ({ title = "كتالوج المنتجات" }: InfiniteProductsSectionProps) => {
  const fetchProducts = useCallback(fetchBuildingProducts, []);
  
  const {
    products,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    retry,
    setSentinelRef,
    loadMore,
    shouldShowLoadMoreButton
  } = useInfiniteScroll(fetchProducts, {
    productsPerPage: 12,
    maxProducts: 72,
    triggerDistance: 200,
    loadingDelay: 500,
    autoLoadLimit: 30 // Auto load only first 30 products
  });

  if (isLoading) {
    return (
      <div className="px-4 mb-6">
        <h3 className="text-lg font-bold mb-4 text-right text-gray-800">{title}</h3>
        <ProductSkeletonGrid count={12} />
      </div>
    );
  }

  if (error && products.length === 0) {
    return (
      <div className="px-4 mb-6">
        <h3 className="text-lg font-bold mb-4 text-right text-gray-800">{title}</h3>
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">حدث خطأ في تحميل المنتجات</p>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button 
            onClick={retry}
            variant="outline"
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            إعادة المحاولة
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 mb-6">
      <h3 className="text-lg font-bold mb-4 text-right text-gray-800">{title}</h3>
      
      {products.length > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-in"
                style={{ animationDelay: `${(index % 12) * 50}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* Loading more indicator */}
          {isLoadingMore && (
            <div className="mt-8">
              <ProductSkeletonGrid count={4} />
            </div>
          )}

          {/* Load More Button - shows after 30 products */}
          {shouldShowLoadMoreButton && hasMore && !isLoadingMore && (
            <div className="text-center mt-8">
              <Button
                onClick={loadMore}
                variant="outline"
                className="text-primary border-primary hover:bg-primary hover:text-primary-foreground px-8 py-3 text-lg font-medium"
              >
                عرض المزيد من المنتجات
              </Button>
            </div>
          )}

          {/* Sentinel element for intersection observer (only for initial auto-load) */}
          {hasMore && !isLoadingMore && !shouldShowLoadMoreButton && (
            <div
              ref={setSentinelRef}
              className="flex items-center justify-center py-8"
            >
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          )}

          {/* End of products message */}
          {!hasMore && products.length > 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600">تم عرض جميع المنتجات المتاحة</p>
              <p className="text-sm text-gray-500 mt-2">
                إجمالي {products.length} منتج
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">لا توجد منتجات متاحة حالياً</p>
          <p className="text-sm text-gray-500">يرجى المحاولة لاحقاً أو التحقق من الاتصال بالإنترنت</p>
        </div>
      )}
    </div>
  );
};

export default InfiniteProductsSection;