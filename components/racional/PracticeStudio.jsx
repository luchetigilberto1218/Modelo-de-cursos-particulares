'use client';

import AudioPlayer from '../AudioPlayer';
import SpeakingExercise from '../SpeakingExercise';
import Icon from './RacionalIcon';

/**
 * PracticeStudio — aula de PRÁTICA do Fábio (1h30, só produção, com o professor).
 *
 * Renderiza lesson.practice: sem teoria nova, apenas blocos de produção
 * (drill / role play / conversação / debate / argumentação) para feedback do
 * professor. Cada bloco com modelo de fala (áudio) e microfone quando faz sentido.
 * Aditivo — só aparece quando a aula tem `practice`.
 */
const TYPE_LABEL = {
  drill: 'Drill', roleplay: 'Role play', conversation: 'Conversação',
  debate: 'Debate', argumentation: 'Argumentação', situation: 'Situação',
};

export default function PracticeStudio({ practice, voice = 'us-male', level = 'starter', accent = '#102A71' }) {
  if (!practice) return null;
  return (
    <div className="rc-pstudio">
      <div className="rc-pstudio-tag" style={{ color: accent }}>
        <Icon name="mic" size={15} /> Estúdio de prática · só produção, com o professor
      </div>
      {practice.lead && <p className="rc-pstudio-lead">{practice.lead}</p>}
      {practice.setup && <div className="rc-box italic" style={{ borderLeftColor: accent }}>{practice.setup}</div>}

      <div className="rc-pstudio-blocks">
        {(practice.blocks || []).map((b, i) => (
          <div key={i} className="rc-pblock">
            <div className="rc-pblock-head">
              <span className="rc-pblock-type" style={{ background: accent }}>{TYPE_LABEL[b.type] || b.type}</span>
              <span className="rc-pblock-title">{b.title}</span>
            </div>
            <p className="rc-pblock-prompt">{b.prompt}</p>
            {b.model && (
              <div className="rc-pblock-model">
                <span className="rc-mini-label" style={{ marginBottom: 4 }}>Modelo</span>
                <div className="rc-readaloud">"{b.model}"</div>
                <div style={{ marginTop: 8 }}>
                  <AudioPlayer text={b.model} voiceType={voice} rate={0.9} label="Ouvir modelo" small />
                </div>
              </div>
            )}
            {(b.type === 'roleplay' || b.type === 'conversation' || b.type === 'drill') && (
              <SpeakingExercise mode="free" levelId={level} lang="en-US" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
