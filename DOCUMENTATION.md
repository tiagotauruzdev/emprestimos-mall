# ShopLend - Documentação Técnica

**Versão:** 1.0.0  
**Data:** 29/07/2025  
**Desenvolvido por:** Kiro AI Assistant  

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura](#arquitetura)
3. [Tecnologias Utilizadas](#tecnologias-utilizadas)
4. [Estrutura do Projeto](#estrutura-do-projeto)
5. [Banco de Dados](#banco-de-dados)
6. [Funcionalidades Implementadas](#funcionalidades-implementadas)
7. [Fluxo de Navegação](#fluxo-de-navegação)
8. [Componentes Principais](#componentes-principais)
9. [Hooks Customizados](#hooks-customizados)
10. [Problemas Encontrados e Soluções](#problemas-encontrados-e-soluções)
11. [Configuração e Deploy](#configuração-e-deploy)
12. [Manutenção](#manutenção)
13. [Changelog](#changelog)

---

## 🎯 Visão Geral

O **ShopLend** é um sistema de totem para empréstimo de equipamentos em shopping centers, desenvolvido como uma aplicação web responsiva. O sistema permite que funcionários de segurança gerenciem empréstimos de equipamentos como carrinhos de bebê, cadeiras de rodas e carrinhos para pets.

### Objetivos Principais
- Digitalizar o processo de empréstimo de equipamentos
- Controlar disponibilidade em tempo real
- Manter histórico de empréstimos
- Facilitar o processo para funcionários e clientes

---

## 🏗️ Arquitetura

### Arquitetura Geral
```
Frontend (React + TypeScript)
    ↓
Supabase Client
    ↓
Supabase Backend (PostgreSQL + Auth + Realtime)
```

### Padrões Arquiteturais
- **Component-Based Architecture**: Componentes React reutilizáveis
- **Custom Hooks**: Lógica de negócio encapsulada
- **Context API**: Gerenciamento de estado global
- **Route-Based Navigation**: Navegação profissional com URLs semânticas

---

## 💻 Tecnologias Utilizadas

### Frontend
- **React 18**: Biblioteca principal para UI
- **TypeScript**: Tipagem estática
- **Vite**: Build tool e dev server
- **React Router DOM**: Roteamento
- **Tailwind CSS**: Framework CSS utilitário
- **Radix UI**: Componentes acessíveis
- **Shadcn/ui**: Sistema de design

### Backend
- **Supabase**: Backend-as-a-Service
- **PostgreSQL**: Banco de dados relacional
- **Row Level Security (RLS)**: Segurança de dados
- **Realtime Subscriptions**: Atualizações em tempo real

### Ferramentas de Desenvolvimento
- **ESLint**: Linting de código
- **Prettier**: Formatação de código
- **Playwright**: Testes end-to-end
- **Kiro IDE**: Ambiente de desenvolvimento

---

## 📁 Estrutura do Projeto

```
shop-assist-aid/
├── public/                     # Arquivos estáticos
├── src/
│   ├── components/            # Componentes reutilizáveis
│   │   ├── ui/               # Componentes base (shadcn/ui)
│   │   ├── Navbar.tsx        # Barra de navegação
│   │   └── OperatorSelection.tsx # Seleção de operador
│   ├── contexts/             # Contextos React
│   │   └── AppContext.tsx    # Estado global da aplicação
│   ├── hooks/                # Hooks customizados
│   │   ├── useEquipmentStatus.ts      # Status dos equipamentos
│   │   ├── useEquipmentAvailability.ts # Verificação de disponibilidade
│   │   └── useLoanProcessing.ts       # Processamento de empréstimos
│   ├── integrations/         # Integrações externas
│   │   └── supabase/         # Configuração Supabase
│   │       ├── client.ts     # Cliente Supabase
│   │       └── types.ts      # Tipos TypeScript gerados
│   ├── pages/                # Páginas da aplicação
│   │   ├── Equipamentos.tsx          # Página inicial do totem
│   │   ├── SelecionarEquipamento.tsx # Seleção de equipamentos
│   │   ├── CadastrarCliente.tsx      # Cadastro de cliente
│   │   ├── ConfirmarEmprestimo.tsx   # Confirmação de empréstimo
│   │   ├── DevolverEquipamento.tsx   # Devolução de equipamentos
│   │   ├── Index.tsx                 # Página inicial do site
│   │   ├── ComoFunciona.tsx          # Página informativa
│   │   ├── Contato.tsx               # Página de contato
│   │   └── NotFound.tsx              # Página 404
│   ├── __tests__/            # Testes
│   ├── App.tsx               # Componente raiz
│   ├── main.tsx              # Ponto de entrada
│   └── index.css             # Estilos globais
├── supabase/
│   └── migrations/           # Migrações do banco
│       └── 001_create_shoplend_tables.sql
├── .kiro/                    # Configurações Kiro
│   ├── specs/                # Especificações de features
│   └── settings/             # Configurações
├── package.json              # Dependências e scripts
├── tailwind.config.js        # Configuração Tailwind
├── tsconfig.json             # Configuração TypeScript
└── vite.config.ts            # Configuração Vite
```

---

## 🗄️ Banco de Dados

### Tabelas Principais

#### `segurancas`
Funcionários de segurança que operam o sistema.
```sql
- id: UUID (PK)
- nome: VARCHAR(100)
- posto_trabalho: VARCHAR(20) ['espaco_familia', 'espaco_pet']
- ativo: BOOLEAN
- created_at, updated_at: TIMESTAMP
```

#### `clientes`
Clientes que solicitam empréstimos.
```sql
- id: UUID (PK)
- nome: VARCHAR(100)
- cpf: VARCHAR(11) UNIQUE
- telefone: VARCHAR(15)
- email: VARCHAR(100) NULLABLE
- categoria_cliente: VARCHAR(20) ['gestante', 'idoso', 'outros']
- created_at, updated_at: TIMESTAMP
```

#### `equipamentos`
Equipamentos disponíveis para empréstimo.
```sql
- id: UUID (PK)
- tipo_equipamento: VARCHAR(20) ['carrinho_bebe', 'cadeira_rodas', 'carrinho_pet']
- codigo: VARCHAR(20) UNIQUE
- status: VARCHAR(20) ['disponivel', 'em_uso', 'em_manutencao']
- localizacao: VARCHAR(20) ['espaco_familia', 'espaco_pet']
- observacoes: TEXT NULLABLE
- created_at, updated_at: TIMESTAMP
```

#### `emprestimos`
Registros de empréstimos realizados.
```sql
- id: UUID (PK)
- cliente_id: UUID (FK)
- equipamento_id: UUID (FK)
- seguranca_id: UUID (FK)
- data_emprestimo: TIMESTAMP
- tempo_uso_estimado: INTEGER (horas)
- data_devolucao_prevista: TIMESTAMP
- data_devolucao_real: TIMESTAMP NULLABLE
- status: VARCHAR(20) ['ativo', 'finalizado', 'atrasado']
- termo_aceito: BOOLEAN
- observacoes: TEXT NULLABLE
- created_at, updated_at: TIMESTAMP
```

#### `fila_espera`
Fila de espera quando não há equipamentos disponíveis.
```sql
- id: UUID (PK)
- cliente_id: UUID (FK)
- tipo_equipamento: VARCHAR(20)
- data_entrada: TIMESTAMP
- posicao: INTEGER
- status: VARCHAR(20) ['aguardando', 'notificado', 'atendido', 'cancelado']
- created_at, updated_at: TIMESTAMP
```

### Views

#### `vw_disponibilidade_equipamentos`
Agregação da disponibilidade por tipo de equipamento.
```sql
- tipo_equipamento: VARCHAR(20)
- localizacao: VARCHAR(20)
- total: INTEGER
- disponiveis: INTEGER
- em_uso: INTEGER
- em_manutencao: INTEGER
```

#### `vw_emprestimos_ativos`
Empréstimos atualmente ativos com dados do cliente.
```sql
- id: UUID
- codigo_equipamento: VARCHAR(20)
- tipo_equipamento: VARCHAR(20)
- nome_cliente: VARCHAR(100)
- data_emprestimo: TIMESTAMP
- prazo_devolucao: TIMESTAMP
```

#### `vw_fila_espera_ordenada`
Fila de espera ordenada por posição.
```sql
- id: UUID
- nome_cliente: VARCHAR(100)
- tipo_equipamento: VARCHAR(20)
- posicao: INTEGER
- tempo_espera: INTERVAL
- status: VARCHAR(20)
```

---

## ⚙️ Funcionalidades Implementadas

### ✅ Concluídas (v1.0.0)

#### 1. Sistema de Seleção de Operador
- Lista funcionários ativos do banco de dados
- Seleção sem senha (conforme PRD)
- Troca de operador sem reiniciar aplicação
- Context API para estado global

#### 2. Sistema de Status de Equipamentos em Tempo Real
- Hook `useEquipmentStatus` para buscar dados do Supabase
- Subscriptions em tempo real para mudanças
- Loading states e tratamento de erros
- Integração com views otimizadas

#### 3. Formulário de Cadastro de Cliente
- Validação completa de CPF com dígito verificador
- Formatação automática de telefone
- Validação de email (opcional)
- Seleção de categoria com ícones
- Feedback visual de erros

#### 4. Sistema de Verificação de Disponibilidade
- Verificação em tempo real no Supabase
- Prevenção de conflitos simultâneos
- Indicadores visuais de status
- Mensagens claras de disponibilidade

#### 5. Sistema de Processamento de Empréstimos
- Criação/atualização automática de clientes
- Cálculo automático de prazo de devolução
- Atualização de status de equipamentos
- Tela de confirmação com todos os detalhes
- Códigos de empréstimo únicos

#### 6. Fluxo de Navegação Profissional
- URLs semânticas (`/selecionar-equipamento`, `/cadastrar-cliente`, etc.)
- Navegação entre etapas com estado preservado
- Botões de voltar e cancelar
- Breadcrumbs visuais

### 🚧 Pendentes (Próximas Versões)

#### 7. Sistema de Fila de Espera
- Adição automática quando não há equipamentos
- Cálculo de posição e tempo estimado
- Notificações quando equipamentos ficam disponíveis
- Interface de gerenciamento da fila

#### 8. Sistema de Devolução Funcional
- Processamento de devoluções
- Atualização de status para 'disponivel'
- Registro de timestamp de devolução
- Processamento automático da fila

#### 9. Tratamento Avançado de Erros
- Error boundaries para falhas de conexão
- Loading skeletons
- Mecanismos de retry
- Mensagens de erro user-friendly

#### 10. Otimizações de Performance
- Cache inteligente para dados frequentes
- Debouncing para atualizações em tempo real
- Paginação para grandes datasets
- Otimização de queries

---

## 🗺️ Fluxo de Navegação

### Fluxo Principal de Empréstimo
```
1. / (Equipamentos) → Seleção EMPRESTAR/DEVOLVER
2. /selecionar-equipamento → Lista de equipamentos disponíveis
3. /cadastrar-cliente/:tipo → Formulário de cadastro
4. /confirmar-emprestimo → Confirmação e processamento
5. Tela de Sucesso → Detalhes do empréstimo criado
```

### Fluxo de Devolução
```
1. / (Equipamentos) → Seleção DEVOLVER
2. /devolver-equipamento → Lista de equipamentos emprestados
3. /confirmar-devolucao → Confirmação de devolução (pendente)
```

### Fluxo de Seleção de Operador
```
Qualquer rota do totem sem operador → OperatorSelection → Rota original
```

---

## 🧩 Componentes Principais

### `OperatorSelection.tsx`
**Propósito**: Seleção de funcionário para operar o sistema  
**Estado**: Busca funcionários ativos do Supabase  
**Funcionalidades**:
- Lista funcionários por posto de trabalho
- Ícones diferenciados por área
- Loading states e tratamento de erros
- Botão de atualizar lista

### `Equipamentos.tsx`
**Propósito**: Tela inicial do totem  
**Funcionalidades**:
- Header com informações do operador
- Botões grandes para EMPRESTAR/DEVOLVER
- Troca de operador
- Design responsivo para totem

### `SelecionarEquipamento.tsx`
**Propósito**: Seleção de equipamento para empréstimo  
**Estado**: Integrado com `useEquipmentStatus`  
**Funcionalidades**:
- Cards de equipamentos com disponibilidade real
- Verificação de disponibilidade ao clicar
- Loading states durante verificação
- Navegação para cadastro com tipo selecionado

### `CadastrarCliente.tsx`
**Propósito**: Cadastro de dados do cliente  
**Validações**:
- CPF com dígito verificador
- Telefone com formatação automática
- Email opcional com validação
- Categoria obrigatória
**Funcionalidades**:
- Formatação automática de campos
- Feedback visual de erros
- Preview do equipamento selecionado
- Liberação de reserva ao cancelar

### `ConfirmarEmprestimo.tsx`
**Propósito**: Confirmação e processamento do empréstimo  
**Estados**:
- Tela de confirmação com resumo
- Tela de processamento com loading
- Tela de sucesso com detalhes completos
- Tela de erro com retry
**Funcionalidades**:
- Processamento completo do empréstimo
- Códigos únicos de identificação
- Instruções para o cliente
- Formatação de dados (CPF, telefone, datas)

### `DevolverEquipamento.tsx`
**Propósito**: Lista equipamentos para devolução  
**Estado**: Busca da view `vw_emprestimos_ativos`  
**Funcionalidades**:
- Cards com dados do empréstimo
- Informações do cliente e horários
- Preparado para navegação de confirmação

---

## 🎣 Hooks Customizados

### `useEquipmentStatus.ts`
**Propósito**: Gerenciar estado dos equipamentos  
**Funcionalidades**:
- Busca equipamentos e disponibilidade
- Subscriptions em tempo real
- Funções de atualização de status
- Cache local com sincronização

**Principais Métodos**:
```typescript
- fetchEquipments(): Promise<void>
- updateEquipmentStatus(id: string, status: string): Promise<void>
- getAvailableEquipmentsByType(tipo: string): Equipamento[]
- getEquipmentAvailability(tipo: string): DisponibilidadeEquipamento
- refetch(): Promise<void>
```

### `useEquipmentAvailability.ts`
**Propósito**: Verificação de disponibilidade  
**Funcionalidades**:
- Verificação em tempo real
- Prevenção de conflitos
- Estados de loading

**Principais Métodos**:
```typescript
- checkAvailability(tipo: string): Promise<AvailabilityResult>
- reserveEquipment(id: string): Promise<{success: boolean, message: string}>
- releaseReservation(id: string): Promise<{success: boolean, message: string}>
- checkAndReserve(tipo: string): Promise<ReserveResult>
```

### `useLoanProcessing.ts`
**Propósito**: Processamento de empréstimos  
**Funcionalidades**:
- Criação/atualização de clientes
- Processamento completo de empréstimos
- Cálculo de prazos
- Atualização de status

**Principais Métodos**:
```typescript
- createLoan(data: LoanData): Promise<LoanResult>
- cancelLoan(loanId: string): Promise<{success: boolean, message: string}>
- calculateReturnDeadline(hours: number): Date
```

---

## 🐛 Problemas Encontrados e Soluções

### Versão 1.0.0 - Problemas Críticos Resolvidos

#### Problema 1: Equipamentos Sempre Indisponíveis
**Sintoma**: Todos os equipamentos mostravam "0 de X disponíveis"  
**Causa**: Campo errado na view `vw_disponibilidade_equipamentos`  
**Código Problemático**:
```typescript
const availableCount = availabilityInfo?.disponivel || 0; // ❌ ERRADO
```
**Solução**:
```typescript
const availableCount = availabilityInfo?.disponiveis || 0; // ✅ CORRETO
```
**Arquivo**: `src/pages/SelecionarEquipamento.tsx:67`  
**Data**: 29/07/2025  

#### Problema 2: Erro de Constraint ao Reservar
**Sintoma**: Erro 23514 - violação de constraint "equipamentos_status_check"  
**Causa**: Status 'reservado' não permitido na tabela  
**Constraint**: `status IN ('disponivel', 'em_uso', 'em_manutencao')`  
**Solução**: Removido sistema de reserva física, implementada verificação no momento do empréstimo  
**Arquivos Alterados**:
- `src/hooks/useEquipmentAvailability.ts`
- `src/hooks/useLoanProcessing.ts`
**Data**: 29/07/2025  

#### Problema 3: Campo Inexistente na Tabela Empréstimos
**Sintoma**: Erro PGRST204 - coluna 'prazo_devolucao' não encontrada  
**Causa**: Nome incorreto da coluna na tabela  
**Código Problemático**:
```typescript
prazo_devolucao: returnDeadline.toISOString(), // ❌ ERRADO
```
**Solução**:
```typescript
data_devolucao_prevista: returnDeadline.toISOString(), // ✅ CORRETO
tempo_uso_estimado: loanData.estimatedDurationHours || 3, // ✅ ADICIONADO
```
**Arquivo**: `src/hooks/useLoanProcessing.ts:89`  
**Data**: 29/07/2025  

### Lições Aprendidas

1. **Sempre verificar nomes de campos**: Usar ferramentas como `information_schema.columns` para confirmar estrutura
2. **Testar constraints**: Verificar todas as constraints antes de implementar lógica de negócio
3. **Usar tipos TypeScript**: Os tipos gerados do Supabase ajudam a evitar erros de campo
4. **Testes end-to-end**: Playwright foi fundamental para identificar problemas reais

---

## 🚀 Configuração e Deploy

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Conta Supabase
- Projeto Supabase configurado

### Instalação Local
```bash
# Clone o repositório
git clone <repository-url>
cd shop-assist-aid

# Instale dependências
npm install

# Configure variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais Supabase

# Execute migrações
npx supabase db push

# Inicie o servidor de desenvolvimento
npm run dev
```

### Variáveis de Ambiente
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Build para Produção
```bash
# Build da aplicação
npm run build

# Preview do build
npm run preview

# Deploy (exemplo com Vercel)
vercel --prod
```

### Configuração do Supabase

#### 1. Executar Migrações
```sql
-- Execute o arquivo supabase/migrations/001_create_shoplend_tables.sql
-- no SQL Editor do Supabase Dashboard
```

#### 2. Configurar RLS (Row Level Security)
```sql
-- Habilitar RLS em todas as tabelas
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE emprestimos ENABLE ROW LEVEL SECURITY;
ALTER TABLE segurancas ENABLE ROW LEVEL SECURITY;
ALTER TABLE fila_espera ENABLE ROW LEVEL SECURITY;

-- Criar políticas básicas (exemplo)
CREATE POLICY "Permitir leitura para todos" ON equipamentos FOR SELECT USING (true);
CREATE POLICY "Permitir escrita para autenticados" ON equipamentos FOR ALL USING (auth.role() = 'authenticated');
```

#### 3. Popular Dados Iniciais
```sql
-- Inserir funcionários de segurança
INSERT INTO segurancas (nome, posto_trabalho, ativo) VALUES
('João Silva', 'espaco_familia', true),
('Maria Santos', 'espaco_familia', true),
('Ana Oliveira', 'espaco_pet', true),
('Pedro Costa', 'espaco_pet', true);

-- Inserir equipamentos
INSERT INTO equipamentos (tipo_equipamento, codigo, status, localizacao) VALUES
('carrinho_bebe', 'CB-001', 'disponivel', 'espaco_familia'),
('carrinho_bebe', 'CB-002', 'disponivel', 'espaco_familia'),
('carrinho_bebe', 'CB-003', 'disponivel', 'espaco_familia'),
('carrinho_bebe', 'CB-004', 'disponivel', 'espaco_familia'),
('carrinho_bebe', 'CB-005', 'disponivel', 'espaco_familia'),
('cadeira_rodas', 'CR-001', 'disponivel', 'espaco_familia'),
('cadeira_rodas', 'CR-002', 'disponivel', 'espaco_familia'),
('cadeira_rodas', 'CR-003', 'disponivel', 'espaco_familia'),
('cadeira_rodas', 'CR-004', 'disponivel', 'espaco_familia'),
('carrinho_pet', 'CP-001', 'disponivel', 'espaco_pet'),
('carrinho_pet', 'CP-002', 'disponivel', 'espaco_pet'),
('carrinho_pet', 'CP-003', 'disponivel', 'espaco_pet');
```

---

## 🔧 Manutenção

### Monitoramento

#### Logs Importantes
- **Console do Browser**: Erros de JavaScript e network
- **Supabase Dashboard**: Logs de API e banco de dados
- **Vercel/Netlify**: Logs de deploy e runtime

#### Métricas a Acompanhar
- Taxa de erro em empréstimos
- Tempo de resposta das queries
- Uso de recursos do Supabase
- Disponibilidade da aplicação

### Backup e Recuperação

#### Backup do Banco de Dados
```bash
# Via Supabase CLI
supabase db dump --file backup.sql

# Via Dashboard
# Settings > Database > Backup & Restore
```

#### Recuperação de Dados
```sql
-- Restaurar empréstimo cancelado por erro
UPDATE emprestimos 
SET status = 'ativo' 
WHERE id = 'loan_id' AND status = 'cancelado';

-- Liberar equipamento travado
UPDATE equipamentos 
SET status = 'disponivel' 
WHERE id = 'equipment_id' AND status = 'em_uso';
```

### Atualizações de Dependências

#### Atualizações Seguras
```bash
# Verificar dependências desatualizadas
npm outdated

# Atualizar dependências patch/minor
npm update

# Atualizar dependências major (cuidado!)
npm install package@latest
```

#### Dependências Críticas
- **React**: Testar thoroughly antes de atualizar major versions
- **Supabase**: Verificar breaking changes na documentação
- **TypeScript**: Pode quebrar tipos existentes
- **Tailwind**: Mudanças de classes podem afetar styling

### Troubleshooting Comum

#### Problema: Equipamentos não carregam
**Verificações**:
1. Conexão com Supabase (Network tab)
2. RLS policies configuradas
3. Dados existem nas tabelas
4. Types do TypeScript atualizados

#### Problema: Empréstimo não processa
**Verificações**:
1. Campos obrigatórios preenchidos
2. Equipamento ainda disponível
3. Constraints da tabela respeitadas
4. Operador selecionado válido

#### Problema: Realtime não funciona
**Verificações**:
1. Subscription configurada corretamente
2. RLS permite acesso aos dados
3. Conexão WebSocket ativa
4. Limites do plano Supabase

---

## 📝 Changelog

### v1.0.0 - 29/07/2025
**🎉 Release Inicial**

#### ✅ Funcionalidades Implementadas
- Sistema completo de seleção de operador
- Navegação profissional com URLs semânticas
- Seleção de equipamentos com disponibilidade real
- Cadastro de cliente com validações completas
- Processamento de empréstimos end-to-end
- Telas de confirmação e sucesso
- Integração completa com Supabase
- Sistema de tipos TypeScript
- Interface responsiva para totem

#### 🐛 Bugs Corrigidos
- **CRÍTICO**: Campo `disponivel` → `disponiveis` na view de disponibilidade
- **CRÍTICO**: Removido status 'reservado' não permitido pela constraint
- **CRÍTICO**: Campo `prazo_devolucao` → `data_devolucao_prevista` na tabela empréstimos
- Validação de CPF com dígito verificador
- Formatação automática de telefone e CPF
- Loading states em todas as operações assíncronas

#### 🔧 Melhorias Técnicas
- Hooks customizados para lógica de negócio
- Context API para estado global
- Error boundaries e tratamento de erros
- Subscriptions em tempo real
- Otimização de queries com views
- Componentes reutilizáveis

#### 📚 Documentação
- Documentação técnica completa
- Guia de instalação e configuração
- Troubleshooting e manutenção
- Estrutura do banco de dados
- Fluxos de navegação

### Próximas Versões Planejadas

#### v1.1.0 - Sistema de Fila de Espera
- Adição automática à fila quando não há equipamentos
- Notificações quando equipamentos ficam disponíveis
- Interface de gerenciamento da fila
- Cálculo de tempo estimado de espera

#### v1.2.0 - Sistema de Devolução Completo
- Processamento de devoluções
- Confirmação de devolução
- Liberação automática da fila de espera
- Relatórios de uso

#### v1.3.0 - Melhorias de UX/UI
- Animações e transições
- Feedback visual aprimorado
- Modo escuro/claro
- Acessibilidade completa

#### v2.0.0 - Recursos Avançados
- Dashboard administrativo
- Relatórios e analytics
- Sistema de notificações
- Multi-tenancy para múltiplos shoppings

---

## 👥 Contribuição

### Padrões de Código
- **TypeScript**: Sempre usar tipagem estrita
- **ESLint**: Seguir regras configuradas
- **Prettier**: Formatação automática
- **Commits**: Usar Conventional Commits

### Fluxo de Desenvolvimento
1. Criar branch feature/bug-fix
2. Implementar mudanças com testes
3. Atualizar documentação se necessário
4. Criar Pull Request
5. Code review e merge

### Testes
```bash
# Testes unitários
npm run test

# Testes E2E com Playwright
npm run test:e2e

# Coverage
npm run test:coverage
```

---

## 📞 Suporte

### Contatos Técnicos
- **Desenvolvedor**: Kiro AI Assistant
- **Repositório**: [GitHub Repository]
- **Documentação**: Este arquivo

### Recursos Úteis
- [Supabase Documentation](https://supabase.com/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

**Última Atualização**: 29/07/2025  
**Versão da Documentação**: 1.0.0