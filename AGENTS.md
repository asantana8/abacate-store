# AGENTS.md — Guia de Instrução Técnica para Agentes de IA

Este repositório segue o modelo **Spec-Driven Development (SDD)**. Toda a geração de código deve respeitar rigorosamente a Fonte Única da Verdade (SSOT) localizada na pasta `docs/specs/`.

---

## Documentos de Especificação Obrigatórios:
- **`docs/specs/01-data-contracts.md`**: Schemas TypeScript em `pt-BR` e JSON dos produtos.
- **`docs/specs/02-architecture-state.md`**: Serviços em Angular 20+, Signals e Roteamento.
- **`docs/specs/03-ui-components-ux.md`**: Telas, fluxos e mensagem obrigatória de "PEDIDO GERADO".
- **`docs/specs/04-ui-integration-rules.md`**: Uso do Angular Material (UI) + Bootstrap 5 (Layout CSS).

## Regras de Ouro:
1. **Idioma:** Todo o código, comentários, interfaces e mensagens devem estar 100% em **Português do Brasil (`pt-BR`)**.
2. **Framework:** Angular 20+ com **Standalone Components**, **Signals** e novo **Control Flow** (`@if`, `@for`).
3. **Checkout:** Sem gateway real; registrar pedido e exibir "PEDIDO GERADO COM SUCESSO!".
4. **CSS:** Usar Bootstrap APENAS para Grid/Utilitários. Componentes visuais pertencem EXCLUSIVAMENTE ao Angular Material.