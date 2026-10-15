import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ArtigoService } from '../../core/services/artigo.service';
import { AuthService } from '../../core/services/auth.service';
import { SugestaoService } from '../../core/services/sugestao.service';
import { Artigo } from '../../core/models/artigo.model';
import { SugestaoRecebida } from '../../core/models/sugestao.model';

const CAPA_PADRAO =
  'https://upload.wikimedia.org/wikipedia/commons/5/5c/Eug%C3%A8ne_Delacroix_-_La_Libert%C3%A9_guidant_le_peuple.jpg';

@Component({
  selector: 'app-painel',
  imports: [ReactiveFormsModule, DatePipe, RouterLink],
  templateUrl: './painel.html',
  styleUrl: './painel.scss',
})
export class Painel implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly artigoService = inject(ArtigoService);
  private readonly sugestaoService = inject(SugestaoService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  artigos = signal<Artigo[]>([]);
  sugestoes = signal<SugestaoRecebida[]>([]);
  editandoId = signal<number | null>(null);
  mensagem = signal('');

  form = this.fb.nonNullable.group({
    titulo: ['', Validators.required],
    categoria: ['', Validators.required],
    imagemCapa: [CAPA_PADRAO],
    conteudoHtml: ['', Validators.required],
  });

  ngOnInit(): void {
    this.carregar();
  }

  private carregar(): void {
    this.artigoService.listar().subscribe(l => this.artigos.set(l));
    this.sugestaoService.listar().subscribe(l => this.sugestoes.set(l));
  }

  novo(): void {
    this.editandoId.set(null);
    this.form.reset({ titulo: '', categoria: '', imagemCapa: CAPA_PADRAO, conteudoHtml: '' });
  }

  editar(a: Artigo): void {
    this.editandoId.set(a.id);
    this.form.setValue({
      titulo: a.titulo,
      categoria: a.categoria,
      imagemCapa: a.imagemCapa,
      conteudoHtml: a.conteudoHtml,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Botões da barra do editor: envolvem o texto selecionado na textarea com uma tag
  formatar(tag: 'b' | 'i' | 'h2', area: HTMLTextAreaElement): void {
    const { selectionStart: ini, selectionEnd: fim, value } = area;
    const selecionado = value.slice(ini, fim) || 'texto';
    const novo = `${value.slice(0, ini)}<${tag}>${selecionado}</${tag}>${value.slice(fim)}`;
    this.form.controls.conteudoHtml.setValue(novo);
  }

  inserirImagem(): void {
    const url = prompt('URL da imagem:');
    if (!url) return;
    const atual = this.form.controls.conteudoHtml.value;
    this.form.controls.conteudoHtml.setValue(`${atual}\n<img src="${url}" alt="" />`);
  }

  inserirLink(): void {
    const url = prompt('URL do link:');
    if (!url) return;
    const atual = this.form.controls.conteudoHtml.value;
    this.form.controls.conteudoHtml.setValue(`${atual}\n<a href="${url}">link</a>`);
  }

  salvarRascunho(): void {
    this.gravar('rascunho');
  }

  publicar(): void {
    this.gravar('publicado');
  }

  private gravar(status: 'rascunho' | 'publicado'): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const existente = this.artigos().find(a => a.id === this.editandoId());
    const agora = new Date().toISOString();
    const artigo: Artigo = {
      ...this.form.getRawValue(),
      id: this.editandoId() ?? 0,
      destaque: existente?.destaque ?? false,
      status,
      dataPublicacao: status === 'publicado' ? agora : existente?.dataPublicacao,
      dataRascunho: status === 'rascunho' ? agora : existente?.dataRascunho,
    };
    this.artigoService.salvar(artigo).subscribe(() => {
      this.mensagem.set(status === 'publicado' ? 'Artigo publicado!' : 'Rascunho salvo!');
      setTimeout(() => this.mensagem.set(''), 2500);
      this.carregar();
      this.novo();
    });
  }

  alternarDestaque(a: Artigo): void {
    this.artigoService.alternarDestaque(a.id).subscribe(() => this.carregar());
  }

  excluir(id: number): void {
    if (!confirm('Excluir este artigo?')) return;
    this.artigoService.excluir(id).subscribe(() => {
      if (this.editandoId() === id) this.novo();
      this.carregar();
    });
  }

  excluirSugestao(id: number): void {
    if (!confirm('Excluir esta sugestão?')) return;
    this.sugestaoService.excluir(id).subscribe(() => this.carregar());
  }

  sair(): void {
    this.auth.logout();
    this.router.navigate(['/admin/login']);
  }
}
