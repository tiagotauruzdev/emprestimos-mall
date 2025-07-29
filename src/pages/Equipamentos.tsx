import { Button } from "@/components/ui/button";
import { Package, RotateCcw, User, LogOut, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useOperator } from "@/contexts/AppContext";



const Equipamentos = () => {
  const navigate = useNavigate();
  const { operator, clearOperator } = useOperator();

  const handleOperatorChange = () => {
    clearOperator();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header com informações do operador */}
      <div className="bg-muted/30 border-b p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <User className="h-6 w-6 text-primary" />
            <div>
              <p className="font-semibold text-foreground">
                Operador: {operator?.nome}
              </p>
              <p className="text-sm text-muted-foreground">
                {operator?.posto_trabalho === 'espaco_familia' ? 'Espaço Família' : 'Espaço Pet'}
              </p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleOperatorChange}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Trocar Operador
          </Button>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden">
        {/* Background decorativo */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/30 dark:from-blue-950/20 dark:to-purple-950/20"></div>
        <div className="absolute top-20 right-20 w-4 h-4 bg-blue-400 rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-32 w-3 h-3 bg-purple-400 rounded-sm transform rotate-45 animate-bounce"></div>
        <div className="absolute bottom-20 left-20 w-2 h-8 bg-blue-500 animate-pulse"></div>
        <div className="absolute bottom-32 left-32 w-6 h-2 bg-purple-400 animate-bounce"></div>
        
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="mb-8 relative">
            <Sparkles className="h-8 w-8 text-blue-500 mx-auto mb-4 animate-pulse" />
            <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-4">
              ShopLend
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full mb-4"></div>
          </div>
          
          <p className="text-2xl text-muted-foreground mb-16 font-light">
            Sistema Inteligente de Empréstimos
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Botão Emprestar Modernizado */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <Button
                size="lg"
                className="relative h-80 w-full text-4xl font-bold bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0 rounded-2xl flex flex-col items-center justify-center space-y-6 transition-all duration-300 transform hover:scale-105 shadow-2xl"
                onClick={() => navigate('/selecionar-equipamento')}
              >
                <div className="relative">
                  <Package className="h-20 w-20 drop-shadow-lg" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-green-900">+</span>
                  </div>
                </div>
                <span className="drop-shadow-lg">EMPRESTAR</span>
                <div className="absolute bottom-4 text-sm font-normal opacity-75">
                  Solicitar equipamento
                </div>
              </Button>
            </div>
            
            {/* Botão Devolver Modernizado */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <Button
                size="lg"
                className="relative h-80 w-full text-4xl font-bold bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white border-0 rounded-2xl flex flex-col items-center justify-center space-y-6 transition-all duration-300 transform hover:scale-105 shadow-2xl"
                onClick={() => navigate('/devolver-equipamento')}
              >
                <div className="relative">
                  <RotateCcw className="h-20 w-20 drop-shadow-lg" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-orange-900">↵</span>
                  </div>
                </div>
                <span className="drop-shadow-lg">DEVOLVER</span>
                <div className="absolute bottom-4 text-sm font-normal opacity-75">
                  Retornar equipamento
                </div>
              </Button>
            </div>
          </div>
          
          {/* Indicadores de status */}
          <div className="mt-12 flex justify-center space-x-8 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span>Sistema Online</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span>Tempo Real</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
              <span>Seguro</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );


};

export default Equipamentos;