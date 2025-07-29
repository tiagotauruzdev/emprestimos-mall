# Requirements Document

## Introduction

Esta feature implementa a integração completa do app ShopLend com o Supabase, transformando o protótipo visual atual em um sistema funcional que atende aos requisitos do PRD (Product Requirements Document). O objetivo é substituir os dados mockados por funcionalidades reais conectadas ao banco de dados.

## Requirements

### Requirement 1

**User Story:** Como desenvolvedor, eu quero que o app seja totalmente integrado com o Supabase, para que todas as funcionalidades do PRD sejam implementadas com dados reais.

#### Acceptance Criteria

1. WHEN o app é carregado THEN o sistema SHALL buscar dados reais do Supabase ao invés de usar dados mockados
2. WHEN um usuário interage com equipamentos THEN o sistema SHALL refletir o estado real do banco de dados
3. WHEN dados são modificados THEN o sistema SHALL persistir as mudanças no Supabase em tempo real

### Requirement 2

**User Story:** Como funcionário de segurança, eu quero um sistema de seleção de operador, para que todos os empréstimos sejam associados ao funcionário responsável.

#### Acceptance Criteria

1. WHEN o sistema é iniciado THEN o sistema SHALL exibir uma tela de seleção de funcionário
2. WHEN um funcionário é selecionado THEN o sistema SHALL associar todas as operações subsequentes a esse funcionário
3. WHEN necessário THEN o sistema SHALL permitir trocar de funcionário sem reiniciar o app

### Requirement 3

**User Story:** Como funcionário de segurança, eu quero um formulário de cadastro de cliente, para que eu possa registrar empréstimos conforme o PRD.

#### Acceptance Criteria

1. WHEN um equipamento é selecionado para empréstimo THEN o sistema SHALL exibir um formulário de cadastro
2. WHEN o formulário é preenchido THEN o sistema SHALL validar CPF, telefone e email
3. WHEN os dados são válidos THEN o sistema SHALL verificar disponibilidade em tempo real no Supabase

### Requirement 4

**User Story:** Como funcionário de segurança, eu quero um sistema de fila de espera automático, para que clientes sejam atendidos quando equipamentos ficarem disponíveis.

#### Acceptance Criteria

1. WHEN não há equipamento disponível THEN o sistema SHALL adicionar o cliente à fila automaticamente
2. WHEN um equipamento é devolvido THEN o sistema SHALL notificar o próximo cliente da fila
3. WHEN um cliente é notificado THEN o sistema SHALL mostrar sua posição e tempo estimado de espera

### Requirement 5

**User Story:** Como funcionário de segurança, eu quero que o sistema de devolução seja funcional, para que eu possa processar devoluções e liberar equipamentos.

#### Acceptance Criteria

1. WHEN a opção "DEVOLVER" é selecionada THEN o sistema SHALL mostrar apenas equipamentos em uso
2. WHEN uma devolução é processada THEN o sistema SHALL atualizar o status do equipamento para disponível
3. WHEN um equipamento fica disponível THEN o sistema SHALL processar automaticamente a fila de espera

### Requirement 6

**User Story:** Como desenvolvedor, eu quero que os types do TypeScript sejam atualizados, para que o desenvolvimento seja type-safe e sem erros.

#### Acceptance Criteria

1. WHEN as tabelas do Supabase existem THEN o sistema SHALL gerar types TypeScript atualizados
2. WHEN o código é escrito THEN o sistema SHALL ter autocomplete e validação de tipos
3. WHEN queries são feitas THEN o sistema SHALL ter tipos corretos para todas as tabelas e relacionamentos