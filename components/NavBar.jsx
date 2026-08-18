'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { isCzarnikow } from '../lib/czarnikow';

export default function NavBar({ user, theme, clientId }) {
  const router = useRouter();
  const homeHref = clientId ? `/${clientId}` : '/';

  // Nas rotas da Czarnikow (login obrigatório), a NavBar descobre
  // sozinha quem está logado para mostrar o nome + "Sair". Aditivo: se um `user`
  // for passado por prop, ele tem prioridade; os outros cursos ficam intactos.
  const [me, setMe] = useState(null);
  useEffect(() => {
    if (user || !isCzarnikow(clientId)) return;
    fetch('/api/czarnikow-teste/me', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (d?.student) setMe({ name: d.name, role: d.role }); })
      .catch(() => {});
  }, [user, clientId]);
  const shownUser = user || me;

  // Sair guarda o curso de onde a pessoa saiu (`?next=`), para que entrar de
  // novo devolva ela ao MESMO material. Sem isso o login caía na raiz, que
  // lista os outros clientes do cadastro — quem sai da Czarnikow via a tela de
  // "escolha o material" com Porto de Santos e Baker Hughes.
  async function handleLogout() {
    await fetch('/api/auth', { method: 'DELETE' });
    router.push(clientId ? `/login?next=${encodeURIComponent(`/${clientId}`)}` : '/login');
    router.refresh();
  }

  const roleLabels = { coordinator: 'Coordinator', teacher: 'Teacher', student: 'Student' };

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 20px',
      background: '#1B2736',
      minHeight: 48,
      flexWrap: 'wrap',
      gap: 8,
    }}>
      <Link href={homeHref} style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', minHeight: 44 }}>
        {theme?.logos?.school && (
          <img
            src={theme.logos.school}
            alt="Alumni"
            style={{ height: 28, objectFit: 'contain', maxWidth: 120 }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        )}
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Atalho para o painel do professor — só nas rotas da CZ e só para
            quem é professor/coordenador. Aluno nunca vê (a rota também é 404). */}
        {isCzarnikow(clientId)
          && (shownUser?.role === 'teacher' || shownUser?.role === 'coordinator') && (
          <Link
            href={`/${clientId}/professor`}
            style={{
              color: '#fff', fontSize: 12, fontWeight: 600, textDecoration: 'none',
              background: 'rgba(42,170,226,0.22)', border: '1px solid rgba(42,170,226,0.5)',
              padding: '6px 12px', borderRadius: 8,
            }}
          >
            Painel do professor
          </Link>
        )}
        {shownUser && (
          <>
            <span style={{ color: '#fff', fontSize: 13, fontWeight: 500 }}>{shownUser.name}</span>
            <button
              onClick={handleLogout}
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#fff',
                padding: '6px 12px',
                borderRadius: 8,
                fontSize: 12,
                cursor: 'pointer',
              }}
            >
              Sign out
            </button>
          </>
        )}
        {theme?.logos?.client && (
          <img
            src={theme.logos.client}
            alt={theme?.clientName || 'Client'}
            style={{ height: 28, objectFit: 'contain' }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        )}
      </div>
    </nav>
  );
}
