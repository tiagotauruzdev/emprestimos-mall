import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, ArrowLeft, Package, RefreshCw, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLoading } from "@/contexts/AppContext";
import { useEquipmentStatus } from "@/hooks/useEquipmentStatus";
import { useEquipmentAvailability } from "@/hooks/useEquipmentAvailability";

// Helper functions for equipment display
const getEquipmentIcon = (tipo: string) => {
  switch (tipo) {
    case 'carrinho_bebe':
      return '🍼';
    case 'carrinho_pet':
      return '🐕';
    case 'cadeira_rodas':
      return '🦽';
    default:
      return '📦';
  }
};

const getEquipmentName = (tipo: string) => {
  switch (tipo) {
    case 'carrinho_bebe':
      return 'Carrinho de Bebê';
    case 'carrinho_pet':
      return 'Carrinho de Pet';
    case 'cadeira_rodas':
      return 'Cadeira de Rodas';
    default:
      return tipo;
  }
};

const getEquipmentDescription = (tipo: string) => {
  switch (tipo) {
    case 'carrinho_bebe':
      return 'Carrinho para facilitar compras com crianças';
    case 'carrinho_pet':
      return 'Carrinho especial para transporte de pets pequenos';
    case 'cadeira_rodas':
      return 'Cadeira de rodas manual para maior mobilidade';
    default:
      return 'Equipamento disponível para empréstimo';
  }
};

const SelecionarEquipamento = () => {
  const navigate = useNavigate();
  const { loading, error } = useLoading();
  const { 
    equipments, 
    availability, 
    getEquipmentAvailability,
    refetch 
  } = useEquipmentStatus();
  
  const { 
    checking, 
    checkAndReserve 
  } = useEquipmentAvailability();

  // Agrupar equipamentos por tipo para exibição
  const getEquipmentTypes = () => {
    const types = new Set(equipments.map(eq => eq.tipo_equipamento));
    return Array.from(types).map(tipo => {
      const availabilityInfo = getEquipmentAvailability(tipo);
      const availableCount = availabilityInfo?.disponiveis || 0;
      const totalCount = availabilityInfo?.total || 0;
      
      return {
        tipo,
        name: getEquipmentName(tipo),
        description: getEquipmentDescription(tipo),
        icon: getEquipmentIcon(tipo),
        availableCount,
        totalCount,
        maxDuration: '3 horas' // TODO: buscar do banco de dados
      };
    });
  };

  const handleEquipmentSelect = async (equipmentType: string) => {
    try {
      // Verificar disponibilidade e reservar equipamento
      const result = await checkAndReserve(equipmentType);
      
      if (result.success && result.equipmentId) {
        // Navegar para cadastro com equipamento reservado
        navigate(`/cadastrar-cliente/${equipmentType}`, {
          state: { 
            reservedEquipmentId: result.equipmentId,
            availabilityInfo: result.availabilityInfo
          }
        });
      } else {
        // Mostrar mensagem de erro ou indisponibilidade
        alert(result.message); // TODO: Substituir por toast/notification
        
        // Atualizar dados para refletir mudanças
        refetch();
      }
    } catch (error) {
      console.error('Erro ao selecionar equipamento:', error);
      alert('Erro inesperado ao selecionar equipamento. Tente novamente.');
    }
  };

  const equipmentTypes = getEquipmentTypes();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Carregando equipamentos...
          </h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive mb-4">
            Erro ao carregar equipamentos
          </h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={refetch} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button variant="ghost" size="lg" onClick={() => navigate('/')} className="mr-4">
              <ArrowLeft className="h-6 w-6 mr-2" />
              Voltar
            </Button>
            <h1 className="text-4xl font-bold text-foreground">
              Selecionar Equipamento
            </h1>
          </div>
          <Button variant="ghost" onClick={refetch} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>

        {equipmentTypes.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-muted-foreground mb-2">
              Nenhum equipamento encontrado
            </h2>
            <p className="text-muted-foreground">
              Não há equipamentos cadastrados no sistema.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {equipmentTypes.map((equipmentType, index) => (
              <div key={equipmentType.tipo} className="group relative">
                {/* Glow effect */}
                <div className={`absolute -inset-1 rounded-2xl blur opacity-25 transition duration-1000 ${
                  equipmentType.availableCount > 0 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 group-hover:opacity-75' 
                    : 'bg-gradient-to-r from-gray-400 to-gray-500'
                }`}></div>
                
                <Card 
                  className={`relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 rounded-2xl transition-all duration-300 cursor-pointer ${
                    equipmentType.availableCount === 0 ? 'opacity-60' : 'hover:scale-105'
                  } ${checking ? 'pointer-events-none' : ''} shadow-xl`}
                  onClick={() => equipmentType.availableCount > 0 && !checking && handleEquipmentSelect(equipmentType.tipo)}
                >
                  {/* Decorative corners */}
                  <span className="absolute -left-px -top-px block size-3 border-l-2 border-t-2 border-blue-500 rounded-tl-2xl"></span>
                  <span className="absolute -right-px -top-px block size-3 border-r-2 border-t-2 border-purple-500 rounded-tr-2xl"></span>
                  <span className="absolute -bottom-px -left-px block size-3 border-b-2 border-l-2 border-purple-500 rounded-bl-2xl"></span>
                  <span className="absolute -bottom-px -right-px block size-3 border-b-2 border-r-2 border-blue-500 rounded-br-2xl"></span>
                  
                  <CardHeader className="text-center relative">
                    {/* Background pattern */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-t-2xl"></div>
                    
                    <div className="relative z-10">
                      <div className="text-8xl mb-4 transform transition-transform duration-300 group-hover:scale-110">
                        {equipmentType.icon}
                      </div>
                      
                      <div className="flex justify-center mb-4">
                        <Badge 
                          variant={equipmentType.availableCount > 0 ? "default" : "secondary"} 
                          className={`px-4 py-2 text-sm font-semibold ${
                            equipmentType.availableCount > 0 
                              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
                              : 'bg-gray-400 text-gray-700'
                          }`}
                        >
                          {equipmentType.availableCount} de {equipmentType.totalCount} disponíveis
                        </Badge>
                      </div>
                      
                      <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                        {equipmentType.name}
                      </CardTitle>
                      <CardDescription className="text-lg mt-2 text-gray-600 dark:text-gray-400">
                        {equipmentType.description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="text-center relative">
                    <div className="flex items-center justify-center text-muted-foreground mb-6 bg-gray-50/50 dark:bg-gray-800/50 rounded-lg py-3 px-4">
                      <Clock className="h-5 w-5 mr-2 text-blue-500" />
                      <span className="text-lg">Duração: {equipmentType.maxDuration}</span>
                    </div>
                    
                    <Button 
                      size="lg" 
                      className={`w-full text-xl py-6 rounded-xl font-bold transition-all duration-300 ${
                        equipmentType.availableCount > 0
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                          : 'bg-gray-400 text-gray-700 cursor-not-allowed'
                      }`}
                      disabled={equipmentType.availableCount === 0 || checking}
                      onClick={() => handleEquipmentSelect(equipmentType.tipo)}
                    >
                      {checking ? (
                        <>
                          <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                          Verificando...
                        </>
                      ) : equipmentType.availableCount > 0 ? (
                        <>
                          <Package className="h-5 w-5 mr-2" />
                          Selecionar Equipamento
                        </>
                      ) : (
                        <>
                          <X className="h-5 w-5 mr-2" />
                          Indisponível
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SelecionarEquipamento;