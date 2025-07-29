import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, MapPin, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { useOperator, useLoading } from '@/contexts/AppContext';

type Seguranca = Tables<'segurancas'>;

const OperatorSelection = () => {
  const [operators, setOperators] = useState<Seguranca[]>([]);
  const { setOperator } = useOperator();
  const { loading, setLoading, setError } = useLoading();

  const fetchOperators = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('segurancas')
        .select('*')
        .eq('ativo', true)
        .order('nome');

      if (error) throw error;
      
      setOperators(data || []);
    } catch (error) {
      console.error('Erro ao buscar operadores:', error);
      setError('Erro ao carregar lista de funcionários');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOperators();
  }, []);

  const handleOperatorSelect = (operator: Seguranca) => {
    setOperator(operator);
  };

  const getPostoLabel = (posto: string) => {
    switch (posto) {
      case 'espaco_familia':
        return 'Espaço Família';
      case 'espaco_pet':
        return 'Espaço Pet';
      default:
        return posto;
    }
  };

  const getPostoIcon = (posto: string) => {
    switch (posto) {
      case 'espaco_familia':
        return '👨‍👩‍👧‍👦';
      case 'espaco_pet':
        return '🐕';
      default:
        return '👤';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Carregando...
          </h2>
          <p className="text-muted-foreground">
            Buscando lista de funcionários
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="mb-12">
          <User className="h-16 w-16 text-primary mx-auto mb-6" />
          <h1 className="text-5xl font-bold text-foreground mb-4">
            Seleção de Operador
          </h1>
          <p className="text-xl text-muted-foreground">
            Selecione seu nome para continuar
          </p>
        </div>

        {operators.length === 0 ? (
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6">
              <p className="text-muted-foreground mb-4">
                Nenhum funcionário ativo encontrado
              </p>
              <Button onClick={fetchOperators} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Tentar Novamente
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {operators.map((operator) => (
              <Card 
                key={operator.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary"
                onClick={() => handleOperatorSelect(operator)}
              >
                <CardHeader className="text-center pb-2">
                  <div className="text-6xl mb-4">
                    {getPostoIcon(operator.posto_trabalho)}
                  </div>
                  <CardTitle className="text-xl">{operator.nome}</CardTitle>
                </CardHeader>
                
                <CardContent className="text-center">
                  <Badge variant="secondary" className="mb-4">
                    <MapPin className="h-3 w-3 mr-1" />
                    {getPostoLabel(operator.posto_trabalho)}
                  </Badge>
                  
                  <Button 
                    size="lg" 
                    className="w-full text-lg py-6"
                    onClick={() => handleOperatorSelect(operator)}
                  >
                    Selecionar
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-8">
          <Button 
            variant="ghost" 
            onClick={fetchOperators}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Atualizar Lista
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OperatorSelection;