/*
  Colaboradores de DEMONSTRAÇÃO da campanha Czarnikow (ambiente de teste).

  Servem para o RH enxergar o ranking funcionando antes de a campanha começar
  (3/ago/2026) e antes de existir o roster real. São claramente marcados como
  demo na interface (`demo: true`) e passam pelo MESMO motor de pontuação dos
  participantes reais — ninguém tem número "chumbado".

  QUANDO O ROSTER REAL CHEGAR: basta esvaziar DEMO_PEOPLE (ou trocar por
  `export const DEMO_PEOPLE = []`) e cadastrar as pessoas em data/users.json.
  Nenhum outro arquivo precisa mudar.
*/

import { SEMESTER } from '../components/czarnikow-teste/campaign.js';

/*
  O retrato é o de uma campanha por volta da 14ª das 20 semanas — assim o RH vê
  o ranking com gente espalhada por tiers diferentes, e não todo mundo empatado
  no começo. nome, aulas em turma, aulas particulares, lições, semanas ativas.
*/
const SEED = [
  { student: 'demo-ana',      name: 'Ana Beatriz Moraes',  general: 28, private: 6, lessons: 20, weeks: 14 },
  { student: 'demo-rafael',   name: 'Rafael Nogueira',     general: 26, private: 4, lessons: 18, weeks: 14 },
  { student: 'demo-juliana',  name: 'Juliana Petrelli',    general: 25, private: 5, lessons: 16, weeks: 13 },
  { student: 'demo-thiago',   name: 'Thiago Aoki',         general: 26, private: 0, lessons: 19, weeks: 14 },
  { student: 'demo-camila',   name: 'Camila Ferreira',     general: 22, private: 3, lessons: 15, weeks: 12 },
  { student: 'demo-lucas',    name: 'Lucas Bernardes',     general: 20, private: 0, lessons: 13, weeks: 11 },
  { student: 'demo-patricia', name: 'Patrícia Salgado',    general: 18, private: 2, lessons: 12, weeks: 10 },
  { student: 'demo-eduardo',  name: 'Eduardo Tanaka',      general: 16, private: 0, lessons: 10, weeks: 9 },
  { student: 'demo-marina',   name: 'Marina Cordeiro',     general: 12, private: 0, lessons: 8,  weeks: 7 },
  { student: 'demo-felipe',   name: 'Felipe Andrade',      general: 8,  private: 0, lessons: 5,  weeks: 5 },
];

const DAY = 86400000;

/**
 * Espalha as lições ao longo de TODAS as semanas ativas (e não só nas primeiras),
 * em dias diferentes — que é como uma pessoa real estuda, e é o que o teto
 * semanal do material premia.
 */
function synthState(nums, lessons, weeks) {
  const start = Date.parse(`${SEMESTER.start}T12:00:00Z`);
  const state = {};
  const total = Math.min(lessons, nums.length);
  for (let i = 0; i < total; i += 1) {
    const week = Math.floor((i * weeks) / total);
    const day = (i % 3) * 2;                        // seg / qua / sex
    const at = new Date(start + week * 7 * DAY + day * DAY).toISOString();
    state[nums[i]] = { done: true, doneAt: at, acc: 0.75 + ((i * 7) % 25) / 100 };
  }
  return state;
}

/**
 * Participantes de demonstração, prontos para o motor de pontuação.
 * @param {number[]} lessonNums nums das lições disponíveis (trilha convertida)
 */
export function demoParticipants(lessonNums = []) {
  return SEED.map((p) => ({
    student: p.student,
    name: p.name,
    demo: true,
    classes: { general: p.general, private: p.private },
    state: synthState(lessonNums, p.lessons, p.weeks),
  }));
}

/**
 * Aulas de demonstração para os logins de teste, para que a metade "aula" da
 * campanha (60%) apareça enquanto a Alumni ainda não lança presença de verdade.
 */
// A chave é o `id` do usuário em data/users.json (não o username do login).
export const DEMO_CLASSES = {
  'czt-teste': { general: 18, private: 3 },
  'czt-prof': { general: 0, private: 0 },
};
