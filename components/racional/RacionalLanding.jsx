import Link from 'next/link';
import { RacionalTopBar, RacionalFooter } from './RacionalChrome';

function initials(name) {
  const parts = (name || '').split(' ').filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function RacionalLanding({ index }) {
  const { brand, students } = index;
  return (
    <>
      <RacionalTopBar />

      {/* HERO */}
      <section className="rc-hero">
        <div className="rc-hero-bg" style={{ backgroundImage: `url(${brand.hero})` }} />
        <div className="rc-hero-inner rc-wrap">
          <span className="rc-eyebrow">{brand.client} × {brand.school}</span>
          <h1>{brand.program}</h1>
          <p>{brand.tagline} Um programa por executivo — desenho curricular individual, fiel ao plano de estudos de cada aluno.</p>
          <div className="rc-hero-accent" />
        </div>
      </section>

      {/* ALUNOS */}
      <section className="rc-section">
        <div className="rc-wrap">
          <div className="rc-section-head">
            <h2>Escolha o seu programa</h2>
            <p>Cada executivo tem um percurso próprio, desenhado a partir da sua entrevista de levantamento.</p>
          </div>

          <div className="rc-student-grid">
            {students.map((s) => (
              <Link key={s.id} href={`/racional/${s.id}`} className="rc-student-card">
                <div className="rc-student-stripe" style={{ background: s.accent }} />
                <div className="rc-student-body">
                  <div className="rc-student-top">
                    <div className="rc-avatar" style={{ background: s.accent }}>{initials(s.studentName)}</div>
                    <div>
                      <div className="rc-student-name">{s.studentName}</div>
                      <div className="rc-student-role">{s.role} · <span className="rc-card-level">{s.cefr} · Essential {s.essential}</span></div>
                    </div>
                  </div>
                  <div className="rc-student-universe">{s.universe}</div>
                  <div className="rc-student-meta">
                    <div className="rc-student-stat"><b>{s.totalLessons}</b><span>Aulas</span></div>
                    <div className="rc-student-stat"><b>{s.totalModules}</b><span>Módulos</span></div>
                    <span className="rc-student-cta">Abrir programa</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <RacionalFooter />
    </>
  );
}
