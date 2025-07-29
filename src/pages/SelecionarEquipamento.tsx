import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, ArrowLeft, Package, RefreshCw } from "lucide-react";
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
            {equipmentTypes.map((equipmentType) => (
              <Card 
                key={equipmentType.tipo} 
                className={`hover:shadow-lg transition-shadow cursor-pointer ${
                  equipmentType.availableCount === 0 ? 'opacity-60' : ''
                } ${checking ? 'pointer-events-none' : ''}`}
                onClick={() => equipmentType.availableCount > 0 && !checking && handleEquipmentSelect(equipmentType.tipo)}
              >
                <CardHeader className="text-center">
                  <div className="text-8xl mb-4">{equipmentType.icon}</div>
                  <Badge 
                    variant={equipmentType.availableCount > 0 ? "default" : "secondary"} 
                    className="mb-2"
                  >
                    {equipmentType.availableCount} de {equipmentType.totalCount} disponíveis
                  </Badge>
                  <CardTitle className="text-2xl">{equipmentType.name}</CardTitle>
                  <CardDescription className="text-lg">{equipmentType.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="text-center">
                  <div className="flex items-center justify-center text-muted-foreground mb-6">
                    <Clock className="h-5 w-5 mr-2" />
                    <span className="text-lg">Duração máxima: {equipmentType.maxDuration}</span>
                  </div>
                  
                  <Button 
                    size="lg" 
                    className="w-full text-xl py-6"
                    disabled={equipmentType.availableCount === 0 || checking}
                    onClick={() => handleEquipmentSelect(equipmentType.tipo)}
                  >
                    {checking ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Verificando...
                      </>
                    ) : equipmentType.availableCount > 0 ? (
                      'Selecionar Este Equipamento'
                    ) : (
                      'Indisponível'
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SelecionarEquipamento;