
import { Link } from "react-router-dom";

interface Category {
  id: number;
  name: string;
  count: number;
  image?: { src: string; alt?: string };
}

interface CategoryCardProps {
  category: Category;
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  return (
    <Link to={`/category/${category.id}`} className="block">
      <div className="bg-white rounded-2xl p-3 text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
        <div className="w-14 h-14 bg-gray-50 rounded-xl mx-auto mb-2 flex items-center justify-center overflow-hidden">
          {category.image && category.image.src ? (
            <img 
              src={category.image.src} 
              alt={category.image.alt || category.name}
              loading="lazy"
              onError={(e) => {
                console.error("Category image failed to load:", e.currentTarget.src);
                // Show a category box emoji as fallback instead of another image
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.innerHTML = '<span class="text-xl">📦</span>';
              }}
              onLoad={() => console.log("Successfully loaded category image:", category.image?.src)}
              className="w-full h-full object-contain"
            />
          ) : (
            <span className="text-xl">📦</span>
          )}
        </div>
        <h4 className="text-xs font-semibold text-gray-800 leading-tight mb-1">{category.name}</h4>
        <p className="text-xs text-gray-400">{category.count} منتج</p>
      </div>
    </Link>
  );
};

export default CategoryCard;
