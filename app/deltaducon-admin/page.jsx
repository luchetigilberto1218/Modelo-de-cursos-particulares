import { redirect } from 'next/navigation';
import { getSession, isCoordinator } from '../../lib/auth';
import { listAll } from '../../lib/deltaducon-progress-store';

export const dynamic = 'force-dynamic';

// Trilhas na mesma ordem/índice do curso (build-lessons.cjs / lessons.js)
const TRACKS = [
  'Inglês para Negócios', 'Assistentes Administrativos', 'Vendas / Comercial',
  'Gestão Industrial', 'Qualidade e PCP', 'Gestão de Pessoas',
  'Engenharia de Aplicação', 'Compras (Procurement)',
];
const TOTAL = 10;

// Elenco fixo dos 18 (nome -> índice da trilha), igual ao dropdown do curso.
const ROSTER = [
  ['Aldo Stella Junior', 2], ['André Vinicius Neves Dias', 3], ['Andrea Rosa dos Santos', 2],
  ['Anselmo Teixeira', 2], ['Carlos Eduardo Campos de Freitas', 2], ['Felipe da Silva Ribeiro Mariano', 2],
  ['Felipe Gomes', 6], ['Fernando Antonio Rosatti', 7], ['Fernando Maranim Sandoval', 2],
  ['Gabriel Marcos de Rosa Miari', 3], ['Gustavo Quintela dos Santos', 6], ['Hugo César Alves Dantas', 6],
  ['Jefferson Matozinho da Luz', 6], ['Jessica Lima da Silva', 2], ['Marcio Clementino dos Santos Sousa', 6],
  ['Milton Chiga', 2], ['Raphael Henrique Aguiar da Silva', 2], ['Ricardo Bruno Aguiar da Silva', 6],
];

function slugify(s) {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 64);
}
function doneInTrack(done, t) {
  if (!done) return 0;
  const pref = t + '_';
  return Object.keys(done).filter(k => k.startsWith(pref)).length;
}
function fmtDate(iso) {
  if (!iso) return '—';
  try { return new Date(iso).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }); }
  catch { return '—'; }
}

export default async function DeltaDuconAdmin() {
  const session = await getSession();
  if (!session) redirect('/login');
  if (!isCoordinator(session)) {
    return (
      <main style={{ padding: 40, fontFamily: 'system-ui', background: '#f5f5f7', minHeight: '100vh' }}>
        <p>Acesso restrito à coordenação.</p>
      </main>
    );
  }

  let records = [];
  let error = null;
  try { records = await listAll(); } catch (e) { error = e.message; }
  const bySlug = {};
  for (const r of records) bySlug[r.slug] = r;

  const rows = ROSTER.map(([name, t]) => {
    const rec = bySlug[slugify(name)] || null;
    const done = rec?.done || null;
    const inTrack = doneInTrack(done, t);
    const totalDone = done ? Object.keys(done).length : 0;
    return { name, t, inTrack, extra: Math.max(0, totalDone - inTrack), at: rec?.at || null, started: totalDone > 0 };
  }).sort((a, b) => (a.t - b.t) || a.name.localeCompare(b.name, 'pt'));

  const started = rows.filter(r => r.started).length;
  const finished = rows.filter(r => r.inTrack >= TOTAL).length;

  const wrap = { maxWidth: 900, margin: '0 auto' };
  const th = { textAlign: 'left', padding: '10px 12px', fontSize: 12, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '.5px', borderBottom: '2px solid #e5e7eb' };
  const td = { padding: '10px 12px', fontSize: 14, borderBottom: '1px solid #f0f0f2' };

  return (
    <main style={{ padding: '40px 24px', fontFamily: 'system-ui, sans-serif', background: '#f5f5f7', minHeight: '100vh' }}>
      <div style={wrap}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Delta Ducon · Progresso da equipe</h1>
        <p style={{ color: '#6b7280', marginBottom: 20 }}>
          {started} de {ROSTER.length} começaram · {finished} concluíram a trilha · sincronização por aluno (Vercel Blob)
        </p>
        {error && (
          <div style={{ padding: 16, borderRadius: 10, background: '#fef2f2', color: '#991b1b', marginBottom: 16 }}>Erro ao ler progresso: {error}</div>
        )}
        <div style={{ overflowX: 'auto', background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,.06)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 640 }}>
            <thead><tr>
              <th style={th}>Colaborador</th><th style={th}>Trilha</th>
              <th style={th}>Progresso</th><th style={th}>Outras trilhas</th><th style={th}>Última atividade</th>
            </tr></thead>
            <tbody>
              {rows.map((r, i) => {
                const pct = Math.round(r.inTrack / TOTAL * 100);
                return (
                  <tr key={i} style={{ background: r.started ? '#fff' : '#fafafa' }}>
                    <td style={{ ...td, fontWeight: 600, color: r.started ? '#111827' : '#9ca3af' }}>{r.name}</td>
                    <td style={{ ...td, color: '#374151' }}>{TRACKS[r.t]}</td>
                    <td style={td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ flex: 1, minWidth: 90, height: 8, borderRadius: 100, background: '#eceff2', overflow: 'hidden' }}>
                          <div style={{ width: pct + '%', height: '100%', background: r.inTrack >= TOTAL ? '#16a34a' : '#2f8f5b' }} />
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#374151', minWidth: 38 }}>{r.inTrack}/{TOTAL}</span>
                      </div>
                    </td>
                    <td style={{ ...td, color: '#6b7280' }}>{r.extra > 0 ? `+${r.extra} aulas` : '—'}</td>
                    <td style={{ ...td, color: '#6b7280' }}>{fmtDate(r.at)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p style={{ color: '#9ca3af', fontSize: 12, marginTop: 14 }}>
          O progresso é sincronizado quando o aluno conclui uma aula (todos os exercícios). Quem ainda não apareceu aqui não iniciou ou não completou nenhuma aula.
        </p>
      </div>
    </main>
  );
}
