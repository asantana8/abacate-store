# Abacate Store

Loja demonstrativa de variedades de abacate, construída com Angular 20, componentes standalone, Signals, Angular Material e Bootstrap 5 usado somente para grid e utilitários de layout.

## Funcionalidades

- Página inicial com produtos em destaque e catálogo com busca e filtro por categoria.
- Página de detalhes com ficha técnica e inclusão de quantidades fracionárias.
- Carrinho reativo, persistido no `localStorage` do navegador.
- Checkout demonstrativo com validação de dados e opções fictícias de pagamento.
- Confirmação do pedido sem cobrança ou processamento de pagamentos reais.

As imagens do catálogo são carregadas de URLs externas e dependem da disponibilidade do site de origem. O frete no checkout demonstrativo é zero.

## Requisitos

- Node.js e npm compatíveis com Angular 20.
- Chrome instalado para executar os testes em modo headless.
- Git para versionar e publicar o projeto.

## Desenvolvimento

```bash
npm install
npm start
```

A aplicação ficará disponível em `http://localhost:4200/`.

## Verificação

```bash
npm test -- --watch=false --browsers=ChromeHeadless
npm run build
```

## Publicar no GitHub

Repositório: https://github.com/asantana8/abacate-store

Depois de instalar o Git e criar o repositório vazio no GitHub, execute na pasta do projeto:

```bash
git init
git add .
git commit -m "Inicializa loja de abacates"
git branch -M main
git remote add origin https://github.com/asantana8/abacate-store.git
git push -u origin main
```

O `.gitignore` exclui dependências instaladas, builds, cache e resultados de teste. Não inclua credenciais, tokens ou arquivos de ambiente com segredos no repositório.

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
