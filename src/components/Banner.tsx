
import { Link } from "react-router-dom";

const Banner = () => {
  return (
    <div className="px-4 py-4">
      <div className="grid grid-cols-2 gap-3">
        {/* First Banner - Navigate to Categories */}
        <Link to="/categories" className="block">
          <div className="relative overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
            <img 
              src="/lovable-uploads/86d58d52-96fe-4e34-946e-66010b49a622.png"
              alt="مجموعتنا - Building Station"
              className="w-full h-32 sm:h-40 object-cover"
            />
          </div>
        </Link>

        {/* Second Banner - Navigate to Brands */}
        <Link to="/brands" className="block">
          <div className="relative overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
            <img 
              src="/lovable-uploads/d7aa46b0-6cd7-4fbb-9007-dbad270642a1.png"
              alt="أفضل الماركات العالمية"
              className="w-full h-32 sm:h-40 object-cover"
            />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Banner;
