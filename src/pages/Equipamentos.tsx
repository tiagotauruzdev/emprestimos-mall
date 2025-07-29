import { Button } from "@/components/ui/button";
import { Package, RotateCcw, User, LogOut } from "lucide-react";
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
      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-6xl font-bold text-foreground mb-8">
            Totem de Equipamentos
          </h1>
          <p className="text-2xl text-muted-foreground mb-16">
            Selecione uma opção para continuar
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Button
              size="lg"
              className="h-80 text-4xl font-bold bg-primary hover:bg-primary/90 flex flex-col items-center justify-center space-y-6"
              onClick={() => navigate('/selecionar-equipamento')}
            >
              <Package className="h-20 w-20" />
              <span>EMPRESTAR</span>
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              className="h-80 text-4xl font-bold border-2 hover:bg-muted flex flex-col items-center justify-center space-y-6"
              onClick={() => navigate('/devolver-equipamento')}
            >
              <RotateCcw className="h-20 w-20" />
              <span>DEVOLVER</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );


};

export default Equipamentos;