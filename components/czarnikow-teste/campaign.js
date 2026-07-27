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

export const SCORING = {
  classPrivate: 10,      // aula particular (por aula, sem teto)
  classGeneral: 7,       // aula em turma (por aula, sem teto)
  lessonDone: 5,         // lição concluída
  accuracyMax: 2,        // 2 × % de acerto na 1ª tentativa (0 a 2 pts)
  activeDay: 5,          // dia com estudo válido — no máximo 1 por dia
  streakBonus: 5,        // 7 dias seguidos estudando na mesma trilha
  materialWeeklyCap: 9,  // TETO do material por semana (anti-gaming)
};

/* Faixas calibradas pela projeção do semestre:
   quem cumpre a política da CZ (2 aulas/semana) + material constante fecha o
   semestre por volta de 460 pts = Business Fluent. Advisor exige ir além —
   aulas extras ou particulares. */
export const TIERS = [
  { id: 'foundation',  name: 'Foundation',           min: 0,   desc: 'Começando o programa.' },
  { id: 'working',     name: 'Working Proficiency',  min: 180, desc: 'Ritmo constante de aula e estudo.' },
  { id: 'business',    name: 'Business Fluent',      min: 360, desc: 'Cumpriu a política de 2 aulas por semana.' },
  { id: 'advisor',     name: 'Advisor',              min: 540, desc: 'Foi além: aulas extras ou particulares.' },
];

/* Badges de competência por trilha. Bronze na metade, full na trilha inteira. */
export const TRACK_BADGES = {
  'hr':                     'People Partner',
  'general-business':       'Meeting Fluent',
  'trade-finance':          'Trade Confident',
  'information-technology': 'Tech Ready',
  'fiscal-taxes':           'Compliance Aware',
  'accounting':             'Numbers Fluent',
  'logistics':              'Ops Fluent',
  'supply-chain':           'Chain Fluent',
  'uk-england':             'Culture Ready',
};

export const TRACK_BADGE_HALF = 10;   // lições para o badge bronze
export const TRACK_BADGE_FULL = 20;   // lições para o badge completo

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

  // Ganhos brutos de material, agrupados por semana.
  const weeks = new Map();           // week -> { raw, lessons }
  const activeDays = new Set();
  const daysByTrack = new Map();     // track -> Set(dia)

  const bump = (week, pts) => {
    const w = weeks.get(week) || { raw: 0, lessons: 0 };
    w.raw += pts;
    weeks.set(week, w);
  };

  for (const l of done) {
    const week = (l.at && isoWeek(l.at)) || NO_DATE;
    const w = weeks.get(week) || { raw: 0, lessons: 0 };
    w.lessons += 1;
    weeks.set(week, w);

    bump(week, SCORING.lessonDone);
    if (l.acc !== null) bump(week, SCORING.accuracyMax * l.acc);

    const day = l.at ? dayKey(l.at) : null;
    if (day) {
      if (!activeDays.has(day)) {
        activeDays.add(day);
        bump(week, SCORING.activeDay);   // sessão válida: 1 por dia
      }
      if (l.track) {
        if (!daysByTrack.has(l.track)) daysByTrack.set(l.track, new Set());
        daysByTrack.get(l.track).add(day);
      }
    }
  }

  // Bônus de constância: 7 dias seguidos de estudo na mesma trilha.
  let streaks = 0;
  for (const [, days] of daysByTrack) {
    streaks += countStreaks([...days].sort(), 7);
  }
  if (streaks > 0) {
    // O bônus cai na semana mais recente com atividade.
    const last = [...weeks.keys()].sort().pop();
    if (last) bump(last, streaks * SCORING.streakBonus);
  }

  // Aplica o teto semanal.
  let materialPoints = 0;
  let materialRaw = 0;
  const byWeek = [...weeks.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([week, w]) => {
      const capped = Math.min(w.raw, SCORING.materialWeeklyCap);
      materialRaw += w.raw;
      materialPoints += capped;
      return { week, raw: round1(w.raw), capped: round1(capped), lessons: w.lessons };
    });

  materialPoints = round1(materialPoints);
  materialRaw = round1(materialRaw);
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

/** Badges conquistados, a partir das lições concluídas por trilha. */
export function badgesFor({ lessons = [], state = {} } = {}) {
  const perTrack = new Map();
  const trackOf = new Map(lessons.map((l) => [String(l.num), l.track]));
  for (const num of Object.keys(state)) {
    if (!state[num]?.done) continue;
    const t = trackOf.get(String(num));
    if (!t) continue;
    perTrack.set(t, (perTrack.get(t) || 0) + 1);
  }
  const out = [];
  for (const [track, name] of Object.entries(TRACK_BADGES)) {
    const n = perTrack.get(track) || 0;
    out.push({
      track,
      name,
      count: n,
      level: n >= TRACK_BADGE_FULL ? 'full' : n >= TRACK_BADGE_HALF ? 'half' : null,
      next: n >= TRACK_BADGE_FULL ? null : (n >= TRACK_BADGE_HALF ? TRACK_BADGE_FULL : TRACK_BADGE_HALF),
    });
  }
  out.sort((a, b) => b.count - a.count);
  return out;
}

/**
 * Simulador: projeta o semestre a partir do ritmo que o participante pretende
 * manter. É o que responde "o que eu preciso fazer para chegar em Advisor?".
 */
export function projectSemester({ weeks = SEMESTER.weeks, generalPerWeek = 2, privatePerWeek = 0, lessonsPerWeek = 2 } = {}) {
  const classPoints = weeks * (generalPerWeek * SCORING.classGeneral + privatePerWeek * SCORING.classPrivate);
  // material da semana: lições × (5 + até 2 de acerto) + 5 por dia ativo,
  // tudo limitado pelo teto semanal.
  const rawWeek = lessonsPerWeek * (SCORING.lessonDone + SCORING.accuracyMax) + Math.min(lessonsPerWeek, 3) * SCORING.activeDay;
  const materialWeek = Math.min(rawWeek, SCORING.materialWeeklyCap);
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
