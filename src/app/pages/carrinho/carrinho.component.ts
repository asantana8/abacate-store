import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { CarrinhoService } from '../../services/carrinho.service';

@Component({
  selector: 'app-carrinho',
  imports: [
    CurrencyPipe,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule,
    RouterLink,
  ],
  templateUrl: './carrinho.component.html',
  styleUrl: './carrinho.component.scss',
})
export class CarrinhoComponent {
  readonly carrinho = inject(CarrinhoService);

  atualizarQuantidade(produtoId: string, evento: Event): void {
    if (!(evento.target instanceof HTMLInputElement) || evento.target.value === '') {
      return;
    }
    const quantidade = Number(evento.target.value);
    if (Number.isFinite(quantidade) && quantidade >= 0) {
      this.carrinho.atualizarQuantidade(produtoId, quantidade);
    }
  }
}