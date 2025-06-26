
import { useNavigate } from "react-router-dom";

const ShortcutsGrid = () => {
  const navigate = useNavigate();
  
  const shortcuts = [
    { 
      name: "كن موردا", 
      icon: "🏪", 
      bgColor: "bg-gray-50",
      action: () => navigate('/become-supplier')
    },
    { 
      name: "طلب المشتريات", 
      icon: "🛍️", 
      bgColor: "bg-gray-50",
      action: () => navigate('/purchase-request')
    },
    { 
      name: "قائمة التسعير", 
      icon: "📋", 
      bgColor: "bg-gray-50", 
      hasNotification: true,
      action: () => navigate('/cart')
    },
    { 
      name: "هدايا الأعمال", 
      icon: "🎁", 
      bgColor: "bg-gray-50",
      action: () => console.log('Business gifts clicked')
    }
  ];

  return (
    <div className="px-4 mb-6">
      <h3 className="text-lg font-bold mb-4 text-right">الاختصارات</h3>
      <div className="grid grid-cols-4 gap-3">
        {shortcuts.map((shortcut, index) => (
          <button 
            key={index} 
            className="text-center"
            onClick={shortcut.action}
          >
            <div className={`relative ${shortcut.bgColor} rounded-xl p-4 mb-2 border border-gray-100 hover:bg-gray-100 transition-colors`}>
              <div className="text-2xl">{shortcut.icon}</div>
              {shortcut.hasNotification && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  0
                </div>
              )}
            </div>
            <span className="text-xs text-gray-700 font-medium">{shortcut.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ShortcutsGrid;
