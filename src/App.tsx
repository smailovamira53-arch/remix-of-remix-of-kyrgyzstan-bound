import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NomadGamesBanner } from "@/components/NomadGamesBanner";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import GuidesPage from "./pages/GuidesPage";
import TravelTipsPage from "./pages/TravelTipsPage";
import TourDetailPage from "./pages/TourDetailPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import AboutKyrgyzstanPage from "./pages/AboutKyrgyzstanPage";
import ContactPage from "./pages/ContactPage";
import ToursPage from "./pages/ToursPage";
import AdminPage from "./pages/AdminPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <NomadGamesBanner />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/guides" element={<GuidesPage />} />
          <Route path="/tours" element={<ToursPage />} />
          <Route path="/travel-tips" element={<TravelTipsPage />} />
          <Route path="/tours/:slug" element={<TourDetailPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/about" element={<AboutKyrgyzstanPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin" element={<AdminPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
