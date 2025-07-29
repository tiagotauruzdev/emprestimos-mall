import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { useLoading } from '@/contexts/AppContext';

type Equipamento = Tables<'equipamentos'>;
type DisponibilidadeEquipamento = Tables<'vw_disponibilidade_equipamentos'>;

export function useEquipmentStatus() {
  const [equipments, setEquipments] = useState<Equipamento[]>([]);
  const [availability, setAvailability] = useState<DisponibilidadeEquipamento[]>([]);
  const { setLoading, setError } = useLoading();

  const fetchEquipments = async () => {
    try {
      setLoading(true);
      setError(null);

      // Buscar todos os equipamentos
      const { data: equipmentData, error: equipmentError } = await supabase
        .from('equipamentos')
        .select('*')
        .order('tipo_equipamento', { ascending: true })
        .order('codigo', { ascending: true });

      if (equipmentError) throw equipmentError;

      // Buscar disponibilidade usando a view
      const { data: availabilityData, error: availabilityError } = await supabase
        .from('vw_disponibilidade_equipamentos')
        .select('*');

      if (availabilityError) throw availabilityError;

      setEquipments(equipmentData || []);
      setAvailability(availabilityData || []);
    } catch (error) {
      console.error('Erro ao buscar equipamentos:', error);
      setError('Erro ao carregar equipamentos');
    } finally {
      setLoading(false);
    }
  };

  const updateEquipmentStatus = async (equipmentId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('equipamentos')
        .update({ status: newStatus })
        .eq('id', equipmentId);

      if (error) throw error;

      // Atualizar estado local
      setEquipments(prev => 
        prev.map(eq => 
          eq.id === equipmentId 
            ? { ...eq, status: newStatus }
            : eq
        )
      );

      // Recarregar disponibilidade
      await fetchAvailability();
    } catch (error) {
      console.error('Erro ao atualizar status do equipamento:', error);
      throw error;
    }
  };

  const fetchAvailability = async () => {
    try {
      const { data, error } = await supabase
        .from('vw_disponibilidade_equipamentos')
        .select('*');

      if (error) throw error;
      setAvailability(data || []);
    } catch (error) {
      console.error('Erro ao buscar disponibilidade:', error);
    }
  };

  const getAvailableEquipmentsByType = (tipo: string) => {
    return equipments.filter(eq => 
      eq.tipo_equipamento === tipo && eq.status === 'disponivel'
    );
  };

  const getEquipmentAvailability = (tipo: string) => {
    return availability.find(av => av.tipo_equipamento === tipo);
  };

  const subscribeToEquipmentChanges = () => {
    const subscription = supabase
      .channel('equipamentos-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'equipamentos'
        },
        () => {
          // Recarregar dados quando houver mudanças
          fetchEquipments();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  useEffect(() => {
    fetchEquipments();
    
    // Configurar subscription para mudanças em tempo real
    const unsubscribe = subscribeToEquipmentChanges();
    
    return unsubscribe;
  }, []);

  return {
    equipments,
    availability,
    fetchEquipments,
    updateEquipmentStatus,
    getAvailableEquipmentsByType,
    getEquipmentAvailability,
    refetch: fetchEquipments,
  };
}