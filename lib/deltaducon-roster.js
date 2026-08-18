// Elenco e trilhas da Delta Ducon, em um lugar só.
//
// Isto morava dentro de app/deltaducon-admin/page.jsx. Saiu de lá para que o
// painel da coordenação leia o MESMO elenco — sem isso, seriam duas listas de
// 18 nomes que podem divergir na primeira contratação ou desligamento.
// Nada mudou de conteúdo: os nomes, a ordem e os índices são os mesmos.

// Trilhas na mesma ordem/índice do curso (build-lessons.cjs / lessons.js)
export const TRACKS = [
  'Inglês para Negócios', 'Assistentes Administrativos', 'Vendas / Comercial',
  'Gestão Industrial', 'Qualidade e PCP', 'Gestão de Pessoas',
  'Engenharia de Aplicação', 'Compras (Procurement)',
];

// Aulas por trilha.
export const TOTAL = 10;

// Elenco fixo dos 18 (nome -> índice da trilha), igual ao dropdown do curso.
export const ROSTER = [
  ['Aldo Stella Junior', 2], ['André Vinicius Neves Dias', 3], ['Andrea Rosa dos Santos', 2],
  ['Anselmo Teixeira', 2], ['Carlos Eduardo Campos de Freitas', 2], ['Felipe da Silva Ribeiro Mariano', 2],
  ['Felipe Gomes', 6], ['Fernando Antonio Rosatti', 7], ['Fernando Maranim Sandoval', 2],
  ['Gabriel Marcos de Rosa Miari', 3], ['Gustavo Quintela dos Santos', 6], ['Hugo César Alves Dantas', 6],
  ['Jefferson Matozinho da Luz', 6], ['Jessica Lima da Silva', 2], ['Marcio Clementino dos Santos Sousa', 6],
  ['Milton Chiga', 2], ['Raphael Henrique Aguiar da Silva', 2], ['Ricardo Bruno Aguiar da Silva', 6],
];

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
