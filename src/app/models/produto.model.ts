export type CategoriaAbacate = 'gourmet' | 'tradicional' | 'refrescante';

export interface FichaTecnica {
  safra: string;
  tamanho: string;
  texturaCasca: string;
  corCasca: string;
  teorAgua: string;
  teorOleo: string;
}

export interface Categoria {
  id: CategoriaAbacate;
  nome: string;
}

export interface Produto {
  id: string;
  nome: string;
  subtitulo: string;
  categoria: CategoriaAbacate;
  preco: number;
  unidadeMedida: 'kg' | 'unidade';
  descricao: string;
  fichaTecnica: FichaTecnica;
  imagemUrl: string;
  emDestaque: boolean;
  emEstoque: boolean;
}

export interface CatalogoProdutos {
  categorias: Categoria[];
  produtos: Produto[];
}

export interface ItemCarrinho {
  produto: Produto;
  quantidade: number;
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
  id: string;
  dataCriacao: string;
  itens: ItemCarrinho[];
  subtotal: number;
  frete: number;
  total: number;
  cliente: DadosCliente;
  status: 'PEDIDO_GERADO';
}
