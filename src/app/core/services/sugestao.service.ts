import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Sugestao, SugestaoRecebida } from '../models/sugestao.model';

const CHAVE = 'kleio.sugestoes';

/**
 * Serviço mockado: as sugestões ficam salvas no localStorage do navegador,
 * então continuam existindo depois de recarregar a página.
 * No back-end real, só o corpo dos métodos muda (HttpClient).
 */
@Injectable({ providedIn: 'root' })
export class SugestaoService {
  private ler(): SugestaoRecebida[] {
    try {
      return JSON.parse(localStorage.getItem(CHAVE) ?? '[]');
    } catch {
      return [];
    }
  }

  private gravar(lista: SugestaoRecebida[]): void {
    localStorage.setItem(CHAVE, JSON.stringify(lista));
  }

  enviar(sugestao: Sugestao): Observable<SugestaoRecebida> {
    const lista = this.ler();
    const nova: SugestaoRecebida = {
      ...sugestao,
      id: Math.max(0, ...lista.map(s => s.id)) + 1,
      dataEnvio: new Date().toISOString(),
    };
    this.gravar([nova, ...lista]); // mais recente primeiro
    return of(nova).pipe(delay(300));
  }

  listar(): Observable<SugestaoRecebida[]> {
    return of(this.ler()).pipe(delay(100));
  }

  excluir(id: number): Observable<void> {
    this.gravar(this.ler().filter(s => s.id !== id));
    return of(undefined).pipe(delay(100));
  }
}
