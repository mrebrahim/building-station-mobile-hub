
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import HelpButton from "./HelpButton";

const BrandsHeader = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    console.log('Back button clicked');
    // Try to go back in history, if no history go to home
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="flex items-center justify-between p-4">
        <button 
          onClick={handleBackClick}
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="العودة للخلف"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        
        <div className="flex-1"></div>
        
        <HelpButton />
      </div>
    </header>
  );
};

export default BrandsHeader;
