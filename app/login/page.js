'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { primaryClient, allowedNext } from '../../lib/primary-client';


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
  const [reveal, setReveal] = useState(false);
  // O navegador só dispara o alerta de "senha vazada/fraca" quando enxerga um
  // <input type="password">. Mascarando por CSS o campo continua escondido na
  // tela, mas o Chrome não trata mais o envio como credencial — o aviso que
  // interrompia o login some. Só trocamos depois de montar (e só onde o CSS é
  // suportado); sem suporte, fica exatamente como era antes: type="password".
  const [maskByCss, setMaskByCss] = useState(false);
  useEffect(() => {
    setMaskByCss(typeof CSS !== 'undefined' && CSS.supports?.('-webkit-text-security', 'disc'));
  }, []);
  const router = useRouter();
  const searchParams = useSearchParams();
  // Chegou aqui porque a conta foi desativada (guardClient manda com ?desativado=1).
  const desativado = searchParams.get('desativado') === '1';

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
      // direto para uma trilha sobreviver à tela de login. Sem ?next=, a pessoa
      // vai direto para o material dela: `primaryClient` ignora o espelho
      // interno `<cliente>-teste`, então quem tem um único curso de verdade
      // (o caso de todo mundo hoje) não passa mais pela raiz antes do conteúdo.
      // Só quem tem dois cursos distintos cai em `/`, que agora lista os dois.
      const home = primaryClient(data.user);
      const fallback = home ? `/${home}` : '/';
      // `allowedNext` só aceita caminho interno E que esta pessoa possa abrir —
      // assim o link não vira redirecionador para fora, e ninguém é mandado para
      // o material de outra empresa (o guard devolveria ao login em looping).
      const dest = allowedNext(data.user, searchParams.get('next')) || fallback;
      // `replace` e não `push`: a tela de login não fica no histórico. Sem isso,
      // o "voltar" do navegador cai no login e, de lá, em qualquer página que
      // estivesse aberta antes — inclusive o material de outro cliente.
      router.replace(dest);
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
            <div className="password-field">
              <input
                type={reveal || maskByCss ? 'text' : 'password'}
                className={maskByCss && !reveal ? 'masked' : undefined}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setReveal((v) => !v)}
                aria-label={reveal ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {reveal ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
          </div>
          {!error && desativado && (
            <div className="login-error">Este acesso está desativado. Fale com a Alumni para reativá-lo.</div>
          )}
          {error && <div className="login-error">{error}</div>}
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
