
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
      <div className="bg-white rounded-xl p-2.5 text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
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
        <h4 className="text-[11px] font-semibold text-gray-800 leading-tight mb-0.5 line-clamp-2">{category.name}</h4>
        <p className="text-[10px] text-gray-400">{category.count} منتج</p>
      </div>
    </Link>
  );
};

export default CategoryCard;
