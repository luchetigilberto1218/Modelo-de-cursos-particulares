// Root neutro. NÃO redireciona para nenhum cliente (antes ia para /aps, o que
// fazia qualquer rota inexistente "vazar" para o Porto de Santos). Para quem
// não está logado, mostra uma página neutra da Alumni, sem expor nenhum cliente.
//
// Para quem ESTÁ logado, a raiz deixou de ser um beco sem saída: com um único
// curso, manda direto para ele (é o que tira a tela azul do caminho de quem
// acabou de fazer login); com mais de um, lista os cursos da pessoa em vez da
// mensagem genérica "acesse pelo link da sua empresa". Aditivo: visitante
// anônimo vê exatamente a mesma página de antes.

import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '../lib/auth';
import { getTheme } from '../lib/courses';
import { primaryClient, realClients } from '../lib/primary-client';

export const metadata = {
  title: 'Alumni by Better — Cursos corporativos',
  description: 'Plataforma de cursos de inglês corporativo da Alumni by Better.',
  robots: { index: false, follow: false },
};

const shell = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 24,
  background: 'linear-gradient(180deg,#0b2033,#04121f)',
  color: '#fff',
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  textAlign: 'center',
};

const badge = {
  display: 'inline-block',
  fontSize: 13,
  letterSpacing: '.18em',
  textTransform: 'uppercase',
  fontWeight: 700,
  color: 'rgba(255,255,255,.6)',
  border: '1px solid rgba(255,255,255,.2)',
  borderRadius: 999,
  padding: '6px 16px',
  marginBottom: 26,
};

export default async function Home() {
  const session = await getSession();

  // Um curso só (aluno, professor, ou coordenador de um cliente): vai direto
  // para o material. Ninguém mais vê a tela intermediária.
  const home = primaryClient(session);
  if (home) redirect(`/${home}`);

  const clients = realClients(session);
  if (clients.length > 1) {
    return (
      <main style={shell}>
        <div style={{ maxWidth: 640, width: '100%' }}>
          <div style={badge}>Alumni by Better</div>
          <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-.02em', margin: '0 0 8px', lineHeight: 1.15 }}>
            {session?.name ? `Olá, ${session.name.split(' ')[0]}` : 'Seus cursos'}
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.65, color: 'rgba(255,255,255,.7)', margin: '0 0 28px' }}>
            Escolha o material que quer abrir.
          </p>
          <div style={{ display: 'grid', gap: 12 }}>
            {clients.map((id) => {
              const theme = getTheme(id);
              return (
                <Link
                  key={id}
                  href={`/${id}`}
                  style={{
                    display: 'block',
                    textAlign: 'left',
                    padding: '18px 22px',
                    borderRadius: 14,
                    border: '1px solid rgba(255,255,255,.16)',
                    background: 'rgba(255,255,255,.06)',
                    color: '#fff',
                    textDecoration: 'none',
                  }}
                >
                  <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-.01em' }}>
                    {theme?.clientName || id}
                  </div>
                  {theme?.tagline && (
                    <div style={{ fontSize: 14, color: 'rgba(255,255,255,.65)', marginTop: 4 }}>
                      {theme.tagline}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={shell}>
      <div style={{ maxWidth: 520 }}>
        <div style={badge}>Alumni by Better</div>
        <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-.02em', margin: '0 0 14px', lineHeight: 1.15 }}>
          Plataforma de cursos corporativos
        </h1>
        <p style={{ fontSize: 16, lineHeight: 1.65, color: 'rgba(255,255,255,.75)', fontWeight: 400, margin: 0 }}>
          Acesse pelo link que a sua empresa compartilhou com você. Cada empresa tem o seu
          próprio material, com endereço exclusivo.
        </p>
      </div>
    </main>
  );
}
