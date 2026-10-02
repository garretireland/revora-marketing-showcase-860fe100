import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Index from "./pages/Index";
import Guarantee from "./pages/Guarantee";
import About from "./pages/About";
import CaseStudies from "./pages/CaseStudies";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import NotFound from "./pages/NotFound";
// /concept/* routes are development/reference tools: lazy-loaded so the
// public site never pays their JS cost. (NorthlineRoofing: isolated
// production-design sandbox -- see its own header comment.)
const NorthlineRoofing = lazy(() => import("./pages/concept/NorthlineRoofing"));
const LeadJourneyPreview = lazy(() => import("./pages/concept/LeadJourneyPreview"));
const ContractorLeadPreview = lazy(() => import("./pages/concept/ContractorLeadPreview"));
const LeadDeliveryPreview = lazy(() => import("./pages/concept/LeadDeliveryPreview"));
const AcquisitionScrollPreview = lazy(() => import("./pages/concept/AcquisitionScrollPreview"));
const AcquisitionFilmRender = lazy(() => import("./pages/concept/AcquisitionFilmRender"));
const WebsiteTransformationPreview = lazy(() => import("./pages/concept/WebsiteTransformationPreview"));
const WebsiteConceptPreview = lazy(() => import("./pages/concept/WebsiteConceptPreview"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/guarantee" element={<Guarantee />} />
          <Route path="/about" element={<About />} />
          <Route path="/case-studies" element={<CaseStudies />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          {/* prototype/review routes: local development only (their media is not deployed) */}
          {import.meta.env.DEV && (
            <>
            <Route path="/concept/northline" element={<NorthlineRoofing />} />
            <Route path="/concept/lead-journey" element={<LeadJourneyPreview />} />
            <Route path="/concept/contractor-lead" element={<ContractorLeadPreview />} />
            <Route path="/concept/lead-delivery" element={<LeadDeliveryPreview />} />
            <Route path="/concept/acquisition-scroll" element={<AcquisitionScrollPreview />} />
            <Route path="/concept/acquisition-film-render" element={<AcquisitionFilmRender />} />
            <Route path="/concept/website-transformation" element={<WebsiteTransformationPreview />} />
            <Route path="/concept/ashgrove" element={<WebsiteConceptPreview concept="ashgrove" />} />
            <Route path="/concept/calder" element={<WebsiteConceptPreview concept="calder" />} />
            </>
          )}
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
