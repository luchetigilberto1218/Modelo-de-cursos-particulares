'use client';

/*
  Baker Hughes — peças de UI compartilhadas pelos formatos de exercício novos.
  Vive só dentro de components/bakerhughes: o BakerHughesLesson original segue
  com as suas próprias cópias, então nada do que já está no ar muda.
*/

export function ExShell({ title, c, badge, children }) {
  return (
    <div style={{ background: '#fff', border: `1px solid ${c.grayLight || '#E2E9E7'}`, borderRadius: 12, padding: 20, marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
        {badge && (
          <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: 0.5, textTransform: 'uppercase', padding: '3px 9px', borderRadius: 999, background: c.accentLight || '#E4F7EC', color: c.navy || '#062E2B' }}>{badge}</span>
        )}
        <h4 style={{ margin: 0, fontSize: 16, color: c.navy || '#062E2B' }}>{title}</h4>
      </div>
      {children}
    </div>
  );
}

export function Instruction({ children, c }) {
  if (!children) return null;
  return <p style={{ fontSize: 14, color: c.gray || '#5F7570', margin: '0 0 12px', lineHeight: 1.55 }}>{children}</p>;
}

export function CheckRow({ checked, setChecked, onReset, canCheck, c, checkLabel }) {
  const accent = c.accent || '#00B04F';
  return (
    <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
      {!checked ? (
        <button onClick={() => setChecked(true)} disabled={!canCheck}
          style={{ padding: '10px 18px', borderRadius: 8, border: 'none', background: canCheck ? accent : '#CBD5D2', color: '#fff', fontWeight: 700, fontSize: 14, cursor: canCheck ? 'pointer' : 'not-allowed' }}>
          {checkLabel || 'Corrigir'}
        </button>
      ) : (
        <button onClick={() => { setChecked(false); onReset && onReset(); }}
          style={{ padding: '10px 18px', borderRadius: 8, border: `1px solid ${c.grayLight || '#E2E9E7'}`, background: '#fff', color: c.text || '#20302D', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
          Tentar de novo
        </button>
      )}
    </div>
  );
}

export function ResultLine({ ok, c, explanation, corrections }) {
  return (
    <div style={{ marginTop: 14, padding: '10px 14px', borderRadius: 8, background: ok ? '#F0FFF4' : '#FFF5F5', border: `1px solid ${ok ? '#9AE6B4' : '#FEB2B2'}`, color: ok ? '#22543D' : '#742A2A', fontSize: 14, lineHeight: 1.55 }}>
      {ok ? `✓ ${explanation || 'Tudo certo!'}` : '✗ Quase — confira as respostas certas:'}
      {!ok && corrections?.length > 0 && (
        <ul style={{ margin: '8px 0 0', paddingLeft: 20 }}>
          {corrections.map((t, i) => <li key={i} style={{ marginBottom: 3 }}>{t}</li>)}
        </ul>
      )}
      {!ok && explanation && <div style={{ marginTop: 8, opacity: 0.85 }}>{explanation}</div>}
    </div>
  );
}

export const norm = (s) => String(s ?? '').trim().toLowerCase().replace(/[.,!?;:"'“”]+/g, '').replace(/\s+/g, ' ');

/* Embaralho determinístico: mesma lição embaralha igual em todo carregamento,
   então a aluna não vê a resposta "pular de lugar" ao voltar na página. */
export function seededShuffle(arr, seed) {
  const a = [...arr];
  let s = (seed || 1) >>> 0;
  const rnd = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function hashString(s) {
  let h = 2166136261;
  for (let i = 0; i < String(s).length; i++) { h ^= String(s).charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
