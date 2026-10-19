import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal, Signal } from '@angular/core';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { Categoria, CategoriaAbacate, Produto } from '../models/produto.model';
import { isCatalogoProdutos } from '../models/produto.validation';

function normalizarTexto(texto: string): string {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR');
}

@Injectable({ providedIn: 'root' })
export class ProdutoService {
  private readonly http = inject(HttpClient);
  private readonly estadoProdutos = signal<Produto[]>([]);
  private readonly estadoCategorias = signal<Categoria[]>([]);
  private readonly estadoErro = signal<string | null>(null);

  readonly produtos = this.estadoProdutos.asReadonly();
  readonly categorias = this.estadoCategorias.asReadonly();
  readonly erro = this.estadoErro.asReadonly();
  readonly categoriaSelecionada = signal<CategoriaAbacate | null>(null);
  readonly termoBusca = signal('');

  readonly produtosFiltrados = computed(() => {
    const categoria = this.categoriaSelecionada();
    const termo = normalizarTexto(this.termoBusca().trim());

    return this.produtos().filter((produto) =>
      (categoria === null || produto.categoria === categoria) &&
      normalizarTexto(`${produto.nome} ${produto.subtitulo} ${produto.descricao}`).includes(termo)
    );
  });

  carregarProdutos(): Observable<void> {
    return this.http.get<unknown>('assets/data/produtos.json').pipe(
      tap((catalogo) => {
        if (!isCatalogoProdutos(catalogo)) {
          throw new TypeError('O catalogo de produtos possui um formato invalido.');
        }
        this.estadoCategorias.set(catalogo.categorias);
        this.estadoProdutos.set(catalogo.produtos);
        this.estadoErro.set(null);
      }),
      map(() => undefined),
      catchError((erro: unknown) => {
        this.estadoErro.set('Nao foi possivel carregar o catalogo de produtos.');
        return throwError(() => erro);
      })
    );
  }

  obterProdutoPorId(id: string): Signal<Produto | undefined> {
    return computed(() => this.produtos().find((produto) => produto.id === id));
  }
}
