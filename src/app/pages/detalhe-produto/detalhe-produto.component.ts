import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProdutoService } from '../../services/produto.service';
import { CarrinhoService } from '../../services/carrinho.service';

@Component({
  selector: 'app-detalhe-produto',
  imports: [
    CurrencyPipe,
    MatButtonModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    RouterLink,
  ],
  templateUrl: './detalhe-produto.component.html',
  styleUrl: './detalhe-produto.component.scss',
})
export class DetalheProdutoComponent implements OnInit {
  private readonly rota = inject(ActivatedRoute);
  private readonly carrinho = inject(CarrinhoService);
  readonly catalogo = inject(ProdutoService);
  private readonly parametros = toSignal(this.rota.paramMap, {
    initialValue: this.rota.snapshot.paramMap,
  });
  readonly produto = computed(() => {
    const id = this.parametros().get('id');
    return this.catalogo.produtos().find((produto) => produto.id === id);
  });
  readonly quantidade = signal(1);

  ngOnInit(): void {
    if (!this.catalogo.produtos().length) {
      this.catalogo.carregarProdutos().subscribe({ error: () => undefined });
    }
  }

  definirQuantidade(evento: Event): void {
    if (evento.target instanceof HTMLInputElement) {
      const quantidade = Number(evento.target.value);
      this.quantidade.set(Number.isFinite(quantidade) && quantidade > 0 ? quantidade : 0);
    }
  }

  alterarQuantidade(delta: number): void {
    this.quantidade.update((quantidade) => Math.max(0, quantidade + delta));
  }

  adicionarAoCarrinho(): void {
    const produto = this.produto();
    if (produto?.emEstoque && this.quantidade() > 0) {
      this.carrinho.adicionarAoCarrinho(produto, this.quantidade());
    }
  }
}