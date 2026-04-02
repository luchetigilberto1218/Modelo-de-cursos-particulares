'use client';

import { useRouter } from 'next/navigation';

export default function NavBar({ user, theme }) {
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/auth', { method: 'DELETE' });
    router.push('/login');
    router.refresh();
  }

  const roleLabels = { coordinator: 'Coordinator', teacher: 'Teacher', student: 'Student' };

  return (
    <nav className="nav">
      <div className="nav-logos">
        {theme?.logos?.school && (
          <img src={theme.logos.school} alt="Alumni" onError={(e) => { e.target.style.display = 'none'; }} />
        )}
        {theme?.logos?.client && (
          <>
            <div className="nav-divider" />
            <img src={theme.logos.client} alt={theme?.clientName || 'Client'} onError={(e) => { e.target.style.display = 'none'; }} />
          </>
        )}
      </div>
      <div className="nav-right">
        <span className="nav-user">{user?.name}</span>
        <span className="nav-role">{roleLabels[user?.role] || user?.role}</span>
        <button className="nav-logout" onClick={handleLogout}>Sign out</button>
      </div>
    </nav>
  );
}
