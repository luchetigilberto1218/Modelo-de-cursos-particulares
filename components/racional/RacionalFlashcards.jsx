'use client';

import { useMemo, useState } from 'react';
import AudioPlayer from '../AudioPlayer';
import SpeakingExercise from '../SpeakingExercise';
import Icon from './RacionalIcon';

/**
 * RacionalFlashcards — deck de flashcards business, montado a partir do vocab
 * da própria aula + tema. Mistura três tipos de carta:
 *   • word     → frente: termo EN (com áudio) · verso: tradução PT + exemplo EN
 *   • picture  → "descreva a cena" do universo do aluno usando o vocab da aula
 *               (fala livre, sem resposta certa)
 *
 * Tudo derivado do que a aula já tem (vocab/título/tema) — não depende de
 * conteúdo novo no JSON. Se a aula trouxer `lesson.flashcards`, ele é mesclado.
 */
export default function RacionalFlashcards({
  vocab = [],
  title = '',
  image = null,
  scene = '',
  voice = 'us-female',
  level = 'starter',
  accent = '#102A71',
  T = (pt) => pt,
}) {
  const cards = useMemo(() => {
    const words = (vocab || [])
      .filter((v) => v && v.en)
      .map((v) => ({ kind: 'word', en: v.en, pt: v.pt, example: v.example }));
    // carta de imagem/cena: descrever usando 4–6 palavras-chave da aula
    const keyWords = words.slice(0, 6).map((w) => w.en);
    const pictureScene = scene || defaultScene(title);
    const picture = { kind: 'picture', scene: pictureScene, words: keyWords, image };
    return [...words, picture];
  }, [vocab, title, scene, image]);

  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const total = cards.length;
  const card = cards[idx];

  function go(n) {
    const next = Math.max(0, Math.min(total - 1, n));
    setIdx(next);
    setFlipped(false);
  }

  return (
    <div className="rc-fc">
      <p className="rc-mini-label">
        {T(
          'Flashcards business da aula. Toque na carta para virar; pratique até soltar sem pensar.',
          'Business flashcards for this lesson. Tap the card to flip; practise until they come out without thinking.'
        )}
      </p>

      <div className="rc-fc-counter" style={{ color: accent }}>
        {idx + 1} / {total} · {card.kind === 'picture'
          ? T('descrever a cena', 'describe the scene')
          : T('palavra', 'word card')}
      </div>

      {card.kind === 'word' ? (
        <div
          className={`rc-fc-card ${flipped ? 'is-flipped' : ''}`}
          onClick={() => setFlipped((f) => !f)}
          style={{ borderColor: accent }}
        >
          {!flipped ? (
            <div className="rc-fc-face">
              <div className="rc-fc-en">{card.en}</div>
              <div className="rc-fc-hint">{T('toque para ver a tradução', 'tap to see the translation')}</div>
            </div>
          ) : (
            <div className="rc-fc-face rc-fc-back">
              <div className="rc-fc-pt">{card.pt}</div>
              {card.example && <div className="rc-fc-ex"><em>ex.</em> {card.example}</div>}
            </div>
          )}
        </div>
      ) : (
        <div className="rc-fc-picture" style={{ borderColor: accent }}>
          {card.image && (
            <div className="rc-fc-img" style={{ backgroundImage: `url(${card.image})` }} />
          )}
          <div className="rc-fc-picture-body">
            <div className="rc-fc-tag" style={{ color: accent }}>
              <Icon name="image" size={14} /> {T('Descreva a cena', 'Describe the scene')}
            </div>
            <p className="rc-fc-scene">{card.scene}</p>
            {card.words?.length > 0 && (
              <div className="rc-fc-words">
                {card.words.map((w, i) => <span key={i} className="rc-fc-word">{w}</span>)}
              </div>
            )}
            <p className="rc-fc-instr">
              {T(
                'Descreva em inglês em voz alta — sem resposta certa. Use as palavras acima. Toque no microfone e fale como vier.',
                'Describe it aloud in English — there is no right answer. Use the words above. Tap the mic and speak however it comes.'
              )}
            </p>
            <SpeakingExercise mode="free" levelId={level} lang="en-US" />
          </div>
        </div>
      )}

      <div className="rc-fc-nav">
        <button className="rc-btn rc-btn-outline" onClick={() => go(idx - 1)} disabled={idx === 0}>
          ← {T('Anterior', 'Prev')}
        </button>
        {card.kind === 'word' && (
          <AudioPlayer
            text={card.example ? `${card.en}. ${card.example}` : card.en}
            voiceType={voice}
            rate={0.85}
            label={T('Ouvir', 'Listen')}
            small
          />
        )}
        <button
          className="rc-btn rc-btn-primary"
          style={{ background: accent }}
          onClick={() => go(idx + 1)}
          disabled={idx === total - 1}
        >
          {T('Próxima', 'Next')} →
        </button>
      </div>
    </div>
  );
}

function defaultScene(title) {
  const t = (title || '').trim();
  return `You are in a meeting at a Microsoft hyperscale data center site. The topic is "${t}". Describe what is happening and what you would say.`;
}
