import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CarrinhoService } from '../../services/carrinho.service';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  it('exibe a marca, navegação e badge reativa do carrinho', async () => {
    const quantidadeTotalItens = signal(2);
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        provideRouter([]),
        { provide: CarrinhoService, useValue: { quantidadeTotalItens } },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();
    const elemento = fixture.nativeElement as HTMLElement;

    expect(elemento.textContent).toContain('Abacate Store');
    expect(elemento.textContent).toContain('Produtos');
    expect(elemento.querySelector('.mat-badge-content')?.textContent).toContain('2');

    quantidadeTotalItens.set(3);
    fixture.detectChanges();
    expect(elemento.textContent).toContain('3');
  });
});