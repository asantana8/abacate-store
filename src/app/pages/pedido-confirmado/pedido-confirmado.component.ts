import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PedidoService } from '../../services/pedido.service';

@Component({
  selector: 'app-pedido-confirmado',
  imports: [CurrencyPipe, DatePipe, MatButtonModule, MatCardModule, MatIconModule, RouterLink],
  templateUrl: './pedido-confirmado.component.html',
  styleUrl: './pedido-confirmado.component.scss',
})
export class PedidoConfirmadoComponent {
  private readonly rota = inject(ActivatedRoute);
  private readonly parametros = toSignal(this.rota.paramMap, {
    initialValue: this.rota.snapshot.paramMap,
  });
  private readonly pedidos = inject(PedidoService);
  readonly pedido = computed(() => {
    const pedido = this.pedidos.ultimoPedido();
    return pedido?.id === this.parametros().get('id') ? pedido : null;
  });
  readonly idPedido = computed(() => this.parametros().get('id') ?? '');
}