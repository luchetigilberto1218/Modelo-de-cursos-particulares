'use client';

import Link from 'next/link';
import { useDoneMap } from './progress';
import Icon from './RacionalIcon';

function pad(n) { return String(n).padStart(3, '0'); }

export default function CurriculumProgress({ course }) {
  const { meta, typeMeta } = course;
  const done = useDoneMap(course.id);
  const tColor = (t) => typeMeta[t]?.color || meta.accent;
  const cols = course.visualMap?.cols || 12;
  const total = course.lessons.length;
  const doneCount = course.lessons.filter((l) => done[l.num]).length;
  const pct = total ? Math.round((doneCount / total) * 100) : 0;
  const hasAnyProgress = doneCount > 0;

  return (
    <>
      {/* DESENHO CURRICULAR + AULAS */}
      <div className="rc-card" id="rc-curriculo" style={{ scrollMarginTop: 80 }}>
        <div className="rc-h">Desenho curricular · aula a aula</div>

        <div className="rc-prog-summary">
          <div className="rc-prog-bar"><div className="rc-prog-fill" style={{ width: `${pct}%` }} /></div>
          <div className="rc-prog-num">{doneCount}/{total} concluídas</div>
        </div>

        {course.modules.map((m, mi) => {
          const lessons = course.lessons.filter((l) => l.mod === m.code);
          const md = lessons.filter((l) => done[l.num]).length;
          return (
            <details key={m.code} className="rc-module" open={mi === 0}>
              <summary>
                <span className="rc-module-code" style={{ background: m.color }}>{m.code}</span>
                <span className="rc-module-name">{m.name}</span>
                <span className="rc-module-count">{m.count} aulas{md > 0 ? <span className="rc-module-prog"> · {md} ✓</span> : null}</span>
                <span className="rc-module-chev">›</span>
              </summary>
              <div className="rc-module-body">
                <p className="rc-module-obj">{m.objective}</p>
                {course.quizzes?.[m.code] && (
                  <Link href={`/racional/${course.id}/prova/${m.code}`} className="rc-prova-btn"><Icon name="target" size={14} /> Quer se testar? · Módulo {m.code.replace('M', '')}</Link>
                )}
                {lessons.map((l) => (
                  <Link key={l.num} href={`/racional/${course.id}/lesson/${l.num}`} className={`rc-lesson-row ${done[l.num] ? 'done' : ''}`}>
                    <span className="rc-lesson-n">{pad(l.num)}</span>
                    <span className="rc-tag" style={{ background: tColor(l.type) }}>{typeMeta[l.type]?.label || l.type}</span>
                    <span className="rc-lesson-title">{l.title}</span>
                    {done[l.num] ? <span className="rc-lesson-done">✓ concluída</span>
                      : l.rich ? <span className="rc-lesson-rich">conteúdo completo</span>
                      : <span className="rc-lesson-soon">ver aula ›</span>}
                  </Link>
                ))}
              </div>
            </details>
          );
        })}
      </div>

      {/* MAPA VISUAL */}
      <div className="rc-card">
        <div className="rc-h">Mapa visual do programa · {meta.totalLessons} aulas</div>
        <div className="rc-map" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {course.lessons.map((l) => {
            const isDone = !!done[l.num];
            const cls = hasAnyProgress ? (isDone ? 'done' : 'todo') : '';
            return (
              <Link
                key={l.num}
                href={`/racional/${course.id}/lesson/${l.num}`}
                className={`rc-map-cell ${cls}`}
                style={{ background: tColor(l.type) }}
                title={`${pad(l.num)} · ${l.title}${isDone ? ' (concluída)' : ''}`}
              >
                {isDone && <span className="rc-map-check">✓</span>}
                <b>{pad(l.num)}</b>
                <span>{l.mod}</span>
              </Link>
            );
          })}
        </div>
        <div className="rc-map-legend">
          {Object.entries(typeMeta).map(([t, v]) => (
            <span key={t}><i style={{ background: v.color }} />{v.label}</span>
          ))}
        </div>
      </div>
    </>
  );
}
