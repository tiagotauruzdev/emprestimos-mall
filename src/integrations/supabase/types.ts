export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      clientes: {
        Row: {
          categoria_cliente: string
          cpf: string
          created_at: string | null
          email: string | null
          id: string
          nome: string
          telefone: string
          updated_at: string | null
        }
        Insert: {
          categoria_cliente: string
          cpf: string
          created_at?: string | null
          email?: string | null
          id?: string
          nome: string
          telefone: string
          updated_at?: string | null
        }
        Update: {
          categoria_cliente?: string
          cpf?: string
          created_at?: string | null
          email?: string | null
          id?: string
          nome?: string
          telefone?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      emprestimos: {
        Row: {
          cliente_id: string
          created_at: string | null
          data_devolucao_prevista: string
          data_devolucao_real: string | null
          data_emprestimo: string | null
          equipamento_id: string
          id: string
          observacoes: string | null
          seguranca_id: string
          status: string
          tempo_uso_estimado: number
          termo_aceito: boolean | null
          updated_at: string | null
        }
        Insert: {
          cliente_id: string
          created_at?: string | null
          data_devolucao_prevista: string
          data_devolucao_real?: string | null
          data_emprestimo?: string | null
          equipamento_id: string
          id?: string
          observacoes?: string | null
          seguranca_id: string
          status?: string
          tempo_uso_estimado: number
          termo_aceito?: boolean | null
          updated_at?: string | null
        }
        Update: {
          cliente_id?: string
          created_at?: string | null
          data_devolucao_prevista?: string
          data_devolucao_real?: string | null
          data_emprestimo?: string | null
          equipamento_id?: string
          id?: string
          observacoes?: string | null
          seguranca_id?: string
          status?: string
          tempo_uso_estimado?: number
          termo_aceito?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "emprestimos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "emprestimos_equipamento_id_fkey"
            columns: ["equipamento_id"]
            isOneToOne: false
            referencedRelation: "equipamentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "emprestimos_seguranca_id_fkey"
            columns: ["seguranca_id"]
            isOneToOne: false
            referencedRelation: "segurancas"
            referencedColumns: ["id"]
          },
        ]
      }
      equipamentos: {
        Row: {
          codigo: string
          created_at: string | null
          id: string
          localizacao: string
          observacoes: string | null
          status: string
          tipo_equipamento: string
          updated_at: string | null
        }
        Insert: {
          codigo: string
          created_at?: string | null
          id?: string
          localizacao: string
          observacoes?: string | null
          status?: string
          tipo_equipamento: string
          updated_at?: string | null
        }
        Update: {
          codigo?: string
          created_at?: string | null
          id?: string
          localizacao?: string
          observacoes?: string | null
          status?: string
          tipo_equipamento?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      fila_espera: {
        Row: {
          cliente_id: string
          created_at: string | null
          data_entrada_fila: string | null
          expires_at: string | null
          id: string
          notificado_em: string | null
          posicao: number
          status: string
          tempo_uso_estimado: number
          tipo_equipamento_solicitado: string
          updated_at: string | null
        }
        Insert: {
          cliente_id: string
          created_at?: string | null
          data_entrada_fila?: string | null
          expires_at?: string | null
          id?: string
          notificado_em?: string | null
          posicao: number
          status?: string
          tempo_uso_estimado: number
          tipo_equipamento_solicitado: string
          updated_at?: string | null
        }
        Update: {
          cliente_id?: string
          created_at?: string | null
          data_entrada_fila?: string | null
          expires_at?: string | null
          id?: string
          notificado_em?: string | null
          posicao?: number
          status?: string
          tempo_uso_estimado?: number
          tipo_equipamento_solicitado?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fila_espera_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      segurancas: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          id: string
          nome: string
          posto_trabalho: string
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          id?: string
          nome: string
          posto_trabalho: string
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          id?: string
          nome?: string
          posto_trabalho?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      vw_disponibilidade_equipamentos: {
        Row: {
          disponiveis: number | null
          em_manutencao: number | null
          em_uso: number | null
          localizacao: string | null
          tipo_equipamento: string | null
          total: number | null
        }
        Relationships: []
      }
      vw_emprestimos_ativos: {
        Row: {
          categoria_cliente: string | null
          cliente_nome: string | null
          cliente_telefone: string | null
          data_devolucao_prevista: string | null
          data_emprestimo: string | null
          equipamento_codigo: string | null
          id: string | null
          seguranca_nome: string | null
          status_atual: string | null
          tempo_uso_estimado: number | null
          tipo_equipamento: string | null
        }
        Relationships: []
      }
      vw_fila_espera_ordenada: {
        Row: {
          categoria_cliente: string | null
          cliente_nome: string | null
          cliente_telefone: string | null
          data_entrada_fila: string | null
          id: string | null
          posicao: number | null
          status: string | null
          tempo_uso_estimado: number | null
          tipo_equipamento_solicitado: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
