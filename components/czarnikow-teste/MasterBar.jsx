'use client';

import { useEffect, useRef, useState } from 'react';
import { useIdentity } from './progress';

/*
  Barra da visão MASTER (Czarnikow) — só aparece para o coordenador.
  Mesmo desenho da barra do material da Daniela/EuroChem:

    Ver como aluno · Ver como professor  |  Prova · Dados reais  |  Reiniciar prova

  Quem decide o que cada combinação significa é o servidor
  (lib/czarnikow-master.js); a barra só grava a escolha e recarrega a página,
  porque a identidade é lida uma vez por carregamento.
*/

const C = {
  navy: '#1C2B4A', red: '#C8102E', green: '#1E7A3C', gold: '#B98A16', line: 'rgba(255,255,255,0.22)',
};
const PROVA_ID = 'czt-master-prova';

async function salvar(patch) {
  await fetch('/api/czarnikow-teste/master', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  });
}

function Seg({ ativo, onClick, children, cor }) {
  return (
    <button
      onClick={onClick}
      disabled={ativo}
      style={{
        padding: '8px 12px', minHeight: 36, borderRadius: 8, border: 'none', cursor: ativo ? 'default' : 'pointer',
        fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap',
        background: ativo ? (cor || '#fff') : 'transparent',
        color: ativo ? (cor ? '#fff' : C.navy) : 'rgba(255,255,255,0.85)',
      }}
    >
      {children}
    </button>
  );
}

function Grupo({ children }) {
  return (
    <div style={{ display: 'inline-flex', gap: 2, padding: 3, borderRadius: 10, border: `1px solid ${C.line}` }}>
      {children}
    </div>
  );
}

export default function MasterBar({ clientId }) {
  const me = useIdentity(true);
  const [ocupado, setOcupado] = useState(false);
  const barra = useRef(null);
  const m = me?.master;

  // reserva no fim da página a altura REAL da barra (no celular ela quebra em 2–3 linhas)
  useEffect(() => {
    if (!m || !barra.current) return undefined;
    const antes = document.body.style.paddingBottom;
    const ajusta = () => { document.body.style.paddingBottom = `${(barra.current?.offsetHeight || 0) + 16}px`; };
    ajusta();
    window.addEventListener('resize', ajusta);
    return () => { window.removeEventListener('resize', ajusta); document.body.style.paddingBottom = antes; };
  }, [m]);

  if (!m) return null;

  async function trocar(patch, destino) {
    setOcupado(true);
    await salvar({ view: m.view, mode: m.mode, student: m.student, ...patch });
    const view = patch.view || m.view;
    const naProfessor = window.location.pathname.endsWith('/professor');
    if (destino) window.location.href = destino;
    else if (view === 'teacher' && !naProfessor) window.location.href = `/${clientId}/professor`;
    else if (view === 'student' && naProfessor) window.location.href = `/${clientId}`;
    else window.location.reload();
  }

  async function reiniciar() {
    if (!window.confirm('Apagar tudo o que foi feito no modo Prova? Os dados reais não são tocados.')) return;
    setOcupado(true);
    await fetch('/api/czarnikow-teste/master', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ reset: true }),
    });
    try {
      const all = JSON.parse(localStorage.getItem('czt-progress-v1') || '{}');
      delete all[PROVA_ID];
      localStorage.setItem('czt-progress-v1', JSON.stringify(all));
    } catch { /* ignore */ }
    window.location.reload();
  }

  const real = m.mode === 'real';

  return (
    <div
      ref={barra}
      role="region"
      aria-label="Visão master"
      style={{
        position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 9000,
        background: C.navy, color: '#fff', borderTop: `4px solid ${real ? C.green : C.gold}`,
        padding: '10px 16px', display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center',
        justifyContent: 'center', boxShadow: '0 -6px 20px rgba(0,0,0,0.25)', opacity: ocupado ? 0.6 : 1,
        pointerEvents: ocupado ? 'none' : 'auto',
      }}
    >
      <strong style={{ fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)' }}>
        Master
      </strong>
      <Grupo>
        <Seg ativo={m.view === 'student'} onClick={() => trocar({ view: 'student' })}>Ver como aluno</Seg>
        <Seg ativo={m.view === 'teacher'} onClick={() => trocar({ view: 'teacher' })}>Ver como professor</Seg>
      </Grupo>
      <Grupo>
        <Seg ativo={!real} cor={C.gold} onClick={() => trocar({ mode: 'prova' })}>Prova</Seg>
        <Seg ativo={real} cor={C.green} onClick={() => trocar({ mode: 'real' })}>Dados reais</Seg>
      </Grupo>
      {real && m.view === 'student' && (
        <select
          value={m.student || ''}
          onChange={(e) => trocar({ student: e.target.value }, `/${clientId}`)}
          aria-label="Colaborador"
          style={{
            minHeight: 38, borderRadius: 8, border: `1px solid ${C.line}`, background: '#fff', color: C.navy,
            fontSize: 13.5, fontWeight: 600, padding: '0 10px', maxWidth: 240,
          }}
        >
          {(m.roster || []).map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
      )}
      {real ? (
        <span style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.8)' }}>Só leitura — nada é gravado</span>
      ) : (
        <button
          onClick={reiniciar}
          style={{
            minHeight: 36, padding: '0 12px', borderRadius: 8, border: `1px solid ${C.line}`,
            background: 'transparent', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
          }}
        >
          Reiniciar prova
        </button>
      )}
    </div>
  );
}
