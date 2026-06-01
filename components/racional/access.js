'use client';

import { useEffect, useState } from 'react';

/** Modo professor (libera o teacher's guide). Guardado em localStorage. */
const KEY = 'rc-teacher-v1';

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
