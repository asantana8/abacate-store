import { isPlatformBrowser } from '@angular/common';
import { computed, effect, ErrorHandler, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { ItemCarrinho, Produto } from '../models/produto.model';
import { isItensCarrinho, isProduto } from '../models/produto.validation';

const CHAVE_CARRINHO = 'abacate-store:carrinho';

@Injectable({ providedIn: 'root' })
export class CarrinhoService {
  private readonly errorHandler = inject(ErrorHandler);
  private readonly navegador = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly estadoItens = signal<ItemCarrinho[]>(this.restaurarItens());

  readonly itens = this.estadoItens.asReadonly();
  readonly quantidadeTotalItens = computed(() =>
    this.itens().reduce((total, item) => total + item.quantidade, 0)
  );
  readonly subtotal = computed(() => {
    const total = this.itens().reduce(
      (soma, item) => soma + item.produto.preco * item.quantidade, 0
    );
    return Math.round((total + Number.EPSILON) * 100) / 100;
  });

  constructor() {
    effect(() => {
      const itens = this.itens();
      if (this.navegador) {
        try {
          localStorage.setItem(CHAVE_CARRINHO, JSON.stringify(itens));
        } catch (causa) {
          this.errorHandler.handleError(
            new Error('Nao foi possivel salvar o carrinho no armazenamento local.', { cause: causa })
          );
        }
      }
    });
  }

  adicionarAoCarrinho(produto: Produto, quantidade: number): void {
    if (!isProduto(produto)) {
      throw new TypeError('O produto possui um formato invalido.');
    }
    this.validarQuantidade(quantidade);
    const existente = this.itens().find((item) => item.produto.id === produto.id);
    const novaQuantidade = (existente?.quantidade ?? 0) + quantidade;
    this.validarQuantidade(novaQuantidade);

    this.estadoItens.update((itens) => existente
      ? itens.map((item) => item.produto.id === produto.id
        ? { produto, quantidade: novaQuantidade } : item)
      : [...itens, { produto, quantidade }]
    );
  }

  removerDoCarrinho(produtoId: string): void {
    this.estadoItens.update((itens) => itens.filter((item) => item.produto.id !== produtoId));
  }

  atualizarQuantidade(produtoId: string, quantidade: number): void {
    if (!Number.isFinite(quantidade) || quantidade < 0) {
      throw new RangeError('A quantidade deve ser finita e maior ou igual a zero.');
    }
    if (!this.itens().some((item) => item.produto.id === produtoId)) {
      throw new Error(`Produto nao encontrado no carrinho: ${produtoId}`);
    }
    if (quantidade === 0) {
      this.removerDoCarrinho(produtoId);
      return;
    }
    this.estadoItens.update((itens) => itens.map((item) =>
      item.produto.id === produtoId ? { ...item, quantidade } : item
    ));
  }

  limparCarrinho(): void {
    this.estadoItens.set([]);
  }

  private validarQuantidade(quantidade: number): void {
    if (!Number.isFinite(quantidade) || quantidade <= 0) {
      throw new RangeError('A quantidade deve ser finita e maior que zero.');
    }
  }

  private restaurarItens(): ItemCarrinho[] {
    if (!this.navegador) {
      return [];
    }
    try {
      const salvo = localStorage.getItem(CHAVE_CARRINHO);
      if (salvo === null) {
        return [];
      }
      const itens: unknown = JSON.parse(salvo);
      if (!isItensCarrinho(itens)) {
        throw new TypeError('Os itens salvos no carrinho possuem um formato invalido.');
      }
      return itens;
    } catch (causa) {
      this.errorHandler.handleError(
        new Error('Nao foi possivel restaurar o carrinho do armazenamento local.', { cause: causa })
      );
      return [];
    }
  }
}
