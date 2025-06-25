
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const CheckoutHeader = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="flex items-center justify-between p-4">
        <div></div>
        <h1 className="text-lg font-medium">إتمام الشراء</h1>
        <Link to="/cart">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </Link>
      </div>
    </header>
  );
};

export default CheckoutHeader;
