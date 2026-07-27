'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useCampaign } from './progress';
import {
  SEMESTER, SCORING, TIERS,
  TRACK_BADGE_HALF, TRACK_BADGE_FULL, projectSemester,
} from './campaign';

/*
  Campanha Ago–Dez 2026 — página do participante (Czarnikow · ambiente de teste).

  Mostra a pontuação real (calculada no servidor a partir do progresso), o tier,
  os badges, o ranking aberto e um simulador de semestre. Só existe para o
  cliente `czarnikow-teste`; nenhum outro curso é afetado.
*/

const C = {
  navy: '#1B2736', navyLight: '#2B3B4F', accent: '#2AAAE2', accentHover: '#1C96CC',
  accentLight: '#E6F5FC', text: '#1d1d1f', gray: '#86868b', grayLight: '#e4e9ef',
  bg: '#f5f5f7', gold: '#B08D57', green: '#248A3D',
};
const FONT = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif";

const TIER_COLOR = {
  loading: '#8FA3B8',
  underway: '#2AAAE2',
  oncourse: '#1B6BA8',
  delivered: '#B08D57',
};

export default function CampaignPage({ clientId, theme }) {
  const { data, loading } = useCampaign(true);
  const logos = theme?.logos || {};
  const me = data?.me || null;
  const ranking = data?.ranking || [];

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

      {/* ── Hero: quem sou eu na campanha ─────────────────────────────────── */}
      <section style={{
        maxWidth: 1080, margin: '0 auto', padding: '0 24px',
      }}>
        <div style={{
          background: `linear-gradient(135deg, ${C.navy}, ${C.navyLight})`,
          borderRadius: 24, padding: 'clamp(28px, 5vw, 44px)', color: '#fff', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${C.accent}, ${C.gold})` }} />

          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase', color: C.accent, margin: '0 0 10px' }}>
            Campanha · {SEMESTER.label}
          </p>
          <h1 style={{ fontSize: 'clamp(28px, 4.5vw, 42px)', fontWeight: 700, letterSpacing: -1, lineHeight: 1.1, margin: '0 0 10px' }}>
            Sua evolução no inglês, medida de verdade
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.72)', lineHeight: 1.5, margin: '0 0 26px', maxWidth: 620 }}>
            Cada aula e cada lição concluída somam pontos. A pontuação é
            {' '}<strong style={{ color: '#fff' }}>60% aula, 40% material</strong> — porque o material
            reforça o que você pratica em aula, e nunca substitui a aula.
          </p>

          {loading && <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Carregando sua pontuação…</p>}

          {me && (
            <>
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 22 }}>
                <HeroStat label="Seus pontos" value={me.score.total} big />
                <HeroStat label="Tier atual" value={me.score.tier.name} tint={TIER_COLOR[me.score.tier.id]} />
                <HeroStat label="Posição" value={me.position ? `${me.position}º` : '—'} />
                <HeroStat label="Lições concluídas" value={me.score.lessonsDone} />
              </div>

              <TierTrack score={me.score} />
            </>
          )}
        </div>
      </section>

      {me && (
        <section style={{ maxWidth: 1080, margin: '0 auto', padding: '28px 24px 0' }}>
          <SplitCard score={me.score} classesAreDemo={me.classesAreDemo} isDemoLogin={me.isDemoLogin} realLessonsDone={me.realLessonsDone} />
        </section>
      )}

      {/* ── O que são os níveis ───────────────────────────────────────────── */}
      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '28px 24px 0' }}>
        <TiersExplained current={me?.score?.tier?.id} />
      </section>

      {/* ── Simulador ─────────────────────────────────────────────────────── */}
      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '28px 24px 0' }}>
        <Simulator />
      </section>

      {/* ── Badges ────────────────────────────────────────────────────────── */}
      {me && (
        <section style={{ maxWidth: 1080, margin: '0 auto', padding: '28px 24px 0' }}>
          <Card title="Badges de competência" subtitle={`Bronze com ${TRACK_BADGE_HALF} lições da trilha, completo com ${TRACK_BADGE_FULL}.`}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 12 }}>
              {me.badges.map((b) => <Badge key={b.track} b={b} />)}
            </div>
          </Card>
        </section>
      )}

      {/* ── Ranking ───────────────────────────────────────────────────────── */}
      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '28px 24px 0' }}>
        <Card
          title="Ranking da campanha"
          subtitle="Aberto: todos veem todos. Foi decisão do RH — a comparação puxa o grupo para cima."
        >
          {ranking.length === 0 ? (
            <p style={{ color: C.gray, margin: 0 }}>O ranking aparece assim que houver participantes.</p>
          ) : (
            <Ranking rows={ranking} meId={me?.student} hasDemo={data?.hasDemo} />
          )}
        </Card>
      </section>

      {/* ── Regras ────────────────────────────────────────────────────────── */}
      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '28px 24px 80px' }}>
        <Card title="Como os pontos são contados" subtitle="Regras fechadas com o RH da Czarnikow.">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            <RuleGroup
              tone="accent"
              title="Aula · 60% da campanha"
              note="Sem teto. A política da CZ é de no mínimo 2 aulas por semana."
              rules={[
                [`${SCORING.classPrivate} pts`, 'por aula particular'],
                [`${SCORING.classGeneral} pts`, 'por aula em turma'],
              ]}
            />
            <RuleGroup
              tone="plain"
              title="Material · 40% da campanha"
              note={`Teto de ${SCORING.materialDailyCap} pts por dia e ${SCORING.materialWeeklyCap} pts por semana: para fechar a semana no material é preciso estudar em pelo menos três dias diferentes.`}
              rules={[
                [`${SCORING.lessonDone} pts`, 'por lição concluída'],
                [`até ${SCORING.accuracyMax} pt`, 'conforme o acerto na 1ª tentativa'],
                [`${SCORING.activeDay} pt`, 'por dia com estudo válido'],
                [`${SCORING.streakBonus} pts`, 'por 7 dias seguidos na mesma trilha — único bônus que passa do teto'],
              ]}
            />
          </div>

          <div style={{
            marginTop: 18, padding: '16px 18px', borderRadius: 14,
            background: C.accentLight, border: `1px solid #BBD6F2`, fontSize: 14.5, lineHeight: 1.6, color: '#33443F',
          }}>
            <strong style={{ color: C.navy }}>Por que 60/40?</strong> Em 20 semanas, quem segue a política
            da CZ acumula cerca de <strong>280 pts de aula</strong> contra <strong>180 pts de material</strong>.
            O material puxa a constância; a aula continua sendo o que decide a campanha.
            Aulas particulares só empurram esse peso ainda mais para o lado da aula.
          </div>

          <p style={{ fontSize: 13.5, color: C.gray, lineHeight: 1.6, margin: '16px 0 0' }}>
            <strong style={{ color: C.navy }}>Anti-gaming:</strong> o acerto só conta na primeira tentativa,
            e os dois tetos do material valem para tudo somado. Na prática, vinte lições numa tarde só
            valem o teto de um dia — o que pontua é voltar em dias diferentes.
            A presença em aula é lançada pela Alumni; não é o participante quem declara.
          </p>
        </Card>
      </section>
    </div>
  );
}

/* ── hero ─────────────────────────────────────────────────────────────────── */
function HeroStat({ label, value, big, tint }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)',
      borderRadius: 14, padding: '14px 18px', minWidth: 130,
    }}>
      <div style={{ fontSize: 11.5, letterSpacing: 0.6, textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', fontWeight: 600, marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ fontSize: big ? 30 : 19, fontWeight: 700, lineHeight: 1.1, color: tint || '#fff' }}>{value}</div>
    </div>
  );
}

function TierTrack({ score }) {
  const max = TIERS[TIERS.length - 1].min * 1.15;
  const pct = Math.min(100, (score.total / max) * 100);
  return (
    <div>
      <div style={{ position: 'relative', height: 10, borderRadius: 999, background: 'rgba(255,255,255,0.14)', marginBottom: 12 }}>
        <div style={{
          height: '100%', width: `${pct}%`, borderRadius: 999,
          background: `linear-gradient(90deg, ${C.accent}, ${C.gold})`, transition: 'width .6s ease',
        }} />
        {TIERS.slice(1).map((t) => (
          <span key={t.id} style={{
            position: 'absolute', top: -3, left: `${Math.min(100, (t.min / max) * 100)}%`,
            width: 2, height: 16, background: 'rgba(255,255,255,0.35)',
          }} />
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
        {TIERS.map((t) => {
          const reached = score.total >= t.min;
          return (
            <div key={t.id} style={{ flex: '1 1 120px', minWidth: 110 }}>
              <div style={{
                fontSize: 13, fontWeight: 700,
                color: reached ? (TIER_COLOR[t.id] || '#fff') : 'rgba(255,255,255,0.4)',
              }}>
                {reached ? '● ' : '○ '}{t.name}
              </div>
              <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.45)' }}>{t.min}+ pts</div>
            </div>
          );
        })}
      </div>
      {score.nextTier && (
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', margin: '16px 0 0' }}>
          Faltam <strong style={{ color: '#fff' }}>{score.toNext} pts</strong> para{' '}
          <strong style={{ color: TIER_COLOR[score.nextTier.id] }}>{score.nextTier.name}</strong>.
        </p>
      )}
    </div>
  );
}

/* ── o que são os níveis ──────────────────────────────────────────────────── */
function TiersExplained({ current }) {
  return (
    <Card
      title="Os quatro níveis"
      subtitle="Eles seguem a viagem de uma carga — o vocabulário de casa."
    >
      <p style={{ fontSize: 14.5, lineHeight: 1.65, color: C.text, margin: '0 0 20px', maxWidth: 720 }}>
        O nível diz <strong>até onde você levou o seu inglês neste semestre</strong> — não o seu nível de
        proficiência. Alguém que está começando o idioma pode chegar a <em>Delivered</em>, e alguém
        avançado pode ficar em <em>Loading</em> se não aparecer. O que ele mede é percurso: aula
        frequentada e estudo feito.
      </p>

      <div style={{ display: 'grid', gap: 10 }}>
        {TIERS.map((t) => {
          const isCurrent = t.id === current;
          const color = TIER_COLOR[t.id];
          return (
            <div key={t.id} style={{
              display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap',
              padding: '14px 16px', borderRadius: 12,
              background: isCurrent ? C.accentLight : '#fbfbfd',
              border: `1px solid ${isCurrent ? '#BBD6F2' : C.grayLight}`,
            }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: color, flexShrink: 0 }} />
              <strong style={{ fontSize: 15.5, color, minWidth: 96 }}>{t.name}</strong>
              <span style={{ fontSize: 13, color: C.gray, fontWeight: 600, minWidth: 78 }}>
                {t.min}+ pts
              </span>
              <span style={{ flex: '1 1 240px', fontSize: 14, color: C.text, lineHeight: 1.5 }}>{t.desc}</span>
              {isCurrent && (
                <span style={{
                  fontSize: 10.5, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase',
                  padding: '3px 9px', borderRadius: 999, border: `1px solid ${C.accent}`, color: C.accent,
                }}>
                  você está aqui
                </span>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}

/* ── 60/40 do participante ────────────────────────────────────────────────── */
function SplitCard({ score, classesAreDemo, isDemoLogin, realLessonsDone }) {
  const total = score.total || 1;
  const classW = (score.classPoints / total) * 100;
  return (
    <Card title="Sua composição de pontos" subtitle="A campanha é desenhada para ficar por volta de 60% aula / 40% material.">
      <div style={{ display: 'flex', height: 34, borderRadius: 10, overflow: 'hidden', border: `1px solid ${C.grayLight}` }}>
        <div style={{
          width: `${classW}%`, background: C.navy, color: '#fff', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: 13, fontWeight: 700, transition: 'width .5s ease',
        }}>
          {score.split.classPct > 12 ? `Aula ${score.split.classPct}%` : ''}
        </div>
        <div style={{
          flex: 1, background: C.accentLight, color: C.navy, display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: 13, fontWeight: 700,
        }}>
          {score.split.materialPct > 12 ? `Material ${score.split.materialPct}%` : ''}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginTop: 18 }}>
        <MiniStat label="Pontos de aula" value={score.classPoints}
          hint={`${score.classes.general} em turma · ${score.classes.private} particulares`} />
        <MiniStat label="Pontos de material" value={score.materialPoints}
          hint={`${score.lessonsDone} lições · ${score.activeDays} dias de estudo`} />
        {score.streaks > 0 && (
          <MiniStat label="Sequências de 7 dias" value={score.streaks} hint="Bônus de constância." tint={C.green} />
        )}
      </div>

      {(classesAreDemo || isDemoLogin) && (
        <p style={{ fontSize: 13, color: C.gray, margin: '16px 0 0', lineHeight: 1.5 }}>
          ⓘ Este login entra na campanha já em andamento: as aulas e o histórico de estudo anteriores são
          {' '}<strong>dados de demonstração</strong>, para mostrar a campanha em regime.
          {realLessonsDone > 0 && ` As ${realLessonsDone} lições que você concluiu de verdade somam por cima.`}
          {' '}Na campanha real, a Alumni lança a presença de cada colaborador e o histórico é só o do próprio aluno.
        </p>
      )}
    </Card>
  );
}

/* ── simulador ────────────────────────────────────────────────────────────── */
function Simulator() {
  const [general, setGeneral] = useState(2);
  const [priv, setPriv] = useState(0);
  const [lessons, setLessons] = useState(2);
  const p = useMemo(
    () => projectSemester({ generalPerWeek: general, privatePerWeek: priv, lessonsPerWeek: lessons }),
    [general, priv, lessons],
  );

  return (
    <Card
      title="Simule o seu semestre"
      subtitle={`Escolha o ritmo que você pretende manter nas ${SEMESTER.weeks} semanas da campanha.`}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, alignItems: 'start' }}>
        <div style={{ display: 'grid', gap: 18 }}>
          <Slider label="Aulas em turma por semana" value={general} min={0} max={4} onChange={setGeneral} />
          <Slider label="Aulas particulares por semana" value={priv} min={0} max={3} onChange={setPriv} />
          <Slider label="Lições de material por semana" value={lessons} min={0} max={6} onChange={setLessons} />
        </div>

        <div style={{
          background: C.navy, borderRadius: 16, padding: '22px 24px', color: '#fff',
        }}>
          <div style={{ fontSize: 11.5, letterSpacing: 0.8, textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', fontWeight: 700 }}>
            Projeção do semestre
          </div>
          <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: -1.5, margin: '6px 0 2px' }}>{p.total} pts</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: TIER_COLOR[p.tier.id], marginBottom: 16 }}>{p.tier.name}</div>

          <div style={{ display: 'flex', height: 26, borderRadius: 8, overflow: 'hidden', marginBottom: 10 }}>
            <div style={{ width: `${p.classPct}%`, background: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>
              {p.classPct}%
            </div>
            <div style={{ flex: 1, background: 'rgba(255,255,255,0.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>
              {p.materialPct}%
            </div>
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
            Aula {p.classPoints} pts · Material {p.materialPoints} pts
            {p.nextTier && <><br />Faltam {p.toNext} pts para {p.nextTier.name}.</>}
          </div>
        </div>
      </div>
    </Card>
  );
}

function Slider({ label, value, min, max, onChange }) {
  return (
    <label style={{ display: 'block' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>{label}</span>
        <span style={{ fontSize: 18, fontWeight: 700, color: C.accent }}>{value}</span>
      </div>
      <input
        type="range" min={min} max={max} step={1} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: '100%', accentColor: C.accent, cursor: 'pointer' }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: C.gray, marginTop: 2 }}>
        <span>{min}</span><span>{max}</span>
      </div>
    </label>
  );
}

/* ── badges ───────────────────────────────────────────────────────────────── */
function Badge({ b }) {
  const earned = !!b.level;
  const full = b.level === 'full';
  return (
    <div style={{
      padding: '14px 16px', borderRadius: 14,
      background: earned ? (full ? '#FFF8EC' : C.accentLight) : '#fff',
      border: `1px solid ${earned ? (full ? '#E3C48A' : '#BBD6F2') : C.grayLight}`,
      opacity: earned ? 1 : 0.72,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <span style={{ fontSize: 16 }}>{full ? '🏅' : earned ? '🎖️' : '○'}</span>
        <strong style={{ fontSize: 14.5, color: earned ? C.navy : C.gray }}>{b.name}</strong>
      </div>
      <div style={{ fontSize: 12.5, color: C.gray }}>
        {b.count} lições
        {b.next ? ` · faltam ${b.next - b.count} para o próximo nível` : ' · trilha completa'}
      </div>
    </div>
  );
}

/* ── ranking ──────────────────────────────────────────────────────────────── */
function Ranking({ rows, meId, hasDemo }) {
  return (
    <>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, minWidth: 560 }}>
          <thead>
            <tr style={{ textAlign: 'left', color: C.gray, fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.6 }}>
              <th style={th}>#</th>
              <th style={th}>Participante</th>
              <th style={{ ...th, textAlign: 'right' }}>Aula</th>
              <th style={{ ...th, textAlign: 'right' }}>Material</th>
              <th style={{ ...th, textAlign: 'right' }}>Total</th>
              <th style={th}>Tier</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const isMe = r.student === meId;
              return (
                <tr key={r.student} style={{
                  background: isMe ? C.accentLight : 'transparent',
                  borderTop: `1px solid ${C.grayLight}`,
                }}>
                  <td style={{ ...td, fontWeight: 700, color: r.position <= 3 ? C.gold : C.gray }}>{r.position}</td>
                  <td style={td}>
                    <strong style={{ color: C.navy }}>{r.name}</strong>
                    {isMe && <span style={pill(C.accent)}>você</span>}
                    {r.demo && <span style={pill(C.gray)}>demo</span>}
                  </td>
                  <td style={{ ...td, textAlign: 'right', color: C.gray }}>{r.classPoints}</td>
                  <td style={{ ...td, textAlign: 'right', color: C.gray }}>{r.materialPoints}</td>
                  <td style={{ ...td, textAlign: 'right', fontWeight: 700 }}>{r.total}</td>
                  <td style={{ ...td, color: TIER_COLOR[r.tier.id], fontWeight: 600, fontSize: 13 }}>{r.tier.name}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {hasDemo && (
        <p style={{ fontSize: 13, color: C.gray, margin: '14px 0 0', lineHeight: 1.5 }}>
          ⓘ Os participantes marcados como <strong>demo</strong> são colaboradores fictícios, aqui só para
          mostrar como o ranking se comporta. Eles somem quando a lista real da Czarnikow entrar.
        </p>
      )}
    </>
  );
}

const th = { padding: '8px 10px', fontWeight: 600 };
const td = { padding: '11px 10px' };
function pill(color) {
  return {
    marginLeft: 8, fontSize: 10.5, fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase',
    padding: '2px 7px', borderRadius: 999, border: `1px solid ${color}`, color,
  };
}

/* ── blocos genéricos ─────────────────────────────────────────────────────── */
function Card({ title, subtitle, children }) {
  return (
    <div style={{ background: '#fff', border: `1px solid ${C.grayLight}`, borderRadius: 20, padding: 'clamp(20px, 3vw, 28px)' }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: -0.4, margin: '0 0 4px', color: C.navy }}>{title}</h2>
      {subtitle && <p style={{ fontSize: 14, color: C.gray, margin: '0 0 20px', lineHeight: 1.5 }}>{subtitle}</p>}
      {children}
    </div>
  );
}

function MiniStat({ label, value, hint, tint }) {
  return (
    <div style={{ padding: '14px 16px', background: '#fbfbfd', border: `1px solid ${C.grayLight}`, borderRadius: 12 }}>
      <div style={{ fontSize: 11.5, letterSpacing: 0.5, textTransform: 'uppercase', color: C.gray, fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 700, color: tint || C.navy, margin: '4px 0 2px' }}>{value}</div>
      {hint && <div style={{ fontSize: 12.5, color: C.gray, lineHeight: 1.4 }}>{hint}</div>}
    </div>
  );
}

function RuleGroup({ title, note, rules, tone }) {
  const accent = tone === 'accent';
  return (
    <div style={{
      padding: '18px 20px', borderRadius: 16,
      background: accent ? C.navy : '#fbfbfd',
      color: accent ? '#fff' : C.text,
      border: `1px solid ${accent ? C.navy : C.grayLight}`,
    }}>
      <h3 style={{ fontSize: 15.5, fontWeight: 700, margin: '0 0 12px', color: accent ? '#fff' : C.navy }}>{title}</h3>
      <div style={{ display: 'grid', gap: 8 }}>
        {rules.map(([pts, what], i) => (
          <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'baseline', fontSize: 14.5 }}>
            <strong style={{ color: accent ? C.accent : C.navy, minWidth: 66 }}>{pts}</strong>
            <span style={{ color: accent ? 'rgba(255,255,255,0.8)' : C.text }}>{what}</span>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 13, lineHeight: 1.5, margin: '14px 0 0', color: accent ? 'rgba(255,255,255,0.6)' : C.gray }}>
        {note}
      </p>
    </div>
  );
}
