import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Inter } from 'next/font/google';
import { getSession, isCoordinator } from '../../../lib/auth';
import { getPainelCoordenacao } from '../../../lib/coordenacao';
import { getStatsByEmpresa } from '../../../lib/stats';
import { getRankingCampanha } from '../../../lib/czarnikow-campanha';
import { lerHistorico, evolucao } from '../../../lib/historico';
import PainelNavegacao from '../../../components/PainelNavegacao';

// Leitura de turma da coordenação: todos os clientes numa tela só.
//
// O painel do professor (/czarnikow/professor) responde "onde esta pessoa está
// e qual é a próxima aula". Esta tela responde outra coisa: quantos engajaram,
// quem parou, e há quanto tempo. É a visão que faltava — e a que alimenta o
// relatório mensal.
//
// Navegação por empresa: cada cliente é um botão (?c=<id>), e a visão geral
// junta num lugar só quem precisa de atenção. Tudo no servidor, sem estado no
// navegador — o link de uma empresa pode ser salvo e aberto direto.
//
// Só leitura, e só para coordenação. Rota nova: nenhum curso muda.

export const dynamic = 'force-dynamic';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

// Identidade Alumni (a mesma das propostas).
const AZUL = '#102a71';
const AZUL_ESCURO = '#0a1d52';
const VERMELHO = '#cb142d';
const AZUL_CLARO = '#e8edf8';
const FUNDO = '#f4f5f7';
const TEXTO = '#0b1020';
const CINZA = '#5b6275';
const CINZA_CLARO = '#9aa1b1';
const BORDA = '#e4e7ee';
const LOGO = 'https://alumni.org.br/wp-content/uploads/2025/12/logo_alumni-bco-1024x445.png';

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

// Como a linha do aluno deve ser lida de relance. `grupo` é o que os filtros usam.
function situacao(a) {
  // Cadastrado mas ainda sem senha/trilha: tecnicamente o acesso está fechado,
  // mas dizer "desativado" o põe no mesmo balaio de quem saiu da empresa.
  if (a.pendente) return { grupo: 'pendente', rotulo: 'a liberar', cor: '#1d4ed8', fundo: '#eff6ff' };
  if (a.inativo) return { grupo: 'inativo', rotulo: 'desativado', cor: '#8a90a0', fundo: '#f1f2f5' };
  if (!a.feitas) return { grupo: 'nunca', rotulo: 'nunca começou', cor: '#a15c07', fundo: '#fff7e6' };
  const d = diasDesde(a.ultimaAt);
  if (d !== null && d >= 14) return { grupo: 'parado', rotulo: `parado há ${d} dias`, cor: VERMELHO, fundo: '#fdecee' };
  if (d !== null && d >= 7) return { grupo: 'alerta', rotulo: `${d} dias sem abrir`, cor: '#a15c07', fundo: '#fff7e6' };
  return { grupo: 'ativo', rotulo: 'ativo', cor: '#016630', fundo: '#dcfce7' };
}

// Filtros da tela de empresa, na ordem em que aparecem.
const FILTROS = [
  { id: 'todos', rotulo: 'Todos' },
  { id: 'ativo', rotulo: 'Ativos' },
  { id: 'alerta', rotulo: '7+ dias sem abrir' },
  { id: 'parado', rotulo: 'Parados 14+' },
  { id: 'nunca', rotulo: 'Nunca começaram' },
];

function hrefDe(c, f) {
  const q = new URLSearchParams();
  if (c) q.set('c', c);
  if (f && f !== 'todos') q.set('f', f);
  const s = q.toString();
  return `/admin/alunos${s ? `?${s}` : ''}`;
}

export default async function PainelCoordenacao({ searchParams }) {
  const session = await getSession();
  if (!session) redirect('/login?next=%2Fadmin%2Falunos');
  if (!isCoordinator(session)) {
    return (
      <main style={{ padding: 40, fontFamily: 'system-ui', background: FUNDO, minHeight: '100vh' }}>
        <p>Acesso restrito à coordenação.</p>
      </main>
    );
  }

  const sp = (await searchParams) || {};

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
    const alunos = c.alunos.map((a) => ({ ...a, sit: situacao(a) }));
    const ativos = alunos.filter((a) => !a.inativo);
    const conta = (g) => ativos.filter((a) => a.sit.grupo === g).length;
    return {
      ...c,
      alunos,
      total: ativos.length,
      engajados: ativos.filter((a) => a.feitas > 0).length,
      licoes: ativos.reduce((s, a) => s + a.feitas, 0),
      acessos: acessos.get(c.id) || 0,
      evo: evo.get(c.id) || null,
      porGrupo: {
        ativo: conta('ativo'), alerta: conta('alerta'), parado: conta('parado'), nunca: conta('nunca'),
      },
      externo: /^https?:/.test(c.href),
    };
  });

  const atual = resumo.find((c) => c.id === sp.c) || null;
  const filtro = FILTROS.some((f) => f.id === sp.f) ? sp.f : 'todos';

  // Quem precisa de um toque, de todas as empresas: parados primeiro, depois
  // quem está há 7+ dias sem abrir. "Nunca começou" fica fora da lista — são
  // muitos no início de cada turma e afogariam quem de fato parou.
  const atencao = resumo
    .flatMap((c) => c.alunos
      .filter((a) => !a.inativo && (a.sit.grupo === 'parado' || a.sit.grupo === 'alerta'))
      .map((a) => ({ ...a, empresa: c.nome, empresaId: c.id, dias: diasDesde(a.ultimaAt) || 0 })))
    .sort((a, b) => b.dias - a.dias);

  const tot = {
    alunos: resumo.reduce((s, c) => s + c.total, 0),
    engajados: resumo.reduce((s, c) => s + c.engajados, 0),
    licoes: resumo.reduce((s, c) => s + c.licoes, 0),
    semana: temHistorico ? resumo.reduce((s, c) => s + (c.evo?.licoes || 0), 0) : null,
  };

  return (
    <main className={inter.className} style={{ background: FUNDO, minHeight: '100vh', color: TEXTO }}>
      <style>{`
        .pc-tabs { display:flex; gap:8px; overflow-x:auto; padding:14px 24px; scrollbar-width:thin; }
        .pc-tab { flex:0 0 auto; display:flex; align-items:center; gap:8px; padding:9px 14px; border-radius:999px;
                  font-size:14px; font-weight:600; text-decoration:none; color:${AZUL}; background:#fff;
                  border:1px solid ${BORDA}; transition:border-color .15s, background .15s; white-space:nowrap; }
        @media (min-width: 900px) { .pc-tabs { flex-wrap:wrap; overflow:visible; } }
        .pc-kpis { display:grid; grid-template-columns:repeat(auto-fit, minmax(150px, 1fr)); gap:12px; }
        .pc-tab:hover { border-color:${AZUL}; }
        .pc-card { display:block; text-decoration:none; color:inherit; background:#fff; border-radius:14px;
                   border:1px solid ${BORDA}; padding:18px; transition:border-color .15s, box-shadow .15s, transform .15s; }
        .pc-card:hover { border-color:${AZUL}; box-shadow:0 8px 24px rgba(16,42,113,.10); transform:translateY(-1px); }
        .pc-chip { display:inline-flex; align-items:center; gap:6px; padding:6px 12px; border-radius:999px; font-size:13px;
                   font-weight:600; text-decoration:none; color:${CINZA}; background:#fff; border:1px solid ${BORDA}; }
        .pc-chip:hover { border-color:${AZUL}; color:${AZUL}; }
        .pc-row:hover td { background:#fafbfd; }
        .pc-link { color:${AZUL}; font-weight:600; text-decoration:none; font-size:14px; }
        .pc-link:hover { text-decoration:underline; }
        details.pc-notas summary { cursor:pointer; color:${CINZA}; font-size:13px; font-weight:600; list-style:none; }
        details.pc-notas summary::-webkit-details-marker { display:none; }
        details.pc-notas summary::before { content:'+ '; color:${AZUL}; }
        details.pc-notas[open] summary::before { content:'– '; }
      `}</style>

      {/* Cabeçalho Alumni */}
      <header style={{ background: `linear-gradient(135deg, ${AZUL_ESCURO}, ${AZUL})`, color: '#fff', position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 3, background: VERMELHO }} />
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '22px 24px 24px', display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO} alt="Alumni" style={{ height: 30, width: 'auto' }} />
          <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,.25)' }} />
          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,.65)', fontWeight: 600 }}>
              Coordenação
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-.01em' }}>Evolução dos alunos</div>
          </div>
          <Link href="/admin" style={{ color: '#fff', fontSize: 13.5, fontWeight: 600, textDecoration: 'none',
                                      border: '1px solid rgba(255,255,255,.35)', borderRadius: 999, padding: '8px 14px' }}>
            Acessos por empresa →
          </Link>
        </div>
      </header>

      <PainelNavegacao inicialC={atual?.id || ''} inicialF={filtro} ids={resumo.map((c) => c.id)}
                       cores={{ azul: AZUL, azulClaro: AZUL_CLARO }}>
      {/* Uma empresa por botão */}
      <nav style={{ background: '#fff', borderBottom: `1px solid ${BORDA}`, position: 'sticky', top: 0, zIndex: 5 }}>
        <div className="pc-tabs" style={{ maxWidth: 1120, margin: '0 auto' }}>
          <a href={hrefDe(null)} className="pc-tab" data-nav-c="">Visão geral</a>
          {resumo.map((c) => {
            const alerta = c.porGrupo.parado + c.porGrupo.alerta;
            return (
              <a key={c.id} href={hrefDe(c.id)} className="pc-tab" data-nav-c={c.id}>
                {c.nome}
                <span style={{ fontSize: 12, fontWeight: 600, opacity: .7 }}>{c.engajados}/{c.total}</span>
                {(alerta > 0 || c.erro) && (
                  <span title={c.erro ? 'erro de leitura' : `${alerta} precisam de atenção`}
                        style={{ width: 8, height: 8, borderRadius: 99, background: VERMELHO, flex: '0 0 auto' }} />
                )}
              </a>
            );
          })}
        </div>
      </nav>

      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '28px 24px 72px' }}>
        <section data-painel="geral">
          <VisaoGeral resumo={resumo} atencao={atencao} tot={tot} temHistorico={temHistorico} from={from} to={to} />
        </section>
        {resumo.map((c) => (
          <section key={c.id} data-painel={c.id}>
            <Empresa c={c} campanha={c.id === 'czarnikow' ? campanha : null} />
          </section>
        ))}
      </div>
      </PainelNavegacao>
    </main>
  );
}

// ---------------------------------------------------------------- visão geral

function Kpi({ valor, rotulo, sub, destaque }) {
  return (
    <div style={{ background: '#fff', border: `1px solid ${BORDA}`, borderRadius: 14, padding: '16px 18px' }}>
      <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-.02em', color: destaque || AZUL, lineHeight: 1.1 }}>{valor}</div>
      <div style={{ fontSize: 13.5, color: CINZA, marginTop: 4, fontWeight: 500 }}>{rotulo}</div>
      {sub && <div style={{ fontSize: 12, color: CINZA_CLARO, marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function Barra({ pct, h = 6 }) {
  return (
    <div style={{ height: h, borderRadius: 99, background: '#eceff5', overflow: 'hidden' }}>
      <div style={{ width: `${pct}%`, height: '100%', borderRadius: 99, background: pct >= 100 ? '#16a34a' : AZUL }} />
    </div>
  );
}

function VisaoGeral({ resumo, atencao, tot, temHistorico, from, to }) {
  return (
    <>
      <div className="pc-kpis" style={{ marginBottom: 32 }}>
        <Kpi valor={`${tot.engajados}/${tot.alunos}`} rotulo="alunos engajados" sub="concluíram ao menos 1 lição" />
        <Kpi valor={tot.licoes} rotulo="lições concluídas" sub="acumulado, todas as empresas" />
        <Kpi valor={tot.semana === null ? '—' : `+${tot.semana}`} rotulo="nos últimos 7 dias"
             sub={tot.semana === null ? 'histórico ainda insuficiente' : 'lições concluídas na semana'} />
        <Kpi valor={atencao.length} rotulo="precisam de atenção" sub="7+ dias sem abrir o material"
             destaque={atencao.length ? VERMELHO : AZUL} />
      </div>

      <Titulo>Empresas</Titulo>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12, marginBottom: 36 }}>
        {resumo.map((c) => {
          const pct = c.total ? Math.round((c.engajados / c.total) * 100) : 0;
          return (
            <a key={c.id} href={hrefDe(c.id)} className="pc-card" data-nav-c={c.id}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: AZUL }}>{c.nome}</span>
                <span style={{ color: CINZA_CLARO, fontSize: 16 }}>→</span>
              </div>
              {c.erro ? (
                <div style={{ fontSize: 13, color: VERMELHO }}>Não consegui ler o progresso</div>
              ) : (
                <>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 8 }}>
                    <span style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-.02em', color: c.engajados ? TEXTO : '#c9cdd6' }}>{c.engajados}</span>
                    <span style={{ fontSize: 13, color: CINZA }}>de {c.total} engajados</span>
                  </div>
                  <Barra pct={pct} />
                  <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', fontSize: 12.5, color: CINZA, marginTop: 10 }}>
                    <span>{c.licoes} {c.licoes === 1 ? 'lição' : 'lições'}</span>
                    {c.evo && <span style={{ color: c.evo.licoes > 0 ? '#016630' : CINZA_CLARO, fontWeight: 600 }}>
                      {c.evo.licoes > 0 ? `+${c.evo.licoes}` : '0'} em 7 dias
                    </span>}
                    {(c.porGrupo.parado + c.porGrupo.alerta) > 0 && (
                      <span style={{ color: VERMELHO, fontWeight: 600 }}>{c.porGrupo.parado + c.porGrupo.alerta} em atenção</span>
                    )}
                  </div>
                </>
              )}
            </a>
          );
        })}
      </div>

      <Titulo sub="Quem abriu o material e parou — o toque do professor ou do RH faz diferença aqui. Quem nunca começou fica na tela de cada empresa.">
        Precisam de atenção
      </Titulo>
      {atencao.length === 0 ? (
        <p style={{ fontSize: 14, color: CINZA, background: '#fff', border: `1px solid ${BORDA}`, borderRadius: 12, padding: '16px 18px' }}>
          Ninguém parado há 7 dias ou mais. Boa semana.
        </p>
      ) : (
        <Tabela cabecalho={['Aluno', 'Empresa', 'Progresso', 'Última atividade', 'Situação']}>
          {atencao.map((a, i) => (
            <tr key={i} className="pc-row">
              <td style={td}><div style={{ fontWeight: 600 }}>{a.nome}</div></td>
              <td style={td}><a href={hrefDe(a.empresaId)} className="pc-link" data-nav-c={a.empresaId}>{a.empresa}</a></td>
              <td style={{ ...td, color: CINZA }}>{a.feitas}{a.meta ? `/${a.meta}` : ''}</td>
              <td style={{ ...td, color: CINZA }}>{fmtData(a.ultimaAt)}</td>
              <td style={td}><Selo s={a.sit} /></td>
            </tr>
          ))}
        </Tabela>
      )}

      <details className="pc-notas" style={{ marginTop: 32 }}>
        <summary>Como ler este painel</summary>
        <div style={{ fontSize: 13, color: CINZA, lineHeight: 1.65, marginTop: 10, maxWidth: 820 }}>
          <p style={{ margin: '0 0 8px' }}>
            Uma lição só conta como concluída quando o aluno termina os exercícios dela. Engajado = concluiu ao menos uma.
            Acessos são dos últimos 30 dias ({from} a {to}).
          </p>
          <p style={{ margin: '0 0 8px' }}>
            Nos cursos com login, acesso da coordenação e dos professores deixou de entrar na conta em 18/08/2026.
          </p>
          {!temHistorico && (
            <p style={{ margin: 0 }}>
              O movimento semanal aparece quando houver uma semana de retratos diários gravados pelo cron.
            </p>
          )}
        </div>
      </details>
    </>
  );
}

// ------------------------------------------------------------------- empresa

function Empresa({ c, campanha }) {
  const alunos = [...c.alunos]
    .sort((a, b) => (a.inativo - b.inativo) || (b.feitas - a.feitas) || a.nome.localeCompare(b.nome, 'pt-BR'));
  const pctEng = c.total ? Math.round((c.engajados / c.total) * 100) : 0;
  // Link comum (<a>), nunca o <Link> do Next: parte dos materiais é HTML
  // estático em /public (a Delta Ducon) e a navegação do Next não os abre.
  const extra = c.externo ? { target: '_blank', rel: 'noreferrer' } : {};

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 20 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-.02em', margin: 0, color: AZUL, flex: 1, minWidth: 200 }}>{c.nome}</h1>
        <a href={c.href} {...extra} style={{
          background: VERMELHO, color: '#fff', fontWeight: 600, fontSize: 14, textDecoration: 'none',
          borderRadius: 999, padding: '10px 18px',
        }}>
          Abrir o material →
        </a>
        {c.painel && (
          <a href={c.painel} style={{ color: AZUL, fontWeight: 600, fontSize: 14, textDecoration: 'none',
                                     border: `1px solid ${AZUL}`, borderRadius: 999, padding: '9px 16px' }}>
            Painel do professor →
          </a>
        )}
      </div>

      {c.erro && (
        <p style={{ fontSize: 13.5, color: '#8f0e20', background: '#fdecee', border: '1px solid #f6c3ca',
                    borderRadius: 12, padding: '12px 16px', margin: '0 0 20px' }}>
          Não consegui ler o progresso deste curso: {c.erro}
        </p>
      )}

      <div className="pc-kpis" style={{ marginBottom: 24 }}>
        <div style={{ background: '#fff', border: `1px solid ${BORDA}`, borderRadius: 14, padding: '16px 18px' }}>
          <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-.02em', color: AZUL, lineHeight: 1.1 }}>
            {c.engajados}<span style={{ fontSize: 17, color: CINZA_CLARO, fontWeight: 700 }}>/{c.total}</span>
          </div>
          <div style={{ fontSize: 13.5, color: CINZA, margin: '4px 0 10px', fontWeight: 500 }}>engajados · {pctEng}%</div>
          <Barra pct={pctEng} />
        </div>
        <Kpi valor={c.licoes} rotulo={c.externo ? "preparações de aula enviadas" : "lições concluídas"} />
        <Kpi valor={c.evo ? `+${c.evo.licoes}` : '—'} rotulo="nos últimos 7 dias"
             sub={c.evo ? null : 'histórico ainda insuficiente'} />
        <Kpi valor={c.externo ? '—' : c.acessos} rotulo="acessos em 30 dias" sub={c.contagem} />
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
        {FILTROS.map((f) => {
          const n = f.id === 'todos' ? c.alunos.length : c.porGrupo[f.id];
          if (f.id !== 'todos' && !n) return null;
          return (
            <a key={f.id} href={hrefDe(c.id, f.id)} className="pc-chip" data-nav-c={c.id} data-nav-f={f.id}>
              {f.rotulo} <span style={{ opacity: .6 }}>{n}</span>
            </a>
          );
        })}
      </div>

      <Tabela cabecalho={['Aluno', 'Progresso', c.evo ? '7 dias' : null, 'Última atividade', 'Situação']}>
        {alunos.length === 0 && (
          <tr><td style={{ ...td, color: CINZA_CLARO }} colSpan={5}>Nenhum aluno cadastrado.</td></tr>
        )}
        {alunos.map((a, i) => {
          const pct = a.meta ? Math.min(100, Math.round((a.feitas / a.meta) * 100)) : 0;
          // `novo` = o nome não existia no retrato de 7 dias atrás, ou seja,
          // entrou na turma nesta semana: "+0" seria injusto com essa pessoa.
          const m = c.evo?.porAluno.get(a.nome);
          return (
            <tr key={i} className="pc-row" data-grupo={a.sit.grupo}>
              <td style={{ ...td, color: a.inativo ? CINZA_CLARO : TEXTO }}>
                <div style={{ fontWeight: 600 }}>{a.nome}</div>
                {a.detalhe && <div style={{ fontSize: 12, color: CINZA_CLARO, marginTop: 2 }}>{a.detalhe}</div>}
              </td>
              <td style={{ ...td, minWidth: 180 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ flex: 1, minWidth: 70 }}>{a.meta ? <Barra pct={pct} h={8} /> : null}</div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: TEXTO, minWidth: 52, textAlign: 'right' }}>
                    {a.feitas}{a.meta ? `/${a.meta}` : ''}
                  </span>
                </div>
                {a.extra > 0 && <div style={{ fontSize: 12, color: CINZA_CLARO, marginTop: 3 }}>+{a.extra} fora da trilha</div>}
              </td>
              {c.evo && (
                <td style={td}>
                  {!m ? <span style={{ color: '#c9cdd6' }}>—</span>
                    : m.novo ? <span style={{ fontSize: 12, fontWeight: 700, color: AZUL, background: AZUL_CLARO, borderRadius: 99, padding: '4px 10px' }}>novo</span>
                    : <span style={{ fontSize: 14, fontWeight: 700, color: m.delta > 0 ? '#016630' : '#c9cdd6' }}>{m.delta > 0 ? `+${m.delta}` : '0'}</span>}
                </td>
              )}
              <td style={{ ...td, color: CINZA }}>{fmtData(a.ultimaAt)}</td>
              <td style={td}><Selo s={a.sit} /></td>
            </tr>
          );
        })}
      </Tabela>

      {c.aviso && (
        <details className="pc-notas" style={{ marginTop: 20 }}>
          <summary>Notas sobre os dados desta empresa</summary>
          <p style={{ fontSize: 13, color: CINZA, lineHeight: 1.65, margin: '10px 0 0', maxWidth: 820 }}>{c.aviso}</p>
        </details>
      )}

      {campanha && <Campanha campanha={campanha} />}
    </>
  );
}

function Campanha({ campanha }) {
  return (
    <section style={{ marginTop: 36 }}>
      <Titulo sub={`${campanha.pontuaram} de ${campanha.participantes} já pontuaram. Só gente real — o login de demonstração e o acesso do professor ficam de fora. O colaborador continua vendo apenas a própria posição; esta tabela é só sua.`}>
        {campanha.campanha.short} · {campanha.semestre.label}
      </Titulo>
      <Tabela cabecalho={['#', 'Colaborador', 'Pontos', 'Aula', 'Material', 'Lições', 'Dias ativos', 'Faixa']}>
        {campanha.linhas.map((l) => (
          <tr key={l.student} className="pc-row" style={{ background: l.total > 0 ? '#fff' : '#fafbfc' }}>
            <td style={{ ...td, fontWeight: 800, color: l.posicao <= 5 && l.total > 0 ? VERMELHO : CINZA_CLARO }}>{l.posicao}º</td>
            <td style={{ ...td, fontWeight: 600, color: l.total > 0 ? TEXTO : CINZA_CLARO }}>{l.nome}</td>
            <td style={{ ...td, fontWeight: 800, color: AZUL }}>{l.total}</td>
            <td style={{ ...td, color: CINZA }}>
              {l.pontosAula}
              <span style={{ fontSize: 12, color: CINZA_CLARO }}>
                {' '}({l.aulas.general}t{l.aulas.private ? ` · ${l.aulas.private}p` : ''})
              </span>
            </td>
            <td style={{ ...td, color: CINZA }}>
              {l.pontosMaterial}
              {l.perdidoNoTeto > 0 && <span style={{ fontSize: 12, color: CINZA_CLARO }}> (−{l.perdidoNoTeto} no teto)</span>}
            </td>
            <td style={{ ...td, color: CINZA }}>{l.licoes}</td>
            <td style={{ ...td, color: CINZA }}>{l.diasAtivos}</td>
            <td style={{ ...td, color: CINZA }}>{l.tier || '—'}</td>
          </tr>
        ))}
      </Tabela>
      <p style={{ fontSize: 12, color: CINZA_CLARO, marginTop: 10, lineHeight: 1.5 }}>
        Aula vale mais que material por desenho da campanha. &quot;t&quot; = aulas em turma,
        &quot;p&quot; = particulares. O teto semanal do material corta quem concentra tudo
        num dia só — quando isso acontece, aparece quanto foi cortado.
        As aulas só entram aqui quando forem lançadas no progresso do aluno.
      </p>
    </section>
  );
}

// ------------------------------------------------------------------- peças

const td = { padding: '12px 14px', fontSize: 14, borderBottom: `1px solid #f0f1f5`, verticalAlign: 'middle' };

function Titulo({ children, sub }) {
  return (
    <div style={{ margin: '0 0 12px' }}>
      <h2 style={{ fontSize: 17, fontWeight: 700, margin: 0, color: AZUL }}>{children}</h2>
      {sub && <p style={{ fontSize: 13, color: CINZA, margin: '4px 0 0', lineHeight: 1.55, maxWidth: 820 }}>{sub}</p>}
    </div>
  );
}

function Tabela({ cabecalho, children }) {
  const th = {
    textAlign: 'left', padding: '11px 14px', fontSize: 11, color: CINZA, textTransform: 'uppercase',
    letterSpacing: '.6px', borderBottom: `1px solid ${BORDA}`, fontWeight: 700, background: '#fafbfd',
  };
  return (
    <div style={{ overflowX: 'auto', background: '#fff', borderRadius: 14, border: `1px solid ${BORDA}` }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 620 }}>
        <thead><tr>{cabecalho.filter(Boolean).map((h) => <th key={h} style={th}>{h}</th>)}</tr></thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

function Selo({ s }) {
  return (
    <span style={{ display: 'inline-block', fontSize: 12, fontWeight: 700, color: s.cor, background: s.fundo,
                   borderRadius: 999, padding: '4px 10px', whiteSpace: 'nowrap' }}>
      {s.rotulo}
    </span>
  );
}
