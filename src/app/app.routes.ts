import { Routes } from '@angular/router';

export const routes: Routes = [
	{ path: '', loadComponent: () => import('./pages/home/home.component').then((modulo) => modulo.HomeComponent) },
	{ path: 'produtos', loadComponent: () => import('./pages/lista-produtos/lista-produtos.component').then((modulo) => modulo.ListaProdutosComponent) },
	{
		path: 'produtos/:id',
		loadComponent: () => import('./pages/detalhe-produto/detalhe-produto.component').then((modulo) => modulo.DetalheProdutoComponent),
	},
	{ path: 'carrinho', loadComponent: () => import('./pages/carrinho/carrinho.component').then((modulo) => modulo.CarrinhoComponent) },
	{ path: 'checkout', loadComponent: () => import('./pages/checkout/checkout.component').then((modulo) => modulo.CheckoutComponent) },
	{
		path: 'pedido-confirmado/:id',
		loadComponent: () => import('./pages/pedido-confirmado/pedido-confirmado.component').then((modulo) => modulo.PedidoConfirmadoComponent),
	},
	{ path: '**', redirectTo: '' },
];
