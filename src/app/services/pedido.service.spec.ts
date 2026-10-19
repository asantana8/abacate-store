import { Router } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import dados from '../../assets/data/produtos.json';
import { DadosCliente, ItemCarrinho, Produto } from '../models/produto.model';
import { CarrinhoService } from './carrinho.service';
import { PedidoService } from './pedido.service';

describe('PedidoService', () => {
  let service: PedidoService;
  let limparCarrinho: jasmine.Spy;
  let navegar: jasmine.Spy;
  const cliente: DadosCliente = {
    nomeCompleto: 'Ana Silva',
    email: 'ana@example.com',
    enderecoEntrega: 'Rua das Frutas, 10',
    cidade: 'Sao Paulo',
    estado: 'SP',
    metodoPagamento: 'pix',
  };
  const itens: ItemCarrinho[] = [
    { produto: dados.produtos[0] as Produto, quantidade: 2 },
  ];

  beforeEach(() => {
    limparCarrinho = jasmine.createSpy('limparCarrinho');
    navegar = jasmine.createSpy('navigate').and.resolveTo(true);
    TestBed.configureTestingModule({
      providers: [
        { provide: CarrinhoService, useValue: { limparCarrinho } },
        { provide: Router, useValue: { navigate: navegar } },
      ],
    });
    service = TestBed.inject(PedidoService);
  });

  it('inicia sem pedido atual ou historico', () => {
    expect(service.ultimoPedido()).toBeNull();
    expect(service.historicoPedidos()).toEqual([]);
  });

  it('registra o pedido, limpa o carrinho e navega para confirmacao', () => {
    const pedido = service.gerarPedido(cliente, itens, 26.8);

    expect(pedido.id).toMatch(/^PED-2026-\d{4}$/);
    expect(Number.isNaN(Date.parse(pedido.dataCriacao))).toBeFalse();
    expect(pedido.itens).toEqual(itens);
    expect(pedido.subtotal).toBe(25.8);
    expect(pedido.frete).toBe(1);
    expect(pedido.total).toBe(26.8);
    expect(pedido.cliente).toEqual(cliente);
    expect(pedido.status).toBe('PEDIDO_GERADO');
    expect(service.ultimoPedido()).toBe(pedido);
    expect(service.historicoPedidos()).toEqual([pedido]);
    expect(limparCarrinho).toHaveBeenCalledTimes(1);
    expect(navegar).toHaveBeenCalledOnceWith(['/pedido-confirmado', pedido.id]);
  });

  it('preserva o historico entre pedidos', () => {
    service.gerarPedido(cliente, itens, 25.8);
    const segundoPedido = service.gerarPedido(cliente, itens, 25.8);

    expect(service.historicoPedidos().length).toBe(2);
    expect(service.ultimoPedido()).toBe(segundoPedido);
  });

  it('rejeita itens vazios ou total inferior ao subtotal', () => {
    expect(() => service.gerarPedido(cliente, [], 0)).toThrowError(TypeError);
    expect(() => service.gerarPedido(cliente, itens, 20)).toThrowError(RangeError);
    expect(limparCarrinho).not.toHaveBeenCalled();
    expect(navegar).not.toHaveBeenCalled();
  });
});