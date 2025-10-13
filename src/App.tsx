import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ChatBot } from "@/components/ChatBot";
import Index from "./pages/Index";
import ExampleReport from "./pages/ExampleReport";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import DashboardPackages from "./pages/DashboardPackages";
import CustomDashboard from "./pages/CustomDashboard";
import Demo from "./pages/Demo";
import AboutUs from "./pages/AboutUs";
import GDPRSettings from "./pages/GDPRSettings";
import Legal from "./pages/Legal";
import NotFound from "./pages/NotFound";
import { DashboardLayout } from "./components/dashboard/DashboardLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
            <Route path="/dashboard/packages" element={<DashboardLayout><DashboardPackages /></DashboardLayout>} />
            <Route path="/dashboard/custom" element={<DashboardLayout><CustomDashboard /></DashboardLayout>} />
            <Route path="/dashboard/settings" element={<DashboardLayout><GDPRSettings /></DashboardLayout>} />
            <Route path="/demo" element={<Demo />} />
            <Route path="/om-oss" element={<AboutUs />} />
            <Route path="/gdpr" element={<GDPRSettings />} />
            <Route path="/regelverk" element={<Legal />} />
            <Route path="/exempelrapport" element={<ExampleReport />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ChatBot />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
