'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { track } from '@vercel/analytics';

// Segmentos que NÃO são empresa (não devem virar linha nas métricas)
const NOT_EMPRESA = new Set(['login', 'api', 'admin', '_next']);

// A cada navegação, identifica a empresa (1º segmento da URL) e conta o acesso:
//  1) no nosso contador próprio (/api/hit -> Neon) — é o que alimenta o /admin, grátis;
//  2) também dispara um custom event da Vercel (só aparece se o time for Pro; no Hobby é ignorado).
export default function EmpresaTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    const empresa = pathname.split('/').filter(Boolean)[0];
    if (!empresa || NOT_EMPRESA.has(empresa)) return;

    // contador próprio (grátis)
    fetch(`/api/hit?empresa=${encodeURIComponent(empresa)}`, {
      method: 'POST',
      keepalive: true,
    }).catch(() => {});

    // bônus: custom event da Vercel (funciona se virar Pro)
    track('empresa_view', { empresa });
  }, [pathname]);

  return null;
}
