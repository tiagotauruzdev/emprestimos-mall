# Requirements Document

## Introduction

Esta feature modifica o comportamento padrão da aplicação ShopLend para que ela inicie diretamente na interface do totem de equipamentos, ao invés da landing page atual. O objetivo é otimizar a experiência do usuário em um ambiente de totem físico, onde o acesso direto às funcionalidades principais é prioritário.

## Requirements

### Requirement 1

**User Story:** Como um usuário do totem, eu quero que a aplicação inicie diretamente na tela de seleção de equipamentos, para que eu possa acessar rapidamente as funcionalidades de empréstimo e devolução.

#### Acceptance Criteria

1. WHEN o usuário acessa a URL raiz "/" THEN o sistema SHALL exibir diretamente a tela do totem de equipamentos
2. WHEN a aplicação é carregada THEN o sistema SHALL mostrar os botões "EMPRESTAR" e "DEVOLVER" como primeira interface
3. WHEN o usuário acessa a aplicação THEN o sistema SHALL manter a funcionalidade completa do totem (navegação entre empréstimo e devolução)

### Requirement 2

**User Story:** Como administrador do sistema, eu ainda quero ter acesso às outras páginas da aplicação (landing page, como funciona, contato), para que eu possa gerenciar e visualizar informações institucionais quando necessário.

#### Acceptance Criteria

1. WHEN o usuário acessa URLs específicas como "/home", "/como-funciona", "/contato" THEN o sistema SHALL exibir as respectivas páginas
2. WHEN necessário THEN o sistema SHALL permitir navegação para outras seções através de rotas específicas
3. WHEN o usuário está em outras páginas THEN o sistema SHALL manter a funcionalidade de navegação existente

### Requirement 3

**User Story:** Como desenvolvedor, eu quero que a mudança seja implementada de forma limpa e reversível, para que possamos facilmente ajustar o comportamento padrão no futuro se necessário.

#### Acceptance Criteria

1. WHEN a mudança é implementada THEN o sistema SHALL manter a estrutura de rotas existente
2. WHEN necessário THEN o sistema SHALL permitir fácil reversão para o comportamento anterior
3. WHEN a aplicação é modificada THEN o sistema SHALL manter a performance e responsividade existentes