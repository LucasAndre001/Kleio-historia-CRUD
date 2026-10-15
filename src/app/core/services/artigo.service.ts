import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Artigo } from '../models/artigo.model';
import { ARTIGOS_MOCK } from '../mock/artigos.mock';

const CHAVE = 'kleio.artigos';

/**
 * Serviço mockado. Todos os métodos devolvem Observable para imitar o HttpClient.
 * Os artigos ficam salvos no localStorage (começam com os dados de ARTIGOS_MOCK),
 * então o que o professor publica continua lá depois de recarregar a página.
 * No back-end real, só o corpo dos métodos muda.
 */
@Injectable({ providedIn: 'root' })
export class ArtigoService {
  private readonly artigos = signal<Artigo[]>(this.carregarInicial());

  private carregarInicial(): Artigo[] {
    try {
      const salvo = localStorage.getItem(CHAVE);
      if (salvo) return JSON.parse(salvo);
    } catch {
      // storage indisponível ou JSON corrompido: cai no mock
    }
    return [...ARTIGOS_MOCK];
  }

  private persistir(lista: Artigo[]): Artigo[] {
    try {
      localStorage.setItem(CHAVE, JSON.stringify(lista));
    } catch {
      // sem storage, segue só em memória
    }
    return lista;
  }

  listar(): Observable<Artigo[]> {
    return of(this.artigos()).pipe(delay(250));
  }

  listarPublicados(): Observable<Artigo[]> {
    return of(this.artigos().filter(a => a.status === 'publicado')).pipe(delay(250));
  }

  listarDestaques(): Observable<Artigo[]> {
    return of(this.artigos().filter(a => a.status === 'publicado' && a.destaque)).pipe(delay(250));
  }

  buscarPorId(id: number): Observable<Artigo | undefined> {
    return of(this.artigos().find(a => a.id === id)).pipe(delay(150));
  }

  /** Cria (id = 0) ou atualiza um artigo. */
  salvar(artigo: Artigo): Observable<Artigo> {
    let salvo = artigo;
    this.artigos.update(lista => {
      if (artigo.id !== 0 && lista.some(a => a.id === artigo.id)) {
        return this.persistir(lista.map(a => (a.id === artigo.id ? artigo : a)));
      }
      salvo = { ...artigo, id: Math.max(0, ...lista.map(a => a.id)) + 1 };
      return this.persistir([...lista, salvo]);
    });
    return of(salvo).pipe(delay(250));
  }

  alternarDestaque(id: number): Observable<void> {
    this.artigos.update(lista =>
      this.persistir(lista.map(a => (a.id === id ? { ...a, destaque: !a.destaque } : a)))
    );
    return of(undefined).pipe(delay(100));
  }

  excluir(id: number): Observable<void> {
    this.artigos.update(lista => this.persistir(lista.filter(a => a.id !== id)));
    return of(undefined).pipe(delay(150));
  }
}
