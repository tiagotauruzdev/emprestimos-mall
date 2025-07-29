# Design Document

## Overview

Esta implementação transforma o app ShopLend de um protótipo visual em um sistema funcional completo, integrando todas as funcionalidades com o Supabase. O design foca em implementar o fluxo completo do PRD: seleção de funcionário → cadastro de cliente → verificação de disponibilidade → empréstimo/fila → devolução.

## Architecture

### Current vs New Architecture

**Current (Mockado):**
```
React Components → Dados Hardcoded → Interface Visual
```

**New (Integrado):**
```
React Components → Supabase Client → Banco de Dados → Interface Funcional
```

### Data Flow

1. **Inicialização**: App carrega funcionários do Supabase
2. **Seleção de Operador**: Funcionário se identifica no sistema
3. **Operações**: Todas as ações são persistidas no banco
4. **Tempo Real**: Estado sincronizado entre interface e banco

## Components and Interfaces

### 1. Operator Selection Screen

**Novo componente**: `OperatorSelection.tsx`
- Lista funcionários ativos do Supabase
- Permite seleção sem senha (conforme PRD)
- Armazena operador selecionado no estado global

### 2. Equipment Management (Modificado)

**Componente**: `Equipamentos.tsx` (atualizado)
- Substitui dados mockados por queries reais
- Implementa verificação de disponibilidade em tempo real
- Conecta com sistema de fila de espera

### 3. Customer Registration Form

**Novo componente**: `CustomerForm.tsx`
- Formulário completo conforme PRD REQ-001
- Validação de CPF, telefone, email
- Integração com categorias de cliente (gestante, idoso, outros)

### 4. Queue Management System

**Novo componente**: `QueueManager.tsx`
- Gerencia fila de espera automaticamente
- Calcula posições e tempos estimados
- Processa notificações quando equipamentos ficam disponíveis

### 5. Real-time Equipment Status

**Hook customizado**: `useEquipmentStatus.ts`
- Monitora status dos equipamentos em tempo real
- Atualiza interface automaticamente
- Gerencia estados de loading e erro

## Data Models

### Updated Supabase Types

Será necessário regenerar os types para incluir:

```typescript
// Tipos principais
type Cliente = Database['public']['Tables']['clientes']['Row']
type Equipamento = Database['public']['Tables']['equipamentos']['Row']
type Emprestimo = Database['public']['Tables']['emprestimos']['Row']
type FilaEspera = Database['public']['Tables']['fila_espera']['Row']
type Seguranca = Database['public']['Tables']['segurancas']['Row']

// Views para consultas otimizadas
type DisponibilidadeEquipamento = Database['public']['Views']['vw_disponibilidade_equipamentos']['Row']
type EmprestimoAtivo = Database['public']['Views']['vw_emprestimos_ativos']['Row']
type FilaEsperaOrdenada = Database['public']['Views']['vw_fila_espera_ordenada']['Row']
```

### State Management

**Context API** para gerenciar:
- Operador selecionado
- Estado dos equipamentos
- Fila de espera
- Loading states

```typescript
interface AppState {
  selectedOperator: Seguranca | null
  equipments: Equipamento[]
  activeLoans: EmprestimoAtivo[]
  queue: FilaEsperaOrdenada[]
  loading: boolean
}
```

## Error Handling

### Database Errors
- Conexão perdida com Supabase
- Timeouts em queries
- Violações de constraint

### Business Logic Errors
- Equipamento não disponível
- Cliente já com empréstimo ativo
- Dados inválidos no formulário

### User Experience
- Loading states durante operações
- Mensagens de erro claras
- Retry automático para falhas temporárias

## Testing Strategy

### Unit Tests
- Validação de formulários
- Lógica de negócio (fila, disponibilidade)
- Hooks customizados

### Integration Tests
- Fluxo completo de empréstimo
- Sistema de fila de espera
- Sincronização com Supabase

### E2E Tests
- Jornada completa do usuário
- Múltiplos operadores simultâneos
- Cenários de erro e recuperação

## Performance Considerations

### Query Optimization
- Usar views pré-criadas para consultas complexas
- Implementar cache local para dados frequentes
- Pagination para listas grandes

### Real-time Updates
- Supabase Realtime para mudanças críticas
- Polling inteligente para dados menos críticos
- Debounce em operações frequentes

### Loading States
- Skeleton screens durante carregamento
- Progressive loading para dados não críticos
- Offline-first approach quando possível

## Security Implementation

### Row Level Security (RLS)
Implementar políticas RLS conforme alertas do Supabase:

```sql
-- Exemplo para tabela clientes
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Funcionários podem ver todos os clientes" 
ON clientes FOR ALL 
TO authenticated 
USING (true);
```

### Data Validation
- Validação no frontend (UX)
- Validação no banco (segurança)
- Sanitização de inputs

### Audit Trail
- Log de todas as operações
- Rastreamento de mudanças
- Identificação do operador responsável

## Implementation Phases

### Phase 1: Foundation
1. Atualizar types do Supabase
2. Criar context para estado global
3. Implementar tela de seleção de operador

### Phase 2: Core Functionality
1. Integrar página de equipamentos com Supabase
2. Implementar formulário de cadastro
3. Sistema básico de empréstimo

### Phase 3: Advanced Features
1. Sistema de fila de espera
2. Funcionalidade de devolução
3. Notificações e alertas

### Phase 4: Polish & Security
1. Implementar RLS policies
2. Otimizar performance
3. Testes completos

## Future Considerations

### Scalability
- Preparar para múltiplos shoppings
- Sistema de relatórios
- Dashboard administrativo

### Mobile Optimization
- PWA capabilities
- Offline functionality
- Touch-friendly interface

### Integration Possibilities
- Sistema de notificações (WhatsApp/Email)
- Geração de PDFs
- Integração com sistemas externos