import { NextResponse } from 'next/server';
import { getSession, getUsers } from '../../../../lib/auth';
import { readDoc, listAll, isValidStudent } from '../../../../lib/czarnikow-teste-progress-store';
import { getCourseLite } from '../../../../lib/courses';
import { computeScore, SEMESTER } from '../../../../components/czarnikow-teste/campaign';
import { demoParticipants, demoBacklog, DEMO_CLASSES } from '../../../../data/czarnikow-teste-demo';

/*
  Campanha Czarnikow Ago–Dez 2026 (ambiente de teste).

  Devolve a pontuação do usuário logado e a posição dele entre os participantes.

  A campanha é FECHADA: cada colaborador vê apenas a si mesmo. A resposta nunca
  carrega nome, pontuação ou progresso de outra pessoa — só o número da posição e
  o total de participantes, calculados aqui no servidor. Os colaboradores de
  demonstração continuam entrando na CONTAGEM (enquanto o roster real da CZ não
  chega), mas nada deles é exposto.

  ADITIVO e tolerante a falha: qualquer erro devolve um payload vazio e a
  interface simplesmente não mostra a campanha.
*/

export const dynamic = 'force-dynamic';

const CLIENT = 'czarnikow-teste';

function lessonMeta() {
  const course = getCourseLite(CLIENT);
  return (course?.lessons || []).map((l) => ({
    num: l.num, track: l.track, level: l.level, trackOrder: l.trackOrder, title: l.title,
  }));
}

// Base de lições para o progresso dos participantes demo: o nível Essentials
// inteiro, começando por HR (a trilha já convertida) e seguindo pelas demais —
// é o percurso de quem estuda o semestre todo.
function demoLessonNums(lessons, { excludeHr = false } = {}) {
  const essentials = lessons.filter((l) => l.level === 'essentials');
  const byTrack = new Map();
  for (const l of essentials) {
    if (!byTrack.has(l.track)) byTrack.set(l.track, []);
    byTrack.get(l.track).push(l);
  }
  const others = [...byTrack.keys()].filter((t) => t !== 'hr');
  const order = excludeHr ? others : ['hr', ...others];
  return order.flatMap((t) => (byTrack.get(t) || [])
    .sort((a, b) => (a.trackOrder || a.num) - (b.trackOrder || b.num))
    .map((l) => l.num));
}

export async function GET() {
  const session = await getSession();
  if (!session?.id || !isValidStudent(session.id)) {
    return NextResponse.json({ semester: SEMESTER, me: null, standing: null }, { status: 401 });
  }

  const lessons = lessonMeta();
  const users = getUsers();
  const nameOf = (id) => users.find((u) => u.id === id)?.name || id;

  try {
    // ── participante logado ──────────────────────────────────────────────
    const doc = await readDoc(session.id);
    const realLessons = doc?.lessons || {};
    // O histórico de demonstração entra por baixo: o progresso REAL sempre vence.
    // Ele usa só lições FORA de essentials/hr — assim a trilha que o visitante
    // realmente percorre continua mostrando o progresso dele, sem número inflado.
    const backlog = demoBacklog(session.id, demoLessonNums(lessons, { excludeHr: true })) || {};
    const isDemoLogin = Object.keys(backlog).length > 0;
    const state = { ...backlog, ...realLessons };

    const classes = doc?.classes || DEMO_CLASSES[session.id] || { general: 0, private: 0 };
    const classesAreDemo = !doc?.classes && !!DEMO_CLASSES[session.id];

    const me = {
      student: session.id,
      name: doc?.name || nameOf(session.id),
      score: computeScore({ lessons, state, classes }),
      classesAreDemo,
      isDemoLogin,
      realLessonsDone: Object.values(realLessons).filter((l) => l?.done).length,
    };

    // ── posição, sem expor ninguém ───────────────────────────────────────
    // Monta a tabela completa APENAS para contar e ordenar; nada dela sai daqui
    // além do número da posição do próprio usuário e do total de participantes.
    let real = [];
    try {
      real = await listAll();
    } catch {
      real = [];
    }

    // O grupo é o ROSTER cadastrado, não só quem já sincronizou. Contar apenas
    // quem tem doc no Blob faria os primeiros a entrar verem "1º de 1" no dia do
    // lançamento, como se a campanha fosse deles sozinhos.
    const rows = new Map();
    for (const u of users) {
      if (u.role !== 'student' || !(u.clients || []).includes(CLIENT)) continue;
      if (u.id === 'czt-teste' && me.student !== 'czt-teste') continue;  // conta de demonstração
      rows.set(u.id, { student: u.id, demo: false, total: 0 });
    }
    // quem já sincronizou entra com a pontuação real.
    // SÓ quem já está em `rows`, ou seja, colaborador do roster: o Blob também
    // guarda o progresso de quem NÃO participa da campanha (coordenação e o
    // login do professor, que abrem o curso para conferir). Sem esse filtro a
    // tela dizia "1º de 22" com 20 colaboradores cadastrados.
    for (const r of real) {
      if (!rows.has(r.student)) continue;
      if (r.student === 'czt-teste' && me.student !== 'czt-teste') continue;
      const cls = r.classes || DEMO_CLASSES[r.student] || { general: 0, private: 0 };
      rows.set(r.student, {
        student: r.student,
        demo: false,
        total: computeScore({ lessons, state: r.lessons || {}, classes: cls }).total,
      });
    }
    // o próprio usuário sempre com a pontuação recém-calculada
    rows.set(me.student, { student: me.student, demo: false, total: me.score.total });

    for (const p of demoParticipants(demoLessonNums(lessons))) {
      if (rows.has(p.student)) continue;
      rows.set(p.student, {
        student: p.student,
        demo: true,
        total: computeScore({ lessons, state: p.state, classes: p.classes }).total,
      });
    }

    const ordered = [...rows.values()].sort((a, b) => b.total - a.total);
    const participants = ordered.length;

    // Posição com EMPATE de verdade: quem tem a mesma pontuação ocupa a mesma
    // posição. Sem isso, no dia do lançamento — com todo mundo em 0 — o
    // desempate cairia na ordem do cadastro e alguém abriria a campanha já
    // vendo "20º de 20" sem nada ter acontecido.
    const meuTotal = me.score.total;
    const allTied = participants > 1 && ordered.every((r) => r.total === ordered[0].total);
    const position = ordered.filter((r) => r.total > meuTotal).length + 1;
    // quantos participantes estão ATRÁS do usuário, em % (empatados não contam)
    const atras = ordered.filter((r) => r.total < meuTotal).length;
    const aheadOfPct = participants > 1
      ? Math.round((atras / (participants - 1)) * 100)
      : null;

    return NextResponse.json({
      semester: SEMESTER,
      me: { ...me, position, participants, allTied },
      standing: {
        position,
        participants,
        aheadOfPct,
        // no dia do lançamento ninguém pontuou ainda: a tela troca a colocação
        // por "todos empatados" em vez de dizer "1º" e "à frente de 0%" juntos
        allTied,
        demoCount: ordered.filter((r) => r.demo).length,
      },
    });
  } catch {
    return NextResponse.json({ semester: SEMESTER, me: null, standing: null });
  }
}
