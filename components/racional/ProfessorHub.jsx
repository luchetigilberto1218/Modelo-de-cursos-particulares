'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { RacionalTopBar, RacionalFooter } from './RacionalChrome';
import { useTeacher, setTeacher } from './access';

function initials(name) {
  const p = (name || '').split(' ').filter(Boolean);
  return p.length === 1 ? p[0].slice(0, 2).toUpperCase() : (p[0][0] + p[p.length - 1][0]).toUpperCase();
}

export default function ProfessorHub({ students, professorCode }) {
  const teacher = useTeacher();
  const router = useRouter();
  const [code, setCode] = useState('');
  const [err, setErr] = useState(false);

  function exitTeacher() {
    setTeacher(false);
    router.push('/racional');
  }

  function submit(e) {
    e.preventDefault();
    if (code.trim() === professorCode) { setTeacher(true); setErr(false); }
    else setErr(true);
  }

  return (
    <>
      <RacionalTopBar showHome />
      <section className="rc-hero" style={{ padding: '60px 0 52px' }}>
        <div className="rc-hero-bg" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1600&q=80)' }} />
        <div className="rc-hero-inner rc-wrap">
          <span className="rc-eyebrow">Área do Professor</span>
          <h1>Painel docente</h1>
          <p>Guias de aula (Teacher's Guide), acesso a todos os programas e visão geral das turmas.</p>
          <div className="rc-hero-accent" />
        </div>
      </section>

      <div className="rc-wrap" style={{ padding: '40px 24px' }}>
        {!teacher ? (
          <div className="rc-card" style={{ maxWidth: 460, margin: '0 auto' }}>
            <div className="rc-h">Entrar como professor</div>
            <p className="rc-prose" style={{ marginBottom: 16 }}>Informe o código de professor para liberar o Teacher's Guide em todas as aulas.</p>
            <form onSubmit={submit}>
              <input className="rc-search" type="password" placeholder="Código de professor" value={code} onChange={(e) => setCode(e.target.value)} />
              {err && <p style={{ color: '#CB142D', fontSize: 13, margin: '10px 0 0' }}>Código incorreto.</p>}
              <button className="rc-btn rc-btn-primary" type="submit" style={{ marginTop: 16, width: '100%' }}>Entrar</button>
            </form>
          </div>
        ) : (
          <>
            <div className="rc-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div><span className="rc-teacher-tag">MODO PROFESSOR ATIVO</span> <span style={{ fontSize: 14, color: 'var(--rc-mute)' }}>O Teacher's Guide aparece no topo de cada aula.</span></div>
              <button className="rc-btn rc-btn-outline" onClick={exitTeacher}>Sair do modo professor</button>
            </div>
            <div className="rc-section-head" style={{ marginTop: 18 }}><h2>Programas dos alunos</h2></div>
            <div className="rc-student-grid">
              {students.map((s) => (
                <Link key={s.id} href={`/racional/${s.id}`} className="rc-student-card">
                  <div className="rc-student-stripe" style={{ background: s.accent }} />
                  <div className="rc-student-body">
                    <div className="rc-student-top">
                      <div className="rc-avatar" style={{ background: s.accent }}>{initials(s.studentName)}</div>
                      <div>
                        <div className="rc-student-name">{s.studentName}</div>
                        <div className="rc-student-role">{s.role} · {s.cefr}</div>
                      </div>
                    </div>
                    <div className="rc-student-universe">{s.universe}</div>
                    <div className="rc-student-meta">
                      <div className="rc-student-stat"><b>{s.totalLessons}</b><span>Aulas</span></div>
                      <div className="rc-student-stat"><b>Essential {s.essential}</b><span>Nível</span></div>
                      <span className="rc-student-cta">Abrir</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
      <RacionalFooter />
    </>
  );
}
