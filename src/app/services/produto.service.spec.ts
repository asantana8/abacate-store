import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import dados from '../../assets/data/produtos.json';
import { CatalogoProdutos } from '../models/produto.model';
import { isCatalogoProdutos } from '../models/produto.validation';
import { ProdutoService } from './produto.service';

describe('ProdutoService', () => {
  let service: ProdutoService;
  let http: HttpTestingController;
  const url = 'assets/data/produtos.json';

  function carregar(): void {
    service.carregarProdutos().subscribe();
    http.expectOne(url).flush(dados);
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ProdutoService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('inicia com catalogo vazio e sem erro', () => {
    expect(service.produtos()).toEqual([]);
    expect(service.categorias()).toEqual([]);
    expect(service.produtosFiltrados()).toEqual([]);
    expect(service.erro()).toBeNull();
  });

  it('valida os sete produtos e as tres categorias do arquivo inicial', () => {
    expect(isCatalogoProdutos(dados)).toBeTrue();
    expect(dados.produtos.length).toBe(7);
    expect(dados.categorias.length).toBe(3);
    expect(new Set(dados.produtos.map((produto) => produto.id)).size).toBe(7);
    for (const produto of dados.produtos) {
      expect(dados.categorias.some((categoria) => categoria.id === produto.categoria)).toBeTrue();
    }
  });

  it('carrega o envelope em portugues e emite void apenas ao assinar', () => {
    const resultado = service.carregarProdutos();
    const proximo = jasmine.createSpy('proximo');
    const completo = jasmine.createSpy('completo');
    http.expectNone(url);

    resultado.subscribe({ next: proximo, complete: completo });
    const requisicao = http.expectOne(url);
    expect(requisicao.request.method).toBe('GET');
    requisicao.flush(dados);

    if (!isCatalogoProdutos(dados)) {
      throw new Error('Catalogo de teste invalido.');
    }
    const catalogo: CatalogoProdutos = dados;
    expect(service.produtos()).toEqual(catalogo.produtos);
    expect(service.categorias()).toEqual(catalogo.categorias);
    expect(service.produtosFiltrados()).toEqual(catalogo.produtos);
    expect(proximo).toHaveBeenCalledOnceWith(undefined);
    expect(completo).toHaveBeenCalledTimes(1);
  });

  it('combina categoria e busca sem acentos ou diferenca de caixa', () => {
    carregar();
    service.categoriaSelecionada.set('gourmet');
    service.termoBusca.set('  VITAMÍNAS  ');
    expect(service.produtosFiltrados().map((produto) => produto.id)).toEqual(['avocado-hass']);

    service.categoriaSelecionada.set('refrescante');
    expect(service.produtosFiltrados().map((produto) => produto.id)).toEqual(['margarida']);
    service.termoBusca.set('   ');
    expect(service.produtosFiltrados().length).toBe(2);
    service.categoriaSelecionada.set(null);
    expect(service.produtosFiltrados().length).toBe(7);
  });

  it('busca tambem por nome e subtitulo', () => {
    carregar();
    service.termoBusca.set('HASS');
    expect(service.produtosFiltrados()[0]?.id).toBe('avocado-hass');
    service.termoBusca.set('familia inteira');
    expect(service.produtosFiltrados()[0]?.id).toBe('fortuna');
    service.termoBusca.set('inexistente');
    expect(service.produtosFiltrados()).toEqual([]);
  });

  it('mantem a consulta por ID reativa antes e depois do carregamento', () => {
    const produto = service.obterProdutoPorId('breda');
    expect(produto()).toBeUndefined();
    carregar();
    expect(produto()?.nome).toBe('Abacate Breda');
    expect(service.obterProdutoPorId('ausente')()).toBeUndefined();

    service.carregarProdutos().subscribe();
    http.expectOne(url).flush({ categorias: dados.categorias, produtos: [] });
    expect(produto()).toBeUndefined();
  });

  it('propaga falha HTTP, preserva o catalogo e permite nova tentativa', () => {
    carregar();
    const falha = jasmine.createSpy('falha');
    service.carregarProdutos().subscribe({ error: falha });
    http.expectOne(url).flush('Indisponivel', { status: 503, statusText: 'Service Unavailable' });
    expect(falha).toHaveBeenCalledTimes(1);
    expect(service.erro()).not.toBeNull();
    expect(service.produtos().length).toBe(7);
    carregar();
    expect(service.erro()).toBeNull();
  });

  for (const invalido of [
    { products: [], categories: [] },
    { categorias: [{ id: 'desconhecida', nome: 'Teste' }], produtos: [] },
    { categorias: [], produtos: [{ ...dados.produtos[0], fichaTecnica: null }] },
    { categorias: [], produtos: [{ ...dados.produtos[0], preco: -1 }] },
  ]) {
    it(`rejeita catalogo invalido: ${JSON.stringify(invalido)}`, () => {
      const falha = jasmine.createSpy('falha');
      service.carregarProdutos().subscribe({ error: falha });
      http.expectOne(url).flush(invalido);
      expect(falha).toHaveBeenCalledWith(jasmine.any(TypeError));
      expect(service.erro()).not.toBeNull();
      expect(service.produtos()).toEqual([]);
    });
  }
});
