'use client';

import Link from 'next/link';
import AudioPlayer from './AudioPlayer';

const HISTORY_PARAGRAPHS = [
  "Czarnikow was founded in London in 1861 by Caesar Czarnikow, a young German sugar broker who saw an opportunity in the growing British market. From a small office in the City, he began trading sugar from the Caribbean and built trust with refiners across Europe.",
  "Over the following decades, Czarnikow became one of the most respected names in the global sugar trade. The company expanded into new markets, opened offices in different continents, and survived wars, crises and the constant changes of international commerce.",
  "Today, Czarnikow is much more than a sugar broker. It is a smart supply chain partner, helping clients source products, manage financial risk, handle logistics and make better decisions with data and insight.",
  "The group now operates from 13 offices around the world, with teams in Europe, the Americas, Asia and Africa. Czarnikow works with agriculture, food, energy and manufacturing clients, connecting producers and buyers across more than 90 countries.",
  "After more than 160 years, the company keeps the same core idea it started with: trust, expertise and long-term relationships. That is why Czarnikow is still here — and still growing."
];

const FULL_HISTORY = HISTORY_PARAGRAPHS.join(' ');

const LEVELS = [
  {
    id: 'confidence',
    name: 'Confidence & Essentials',
    shortName: 'Confidence',
    tag: 'A1 – A2',
    description: 'Build the essentials. Everyday business English with core grammar, practical vocabulary and clear, slow audio.',
    color: '#2AAAE2'
  },
  {
    id: 'rise',
    name: 'Rise',
    shortName: 'Rise',
    tag: 'B1 – B2',
    description: 'Take it further. Real business scenarios, natural pace, phrasal verbs and modals for confident communication.',
    color: '#1C8FBF'
  },
  {
    id: 'apex',
    name: 'Apex',
    shortName: 'Apex',
    tag: 'C1 – C2',
    description: 'Master the nuance. Sophisticated vocabulary, formal register and advanced discussion on complex topics.',
    color: '#0F6E99'
  }
];

export default function LevelHub({ course, theme, clientId }) {
  const c = theme?.colors || {};

  return (
    <>
      <style jsx>{`
        .cz-hero {
          background: linear-gradient(135deg, ${c.dark || '#32373C'} 0%, ${c.navy || '#1B2736'} 100%);
          color: #fff;
          padding: 72px 24px 96px;
          position: relative;
          overflow: hidden;
        }
        .cz-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 85% 20%, rgba(42,170,226,0.18), transparent 50%);
          pointer-events: none;
        }
        .cz-hero-inner {
          max-width: 1100px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }
        .cz-eyebrow {
          display: inline-block;
          padding: 6px 14px;
          border-radius: 999px;
          background: rgba(42,170,226,0.15);
          color: ${c.accent || '#2AAAE2'};
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 1.4px;
          text-transform: uppercase;
          margin-bottom: 20px;
          border: 1px solid rgba(42,170,226,0.3);
        }
        .cz-title {
          font-size: clamp(32px, 5vw, 54px);
          font-weight: 800;
          line-height: 1.1;
          margin: 0 0 16px;
          max-width: 820px;
        }
        .cz-subtitle {
          font-size: clamp(15px, 1.6vw, 18px);
          opacity: 0.75;
          max-width: 680px;
          line-height: 1.6;
          font-weight: 300;
        }
        .cz-section {
          max-width: 1100px;
          margin: 0 auto;
          padding: 72px 24px;
        }
        .cz-section-label {
          font-size: 11px;
          letter-spacing: 1.6px;
          text-transform: uppercase;
          color: ${c.accent || '#2AAAE2'};
          font-weight: 700;
          margin-bottom: 10px;
        }
        .cz-section h2 {
          font-size: clamp(24px, 3vw, 34px);
          color: ${c.dark || '#32373C'};
          margin: 0 0 28px;
          font-weight: 700;
        }
        .cz-welcome {
          background: ${c.offWhite || '#F9FAFB'};
          border-left: 4px solid ${c.accent || '#2AAAE2'};
          padding: 36px 40px;
          border-radius: 8px;
          color: ${c.text || '#2D3748'};
          font-size: 15.5px;
          line-height: 1.75;
        }
        .cz-welcome p {
          margin: 0 0 14px;
        }
        .cz-welcome p:last-child {
          margin-bottom: 0;
        }
        .cz-welcome strong {
          color: ${c.dark || '#32373C'};
        }
        .cz-levels-label {
          color: ${c.accent || '#2AAAE2'};
          font-weight: 600;
        }
        .cz-history-wrap {
          background: #fff;
          border: 1px solid ${c.grayLight || '#E4E9EF'};
          border-radius: 12px;
          padding: 36px 40px;
          box-shadow: 0 4px 20px rgba(27,39,54,0.04);
        }
        .cz-history-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          gap: 16px;
          flex-wrap: wrap;
        }
        .cz-history-head h3 {
          margin: 0;
          font-size: 20px;
          color: ${c.dark || '#32373C'};
          font-weight: 700;
        }
        .cz-history-body {
          color: ${c.text || '#2D3748'};
          font-size: 15px;
          line-height: 1.8;
        }
        .cz-history-body p {
          margin: 0 0 14px;
        }
        .cz-history-body p:last-child {
          margin-bottom: 0;
        }
        .cz-levels-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          margin-top: 8px;
        }
        .cz-level-card {
          display: block;
          background: #fff;
          border: 1px solid ${c.grayLight || '#E4E9EF'};
          border-radius: 14px;
          padding: 32px 28px;
          text-decoration: none;
          color: inherit;
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
          position: relative;
          overflow: hidden;
        }
        .cz-level-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--level-color);
        }
        .cz-level-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 18px 40px rgba(27,39,54,0.10);
          border-color: var(--level-color);
        }
        .cz-level-tag {
          display: inline-block;
          font-size: 10px;
          letter-spacing: 1.4px;
          text-transform: uppercase;
          font-weight: 700;
          color: var(--level-color);
          background: rgba(42,170,226,0.1);
          padding: 4px 10px;
          border-radius: 999px;
          margin-bottom: 14px;
        }
        .cz-level-name {
          font-size: 22px;
          font-weight: 700;
          color: ${c.dark || '#32373C'};
          margin: 0 0 10px;
        }
        .cz-level-desc {
          color: ${c.gray || '#6B7A8F'};
          font-size: 14px;
          line-height: 1.6;
          margin: 0 0 20px;
        }
        .cz-level-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: var(--level-color);
          font-weight: 600;
          font-size: 14px;
        }
        .cz-tagline {
          text-align: center;
          padding: 48px 24px 72px;
          color: ${c.gray || '#6B7A8F'};
          font-size: 14px;
          letter-spacing: 0.5px;
        }
        .cz-tagline strong {
          color: ${c.accent || '#2AAAE2'};
        }
      `}</style>

      <section className="cz-hero">
        <div className="cz-hero-inner">
          <span className="cz-eyebrow">Alumni · Czarnikow</span>
          <h1 className="cz-title">Plataforma de Estudos<br />Czarnikow English Programme</h1>
          <p className="cz-subtitle">
            Fluência aplicada ao negócio. Um ambiente de estudos desenhado para apoiar as suas aulas particulares de inglês corporativo — antes, durante e depois de cada encontro.
          </p>
        </div>
      </section>

      <section className="cz-section">
        <div className="cz-section-label">Bem-vindos</div>
        <h2>Bem-vindos à Plataforma de Estudos Alumni | Czarnikow</h2>
        <div className="cz-welcome">
          <p>Sejam bem-vindos.</p>
          <p>
            Este é o ambiente de estudos que apoiará suas aulas particulares, conectando você e seu professor aos conteúdos que serão trabalhados em cada encontro.
          </p>
          <p><strong>Como utilizar.</strong> Os materiais estão organizados por nível:</p>
          <p>
            <span className="cz-levels-label">Essential &amp; Confidence</span> · <span className="cz-levels-label">Rise</span> · <span className="cz-levels-label">Apex</span>
          </p>
          <p>
            Recomendamos que você siga sempre os conteúdos do seu nível para garantir consistência na evolução. Caso queira explorar outros materiais, fique à vontade.
          </p>
          <p>
            <strong>Trilhas de desenvolvimento.</strong> Além do nível, sua jornada também pode ser direcionada pela sua área de atuação. Se você atua em Trade Finance, por exemplo, utilize essa trilha como preparação para suas aulas e discussões.
          </p>
          <p>
            <strong>Conteúdos complementares.</strong> A plataforma também oferece trilhas para estudo independente, como <em>General Business</em> e <em>UK &amp; England</em> (contexto profissional e cultural).
          </p>
          <p><strong>Boa jornada.</strong> Aproveite a plataforma e conte conosco no seu desenvolvimento.</p>
          <p style={{ marginTop: 18, color: c.accent || '#2AAAE2', fontWeight: 600 }}>
            Alumni — Fluência aplicada ao negócio
          </p>
        </div>
      </section>

      <section className="cz-section" style={{ paddingTop: 0 }}>
        <div className="cz-section-label">About Czarnikow</div>
        <h2>A short story — from 1861 to today</h2>
        <div className="cz-history-wrap">
          <div className="cz-history-head">
            <h3>The Czarnikow story</h3>
            <AudioPlayer
              text={FULL_HISTORY}
              rate={0.9}
              label="Listen"
              voiceType="james"
            />
          </div>
          <div className="cz-history-body">
            {HISTORY_PARAGRAPHS.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="cz-section" style={{ paddingTop: 0 }}>
        <div className="cz-section-label">Choose your level</div>
        <h2>Start where you are</h2>
        <div className="cz-levels-grid">
          {LEVELS.map((level) => (
            <Link
              key={level.id}
              href={`/${clientId}/level/${level.id}`}
              className="cz-level-card"
              style={{ '--level-color': level.color }}
            >
              <span className="cz-level-tag">{level.tag}</span>
              <h3 className="cz-level-name">{level.name}</h3>
              <p className="cz-level-desc">{level.description}</p>
              <span className="cz-level-cta">Enter {level.shortName} →</span>
            </Link>
          ))}
        </div>
      </section>

      <div className="cz-tagline">
        <strong>Alumni</strong> · Fluência aplicada ao negócio
      </div>
    </>
  );
}
