'use client';

import { useEffect, useState, useCallback } from 'react';

/**
 * Progresso do aluno (Czarnikow · teste). localStorage é a fonte da verdade;
 * o sync com o servidor (Vercel Blob, via /api/czarnikow-teste/progress) é uma
 * camada ADITIVA e tolerante a falha. Espelha components/racional/progress.js.
 *
 * Formato local: { [studentId]: { [num]: { checks: bool[], done: bool } } }
 * O servidor deriva o aluno da sessão logada (o fetch não precisa mandar id).
 */
const KEY = 'czt-progress-v1';
const SYNC_API = '/api/czarnikow-teste/progress';

function readAll() {
  if (typeof window === 'undefined') return {};
  try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; }
}
function writeAll(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
    window.dispatchEvent(new Event('czt-progress'));
  } catch { /* ignore */ }
}

export function getLesson(studentId, num) {
  const all = readAll();
  return all[studentId]?.[num] || { checks: [], done: false };
}

export function setLessonState(studentId, num, state) {
  if (!studentId) return;
  const all = readAll();
  all[studentId] = all[studentId] || {};
  all[studentId][num] = { ...all[studentId][num], ...state };
  writeAll(all);
  pushRemote(studentId);
}

/* -------------------------------------------------------------------------
 * Identidade: descobre quem está logado (uma vez). O componente usa isso como
 * chave do progresso local e para saudar o aluno.
 * ----------------------------------------------------------------------- */
let identityCache = null;
export function useIdentity(enabled = true) {
  const [id, setId] = useState(identityCache);
  useEffect(() => {
    if (!enabled) return;
    if (identityCache) { setId(identityCache); return; }
    let alive = true;
    fetch('/api/czarnikow-teste/me', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (alive && d?.student) { identityCache = d; setId(d); } })
      .catch(() => {});
    return () => { alive = false; };
  }, [enabled]);
  return id; // { student, name, role } | null
}

/* -------------------------------------------------------------------------
 * Sync opcional com o servidor. Fire-and-forget; qualquer falha é engolida.
 * ----------------------------------------------------------------------- */
const pulledOnce = new Set();

/* Declaração "estudei e estou pronto para a aula particular".
   Campos: ready (bool), readyAt (ISO da última vez que o aluno mexeu no botão),
   readyDone/readyTotal (exercícios respondidos no momento da declaração) e
   readyAcc (acerto na 1ª tentativa). Servem para o professor abrir a aula sabendo
   o que o aluno praticou de verdade — nunca mexem no `done` da lição. */
export function newerReady(a, b) {
  const ra = typeof a?.readyAt === 'string' ? a.readyAt : null;
  const rb = typeof b?.readyAt === 'string' ? b.readyAt : null;
  if (!ra && !rb) return null;
  if (!ra) return b;
  if (!rb) return a;
  return ra >= rb ? a : b;
}
export function newerTaught(a, b) {
  const ta = typeof a?.taughtAt === 'string' ? a.taughtAt : null;
  const tb = typeof b?.taughtAt === 'string' ? b.taughtAt : null;
  if (!ta && !tb) return null;
  if (!ta) return b;
  if (!tb) return a;
  return ta >= tb ? a : b;
}
export function taughtFields(src) {
  const out = { taught: !!src.taught, taughtAt: src.taughtAt };
  if (typeof src.taughtBy === 'string') out.taughtBy = src.taughtBy;
  return out;
}
export function readyFields(src) {
  const out = { ready: !!src.ready, readyAt: src.readyAt };
  if (typeof src.readyDone === 'number') out.readyDone = src.readyDone;
  if (typeof src.readyTotal === 'number') out.readyTotal = src.readyTotal;
  if (typeof src.readyAcc === 'number') out.readyAcc = src.readyAcc;
  return out;
}

function mergeRemoteInto(local, remote) {
  let changed = false;
  for (const num of Object.keys(remote || {})) {
    const r = remote[num] || {};
    const l = local[num] || { checks: [], done: false };
    const len = Math.max(l.checks?.length || 0, r.checks?.length || 0);
    const checks = Array.from({ length: len }, (_, i) => !!l.checks?.[i] || !!r.checks?.[i]);
    const done = !!l.done || !!r.done;
    const merged = { ...l, checks, done };
    // campanha: vale sempre o registro mais antigo (ver mergeLessons no store)
    const dates = [l.doneAt, r.doneAt].filter(Boolean).sort();
    if (dates.length) merged.doneAt = dates[0];
    if (typeof merged.acc !== 'number' && typeof r.acc === 'number') merged.acc = r.acc;
    // "pronto para a aula particular": ao contrário de done/checks, NÃO é união —
    // vale a declaração mais recente, porque o aluno pode desmarcar (ver useLessonReady).
    const winner = newerReady(l, r);
    if (winner) Object.assign(merged, readyFields(winner));
    // "aula dada": mesma regra do ready — vale o registro mais recente, porque
    // quem marcou por engano precisa conseguir desfazer.
    const tw = newerTaught(l, r);
    if (tw) Object.assign(merged, taughtFields(tw));
    if (JSON.stringify(l) !== JSON.stringify(merged)) { local[num] = merged; changed = true; }
  }
  return changed;
}

/**
 * Zera o progresso LOCAL deste aluno quando a URL pede (?reset=local).
 * Existe para limpar a máquina de quem validou o material antes de entregar a
 * conta a outra pessoa: o localStorage é a fonte da verdade do cliente e o merge
 * é por união, então sem isso o progresso antigo volta para o servidor no
 * primeiro acesso. Não destrói nada de verdade — logo em seguida o pull traz o
 * que houver no servidor de volta.
 */
function resetLocalIfAsked(studentId) {
  try {
    if (!new URLSearchParams(window.location.search).has('reset')) return;
    if (new URLSearchParams(window.location.search).get('reset') !== 'local') return;
    const all = readAll();
    if (!all[studentId]) return;
    delete all[studentId];
    writeAll(all);
  } catch { /* ignore */ }
}

export async function pullRemote(studentId) {
  if (typeof window === 'undefined' || !studentId || pulledOnce.has(studentId)) return;
  pulledOnce.add(studentId);
  resetLocalIfAsked(studentId);
  try {
    const res = await fetch(SYNC_API, { cache: 'no-store' });
    if (!res.ok) return;
    const remote = await res.json();
    if (!remote || typeof remote !== 'object') return;
    const all = readAll();
    const local = { ...(all[studentId] || {}) };
    if (mergeRemoteInto(local, remote)) {
      all[studentId] = local;
      writeAll(all);
    }
    if (Object.keys(all[studentId] || {}).length) pushRemote(studentId);
  } catch { /* offline / sem backend: segue só no localStorage */ }
}

export function pushRemote(studentId) {
  if (typeof window === 'undefined' || !studentId) return;
  try {
    const all = readAll();
    const map = all[studentId] || {};
    fetch(SYNC_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(map),
      keepalive: true,
    }).catch(() => {});
  } catch { /* ignore */ }
}

/** Mapa { num: true } das lições concluídas de um aluno. */
export function getDoneMap(studentId) {
  const all = readAll();
  const out = {};
  const s = all[studentId] || {};
  for (const k of Object.keys(s)) if (s[k]?.done) out[k] = true;
  return out;
}

/** Mapa { num: true } das unidades cuja AULA já foi dada.
 *  Separado do de concluídas de propósito: uma unidade pode ter aula dada sem
 *  ter sido estudada (o professor fez os exercícios junto na aula, ou o aluno
 *  declarou-se pronto sem praticar). O ponteiro da trilha anda com os dois
 *  juntos; a campanha continua olhando só `done`. */
export function getTaughtMap(studentId) {
  const all = readAll();
  const out = {};
  const s = all[studentId] || {};
  for (const k of Object.keys(s)) if (s[k]?.taught) out[k] = true;
  return out;
}

/** Hook reativo: mapa de aulas dadas. */
export function useTaughtMap(studentId) {
  const [map, setMap] = useState({});
  const refresh = useCallback(() => setMap(getTaughtMap(studentId)), [studentId]);
  useEffect(() => {
    if (!studentId) return;
    refresh();
    pullRemote(studentId);
    const h = () => refresh();
    window.addEventListener('czt-progress', h);
    window.addEventListener('storage', h);
    return () => { window.removeEventListener('czt-progress', h); window.removeEventListener('storage', h); };
  }, [refresh, studentId]);
  return map;
}

/** Hook reativo: mapa de concluídas, re-renderiza em mudanças. */
export function useDoneMap(studentId) {
  const [map, setMap] = useState({});
  const refresh = useCallback(() => setMap(getDoneMap(studentId)), [studentId]);
  useEffect(() => {
    if (!studentId) return;
    refresh();
    pullRemote(studentId);
    const h = () => refresh();
    window.addEventListener('czt-progress', h);
    window.addEventListener('storage', h);
    return () => { window.removeEventListener('czt-progress', h); window.removeEventListener('storage', h); };
  }, [refresh, studentId]);
  return map;
}

/** Hook para uma lição: done + setter persistente. */
export function useLessonDone(studentId, num) {
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!studentId) return;
    setDone(!!getLesson(studentId, num).done);
    pullRemote(studentId);
    const h = () => setDone(!!getLesson(studentId, num).done);
    window.addEventListener('czt-progress', h);
    return () => window.removeEventListener('czt-progress', h);
  }, [studentId, num]);

  // `acc` = acerto médio na 1ª tentativa (0..1), usado pela campanha. Data e acerto
  // só são gravados na PRIMEIRA conclusão — refazer a lição não reescreve nenhum dos dois.
  const markDone = useCallback((acc) => {
    if (!studentId) return;
    const cur = getLesson(studentId, num);
    const state = { done: true };
    if (!cur.doneAt) state.doneAt = new Date().toISOString();
    if (typeof cur.acc !== 'number' && typeof acc === 'number') state.acc = Math.min(1, Math.max(0, acc));
    setLessonState(studentId, num, state);
  }, [studentId, num]);

  const markUndone = useCallback(() => {
    if (!studentId) return;
    setLessonState(studentId, num, { done: false });
  }, [studentId, num]);

  return { done, markDone, markUndone };
}

/**
 * Hook da declaração "estudei a unidade e estou pronto para a aula particular".
 *
 * É um sinal SEPARADO da conclusão: marcar aqui não acende a lição nem dá ponto
 * na campanha — só avisa o professor, levando junto a evidência do que foi feito
 * (exercícios respondidos e acerto). Assim o botão nunca vira atalho para pular
 * a prática: quem declara sem praticar aparece no painel exatamente assim.
 *
 * Retorna o estado da lição inteiro (done/acc/ready…) + os dois setters.
 */
export function useLessonReady(studentId, num) {
  const [state, setState] = useState({});
  useEffect(() => {
    if (!studentId) return;
    const read = () => setState(getLesson(studentId, num) || {});
    read();
    pullRemote(studentId);
    const h = () => read();
    window.addEventListener('czt-progress', h);
    return () => window.removeEventListener('czt-progress', h);
  }, [studentId, num]);

  // `evidence` = { answered, total, acc } no instante da declaração. Regravado a
  // cada vez que o aluno marca, porque o que vale para o professor é a última.
  const markReady = useCallback((evidence) => {
    if (!studentId) return;
    const patch = { ready: true, readyAt: new Date().toISOString() };
    if (typeof evidence?.answered === 'number') patch.readyDone = evidence.answered;
    if (typeof evidence?.total === 'number') patch.readyTotal = evidence.total;
    if (typeof evidence?.acc === 'number') patch.readyAcc = Math.min(1, Math.max(0, evidence.acc));
    setLessonState(studentId, num, patch);
  }, [studentId, num]);

  const markUnready = useCallback(() => {
    if (!studentId) return;
    setLessonState(studentId, num, { ready: false, readyAt: new Date().toISOString() });
  }, [studentId, num]);

  return { ...state, markReady, markUnready };
}

/** Hook de uma unidade: "a aula particular desta unidade já aconteceu".
 *  Encerra a unidade para todo mundo — sai da fila do professor e o ponteiro da
 *  trilha do aluno anda. NÃO marca `done` e NÃO pontua material: quem não
 *  estudou continua sem ponto de material, mas a aula não se repete. */
export function useLessonTaught(studentId, num) {
  const [state, setState] = useState({});
  useEffect(() => {
    if (!studentId) return;
    const read = () => setState(getLesson(studentId, num) || {});
    read();
    pullRemote(studentId);
    const h = () => read();
    window.addEventListener('czt-progress', h);
    return () => window.removeEventListener('czt-progress', h);
  }, [studentId, num]);

  // `by` = 'student' | 'teacher', só para o painel saber quem encerrou.
  const markTaught = useCallback((by) => {
    if (!studentId) return;
    const patch = { taught: true, taughtAt: new Date().toISOString() };
    if (by === 'student' || by === 'teacher') patch.taughtBy = by;
    setLessonState(studentId, num, patch);
  }, [studentId, num]);

  const markUntaught = useCallback(() => {
    if (!studentId) return;
    setLessonState(studentId, num, { taught: false, taughtAt: new Date().toISOString() });
  }, [studentId, num]);

  return { ...state, markTaught, markUntaught };
}

/* -------------------------------------------------------------------------
 * Campanha Ago–Dez: pontuação + posição, calculadas no servidor (a posição
 * precisa ver todo mundo, mas nada de terceiros volta para o cliente).
 * Recarrega quando o progresso local muda.
 * ----------------------------------------------------------------------- */
export function useCampaign(enabled = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(enabled);

  const load = useCallback(() => {
    if (!enabled) return;
    fetch('/api/czarnikow-teste/campaign', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (d) setData(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    load();
    // dá tempo do push chegar ao Blob antes de recalcular
    let t;
    const h = () => { clearTimeout(t); t = setTimeout(load, 1200); };
    window.addEventListener('czt-progress', h);
    return () => { clearTimeout(t); window.removeEventListener('czt-progress', h); };
  }, [enabled, load]);

  return { data, loading, reload: load };
}
