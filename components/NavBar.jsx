'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NavBar({ user, theme, clientId }) {
  const router = useRouter();
  const homeHref = clientId ? `/${clientId}` : '/';

  async function handleLogout() {
    await fetch('/api/auth', { method: 'DELETE' });
    router.push('/login');
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
        {user && (
          <>
            <span style={{ color: '#fff', fontSize: 13, fontWeight: 500 }}>{user.name}</span>
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
