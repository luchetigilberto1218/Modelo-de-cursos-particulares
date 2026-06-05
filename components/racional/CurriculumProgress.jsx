'use client';

import Link from 'next/link';
import { useDoneMap } from './progress';
import Icon from './RacionalIcon';

function pad(n) { return String(n).padStart(3, '0'); }

export default function CurriculumProgress({ course }) {
  const { meta, typeMeta } = course;
  const done = useDoneMap(course.id);
  const tColor = (t) => typeMeta[t]?.color || meta.accent;
  const total = course.lessons.length;
  const doneCount = course.lessons.filter((l) => done[l.num]).length;
  const pct = total ? Math.round((doneCount / total) * 100) : 0;

  return (
    <>
      {/* DESENHO CURRICULAR + AULAS */}
      <div className="rc-card" id="rc-curriculo" style={{ scrollMarginTop: 80 }}>
        <div className="rc-h">Desenho curricular · aula a aula</div>

        <div className="rc-prog-summary">
          <div className="rc-prog-bar"><div className="rc-prog-fill" style={{ width: `${pct}%` }} /></div>
          <div className="rc-prog-num">{doneCount}/{total} concluídas</div>
        </div>

        {/* Lista SEQUENCIAL (aula a aula, na ordem a seguir) — não agrupada por módulo,
            pois os módulos são intercalados e isso esconderia a ordem correta. */}
        <p className="rc-mini-label" style={{ marginBottom: 10 }}>Siga as aulas nesta ordem. O selo indica a que módulo cada aula pertence.</p>
        <div className="rc-seq-list">
          {course.lessons.map((l) => {
            const m = course.modules.find((mm) => mm.code === l.mod);
            return (
              <Link key={l.num} href={`/racional/${course.id}/lesson/${l.num}`} className={`rc-lesson-row ${done[l.num] ? 'done' : ''}`}>
                <span className="rc-lesson-n">{pad(l.num)}</span>
                <span className="rc-tag" style={{ background: tColor(l.type) }}>{typeMeta[l.type]?.label || l.type}</span>
                {m && <span title={m.name} style={{ fontSize: 10, fontWeight: 700, color: m.color, border: `1px solid ${m.color}`, borderRadius: 4, padding: '1px 5px', whiteSpace: 'nowrap' }}>{m.code}</span>}
                <span className="rc-lesson-title">{l.title}</span>
                {done[l.num] ? <span className="rc-lesson-done">✓ aula concluída</span>
                  : l.rich ? <span className="rc-lesson-rich">acessar aula {l.num} ›</span>
                  : <span className="rc-lesson-soon">ver aula ›</span>}
              </Link>
            );
          })}
        </div>

        {course.modules.some((m) => course.quizzes?.[m.code]) && (
          <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--rc-mute, #8892A4)' }}>Provas de módulo:</span>
            {course.modules.filter((m) => course.quizzes?.[m.code]).map((m) => (
              <Link key={m.code} href={`/racional/${course.id}/prova/${m.code}`} className="rc-prova-btn"><Icon name="target" size={13} /> Módulo {m.code.replace('M', '')}</Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
