'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { RacionalTopBar, RacionalFooter } from './RacionalChrome';
import { useTeacher, useStudentUnlocked, setStudentUnlocked } from './access';

/**
 * Porta de acesso por aluno. Cada aluno tem uma senha individual; o modo
 * professor (senha de professor) libera o material de qualquer aluno sem
 * a senha individual. O desbloqueio fica em localStorage.
 */
export default function StudentGate({ studentId, password, studentName, accent = '#102A71', children }) {
  const teacher = useTeacher();
  const unlocked = useStudentUnlocked(studentId);
  const [ready, setReady] = useState(false);
  const [code, setCode] = useState('');
  const [err, setErr] = useState(false);

  useEffect(() => { setReady(true); }, []);

  const allowed = teacher || unlocked;

  // Evita flash do formulário antes de ler o localStorage.
  if (!ready) {
    return <div style={{ minHeight: '60vh' }} />;
  }

  if (allowed) return children;

  function submit(e) {
    e.preventDefault();
    if (code.trim() === password) { setStudentUnlocked(studentId, true); setErr(false); }
    else setErr(true);
  }

  const first = (studentName || '').split(' ')[0] || 'aluno';

  return (
    <>
      <RacionalTopBar />
      <div className="rc-wrap" style={{ padding: '64px 24px' }}>
        <div className="rc-card" style={{ maxWidth: 440, margin: '0 auto' }}>
          <div className="rc-h">Acesso ao programa de {first}</div>
          <p className="rc-prose" style={{ marginBottom: 16 }}>
            Informe a sua senha pessoal para abrir o seu material. Ela é individual — cada aluno tem a sua.
          </p>
          <form onSubmit={submit}>
            <input
              className="rc-search"
              type="password"
              placeholder="Sua senha"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              autoFocus
            />
            {err && <p style={{ color: '#CB142D', fontSize: 13, margin: '10px 0 0' }}>Senha incorreta.</p>}
            <button className="rc-btn rc-btn-primary" type="submit" style={{ marginTop: 16, width: '100%', background: accent }}>Entrar</button>
          </form>
          <div style={{ marginTop: 16, fontSize: 13 }}>
            <Link href="/racional" className="rc-continue-link" style={{ color: 'var(--rc-mute)', borderColor: 'var(--rc-line)' }}>← voltar à lista de alunos</Link>
          </div>
        </div>
      </div>
      <RacionalFooter />
    </>
  );
}
