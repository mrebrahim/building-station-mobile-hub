import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-50 rtl">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <div className="w-6"></div>
          <h1 className="text-lg font-medium">من نحن</h1>
          <Link to="/profile">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </Link>
        </div>
      </header>

      <div className="p-4 pb-20">
        {/* Company Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-32 h-32 flex items-center justify-center rounded-full overflow-hidden bg-white shadow-lg">
            <img 
              src="/lovable-uploads/affbbcc3-4fa8-45ef-839a-50be03b7a27c.png" 
              alt="Building Station Logo" 
              className="w-28 h-28 object-contain"
            />
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <h2 className="text-xl font-bold mb-4 text-center">Building Station</h2>
          <p className="text-gray-700 leading-relaxed text-center mb-4">
            نحن أفضل سوق إلكتروني للأدوات ومواد البناء في المنطقة. نوفر لكم مجموعة واسعة من المنتجات عالية الجودة من أفضل العلامات التجارية العالمية والمحلية.
          </p>
          <p className="text-gray-700 leading-relaxed text-center">
            مهمتنا هي توفير تجربة شراء سهلة ومريحة لجميع احتياجاتكم من الأدوات والمعدات الصناعية والكهربائية ومواد البناء.
          </p>
        </div>

        {/* Our Services */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <h3 className="text-lg font-bold mb-4">خدماتنا</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <span className="text-gray-700">مجموعة واسعة من المنتجات</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <span className="text-gray-700">أسعار تنافسية</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <span className="text-gray-700">توصيل سريع وآمن</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <span className="text-gray-700">خدمة عملاء ممتازة</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <span className="text-gray-700">ضمان الجودة</span>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold mb-4">تواصل معنا</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📧</span>
              <span className="text-gray-700">info@building-station.com</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">📱</span>
              <a href="tel:+9647709257125" className="text-gray-700 hover:text-primary" dir="ltr">+964 770 925 7125</a>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">📍</span>
              <span className="text-gray-700">العراق</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
