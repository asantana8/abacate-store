# 01. Contratos de Dados & Schemas (Português - BR)

## 1. Modelos de Dados em TypeScript (`src/app/models/produto.model.ts`)

```typescript
export type CategoriaAbacate = 'gourmet' | 'tradicional' | 'refrescante';

export interface FichaTecnica {
  safra: string;          // Ex: "Fevereiro a Setembro"
  tamanho: string;        // Ex: "Pequeno (200g a 400g)"
  texturaCasca: string;   // Ex: "Rugosa"
  corCasca: string;       // Ex: "Negra / Verde bem escuro"
  teorAgua: string;       // Ex: "Baixo (~61%)"
  teorOleo: string;       // Ex: "Alto (20% - 25%)"
}

export interface Categoria {
  id: CategoriaAbacate;
  nome: string;
}

export interface CatalogoProdutos {
  categorias: Categoria[];
  produtos: Produto[];
}

export interface Produto {
  id: string;
  nome: string;
  subtitulo: string;
  categoria: CategoriaAbacate;
  preco: number;          // Ex: 12.90
  unidadeMedida: 'kg' | 'unidade';
  descricao: string;
  fichaTecnica: FichaTecnica;
  imagemUrl: string;
  emDestaque: boolean;
  emEstoque: boolean;
}

export interface ItemCarrinho {
  produto: Produto;
  quantidade: number;     // Quantidade em kg ou unidades
}

export interface DadosCliente {
  nomeCompleto: string;
  email: string;
  enderecoEntrega: string;
  cidade: string;
  estado: string;
  metodoPagamento: 'pix' | 'cartao_credito' | 'boleto';
}

export interface Pedido {
  id: string;              // Formato: PED-2026-XXXX
  dataCriacao: string;     // Formato ISO
  itens: ItemCarrinho[];
  subtotal: number;
  frete: number;
  total: number;
  cliente: DadosCliente;
  status: 'PEDIDO_GERADO';
}