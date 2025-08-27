import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { categoriesService } from "@/services/woocommerce/categories";
import { Category } from "@/services/woocommerce/types";

interface EnhancedCategoryCardProps {
  category: Category & { parent?: number };
}

const EnhancedCategoryCard = ({ category }: EnhancedCategoryCardProps) => {
  const [hasChildren, setHasChildren] = useState(false);

  useEffect(() => {
    const checkSubcategories = async () => {
      const hasSubcats = await categoriesService.hasSubcategories(category.id);
      setHasChildren(hasSubcats);
    };
    checkSubcategories();
  }, [category.id]);

  // Determine the link destination
  const linkTo = hasChildren ? `/subcategories/${category.id}` : `/category/${category.id}`;

  return (
    <Link to={linkTo} className="block">
      <div className="bg-white rounded-2xl p-3 text-center shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer hover:bg-gray-50">
        <div className="w-14 h-14 bg-gray-50 rounded-xl mx-auto mb-2 flex items-center justify-center overflow-hidden">
          {category.image && category.image.src ? (
            <img 
              src={category.image.src} 
              alt={category.image.alt || category.name}
              loading="lazy"
              onError={(e) => {
                console.error("Category image failed to load:", e.currentTarget.src);
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.innerHTML = '<span class="text-xl">📦</span>';
              }}
              className="w-full h-full object-contain"
            />
          ) : (
            <span className="text-xl">📦</span>
          )}
        </div>
        
        <h4 className="text-xs font-semibold text-gray-800 leading-tight mb-1">
          {category.name}
        </h4>
        <p className="text-xs text-gray-400">{category.count} منتج</p>
      </div>
    </Link>
  );

};

export default EnhancedCategoryCard;