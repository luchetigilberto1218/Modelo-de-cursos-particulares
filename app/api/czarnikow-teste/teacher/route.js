import { NextResponse } from 'next/server';
import { getSession, getUsers } from '../../../../lib/auth';
import { listAll, setTaught, isValidStudent } from '../../../../lib/czarnikow-teste-progress-store';
import { getCourseLite } from '../../../../lib/courses';

/*
  Painel do professor (Czarnikow · ambiente de teste).

  Responde UMA pergunta por colaborador: onde ele está e qual é a próxima aula
  a dar. Nada de leitura de turma (quem sumiu, ranking, engajamento) — essa é a
  visão do coordenador, não a do professor, que chega para dar aula a UMA pessoa.

  Login de professor é GERAL (`professor`), porque os professores da CZ não são
  fixos: quem pegar a aula usa o mesmo acesso. Só `teacher` e `coordinator`
  entram aqui; aluno leva 403 (e a rota já exige sessão pelo guard).

  ADITIVO: rota nova, nenhum curso existente muda. Se o Blob falhar, o painel
  ainda lista todo mundo — só sem progresso.
*/

export const dynamic = 'force-dynamic';

const CLIENT = 'czarnikow-teste';
const LESSONS_PER_BLOCK = 20;   // cada (nível × trilha) tem 20 lições

export async function GET() {
  const session = await getSession();
  if (!session?.id) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  if (session.role !== 'teacher' && session.role !== 'coordinator') {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  const course = getCourseLite(CLIENT);
  const lessons = (course?.lessons || []).map((l) => ({
    num: l.num, track: l.track, level: l.level, trackOrder: l.trackOrder, title: l.title,
  }));
  const trackName = new Map((course?.tracks || []).map((t) => [t.id, t.name]));
  // O course.levels agrupa "Confidence & Essentials" num item só, mas as lições
  // trazem os quatro níveis separados — que é como a CZ fala deles no `stage`.
  const LEVEL_LABEL = {
    confidence: 'Confidence', essentials: 'Essentials', rise: 'Rise', apex: 'Apex',
  };

  // lições agrupadas por bloco (nível × trilha), já em ordem de percurso
  const blocks = new Map();
  for (const l of lessons) {
    const key = `${l.level}|${l.track}`;
    if (!blocks.has(key)) blocks.set(key, []);
    blocks.get(key).push(l);
  }
  for (const [, arr] of blocks) arr.sort((a, b) => (a.trackOrder || a.num) - (b.trackOrder || b.num));

  // progresso de quem já sincronizou; quem nunca abriu simplesmente não aparece aqui
  let docs = [];
  try {
    docs = await listAll();
  } catch {
    docs = [];
  }
  const byStudent = new Map(docs.map((d) => [d.student, d]));

  const roster = getUsers().filter(
    (u) => u.role === 'student' && (u.clients || []).includes(CLIENT)
  );

  const students = roster.map((u) => {
    const doc = byStudent.get(u.id) || null;
    const state = doc?.lessons || {};
    const doneNums = new Set(
      Object.keys(state).filter((num) => state[num]?.done).map(Number)
    );
    // Unidades cuja AULA já aconteceu. Fecham a unidade para o professor mesmo
    // sem material estudado — é o que impede a aula particular de se repetir
    // (ver components/czarnikow-teste/ClassGiven.jsx).
    const taughtNums = new Set(
      Object.keys(state).filter((num) => state[num]?.taught).map(Number)
    );
    const fechada = (num) => doneNums.has(num) || taughtNums.has(num);

    // datas de conclusão: a mais recente é a "última atividade" visível ao professor
    const dates = Object.values(state).map((s) => s?.doneAt).filter(Boolean).sort();
    const lastDone = dates.length ? dates[dates.length - 1] : null;

    const designated = (u.track || []).map((t) => `${u.level || 'essentials'}|${t}`);
    // blocos a mostrar: os designados + qualquer outro em que ele já tenha estudado
    const touched = new Set(designated);
    for (const num of new Set([...doneNums, ...taughtNums])) {
      const l = lessons.find((x) => x.num === num);
      if (l) touched.add(`${l.level}|${l.track}`);
    }

    // Quem já teve aula antes do lançamento começa adiante (users.json.startAt).
    // Essas lições foram DADAS EM AULA, não estudadas no material — por isso não
    // entram como concluídas (não valem ponto de material na campanha); só
    // empurram o ponto de partida do professor.
    const startAt = typeof u.startAt === 'number' ? u.startAt : null;

    const blockRows = [...touched].map((key) => {
      const [level, track] = key.split('|');
      const arr = blocks.get(key) || [];
      const done = arr.filter((l) => doneNums.has(l.num)).length;
      const taught = arr.filter((l) => taughtNums.has(l.num) && !doneNums.has(l.num)).length;
      // o startAt só vale para o bloco a que a lição pertence
      const daPartida = startAt && arr.some((l) => l.num === startAt);
      const next = arr.find((l) => !fechada(l.num) && (!daPartida || l.num >= startAt)) || null;
      const jaEmAula = daPartida ? arr.filter((l) => l.num < startAt).length : 0;
      return {
        level,
        track,
        jaEmAula,
        levelName: LEVEL_LABEL[level] || level,
        trackName: trackName.get(track) || track,
        designated: designated.includes(key),
        done,
        taught,
        total: arr.length || LESSONS_PER_BLOCK,
        next: next ? { num: next.num, title: next.title, order: next.trackOrder } : null,
      };
    }).sort((a, b) => (b.designated - a.designated) || (b.done - a.done));

    // Declarações "estudei e estou pronto para a aula particular", da mais nova
    // para a mais velha, com a evidência do que o aluno praticou. É o handoff:
    // o professor abre a aula sabendo se dá para avançar ou se precisa retomar.
    const ready = Object.keys(state)
      .filter((num) => state[num]?.ready && !state[num]?.taught)
      .map((num) => {
        const s = state[num];
        const l = lessons.find((x) => x.num === Number(num)) || null;
        const total = typeof s.readyTotal === 'number' ? s.readyTotal : null;
        const answered = typeof s.readyDone === 'number' ? s.readyDone : null;
        return {
          num: Number(num),
          title: l?.title || `Lição ${num}`,
          order: l?.trackOrder || null,
          trackName: l ? (trackName.get(l.track) || l.track) : null,
          levelName: l ? (LEVEL_LABEL[l.level] || l.level) : null,
          at: s.readyAt || null,
          answered,
          total,
          acc: typeof s.readyAcc === 'number' ? s.readyAcc
            : (typeof s.acc === 'number' ? s.acc : null),
          // declarou sem ter praticado o suficiente (espelha READY_MIN = 0.7 no cliente)
          weak: total > 0 && answered !== null && answered < Math.ceil(total * 0.7),
          done: !!s.done,
        };
      })
      .sort((a, b) => String(b.at || '').localeCompare(String(a.at || '')));

    return {
      student: u.id,
      name: u.name,
      ready,
      demo: u.id === 'czt-teste',
      level: u.level || null,
      stage: u.stage || null,
      tracks: (u.track || []).map((t) => trackName.get(t) || t),
      lessonsDone: doneNums.size,
      lessonsTaught: taughtNums.size,
      lastAt: lastDone || doc?.at || null,
      started: !!doc,
      blocks: blockRows,
    };
  });

  // ordem alfabética: o professor procura por nome, não por desempenho
  students.sort((a, b) => (a.demo - b.demo) || a.name.localeCompare(b.name, 'pt-BR'));

  return NextResponse.json({ students });
}

/* Encerrar (ou reabrir) uma unidade pelo painel: "a aula desta unidade já
   aconteceu". Mesmo efeito do botão que o aluno tem dentro da lição — muda só
   quem clica. Não toca em `done`: ponto de material continua sendo de quem
   praticou. Só professor e coordenação escrevem aqui. */
export async function POST(request) {
  const session = await getSession();
  if (!session?.id) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  if (session.role !== 'teacher' && session.role !== 'coordinator') {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  let body = {};
  try { body = await request.json(); } catch { body = {}; }
  const student = typeof body.student === 'string' ? body.student : null;
  const num = Number(body.num);
  if (!student || !isValidStudent(student) || !Number.isFinite(num)) {
    return NextResponse.json({ error: 'bad_request' }, { status: 400 });
  }

  try {
    const lesson = await setTaught(student, num, body.taught !== false, 'teacher');
    return NextResponse.json({ ok: true, student, num, lesson });
  } catch {
    // Blob fora do ar: o painel avisa e o professor pode marcar pela lição.
    return NextResponse.json({ error: 'store_unavailable' }, { status: 503 });
  }
}
