import { Artigo } from '../models/artigo.model';

const CAPA =
  'https://upload.wikimedia.org/wikipedia/commons/5/5c/Eug%C3%A8ne_Delacroix_-_La_Libert%C3%A9_guidant_le_peuple.jpg';

const TEXTO =
  'Texto do artigo formatado a partir do conteúdo publicado pelo professor, com parágrafos, imagens inseridas no fluxo do texto e divisões por capítulo. ';

export const ARTIGOS_MOCK: Artigo[] = [
  {
    id: 1,
    titulo: 'A Liberdade',
    categoria: 'Revolução Francesa',
    imagemCapa: CAPA,
    conteudoHtml: `
      <h2>1. A liberdade</h2>
      <p>${TEXTO.repeat(2)}</p>
      <img src="${CAPA}" alt="A Liberdade guiando o povo" />
      <h2>2. Segunda disputa</h2>
      <p>${TEXTO.repeat(5)}</p>
      <h2>3. Terceira</h2>
      <p>${TEXTO.repeat(4)}</p>
    `,
    destaque: true,
    status: 'publicado',
    dataPublicacao: '2026-08-20T10:00:00',
  },
  {
    id: 2,
    titulo: 'A Proclamação',
    categoria: 'Independência do Brasil',
    imagemCapa: CAPA,
    conteudoHtml: `<h2>1. Introdução</h2><p>${TEXTO.repeat(3)}</p><h2>2. Desfecho</h2><p>${TEXTO.repeat(3)}</p>`,
    destaque: true,
    status: 'publicado',
    dataPublicacao: '2026-08-18T10:00:00',
  },
  {
    id: 3,
    titulo: 'O Império',
    categoria: 'Brasil Império',
    imagemCapa: CAPA,
    conteudoHtml: `<h2>1. Contexto</h2><p>${TEXTO.repeat(3)}</p>`,
    destaque: false,
    status: 'publicado',
    dataPublicacao: '2026-08-10T10:00:00',
  },
  {
    id: 4,
    titulo: 'Rascunho sobre Roma',
    categoria: 'Antiguidade',
    imagemCapa: CAPA,
    conteudoHtml: '<h2>1. Rascunho</h2><p>Ainda em edição.</p>',
    destaque: false,
    status: 'rascunho',
    dataRascunho: '2026-08-20T10:00:00',
  },
];
