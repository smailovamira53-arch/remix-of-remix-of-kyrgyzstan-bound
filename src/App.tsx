import { BannerProvider } from './context/BannerContext';
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
import NomadGamesPage from "./pages/NomadGamesPage";
import ExpeditionsPage from "./pages/ExpeditionsPage";
import AccommodationsPage from "./pages/AccommodationsPage";
import AccommodationDetailPage from "./pages/AccommodationDetailPage";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminTours from "./pages/admin/AdminTours";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminSettings from "./pages/admin/AdminSettings";
import WhatsAppWidget from "./components/WhatsAppWidget";

const queryClient = new QueryClient();

// App component
const App = () => (
  <QueryClientProvider client={queryClient}>
    <BannerProvider>
      <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <WhatsAppWidget />
        <Routes>
          {/* Public routes with banner */}
          <Route path="/" element={<><NomadGamesBanner /><Index /></>} />
          <Route path="/guides" element={<><NomadGamesBanner /><GuidesPage /></>} />
          <Route path="/tours" element={<><NomadGamesBanner /><ToursPage /></>} />
          <Route path="/travel-tips" element={<><NomadGamesBanner /><TravelTipsPage /></>} />
          <Route path="/tours/world-nomad-games-2026" element={<><NomadGamesBanner /><NomadGamesPage /></>} />
          <Route path="/tours/:slug" element={<><NomadGamesBanner /><TourDetailPage /></>} />
          <Route path="/search" element={<><NomadGamesBanner /><SearchResultsPage /></>} />
          <Route path="/about" element={<><NomadGamesBanner /><AboutKyrgyzstanPage /></>} />
          <Route path="/contact" element={<><NomadGamesBanner /><ContactPage /></>} />
          <Route path="/expeditions" element={<><NomadGamesBanner /><ExpeditionsPage /></>} />
          <Route path="/expeditions/:slug" element={<><NomadGamesBanner /><ExpeditionsPage /></>} />
          <Route path="/accommodations" element={<><NomadGamesBanner /><AccommodationsPage /></>} />
          <Route path="/accommodations/:slug" element={<><NomadGamesBanner /><AccommodationDetailPage /></>} />

          {/* Admin routes - no banner */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={null} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="tours" element={<AdminTours />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </BannerProvider>
  </QueryClientProvider>
);

export default App;
