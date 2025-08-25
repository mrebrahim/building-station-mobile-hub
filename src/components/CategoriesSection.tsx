import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
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
  // Filter out shortcuts category from displayed categories
  const filteredCategories = categories.filter(cat => cat.name !== 'الاختصارات');

  return (
    <div className="px-4 mb-20">
      <div className="flex items-center justify-between mb-4">
        <Link to="/categories">
          <Button variant="outline" className="text-red-500 border-red-500 hover:bg-red-50 text-sm px-4 py-2">
            عرض الكل
          </Button>
        </Link>
        <h3 className="text-lg font-bold text-gray-800">تسوق حسب الفئة</h3>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-3 text-center shadow-sm animate-pulse border border-gray-100">
              <div className="w-14 h-14 bg-gray-200 rounded-xl mx-auto mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3 mx-auto"></div>
            </div>
          ))}
        </div>
      ) : filteredCategories.length > 0 ? (
        <div className="grid grid-cols-3 gap-3">
          {filteredCategories.map((category) => (
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
