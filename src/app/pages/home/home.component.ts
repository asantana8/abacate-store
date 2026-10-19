import { Component, OnInit, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { CardProdutoComponent } from '../../components/card-produto/card-produto.component';
import { ProdutoService } from '../../services/produto.service';

@Component({
  selector: 'app-home',
  imports: [CardProdutoComponent, MatButtonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  readonly catalogo = inject(ProdutoService);
  readonly destaques = computed(() => this.catalogo.produtos().filter((produto) => produto.emDestaque));
  readonly produtoHero = computed(() => this.destaques()[0]);

  ngOnInit(): void {
    this.catalogo.carregarProdutos().subscribe({ error: () => undefined });
  }
}