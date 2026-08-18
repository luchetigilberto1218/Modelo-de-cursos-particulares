import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSession, isCoordinator } from '../../lib/auth';
import { getStatsByEmpresa } from '../../lib/stats';

export const dynamic = 'force-dynamic';

function fmt(d) {
  // YYYY-MM-DD no fuso de São Paulo (bate com a gravação dos acessos)
  return d.toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' });
}

export default async function AdminStatsPage({ searchParams }) {
  const session = await getSession();
  if (!session) redirect('/login');
  if (!isCoordinator(session)) {
    return (
      <main style={{ padding: 40, fontFamily: 'system-ui', background: '#f5f5f7', minHeight: '100vh' }}>
        <p>Acesso restrito à coordenação.</p>
      </main>
    );
  }

  const sp = await searchParams;
  const today = new Date();
  const monthAgo = new Date(today.getTime() - 29 * 24 * 60 * 60 * 1000);
  const from = sp?.from || fmt(monthAgo);
  const to = sp?.to || fmt(today);

  let rows = [];
  let error = null;
  try {
    rows = await getStatsByEmpresa(from, to);
  } catch (e) {
    error = e.message;
  }
  const total = rows.reduce((s, r) => s + Number(r.total), 0);

  return (
    <main style={{ padding: '40px 24px', fontFamily: 'system-ui, sans-serif', background: '#f5f5f7', minHeight: '100vh' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Acessos por empresa</h1>
        <p style={{ color: '#6b7280', marginBottom: 8 }}>Contador próprio · período {from} a {to}</p>
        {/* Acesso é presença; progresso é o que a pessoa fez lá dentro. As duas
            leituras andam juntas, então uma tela leva à outra. */}
        <p style={{ marginBottom: 24 }}>
          <Link href="/admin/alunos" style={{ color: '#2563eb', fontSize: 14, textDecoration: 'none' }}>
            Evolução dos alunos, por turma →
          </Link>
        </p>

        <form method="get" style={{ display: 'flex', gap: 12, alignItems: 'flex-end', marginBottom: 24, flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', flexDirection: 'column', fontSize: 13, color: '#374151' }}>
            De
            <input type="date" name="from" defaultValue={from} style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid #d1d5db', marginTop: 4 }} />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', fontSize: 13, color: '#374151' }}>
            Até
            <input type="date" name="to" defaultValue={to} style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid #d1d5db', marginTop: 4 }} />
          </label>
          <button type="submit" style={{ padding: '9px 18px', borderRadius: 8, border: 'none', background: '#111827', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
            Aplicar
          </button>
        </form>

        {error && (
          <div style={{ padding: 16, borderRadius: 10, background: '#fef2f2', color: '#991b1b', marginBottom: 16 }}>
            Banco não respondeu: {error}
          </div>
        )}

        <div style={{ background: '#fff', borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,.08)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb', textAlign: 'left' }}>
                <th style={{ padding: '14px 18px', fontSize: 13, color: '#6b7280', fontWeight: 600 }}>Empresa</th>
                <th style={{ padding: '14px 18px', fontSize: 13, color: '#6b7280', fontWeight: 600, textAlign: 'right' }}>Acessos</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && !error && (
                <tr><td colSpan={2} style={{ padding: 24, color: '#9ca3af', textAlign: 'center' }}>Nenhum acesso registrado neste período ainda.</td></tr>
              )}
              {rows.map((r) => (
                <tr key={r.empresa} style={{ borderTop: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '14px 18px', fontWeight: 600, textTransform: 'capitalize' }}>{r.empresa}</td>
                  <td style={{ padding: '14px 18px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{Number(r.total).toLocaleString('pt-BR')}</td>
                </tr>
              ))}
            </tbody>
            {rows.length > 0 && (
              <tfoot>
                <tr style={{ borderTop: '2px solid #e5e7eb', background: '#fafafa' }}>
                  <td style={{ padding: '14px 18px', fontWeight: 700 }}>Total</td>
                  <td style={{ padding: '14px 18px', textAlign: 'right', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{total.toLocaleString('pt-BR')}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </main>
  );
}
