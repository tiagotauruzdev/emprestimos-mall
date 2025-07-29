import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type Equipamento = Tables<'equipamentos'>;

interface AvailabilityResult {
  available: boolean;
  availableEquipment?: Equipamento;
  totalCount: number;
  availableCount: number;
  message: string;
}

export function useEquipmentAvailability() {
  const [checking, setChecking] = useState(false);
  const [reserving, setReserving] = useState(false);

  const checkAvailability = useCallback(async (equipmentType: string): Promise<AvailabilityResult> => {
    try {
      setChecking(true);

      // Buscar equipamentos disponíveis do tipo especificado
      const { data: availableEquipments, error: availableError } = await supabase
        .from('equipamentos')
        .select('*')
        .eq('tipo_equipamento', equipmentType)
        .eq('status', 'disponivel')
        .limit(1);

      if (availableError) throw availableError;

      // Buscar contagem total de equipamentos deste tipo
      const { count: totalCount, error: countError } = await supabase
        .from('equipamentos')
        .select('*', { count: 'exact', head: true })
        .eq('tipo_equipamento', equipmentType);

      if (countError) throw countError;

      // Buscar contagem de equipamentos disponíveis
      const { count: availableCount, error: availableCountError } = await supabase
        .from('equipamentos')
        .select('*', { count: 'exact', head: true })
        .eq('tipo_equipamento', equipmentType)
        .eq('status', 'disponivel');

      if (availableCountError) throw availableCountError;

      const hasAvailable = availableEquipments && availableEquipments.length > 0;

      return {
        available: hasAvailable,
        availableEquipment: hasAvailable ? availableEquipments[0] : undefined,
        totalCount: totalCount || 0,
        availableCount: availableCount || 0,
        message: hasAvailable 
          ? `Equipamento disponível! ${availableCount} de ${totalCount} disponíveis.`
          : `Nenhum equipamento disponível no momento. ${availableCount} de ${totalCount} disponíveis.`
      };
    } catch (error) {
      console.error('Erro ao verificar disponibilidade:', error);
      return {
        available: false,
        totalCount: 0,
        availableCount: 0,
        message: 'Erro ao verificar disponibilidade do equipamento.'
      };
    } finally {
      setChecking(false);
    }
  }, []);

  const reserveEquipment = useCallback(async (equipmentId: string): Promise<{ success: boolean; message: string }> => {
    try {
      setReserving(true);

      // Verificar se o equipamento ainda está disponível
      const { data: equipment, error: checkError } = await supabase
        .from('equipamentos')
        .select('*')
        .eq('id', equipmentId)
        .eq('status', 'disponivel')
        .single();

      if (checkError || !equipment) {
        return {
          success: false,
          message: 'Equipamento não está mais disponível.'
        };
      }

      // Como não podemos usar status 'reservado', vamos apenas verificar disponibilidade
      // A reserva será feita no momento da criação do empréstimo
      return {
        success: true,
        message: 'Equipamento verificado e disponível!'
      };
    } catch (error) {
      console.error('Erro ao verificar equipamento:', error);
      return {
        success: false,
        message: 'Erro inesperado ao verificar equipamento.'
      };
    } finally {
      setReserving(false);
    }
  }, []);

  const releaseReservation = useCallback(async (equipmentId: string): Promise<{ success: boolean; message: string }> => {
    try {
      // Como não estamos mais usando reserva física, apenas retornamos sucesso
      // A verificação de disponibilidade será feita no momento do empréstimo
      return {
        success: true,
        message: 'Verificação liberada com sucesso!'
      };
    } catch (error) {
      console.error('Erro ao liberar verificação:', error);
      return {
        success: false,
        message: 'Erro inesperado ao liberar verificação.'
      };
    }
  }, []);

  const checkAndReserve = useCallback(async (equipmentType: string): Promise<{
    success: boolean;
    equipmentId?: string;
    message: string;
    availabilityInfo: AvailabilityResult;
  }> => {
    // Primeiro verificar disponibilidade
    const availabilityInfo = await checkAvailability(equipmentType);
    
    if (!availabilityInfo.available || !availabilityInfo.availableEquipment) {
      return {
        success: false,
        message: availabilityInfo.message,
        availabilityInfo
      };
    }

    // Se disponível, tentar reservar
    const reserveResult = await reserveEquipment(availabilityInfo.availableEquipment.id);
    
    return {
      success: reserveResult.success,
      equipmentId: reserveResult.success ? availabilityInfo.availableEquipment.id : undefined,
      message: reserveResult.message,
      availabilityInfo
    };
  }, [checkAvailability, reserveEquipment]);

  return {
    checking,
    reserving,
    checkAvailability,
    reserveEquipment,
    releaseReservation,
    checkAndReserve
  };
}