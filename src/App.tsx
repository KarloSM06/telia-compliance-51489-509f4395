import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useLenis } from "@/hooks/useLenis";

// Lazy load routes
const Index = lazy(() => import("./pages/Index"));
const ExampleReport = lazy(() => import("./pages/ExampleReport"));
const Demo = lazy(() => import("./pages/Demo"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const GDPRSettings = lazy(() => import("./pages/GDPRSettings"));
const Legal = lazy(() => import("./pages/Legal"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Unsubscribe = lazy(() => import("./pages/Unsubscribe"));

// Service pages
const AIReceptionist = lazy(() => import("./pages/services/AIReceptionist"));
const AIModels = lazy(() => import("./pages/services/AIModels"));
const AIVoiceSystems = lazy(() => import("./pages/services/AIVoiceSystems"));
const Automations = lazy(() => import("./pages/services/Automations"));
const CRMAnalytics = lazy(() => import("./pages/services/CRMAnalytics"));
const QuoteInvoice = lazy(() => import("./pages/services/QuoteInvoice"));
const PromptEngineering = lazy(() => import("./pages/services/PromptEngineering"));
const RAGAgents = lazy(() => import("./pages/services/RAGAgents"));
const Ecosystems = lazy(() => import("./pages/services/Ecosystems"));

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
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => {
  useLenis();
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/demo" element={<Demo />} />
              <Route path="/om-oss" element={<AboutUs />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/gdpr" element={<GDPRSettings />} />
              <Route path="/regelverk" element={<Legal />} />
              <Route path="/exempelrapport" element={<ExampleReport />} />
              <Route path="/unsubscribe" element={<Unsubscribe />} />
              
              {/* Service pages */}
              <Route path="/tjanster/ai-receptionist" element={<AIReceptionist />} />
              <Route path="/tjanster/ai-modeller" element={<AIModels />} />
              <Route path="/tjanster/ai-rostsystem" element={<AIVoiceSystems />} />
              <Route path="/tjanster/automatisering" element={<Automations />} />
              <Route path="/tjanster/crm-analytics" element={<CRMAnalytics />} />
              <Route path="/tjanster/offert-faktura" element={<QuoteInvoice />} />
              <Route path="/tjanster/prompt-engineering" element={<PromptEngineering />} />
              <Route path="/tjanster/rag-agenter" element={<RAGAgents />} />
              <Route path="/tjanster/ekosystem" element={<Ecosystems />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
