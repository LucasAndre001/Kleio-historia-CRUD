import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `<footer>© Kleio História - Todos os direitos reservados</footer>`,
  styles: `
    footer {
      background: var(--cor-primaria);
      color: var(--cor-texto-claro);
      text-align: center;
      padding: 1rem;
    }
  `,
})
export class Footer {}
