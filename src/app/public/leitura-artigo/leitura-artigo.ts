import { Component, ElementRef, OnInit, inject, signal, viewChild } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Header } from '../../shared/header/header';
import { Footer } from '../../shared/footer/footer';
import { ArtigoService } from '../../core/services/artigo.service';
import { Artigo } from '../../core/models/artigo.model';

@Component({
  selector: 'app-leitura-artigo',
  imports: [RouterLink, Header, Footer],
  templateUrl: './leitura-artigo.html',
  styleUrl: './leitura-artigo.scss',
})
export class LeituraArtigo implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly artigoService = inject(ArtigoService);

  artigo = signal<Artigo | undefined>(undefined);
  carregado = signal(false);
  sumario = signal<string[]>([]);
  capituloAtivo = signal(0);

  // viewChild() = referência ao elemento do template (#corpo), versão com signals
  corpo = viewChild<ElementRef<HTMLElement>>('corpo');

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.artigoService.buscarPorId(id).subscribe(a => {
      this.artigo.set(a);
      this.carregado.set(true);
      // O sumário é gerado a partir das tags <h2> do conteúdo
      if (a) {
        const doc = new DOMParser().parseFromString(a.conteudoHtml, 'text/html');
        this.sumario.set(Array.from(doc.querySelectorAll('h2')).map(h => h.textContent ?? ''));
      }
    });
  }

  irParaCapitulo(i: number): void {
    this.capituloAtivo.set(i);
    const titulos = this.corpo()?.nativeElement.querySelectorAll('h2');
    titulos?.[i]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
