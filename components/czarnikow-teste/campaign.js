/*
  Campanha Czarnikow Ago–Dez 2026 — motor de pontuação.

  Módulo puro (sem React, sem DOM): roda no cliente (widget/página) e no servidor
  (rota /api/czarnikow-teste/campaign, que monta o ranking). Toda regra numérica
  mora aqui — se a CZ pedir para mexer na pontuação, mexe-se só neste arquivo.

  Desenho travado com o RH (24/07/2026): a campanha é 60/40 PRÓ-AULA. O material
  é premiado, mas com teto semanal, para que estudar sozinho nunca substitua a
  presença em aula.
*/

export const SEMESTER = {
  start: '2026-08-03',   // segunda-feira
  end: '2026-12-18',
  weeks: 20,
  label: 'Agosto – Dezembro 2026',
};

/*
  Dois tetos, e é aí que mora o desenho da campanha:

  - TETO DIÁRIO (4 pts): estudar tudo de uma vez não paga. Vinte lições numa
    tarde valem o mesmo que uma.
  - TETO SEMANAL (9 pts): para fechar a semana no material é preciso estudar em
    pelo menos TRÊS dias diferentes. É o teto diário que obriga a espalhar —
    com teto semanal sozinho, uma única lição já fecharia a semana e quem
    estudasse 1 vez por semana pontuaria igual a quem estudasse 5.

  O bônus de constância (7 dias seguidos) é o único ganho que passa do teto
  semanal — é o prêmio de quem sustenta ritmo, e é raro o bastante para não
  desequilibrar o 60/40.
*/
export const SCORING = {
  classPrivate: 10,       // aula particular (por aula, sem teto)
  classGeneral: 7,        // aula em turma (por aula, sem teto)
  lessonDone: 2,          // lição concluída
  accuracyMax: 1,         // até 1 pt, conforme o % de acerto na 1ª tentativa
  activeDay: 1,           // por dia com estudo válido
  streakBonus: 5,         // 7 dias seguidos na mesma trilha (fora do teto semanal)
  materialDailyCap: 4,    // TETO do material por dia
  materialWeeklyCap: 9,   // TETO do material por semana
};

/* Faixas calibradas pela projeção do semestre: quem cumpre a política da CZ
   (2 aulas/semana) + material constante fecha o semestre por volta de 460 pts =
   On Course. Delivered exige ir além — aulas extras ou particulares.

   Os nomes seguem a viagem de uma carga, o vocabulário da própria Czarnikow.
   Foi uma escolha deliberada: nenhum degrau pode soar como julgamento de quem
   está embaixo — são etapas de um percurso, não notas. (A regra nasceu quando o
   ranking ainda era aberto; hoje a campanha é fechada, mas o critério continua
   valendo: a etapa também aparece no widget e nos marcos.)
   E, ao contrário dos nomes anteriores (Foundation / Working Proficiency
   / Business Fluent / Advisor), estes não se confundem com nível de inglês:
   o tier mede ENGAJAMENTO na campanha, não proficiência. */
export const TIERS = [
  { id: 'loading',   name: 'Loading',    min: 0,   desc: 'A carga está sendo montada.' },
  { id: 'underway',  name: 'Underway',   min: 180, desc: 'Saiu do porto, seguindo com constância.' },
  { id: 'oncourse',  name: 'On Course',  min: 360, desc: 'No rumo certo: 2 aulas por semana.' },
  { id: 'delivered', name: 'Delivered',  min: 540, desc: 'Entregue — foi até o fim.' },
];

/*
  NÃO existe badge de competência por trilha (People Partner, Meeting Fluent e
  companhia foram removidos em 28/07/2026). A única progressão do participante
  são as quatro etapas acima — um segundo sistema de nomes só embaralhava a
  leitura da tela, para o RH e para o colaborador.
*/

/* ── helpers de data ──────────────────────────────────────────────────────── */

/** Chave de semana ISO (ex.: "2026-W32"). Usada para aplicar o teto semanal. */
export function isoWeek(dateish) {
  const d = new Date(dateish);
  if (Number.isNaN(d.getTime())) return null;
  const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  // quinta-feira da mesma semana define o ano ISO
  t.setUTCDate(t.getUTCDate() + 4 - (t.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((t - yearStart) / 86400000 + 1) / 7);
  return `${t.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}

/** Dia (YYYY-MM-DD) em UTC. */
export function dayKey(dateish) {
  const d = new Date(dateish);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 10);
}

const NO_DATE = 'sem-data';

/* ── pontuação ────────────────────────────────────────────────────────────── */

/**
 * Calcula a pontuação da campanha de um participante.
 *
 * @param {object}   input
 * @param {Array}    input.lessons  metadados das lições do curso ({num, track, ...})
 * @param {object}   input.state    progresso do aluno: { [num]: { done, doneAt, acc } }
 * @param {object}   input.classes  aulas lançadas pela Alumni: { general, private }
 * @returns {object} detalhamento completo (usado na página e no ranking)
 */
export function computeScore({ lessons = [], state = {}, classes = {} } = {}) {
  const trackOf = new Map(lessons.map((l) => [String(l.num), l.track]));

  const general = Math.max(0, Number(classes.general) || 0);
  const priv = Math.max(0, Number(classes.private) || 0);
  const classPoints = general * SCORING.classGeneral + priv * SCORING.classPrivate;

  // Lições concluídas, em ordem cronológica (quem não tem data cai num balde só,
  // que continua sujeito ao teto semanal — é exatamente o anti-gaming desejado).
  const done = [];
  for (const num of Object.keys(state)) {
    const s = state[num];
    if (!s?.done) continue;
    done.push({
      num,
      track: trackOf.get(String(num)) || null,
      at: s.doneAt || null,
      acc: typeof s.acc === 'number' ? Math.min(1, Math.max(0, s.acc)) : null,
    });
  }
  done.sort((a, b) => String(a.at || '').localeCompare(String(b.at || '')));

  // Ganhos de material, primeiro agrupados por DIA (onde vale o teto diário).
  const days = new Map();            // dia -> { raw, lessons, week }
  const daysByTrack = new Map();     // trilha -> Set(dia)

  for (const l of done) {
    const day = (l.at && dayKey(l.at)) || NO_DATE;
    const week = (l.at && isoWeek(l.at)) || NO_DATE;

    const d = days.get(day) || { raw: SCORING.activeDay, lessons: 0, week };
    d.lessons += 1;
    d.raw += SCORING.lessonDone;
    if (l.acc !== null) d.raw += SCORING.accuracyMax * l.acc;
    days.set(day, d);

    if (l.track && l.at) {
      if (!daysByTrack.has(l.track)) daysByTrack.set(l.track, new Set());
      daysByTrack.get(l.track).add(day);
    }
  }

  // Teto diário → depois agrupa por semana.
  const weeks = new Map();           // semana -> { raw, capped, lessons, days }
  let materialRaw = 0;
  for (const [, d] of days) {
    const dayCapped = Math.min(d.raw, SCORING.materialDailyCap);
    materialRaw += d.raw;
    const w = weeks.get(d.week) || { raw: 0, lessons: 0, days: 0 };
    w.raw += dayCapped;
    w.lessons += d.lessons;
    w.days += 1;
    weeks.set(d.week, w);
  }

  // Teto semanal.
  let materialPoints = 0;
  const byWeek = [...weeks.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([week, w]) => {
      const capped = Math.min(w.raw, SCORING.materialWeeklyCap);
      materialPoints += capped;
      return { week, raw: round1(w.raw), capped: round1(capped), lessons: w.lessons, days: w.days };
    });

  // Bônus de constância: 7 dias seguidos na mesma trilha. Único ganho que passa
  // do teto semanal — ver a nota em SCORING.
  let streaks = 0;
  for (const [, set] of daysByTrack) {
    streaks += countStreaks([...set].sort(), 7);
  }
  const streakPoints = streaks * SCORING.streakBonus;

  materialPoints = round1(materialPoints + streakPoints);
  materialRaw = round1(materialRaw + streakPoints);
  const activeDays = new Set([...days.keys()].filter((d) => d !== NO_DATE));
  const total = round1(classPoints + materialPoints);

  return {
    total,
    classPoints,
    classes: { general, private: priv },
    materialPoints,
    materialRaw,
    capLost: round1(materialRaw - materialPoints),
    lessonsDone: done.length,
    activeDays: activeDays.size,
    streaks,
    streakPoints,
    byWeek,
    split: {
      classPct: total > 0 ? Math.round((classPoints / total) * 100) : 0,
      materialPct: total > 0 ? Math.round((materialPoints / total) * 100) : 0,
    },
    ...tierInfo(total),
  };
}

/** Quantas sequências completas de `len` dias consecutivos existem na lista. */
function countStreaks(sortedDays, len) {
  let best = 0;
  let run = 0;
  let prev = null;
  for (const d of sortedDays) {
    if (prev && (Date.parse(d) - Date.parse(prev)) === 86400000) run += 1;
    else run = 1;
    prev = d;
    if (run >= len) { best += 1; run = 0; prev = null; }
  }
  return best;
}

export function tierInfo(points) {
  let tier = TIERS[0];
  for (const t of TIERS) if (points >= t.min) tier = t;
  const next = TIERS.find((t) => t.min > points) || null;
  return {
    tier,
    nextTier: next,
    toNext: next ? round1(next.min - points) : 0,
    tierProgress: next
      ? Math.round(((points - tier.min) / (next.min - tier.min)) * 100)
      : 100,
  };
}

/**
 * Simulador: projeta o semestre a partir do ritmo que o participante pretende
 * manter. É o que responde "o que eu preciso fazer para chegar em Delivered?".
 */
export function projectSemester({ weeks = SEMESTER.weeks, generalPerWeek = 2, privatePerWeek = 0, lessonsPerWeek = 2 } = {}) {
  const classPoints = weeks * (generalPerWeek * SCORING.classGeneral + privatePerWeek * SCORING.classPrivate);

  // Material: assume a pessoa espalhando as lições em dias diferentes (até 5 por
  // semana). Cada dia sofre o teto diário; a semana sofre o teto semanal.
  const ACC = 0.8;                                   // acerto médio suposto
  const studyDays = Math.min(lessonsPerWeek, 5);
  const perLesson = SCORING.lessonDone + SCORING.accuracyMax * ACC;
  let materialWeek = 0;
  for (let d = 0; d < studyDays; d += 1) {
    // sobras se distribuem nos primeiros dias
    const lessonsToday = Math.floor(lessonsPerWeek / studyDays) + (d < lessonsPerWeek % studyDays ? 1 : 0);
    materialWeek += Math.min(SCORING.activeDay + lessonsToday * perLesson, SCORING.materialDailyCap);
  }
  materialWeek = Math.min(materialWeek, SCORING.materialWeeklyCap);
  const materialPoints = weeks * materialWeek;
  const total = classPoints + materialPoints;
  return {
    total: round1(total),
    classPoints: round1(classPoints),
    materialPoints: round1(materialPoints),
    classPct: total > 0 ? Math.round((classPoints / total) * 100) : 0,
    materialPct: total > 0 ? Math.round((materialPoints / total) * 100) : 0,
    ...tierInfo(total),
  };
}

function round1(n) {
  return Math.round(n * 10) / 10;
}
