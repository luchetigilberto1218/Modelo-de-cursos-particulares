'use client';

import Link from 'next/link';
import { useCampaign } from './progress';
import { SEMESTER, TIERS } from './campaign';

/*
  Faixa compacta da campanha, para o hub e as páginas de trilha.
  Mostra pontos, tier e posição, e leva para /campanha. Só é montada pelo
  ambiente de teste da Czarnikow — nenhum outro curso a renderiza.
*/

const C = {
  navy: '#1B2736', navyLight: '#2B3B4F', accent: '#2AAAE2',
  gold: '#B08D57', grayLight: '#e4e9ef',
};
const TIER_COLOR = { foundation: '#8FA3B8', working: '#2AAAE2', business: '#7FC4EC', advisor: '#D8B678' };

export default function PointsWidget({ clientId, compact = false }) {
  const { data, loading } = useCampaign(true);
  const me = data?.me;
  if (loading || !me) return null;

  const s = me.score;
  const max = TIERS[TIERS.length - 1].min * 1.15;
  const pct = Math.min(100, (s.total / max) * 100);

  return (
    <Link
      href={`/${clientId}/campanha`}
      style={{
        display: 'block', textDecoration: 'none', color: '#fff',
        background: `linear-gradient(135deg, ${C.navy}, ${C.navyLight})`,
        borderRadius: 16, padding: compact ? '14px 18px' : '18px 22px',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 200px', minWidth: 0 }}>
          <div style={{
            fontSize: 10.5, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase',
            color: C.accent, marginBottom: 4,
          }}>
            Campanha · {SEMESTER.label}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ fontSize: compact ? 22 : 26, fontWeight: 700, letterSpacing: -0.6 }}>{s.total} pts</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: TIER_COLOR[s.tier.id] || '#fff' }}>{s.tier.name}</span>
            {me.position && (
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>{me.position}º no ranking</span>
            )}
          </div>
        </div>

        <div style={{ flex: '1 1 220px', minWidth: 160 }}>
          <div style={{ height: 8, borderRadius: 999, background: 'rgba(255,255,255,0.14)', overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${pct}%`, borderRadius: 999,
              background: `linear-gradient(90deg, ${C.accent}, ${C.gold})`, transition: 'width .6s ease',
            }} />
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 7 }}>
            {s.nextTier ? `Faltam ${s.toNext} pts para ${s.nextTier.name}` : 'Tier máximo alcançado'}
          </div>
        </div>

        <span style={{
          fontSize: 13, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap',
          border: '1px solid rgba(255,255,255,0.25)', borderRadius: 999, padding: '8px 16px',
        }}>
          Ver campanha →
        </span>
      </div>
    </Link>
  );
}
