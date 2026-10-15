import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Header } from '../../shared/header/header';
import { Footer } from '../../shared/footer/footer';
import { ArtigoService } from '../../core/services/artigo.service';
import { SugestaoService } from '../../core/services/sugestao.service';
import { Artigo } from '../../core/models/artigo.model';
import { Sugestao } from '../../core/models/sugestao.model';

@Component({
  selector: 'app-home',
  imports: [RouterLink, ReactiveFormsModule, Header, Footer],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  // inject() é a forma moderna de pedir dependências (alternativa ao constructor)
  private readonly fb = inject(FormBuilder);
  private readonly artigoService = inject(ArtigoService);
  private readonly sugestaoService = inject(SugestaoService);

  destaques = signal<Artigo[]>([]);
  artigos = signal<Artigo[]>([]);
  slideAtual = signal(0);
  enviado = signal(false);

  form = this.fb.nonNullable.group({
    nome: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    tema: ['', Validators.required],
    mensagem: ['', Validators.required],
  });

  ngOnInit(): void {
    this.artigoService.listarDestaques().subscribe(l => this.destaques.set(l));
    this.artigoService.listarPublicados().subscribe(l => this.artigos.set(l));
  }

  proximo(): void {
    const total = this.destaques().length;
    if (total) this.slideAtual.update(i => (i + 1) % total);
  }

  anterior(): void {
    const total = this.destaques().length;
    if (total) this.slideAtual.update(i => (i - 1 + total) % total);
  }

  irPara(i: number): void {
    this.slideAtual.set(i);
  }

  enviar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const dados: Sugestao = this.form.getRawValue();
    this.enviado.set(false);
    this.sugestaoService.enviar(dados).subscribe(() => {
      this.enviado.set(true);
      this.form.reset();
      setTimeout(() => this.enviado.set(false), 4000);
    });
  }
}
