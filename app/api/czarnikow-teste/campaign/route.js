import { NextResponse } from 'next/server';
import { getSession, getUsers } from '../../../../lib/auth';
import { readDoc, listAll, isValidStudent } from '../../../../lib/czarnikow-teste-progress-store';
import { getCourseLite } from '../../../../lib/courses';
import { computeScore, badgesFor, SEMESTER } from '../../../../components/czarnikow-teste/campaign';
import { demoParticipants, demoBacklog, DEMO_CLASSES } from '../../../../data/czarnikow-teste-demo';

/*
  Campanha Czarnikow Ago–Dez 2026 (ambiente de teste).

  Devolve a pontuação do usuário logado + o ranking aberto (decisão do RH: todos
  veem todos). O ranking mistura participantes reais (quem já sincronizou
  progresso) com os colaboradores de demonstração, marcados com `demo: true` —
  enquanto o roster real da CZ não chega.

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
// é o percurso de quem estuda o semestre todo, e faz os badges se espalharem.
function demoLessonNums(lessons) {
  const essentials = lessons.filter((l) => l.level === 'essentials');
  const byTrack = new Map();
  for (const l of essentials) {
    if (!byTrack.has(l.track)) byTrack.set(l.track, []);
    byTrack.get(l.track).push(l);
  }
  const order = ['hr', ...[...byTrack.keys()].filter((t) => t !== 'hr')];
  return order.flatMap((t) => (byTrack.get(t) || [])
    .sort((a, b) => (a.trackOrder || a.num) - (b.trackOrder || b.num))
    .map((l) => l.num));
}

export async function GET() {
  const session = await getSession();
  if (!session?.id || !isValidStudent(session.id)) {
    return NextResponse.json({ semester: SEMESTER, me: null, ranking: [] }, { status: 401 });
  }

  const lessons = lessonMeta();
  const users = getUsers();
  const nameOf = (id) => users.find((u) => u.id === id)?.name || id;

  try {
    // ── participante logado ──────────────────────────────────────────────
    const doc = await readDoc(session.id);
    const realLessons = doc?.lessons || {};
    // O histórico de demonstração entra por baixo: o progresso REAL sempre vence.
    const backlog = demoBacklog(session.id, demoLessonNums(lessons)) || {};
    const isDemoLogin = Object.keys(backlog).length > 0;
    const state = { ...backlog, ...realLessons };

    const classes = doc?.classes || DEMO_CLASSES[session.id] || { general: 0, private: 0 };
    const classesAreDemo = !doc?.classes && !!DEMO_CLASSES[session.id];

    const me = {
      student: session.id,
      name: doc?.name || nameOf(session.id),
      score: computeScore({ lessons, state, classes }),
      badges: badgesFor({ lessons, state }),
      classesAreDemo,
      isDemoLogin,
      realLessonsDone: Object.values(realLessons).filter((l) => l?.done).length,
    };

    // ── ranking aberto ───────────────────────────────────────────────────
    let real = [];
    try {
      real = await listAll();
    } catch {
      real = [];
    }

    const rows = new Map();
    for (const r of real) {
      const cls = r.classes || DEMO_CLASSES[r.student] || { general: 0, private: 0 };
      rows.set(r.student, {
        student: r.student,
        name: r.name || nameOf(r.student),
        demo: false,
        score: computeScore({ lessons, state: r.lessons || {}, classes: cls }),
      });
    }
    // o próprio usuário entra mesmo que ainda não tenha sincronizado nada
    rows.set(me.student, { student: me.student, name: me.name, demo: false, score: me.score });

    for (const p of demoParticipants(demoLessonNums(lessons))) {
      if (rows.has(p.student)) continue;
      rows.set(p.student, {
        student: p.student,
        name: p.name,
        demo: true,
        score: computeScore({ lessons, state: p.state, classes: p.classes }),
      });
    }

    const ranking = [...rows.values()]
      .sort((a, b) => b.score.total - a.score.total)
      .map((r, i) => ({
        position: i + 1,
        student: r.student,
        name: r.name,
        demo: r.demo,
        total: r.score.total,
        classPoints: r.score.classPoints,
        materialPoints: r.score.materialPoints,
        lessonsDone: r.score.lessonsDone,
        tier: r.score.tier,
      }));

    return NextResponse.json({
      semester: SEMESTER,
      me: { ...me, position: ranking.find((r) => r.student === me.student)?.position || null },
      ranking,
      hasDemo: ranking.some((r) => r.demo),
    });
  } catch {
    return NextResponse.json({ semester: SEMESTER, me: null, ranking: [] });
  }
}
