import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import dados from '../../../assets/data/produtos.json';
import { Produto } from '../../models/produto.model';
import { CarrinhoService } from '../../services/carrinho.service';
import { CardProdutoComponent } from './card-produto.component';

registerLocaleData(localePt, 'pt-BR');

describe('CardProdutoComponent', () => {
  it('apresenta os dados do produto e adiciona uma unidade ao carrinho', async () => {
    const adicionarAoCarrinho = jasmine.createSpy('adicionarAoCarrinho');
    await TestBed.configureTestingModule({
      imports: [CardProdutoComponent],
      providers: [
        provideRouter([]),
        { provide: CarrinhoService, useValue: { adicionarAoCarrinho } },
      ],
    }).compileComponents();

    const produto = dados.produtos[0] as Produto;
    const fixture = TestBed.createComponent(CardProdutoComponent);
    fixture.componentRef.setInput('produto', produto);
    fixture.detectChanges();
    const elemento = fixture.nativeElement as HTMLElement;

    expect(elemento.textContent).toContain(produto.nome);
    expect(elemento.textContent).toContain(produto.subtitulo);
    expect(elemento.textContent).toContain('12,90');
    expect(elemento.querySelector('img')?.getAttribute('alt')).toBe(produto.nome);

    const botaoAdicionar = Array.from(elemento.querySelectorAll('button'))
      .find((botao) => botao.textContent?.includes('Adicionar'));
    botaoAdicionar?.click();
    expect(adicionarAoCarrinho).toHaveBeenCalledOnceWith(produto, 1);
  });

  it('desabilita a adição quando o produto está fora de estoque', async () => {
    await TestBed.configureTestingModule({
      imports: [CardProdutoComponent],
      providers: [provideRouter([]), { provide: CarrinhoService, useValue: {} }],
    }).compileComponents();

    const fixture = TestBed.createComponent(CardProdutoComponent);
    fixture.componentRef.setInput('produto', { ...dados.produtos[0], emEstoque: false });
    fixture.detectChanges();

    const botaoAdicionar = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('button')
    ).find((botao) => botao.textContent?.includes('Adicionar'));
    expect(botaoAdicionar?.disabled).toBeTrue();
  });
});