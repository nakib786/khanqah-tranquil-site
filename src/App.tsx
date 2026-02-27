import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Home from "./pages/Home";
import About from "./pages/About";
import Activities from "./pages/Activities";
import TeachingsPage from "./pages/Teachings";
import TeachingDetail from "./pages/TeachingDetail";
import GalleryPage from "./pages/Gallery";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import BackgroundMusic from "./components/BackgroundMusic";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/:lang" element={<Home />} />
          <Route path="/:lang/about" element={<About />} />
          <Route path="/:lang/activities" element={<Activities />} />
          <Route path="/:lang/teachings" element={<TeachingsPage />} />
          <Route path="/:lang/teachings/:slug" element={<TeachingDetail />} />
          <Route path="/:lang/gallery" element={<GalleryPage />} />
          <Route path="/:lang/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <BackgroundMusic />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
