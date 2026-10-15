export type StatusArtigo = 'publicado' | 'rascunho';

export interface Artigo {
  id: number;
  titulo: string;
  categoria: string;
  imagemCapa: string;
  conteudoHtml: string;
  destaque: boolean;
  status: StatusArtigo;
  dataPublicacao?: string;
  dataRascunho?: string;
}
