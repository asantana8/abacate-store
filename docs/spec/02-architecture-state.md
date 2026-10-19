# 02. Arquitetura do Frontend e Gerenciamento de Estado

## 1. Stack Tecnológica Base
- **Framework:** Angular 20+ (Componentes Standalone).
- **Gerenciamento de Estado:** Angular Signals (`signal`, `computed`, `effect`).
- **Navegação:** `@angular/router` com carregamento preguiçoso (lazy loading).
- **Formulários:** Reactive Forms (`FormBuilder`, `Validators`).

## 2. Configuração de Localização (`src/app/app.config.ts`)
Garantir o suporte completo a `pt-BR` para exibição correta de moedas (`R$`) e datas.

```typescript
import { ApplicationConfig, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { routes } from './app.routes';

registerLocaleData(localePt);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    { provide: LOCALE_ID, useValue: 'pt-BR' }
  ]
};
```

## 3. Arquitetura de Serviços & Contratos de Estado

### 3.1. `ProdutoService` (`src/app/services/produto.service.ts`)
- **Responsabilidade:** Carregamento do arquivo `produtos.json`, filtragem por categoria e busca textual.
- **Estado Reativo:**
  - `produtos` e `categorias`: Signals somente leitura, atualizados pelo carregamento HTTP.
  - `erro`: Signal de mensagem de erro ou `null`; falhas tambem sao propagadas pelo Observable.
  - `categoriaSelecionada = signal<CategoriaAbacate | null>(null)`
  - `termoBusca = signal<string>('')`
  - `produtosFiltrados = computed(() => ...)`
- **Métodos:**
  - `carregarProdutos(): Observable<void>`
  - `obterProdutoPorId(id: string): Signal<Produto | undefined>`
- O arquivo `src/assets/data/produtos.json` tem a raiz `{ categorias, produtos }`, em portugues.
- `carregarProdutos()` exige assinatura; nao ha carregamento automatico no construtor.
- Categoria e busca sao combinadas; a busca considera nome, subtitulo e descricao, ignorando acentos, caixa e espacos nas extremidades.

### 3.2. `CarrinhoService` (`src/app/services/carrinho.service.ts`)
- **Responsabilidade:** Controle reativo dos itens selecionados, quantidades e sincronização com `localStorage`.
- **Estado Reativo:**
  - `itens`: Signal somente leitura, com escrita interna ao servico.
  - `quantidadeTotalItens = computed(() => sum(itens.quantidade))`
  - `subtotal = computed(() => sum(itens.produto.preco * itens.quantidade))`
- **Métodos:**
  - `adicionarAoCarrinho(produto: Produto, quantidade: number): void`
  - `removerDoCarrinho(produtoId: string): void`
  - `atualizarQuantidade(produtoId: string, quantidade: number): void`
  - `limparCarrinho(): void`
- Produtos repetidos sao agrupados por ID. Quantidades fracionarias sao aceitas.
- Adicao exige quantidade positiva e finita. Atualizacao aceita zero para remover; negativos, `NaN` e infinitos geram erro.
- Atualizar um ID inexistente gera erro; remover um ID inexistente nao altera o carrinho.
- O subtotal e arredondado para duas casas decimais.
- A chave de persistencia e `abacate-store:carrinho`. A restauracao ocorre antes do primeiro `effect`.
- Dados persistidos invalidos sao rejeitados; falhas de leitura/escrita sao reportadas ao `ErrorHandler` do Angular. O carrinho permanece utilizavel em memoria.
- Fora do navegador, o servico nao acessa `localStorage`.

### 3.3. `PedidoService` (`src/app/services/pedido.service.ts`)
- **Responsabilidade:** Simulação do registro e fechamento de compra.
- **Estado Reativo:**
  - `ultimoPedido = signal<Pedido | null>(null)`
  - `historicoPedidos = signal<Pedido[]>([])`
- **Métodos:**
  - `gerarPedido(cliente: DadosCliente, itens: ItemCarrinho[], total: number): Pedido`
    - Gera ID no formato `PED-2026-XXXX`.
    - Executa `CarrinhoService.limparCarrinho()`.
    - Atualiza `ultimoPedido` e redireciona para a tela de confirmação.

## 4. Mapeamento de Rotas (`src/app/app.routes.ts`)

```typescript
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'produtos', loadComponent: () => import('./pages/lista-produtos/lista-produtos.component').then(m => m.ListaProdutosComponent) },
  { path: 'produtos/:id', loadComponent: () => import('./pages/detalhe-produto/detalhe-produto.component').then(m => m.DetalheProdutoComponent) },
  { path: 'carrinho', loadComponent: () => import('./pages/carrinho/carrinho.component').then(m => m.CarrinhoComponent) },
  { path: 'checkout', loadComponent: () => import('./pages/checkout/checkout.component').then(m => m.CheckoutComponent) },
  { path: 'pedido-confirmado/:id', loadComponent: () => import('./pages/pedido-confirmado/pedido-confirmado.component').then(m => m.PedidoConfirmadoComponent) },
  { path: '**', redirectTo: '' }
];
```