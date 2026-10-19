import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { RouterLink } from '@angular/router';
import { CategoriaAbacate, Produto } from '../../models/produto.model';
import { CarrinhoService } from '../../services/carrinho.service';

const NOMES_CATEGORIA: Record<CategoriaAbacate, string> = {
  gourmet: 'Gourmet & Alta Culinária',
  tradicional: 'Tradicional & Familiar',
  refrescante: 'Refrescante & Verão',
};

@Component({
  selector: 'app-card-produto',
  imports: [CurrencyPipe, MatButtonModule, MatCardModule, MatChipsModule, RouterLink],
  templateUrl: './card-produto.component.html',
  styleUrl: './card-produto.component.scss',
})
export class CardProdutoComponent {
  readonly produto = input.required<Produto>();
  readonly nomeCategoria = computed(() => NOMES_CATEGORIA[this.produto().categoria]);

  private readonly carrinhoService = inject(CarrinhoService);

  adicionar(): void {
    this.carrinhoService.adicionarAoCarrinho(this.produto(), 1);
  }
}