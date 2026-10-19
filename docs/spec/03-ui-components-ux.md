# 03. Diretrizes de Interface (UI), Estilização & Componentes

## 1. Mapeamento do Design System

### 1.1. Dependências Visuais
- **Bootstrap 5:** Grid responsivo (`container`, `row`, `col-*`) e utilitários (`d-flex`, `justify-content-between`, `my-3`, `gap-2`).
- **Angular Material 20+:** Componentes ricos e acessíveis.
- **Bootstrap Icons:** Ícones auxiliares.

### 1.2. Paleta de Cores e Estilos Globais (`src/styles.scss`)

```css
:root {
  --color-primary: #2D5A27;        /* Verde Abacate Principal */
  --color-primary-light: #4E8B44;  /* Verde Intermediário */
  --color-accent: #F4D03F;         /* Amarelo Polpa / Destaque */
  --color-success: #8DAA3F;        /* Verde Polpa / Em Estoque */
  --color-bg-light: #F8F9FA;       /* Fundo Neutro */
  --color-text-main: #1C2833;      /* Texto de Alto Contraste */
}

body {
  background-color: var(--color-bg-light);
  color: var(--color-text-main);
  font-family: Roboto, "Helvetica Neue", sans-serif;
}
```

## 2. Componentes e Telas

### 2.1. `HeaderComponent` (`src/app/components/header/header.component.ts`)
- Utiliza `<mat-toolbar color="primary">`.
- Exibe logo, links de navegação e botão com ícone do carrinho.
- O ícone do carrinho usa `[matBadge]="carrinhoService.quantidadeTotalItens()"` reativo.

### 2.2. `CardProdutoComponent` (`src/app/components/card-produto/card-produto.component.ts`)
- Utiliza `<mat-card class="h-100 shadow-sm">`.
- Apresenta imagem do abacate, nome, subtítulo, badges (`<mat-chip>`) de categoria e preço (`R$ X,XX / kg`).
- Ações: Botão "Ver Detalhes" e Botão "Adicionar".

### 2.3. `DetalheProdutoComponent` (`src/app/pages/detalhe-produto/detalhe-produto.component.ts`)
- Layout em 2 colunas no Bootstrap (`row` com `col-12 col-md-6`).
- Exibe a **Ficha Técnica** detalhada (Safra, Tamanho, Texturas, Teores de Água e Azeite) em tabela ou lista formatada (`<mat-list>`).
- Seletor de quantidade e botão de inclusão no carrinho.

### 2.4. `CheckoutComponent` (`src/app/pages/checkout/checkout.component.ts`)
- Formulário Reativo utilizando `<mat-form-field>`, `<mat-input>`, `<mat-select>` e `<mat-radio-group>`.
- Layout de 2 colunas: Dados de Entrega e Pagamento Fictício (`col-12 col-lg-8`) e Resumo de Valores (`col-12 col-lg-4`).
- Ao submeter: Invoca `gerarPedido(...)` do `PedidoService` e redireciona.

### 2.5. `PedidoConfirmadoComponent` (`src/app/pages/pedido-confirmado/pedido-confirmado.component.ts`)
- Card centralizado (`col-12 col-md-8 mx-auto text-center p-4`).
- **Mensagem Principal em Destaque:** **PEDIDO GERADO COM SUCESSO!**.
- Código do pedido gerado (ex: `PED-2026-9821`), lista resumida dos itens e dados do cliente.
- **Caixa de Aviso Institucional:**
  > *"Esta é uma demonstração de e-commerce fictício baseada nas variedades do site Abacates do Brasil. Nenhum valor monetário real foi cobrado e nenhum produto será enviado."*