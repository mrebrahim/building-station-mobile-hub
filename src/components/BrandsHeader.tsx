
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BrandsHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="flex items-center justify-between p-4">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        
        <div className="flex-1"></div>
        <div className="w-10"></div>
      </div>
    </header>
  );
};

export default BrandsHeader;
