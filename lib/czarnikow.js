/*
  Czarnikow — quais rotas servem o programa completo.

  Em 04/08/2026 o produto construído no ambiente de teste passou a ser O curso
  da Czarnikow: `/czarnikow` (o endereço que os colaboradores já conhecem) e
  `/czarnikow-teste` (a porta antiga, mantida para quem tem o link) servem a
  MESMA coisa — login, progresso no Blob, campanha, exercícios interativos e
  painel do professor.

  As duas portas compartilham o mesmo progresso de propósito: ele segue a
  PESSOA, não o endereço. Quem começou por uma porta e voltar pela outra
  encontra tudo onde deixou.

  Nenhum outro cliente é afetado: quem não está nesta lista continua exatamente
  como antes (curso aberto, sem login e sem campanha).
*/

export const CZARNIKOW_CLIENTS = ['czarnikow', 'czarnikow-teste'];

/** true para as rotas do programa da Czarnikow (as duas portas). */
export function isCzarnikow(clientId) {
  return CZARNIKOW_CLIENTS.includes(clientId);
}
