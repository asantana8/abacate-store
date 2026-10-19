import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CardProdutoComponent } from '../../components/card-produto/card-produto.component';
import { CategoriaAbacate } from '../../models/produto.model';
import { ProdutoService } from '../../services/produto.service';

@Component({
  selector: 'app-lista-produtos',
  imports: [
    CardProdutoComponent,
    MatButtonModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './lista-produtos.component.html',
  styleUrl: './lista-produtos.component.scss',
})
export class ListaProdutosComponent implements OnInit {
  readonly catalogo = inject(ProdutoService);

  ngOnInit(): void {
    if (!this.catalogo.produtos().length) {
      this.catalogo.carregarProdutos().subscribe({ error: () => undefined });
    }
  }

  atualizarBusca(evento: Event): void {
    if (evento.target instanceof HTMLInputElement) {
      this.catalogo.termoBusca.set(evento.target.value);
    }
  }

  selecionarCategoria(categoria: CategoriaAbacate | null): void {
    this.catalogo.categoriaSelecionada.set(categoria);
  }

  limparFiltros(): void {
    this.catalogo.termoBusca.set('');
    this.catalogo.categoriaSelecionada.set(null);
  }
}