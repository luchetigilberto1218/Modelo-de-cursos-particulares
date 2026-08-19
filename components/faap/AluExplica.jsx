'use client';

import { useEffect, useRef, useState } from 'react';

/*
  "Alu explica" — o recado de boas-vindas da home da FAAP.

  Duas versões ficaram pelo caminho e valem como aviso:
  · a primeira tinha ▶ (que avançava slides por tempo) e "Ouvir" (que tocava a
    voz) — apertando os dois, as falas se sobrepunham;
  · a segunda encadeava seis telas, cada uma com a sua requisição de voz, e a
    narração saía picotada: falava, parava para a rede, recomeçava.

  Agora é um texto curto e um áudio só, do começo ao fim, sem corte.
*/

export default function AluExplica({ c, texto, student }) {
  const navy = c.navy || '#0B2E63';
  const navyLight = c.navyLight || '#14418C';
  const accent = c.accent || '#1753D9';

  const [playing, setPlaying] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const audioRef = useRef(null);

  const firstName = (student || '').split(' ')[0];
  const titulo = firstName ? `${texto.titulo.replace(/\.$/, '')}, ${firstName}.` : texto.titulo;
  const fala = [titulo, ...texto.paragrafos].join(' ');
  const src = `/api/tts?voice=pt-br-multi&text=${encodeURIComponent(fala.slice(0, 3000))}`;

  /* O áudio começa a ser preparado quando a home abre, não quando o aluno
     aperta. A rota /api/tts sintetiza o texto inteiro antes de responder um
     byte, então disparar no clique deixava vários segundos de silêncio — e este
     é o primeiro botão que todo mundo aperta. Buscando desde o carregamento, o
     arquivo normalmente já está no cache do navegador na hora do play. */
  useEffect(() => {
    const a = new Audio();
    audioRef.current = a;
    a.preload = 'auto';
    a.src = src;

    const fim = () => { setPlaying(false); setCarregando(false); };
    const tocando = () => setCarregando(false);
    const esperando = () => setCarregando(true);
    a.addEventListener('ended', fim);
    a.addEventListener('error', fim);
    a.addEventListener('playing', tocando);
    a.addEventListener('waiting', esperando);
    try { a.load(); } catch { /* ignore */ }

    return () => {
      a.removeEventListener('ended', fim);
      a.removeEventListener('error', fim);
      a.removeEventListener('playing', tocando);
      a.removeEventListener('waiting', esperando);
      try { a.pause(); } catch { /* ignore */ }
      a.src = '';
      audioRef.current = null;
    };
  }, [src]);

  /* Se o aluno apertar antes de a síntese terminar, o botão assume "Preparando"
     em vez de ficar mudo — a espera vira informação, não defeito. */
  function alterna() {
    const a = audioRef.current;
    if (!a) return;
    if (playing) { a.pause(); setPlaying(false); setCarregando(false); return; }
    setPlaying(true);
    if (a.readyState < 3) setCarregando(true);
    a.play().catch(() => { setPlaying(false); setCarregando(false); });
  }

  return (
    <div style={{ background: `linear-gradient(135deg, ${navy}, ${navyLight})`, borderRadius: 18, padding: '28px 26px', color: '#fff', display: 'flex', gap: 22, alignItems: 'flex-start', flexWrap: 'wrap', boxShadow: '0 14px 40px rgba(11,46,99,0.22)' }}>
      <Avatar accent={accent} speaking={playing && !carregando} />

      <div style={{ flex: '1 1 340px', minWidth: 260 }}>
        <div style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: 1.4, textTransform: 'uppercase', color: accent, marginBottom: 10 }}>
          Alu explica · como funciona
        </div>
        <p style={{ margin: '0 0 12px', fontSize: 18.5, fontWeight: 700, lineHeight: 1.35 }}>{titulo}</p>
        {texto.paragrafos.map((t, i) => (
          <p key={i} style={{ margin: i === 0 ? 0 : '10px 0 0', fontSize: 14.5, lineHeight: 1.65, color: 'rgba(255,255,255,0.78)' }}>{t}</p>
        ))}

        <button type="button" onClick={alterna}
          style={{ marginTop: 18, display: 'inline-flex', alignItems: 'center', gap: 9, padding: '9px 18px 9px 14px', borderRadius: 999, border: 'none', background: accent, color: '#fff', fontSize: 13.5, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer' }}>
          <span style={{ fontSize: 13 }}>{carregando ? '◴' : playing ? '❚❚' : '▶'}</span>
          {carregando ? 'Preparando…' : playing ? 'Pausar' : 'Ouvir'}
        </button>
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
              {speaking && <animate attributeName="height" values={`${h};${h * 0.45};${h}`} dur={`${0.7 + k * 0.12}s`} repeatCount="indefinite" />}
              {speaking && <animate attributeName="y" values={`${26 - h / 2};${26 - h * 0.225};${26 - h / 2}`} dur={`${0.7 + k * 0.12}s`} repeatCount="indefinite" />}
            </rect>
          );
        })}
      </svg>
    </div>
  );
}
