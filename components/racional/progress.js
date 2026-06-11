'use client';

import { useEffect, useState, useCallback } from 'react';

/**
 * Progresso do aluno em localStorage (por navegador, sem backend).
 * Formato: { [studentId]: { [num]: { checks: bool[], done: bool } } }
 * Emite 'rc-progress' no window para sincronizar componentes.
 */
const KEY = 'rc-progress-v1';

function readAll() {
  if (typeof window === 'undefined') return {};
  try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; }
}
function writeAll(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
    window.dispatchEvent(new Event('rc-progress'));
  } catch { /* ignore */ }
}

export function getLesson(studentId, num) {
  const all = readAll();
  return all[studentId]?.[num] || { checks: [], done: false };
}

export function setLessonState(studentId, num, state) {
  const all = readAll();
  all[studentId] = all[studentId] || {};
  all[studentId][num] = { ...all[studentId][num], ...state };
  writeAll(all);
  pushRemote(studentId);
}

/* ---------------------------------------------------------------------------
 * Sincronização OPCIONAL com o servidor (camada aditiva).
 * O localStorage continua sendo a fonte da verdade: tudo aqui é fire-and-forget
 * e qualquer falha (offline, backend fora) é engolida — o material segue igual.
 * ------------------------------------------------------------------------- */
const SYNC_API = '/api/racional/progress';
const pulledOnce = new Set();

// Une o remoto dentro do mapa local de um aluno. Retorna true se algo mudou.
function mergeRemoteInto(local, remote) {
  let changed = false;
  for (const num of Object.keys(remote || {})) {
    const r = remote[num] || {};
    const l = local[num] || { checks: [], done: false };
    const len = Math.max(l.checks?.length || 0, r.checks?.length || 0);
    const checks = Array.from({ length: len }, (_, i) => !!l.checks?.[i] || !!r.checks?.[i]);
    const done = !!l.done || !!r.done;
    const merged = { ...l, checks, done };
    if (JSON.stringify(l) !== JSON.stringify(merged)) { local[num] = merged; changed = true; }
  }
  return changed;
}

// Puxa o progresso do servidor e funde no localStorage (uma vez por aluno por carregamento).
export async function pullRemote(studentId) {
  if (typeof window === 'undefined' || !studentId || pulledOnce.has(studentId)) return;
  pulledOnce.add(studentId);
  try {
    const res = await fetch(`${SYNC_API}?student=${encodeURIComponent(studentId)}`, { cache: 'no-store' });
    if (!res.ok) return;
    const remote = await res.json();
    if (!remote || typeof remote !== 'object') return;
    const all = readAll();
    const local = { ...(all[studentId] || {}) };
    if (mergeRemoteInto(local, remote)) {
      all[studentId] = local;
      writeAll(all); // dispara 'rc-progress' => componentes re-renderizam com o estado fundido
    }
    // Convergência: se este aparelho tem progresso (ex.: marcado antes do sync existir),
    // envia de volta pro servidor — assim conclusões antigas sobem só de abrir a página.
    if (Object.keys(all[studentId] || {}).length) pushRemote(studentId);
  } catch { /* offline / sem backend: segue só no localStorage */ }
}

// Empurra o mapa local do aluno para o servidor (sem bloquear nada).
export function pushRemote(studentId) {
  if (typeof window === 'undefined' || !studentId) return;
  try {
    const all = readAll();
    const map = all[studentId] || {};
    fetch(`${SYNC_API}?student=${encodeURIComponent(studentId)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(map),
      keepalive: true,
    }).catch(() => {});
  } catch { /* ignore */ }
}

/** Mapa { num: true } das aulas concluídas de um aluno. */
export function getDoneMap(studentId) {
  const all = readAll();
  const out = {};
  const s = all[studentId] || {};
  for (const k of Object.keys(s)) if (s[k]?.done) out[k] = true;
  return out;
}

/** Hook reativo: retorna o mapa de concluídas e re-renderiza em mudanças. */
export function useDoneMap(studentId) {
  const [map, setMap] = useState({});
  const refresh = useCallback(() => setMap(getDoneMap(studentId)), [studentId]);
  useEffect(() => {
    refresh();
    pullRemote(studentId);
    const h = () => refresh();
    window.addEventListener('rc-progress', h);
    window.addEventListener('storage', h);
    return () => { window.removeEventListener('rc-progress', h); window.removeEventListener('storage', h); };
  }, [refresh]);
  return map;
}

/** Hook para uma aula: checks + done + setters persistentes. */
export function useLessonProgress(studentId, num, totalChecks) {
  const [state, setState] = useState({ checks: [], done: false });
  useEffect(() => {
    setState(getLesson(studentId, num));
    pullRemote(studentId);
    const h = () => setState(getLesson(studentId, num));
    window.addEventListener('rc-progress', h);
    return () => window.removeEventListener('rc-progress', h);
  }, [studentId, num]);

  const toggle = useCallback((i) => {
    const cur = getLesson(studentId, num);
    const checks = Array.from({ length: totalChecks }, (_, k) => !!cur.checks?.[k]);
    checks[i] = !checks[i];
    const done = checks.every(Boolean) && checks.length === totalChecks;
    setLessonState(studentId, num, { checks, done });
  }, [studentId, num, totalChecks]);

  return { checks: state.checks || [], done: !!state.done, toggle };
}
