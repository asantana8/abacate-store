import { ErrorHandler, PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import dados from '../../assets/data/produtos.json';
import { Produto } from '../models/produto.model';
import { isProduto } from '../models/produto.validation';
import { CarrinhoService } from './carrinho.service';

describe('CarrinhoService', () => {
  const chave = 'abacate-store:carrinho';
  let produto: Produto;
  let armazenamento: Map<string, string>;
  let ler: jasmine.Spy;
  let salvar: jasmine.Spy;
  let erros: jasmine.SpyObj<ErrorHandler>;

  function criar(): CarrinhoService {
    return TestBed.inject(CarrinhoService);
  }

  beforeEach(() => {
    const exemplo = dados.produtos[0];
    if (!isProduto(exemplo)) {
      throw new Error('Produto de teste invalido.');
    }
    produto = structuredClone(exemplo);
    armazenamento = new Map();
    ler = spyOn(Storage.prototype, 'getItem').and.callFake(
      (key: string) => armazenamento.get(key) ?? null
    );
    salvar = spyOn(Storage.prototype, 'setItem').and.callFake(
      (key: string, value: string) => { armazenamento.set(key, value); }
    );
    erros = jasmine.createSpyObj<ErrorHandler>('ErrorHandler', ['handleError']);
    TestBed.configureTestingModule({
      providers: [{ provide: ErrorHandler, useValue: erros }],
    });
  });

  it('inicia vazio e calcula totais zerados', () => {
    const service = criar();
    expect(service.itens()).toEqual([]);
    expect(service.quantidadeTotalItens()).toBe(0);
    expect(service.subtotal()).toBe(0);
  });

  it('agrupa produtos por ID e aceita quantidades fracionarias', () => {
    const service = criar();
    service.adicionarAoCarrinho(produto, 1);
    service.adicionarAoCarrinho({ ...produto }, 0.5);
    expect(service.itens()).toEqual([{ produto, quantidade: 1.5 }]);
    expect(service.quantidadeTotalItens()).toBe(1.5);
    expect(service.subtotal()).toBe(19.35);
  });

  it('atualiza produtos distintos, totais e remocao sem alterar outros itens', () => {
    const service = criar();
    const segundo = { ...produto, id: 'segundo', preco: 8.5 };
    service.adicionarAoCarrinho(produto, 1);
    service.adicionarAoCarrinho(segundo, 2);
    expect(service.quantidadeTotalItens()).toBe(3);
    expect(service.subtotal()).toBe(29.9);
    service.atualizarQuantidade(produto.id, 2);
    expect(service.subtotal()).toBe(42.8);
    service.removerDoCarrinho(produto.id);
    expect(service.itens()).toEqual([{ produto: segundo, quantidade: 2 }]);
    expect(service.subtotal()).toBe(17);
    service.removerDoCarrinho('inexistente');
    expect(service.quantidadeTotalItens()).toBe(2);
  });

  it('remove o item ao atualizar a quantidade para zero', () => {
    const service = criar();
    service.adicionarAoCarrinho(produto, 1);
    service.atualizarQuantidade(produto.id, 0);
    expect(service.itens()).toEqual([]);
    expect(service.subtotal()).toBe(0);
  });

  it('arredonda o subtotal para centavos', () => {
    const service = criar();
    service.adicionarAoCarrinho({ ...produto, preco: 7.9 }, 0.333);
    expect(service.subtotal()).toBe(2.63);
  });

  for (const quantidade of [-1, NaN, Infinity, -Infinity]) {
    it(`rejeita quantidade invalida (${quantidade}) sem alterar o estado`, () => {
      const service = criar();
      service.adicionarAoCarrinho(produto, 1);
      expect(() => service.adicionarAoCarrinho(produto, quantidade)).toThrowError(RangeError);
      expect(() => service.atualizarQuantidade(produto.id, quantidade)).toThrowError(RangeError);
      expect(service.quantidadeTotalItens()).toBe(1);
    });
  }

  it('rejeita adicao com zero e atualizacao de ID inexistente', () => {
    const service = criar();
    expect(() => service.adicionarAoCarrinho(produto, 0)).toThrowError(RangeError);
    expect(() => service.atualizarQuantidade('ausente', 1)).toThrowError(/nao encontrado/);
  });

  it('rejeita produto invalido e estouro na soma de quantidades', () => {
    const service = criar();
    expect(() => service.adicionarAoCarrinho({ ...produto, preco: NaN }, 1))
      .toThrowError(TypeError);
    service.adicionarAoCarrinho(produto, Number.MAX_VALUE);
    expect(() => service.adicionarAoCarrinho(produto, Number.MAX_VALUE))
      .toThrowError(RangeError);
  });

  it('persiste inclusao, atualizacao, remocao e limpeza por effect', () => {
    const service = criar();
    service.adicionarAoCarrinho(produto, 1);
    TestBed.tick();
    expect(armazenamento.get(chave)).toBe(JSON.stringify([{ produto, quantidade: 1 }]));
    service.atualizarQuantidade(produto.id, 2);
    TestBed.tick();
    expect(armazenamento.get(chave)).toBe(JSON.stringify([{ produto, quantidade: 2 }]));
    service.removerDoCarrinho(produto.id);
    TestBed.tick();
    expect(armazenamento.get(chave)).toBe('[]');
    service.adicionarAoCarrinho(produto, 3);
    service.limparCarrinho();
    TestBed.tick();
    expect(armazenamento.get(chave)).toBe('[]');
    expect(service.quantidadeTotalItens()).toBe(0);
    expect(service.subtotal()).toBe(0);
  });

  it('restaura itens antes de executar o primeiro effect', () => {
    const itens = [{ produto, quantidade: 2 }];
    armazenamento.set(chave, JSON.stringify(itens));
    const service = criar();
    expect(service.itens()).toEqual(itens);
    expect(service.subtotal()).toBe(25.8);
    TestBed.tick();
    expect(armazenamento.get(chave)).toBe(JSON.stringify(itens));
    expect(erros.handleError).not.toHaveBeenCalled();
  });

  for (const salvo of [
    '{invalido',
    '{}',
    JSON.stringify([{ produto: { id: 'incompleto' }, quantidade: 1 }]),
    JSON.stringify([{ produto: dados.produtos[0], quantidade: -1 }]),
    JSON.stringify([{ produto: dados.produtos[0], quantidade: 0 }]),
    JSON.stringify([
      { produto: dados.produtos[0], quantidade: 1 },
      { produto: dados.produtos[0], quantidade: 2 },
    ]),
  ]) {
    it(`reporta dados persistidos invalidos (${salvo.slice(0, 30)})`, () => {
      armazenamento.set(chave, salvo);
      expect(criar().itens()).toEqual([]);
      expect(erros.handleError).toHaveBeenCalledWith(jasmine.any(Error));
    });
  }

  it('reporta bloqueio de leitura e continua com estado em memoria', () => {
    ler.and.throwError(new DOMException('Bloqueado', 'SecurityError'));
    const service = criar();
    expect(erros.handleError).toHaveBeenCalledTimes(1);
    service.adicionarAoCarrinho(produto, 1);
    expect(service.quantidadeTotalItens()).toBe(1);
  });

  it('reporta falha de escrita sem perder o carrinho em memoria', () => {
    salvar.and.throwError(new DOMException('Sem espaco', 'QuotaExceededError'));
    const service = criar();
    service.adicionarAoCarrinho(produto, 1);
    TestBed.tick();
    expect(erros.handleError).toHaveBeenCalledTimes(1);
    expect(service.itens()).toEqual([{ produto, quantidade: 1 }]);
  });

  it('nao acessa localStorage fora do navegador', () => {
    TestBed.overrideProvider(PLATFORM_ID, { useValue: 'server' });
    const service = criar();
    service.adicionarAoCarrinho(produto, 1);
    TestBed.tick();
    expect(ler).not.toHaveBeenCalled();
    expect(salvar).not.toHaveBeenCalled();
    expect(service.quantidadeTotalItens()).toBe(1);
  });
});
