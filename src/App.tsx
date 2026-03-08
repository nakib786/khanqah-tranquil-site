import { ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import Index from "./pages/Index";
import Home from "./pages/Home";
import About from "./pages/About";
import Activities from "./pages/Activities";
import EventDetailPage from "./pages/EventDetailPage";
import TeachingsPage from "./pages/Teachings";
import TeachingDetail from "./pages/TeachingDetail";
import GalleryPage from "./pages/Gallery";
import Contact from "./pages/Contact";
import Iraadat from "./pages/Iraadat";
import AdminSetup from "./pages/AdminSetup";
import NotFound from "./pages/NotFound";
import BackgroundMusic from "./components/BackgroundMusic";
import WelcomeLightbox from "./components/WelcomeLightbox";
import { isValidLang } from "@/lib/i18n";

const queryClient = new QueryClient();

const LangGuard = ({ children }: { children: ReactNode }) => {
  const { lang } = useParams<{ lang: string }>();

  if (!isValidLang(lang)) {
    return <NotFound />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <WelcomeLightbox />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route
            path="/:lang"
            element={
              <LangGuard>
                <Home />
              </LangGuard>
            }
          />
          <Route
            path="/:lang/about"
            element={
              <LangGuard>
                <About />
              </LangGuard>
            }
          />
          <Route
            path="/:lang/activities"
            element={
              <LangGuard>
                <Activities />
              </LangGuard>
            }
          />
          <Route
            path="/:lang/activities/:slug"
            element={
              <LangGuard>
                <EventDetailPage />
              </LangGuard>
            }
          />
          <Route
            path="/:lang/teachings"
            element={
              <LangGuard>
                <TeachingsPage />
              </LangGuard>
            }
          />
          <Route
            path="/:lang/teachings/:slug"
            element={
              <LangGuard>
                <TeachingDetail />
              </LangGuard>
            }
          />
          <Route
            path="/:lang/gallery"
            element={
              <LangGuard>
                <GalleryPage />
              </LangGuard>
            }
          />
          <Route
            path="/:lang/contact"
            element={
              <LangGuard>
                <Contact />
              </LangGuard>
            }
          />
          <Route
            path="/:lang/iraadat"
            element={
              <LangGuard>
                <Iraadat />
              </LangGuard>
            }
          />
          <Route path="/admin/setup" element={<AdminSetup />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <BackgroundMusic />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
