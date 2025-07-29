import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type Cliente = Tables<'clientes'>;
type Emprestimo = Tables<'emprestimos'>;
type Equipamento = Tables<'equipamentos'>;
type Seguranca = Tables<'segurancas'>;

interface ClientData {
  nome: string;
  cpf: string;
  telefone: string;
  email?: string;
  categoria: 'gestante' | 'idoso' | 'outros';
}

interface LoanData {
  clientData: ClientData;
  equipmentId: string;
  equipmentType: string;
  operatorId: string;
  estimatedDurationHours?: number;
}

interface LoanResult {
  success: boolean;
  loanId?: string;
  clientId?: string;
  message: string;
  loanDetails?: {
    loan: Emprestimo;
    client: Cliente;
    equipment: Equipamento;
    operator: Seguranca;
    returnDeadline: Date;
  };
}

export function useLoanProcessing() {
  const [processing, setProcessing] = useState(false);

  const calculateReturnDeadline = (durationHours: number = 3): Date => {
    const now = new Date();
    const deadline = new Date(now.getTime() + (durationHours * 60 * 60 * 1000));
    return deadline;
  };

  const formatCPF = (cpf: string): string => {
    return cpf.replace(/\D/g, '');
  };

  const formatPhone = (phone: string): string => {
    return phone.replace(/\D/g, '');
  };

  const createOrUpdateClient = async (clientData: ClientData): Promise<{ success: boolean; clientId?: string; message: string }> => {
    try {
      const cleanCPF = formatCPF(clientData.cpf);
      
      // Verificar se cliente já existe
      const { data: existingClient, error: searchError } = await supabase
        .from('clientes')
        .select('*')
        .eq('cpf', cleanCPF)
        .single();

      if (searchError && searchError.code !== 'PGRST116') { // PGRST116 = not found
        throw searchError;
      }

      if (existingClient) {
        // Atualizar cliente existente
        const { data: updatedClient, error: updateError } = await supabase
          .from('clientes')
          .update({
            nome: clientData.nome,
            telefone: formatPhone(clientData.telefone),
            email: clientData.email || null,
            categoria_cliente: clientData.categoria,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingClient.id)
          .select()
          .single();

        if (updateError) throw updateError;

        return {
          success: true,
          clientId: updatedClient.id,
          message: 'Cliente atualizado com sucesso!'
        };
      } else {
        // Criar novo cliente
        const { data: newClient, error: createError } = await supabase
          .from('clientes')
          .insert({
            nome: clientData.nome,
            cpf: cleanCPF,
            telefone: formatPhone(clientData.telefone),
            email: clientData.email || null,
            categoria_cliente: clientData.categoria
          })
          .select()
          .single();

        if (createError) throw createError;

        return {
          success: true,
          clientId: newClient.id,
          message: 'Cliente cadastrado com sucesso!'
        };
      }
    } catch (error) {
      console.error('Erro ao processar cliente:', error);
      return {
        success: false,
        message: 'Erro ao processar dados do cliente.'
      };
    }
  };

  const createLoan = async (loanData: LoanData): Promise<LoanResult> => {
    try {
      setProcessing(true);

      // 1. Criar ou atualizar cliente
      const clientResult = await createOrUpdateClient(loanData.clientData);
      if (!clientResult.success || !clientResult.clientId) {
        return {
          success: false,
          message: clientResult.message
        };
      }

      // 2. Verificar se equipamento ainda está disponível
      const { data: equipment, error: equipmentError } = await supabase
        .from('equipamentos')
        .select('*')
        .eq('id', loanData.equipmentId)
        .eq('status', 'disponivel')
        .single();

      if (equipmentError || !equipment) {
        return {
          success: false,
          message: 'Equipamento não está mais disponível ou não foi encontrado.'
        };
      }

      // 3. Calcular prazo de devolução
      const returnDeadline = calculateReturnDeadline(loanData.estimatedDurationHours);

      // 4. Criar empréstimo
      const { data: loan, error: loanError } = await supabase
        .from('emprestimos')
        .insert({
          cliente_id: clientResult.clientId,
          equipamento_id: loanData.equipmentId,
          seguranca_id: loanData.operatorId,
          data_emprestimo: new Date().toISOString(),
          tempo_uso_estimado: loanData.estimatedDurationHours || 3,
          data_devolucao_prevista: returnDeadline.toISOString(),
          status: 'ativo'
        })
        .select()
        .single();

      if (loanError) throw loanError;

      // 5. Atualizar status do equipamento para 'em_uso'
      const { error: updateEquipmentError } = await supabase
        .from('equipamentos')
        .update({
          status: 'em_uso',
          updated_at: new Date().toISOString()
        })
        .eq('id', loanData.equipmentId);

      if (updateEquipmentError) throw updateEquipmentError;

      // 6. Buscar dados completos para retorno
      const { data: client, error: clientFetchError } = await supabase
        .from('clientes')
        .select('*')
        .eq('id', clientResult.clientId)
        .single();

      if (clientFetchError) throw clientFetchError;

      const { data: operator, error: operatorError } = await supabase
        .from('segurancas')
        .select('*')
        .eq('id', loanData.operatorId)
        .single();

      if (operatorError) throw operatorError;

      // Atualizar dados do equipamento
      const { data: updatedEquipment, error: updatedEquipmentError } = await supabase
        .from('equipamentos')
        .select('*')
        .eq('id', loanData.equipmentId)
        .single();

      if (updatedEquipmentError) throw updatedEquipmentError;

      return {
        success: true,
        loanId: loan.id,
        clientId: clientResult.clientId,
        message: 'Empréstimo criado com sucesso!',
        loanDetails: {
          loan,
          client,
          equipment: updatedEquipment,
          operator,
          returnDeadline
        }
      };

    } catch (error) {
      console.error('Erro ao processar empréstimo:', error);
      return {
        success: false,
        message: 'Erro inesperado ao processar empréstimo. Tente novamente.'
      };
    } finally {
      setProcessing(false);
    }
  };

  const cancelLoan = async (loanId: string): Promise<{ success: boolean; message: string }> => {
    try {
      // Buscar dados do empréstimo
      const { data: loan, error: loanError } = await supabase
        .from('emprestimos')
        .select('equipamento_id')
        .eq('id', loanId)
        .eq('status', 'ativo')
        .single();

      if (loanError || !loan) {
        return {
          success: false,
          message: 'Empréstimo não encontrado ou já foi cancelado.'
        };
      }

      // Cancelar empréstimo
      const { error: cancelError } = await supabase
        .from('emprestimos')
        .update({
          status: 'cancelado',
          data_devolucao: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', loanId);

      if (cancelError) throw cancelError;

      // Liberar equipamento
      const { error: releaseError } = await supabase
        .from('equipamentos')
        .update({
          status: 'disponivel',
          updated_at: new Date().toISOString()
        })
        .eq('id', loan.equipamento_id);

      if (releaseError) throw releaseError;

      return {
        success: true,
        message: 'Empréstimo cancelado com sucesso!'
      };

    } catch (error) {
      console.error('Erro ao cancelar empréstimo:', error);
      return {
        success: false,
        message: 'Erro ao cancelar empréstimo.'
      };
    }
  };

  return {
    processing,
    createLoan,
    cancelLoan,
    calculateReturnDeadline
  };
}