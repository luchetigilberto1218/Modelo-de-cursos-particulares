'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// Destino pós-login pedido pela URL (?next=/algum/caminho). Só aceitamos caminho
// relativo do próprio site — nunca "//host" ou URL absoluta, senão o link viraria
// um redirecionador aberto para fora.
function safeNext(raw) {
  if (typeof raw !== 'string') return null;
  if (!raw.startsWith('/') || raw.startsWith('//')) return null;
  return raw;
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }

      // Se a URL pediu um destino (?next=), ele vence — é o que faz um link
      // direto para uma trilha sobreviver à tela de login. Sem ?next=, nada muda:
      // alunos/professores com um único cliente vão direto pro material dele e
      // coordenador (acesso a tudo) segue para a raiz.
      const clients = data.user?.clients;
      const fallback = data.user?.role !== 'coordinator' && clients?.length === 1
        ? `/${clients[0]}`
        : '/';
      const dest = safeNext(searchParams.get('next')) || fallback;
      router.push(dest);
      router.refresh();
    } catch {
      setError('Connection error');
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <img
            src="https://alumni.org.br/wp-content/uploads/2025/11/Alumni-Vertical-colorido.webp"
            alt="Alumni"
            style={{ height: 60, objectFit: 'contain' }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </div>
        <h2>Welcome</h2>
        <p>Sign in to access your courses</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Usuário</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Seu nome de usuário"
              autoComplete="username"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          {error && <div className="login-error">{error}</div>}
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
