import { NextResponse } from 'next/server';
import { getSession, getUsers } from '../../../../lib/auth';
import { listAll } from '../../../../lib/czarnikow-teste-progress-store';
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

    // datas de conclusão: a mais recente é a "última atividade" visível ao professor
    const dates = Object.values(state).map((s) => s?.doneAt).filter(Boolean).sort();
    const lastDone = dates.length ? dates[dates.length - 1] : null;

    const designated = (u.track || []).map((t) => `${u.level || 'essentials'}|${t}`);
    // blocos a mostrar: os designados + qualquer outro em que ele já tenha estudado
    const touched = new Set(designated);
    for (const num of doneNums) {
      const l = lessons.find((x) => x.num === num);
      if (l) touched.add(`${l.level}|${l.track}`);
    }

    const blockRows = [...touched].map((key) => {
      const [level, track] = key.split('|');
      const arr = blocks.get(key) || [];
      const done = arr.filter((l) => doneNums.has(l.num)).length;
      const next = arr.find((l) => !doneNums.has(l.num)) || null;
      return {
        level,
        track,
        levelName: LEVEL_LABEL[level] || level,
        trackName: trackName.get(track) || track,
        designated: designated.includes(key),
        done,
        total: arr.length || LESSONS_PER_BLOCK,
        next: next ? { num: next.num, title: next.title, order: next.trackOrder } : null,
      };
    }).sort((a, b) => (b.designated - a.designated) || (b.done - a.done));

    return {
      student: u.id,
      name: u.name,
      demo: u.id === 'czt-teste',
      level: u.level || null,
      stage: u.stage || null,
      tracks: (u.track || []).map((t) => trackName.get(t) || t),
      lessonsDone: doneNums.size,
      lastAt: lastDone || doc?.at || null,
      started: !!doc,
      blocks: blockRows,
    };
  });

  // ordem alfabética: o professor procura por nome, não por desempenho
  students.sort((a, b) => (a.demo - b.demo) || a.name.localeCompare(b.name, 'pt-BR'));

  return NextResponse.json({ students });
}
