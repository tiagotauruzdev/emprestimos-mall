# Design Document

## Overview

Esta feature modifica o roteamento padrão da aplicação ShopLend para que a rota raiz ("/") redirecione diretamente para a interface do totem de equipamentos. A mudança é simples mas estratégica, otimizando a experiência do usuário em um ambiente de totem físico onde o acesso rápido às funcionalidades principais é essencial.

## Architecture

### Current Architecture
- Rota "/" → Index (Landing Page)
- Rota "/equipamentos" → Equipamentos (Totem Interface)
- Outras rotas mantidas

### New Architecture
- Rota "/" → Equipamentos (Totem Interface) - **MUDANÇA PRINCIPAL**
- Rota "/home" → Index (Landing Page) - **NOVA ROTA**
- Outras rotas mantidas inalteradas

### Route Structure
```
/                    → Equipamentos (Totem Interface)
/home               → Index (Landing Page)
/equipamentos       → Equipamentos (mantido para compatibilidade)
/como-funciona      → ComoFunciona
/contato            → Contato
```

## Components and Interfaces

### Modified Components

#### App.tsx
- **Mudança**: Alterar a rota "/" para renderizar `<Equipamentos />` ao invés de `<Index />`
- **Adição**: Nova rota "/home" para renderizar `<Index />`
- **Manutenção**: Manter rota "/equipamentos" para compatibilidade

#### Navbar.tsx
- **Consideração**: Avaliar se é necessário ajustar links de navegação
- **Decisão**: Manter navegação atual, pois o totem pode não usar a navbar em modo fullscreen

### Unchanged Components
- `Equipamentos.tsx` - Mantém toda funcionalidade existente
- `Index.tsx` - Mantém toda funcionalidade existente
- Outros componentes permanecem inalterados

## Data Models

Não há mudanças nos modelos de dados, pois esta é uma alteração puramente de roteamento.

## Error Handling

### Route Fallback
- Manter a rota catch-all "*" para `<NotFound />`
- Garantir que rotas inválidas ainda sejam tratadas adequadamente

### Backward Compatibility
- Manter rota "/equipamentos" funcionando para evitar quebra de links existentes
- Considerar redirecionamento se necessário

## Testing Strategy

### Unit Tests
- Testar se a rota "/" renderiza o componente `Equipamentos`
- Testar se a nova rota "/home" renderiza o componente `Index`
- Verificar se todas as outras rotas continuam funcionando

### Integration Tests
- Testar navegação completa do totem (emprestar/devolver)
- Verificar se a funcionalidade do totem não foi afetada
- Testar acesso às páginas institucionais via rotas específicas

### Manual Testing
- Verificar carregamento inicial da aplicação
- Testar fluxo completo do totem
- Confirmar acesso às outras páginas quando necessário

## Implementation Considerations

### Performance
- A mudança não deve impactar a performance, pois apenas altera qual componente é renderizado na rota raiz
- O componente `Equipamentos` já está otimizado

### SEO Impact
- Considerar impacto em SEO se a aplicação for indexada
- A landing page ainda estará acessível via "/home"

### User Experience
- Melhora significativa para usuários do totem físico
- Acesso direto às funcionalidades principais
- Redução de cliques necessários para usar o sistema

### Deployment
- Mudança simples que pode ser deployada sem downtime
- Não requer migrações de banco de dados
- Compatível com a infraestrutura atual

## Future Considerations

### Configuration-Based Routing
- Possibilidade futura de tornar a rota padrão configurável
- Permitir diferentes comportamentos para diferentes ambientes (totem vs web)

### Analytics
- Considerar tracking de uso para validar a efetividade da mudança
- Monitorar se usuários ainda acessam a landing page via "/home"