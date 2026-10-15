/** Dados preenchidos pelo aluno no formulário da home. */
export interface Sugestao {
  nome: string;
  email: string;
  tema: string;
  mensagem: string;
}

/** Sugestão já registrada pelo sistema (com id e data de envio). */
export interface SugestaoRecebida extends Sugestao {
  id: number;
  dataEnvio: string;
}
