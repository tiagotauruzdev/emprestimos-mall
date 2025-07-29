import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AppProvider, useOperator } from "./contexts/AppContext";
import Navbar from "./components/Navbar";
import OperatorSelection from "./components/OperatorSelection";
import Index from "./pages/Index";
import Equipamentos from "./pages/Equipamentos";
import SelecionarEquipamento from "./pages/SelecionarEquipamento";
import DevolverEquipamento from "./pages/DevolverEquipamento";
import CadastrarCliente from "./pages/CadastrarCliente";
import ConfirmarEmprestimo from "./pages/ConfirmarEmprestimo";
import ComoFunciona from "./pages/ComoFunciona";
import Contato from "./pages/Contato";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const { operator } = useOperator();
  
  // Definir rotas do totem que precisam de operador selecionado
  const totemRoutes = [
    "/", 
    "/equipamentos", 
    "/selecionar-equipamento", 
    "/devolver-equipamento",
    "/cadastrar-cliente",
    "/confirmar-emprestimo",
    "/confirmar-devolucao"
  ];
  
  const isTotemRoute = totemRoutes.some(route => {
    if (route === "/") {
      return location.pathname === "/";
    }
    return location.pathname === route || location.pathname.startsWith(route + "/");
  });

  // Se não há operador selecionado e estamos em uma rota do totem, mostrar seleção
  if (!operator && isTotemRoute) {
    return <OperatorSelection />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {!isTotemRoute && <Navbar />}
      <main className="flex-1">
        <Routes>
          {/* Rotas do Totem */}
          <Route path="/" element={<Equipamentos />} />
          <Route path="/equipamentos" element={<Equipamentos />} />
          <Route path="/selecionar-equipamento" element={<SelecionarEquipamento />} />
          <Route path="/devolver-equipamento" element={<DevolverEquipamento />} />
          <Route path="/cadastrar-cliente/:equipmentType" element={<CadastrarCliente />} />
          <Route path="/confirmar-emprestimo" element={<ConfirmarEmprestimo />} />
          
          {/* Rotas do Site */}
          <Route path="/home" element={<Index />} />
          <Route path="/como-funciona" element={<ComoFunciona />} />
          <Route path="/contato" element={<Contato />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
