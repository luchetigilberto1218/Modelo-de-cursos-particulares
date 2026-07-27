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
  O retrato é o de uma campanha por volta da 15ª das 20 semanas: gente espalhada
  por tiers diferentes e por perfis diferentes — quem é puxado pelas aulas, quem
  é puxado pelo material, quem faz particulares. Assim o RH vê o ranking contando
  uma história, e não dez linhas iguais.

  nome, aulas em turma, aulas particulares, lições concluídas, semanas ativas.
*/
const SEED = [
  { student: 'demo-ana',      name: 'Ana Beatriz Moraes',  general: 30, private: 5, lessons: 45, weeks: 15 },
  { student: 'demo-juliana',  name: 'Juliana Petrelli',    general: 30, private: 4, lessons: 30, weeks: 15 },
  { student: 'demo-rafael',   name: 'Rafael Nogueira',     general: 28, private: 3, lessons: 42, weeks: 15 },
  { student: 'demo-thiago',   name: 'Thiago Aoki',         general: 26, private: 0, lessons: 48, weeks: 15 },
  { student: 'demo-camila',   name: 'Camila Ferreira',     general: 24, private: 2, lessons: 35, weeks: 14 },
  { student: 'demo-lucas',    name: 'Lucas Bernardes',     general: 22, private: 0, lessons: 26, weeks: 13 },
  { student: 'demo-patricia', name: 'Patrícia Salgado',    general: 24, private: 1, lessons: 18, weeks: 13 },
  { student: 'demo-eduardo',  name: 'Eduardo Tanaka',      general: 18, private: 0, lessons: 20, weeks: 11 },
  { student: 'demo-marina',   name: 'Marina Cordeiro',     general: 14, private: 0, lessons: 12, weeks: 9 },
  { student: 'demo-felipe',   name: 'Felipe Andrade',      general: 8,  private: 0, lessons: 6,  weeks: 6 },
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
/*
  O login de demonstração também entra na campanha "no meio dela": recebe aulas e
  um histórico de estudo fictícios, para que quem apresenta caia numa tela
  representativa (com os ~60/40 visíveis) em vez de 100% aula e material zerado.

  As lições feitas AO VIVO durante a demonstração somam por cima disso — o
  progresso real sempre vence o sintético. A interface avisa que são dados de
  demonstração. Chave = `id` do usuário em data/users.json, não o username.
*/
const SELF = {
  'czt-teste': { general: 20, private: 2, lessons: 24, weeks: 12 },
};

export const DEMO_CLASSES = Object.fromEntries(
  Object.entries(SELF).map(([id, s]) => [id, { general: s.general, private: s.private }]),
);

/** Histórico de estudo fictício do login de demonstração (null para os demais). */
export function demoBacklog(student, lessonNums = []) {
  const s = SELF[student];
  return s ? synthState(lessonNums, s.lessons, s.weeks) : null;
}
