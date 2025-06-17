
import { Button } from "@/components/ui/button";
import CategoryCard from "./CategoryCard";

interface Category {
  id: number;
  name: string;
  count: number;
  image?: { src: string; alt?: string };
}

interface CategoriesSectionProps {
  categories: Category[];
  isLoading: boolean;
}

const CategoriesSection = ({ categories, isLoading }: CategoriesSectionProps) => {
  return (
    <div className="px-4 mb-20">
      <div className="flex items-center justify-between mb-4">
        <Button variant="outline" className="text-red-500 border-red-500 hover:bg-red-50">
          عرض الكل
        </Button>
        <h3 className="text-lg font-bold text-gray-800">تسوق حسب الفئة</h3>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-xl p-4 text-center shadow-sm animate-pulse border border-gray-100">
              <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-3"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : categories.length > 0 ? (
        <div className="grid grid-cols-3 gap-4">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">لا توجد فئات متاحة حالياً</p>
          <p className="text-sm text-gray-500">يرجى المحاولة لاحقاً أو التحقق من الاتصال بالإنترنت</p>
        </div>
      )}
    </div>
  );
};

export default CategoriesSection;
