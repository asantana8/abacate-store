import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ItemCarrinho, DadosCliente, Pedido } from '../models/produto.model';
import { isItensCarrinho } from '../models/produto.validation';
import { CarrinhoService } from './carrinho.service';

@Injectable({ providedIn: 'root' })
export class PedidoService {
  private readonly carrinhoService = inject(CarrinhoService);
  private readonly router = inject(Router);
  private readonly estadoUltimoPedido = signal<Pedido | null>(null);
  private readonly estadoHistoricoPedidos = signal<Pedido[]>([]);

  readonly ultimoPedido = this.estadoUltimoPedido.asReadonly();
  readonly historicoPedidos = this.estadoHistoricoPedidos.asReadonly();

  gerarPedido(cliente: DadosCliente, itens: ItemCarrinho[], total: number): Pedido {
    if (!isItensCarrinho(itens) || itens.length === 0) {
      throw new TypeError('Os itens do pedido possuem um formato invalido.');
    }

    const subtotal = this.arredondar(itens.reduce(
      (soma, item) => soma + item.produto.preco * item.quantidade,
      0
    ));
    if (!Number.isFinite(total) || total < subtotal) {
      throw new RangeError('O total do pedido deve ser finito e igual ou maior que o subtotal.');
    }

    const data = new Date();
    const identificador = Math.floor(Math.random() * 10_000).toString().padStart(4, '0');
    const pedido: Pedido = {
      id: `PED-${data.getFullYear()}-${identificador}`,
      dataCriacao: data.toISOString(),
      itens: itens.map((item) => ({ ...item })),
      subtotal,
      frete: this.arredondar(total - subtotal),
      total: this.arredondar(total),
      cliente: { ...cliente },
      status: 'PEDIDO_GERADO',
    };

    this.carrinhoService.limparCarrinho();
    this.estadoUltimoPedido.set(pedido);
    this.estadoHistoricoPedidos.update((historico) => [...historico, pedido]);
    void this.router.navigate(['/pedido-confirmado', pedido.id]);

    return pedido;
  }

  private arredondar(valor: number): number {
    return Math.round((valor + Number.EPSILON) * 100) / 100;
  }
}