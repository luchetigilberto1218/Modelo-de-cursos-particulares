// 404 neutro. Qualquer cliente inexistente cai aqui (via notFound()), em vez de
// "vazar" para /aps. Sem expor nenhum cliente.

export const metadata = {
  title: 'Página não encontrada — Alumni by Better',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        background: 'linear-gradient(180deg,#0b2033,#04121f)',
        color: '#fff',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: 520 }}>
        <div
          style={{
            fontSize: 13,
            letterSpacing: '.18em',
            textTransform: 'uppercase',
            fontWeight: 700,
            color: 'rgba(255,255,255,.6)',
            marginBottom: 16,
          }}
        >
          Alumni by Better
        </div>
        <h1 style={{ fontSize: 46, fontWeight: 800, letterSpacing: '-.02em', margin: '0 0 10px' }}>404</h1>
        <p style={{ fontSize: 16, lineHeight: 1.65, color: 'rgba(255,255,255,.75)', fontWeight: 400, margin: 0 }}>
          Esta página não existe. Verifique o link que a sua empresa compartilhou com você —
          cada empresa tem o seu material em um endereço exclusivo.
        </p>
      </div>
    </main>
  );
}
