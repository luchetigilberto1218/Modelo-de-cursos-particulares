'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function CourseDashboard({ course, theme, clientId }) {
  const [activeModule, setActiveModule] = useState(0);

  const mod = course.modules[activeModule];
  const moduleLessons = course.lessons.slice(mod.range[0], mod.range[1]);

  return (
    <>
      {/* Hero */}
      <div className="hero">
        <div className="hero-bg" style={{ backgroundImage: `url(${theme?.heroImage || ''})` }} />
        <div className="hero-content">
          <div className="hero-badge">{course.meta.clientName}</div>
          <h1>{course.meta.title}</h1>
          <p className="hero-sub">
            {course.meta.totalLessons} lessons &middot; {course.meta.totalModules} modules &middot; {course.meta.fieldLessons || 6} field lessons no Complexo Cultural &middot; gravação de voz com correção
          </p>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-num">{course.meta.totalLessons}</span>
              <span className="hero-stat-label">Lessons</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-num">{course.meta.totalModules}</span>
              <span className="hero-stat-label">Modules</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-num">{course.meta.fieldLessons || 6}</span>
              <span className="hero-stat-label">Field lessons</span>
              <span style={{ display: 'block', marginTop: 6, fontSize: 10, opacity: 0.55, lineHeight: 1.4 }}>
                Aulas práticas<br />no Complexo<br />Cultural
              </span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-num">A1</span>
              <span className="hero-stat-label">Starter level</span>
              <span style={{ display: 'block', marginTop: 6, fontSize: 10, opacity: 0.55, lineHeight: 1.4 }}>
                Para quem está<br />começando<br />do zero
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="page-container">
        {/* Module nav */}
        <div className="module-nav">
          {course.modules.map((m, i) => {
            const label = m.name.replace(/^Module (\d+) — /, 'Módulo $1 · ');
            return (
              <button
                key={i}
                className={`module-btn${i === activeModule ? ' active' : ''}`}
                onClick={() => setActiveModule(i)}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Module header */}
        <div style={{
          background: 'var(--navy)',
          color: 'var(--white)',
          borderRadius: 16,
          padding: '28px 32px',
          marginBottom: 20,
          position: 'relative',
          overflow: 'hidden'
        }}>
          <span style={{
            position: 'absolute', right: 32, top: '50%', transform: 'translateY(-50%)',
            fontSize: 64, fontWeight: 900, opacity: 0.06
          }}>{activeModule + 1}</span>
          <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4, position: 'relative', zIndex: 1 }}>{mod.name}</h3>
          <p style={{ opacity: 0.7, fontSize: 14, position: 'relative', zIndex: 1 }}>{mod.desc}</p>
        </div>

        {/* Module image */}
        {mod.img && (
          <img
            src={mod.img}
            alt={mod.name}
            style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 12, marginBottom: 20 }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        )}

        {/* Lesson cards */}
        <div className="lessons-grid">
          {moduleLessons.map((lesson) => {
            const isOutdoor = lesson.type === 'outdoor';
            return (
              <Link
                key={lesson.num}
                href={`/${clientId}/lesson/${lesson.num}`}
                className={`lesson-card${isOutdoor ? ' outdoor' : ''}`}
              >
                {isOutdoor && (
                  <div className="lesson-card-header">
                    <span className="outdoor-badge">Aula outdoor</span>
                  </div>
                )}
                <div className="lesson-card-top">
                  <div className={`lesson-num${isOutdoor ? ' outdoor' : ''}`}>{String(lesson.num).padStart(2, '0')}</div>
                  <div>
                    <div className="lesson-title">{lesson.title}</div>
                    <span className="lesson-focus">
                      {isOutdoor ? `${lesson.focus} · aula prática no Complexo Cultural` : lesson.focus}
                    </span>
                  </div>
                </div>
                <div className="lesson-card-bottom">
                  <span className="lesson-grammar">{lesson.grammar}</span>
                  <span className={`btn-text${isOutdoor ? ' outdoor' : ''}`}>Open</span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Module quiz CTA */}
        <div style={{
          marginTop: 24, padding: 20, borderRadius: 14,
          background: mod.quiz ? 'linear-gradient(135deg, #FFFCF5 0%, #FFF4E0 100%)' : 'var(--off-white)',
          border: mod.quiz ? '1px solid #E8C786' : '1px solid var(--gray-light)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap',
        }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: '#B7791F', marginBottom: 4 }}>
              Final do Módulo {activeModule + 1}
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--navy)' }}>
              {mod.quiz?.title || `Prova do Módulo ${activeModule + 1}`}
            </div>
            <div style={{ fontSize: 13, color: 'var(--gray)', marginTop: 2 }}>
              {mod.quiz
                ? `${mod.quiz.exercises?.length || 0} exercícios — escrita, oral e correção na hora · score 0 a 10`
                : 'Prova ainda não disponível'}
            </div>
          </div>
          {mod.quiz ? (
            <Link
              href={`/${clientId}/quiz/${activeModule + 1}`}
              style={{
                padding: '10px 22px', borderRadius: 980, border: 'none',
                background: '#B7791F', color: 'var(--white)',
                fontWeight: 700, fontSize: 14, textDecoration: 'none', whiteSpace: 'nowrap',
              }}
            >Iniciar prova →</Link>
          ) : (
            <span style={{ fontSize: 12, color: 'var(--gray)' }}>Em breve</span>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Link href={`/${clientId}/grammar`} className="btn btn-outline">Grammar Reference</Link>
        </div>

        <div style={{ height: 80 }} />
      </div>
    </>
  );
}
