'use client';

import { useEffect, useState } from 'react';

/** Modo professor (libera o teacher's guide). Guardado em localStorage. */
const KEY = 'rc-teacher-v1';
/** Alunos desbloqueados por senha individual. Map { [studentId]: true }. */
const STUDENT_KEY = 'rc-student-v1';

function readStudents() {
  if (typeof window === 'undefined') return {};
  try { return JSON.parse(localStorage.getItem(STUDENT_KEY) || '{}'); } catch { return {}; }
}
export function isStudentUnlocked(id) {
  return !!readStudents()[id];
}
export function setStudentUnlocked(id, on) {
  try {
    const all = readStudents();
    if (on) all[id] = true; else delete all[id];
    localStorage.setItem(STUDENT_KEY, JSON.stringify(all));
    window.dispatchEvent(new Event('rc-student'));
  } catch { /* ignore */ }
}
export function useStudentUnlocked(id) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const refresh = () => setOn(isStudentUnlocked(id));
    refresh();
    window.addEventListener('rc-student', refresh);
    window.addEventListener('storage', refresh);
    return () => { window.removeEventListener('rc-student', refresh); window.removeEventListener('storage', refresh); };
  }, [id]);
  return on;
}

export function isTeacher() {
  if (typeof window === 'undefined') return false;
  try { return localStorage.getItem(KEY) === '1'; } catch { return false; }
}
export function setTeacher(on) {
  try {
    if (on) localStorage.setItem(KEY, '1'); else localStorage.removeItem(KEY);
    window.dispatchEvent(new Event('rc-teacher'));
  } catch { /* ignore */ }
}

export function useTeacher() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    setOn(isTeacher());
    const h = () => setOn(isTeacher());
    window.addEventListener('rc-teacher', h);
    window.addEventListener('storage', h);
    return () => { window.removeEventListener('rc-teacher', h); window.removeEventListener('storage', h); };
  }, []);
  return on;
}
