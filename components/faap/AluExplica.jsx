'use client';

import { useEffect, useRef, useState } from 'react';
import AudioPlayer from '../AudioPlayer';

/*
  "Alu explica" — o guia de boas-vindas da home da FAAP.

  Copiado em espírito do "Duca explica" da Delta Ducon: um apresentador que
  passa por algumas telas curtas contando como o material funciona, em
  português, com áudio e com botão de pular. Aqui o avatar é abstrato (círculo
  com onda de voz) em vez de um bichinho — combina com o tom institucional da
  Fundação sem perder a simpatia.
*/

export default function AluExplica({ c, steps, student }) {
  const navy = c.navy || '#0B2E63';
  const navyLight = c.navyLight || '#14418C';
  const accent = c.accent || '#1753D9';
  const grayLight = c.grayLight || '#E3E8F0';

  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timer = useRef(null);
  const total = steps.length;

  useEffect(() => {
    if (!playing) return undefined;
    timer.current = setTimeout(() => {
      setI((prev) => {
        if (prev + 1 >= total) { setPlaying(false); return prev; }
        return prev + 1;
      });
    }, 6200);
    return () => clearTimeout(timer.current);
  }, [playing, i, total]);

  const firstName = (student || '').split(' ')[0];
  const step = steps[i];

  return (
    <div style={{ background: `linear-gradient(135deg, ${navy}, ${navyLight})`, borderRadius: 18, padding: '26px 24px', color: '#fff', display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap', boxShadow: '0 14px 40px rgba(11,46,99,0.22)' }}>
      <Avatar accent={accent} speaking={playing} />

      <div style={{ flex: '1 1 320px', minWidth: 260 }}>
        <div style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: 1.4, textTransform: 'uppercase', color: accent, marginBottom: 8 }}>
          Alu explica · como funciona
        </div>
        <p style={{ margin: '0 0 6px', fontSize: 17.5, fontWeight: 700, lineHeight: 1.4 }}>
          {i === 0 && firstName ? `${step.title.replace(/\.$/, '')}, ${firstName}.` : step.title}
        </p>
        <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6, color: 'rgba(255,255,255,0.78)' }}>{step.text}</p>

        <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <button type="button" onClick={() => setPlaying((p) => !p)}
            style={{ width: 40, height: 40, borderRadius: 999, border: 'none', background: accent, color: '#fff', fontSize: 15, cursor: 'pointer', fontFamily: 'inherit' }}>
            {playing ? '❚❚' : '▶'}
          </button>
          <div style={{ display: 'flex', gap: 6 }}>
            {steps.map((_, k) => (
              <button key={k} type="button" onClick={() => { setI(k); setPlaying(false); }} aria-label={`Passo ${k + 1}`}
                style={{ width: k === i ? 22 : 8, height: 8, borderRadius: 999, border: 'none', padding: 0, cursor: 'pointer', transition: 'width 0.3s', background: k === i ? accent : 'rgba(255,255,255,0.3)' }} />
            ))}
          </div>
          <AudioPlayer text={`${step.title} ${step.text}`} rate={1} label="Ouvir" small voiceType="pt-br-female" />
          {i < total - 1 && (
            <button type="button" onClick={() => { setI(total - 1); setPlaying(false); }}
              style={{ padding: '6px 12px', borderRadius: 999, border: `1px solid ${grayLight}33`, background: 'transparent', color: 'rgba(255,255,255,0.6)', fontSize: 12.5, fontFamily: 'inherit', cursor: 'pointer' }}>
              pular
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Avatar({ accent, speaking }) {
  return (
    <div style={{ flex: '0 0 88px', width: 88, height: 88, borderRadius: 999, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="52" height="52" viewBox="0 0 52 52" aria-hidden="true">
        <circle cx="26" cy="26" r="24" fill="rgba(255,255,255,0.06)" />
        {[0, 1, 2, 3, 4].map((k) => {
          const h = speaking ? [14, 24, 32, 22, 12][k] : [10, 16, 20, 16, 10][k];
          return (
            <rect key={k} x={8 + k * 8} y={26 - h / 2} width="4.5" height={h} rx="2.25" fill={k === 2 ? '#fff' : accent}
              style={{ transition: 'all 0.35s ease', opacity: k === 2 ? 1 : 0.85 }}>
              {speaking && (
                <animate attributeName="height" values={`${h};${h * 0.45};${h}`} dur={`${0.7 + k * 0.12}s`} repeatCount="indefinite" />
              )}
              {speaking && (
                <animate attributeName="y" values={`${26 - h / 2};${26 - h * 0.225};${26 - h / 2}`} dur={`${0.7 + k * 0.12}s`} repeatCount="indefinite" />
              )}
            </rect>
          );
        })}
      </svg>
    </div>
  );
}
