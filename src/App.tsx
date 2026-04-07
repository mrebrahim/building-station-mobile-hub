
import { useRealTimeUpdates } from "@/hooks/useWooCommerceData";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { App as CapacitorApp } from '@capacitor/app';
import Index from "./pages/Index";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import Notifications from "./pages/Notifications";
import FAQ from "./pages/FAQ";
import Product from "./pages/Product";
import Categories from "./pages/Categories";
import CategoryProducts from "./pages/CategoryProducts";
import SubCategories from "./pages/SubCategories";
import Brands from "./pages/Brands";
import PurchaseRequest from "./pages/PurchaseRequest";
import BecomeSupplier from "./pages/BecomeSupplier";
import Favorites from "./pages/Favorites";
import NoInternet from "./pages/NoInternet";
import NotFound from "./pages/NotFound";
import Partners from "./pages/Partners";
import SyncDashboard from "./pages/SyncDashboard";
import AboutUs from "./pages/AboutUs";
import MyCourses from "./pages/MyCourses";
import AllCourses from "./pages/AllCourses";
import BottomNavigation from "./components/BottomNavigation";

// Component to handle real-time updates
const RealTimeProvider = ({ children }: { children: React.ReactNode }) => {
  useRealTimeUpdates();
  return <>{children}</>;
};

// Back button handler component for mobile devices
const BackButtonHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let listenerHandle: any;

    const setupListener = async () => {
      listenerHandle = await CapacitorApp.addListener('backButton', ({ canGoBack }) => {
        if (location.pathname === '/' || !canGoBack) {
          CapacitorApp.exitApp();
        } else {
          navigate(-1);
        }
      });
    };

    setupListener();

    return () => {
      if (listenerHandle) {
        listenerHandle.remove();
      }
    };
  }, [navigate, location]);

  return null;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000, // 30 seconds
      gcTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: true,
      refetchOnMount: true,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <RealTimeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <BackButtonHandler />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/subcategories/:categoryId" element={<SubCategories />} />
            <Route path="/category/:categoryId" element={<CategoryProducts />} />
            <Route path="/brands" element={<Brands />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/purchase-request" element={<PurchaseRequest />} />
            <Route path="/become-supplier" element={<BecomeSupplier />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/my-courses" element={<MyCourses />} />
            <Route path="/all-courses" element={<AllCourses />} />
            <Route path="/sync-dashboard" element={<SyncDashboard />} />
            <Route path="/no-internet" element={<NoInternet />} />
            <Route path="/partners" element={<Partners />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <BottomNavigation />
        </BrowserRouter>
      </TooltipProvider>
    </RealTimeProvider>
  </QueryClientProvider>
);

export default App;
