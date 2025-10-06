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
      <div className="bg-white rounded-xl p-2.5 text-center shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer hover:bg-gray-50">
        <div className="w-12 h-12 bg-gray-50 rounded-lg mx-auto mb-1.5 flex items-center justify-center overflow-hidden">
          {category.image && category.image.src ? (
            <img 
              src={category.image.src} 
              alt={category.image.alt || category.name}
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.innerHTML = '<span class="text-lg">📦</span>';
              }}
              className="w-full h-full object-contain"
            />
          ) : (
            <span className="text-lg">📦</span>
          )}
        </div>
        
        <h4 className="text-[11px] font-semibold text-gray-800 leading-tight mb-0.5 line-clamp-2">
          {category.name}
        </h4>
        <p className="text-[10px] text-gray-400">{category.count} منتج</p>
      </div>
    </Link>
  );

};

export default EnhancedCategoryCard;