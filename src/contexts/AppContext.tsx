import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Tables } from '@/integrations/supabase/types';

// Types
type Seguranca = Tables<'segurancas'>;
type Equipamento = Tables<'equipamentos'>;
type EmprestimoAtivo = Tables<'vw_emprestimos_ativos'>;
type FilaEsperaOrdenada = Tables<'vw_fila_espera_ordenada'>;

interface AppState {
  selectedOperator: Seguranca | null;
  equipments: Equipamento[];
  activeLoans: EmprestimoAtivo[];
  queue: FilaEsperaOrdenada[];
  loading: boolean;
  error: string | null;
}

type AppAction =
  | { type: 'SET_OPERATOR'; payload: Seguranca }
  | { type: 'CLEAR_OPERATOR' }
  | { type: 'SET_EQUIPMENTS'; payload: Equipamento[] }
  | { type: 'SET_ACTIVE_LOANS'; payload: EmprestimoAtivo[] }
  | { type: 'SET_QUEUE'; payload: FilaEsperaOrdenada[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'UPDATE_EQUIPMENT'; payload: { id: string; updates: Partial<Equipamento> } };

const initialState: AppState = {
  selectedOperator: null,
  equipments: [],
  activeLoans: [],
  queue: [],
  loading: false,
  error: null,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_OPERATOR':
      return { ...state, selectedOperator: action.payload };
    case 'CLEAR_OPERATOR':
      return { ...state, selectedOperator: null };
    case 'SET_EQUIPMENTS':
      return { ...state, equipments: action.payload };
    case 'SET_ACTIVE_LOANS':
      return { ...state, activeLoans: action.payload };
    case 'SET_QUEUE':
      return { ...state, queue: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'UPDATE_EQUIPMENT':
      return {
        ...state,
        equipments: state.equipments.map(eq =>
          eq.id === action.payload.id
            ? { ...eq, ...action.payload.updates }
            : eq
        ),
      };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

// Helper hooks
export function useOperator() {
  const { state, dispatch } = useAppContext();
  
  const setOperator = (operator: Seguranca) => {
    dispatch({ type: 'SET_OPERATOR', payload: operator });
  };
  
  const clearOperator = () => {
    dispatch({ type: 'CLEAR_OPERATOR' });
  };
  
  return {
    operator: state.selectedOperator,
    setOperator,
    clearOperator,
  };
}

export function useEquipments() {
  const { state, dispatch } = useAppContext();
  
  const setEquipments = (equipments: Equipamento[]) => {
    dispatch({ type: 'SET_EQUIPMENTS', payload: equipments });
  };
  
  const updateEquipment = (id: string, updates: Partial<Equipamento>) => {
    dispatch({ type: 'UPDATE_EQUIPMENT', payload: { id, updates } });
  };
  
  return {
    equipments: state.equipments,
    setEquipments,
    updateEquipment,
  };
}

export function useLoading() {
  const { state, dispatch } = useAppContext();
  
  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };
  
  const setError = (error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };
  
  return {
    loading: state.loading,
    error: state.error,
    setLoading,
    setError,
  };
}