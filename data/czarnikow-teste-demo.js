/*
  Colaboradores de DEMONSTRAÇÃO da campanha Czarnikow (ambiente de teste).

  A lista de colegas fictícios (SEED) está VAZIA desde 03/08/2026: os 20
  colaboradores reais foram cadastrados em data/users.json e a campanha passou a
  contar gente de verdade. Ninguém fictício entra mais na posição de ninguém.

  O que sobrou aqui é só o login de DEMONSTRAÇÃO (`czt-teste`), que continua
  recebendo aulas e histórico sintéticos — sem isso, quem abre a campanha para
  apresentar cai numa tela zerada que não mostra o 60/40 funcionando. Aluno real
  nunca recebe nada disso (demoBacklog devolve null para qualquer outro id).
*/

import { SEMESTER } from '../components/czarnikow-teste/campaign.js';

/*
  O retrato é o de uma campanha por volta da 15ª das 20 semanas: gente espalhada
  por tiers diferentes e por perfis diferentes — quem é puxado pelas aulas, quem
  é puxado pelo material, quem faz particulares. Assim a posição do participante
  cai num grupo realista, e não numa fila de dez pessoas idênticas.

  nome, aulas em turma, aulas particulares, lições concluídas, semanas ativas.
*/
const SEED = [
  // VAZIO desde 03/08/2026: os 20 colaboradores reais da Czarnikow foram
  // cadastrados em data/users.json e a campanha passou a contar gente de
  // verdade. Manter colegas fictícios ao lado de pessoas reais distorceria a
  // posição de cada um. Para voltar a demonstrar a campanha "em regime" sem
  // roster real, basta repovoar esta lista.
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
