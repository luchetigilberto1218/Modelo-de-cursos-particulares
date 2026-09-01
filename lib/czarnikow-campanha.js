import { getUsers } from './auth';
import { getCourseLite } from './courses';
import { listAll } from './czarnikow-teste-progress-store';
import { computeScore, CAMPAIGN, SEMESTER } from '../components/czarnikow-teste/campaign';

/*
  Ranking da campanha da Czarnikow para a COORDENAÇÃO.

  A campanha é fechada de propósito: o colaborador vê só a si mesmo — a posição
  e o total de participantes, nunca o nome ou a pontuação de outro (é o que
  app/api/czarnikow-teste/campaign/route.js garante). Quem coordena precisa do
  oposto: a tabela inteira, com nome, para saber quem premiar e quem cutucar.
  Por isso esta leitura mora aqui e só é chamada da tela de coordenação.

  SÓ GENTE REAL. Diferente da rota do colaborador, aqui não entra nada de
  `data/czarnikow-teste-demo`: nem participante fictício (a lista está vazia
  desde 03/08/2026, mas a chamada continua lá), nem as aulas sintéticas do login
  de demonstração. Pontuação de zero é pontuação de zero.
*/

const CLIENT = 'czarnikow-teste';

// Contas que não são colaborador: o login de demonstração usado em apresentação
// e o acesso geral do professor. Nenhum dos dois disputa a campanha.
const FORA = new Set(['czt-teste', 'czt-prof']);

export { CAMPAIGN, SEMESTER };

export async function getRankingCampanha() {
  const course = getCourseLite(CLIENT);
  const lessons = (course?.lessons || []).map((l) => ({
    num: l.num, track: l.track, level: l.level, trackOrder: l.trackOrder, title: l.title,
  }));

  let docs = [];
  try {
    docs = await listAll();
  } catch {
    docs = [];   // sem Blob: todo mundo aparece zerado, em vez de a tela sumir
  }
  const porAluno = new Map(docs.map((d) => [d.student, d]));

  // O grupo é o ROSTER cadastrado, não só quem já sincronizou — senão a tabela
  // esconderia justamente quem não começou, que é quem a coordenação procura.
  const linhas = getUsers()
    .filter((u) => u.role === 'student' && (u.clients || []).includes(CLIENT) && !FORA.has(u.id))
    .map((u) => {
      const doc = porAluno.get(u.id) || null;
      const score = computeScore({
        lessons,
        state: doc?.lessons || {},
        classes: doc?.classes || { general: 0, private: 0 },
      });
      return {
        student: u.id,
        nome: u.name,
        total: score.total,
        pontosAula: score.classPoints,
        pontosMaterial: score.materialPoints,
        aulas: score.classes,
        licoes: score.lessonsDone,
        diasAtivos: score.activeDays,
        tier: score.tier?.name || score.tier?.label || null,
        // quanto o teto semanal cortou: ajuda a explicar por que alguém que
        // estudou muito num dia só não subiu como esperava
        perdidoNoTeto: score.capLost,
      };
    })
    .sort((a, b) => b.total - a.total || a.nome.localeCompare(b.nome, 'pt-BR'));

  // Empate ocupa a MESMA posição (1,1,3...), como na tela do colaborador.
  let posicao = 0;
  let anterior = null;
  linhas.forEach((l, i) => {
    if (anterior === null || l.total !== anterior) posicao = i + 1;
    anterior = l.total;
    l.posicao = posicao;
  });

  const pontuaram = linhas.filter((l) => l.total > 0).length;
  return { campanha: CAMPAIGN, semestre: SEMESTER, linhas, participantes: linhas.length, pontuaram };
}
