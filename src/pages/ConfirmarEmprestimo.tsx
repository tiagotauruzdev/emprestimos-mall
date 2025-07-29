import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, CheckCircle, Clock, User, Phone, Mail, CreditCard, Package, AlertCircle, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useOperator } from "@/contexts/AppContext";
import { useLoanProcessing } from "@/hooks/useLoanProcessing";
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

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'gestante':
      return '🤱';
    case 'idoso':
      return '👴';
    default:
      return '👤';
  }
};

const getCategoryLabel = (category: string) => {
  switch (category) {
    case 'gestante':
      return 'Gestante';
    case 'idoso':
      return 'Idoso';
    default:
      return 'Outros';
  }
};

const ConfirmarEmprestimo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { operator } = useOperator();
  const { processing, createLoan } = useLoanProcessing();
  const { releaseReservation } = useEquipmentAvailability();

  const [loanCreated, setLoanCreated] = useState(false);
  const [loanDetails, setLoanDetails] = useState<any>(null);
  const [localEntrega, setLocalEntrega] = useState<'espaco_familia' | 'espaco_pet'>('espaco_familia');
  const [error, setError] = useState<string | null>(null);

  // Dados passados da página anterior
  const equipmentType = searchParams.get('equipmentType');
  const clientData = location.state?.clientData;
  const reservedEquipmentId = location.state?.reservedEquipmentId;
  const availabilityInfo = location.state?.availabilityInfo;

  useEffect(() => {
    // Verificar se temos todos os dados necessários
    if (!equipmentType || !clientData || !reservedEquipmentId || !operator) {
      setError('Dados incompletos. Redirecionando...');
      setTimeout(() => {
        navigate('/selecionar-equipamento');
      }, 2000);
    }
  }, [equipmentType, clientData, reservedEquipmentId, operator, navigate]);

  const handleConfirmLoan = async () => {
    if (!equipmentType || !clientData || !reservedEquipmentId || !operator) {
      setError('Dados incompletos para processar empréstimo.');
      return;
    }

    try {
      setError(null);
      
      const result = await createLoan({
        clientData,
        equipmentId: reservedEquipmentId,
        equipmentType,
        operatorId: operator.id,
        localEntrega,
        estimatedDurationHours: 3 // TODO: Tornar configurável
      });

      if (result.success && result.loanDetails) {
        setLoanCreated(true);
        setLoanDetails(result.loanDetails);
      } else {
        setError(result.message);
        // Se falhou, liberar a reserva
        if (reservedEquipmentId) {
          await releaseReservation(reservedEquipmentId);
        }
      }
    } catch (error) {
      console.error('Erro ao confirmar empréstimo:', error);
      setError('Erro inesperado ao processar empréstimo.');
      // Liberar reserva em caso de erro
      if (reservedEquipmentId) {
        await releaseReservation(reservedEquipmentId);
      }
    }
  };

  const handleCancel = async () => {
    // Liberar reserva antes de cancelar
    if (reservedEquipmentId) {
      await releaseReservation(reservedEquipmentId);
    }
    navigate(`/cadastrar-cliente/${equipmentType}`, {
      state: { reservedEquipmentId, availabilityInfo }
    });
  };

  const handleFinish = () => {
    navigate('/');
  };

  // Tela de erro
  if (error && !loanCreated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <CardTitle className="text-destructive">Erro</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">{error}</p>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={() => navigate('/selecionar-equipamento')}
                className="flex-1"
              >
                Voltar ao Início
              </Button>
              <Button 
                onClick={handleConfirmLoan}
                disabled={processing}
                className="flex-1"
              >
                {processing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Tentando...
                  </>
                ) : (
                  'Tentar Novamente'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Tela de sucesso
  if (loanCreated && loanDetails) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Empréstimo Realizado!
            </h1>
            <p className="text-xl text-muted-foreground">
              O equipamento foi emprestado com sucesso
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Detalhes do Empréstimo */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-6 w-6 mr-2" />
                  Detalhes do Empréstimo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Código do Empréstimo:</span>
                  <Badge variant="default" className="font-mono">
                    {loanDetails.loan.id.slice(-8).toUpperCase()}
                  </Badge>
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Equipamento:</span>
                  <div className="flex items-center">
                    <span className="text-2xl mr-2">{getEquipmentIcon(loanDetails.equipment.tipo_equipamento)}</span>
                    <span className="font-semibold">{getEquipmentName(loanDetails.equipment.tipo_equipamento)}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Código do Equipamento:</span>
                  <Badge variant="outline">{loanDetails.equipment.codigo}</Badge>
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Data/Hora do Empréstimo:</span>
                  <span className="font-semibold">
                    {new Date(loanDetails.loan.data_emprestimo).toLocaleString('pt-BR')}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Prazo de Devolução:</span>
                  <div className="flex items-center text-orange-600 font-semibold">
                    <Clock className="h-4 w-4 mr-1" />
                    {loanDetails.returnDeadline.toLocaleString('pt-BR')}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dados do Cliente */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-6 w-6 mr-2" />
                  Dados do Cliente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Nome:</span>
                  <span className="font-semibold">{loanDetails.client.nome}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground flex items-center">
                    <CreditCard className="h-4 w-4 mr-1" />
                    CPF:
                  </span>
                  <span className="font-mono">
                    {loanDetails.client.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground flex items-center">
                    <Phone className="h-4 w-4 mr-1" />
                    Telefone:
                  </span>
                  <span className="font-mono">
                    {loanDetails.client.telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')}
                  </span>
                </div>
                
                {loanDetails.client.email && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      Email:
                    </span>
                    <span>{loanDetails.client.email}</span>
                  </div>
                )}
                
                <Separator />
                
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Categoria:</span>
                  <div className="flex items-center">
                    <span className="text-xl mr-2">{getCategoryIcon(loanDetails.client.categoria_cliente)}</span>
                    <span>{getCategoryLabel(loanDetails.client.categoria_cliente)}</span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Operador Responsável:</span>
                  <span className="font-semibold">{loanDetails.operator.nome}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Instruções */}
          <Card className="mt-8">
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-4">Instruções Importantes</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                  <div className="flex flex-col items-center">
                    <Clock className="h-8 w-8 text-orange-500 mb-2" />
                    <p><strong>Prazo de Devolução</strong></p>
                    <p>Devolva até {loanDetails.returnDeadline.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <Package className="h-8 w-8 text-blue-500 mb-2" />
                    <p><strong>Cuidados</strong></p>
                    <p>Mantenha o equipamento em boas condições</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <User className="h-8 w-8 text-green-500 mb-2" />
                    <p><strong>Devolução</strong></p>
                    <p>Procure a equipe de segurança para devolver</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botão de finalizar */}
          <div className="text-center mt-8">
            <Button 
              size="lg" 
              onClick={handleFinish}
              className="text-xl py-6 px-12"
            >
              Finalizar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Tela de confirmação
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-8">
          <Button variant="ghost" size="lg" onClick={handleCancel} className="mr-4">
            <ArrowLeft className="h-6 w-6 mr-2" />
            Voltar
          </Button>
          <h1 className="text-4xl font-bold text-foreground">
            Confirmar Empréstimo
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Resumo do Equipamento */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="h-6 w-6 mr-2" />
                Equipamento Selecionado
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-8xl mb-4">
                {getEquipmentIcon(equipmentType || '')}
              </div>
              <Badge variant="default" className="mb-2">
                ✅ Selecionado
              </Badge>
              <h3 className="text-2xl font-semibold mb-2">
                {getEquipmentName(equipmentType || '')}
              </h3>
              {availabilityInfo && (
                <p className="text-muted-foreground">
                  {availabilityInfo.availableCount} de {availabilityInfo.totalCount} disponíveis
                </p>
              )}
            </CardContent>
          </Card>

          {/* Dados do Cliente */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-6 w-6 mr-2" />
                Dados do Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {clientData && (
                <>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nome:</span>
                    <span className="font-semibold">{clientData.nome}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">CPF:</span>
                    <span className="font-mono">{clientData.cpf}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Telefone:</span>
                    <span className="font-mono">{clientData.telefone}</span>
                  </div>
                  
                  {clientData.email && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <span>{clientData.email}</span>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Categoria:</span>
                    <div className="flex items-center">
                      <span className="text-xl mr-2">{getCategoryIcon(clientData.categoria)}</span>
                      <span>{getCategoryLabel(clientData.categoria)}</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Operador:</span>
                    <span className="font-semibold">{operator?.nome}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <span className="text-muted-foreground">Local de Entrega:</span>
                    <Select value={localEntrega} onValueChange={(value: 'espaco_familia' | 'espaco_pet') => setLocalEntrega(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="espaco_familia">
                          <div className="flex items-center">
                            <span className="mr-2">👨‍👩‍👧‍👦</span>
                            Espaço Família
                          </div>
                        </SelectItem>
                        <SelectItem value="espaco_pet">
                          <div className="flex items-center">
                            <span className="mr-2">🐕</span>
                            Espaço Pet
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duração Estimada:</span>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>3 horas</span>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Botões de ação */}
        <div className="flex space-x-4 mt-8">
          <Button
            variant="outline"
            size="lg"
            className="flex-1 text-lg py-6"
            onClick={handleCancel}
            disabled={processing}
          >
            Cancelar
          </Button>
          <Button
            size="lg"
            className="flex-1 text-lg py-6"
            onClick={handleConfirmLoan}
            disabled={processing}
          >
            {processing ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Processando...
              </>
            ) : (
              'Confirmar Empréstimo'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmarEmprestimo;