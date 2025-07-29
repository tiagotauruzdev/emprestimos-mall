import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, RotateCcw, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLoading } from "@/contexts/AppContext";
import { supabase } from "@/integrations/supabase/client";

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

const DevolverEquipamento = () => {
  const navigate = useNavigate();
  const [borrowedEquipments, setBorrowedEquipments] = useState<any[]>([]);
  const { loading, setLoading, error, setError } = useLoading();

  const fetchBorrowedEquipments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('vw_emprestimos_ativos')
        .select('*')
        .order('data_emprestimo', { ascending: false });

      if (error) throw error;
      setBorrowedEquipments(data || []);
    } catch (error) {
      console.error('Erro ao buscar equipamentos emprestados:', error);
      setError('Erro ao carregar equipamentos emprestados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBorrowedEquipments();
  }, []);

  const handleReturn = (loanId: string) => {
    navigate(`/confirmar-devolucao?loanId=${loanId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Carregando equipamentos emprestados...
          </h2>
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
              Devolver Equipamento
            </h1>
          </div>
          <Button variant="ghost" onClick={fetchBorrowedEquipments}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>

        {borrowedEquipments.length === 0 ? (
          <div className="text-center py-12">
            <RotateCcw className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-muted-foreground mb-2">
              Nenhum equipamento emprestado
            </h2>
            <p className="text-muted-foreground">
              Não há equipamentos para devolução no momento.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {borrowedEquipments.map((loan) => (
              <Card key={loan.id} className="hover:shadow-lg transition-shadow cursor-pointer border-orange-200">
                <CardHeader className="text-center">
                  <div className="text-8xl mb-4">
                    {getEquipmentIcon(loan.tipo_equipamento)}
                  </div>
                  <Badge variant="destructive" className="mb-2">
                    Emprestado
                  </Badge>
                  <CardTitle className="text-2xl">
                    {getEquipmentName(loan.tipo_equipamento)}
                  </CardTitle>
                  <div className="space-y-2 text-muted-foreground text-sm">
                    <p><strong>Código:</strong> {loan.codigo_equipamento}</p>
                    <p><strong>Cliente:</strong> {loan.nome_cliente}</p>
                    <p><strong>Retirado às:</strong> {
                      new Date(loan.data_emprestimo).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    }</p>
                    {loan.prazo_devolucao && (
                      <p><strong>Prazo:</strong> {
                        new Date(loan.prazo_devolucao).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      }</p>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="text-center">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="w-full text-xl py-6"
                    onClick={() => handleReturn(loan.id)}
                  >
                    Devolver Este Equipamento
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

export default DevolverEquipamento;