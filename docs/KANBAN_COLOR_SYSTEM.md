# 🎨 Sistema de Cores do Kanban - Funil de Vendas

## 📋 Visão Geral

O sistema de cores do Kanban foi completamente refatorado para garantir a compatibilidade perfeita com os temas claro e escuro, utilizando tokens semânticos do design system.

## 🎯 Cores Específicas do Kanban

### Tema Claro
```css
:root {
  /* Novos Leads - Azul */
  --kanban-new: 216 85% 58%;
  --kanban-new-bg: 216 100% 97%;
  --kanban-new-border: 216 85% 85%;

  /* Contato Feito - Laranja */
  --kanban-contact: 38 92% 50%;
  --kanban-contact-bg: 38 92% 96%;
  --kanban-contact-border: 38 92% 85%;

  /* Proposta Enviada - Roxo */
  --kanban-proposal: 271 76% 53%;
  --kanban-proposal-bg: 271 76% 97%;
  --kanban-proposal-border: 271 76% 85%;

  /* Em Negociação - Laranja Escuro */
  --kanban-negotiation: 25 95% 53%;
  --kanban-negotiation-bg: 25 95% 96%;
  --kanban-negotiation-border: 25 95% 85%;

  /* Ganhos - Verde */
  --kanban-won: 142 76% 40%;
  --kanban-won-bg: 142 76% 96%;
  --kanban-won-border: 142 76% 85%;

  /* Perdidos - Vermelho */
  --kanban-lost: 0 84% 60%;
  --kanban-lost-bg: 0 100% 97%;
  --kanban-lost-border: 0 84% 85%;
}
```

### Tema Escuro
```css
.dark {
  /* Cores ajustadas para tema escuro com melhor contraste */
  --kanban-new: 216 87% 65%;
  --kanban-new-bg: 216 100% 8%;
  --kanban-new-border: 216 87% 25%;

  --kanban-contact: 38 92% 55%;
  --kanban-contact-bg: 38 92% 8%;
  --kanban-contact-border: 38 92% 25%;

  --kanban-proposal: 271 76% 60%;
  --kanban-proposal-bg: 271 76% 8%;
  --kanban-proposal-border: 271 76% 25%;

  --kanban-negotiation: 25 95% 58%;
  --kanban-negotiation-bg: 25 95% 8%;
  --kanban-negotiation-border: 25 95% 25%;

  --kanban-won: 142 76% 45%;
  --kanban-won-bg: 142 76% 8%;
  --kanban-won-border: 142 76% 25%;

  --kanban-lost: 0 63% 65%;
  --kanban-lost-bg: 0 100% 8%;
  --kanban-lost-border: 0 63% 25%;
}
```

## 🛠️ Classes Utilitárias

### Classes CSS Customizadas
```css
.kanban-card {
  /* Cards dos leads com animações suaves */
  @apply bg-card border border-border rounded-lg p-3 shadow-sm;
  @apply transition-all duration-200 hover:shadow-md hover:scale-[1.02];
  @apply cursor-grab active:cursor-grabbing;
}

.kanban-column {
  /* Colunas responsivas com efeitos visuais */
  @apply min-h-32 rounded-lg border-2;
  @apply transition-all duration-300 ease-in-out;
  @apply backdrop-blur-sm;
}

.kanban-column.dragging-over {
  /* Estado visual durante drag and drop */
  @apply ring-2 ring-primary ring-opacity-50 shadow-lg scale-105;
  @apply border-primary;
}
```

## 📱 Configuração no Tailwind

As cores foram adicionadas ao `tailwind.config.ts`:

```typescript
kanban: {
  new: 'hsl(var(--kanban-new))',
  'new-bg': 'hsl(var(--kanban-new-bg))',
  'new-border': 'hsl(var(--kanban-new-border))',
  // ... outras cores
}
```

## 🔧 Uso no Componente

### Antes (Hardcoded)
```typescript
color: 'bg-blue-100 border-blue-300'
```

### Depois (Sistema de Design)
```typescript
color: 'bg-kanban-new-bg border-kanban-new-border'
```

## ✅ Benefícios

1. **Compatibilidade com Temas**: Cores se adaptam automaticamente ao tema escuro/claro
2. **Consistência Visual**: Utiliza o sistema de design padronizado
3. **Manutenibilidade**: Centralizado no arquivo CSS
4. **Acessibilidade**: Contraste adequado em ambos os temas
5. **Performance**: Não recalcula cores dinamicamente

## 🎯 Mapeamento de Status

| Status | Cor | Significado |
|--------|-----|-------------|
| Novos Leads | Azul | Potenciais clientes chegando |
| Contato Feito | Laranja | Primeiro contato realizado |
| Proposta Enviada | Roxo | Proposta formal enviada |
| Em Negociação | Laranja Escuro | Discussão ativa de termos |
| Ganhos | Verde | Vendas concretizadas |
| Perdidos | Vermelho | Oportunidades não convertidas |

## 📚 Arquivos Modificados

- `src/index.css` - Adição das variáveis CSS e classes utilitárias
- `tailwind.config.ts` - Registro das cores no sistema Tailwind
- `src/components/KanbanBoard.tsx` - Migração para o novo sistema de cores

---

*Este sistema garante uma experiência visual consistente e moderna em todos os temas da aplicação.*