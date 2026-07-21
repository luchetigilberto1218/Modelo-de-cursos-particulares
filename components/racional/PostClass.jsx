'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { RacionalTopBar, RacionalFooter } from './RacionalChrome';
import Icon from './RacionalIcon';
import PostClassBlock from './PostClassExercises';
import { mulberry32 } from '../../lib/postclass-exercises';

function pad(n) { return String(n).padStart(3, '0'); }
function esc(s) { return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const norm = (s) => String(s || '').trim().toLowerCase();

const VOICE_BY_STUDENT = {
  cassio: 'us-male', fabio: 'us-male', fabricio: 'us-female',
  fernando: 'gb-male', josemario: 'us-female', julio: 'gb-female',
};

const CAT_LABEL = { memo: 'Memorização', ctx: 'Contextualização' };

/**
 * Página de PÓS-AULA (revisão). Os BLOCOS interativos são montados no
 * servidor (buildPostClass) e chegam prontos via props — sorteados por aula,
 * com correção automática e o mínimo de escrita. A FOLHA imprimível é gerada
 * aqui, de forma determinística, em formatos de baixa escrita.
 */
export default function PostClass({ course, lesson, blocks = [] }) {
  const { meta } = course;
  const accent = meta.accent || '#102A71';
  const voice = VOICE_BY_STUDENT[course.id] || 'us-male';
  const mod = course.modules?.find((m) => m.code === lesson.mod);
  const vocab = Array.isArray(lesson.vocab) ? lesson.vocab.filter((v) => v && v.en) : [];
  const takeaways = Array.isArray(lesson.takeaways) ? lesson.takeaways.filter(Boolean) : [];

  useEffect(() => {
    document.body.classList.add('pc-active');
    return () => document.body.classList.remove('pc-active');
  }, []);

  const sheet = buildSheet(lesson, vocab, takeaways);

  return (
    <>
      <RacionalTopBar showHome student />

      <section className="rc-lesson-hero pc-noprint" style={{ background: `linear-gradient(135deg, ${accent} 0%, #1C2230 120%)` }}>
        <div className="rc-lesson-hero-bg" style={{ backgroundImage: `url(${meta.hero})` }} />
        <div className="rc-lesson-hero-inner rc-wrap-narrow">
          <div className="rc-lesson-backrow">
            <Link href={`/racional/${course.id}/lesson/${lesson.num}`} className="rc-back">← {lesson.title}</Link>
            <Link href={`/racional/${course.id}#rc-curriculo`} className="rc-back rc-back-lessons">Todas as lições ☰</Link>
          </div>
          <div className="rc-lesson-label">{mod?.code} · {mod?.name} · Pós-aula {pad(lesson.num)}</div>
          <h1>Pós-aula · {lesson.title}</h1>
          <span className="rc-chip" style={{ background: 'rgba(255,255,255,0.14)' }}>
            <Icon name="target" size={14} /> Revisão sem estresse — jogos, escolhas e voz
          </span>
        </div>
      </section>

      <div className="pc-actionbar pc-noprint">
        <div className="rc-wrap-narrow pc-actionbar-inner">
          <p className="pc-actionbar-txt">
            Exercícios de revisão desta aula — variam a cada lição para não enjoar. Faça na tela com correção automática, ou
            <strong> imprima a folha</strong> para praticar no papel.
          </p>
          <button type="button" className="rc-btn rc-btn-primary pc-print-btn" style={{ background: accent }} onClick={() => window.print()}>
            <Icon name="printer" size={15} /> Imprimir folha de exercícios
          </button>
        </div>
      </div>

      {/* ============ TELA (interativo) ============ */}
      <div className="pc-screen rc-step">
        {blocks.length === 0 && (
          <div className="rc-box">Esta aula ainda não tem palavras-chave nem recapitulação para gerar exercícios de pós-aula.</div>
        )}

        {blocks.map((block, i) => (
          <section key={block.id + i} className="pc-section">
            <div className="pc-section-kicker" style={{ color: accent }}>{CAT_LABEL[block.cat] || 'Exercício'} · {block.format}</div>
            <h2 className="pc-section-title">{block.title}</h2>
            {block.instruction && <p className="rc-mini-label">{block.instruction}</p>}
            <PostClassBlock block={block} accent={accent} voice={voice} />
          </section>
        ))}

        <div className="pc-screen-back">
          <Link href={`/racional/${course.id}/lesson/${lesson.num}`} className="rc-btn rc-btn-outline">← Voltar à aula</Link>
          <Link href={`/racional/${course.id}#rc-curriculo`} className="rc-continue-link" style={{ color: 'var(--rc-mute)', borderColor: 'var(--rc-line)' }}>Todas as lições →</Link>
        </div>
      </div>

      {/* ============ FOLHA IMPRIMÍVEL ============ */}
      <div className="pc-print">
        <header className="pc-sheet-head">
          <div className="pc-sheet-brand">Programa de Inglês Executivo · Racional Engenharia × Alumni</div>
          <h1 className="pc-sheet-title">Pós-aula · {lesson.title}</h1>
          <div className="pc-sheet-meta">{mod?.code} · {mod?.name} · Aula {pad(lesson.num)} — Aluno: {meta.studentName || '—'}</div>
          <div className="pc-sheet-fields">
            <span>Nome: ______________________________</span>
            <span>Data: _____ / _____ / _____</span>
          </div>
        </header>

        {sheet.match && (
          <section className="pc-sheet-block">
            <h2 className="pc-sheet-h">Exercício 1 · Ligue cada palavra à sua tradução</h2>
            <p className="pc-sheet-instr">Trace uma linha ligando o número (inglês) à letra correspondente (português).</p>
            <div className="pc-sheet-match">
              <ol className="pc-sheet-col">{sheet.match.en.map((w, i) => <li key={i}><span className="pc-num">{i + 1}.</span> {w}</li>)}</ol>
              <ol className="pc-sheet-col">{sheet.match.pt.map((w, i) => <li key={i}><span className="pc-num">{LETTERS[i]}.</span> {w}</li>)}</ol>
            </div>
          </section>
        )}

        {sheet.choose && (
          <section className="pc-sheet-block">
            <h2 className="pc-sheet-h">Exercício 2 · Circule o significado correto</h2>
            <ol className="pc-sheet-list">
              {sheet.choose.map((q, i) => (
                <li key={i}>
                  <strong>{q.en}</strong>
                  <span className="pc-sheet-choices">{q.options.map((o, j) => <span key={j} className="pc-sheet-choice">( {LETTERS[j]} ) {o}</span>)}</span>
                </li>
              ))}
            </ol>
          </section>
        )}

        {sheet.cloze && (
          <section className="pc-sheet-block">
            <h2 className="pc-sheet-h">Exercício 3 · Complete usando o banco de palavras</h2>
            <div className="pc-sheet-bank"><strong>Banco:</strong> {sheet.cloze.bank.join(' · ')}</div>
            <ol className="pc-sheet-list">{sheet.cloze.items.map((s, i) => <li key={i}>{s}</li>)}</ol>
          </section>
        )}

        {sheet.order && sheet.order.length > 0 && (
          <section className="pc-sheet-block">
            <h2 className="pc-sheet-h">Exercício 4 · Numere as palavras na ordem correta</h2>
            <p className="pc-sheet-instr">Escreva 1, 2, 3… no quadrinho antes de cada palavra para formar a frase.</p>
            {sheet.order.map((toks, i) => (
              <div key={i} className="pc-sheet-order">{toks.map((w, j) => <span key={j} className="pc-sheet-token">▢ {w}</span>)}</div>
            ))}
          </section>
        )}

        {sheet.tf && (
          <section className="pc-sheet-block">
            <h2 className="pc-sheet-h">Exercício 5 · Verdadeiro (V) ou Falso (F)</h2>
            <ol className="pc-sheet-list">{sheet.tf.map((s, i) => <li key={i}>{s} &nbsp; ( &nbsp; ) V &nbsp; ( &nbsp; ) F</li>)}</ol>
          </section>
        )}

        <footer className="pc-sheet-foot">Racional Engenharia × Alumni · folha de pós-aula gerada a partir do material da aula.</footer>
      </div>

      <RacionalFooter />
    </>
  );
}

/* ---------- Folha imprimível: determinística por aula, baixa escrita ---------- */
function buildSheet(lesson, vocab, takeaways) {
  const rng = mulberry32((((lesson.num || 1) * 40503) >>> 0) || 1);
  const shuffle = (arr) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const sheet = {};

  // 1) Ligar
  if (vocab.length >= 2) {
    const picks = vocab.slice(0, 8);
    sheet.match = { en: picks.map((v) => v.en), pt: shuffle(picks.map((v) => v.pt)) };
  }
  // 2) Circular o significado (MC no papel)
  if (vocab.length >= 3) {
    sheet.choose = vocab.slice(0, 5).map((v) => {
      const others = shuffle(vocab.filter((x) => norm(x.pt) !== norm(v.pt)).map((x) => x.pt)).slice(0, 2);
      return { en: v.en, options: shuffle([v.pt, ...others]) };
    });
  }
  // 3) Banco de palavras (completar exemplos)
  const withEx = vocab.filter((v) => v.example && new RegExp(esc(v.en), 'i').test(v.example)).slice(0, 5);
  if (withEx.length >= 2) {
    sheet.cloze = {
      bank: shuffle(withEx.map((v) => v.en)),
      items: withEx.map((v) => v.example.replace(new RegExp(esc(v.en), 'i'), '____________')),
    };
  }
  // 4) Numerar na ordem (takeaways)
  const ordCands = takeaways.filter((t) => t.split(/\s+/).length >= 4 && t.split(/\s+/).length <= 10).slice(0, 2);
  if (ordCands.length) {
    sheet.order = ordCands.map((t) => shuffle(t.replace(/[.]$/, '').split(/\s+/)));
  }
  // 5) Verdadeiro/Falso
  if (vocab.length >= 3) {
    sheet.tf = vocab.slice(0, 5).map((v, i) => {
      const asTrue = ((i + (lesson.num || 0)) % 2) === 0;
      const other = vocab.find((x) => norm(x.pt) !== norm(v.pt));
      const pt = asTrue || !other ? v.pt : other.pt;
      return `“${v.en}” quer dizer “${pt}”.`;
    });
  }
  return sheet;
}
