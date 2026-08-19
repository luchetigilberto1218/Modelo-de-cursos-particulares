import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSession, isCoordinator } from '../../../lib/auth';
import { getPainelCoordenacao } from '../../../lib/coordenacao';
import { getStatsByEmpresa } from '../../../lib/stats';
import { getRankingCampanha } from '../../../lib/czarnikow-campanha';
import { lerHistorico, evolucao } from '../../../lib/historico';

// Leitura de turma da coordenação: todos os clientes numa tela só.
//
// O painel do professor (/czarnikow/professor) responde "onde esta pessoa está
// e qual é a próxima aula". Esta tela responde outra coisa: quantos engajaram,
// quem parou, e há quanto tempo. É a visão que faltava — e a que alimenta o
// relatório mensal.
//
// Só leitura, e só para coordenação. Rota nova: nenhum curso muda.

export const dynamic = 'force-dynamic';

const DIA = 24 * 60 * 60 * 1000;

function diasDesde(iso) {
  if (!iso) return null;
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return null;
  return Math.floor((Date.now() - t) / DIA);
}

function fmtData(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('pt-BR', {
      timeZone: 'America/Sao_Paulo', day: '2-digit', month: '2-digit',
    });
  } catch { return '—'; }
}

// Como a linha do aluno deve ser lida de relance.
function situacao(a) {
  if (a.inativo) return { rotulo: 'desativado', cor: '#9ca3af', fundo: '#f4f4f5' };
  if (!a.feitas) return { rotulo: 'nunca começou', cor: '#b45309', fundo: '#fffbeb' };
  const d = diasDesde(a.ultimaAt);
  if (d !== null && d >= 14) return { rotulo: `parado há ${d} dias`, cor: '#b91c1c', fundo: '#fef2f2' };
  if (d !== null && d >= 7) return { rotulo: `${d} dias sem abrir`, cor: '#b45309', fundo: '#fffbeb' };
  return { rotulo: 'ativo', cor: '#15803d', fundo: '#f0fdf4' };
}

export default async function PainelCoordenacao() {
  const session = await getSession();
  if (!session) redirect('/login?next=%2Fadmin%2Falunos');
  if (!isCoordinator(session)) {
    return (
      <main style={{ padding: 40, fontFamily: 'system-ui', background: '#f5f5f7', minHeight: '100vh' }}>
        <p>Acesso restrito à coordenação.</p>
      </main>
    );
  }

  const hoje = new Date();
  const from = new Date(hoje.getTime() - 29 * DIA).toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' });
  const to = hoje.toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' });

  const [clientes, acessosRaw, campanha, hist] = await Promise.all([
    getPainelCoordenacao(),
    getStatsByEmpresa(from, to).catch(() => []),
    // A campanha é fechada para o colaborador (cada um vê só a si mesmo).
    // A tabela com nomes existe só aqui, para a coordenação.
    getRankingCampanha().catch(() => null),
    // Retratos diários gravados pelo cron. Sem eles a tela funciona igual,
    // só não mostra movimento — é a única parte que depende de histórico.
    lerHistorico().catch(() => ({ dias: {} })),
  ]);

  // Quanto se andou desde o retrato de ~7 dias atrás.
  const evo = evolucao(clientes, hist, 7);
  const temHistorico = evo.size > 0;

  // A Czarnikow tem duas portas (/czarnikow e /czarnikow-teste) e o contador
  // registra cada uma; para a coordenação é um curso só.
  const acessos = new Map();
  for (const r of acessosRaw) {
    const chave = r.empresa === 'czarnikow-teste' ? 'czarnikow' : r.empresa;
    acessos.set(chave, (acessos.get(chave) || 0) + Number(r.total || 0));
  }

  const resumo = clientes.map((c) => {
    const ativos = c.alunos.filter((a) => !a.inativo);
    return {
      ...c,
      total: ativos.length,
      engajados: ativos.filter((a) => a.feitas > 0).length,
      licoes: ativos.reduce((s, a) => s + a.feitas, 0),
      acessos: acessos.get(c.id) || 0,
      evo: evo.get(c.id) || null,
    };
  });

  const card = {
    background: '#fff', borderRadius: 14, padding: '16px 18px',
    boxShadow: '0 1px 4px rgba(0,0,0,.06)', border: '1px solid #ececf0',
  };
  const th = {
    textAlign: 'left', padding: '9px 12px', fontSize: 11, color: '#6b7280',
    textTransform: 'uppercase', letterSpacing: '.5px', borderBottom: '2px solid #e5e7eb', fontWeight: 700,
  };
  const td = { padding: '10px 12px', fontSize: 14, borderBottom: '1px solid #f2f2f4', verticalAlign: 'middle' };

  return (
    <main style={{ padding: '40px 24px 64px', fontFamily: 'system-ui, sans-serif', background: '#f5f5f7', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1040, margin: '0 auto' }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 4px' }}>Coordenação · Evolução dos alunos</h1>
        <p style={{ color: '#6b7280', margin: '0 0 8px', fontSize: 15 }}>
          O que cada turma fez de verdade no material. Acessos dos últimos 30 dias ({from} a {to}).
        </p>
        <p style={{ color: '#9ca3af', margin: '0 0 28px', fontSize: 13 }}>
          Uma lição só conta como concluída quando o aluno termina os exercícios dela.
          Quem aparece sem nenhuma abriu o material mas não fechou nenhuma lição — ou não abriu.
          Nos cursos com login, acesso da coordenação e dos professores deixou de entrar na conta
          em 18/08/2026 — antes dessa data o número inclui as nossas próprias passadas pelo material.
          {' '}<Link href="/admin" style={{ color: '#2563eb' }}>Acessos por empresa →</Link>
        </p>

        {!temHistorico && (
          <p style={{ fontSize: 13, color: '#92400e', background: '#fffbeb', border: '1px solid #fde68a',
                      borderRadius: 10, padding: '10px 14px', margin: '-14px 0 28px', lineHeight: 1.55 }}>
            O movimento (&quot;quanto andou nos últimos 7 dias&quot;) ainda não aparece: o retrato diário
            começou a ser gravado agora e precisa de uma semana de histórico para ter com o que comparar.
            O acumulado abaixo já está correto e ao vivo.
          </p>
        )}

        {/* Resumo: uma linha por cliente, para bater o olho */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 12, marginBottom: 36 }}>
          {resumo.map((c) => (
            <div key={c.id} style={card}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 10 }}>{c.nome}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-.02em', color: c.engajados ? '#111827' : '#d1d5db' }}>
                  {c.engajados}
                </span>
                <span style={{ fontSize: 14, color: '#6b7280' }}>de {c.total} engajaram</span>
              </div>
              <div style={{ fontSize: 13, color: '#6b7280', marginTop: 8, lineHeight: 1.6 }}>
                {c.licoes} {c.licoes === 1 ? 'lição concluída' : 'lições concluídas'}<br />
                {c.acessos} {c.acessos === 1 ? 'acesso' : 'acessos'} em 30 dias
              </div>
              {c.evo && (
                <div style={{ fontSize: 13, fontWeight: 700, marginTop: 6,
                              color: c.evo.licoes > 0 ? '#15803d' : '#9ca3af' }}>
                  {c.evo.licoes > 0 ? `+${c.evo.licoes}` : 'nenhuma'} nos últimos 7 dias
                </div>
              )}
              {c.contagem && (
                <div style={{ fontSize: 11.5, color: '#9ca3af', marginTop: 6, lineHeight: 1.45 }}>{c.contagem}</div>
              )}
            </div>
          ))}
        </div>

        {/* Uma seção por cliente */}
        {resumo.map((c) => {
          const alunos = [...c.alunos].sort((a, b) =>
            (a.inativo - b.inativo) || (b.feitas - a.feitas) || a.nome.localeCompare(b.nome, 'pt-BR')
          );
          return (
            <section key={c.id} style={{ marginBottom: 40 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap', marginBottom: 10 }}>
                <h2 style={{ fontSize: 19, fontWeight: 700, margin: 0 }}>{c.nome}</h2>
                <Link href={c.href} style={{ fontSize: 13, color: '#2563eb', textDecoration: 'none' }}>
                  abrir o material →
                </Link>
                {c.painel && (
                  <Link href={c.painel} style={{ fontSize: 13, color: '#2563eb', textDecoration: 'none' }}>
                    painel detalhado →
                  </Link>
                )}
              </div>

              {c.aviso && (
                <p style={{ fontSize: 13, color: '#92400e', background: '#fffbeb', border: '1px solid #fde68a',
                            borderRadius: 10, padding: '10px 14px', margin: '0 0 12px', lineHeight: 1.55 }}>
                  {c.aviso}
                </p>
              )}
              {c.erro && (
                <p style={{ fontSize: 13, color: '#991b1b', background: '#fef2f2', border: '1px solid #fecaca',
                            borderRadius: 10, padding: '10px 14px', margin: '0 0 12px' }}>
                  Não consegui ler o progresso deste curso: {c.erro}
                </p>
              )}

              <div style={{ overflowX: 'auto', background: '#fff', borderRadius: 12, border: '1px solid #ececf0' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 660 }}>
                  <thead>
                    <tr>
                      <th style={th}>Aluno</th>
                      <th style={{ ...th, width: '30%' }}>Progresso</th>
                      {c.evo && <th style={{ ...th, width: 96 }}>7 dias</th>}
                      <th style={th}>Última atividade</th>
                      <th style={th}>Situação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alunos.length === 0 && (
                      <tr><td style={{ ...td, color: '#9ca3af' }} colSpan={c.evo ? 5 : 4}>Nenhum aluno cadastrado.</td></tr>
                    )}
                    {alunos.map((a, i) => {
                      const s = situacao(a);
                      const pct = a.meta ? Math.min(100, Math.round((a.feitas / a.meta) * 100)) : 0;
                      return (
                        <tr key={i}>
                          <td style={{ ...td, fontWeight: 600, color: a.inativo ? '#9ca3af' : '#111827' }}>
                            {a.nome}
                            {a.detalhe && (
                              <div style={{ fontSize: 12, fontWeight: 400, color: '#9ca3af', marginTop: 2 }}>{a.detalhe}</div>
                            )}
                          </td>
                          <td style={td}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div style={{ flex: 1, minWidth: 70, height: 8, borderRadius: 100, background: '#eceff2', overflow: 'hidden' }}>
                                <div style={{ width: `${pct}%`, height: '100%', background: pct >= 100 ? '#16a34a' : '#2f6f8f' }} />
                              </div>
                              <span style={{ fontSize: 13, fontWeight: 700, color: '#374151', minWidth: 52, textAlign: 'right' }}>
                                {a.feitas}{a.meta ? `/${a.meta}` : ''}
                              </span>
                            </div>
                            {a.extra > 0 && (
                              <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 3 }}>+{a.extra} fora da trilha</div>
                            )}
                          </td>
                          {c.evo && (() => {
                            // `novo` = o nome não existia no retrato de 7 dias atrás,
                            // ou seja, entrou na turma nesta semana. Mostrar "+0" para
                            // essa pessoa seria injusto: ela não teve a semana inteira.
                            const m = c.evo.porAluno.get(a.nome);
                            return (
                              <td style={td}>
                                {!m ? <span style={{ color: '#d1d5db' }}>—</span>
                                  : m.novo ? (
                                    <span style={{ fontSize: 12, fontWeight: 700, color: '#1d4ed8', background: '#eff6ff',
                                                   border: '1px solid #1d4ed822', borderRadius: 100, padding: '4px 10px' }}>
                                      novo
                                    </span>
                                  ) : (
                                    <span style={{ fontSize: 14, fontWeight: 700, color: m.delta > 0 ? '#15803d' : '#d1d5db' }}>
                                      {m.delta > 0 ? `+${m.delta}` : '0'}
                                    </span>
                                  )}
                              </td>
                            );
                          })()}
                          <td style={{ ...td, color: '#6b7280' }}>{fmtData(a.ultimaAt)}</td>
                          <td style={td}>
                            <span style={{ fontSize: 12, fontWeight: 700, color: s.cor, background: s.fundo,
                                           border: `1px solid ${s.cor}22`, borderRadius: 100, padding: '4px 10px' }}>
                              {s.rotulo}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {c.id === 'czarnikow' && campanha && (
                <div style={{ marginTop: 22 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 2px' }}>
                    Campanha · {campanha.semestre.label}
                  </h3>
                  <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 10px' }}>
                    {campanha.pontuaram} de {campanha.participantes} já pontuaram.
                    Só gente real — o login de demonstração e o acesso do professor ficam de fora.
                    O colaborador continua vendo apenas a própria posição; esta tabela é só sua.
                  </p>
                  <div style={{ overflowX: 'auto', background: '#fff', borderRadius: 12, border: '1px solid #ececf0' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 720 }}>
                      <thead>
                        <tr>
                          <th style={{ ...th, width: 52 }}>#</th>
                          <th style={th}>Colaborador</th>
                          <th style={th}>Pontos</th>
                          <th style={th}>Aula</th>
                          <th style={th}>Material</th>
                          <th style={th}>Lições</th>
                          <th style={th}>Dias ativos</th>
                          <th style={th}>Faixa</th>
                        </tr>
                      </thead>
                      <tbody>
                        {campanha.linhas.map((l) => (
                          <tr key={l.student} style={{ background: l.total > 0 ? '#fff' : '#fafafa' }}>
                            <td style={{ ...td, fontWeight: 800, color: l.posicao <= 5 && l.total > 0 ? '#b45309' : '#9ca3af' }}>
                              {l.posicao}º
                            </td>
                            <td style={{ ...td, fontWeight: 600, color: l.total > 0 ? '#111827' : '#9ca3af' }}>{l.nome}</td>
                            <td style={{ ...td, fontWeight: 800 }}>{l.total}</td>
                            <td style={{ ...td, color: '#6b7280' }}>
                              {l.pontosAula}
                              <span style={{ fontSize: 12, color: '#9ca3af' }}>
                                {' '}({l.aulas.general}t{l.aulas.private ? ` · ${l.aulas.private}p` : ''})
                              </span>
                            </td>
                            <td style={{ ...td, color: '#6b7280' }}>
                              {l.pontosMaterial}
                              {l.perdidoNoTeto > 0 && (
                                <span style={{ fontSize: 12, color: '#9ca3af' }}> (−{l.perdidoNoTeto} no teto)</span>
                              )}
                            </td>
                            <td style={{ ...td, color: '#6b7280' }}>{l.licoes}</td>
                            <td style={{ ...td, color: '#6b7280' }}>{l.diasAtivos}</td>
                            <td style={{ ...td, color: '#6b7280' }}>{l.tier || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 10, lineHeight: 1.5 }}>
                    Aula vale mais que material por desenho da campanha. &quot;t&quot; = aulas em turma,
                    &quot;p&quot; = particulares. O teto semanal do material corta quem concentra tudo
                    num dia só — quando isso acontece, aparece quanto foi cortado.
                    As aulas só entram aqui quando forem lançadas no progresso do aluno.
                  </p>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </main>
  );
}
