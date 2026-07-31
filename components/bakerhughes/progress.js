'use client';

import { useEffect, useState, useCallback } from 'react';

/**
 * Progresso do aluno (Baker Hughes). localStorage é a fonte da verdade; o sync
 * com o servidor (Vercel Blob, via /api/bakerhughes/progress) é uma camada
 * ADITIVA e tolerante a falha. Espelha components/czarnikow-teste/progress.js,
 * sem a parte de campanha.
 *
 * Formato local: { [studentId]: { [num]: { done: bool, doneAt: iso } } }
 * O servidor deriva o aluno da sessão logada (o fetch não manda id).
 */
const KEY = 'bh-progress-v1';
const SYNC_API = '/api/bakerhughes/progress';
const EVENT = 'bh-progress';

function readAll() {
  if (typeof window === 'undefined') return {};
  try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; }
}
function writeAll(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
    window.dispatchEvent(new Event(EVENT));
  } catch { /* ignore */ }
}

export function getLesson(studentId, num) {
  const all = readAll();
  return all[studentId]?.[num] || { done: false };
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
 * Identidade: descobre quem está logado (uma vez por sessão de navegador).
 * ----------------------------------------------------------------------- */
let identityCache = null;
export function useIdentity(enabled = true) {
  const [id, setId] = useState(identityCache);
  useEffect(() => {
    if (!enabled) return;
    if (identityCache) { setId(identityCache); return; }
    let alive = true;
    fetch('/api/bakerhughes/me', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (alive && d?.student) { identityCache = d; setId(d); } })
      .catch(() => {});
    return () => { alive = false; };
  }, [enabled]);
  return id; // { student, name, role } | null
}

/* -------------------------------------------------------------------------
 * Sync com o servidor. Fire-and-forget; qualquer falha é engolida.
 * ----------------------------------------------------------------------- */
const pulledOnce = new Set();

function mergeRemoteInto(local, remote) {
  let changed = false;
  for (const num of Object.keys(remote || {})) {
    const r = remote[num] || {};
    const l = local[num] || { done: false };
    const merged = { ...l, done: !!l.done || !!r.done };
    const dates = [l.doneAt, r.doneAt].filter(Boolean).sort();
    if (dates.length) merged.doneAt = dates[0];
    if (JSON.stringify(l) !== JSON.stringify(merged)) { local[num] = merged; changed = true; }
  }
  return changed;
}

/**
 * Zera o progresso LOCAL deste aluno quando a URL pede (?reset=local).
 * Serve para limpar a máquina de quem validou o material antes de entregar a
 * conta a outra pessoa: como o merge é por união, sem isso o progresso antigo
 * voltaria para o servidor no primeiro acesso.
 */
function resetLocalIfAsked(studentId) {
  try {
    const q = new URLSearchParams(window.location.search);
    if (q.get('reset') !== 'local') return;
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
    fetch(SYNC_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(all[studentId] || {}),
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

/** Hook reativo: mapa de concluídas, re-renderiza em mudanças. */
export function useDoneMap(studentId) {
  const [map, setMap] = useState({});
  const refresh = useCallback(() => setMap(getDoneMap(studentId)), [studentId]);
  useEffect(() => {
    if (!studentId) return;
    refresh();
    pullRemote(studentId);
    const h = () => refresh();
    window.addEventListener(EVENT, h);
    window.addEventListener('storage', h);
    return () => { window.removeEventListener(EVENT, h); window.removeEventListener('storage', h); };
  }, [refresh, studentId]);
  return map;
}

/** Hook para uma lição: done + marcar como concluída (idempotente). */
export function useLessonDone(studentId, num) {
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!studentId) return;
    setDone(!!getLesson(studentId, num).done);
    pullRemote(studentId);
    const h = () => setDone(!!getLesson(studentId, num).done);
    window.addEventListener(EVENT, h);
    return () => window.removeEventListener(EVENT, h);
  }, [studentId, num]);

  // A data só é gravada na PRIMEIRA conclusão — refazer a lição não a reescreve.
  const markDone = useCallback(() => {
    if (!studentId) return;
    const cur = getLesson(studentId, num);
    if (cur.done && cur.doneAt) return;
    const state = { done: true };
    if (!cur.doneAt) state.doneAt = new Date().toISOString();
    setLessonState(studentId, num, state);
  }, [studentId, num]);

  return { done, markDone };
}
