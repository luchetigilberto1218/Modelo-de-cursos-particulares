'use client';

import Link from 'next/link';
import { useDoneMap } from './progress';
import Icon from './RacionalIcon';

function pad(n) { return String(n).padStart(3, '0'); }

/** CTA no topo do dashboard: leva direto à próxima aula a estudar. */
export default function ContinueCTA({ studentId, lessons, accent }) {
  const done = useDoneMap(studentId);
  const next = lessons.find((l) => !done[l.num]) || lessons[lessons.length - 1];
  const started = lessons.some((l) => done[l.num]);
  if (!next) return null;

  return (
    <div className="rc-continue">
      <Link href={`/racional/${studentId}/lesson/${next.num}`} className="rc-continue-btn" style={{ background: accent }}>
        <Icon name="chevron" size={18} />
        <span>
          <small>{started ? 'Continuar de onde parei' : 'Começar agora'}</small>
          Aula {pad(next.num)} · {next.title}
        </span>
      </Link>
      <a href="#rc-curriculo" className="rc-continue-link">ver o desenho do curso ↓</a>
    </div>
  );
}
