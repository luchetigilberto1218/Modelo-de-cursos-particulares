'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

/*
  Painel do professor (Czarnikow · ambiente de teste).

  A tela responde a uma pergunta só, e por PESSOA: quem é este aluno e qual é a
  próxima aula dele. Deliberadamente NÃO há leitura de turma — nada de "quem
  sumiu", ranking ou engajamento. Essa visão geral é do coordenador; o professor
  chega para dar aula a um aluno e precisa abrir a lição certa.

  O Teacher Guide já mora dentro da lição, então o botão leva direto para lá.
*/

const C = {
  navy: '#1B2736', navyLight: '#2B3B4F', accent: '#2AAAE2', accentHover: '#1C96CC',
  accentLight: '#E6F5FC', text: '#1d1d1f', gray: '#86868b', grayLight: '#e4e9ef',
  bg: '#f5f5f7', gold: '#B08D57', green: '#248A3D',
};
const FONT = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif";

function fmtDate(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

// "hoje" / "ontem" / "há 5 dias" — o professor lê tempo relativo mais rápido que data.
function since(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const days = Math.floor((Date.now() - d.getTime()) / 86400000);
  if (days <= 0) return 'hoje';
  if (days === 1) return 'ontem';
  if (days < 30) return `há ${days} dias`;
  const months = Math.round(days / 30);
  return months === 1 ? 'há 1 mês' : `há ${months} meses`;
}

export default function TeacherPanel({ clientId, theme }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [busca, setBusca] = useState('');
  const logos = theme?.logos || {};

  useEffect(() => {
    fetch('/api/czarnikow-teste/teacher', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then(setData)
      .catch(() => setError('Não consegui carregar os alunos. Recarregue a página.'));
  }, []);

  const alunos = useMemo(() => {
    const all = data?.students || [];
    const q = busca.trim().toLowerCase();
    if (!q) return all;
    const norm = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    return all.filter((a) => norm(a.name).includes(norm(q))
      || (a.tracks || []).some((t) => norm(t).includes(norm(q))));
  }, [data, busca]);

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: FONT, color: C.text, WebkitFontSmoothing: 'antialiased' }}>

      <header style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        maxWidth: 1080, margin: '0 auto', padding: '20px 24px', gap: 12, flexWrap: 'wrap',
      }}>
        <Link href={`/${clientId}`} style={{ fontSize: 15, color: C.accent, textDecoration: 'none', fontWeight: 500 }}>
          ← Voltar ao curso
        </Link>
        {logos.client && (
          <img src={logos.client} alt="Czarnikow" style={{ height: 24, objectFit: 'contain' }}
            onError={(e) => { e.target.style.display = 'none'; }} />
        )}
      </header>

      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px 12px' }}>
        <div style={{
          background: `linear-gradient(135deg, ${C.navy}, ${C.navyLight})`,
          borderRadius: 24, padding: 'clamp(26px, 4.5vw, 40px)', color: '#fff', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${C.accent}, ${C.gold})` }} />
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase', color: C.accent, margin: '0 0 10px' }}>
            Painel do professor
          </p>
          <h1 style={{ fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 700, letterSpacing: -1, lineHeight: 1.12, margin: '0 0 10px' }}>
            Onde cada aluno está — e qual é a próxima aula
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.72)', lineHeight: 1.55, margin: 0, maxWidth: 640 }}>
            Abra o aluno que você vai atender e clique na próxima lição. O roteiro de aula
            (Teacher Guide) está dentro dela, junto com os exercícios que o aluno leva de tarefa.
          </p>
        </div>
      </section>

      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '16px 24px 60px' }}>

        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por nome ou trilha…"
          style={{
            width: '100%', maxWidth: 360, padding: '11px 14px', fontSize: 15, fontFamily: FONT,
            border: `1px solid ${C.grayLight}`, borderRadius: 12, background: '#fff',
            color: C.text, outline: 'none', marginBottom: 18,
          }}
        />

        {error && (
          <p style={{ color: '#B3261E', fontSize: 15 }}>{error}</p>
        )}
        {!data && !error && (
          <p style={{ color: C.gray, fontSize: 15 }}>Carregando alunos…</p>
        )}
        {data && alunos.length === 0 && (
          <p style={{ color: C.gray, fontSize: 15 }}>Nenhum aluno com esse nome.</p>
        )}

        <div style={{ display: 'grid', gap: 14 }}>
          {alunos.map((a) => <AlunoCard key={a.student} aluno={a} clientId={clientId} />)}
        </div>
      </section>
    </div>
  );
}

function AlunoCard({ aluno, clientId }) {
  const principal = (aluno.blocks || []).find((b) => b.designated) || (aluno.blocks || [])[0] || null;
  const outros = (aluno.blocks || []).filter((b) => b !== principal && b.done > 0);
  const atividade = since(aluno.lastAt);
  // unidades que o próprio aluno declarou prontas para a aula particular
  const prontas = aluno.ready || [];

  return (
    <article style={{
      background: '#fff', borderRadius: 18, border: `1px solid ${C.grayLight}`,
      padding: 'clamp(18px, 3vw, 24px)',
    }}>
      {/* ── identificação ─────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 14, flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontSize: 19, fontWeight: 650, letterSpacing: -0.3, margin: '0 0 6px' }}>
            {aluno.name}
            {aluno.demo && (
              <span style={{
                marginLeft: 8, fontSize: 11, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase',
                color: C.gold, background: '#FBF4E9', borderRadius: 6, padding: '3px 7px', verticalAlign: 'middle',
              }}>demonstração</span>
            )}
            {prontas.length > 0 && (
              <span style={{
                marginLeft: 8, fontSize: 11, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase',
                color: '#fff', background: C.green, borderRadius: 6, padding: '3px 8px', verticalAlign: 'middle',
              }}>
                {prontas.length === 1 ? 'pediu 1 aula' : `pediu ${prontas.length} aulas`}
              </span>
            )}
          </h2>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            {aluno.stage && (
              <span style={{
                fontSize: 12, fontWeight: 600, color: C.navy, background: C.grayLight,
                borderRadius: 6, padding: '4px 9px',
              }}>{aluno.stage}</span>
            )}
            {(aluno.tracks || []).map((t) => (
              <span key={t} style={{
                fontSize: 12, fontWeight: 600, color: '#1C6BA8', background: C.accentLight,
                borderRadius: 6, padding: '4px 9px',
              }}>{t}</span>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'right', minWidth: 130 }}>
          <p style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5, margin: 0, color: C.navy }}>
            {aluno.lessonsDone}
          </p>
          <p style={{ fontSize: 12, color: C.gray, margin: '2px 0 0' }}>
            {aluno.lessonsDone === 1 ? 'lição concluída' : 'lições concluídas'}
          </p>
          {/* Sem cor de alerta: antes do lançamento todo mundo está sem atividade, e
              "quem sumiu" é leitura de coordenação, não do professor. */}
          <p style={{ fontSize: 12, color: C.gray, margin: '6px 0 0' }}>
            {atividade ? `Última atividade ${atividade}` : 'Ainda sem atividade no material'}
          </p>
        </div>
      </div>

      {/* ── a próxima aula ────────────────────────────────────────────────── */}
      {principal && (
        <div style={{
          marginTop: 16, padding: 16, borderRadius: 14,
          background: C.bg, border: `1px solid ${C.grayLight}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14, flexWrap: 'wrap',
        }}>
          <div style={{ minWidth: 240, flex: 1 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.1, textTransform: 'uppercase', color: C.gray, margin: '0 0 6px' }}>
              Próxima aula · {principal.trackName} · {principal.levelName}
            </p>
            {principal.next ? (
              <>
                <p style={{ fontSize: 16, fontWeight: 600, margin: '0 0 4px', lineHeight: 1.35 }}>
                  {principal.next.order}. {principal.next.title}
                </p>
                <p style={{ fontSize: 13, color: C.gray, margin: 0 }}>
                  {principal.done} de {principal.total} concluídas nesta trilha
                  {principal.jaEmAula > 0 && (
                    <> · <strong style={{ color: C.text, fontWeight: 600 }}>
                      {principal.jaEmAula === 1 ? 'a 1ª já foi dada em aula' : `as ${principal.jaEmAula} primeiras já foram dadas em aula`}
                    </strong></>
                  )}
                </p>
              </>
            ) : (
              <p style={{ fontSize: 15, fontWeight: 600, color: C.green, margin: 0 }}>
                Trilha completa — {principal.total} de {principal.total}. Combine a próxima trilha com o aluno.
              </p>
            )}
          </div>

          {principal.next && (
            <Link
              href={`/${clientId}/lesson/${principal.next.num}`}
              style={{
                background: C.accent, color: '#fff', textDecoration: 'none',
                fontSize: 14, fontWeight: 600, padding: '11px 18px', borderRadius: 10,
                whiteSpace: 'nowrap', minHeight: 44, display: 'inline-flex', alignItems: 'center',
              }}
            >
              Abrir a lição →
            </Link>
          )}
        </div>
      )}

      {/* ── o que o aluno declarou pronto ─────────────────────────────────── */}
      {prontas.length > 0 && (
        <div style={{ marginTop: 14, padding: 16, borderRadius: 14, background: '#F0FBF4', border: '1px solid #9AE6B4' }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.1, textTransform: 'uppercase', color: C.green, margin: '0 0 10px' }}>
            O aluno se declarou pronto para a aula
          </p>
          <div style={{ display: 'grid', gap: 10 }}>
            {prontas.slice(0, 3).map((r) => <Pronta key={r.num} r={r} clientId={clientId} />)}
          </div>
          {prontas.length > 3 && (
            <p style={{ fontSize: 12.5, color: C.gray, margin: '10px 0 0' }}>
              e mais {prontas.length - 3} {prontas.length - 3 === 1 ? 'unidade' : 'unidades'} declarada{prontas.length - 3 === 1 ? '' : 's'}.
            </p>
          )}
        </div>
      )}

      {/* ── outras trilhas em que ele já estudou ──────────────────────────── */}
      {outros.length > 0 && (
        <p style={{ fontSize: 13, color: C.gray, margin: '12px 0 0', lineHeight: 1.6 }}>
          Também estudou:{' '}
          {outros.map((b, i) => (
            <span key={`${b.level}|${b.track}`}>
              {i > 0 && ' · '}
              <strong style={{ color: C.text, fontWeight: 600 }}>{b.trackName}</strong>
              {' '}({b.levelName}) {b.done}/{b.total}
              {b.next && (
                <>
                  {' — próxima: '}
                  <Link href={`/${clientId}/lesson/${b.next.num}`} style={{ color: C.accent, textDecoration: 'none' }}>
                    {b.next.order}. {b.next.title}
                  </Link>
                </>
              )}
            </span>
          ))}
        </p>
      )}

      {aluno.lastAt && (
        <p style={{ fontSize: 12, color: C.gray, margin: '10px 0 0' }}>
          Última lição concluída em {fmtDate(aluno.lastAt)}
        </p>
      )}
    </article>
  );
}

/* Uma unidade que o aluno declarou pronta.
   A declaração vem SEMPRE com a evidência: o botão do aluno é um pedido de aula,
   não um atestado de estudo. Quando ele declara sem ter praticado (`weak`), o
   professor vê isso aqui e já entra na aula sabendo que precisa retomar — que é
   justamente o que o botão sozinho, sem evidência, esconderia. */
function Pronta({ r, clientId }) {
  const praticou = typeof r.answered === 'number' && typeof r.total === 'number' && r.total > 0;
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12,
      flexWrap: 'wrap', background: '#fff', border: `1px solid ${C.grayLight}`,
      borderRadius: 10, padding: '12px 14px',
    }}>
      <div style={{ minWidth: 220, flex: 1 }}>
        <p style={{ fontSize: 15, fontWeight: 600, margin: '0 0 4px', lineHeight: 1.35 }}>
          {r.order ? `${r.order}. ` : ''}{r.title}
          {r.weak && (
            <span style={{
              marginLeft: 8, fontSize: 10.5, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase',
              color: '#8C6A00', background: '#FFFBF2', border: '1px solid #E8D9B5',
              borderRadius: 5, padding: '2px 6px', verticalAlign: 'middle',
            }}>prática incompleta</span>
          )}
        </p>
        <p style={{ fontSize: 12.5, color: C.gray, margin: 0, lineHeight: 1.5 }}>
          {r.trackName && <>{r.trackName} · {r.levelName} · </>}
          {praticou
            ? <>{r.answered} de {r.total} exercícios{typeof r.acc === 'number' ? ` · ${Math.round(r.acc * 100)}% de acerto` : ''}</>
            : 'sem exercícios de correção automática nesta unidade'}
          {r.at && <> · declarou {since(r.at)}</>}
        </p>
      </div>
      <Link
        href={`/${clientId}/lesson/${r.num}`}
        style={{
          background: '#fff', color: C.navy, textDecoration: 'none', border: `1px solid ${C.grayLight}`,
          fontSize: 13.5, fontWeight: 600, padding: '9px 14px', borderRadius: 9,
          whiteSpace: 'nowrap', minHeight: 40, display: 'inline-flex', alignItems: 'center',
        }}
      >
        Abrir →
      </Link>
    </div>
  );
}
