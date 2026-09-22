'use client';

import { useEffect, useState } from 'react';

/*
  Troca de empresa e de filtro no painel da coordenação SEM ir ao servidor.

  O servidor já manda todas as telas prontas (uma <section data-painel> por
  empresa, cada linha com data-grupo). Aqui só se decide qual aparece: um
  <style> gerado a partir do estado esconde o resto. Os botões continuam sendo
  links de verdade (?c=&f=) — abrir em nova aba, salvar nos favoritos e voltar
  do navegador funcionam; o clique comum é que fica instantâneo.
*/

function ler(search) {
  const q = new URLSearchParams(search);
  return { c: q.get('c') || '', f: q.get('f') || 'todos' };
}

export default function PainelNavegacao({ inicialC, inicialF, ids, cores, children }) {
  const [c, setC] = useState(ids.includes(inicialC) ? inicialC : '');
  const [f, setF] = useState(inicialF || 'todos');

  useEffect(() => {
    const volta = () => {
      const s = ler(window.location.search);
      setC(ids.includes(s.c) ? s.c : '');
      setF(s.f);
    };
    window.addEventListener('popstate', volta);
    return () => window.removeEventListener('popstate', volta);
  }, [ids]);

  function onClick(e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest('a[data-nav-c]');
    if (!a) return;
    e.preventDefault();
    const novoC = a.getAttribute('data-nav-c') || '';
    const novoF = a.getAttribute('data-nav-f') || 'todos';
    if (novoC !== c) window.scrollTo({ top: 0 });
    setC(novoC);
    setF(novoF);
    window.history.pushState(null, '', a.getAttribute('href'));
  }

  const painel = c || 'geral';
  const css = `
    [data-painel] { display: none; }
    [data-painel="${painel}"] { display: block; }
    .pc-tab[data-nav-c="${c}"] { background: ${cores.azul}; color: #fff; border-color: ${cores.azul}; }
    [data-painel="${painel}"] .pc-chip[data-nav-f="${f}"] { background: ${cores.azulClaro}; color: ${cores.azul}; border-color: ${cores.azul}; }
    ${f !== 'todos' ? `[data-painel="${painel}"] tr[data-grupo]:not([data-grupo="${f}"]) { display: none; }` : ''}
  `;

  return (
    <div onClick={onClick}>
      <style>{css}</style>
      {children}
    </div>
  );
}
