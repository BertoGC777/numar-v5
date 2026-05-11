import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/context/CartContext";
import Index from "./pages/Index.tsx";
import Catalog from "./pages/Catalog.tsx";
import ProductPage from "./pages/ProductPage.tsx";
import Account from "./pages/Account.tsx";
import Search from "./pages/Search.tsx";
import Checkout from "./pages/Checkout.tsx";
import Privacidade from "./pages/Privacidade.tsx";
import Termos from "./pages/Termos.tsx";
import Trocas from "./pages/Trocas.tsx";
import FAQ from "./pages/FAQ.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/catalogo" element={<Catalog />} />
            <Route path="/catalogo/:categoria" element={<Catalog />} />
            <Route path="/produto/:slug" element={<ProductPage />} />
            <Route path="/conta" element={<Account />} />
            <Route path="/busca" element={<Search />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/privacidade" element={<Privacidade />} />
            <Route path="/termos" element={<Termos />} />
            <Route path="/trocas-e-devolucoes" element={<Trocas />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
