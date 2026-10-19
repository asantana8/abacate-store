import { CatalogoProdutos, CategoriaAbacate, ItemCarrinho, Produto } from './produto.model';

function isRegistro(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === 'object' && valor !== null && !Array.isArray(valor);
}

function isCategoria(valor: unknown): valor is CategoriaAbacate {
  return valor === 'gourmet' || valor === 'tradicional' || valor === 'refrescante';
}

export function isProduto(valor: unknown): valor is Produto {
  if (!isRegistro(valor) || !isRegistro(valor['fichaTecnica'])) {
    return false;
  }

  const ficha = valor['fichaTecnica'];
  return (
    typeof valor['id'] === 'string' && valor['id'].trim().length > 0 &&
    typeof valor['nome'] === 'string' &&
    typeof valor['subtitulo'] === 'string' &&
    isCategoria(valor['categoria']) &&
    typeof valor['preco'] === 'number' &&
    Number.isFinite(valor['preco']) && valor['preco'] >= 0 &&
    (valor['unidadeMedida'] === 'kg' || valor['unidadeMedida'] === 'unidade') &&
    typeof valor['descricao'] === 'string' &&
    ['safra', 'tamanho', 'texturaCasca', 'corCasca', 'teorAgua', 'teorOleo']
      .every((campo) => typeof ficha[campo] === 'string') &&
    typeof valor['imagemUrl'] === 'string' &&
    typeof valor['emDestaque'] === 'boolean' &&
    typeof valor['emEstoque'] === 'boolean'
  );
}

export function isCatalogoProdutos(valor: unknown): valor is CatalogoProdutos {
  if (!isRegistro(valor)) {
    return false;
  }

  const categorias = valor['categorias'];
  const produtos = valor['produtos'];
  return (
    Array.isArray(categorias) &&
    categorias.every((categoria: unknown) =>
      isRegistro(categoria) &&
      isCategoria(categoria['id']) &&
      typeof categoria['nome'] === 'string'
    ) &&
    Array.isArray(produtos) &&
    produtos.every(isProduto)
  );
}

export function isItensCarrinho(valor: unknown): valor is ItemCarrinho[] {
  return (
    Array.isArray(valor) &&
    valor.every((item: unknown) =>
      isRegistro(item) &&
      isProduto(item['produto']) &&
      typeof item['quantidade'] === 'number' &&
      Number.isFinite(item['quantidade']) &&
      item['quantidade'] > 0
    ) &&
    new Set(valor.map((item: ItemCarrinho) => item.produto.id)).size === valor.length
  );
}
