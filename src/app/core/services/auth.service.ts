import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

// MOCK: no back-end real isso será validado no servidor.
const PROFESSOR_MOCK = { login: 'professor', senha: '123456' };
const CHAVE = 'kleio.sessao';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // A sessão fica no sessionStorage: sobrevive ao F5, mas some ao fechar a aba.
  private readonly autenticado = signal(sessionStorage.getItem(CHAVE) === '1');
  readonly isAutenticado = this.autenticado.asReadonly();

  login(login: string, senha: string): Observable<boolean> {
    const ok = login === PROFESSOR_MOCK.login && senha === PROFESSOR_MOCK.senha;
    return of(ok).pipe(
      delay(400),
      tap(sucesso => {
        this.autenticado.set(sucesso);
        if (sucesso) sessionStorage.setItem(CHAVE, '1');
      })
    );
  }

  logout(): void {
    this.autenticado.set(false);
    sessionStorage.removeItem(CHAVE);
  }
}
