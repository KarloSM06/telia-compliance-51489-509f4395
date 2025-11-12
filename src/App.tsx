import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AboutUs from "./pages/AboutUs";
import Paket from "./pages/Paket";
import GDPRSettings from "./pages/GDPRSettings";
import Legal from "./pages/Legal";
import NotFound from "./pages/NotFound";
import Unsubscribe from "./pages/Unsubscribe";

// Optimized QueryClient configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/om-oss" element={<AboutUs />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/paket" element={<Paket />} />
              <Route path="/gdpr" element={<GDPRSettings />} />
              <Route path="/regelverk" element={<Legal />} />
              <Route path="/unsubscribe" element={<Unsubscribe />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
