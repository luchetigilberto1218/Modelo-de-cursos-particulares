// Elenco e trilhas da Delta Ducon, em um lugar só.
//
// Isto morava dentro de app/deltaducon-admin/page.jsx. Saiu de lá para que o
// painel da coordenação leia o MESMO elenco — sem isso, seriam duas listas de
// nomes que podem divergir na primeira contratação ou desligamento.
// Nada mudou de conteúdo: os nomes, a ordem e os índices são os mesmos.

// Trilhas na mesma ordem/índice do curso (build-lessons.cjs / lessons.js)
export const TRACKS = [
  'Inglês para Negócios', 'Assistentes Administrativos', 'Vendas / Comercial',
  'Gestão Industrial', 'Qualidade e PCP', 'Gestão de Pessoas',
  'Engenharia de Aplicação', 'Compras (Procurement)',
  'Projetos e Contratos', 'Engenharia de Detalhamento',
];

// Aulas por trilha.
export const TOTAL = 10;

// Elenco (nome -> índice da trilha), igual ao dropdown do curso.
export const ROSTER = [
  ['André Vinicius Neves Dias', 3], ['Andrea Rosa da Silva', 2],
  ['Anselmo Teixeira', 2], ['Felipe da Silva Ribeiro Mariano', 2],
  ['Felipe Gomes', 6], ['Fernando Antonio Rosatti', 7], ['Fernando Maranim Sandoval', 2],
  ['Gabriel Marcos de Rosa Miari', 3], ['Gustavo Quintela dos Santos', 6],
  ['Jeferson Matozinho da Luz', 6], ['Jessica Lima da Silva', 2], ['Marcio Clementino dos Santos Sousa', 6],
  ['Milton Chiga', 2], ['Raphael Henrique Aguiar da Silva', 2], ['Ricardo Bruno Aguiar da Silva', 6],
  // Ago/26 — entraram no lugar de duas saídas, nas duas áreas novas.
  ['Willian Kulikowski Bengio', 8], ['Fernando Sumitani Cardoso de Oliveira', 9],
];
// Grafia dos nomes: a fonte é a planilha de presença da Delta (set/26) — "Andrea Rosa da Silva"
// (era "dos Santos") e "Jeferson" com um f só (era "Jefferson"). O slug do Blob vem do nome, então
// o doc da Andrea foi copiado para o slug novo e o curso migra sozinho quem tem o nome antigo
// salvo no navegador (const RENAMES em public/deltaducon/*.html).
// Saíram do programa (set/26): Aldo Stella Junior e Carlos Eduardo Campos de Freitas (baixa
// frequência, ago/26) e Hugo César Alves Dantas (desligado antes de jul/26). O progresso deles
// segue gravado no Blob — nada foi apagado; só saíram da lista de quem aparece no curso.

export function slugify(s) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 64);
}

// Quantas aulas da trilha `t` a pessoa concluiu (as chaves vêm como "<t>_<n>").
export function doneInTrack(done, t) {
  if (!done) return 0;
  const pref = t + '_';
  return Object.keys(done).filter(k => k.startsWith(pref)).length;
}
