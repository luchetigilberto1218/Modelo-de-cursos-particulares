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
            {course.meta.totalLessons} lessons &middot; {course.meta.totalModules} modules &middot; Full audio &middot; Interactive vocabulary
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
              <span className="hero-stat-num">480</span>
              <span className="hero-stat-label">Exercises</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-num">3</span>
              <span className="hero-stat-label">Focus Areas</span>
              <span style={{ display: 'block', marginTop: 6, fontSize: 11, opacity: 0.5, lineHeight: 1.5 }}>
                Hospitality<br />Port Technical<br />Communication
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="page-container">
        {/* Module nav */}
        <div className="module-nav">
          {course.modules.map((m, i) => (
            <button
              key={i}
              className={`module-btn${i === activeModule ? ' active' : ''}`}
              onClick={() => setActiveModule(i)}
            >
              {m.name.replace(/^Module \d+ — /, 'M' + (i + 1) + ' ')}
            </button>
          ))}
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
          {moduleLessons.map((lesson) => (
            <Link
              key={lesson.num}
              href={`/${clientId}/lesson/${lesson.num}`}
              className="lesson-card"
            >
              <div className="lesson-card-top">
                <div className="lesson-num">{String(lesson.num).padStart(2, '0')}</div>
                <div>
                  <div className="lesson-title">{lesson.title}</div>
                  <span className="lesson-focus">{lesson.focus}</span>
                </div>
              </div>
              <div className="lesson-card-bottom">
                <span className="lesson-grammar">{lesson.grammar}</span>
                <span className="btn-text">Open</span>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Link href={`/${clientId}/grammar`} className="btn btn-outline">Grammar Reference</Link>
        </div>

        <div style={{ height: 80 }} />
      </div>
    </>
  );
}
