'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { RacionalTopBar, RacionalFooter } from './RacionalChrome';
import AudioPlayer from '../AudioPlayer';
import Icon from './RacionalIcon';

const VOICE_BY_STUDENT = {
  cassio: 'us-male', fabio: 'us-male', fabricio: 'us-female',
  fernando: 'gb-male', josemario: 'us-female', julio: 'gb-female',
};

function norm(s) { return (s || '').toString().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }

export default function Glossary({ meta, items }) {
  const [q, setQ] = useState('');
  const voice = VOICE_BY_STUDENT[meta.id] || 'us-male';
  const filtered = useMemo(() => {
    const t = norm(q.trim());
    if (!t) return items;
    return items.filter((v) => norm(v.en).includes(t) || norm(v.pt).includes(t) || norm(v.example).includes(t));
  }, [q, items]);

  return (
    <>
      <RacionalTopBar showHome />
      <section className="rc-dash-hero" style={{ background: `linear-gradient(135deg, ${meta.accent} 0%, #1C2230 120%)`, padding: '44px 0 38px' }}>
        <div className="rc-dash-hero-bg" style={{ backgroundImage: `url(${meta.hero})` }} />
        <div className="rc-dash-hero-inner rc-wrap">
          <Link href={`/racional/${meta.id}`} className="rc-back">← {meta.studentName}</Link>
          <div className="rc-dash-role">Glossário do programa</div>
          <h1>Vocabulário · {meta.studentName.split(' ')[0]}</h1>
          <div className="rc-dash-sub">{items.length} palavras das aulas com conteúdo completo</div>
        </div>
      </section>

      <div className="rc-wrap" style={{ padding: '32px 24px 10px' }}>
        <input
          className="rc-search"
          placeholder="Buscar palavra, tradução ou exemplo…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <p className="rc-mini-label" style={{ margin: '12px 0 18px' }}>{filtered.length} resultado(s)</p>

        {filtered.length === 0 ? (
          <div className="rc-soon">Nada encontrado para “{q}”.</div>
        ) : (
          <div className="rc-vocab-grid">
            {filtered.map((v, i) => (
              <div key={i} className="rc-vocab">
                <div className="rc-vocab-body">
                  <div><span className="rc-vocab-en">{v.en}</span> <span className="rc-vocab-pt">— {v.pt}</span></div>
                  {v.example && <div className="rc-vocab-ex"><em>ex.</em>{v.example}</div>}
                  <Link href={`/racional/${meta.id}/lesson/${v.lessonNum}`} className="rc-vocab-src">aula {String(v.lessonNum).padStart(3, '0')} · {v.lessonTitle}</Link>
                </div>
                <AudioPlayer text={v.example ? `${v.en}. ${v.example}` : v.en} voiceType={voice} rate={0.85} label="" small />
              </div>
            ))}
          </div>
        )}

        <div className="rc-stepnav" style={{ paddingTop: 20 }}>
          <Link href={`/racional/${meta.id}`} className="rc-btn rc-btn-primary" style={{ background: meta.accent }}>
            <Icon name="arrow-left" size={16} /> Voltar ao programa de {meta.studentName.split(' ')[0]}
          </Link>
        </div>
      </div>
      <RacionalFooter />
    </>
  );
}
