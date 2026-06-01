'use client';

import Link from 'next/link';
import { RacionalTopBar, RacionalFooter } from './RacionalChrome';
import AudioPlayer from '../AudioPlayer';

const VOICE_BY_STUDENT = {
  cassio: 'us-male', fabio: 'us-male', fabricio: 'us-female',
  fernando: 'gb-male', josemario: 'us-female', julio: 'gb-female',
};

export default function BonusReader({ meta, item }) {
  const voice = VOICE_BY_STUDENT[meta.id] || 'us-male';
  return (
    <>
      <RacionalTopBar showHome />
      <section className="rc-bonus-hero">
        <div className="rc-bonus-hero-inner rc-wrap-narrow">
          <Link href={`/racional/${meta.id}`} className="rc-back">← {meta.studentName}</Link>
          <span className="rc-bonus-flag">★ Bônus · sem exercícios</span>
          <div className="rc-bonus-cat">{item.category} · {item.readMin} min de leitura</div>
          <h1>{item.title}</h1>
        </div>
      </section>

      <div className="rc-wrap-narrow" style={{ padding: '32px 24px 10px' }}>
        <div className="rc-bonus-note">
          Este é um material <strong>extra</strong>, para o seu estudo e entretenimento — não faz parte da aula e não tem exercícios. Leia no seu ritmo.
        </div>

        <article className="rc-bonus-body" dangerouslySetInnerHTML={{ __html: item.body }} />

        {item.englishHighlight && (
          <div className="rc-bonus-listen">
            <div className="rc-mini-label" style={{ marginBottom: 8 }}>In English · ouça e treine o ouvido</div>
            <p className="rc-bonus-en">"{item.englishHighlight}"</p>
            <div style={{ marginTop: 10 }}>
              <AudioPlayer text={item.englishHighlight} voiceType={voice} rate={0.92} label="Ouvir em inglês" small />
            </div>
          </div>
        )}

        <div className="rc-stepnav" style={{ paddingTop: 24 }}>
          <Link href={`/racional/${meta.id}`} className="rc-btn rc-btn-primary" style={{ background: meta.accent }}>← Voltar ao programa de {meta.studentName.split(' ')[0]}</Link>
        </div>
      </div>
      <RacionalFooter />
    </>
  );
}
