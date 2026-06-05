'use client';

import AudioPlayer from '../AudioPlayer';
import Icon from './RacionalIcon';

/**
 * LessonBonus — bônus de leitura EM INGLÊS, agora DENTRO da aula (uma tela do fluxo).
 *
 * Renderiza lesson.bonus:
 *   { category, level ('A2+'|'B1'), readMin, title, body(HTML EN), glossary[], takeaway }
 *
 * Diferente do antigo BonusReader (PT, fora da aula), este é leitura nivelada em
 * inglês — A2+ na 1ª metade do programa, B1 na 2ª — com áudio e mini-glossário.
 */
export default function LessonBonus({ bonus, voice = 'us-female', accent = '#102A71', T = (pt) => pt }) {
  if (!bonus) return null;
  return (
    <div className="rc-lb">
      <div className="rc-lb-flag" style={{ background: accent }}>
        <Icon name="book" size={14} /> {T('Bônus de leitura', 'Bonus read')} · {bonus.level || 'A2+'}
      </div>
      {bonus.category && (
        <div className="rc-lb-cat">{bonus.category}{bonus.readMin ? ` · ${bonus.readMin} min` : ''}</div>
      )}

      <article className="rc-lb-body rc-prose" dangerouslySetInnerHTML={{ __html: bonus.body }} />

      <div className="rc-lb-listen">
        <div className="rc-mini-label" style={{ marginBottom: 8 }}>
          {T('Ouça e treine o ouvido', 'Listen and train your ear')}
        </div>
        <AudioPlayer text={stripTags(bonus.body)} voiceType={voice} rate={0.92} label={T('Ouvir o texto', 'Listen to the text')} small />
      </div>

      {bonus.glossary?.length > 0 && (
        <div className="rc-lb-gloss">
          <div className="rc-mini-label" style={{ marginBottom: 6 }}>{T('Glossário', 'Glossary')}</div>
          {bonus.glossary.map((g, i) => (
            <div key={i} className="rc-lb-gloss-row">
              <span className="rc-lb-gloss-en">{g.en}</span>
              <span className="rc-lb-gloss-pt">— {g.pt}</span>
            </div>
          ))}
        </div>
      )}

      {bonus.takeaway && (
        <div className="rc-lb-takeaway" style={{ borderLeftColor: accent }}>
          <strong>{T('Para levar:', 'Takeaway:')}</strong> {bonus.takeaway}
        </div>
      )}
    </div>
  );
}

function stripTags(html = '') {
  return String(html).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}
