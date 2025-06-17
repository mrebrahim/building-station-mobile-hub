
const Banner = () => {
  return (
    <div className="px-4 py-4">
      <div className="bg-gradient-to-r from-gray-800 to-gray-600 rounded-xl p-6 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-xl font-bold mb-2">"تصفح مجموعتنا"</h2>
          <p className="text-gray-200 text-sm">من أفضل الأدوات والمعدات</p>
        </div>
        <div className="absolute left-4 top-4 opacity-20">
          <div className="w-20 h-20 bg-white rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
