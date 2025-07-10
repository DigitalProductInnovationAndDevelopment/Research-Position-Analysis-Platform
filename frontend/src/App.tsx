import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Search from "./pages/Search";
import Trends from "./pages/Trends";
import Clustering from "./pages/Clustering";
import Collaboration from "./pages/Collaboration";
import NotFound from "./pages/NotFound";
import LogoHeader from "./components/LogoHeader";
import Worldmap from "./pages/Worldmap";
import LearnMore from "./pages/LearnMore";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <LogoHeader />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/search" element={<Search />} />
          <Route path="/trends" element={<Trends />} />
          <Route path="/clustering" element={<Clustering />} />
          <Route path="/collaboration" element={<Collaboration />} />
          <Route path="/worldmap" element={<Worldmap />} />
          <Route path="/learn-more" element={<LearnMore />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
