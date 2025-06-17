
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
    <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
      <div className="w-16 h-16 bg-gray-50 rounded-lg mx-auto mb-3 flex items-center justify-center overflow-hidden">
        {category.image && category.image.src ? (
          <img 
            src={category.image.src} 
            alt={category.image.alt || category.name}
            className="w-full h-full object-contain"
          />
        ) : (
          <span className="text-2xl">📦</span>
        )}
      </div>
      <h4 className="text-sm font-medium text-gray-800 leading-tight">{category.name}</h4>
      <p className="text-xs text-gray-500 mt-1">{category.count} منتج</p>
    </div>
  );
};

export default CategoryCard;
