
import { RefreshCw, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const NoInternet = () => {
  const handleRetry = () => {
    // Refresh the entire application
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Decorative dots pattern */}
        <div className="flex justify-end mb-8">
          <div className="grid grid-cols-3 gap-2">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i < 6 ? 'bg-gray-300' : 'bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>

        <Card className="shadow-lg border-0 bg-white">
          <CardContent className="p-8 text-center">
            {/* No Internet Icon */}
            <div className="mb-6">
              <WifiOff className="w-16 h-16 mx-auto text-gray-600" />
            </div>

            {/* Title */}
            <h1 className="text-xl font-semibold text-gray-800 mb-4">
              عذراً! لا يوجد اتصال بالإنترنت!
            </h1>

            {/* Description */}
            <div className="text-gray-600 mb-8 space-y-1">
              <p>يبدو أنك تواجه انقطاعاً مؤقتاً</p>
              <p>في الشبكة.</p>
              <p>يرجى التحقق من اتصالك بالإنترنت.</p>
            </div>

            {/* Retry Button */}
            <Button
              onClick={handleRetry}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full flex items-center gap-2 mx-auto"
            >
              <RefreshCw className="w-4 h-4" />
              إعادة المحاولة
            </Button>
          </CardContent>
        </Card>

        {/* Decorative circle */}
        <div className="fixed bottom-0 right-0 w-32 h-32 bg-red-400 rounded-tl-full opacity-80 -z-10"></div>
      </div>
    </div>
  );
};

export default NoInternet;
