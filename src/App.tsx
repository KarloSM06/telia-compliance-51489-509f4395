import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ChatBot } from "@/components/ChatBot";
import { lazy, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useLenis } from "@/hooks/useLenis";

// Lazy load all routes for better performance
const Index = lazy(() => import("./pages/Index"));
const ExampleReport = lazy(() => import("./pages/ExampleReport"));
const Auth = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const DashboardPackages = lazy(() => import("./pages/DashboardPackages"));
const CustomDashboard = lazy(() => import("./pages/CustomDashboard"));
const UnifiedSettings = lazy(() => import("./pages/UnifiedSettings"));
const Demo = lazy(() => import("./pages/Demo"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const GDPRSettings = lazy(() => import("./pages/GDPRSettings"));
const Legal = lazy(() => import("./pages/Legal"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Checkout = lazy(() => import("./pages/Checkout"));
const DashboardAnalytics = lazy(() => import("./pages/DashboardAnalytics"));
const KronoPage = lazy(() => import("./pages/KronoPage"));
const GastroPage = lazy(() => import("./pages/GastroPage"));
const TalentPage = lazy(() => import("./pages/TalentPage"));
const LeadPage = lazy(() => import("./pages/LeadPage"));
const ThorPage = lazy(() => import("./pages/ThorPage"));
const EkoPage = lazy(() => import("./pages/EkoPage"));
const CalendarPage = lazy(() => import("./pages/CalendarPage"));
const Notifications = lazy(() => import("./pages/Notifications"));
const SMSPage = lazy(() => import("./pages/SMSPage"));
const EmailPage = lazy(() => import("./pages/EmailPage"));
const CompanyProfile = lazy(() => import("./pages/CompanyProfile"));
const ReviewDashboard = lazy(() => import("./pages/ReviewDashboard"));
const Unsubscribe = lazy(() => import("./pages/Unsubscribe"));
const TelephonyPage = lazy(() => import("./pages/TelephonyPage"));
// Removed - redirects to UnifiedSettings
const OpenRouterDashboard = lazy(() => import("./pages/OpenRouterDashboard"));
const DashboardLayout = lazy(() => import("./components/dashboard/DashboardLayout").then(m => ({ default: m.DashboardLayout })));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="space-y-4 w-full max-w-2xl px-4">
      <Skeleton className="h-12 w-3/4" />
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-64 w-full" />
    </div>
  </div>
);

// Optimized QueryClient configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (replaces cacheTime)
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => {
  useLenis();
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
              {/* FAS 2: Redirect /analytics to /dashboard */}
              <Route path="/dashboard/analytics" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
              <Route path="/dashboard/packages" element={<DashboardLayout><DashboardPackages /></DashboardLayout>} />
              <Route path="/dashboard/custom" element={<DashboardLayout><CustomDashboard /></DashboardLayout>} />
              <Route path="/dashboard/settings" element={<DashboardLayout><UnifiedSettings /></DashboardLayout>} />
              <Route path="/dashboard/krono" element={<DashboardLayout><KronoPage /></DashboardLayout>} />
              <Route path="/dashboard/gastro" element={<DashboardLayout><GastroPage /></DashboardLayout>} />
              <Route path="/dashboard/talent" element={<DashboardLayout><TalentPage /></DashboardLayout>} />
              <Route path="/dashboard/lead" element={<DashboardLayout><LeadPage /></DashboardLayout>} />
              <Route path="/dashboard/thor" element={<DashboardLayout><ThorPage /></DashboardLayout>} />
              <Route path="/dashboard/eko" element={<DashboardLayout><EkoPage /></DashboardLayout>} />
              <Route path="/dashboard/calendar" element={<DashboardLayout><CalendarPage /></DashboardLayout>} />
            <Route path="/dashboard/notifications" element={<DashboardLayout><Notifications /></DashboardLayout>} />
            <Route path="/dashboard/sms" element={<DashboardLayout><SMSPage /></DashboardLayout>} />
            <Route path="/dashboard/email" element={<DashboardLayout><EmailPage /></DashboardLayout>} />
              <Route path="/dashboard/company" element={<DashboardLayout><CompanyProfile /></DashboardLayout>} />
              <Route path="/dashboard/reviews" element={<DashboardLayout><ReviewDashboard /></DashboardLayout>} />
              <Route path="/dashboard/telephony" element={<DashboardLayout><TelephonyPage /></DashboardLayout>} />
              <Route path="/dashboard/integrations" element={<Navigate to="/dashboard/settings?tab=integrationer" replace />} />
              <Route path="/dashboard/openrouter" element={<DashboardLayout><OpenRouterDashboard /></DashboardLayout>} />
              <Route path="/unsubscribe" element={<Unsubscribe />} />
              <Route path="/demo" element={<Demo />} />
              <Route path="/om-oss" element={<AboutUs />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/gdpr" element={<GDPRSettings />} />
              <Route path="/regelverk" element={<Legal />} />
              <Route path="/exempelrapport" element={<ExampleReport />} />
              <Route path="/checkout" element={<Checkout />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <ChatBot />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
  );
};

export default App;
