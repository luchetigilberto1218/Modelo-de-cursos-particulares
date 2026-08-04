'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useCampaign } from './progress';
import { SEMESTER, SCORING, TIERS, projectSemester } from './campaign';

/*
  Campanha Ago–Dez 2026 — página do participante (Czarnikow · ambiente de teste).

  Mostra a pontuação real (calculada no servidor a partir do progresso), a etapa,
  a posição do participante e um simulador de semestre. Só existe para o cliente
  `czarnikow-teste`; nenhum outro curso é afetado.

  A campanha é FECHADA: cada colaborador vê apenas a si mesmo. Da comparação com
  o grupo sobra só o número da posição ("4º de 12"), sem nome de ninguém — a API
  nem chega a mandar a lista.

  A ÚNICA progressão do participante são as quatro etapas (Loading → Underway →
  On Course → Delivered). Não há badge de competência por trilha: mais um sistema
  de nomes só confundiria quem lê a tela.
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
  const standing = data?.standing || null;

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
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.55, margin: '-14px 0 26px', maxWidth: 620 }}>
            O material conta na hora. <strong style={{ color: 'rgba(255,255,255,0.85)' }}>As aulas são
            lançadas uma vez por mês</strong>, junto com o relatório de assiduidade: as aulas de um mês
            entram no começo do mês seguinte.
          </p>

          {loading && <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Carregando sua pontuação…</p>}

          {me && (
            <>
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 22 }}>
                <HeroStat label="Seus pontos" value={me.score.total} big />
                <HeroStat label="Etapa atual" value={me.score.tier.name} tint={TIER_COLOR[me.score.tier.id]} />
                {/* enquanto ninguém pontuou, "1º de 20" para os 20 não informa nada */}
                <HeroStat
                  label="Sua posição"
                  value={me.allTied ? '—' : (me.position ? `${me.position}º` : '—')}
                  hint={me.allTied ? 'todos empatados' : (me.participants ? `de ${me.participants}` : null)}
                />
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

      {/* ── O que são as etapas ───────────────────────────────────────────── */}
      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '28px 24px 0' }}>
        <TiersExplained current={me?.score?.tier?.id} />
      </section>

      {/* ── Simulador ─────────────────────────────────────────────────────── */}
      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '28px 24px 0' }}>
        <Simulator />
      </section>

      {/* ── Sua posição (sem expor ninguém) ───────────────────────────────── */}
      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '28px 24px 0' }}>
        <Card
          title="Onde você está na campanha"
          subtitle="Sua pontuação é sua. Ninguém vê a sua, e você não vê a de ninguém — só a sua posição no grupo."
        >
          {!standing || !standing.position ? (
            <p style={{ color: C.gray, margin: 0 }}>Sua posição aparece assim que a campanha começar.</p>
          ) : (
            <Standing s={standing} />
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
              note="Sem teto. A política da CZ é de no mínimo 2 aulas por semana. A presença é lançada pela Alumni uma vez por mês, junto com o relatório de assiduidade — as aulas de um mês aparecem aqui no começo do mês seguinte."
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
function HeroStat({ label, value, big, tint, hint }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)',
      borderRadius: 14, padding: '14px 18px', minWidth: 130,
    }}>
      <div style={{ fontSize: 11.5, letterSpacing: 0.6, textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', fontWeight: 600, marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ fontSize: big ? 30 : 19, fontWeight: 700, lineHeight: 1.1, color: tint || '#fff' }}>
        {value}
        {hint && <span style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.55)', marginLeft: 5 }}>{hint}</span>}
      </div>
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

/* ── o que são as etapas ──────────────────────────────────────────────────── */
function TiersExplained({ current }) {
  return (
    <Card
      title="As quatro etapas"
      subtitle="Elas seguem a viagem de uma carga — o vocabulário de casa."
    >
      <p style={{ fontSize: 14.5, lineHeight: 1.65, color: C.text, margin: '0 0 20px', maxWidth: 720 }}>
        A etapa diz <strong>até onde você levou o seu inglês neste semestre</strong> — não o seu nível de
        inglês. Quem está começando o idioma pode chegar a <em>Delivered</em>, e quem já é
        avançado pode ficar em <em>Loading</em> se não aparecer. O que ela mede é percurso: aula
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
  // Presença de aula é lançada UMA VEZ POR MÊS, junto com o relatório de
  // assiduidade. Enquanto o primeiro lançamento não acontece, mostrar uma barra
  // "Material 100%" logo abaixo de um título que promete 60% aula faria a tela
  // contradizer a própria regra — parece defeito, e não é.
  const semAulaAinda = score.classPoints === 0;
  return (
    <Card title="Sua composição de pontos" subtitle="A campanha é desenhada para ficar por volta de 60% aula / 40% material.">
      {semAulaAinda ? (
        <div style={{
          padding: '16px 18px', borderRadius: 12, background: C.accentLight,
          border: `1px solid ${C.grayLight}`, fontSize: 14.5, lineHeight: 1.6, color: C.navy,
        }}>
          <strong>Suas aulas ainda não foram lançadas neste mês.</strong> A presença é registrada pela
          Alumni <strong>uma vez por mês</strong>, junto com o relatório de assiduidade — as aulas de um
          mês entram no começo do mês seguinte. Por isso a barra de composição só aparece depois do
          primeiro lançamento. Seus pontos de material já estão contando normalmente.
        </div>
      ) : (
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
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginTop: 18 }}>
        <MiniStat label="Pontos de aula" value={score.classPoints}
          hint={semAulaAinda
            ? 'lançado 1× por mês pela Alumni'
            : `${score.classes.general} em turma · ${score.classes.private} particulares`} />
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

/* ── posição (campanha fechada) ───────────────────────────────────────────────
   Substitui o antigo ranking aberto. O participante vê a própria colocação e
   quanto do grupo ficou atrás dele — nunca quem são os outros nem quanto fizeram.
   A API sequer envia a lista: só position, participants e aheadOfPct. */
function Standing({ s }) {
  const { position, participants, aheadOfPct, demoCount, allTied } = s;
  // marcador na régua: 1º na ponta direita, último na esquerda
  const pct = participants > 1 ? ((participants - position) / (participants - 1)) * 100 : 100;

  // Todo mundo com a mesma pontuação (é o retrato do dia do lançamento): mostrar
  // "1º de 20" junto de "à frente de 0% do grupo" seria contraditório.
  if (allTied) {
    return (
      <>
        <p style={{ fontSize: 20, fontWeight: 650, color: C.navy, margin: '0 0 8px', letterSpacing: -0.3 }}>
          Os {participants} participantes estão empatados.
        </p>
        <p style={{ fontSize: 14.5, color: C.text, lineHeight: 1.55, margin: 0 }}>
          A campanha começou agora — a sua colocação aparece assim que as primeiras
          pontuações entrarem.
        </p>
        <p style={{ fontSize: 13, color: C.gray, margin: '18px 0 0', lineHeight: 1.55 }}>
          ⓘ A campanha é <strong>fechada</strong>: sua pontuação não aparece para nenhum colega, e a de
          ninguém aparece para você. A posição existe só para você medir o próprio ritmo.
        </p>
      </>
    );
  }

  return (
    <>
      <div style={{ display: 'flex', gap: 26, alignItems: 'baseline', flexWrap: 'wrap', marginBottom: 22 }}>
        <div>
          <span style={{ fontSize: 46, fontWeight: 700, letterSpacing: -2, color: C.navy, lineHeight: 1 }}>{position}º</span>
          <span style={{ fontSize: 16, color: C.gray, marginLeft: 8 }}>de {participants} participantes</span>
        </div>
        {aheadOfPct !== null && aheadOfPct !== undefined && (
          <div style={{ fontSize: 14.5, color: C.text, lineHeight: 1.5 }}>
            Você está à frente de <strong style={{ color: C.navy }}>{aheadOfPct}%</strong> do grupo.
          </div>
        )}
      </div>

      {/* régua: último → 1º, com o marcador do participante */}
      <div style={{ position: 'relative', height: 12, borderRadius: 999, background: C.grayLight, marginBottom: 10 }}>
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: `${pct}%`,
          borderRadius: 999, background: `linear-gradient(90deg, ${C.accentLight}, ${C.accent})`, transition: 'width .6s ease',
        }} />
        <div style={{
          position: 'absolute', left: `${pct}%`, top: -4, transform: 'translateX(-50%)',
          width: 20, height: 20, borderRadius: '50%', background: C.navy, border: '3px solid #fff',
          boxShadow: '0 1px 6px rgba(27,39,54,0.3)', transition: 'left .6s ease',
        }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: C.gray }}>
        <span>{participants}º</span><span>1º</span>
      </div>

      <p style={{ fontSize: 13, color: C.gray, margin: '18px 0 0', lineHeight: 1.55 }}>
        ⓘ A campanha é <strong>fechada</strong>: sua pontuação não aparece para nenhum colega, e a de
        ninguém aparece para você. A posição existe só para você medir o próprio ritmo.
        {demoCount > 0 && (
          <> Hoje {demoCount} dos {participants} participantes são <strong>fictícios</strong>, para a
          contagem fazer sentido antes de a lista real da Czarnikow entrar.</>
        )}
      </p>
    </>
  );
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
