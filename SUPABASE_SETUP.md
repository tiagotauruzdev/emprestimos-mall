# 🗄️ Setup do Banco de Dados Supabase - ShopLend

## 📋 Instruções para Criar as Tabelas

Como não tenho permissões para criar tabelas diretamente via MCP, você precisa executar as migrações manualmente no Supabase Dashboard.

### 🚀 Passo a Passo

1. **Acesse o Supabase Dashboard**
   - Vá para: https://supabase.com/dashboard
   - Faça login na sua conta
   - Selecione o projeto: `kkmdvkpfnpejdqrbgfly`

2. **Abra o SQL Editor**
   - No menu lateral, clique em "SQL Editor"
   - Clique em "New Query"

3. **Execute a Migração**
   - Copie todo o conteúdo do arquivo `supabase/migrations/001_create_shoplend_tables.sql`
   - Cole no SQL Editor
   - Clique em "Run" para executar

### 📊 Estrutura das Tabelas Criadas

#### 1. **clientes**
- `id` (UUID, PK)
- `nome` (VARCHAR, obrigatório)
- `cpf` (VARCHAR, único, obrigatório)
- `telefone` (VARCHAR, obrigatório)
- `email` (VARCHAR, opcional)
- `categoria_cliente` (gestante/idoso/outros)
- `created_at`, `updated_at`

#### 2. **segurancas**
- `id` (UUID, PK)
- `nome` (VARCHAR, obrigatório)
- `posto_trabalho` (espaco_familia/espaco_pet)
- `ativo` (BOOLEAN)
- `created_at`, `updated_at`

#### 3. **equipamentos**
- `id` (UUID, PK)
- `tipo_equipamento` (carrinho_bebe/cadeira_rodas/carrinho_pet)
- `codigo` (VARCHAR, único - ex: CB-001)
- `status` (disponivel/em_uso/em_manutencao)
- `localizacao` (espaco_familia/espaco_pet)
- `observacoes` (TEXT)
- `created_at`, `updated_at`

#### 4. **emprestimos**
- `id` (UUID, PK)
- `cliente_id` (FK → clientes)
- `equipamento_id` (FK → equipamentos)
- `seguranca_id` (FK → segurancas)
- `data_emprestimo`, `data_devolucao_prevista`, `data_devolucao_real`
- `tempo_uso_estimado` (INTEGER, horas)
- `status` (ativo/finalizado/atrasado)
- `termo_aceito` (BOOLEAN)
- `created_at`, `updated_at`

#### 5. **fila_espera**
- `id` (UUID, PK)
- `cliente_id` (FK → clientes)
- `tipo_equipamento_solicitado`
- `posicao` (INTEGER)
- `status` (aguardando/notificado/atendido/cancelado)
- `data_entrada_fila`, `notificado_em`, `expires_at`
- `tempo_uso_estimado`
- `created_at`, `updated_at`

### 🔍 Views Criadas

1. **vw_disponibilidade_equipamentos** - Mostra disponibilidade por tipo
2. **vw_emprestimos_ativos** - Lista empréstimos ativos com detalhes
3. **vw_fila_espera_ordenada** - Fila de espera ordenada por posição

### 📦 Dados Iniciais

A migração inclui:
- **4 funcionários de segurança** (2 para cada espaço)
- **12 equipamentos**:
  - 5 Carrinhos de Bebê (CB-001 a CB-005)
  - 4 Cadeiras de Rodas (CR-001 a CR-004)
  - 3 Carrinhos de Pet (CP-001 a CP-003)

### ✅ Verificação

Após executar a migração, você pode verificar se tudo foi criado corretamente executando:

```sql
-- Verificar tabelas criadas
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('clientes', 'segurancas', 'equipamentos', 'emprestimos', 'fila_espera');

-- Verificar equipamentos inseridos
SELECT tipo_equipamento, COUNT(*) as quantidade 
FROM equipamentos 
GROUP BY tipo_equipamento;

-- Verificar funcionários
SELECT nome, posto_trabalho FROM segurancas;
```

### 🔄 Próximos Passos

Após criar as tabelas:

1. **Regenerar Types**: Execute `npx supabase gen types typescript --project-id kkmdvkpfnpejdqrbgfly > src/integrations/supabase/types.ts`

2. **Configurar RLS** (Row Level Security) se necessário

3. **Testar conexão** no app React

4. **Implementar as funcionalidades** do PRD

---

## 🚨 Importante

- Faça backup do banco antes de executar
- Execute em ambiente de desenvolvimento primeiro
- Verifique se todas as tabelas foram criadas corretamente
- Teste as foreign keys e constraints

Após executar as migrações, me avise para continuarmos com a implementação das funcionalidades no React! 🚀