import Link from 'next/link';

/* Barra superior com os dois logos nas cores das marcas. */
export function RacionalTopBar({ showHome = false }) {
  return (
    <div className="rc-topbar">
      <div className="rc-topbar-logos">
        <img src="/racional/logo-alumni.svg" alt="Alumni" />
        <div className="rc-topbar-divider" />
        <img src="/racional/logo-racional.svg" alt="Racional Engenharia" />
      </div>
      <div className="rc-topbar-right">
        {showHome && (
          <Link href="/racional" className="rc-topbar-link">Todos os alunos</Link>
        )}
        <Link href="/racional/professor" className="rc-topbar-link">Professor</Link>
      </div>
    </div>
  );
}

export function RacionalFooter() {
  return (
    <footer className="rc-footer">
      <div className="rc-wrap rc-footer-inner">
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <img src="/racional/logo-alumni.svg" alt="Alumni" />
          <img src="/racional/logo-racional.svg" alt="Racional Engenharia" />
        </div>
        <small>Programa de Inglês Executivo · Racional Engenharia × Alumni · {new Date().getFullYear()}</small>
      </div>
    </footer>
  );
}
