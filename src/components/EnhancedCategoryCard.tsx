import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";
import { categoriesService } from "@/services/woocommerce/categories";
import { Category } from "@/services/woocommerce/types";

interface EnhancedCategoryCardProps {
  category: Category & { parent?: number };
  onSubcategoryClick?: (subcategories: Category[]) => void;
  showSubcategories?: boolean;
  level?: number;
}

const EnhancedCategoryCard = ({ 
  category, 
  onSubcategoryClick, 
  showSubcategories = false,
  level = 0 
}: EnhancedCategoryCardProps) => {
  const [hasChildren, setHasChildren] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkSubcategories = async () => {
      const hasSubcats = await categoriesService.hasSubcategories(category.id);
      setHasChildren(hasSubcats);
    };
    checkSubcategories();
  }, [category.id]);

  const handleCategoryClick = async (e: React.MouseEvent) => {
    if (hasChildren && level === 0) {
      e.preventDefault();
      setIsLoading(true);
      try {
        if (!isExpanded) {
          const subs = await categoriesService.getSubcategories(category.id);
          setSubcategories(subs);
          if (onSubcategoryClick) {
            onSubcategoryClick(subs);
          }
        }
        setIsExpanded(!isExpanded);
      } catch (error) {
        console.error('Error fetching subcategories:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const cardContent = (
    <div 
      className={`
        bg-white rounded-2xl p-3 text-center shadow-sm border border-gray-100 
        hover:shadow-lg transition-all duration-300 cursor-pointer category-card focus-ring
        ${level > 0 ? 'ml-4 border-r-4 border-r-blue-200 subcategory-slide-in' : ''}
        ${isExpanded ? 'shadow-lg ring-2 ring-blue-100' : ''}
        ${hasChildren && level === 0 ? 'hover:bg-blue-50' : 'hover:bg-gray-50'}
      `}
      onClick={handleCategoryClick}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCategoryClick(e as any);
        }
      }}
      role="button"
      aria-expanded={hasChildren ? isExpanded : undefined}
      aria-label={`${category.name} - ${category.count} منتج${hasChildren ? (isExpanded ? ' (موقع)' : ' (قابل للتوسيع)') : ''}`}
    >
      <div className="relative">
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
        
        {/* Subcategory Indicator */}
        {hasChildren && level === 0 && (
          <div className={`
            absolute -top-1 -right-1 w-6 h-6 bg-blue-500 text-white text-xs rounded-full 
            flex items-center justify-center category-indicator
            ${isExpanded ? 'expanded' : ''}
            ${!isLoading ? 'animate-pulse' : ''}
          `}>
            {isLoading ? (
              <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
            ) : isExpanded ? (
              <ChevronDown className="w-3 h-3 transition-transform duration-200" />
            ) : (
              <ChevronRight className="w-3 h-3 transition-transform duration-200" />
            )}
          </div>
        )}
      </div>
      
      <h4 className="text-xs font-semibold text-gray-800 leading-tight mb-1">
        {category.name}
      </h4>
      <p className="text-xs text-gray-400">{category.count} منتج</p>
    </div>
  );

  if (hasChildren && level === 0) {
    return (
      <div className="space-y-2">
        {cardContent}
        
        {/* Subcategories */}
        {isExpanded && subcategories.length > 0 && (
          <div className="space-y-2 animate-fade-in subcategory-fade-in">
            {subcategories.map((subcat) => (
              <Link key={subcat.id} to={`/category/${subcat.id}`} className="block">
                <EnhancedCategoryCard 
                  category={subcat} 
                  level={level + 1}
                  showSubcategories={false}
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link to={`/category/${category.id}`} className="block">
      {cardContent}
    </Link>
  );
};

export default EnhancedCategoryCard;