# 04. Regras de Integração Visual: Angular Material + Bootstrap 5

## 1. Objetivo & Princípio da Separação de Responsabilidades
Para evitar conflitos de estilo (como sobreposição do `reboot.css` em componentes Material) e evitar duplicação de lógica (manipulação do DOM por scripts externos), fica estabelecida a **estrita divisão de papéis**:

- **Bootstrap 5:** Atua **APENAS** como motor de Layout (Grid Responsivo) e Utilitários de Espaçamento/Alinhamento.
- **Angular Material 20+:** Atua **EXCLUSIVAMENTE** na construção de Componentes de UI, Formulários, Botões, Modais e Elementos Interativos.

---

## 2. Regras de Proibição e Permissão para o Copilot

### ❌ O que é ESTRITAMENTE PROIBIDO:
1. **NÃO importar ou instalar os scripts JavaScript do Bootstrap** (`bootstrap.bundle.min.js`, `bootstrap.js` ou `popper.js`). Toda a interatividade deve ser feita via Angular + Material.
2. **NÃO utilizar componentes de UI nativos do Bootstrap HTML/CSS**, tais como:
   - Botões Bootstrap (`.btn`, `.btn-primary`). Utilize `<button mat-flat-button>` ou `<button mat-stroked-button>`.
   - Cards Bootstrap (`.card`, `.card-body`). Utilize `<mat-card>`, `<mat-card-header>`, etc.
   - Modais Bootstrap (`.modal`). Utilize `MatDialog` do Angular Material.
   - Formulários e Inputs Bootstrap (`.form-control`, `.form-select`). Utilize `<mat-form-field>`, `<mat-input>`, `<mat-select>`.
   - Navbars Bootstrap (`.navbar`). Utilize `<mat-toolbar>`.
3. **NÃO aplicar classes de cor de fundo do Bootstrap que sobrescrevam o tema Material** (evitar `.bg-primary`, `.bg-success` em componentes Material).

### ✅ O que é PERMITIDO e RECOMENDADO:
1. **Grid Responsiva do Bootstrap:** `.container`, `.container-fluid`, `.row`, `.col-12`, `.col-sm-6`, `.col-md-4`, `.col-lg-3`, `.g-3`, `.g-4`.
2. **Utilitários Flexbox do Bootstrap:** `.d-flex`, `.flex-column`, `.justify-content-between`, `.justify-content-center`, `.align-items-center`, `.gap-2`, `.gap-3`.
3. **Utilitários de Espaçamento do Bootstrap:** `.m-0`, `.my-3`, `.mb-4`, `.p-2`, `.p-4`, `.px-3`.
4. **Utilitários de Texto do Bootstrap:** `.text-center`, `.text-start`, `.text-end`, `.text-muted`, `.fw-bold`.

---

## 3. Configuração do Arquivo de Estilos Globais (`src/styles.scss`)

O arquivo `src/styles.scss` deve importar apenas a grade e os utilitários do Bootstrap, **isolando o CSS Reset para não quebrar a tipografia do Angular Material**:

```scss
@use '@angular/material' as mat;

@use 'bootstrap/scss/bootstrap-grid';

@include mat.core();
@include mat.theme(
  (
    color: (
      theme-type: light,
      primary: mat.$green-palette,
    ),
    typography: Roboto,
    density: 0,
  )
);

:root {
  --color-primary: #2d5a27;
  --color-primary-light: #4e8b44;
  --color-accent: #f4d03f;
  --color-success: #8daa3f;
  --color-bg-light: #f8f9fa;
  --color-text-main: #1c2833;
}

@include mat.theme-overrides(
  (
    primary: var(--color-primary),
    on-primary: #ffffff,
  )
);

html, body {
  height: 100%;
  margin: 0;
  font-family: Roboto, 'Helvetica Neue', sans-serif;
  background-color: var(--color-bg-light);
  color: var(--color-text-main);
}