import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Hermes from "./pages/Hermes";
import ExampleReport from "./pages/ExampleReport";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Demo from "./pages/Demo";
import AboutUs from "./pages/AboutUs";
import GDPRSettings from "./pages/GDPRSettings";
import NotFound from "./pages/NotFound";

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
            <Route path="/hermes" element={<Hermes />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/demo" element={<Demo />} />
            <Route path="/om-oss" element={<AboutUs />} />
            <Route path="/gdpr" element={<GDPRSettings />} />
            <Route path="/exempelrapport" element={<ExampleReport />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
