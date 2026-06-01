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
