'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { RacionalTopBar, RacionalFooter } from './RacionalChrome';
import Exercise from '../Exercise';
import Icon from './RacionalIcon';

function pad(n) { return String(n).padStart(3, '0'); }
function escapeRegExp(s) { return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
function rotate(arr, k) {
  const n = arr.length;
  if (!n) return arr;
  const s = ((k % n) + n) % n;
  return arr.map((_, i) => arr[(i + s) % n]);
}
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

/**
 * Página de PÓS-AULA (revisão).
 * Conteúdo 100% AUTO-GERADO a partir de dados que a lição já tem:
 *   - vocab (palavras-chave)  -> memorização (ligar + completar em contexto)
 *   - takeaways               -> contextualização (produção escrita)
 * Inclui uma folha de exercícios imprimível (worksheet) via window.print().
 * É puramente aditivo: não altera a aula nem os dados.
 */
export default function PostClass({ course, lesson }) {
  const { meta, typeMeta } = course;
  const accent = meta.accent || '#102A71';
  const mod = course.modules?.find((m) => m.code === lesson.mod);
  const vocab = Array.isArray(lesson.vocab) ? lesson.vocab.filter((v) => v && v.en) : [];
  const takeaways = Array.isArray(lesson.takeaways) ? lesson.takeaways.filter(Boolean) : [];

  // Enquanto a página de pós-aula está montada, o <body> ganha uma classe
  // que ESCOPA as regras de @media print só a esta página (nada global).
  useEffect(() => {
    document.body.classList.add('pc-active');
    return () => document.body.classList.remove('pc-active');
  }, []);

  // ---------- Exercícios interativos (reaproveitam o motor <Exercise/>) ----------
  // 1) Memorização — ligar palavra ↔ tradução
  const matchEx = vocab.length >= 3 ? {
    type: 'matching',
    skill: 'vocabulary',
    title: 'Ligue cada palavra à sua tradução',
    pairs: vocab.map((v) => ({ left: v.en, right: v.pt })),
    explanation: 'Boa! Você associou as palavras-chave desta aula.',
  } : null;

  // 2) Memorização em contexto — completar a frase-exemplo com a palavra em inglês
  const fillExs = vocab
    .filter((v) => v.example && new RegExp(escapeRegExp(v.en), 'i').test(v.example))
    .map((v) => ({
      type: 'fillGap',
      title: 'Complete com a palavra em inglês',
      prompt: v.example.replace(new RegExp(escapeRegExp(v.en), 'i'), '___'),
      correctAnswer: v.en,
      acceptable: [v.en],
      explanation: `${v.en} — ${v.pt}`,
    }));

  // 3) Contextualização — usar a lição na rotina real (produção escrita, correção leniente por palavra-chave)
  const vocabKeywords = vocab.map((v) => v.en);
  const writeExs = takeaways.map((t) => ({
    type: 'writing',
    title: `Contextualize: “${t}”`,
    prompt: `Escreva, em inglês, uma frase ou situação da sua rotina na Racional que mostre: “${t}”.`,
    keywords: vocabKeywords,
    minKeywords: 1,
    minWords: 4,
  }));

  const hasContent = matchEx || fillExs.length || writeExs.length;

  // ---------- Dados para a FOLHA impressa ----------
  const ptShuffled = rotate(vocab.map((v) => v.pt), Math.max(1, Math.floor(vocab.length / 2)));

  return (
    <>
      <RacionalTopBar showHome student />

      {/* HERO */}
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
            <Icon name="target" size={14} /> Memorização &amp; contextualização
          </span>
        </div>
      </section>

      {/* Barra de ação (imprimir) — não sai na folha */}
      <div className="pc-actionbar pc-noprint">
        <div className="rc-wrap-narrow pc-actionbar-inner">
          <p className="pc-actionbar-txt">
            Exercícios de revisão desta aula. Faça na tela com correção automática — ou
            <strong> imprima a folha</strong> para praticar no papel.
          </p>
          <button type="button" className="rc-btn rc-btn-primary pc-print-btn" style={{ background: accent }} onClick={() => window.print()}>
            <Icon name="printer" size={15} /> Imprimir folha de exercícios
          </button>
        </div>
      </div>

      {/* ====================== VERSÃO INTERATIVA (só na tela) ====================== */}
      <div className="pc-screen rc-step">
        {!hasContent && (
          <div className="rc-box">Esta aula ainda não tem palavras-chave nem recapitulação para gerar exercícios de pós-aula.</div>
        )}

        {(matchEx || fillExs.length > 0) && (
          <section className="pc-section">
            <div className="pc-section-kicker" style={{ color: accent }}>Parte 1 · Memorização</div>
            <h2 className="pc-section-title">Palavras-chave da aula</h2>
            {matchEx && <Exercise exercise={matchEx} levelId="starter" />}
            {fillExs.map((ex, i) => <Exercise key={i} exercise={ex} levelId="starter" />)}
          </section>
        )}

        {writeExs.length > 0 && (
          <section className="pc-section">
            <div className="pc-section-kicker" style={{ color: accent }}>Parte 2 · Contextualização</div>
            <h2 className="pc-section-title">Use a aula na sua rotina</h2>
            <p className="rc-mini-label">Escreva em inglês. A correção olha se você usou as palavras-chave da aula — não a gramática.</p>
            {writeExs.map((ex, i) => <Exercise key={i} exercise={ex} levelId="starter" />)}
          </section>
        )}

        <div className="pc-screen-back">
          <Link href={`/racional/${course.id}/lesson/${lesson.num}`} className="rc-btn rc-btn-outline">← Voltar à aula</Link>
          <Link href={`/racional/${course.id}#rc-curriculo`} className="rc-continue-link" style={{ color: 'var(--rc-mute)', borderColor: 'var(--rc-line)' }}>Todas as lições →</Link>
        </div>
      </div>

      {/* ====================== FOLHA IMPRIMÍVEL (só na impressão) ====================== */}
      <div className="pc-print">
        <header className="pc-sheet-head">
          <div className="pc-sheet-brand">Programa de Inglês Executivo · Racional Engenharia × Alumni</div>
          <h1 className="pc-sheet-title">Pós-aula · {lesson.title}</h1>
          <div className="pc-sheet-meta">
            {mod?.code} · {mod?.name} · Aula {pad(lesson.num)} — Aluno: {meta.studentName || '—'}
          </div>
          <div className="pc-sheet-fields">
            <span>Nome: ______________________________</span>
            <span>Data: _____ / _____ / _____</span>
          </div>
        </header>

        {vocab.length >= 2 && (
          <section className="pc-sheet-block">
            <h2 className="pc-sheet-h">Exercício 1 · Ligue cada palavra à sua tradução</h2>
            <p className="pc-sheet-instr">Trace uma linha ligando o número (inglês) à letra correspondente (português).</p>
            <div className="pc-sheet-match">
              <ol className="pc-sheet-col">
                {vocab.map((v, i) => <li key={i}><span className="pc-num">{i + 1}.</span> {v.en}</li>)}
              </ol>
              <ol className="pc-sheet-col pc-sheet-col-letters">
                {ptShuffled.map((pt, i) => <li key={i}><span className="pc-num">{LETTERS[i]}.</span> {pt}</li>)}
              </ol>
            </div>
          </section>
        )}

        {fillExs.length > 0 && (
          <section className="pc-sheet-block">
            <h2 className="pc-sheet-h">Exercício 2 · Complete com a palavra em inglês</h2>
            <div className="pc-sheet-bank">
              <strong>Banco de palavras:</strong> {vocab.map((v) => v.en).join(' · ')}
            </div>
            <ol className="pc-sheet-list">
              {fillExs.map((ex, i) => <li key={i}>{ex.prompt.replace(/___/g, '__________')}</li>)}
            </ol>
          </section>
        )}

        {takeaways.length > 0 && (
          <section className="pc-sheet-block">
            <h2 className="pc-sheet-h">Exercício 3 · Contextualização</h2>
            <p className="pc-sheet-instr">Para cada frase, escreva em inglês uma situação da sua rotina na Racional em que você a usaria.</p>
            <ol className="pc-sheet-list pc-sheet-write">
              {takeaways.map((t, i) => (
                <li key={i}>
                  <span className="pc-sheet-prompt">“{t}”</span>
                  <span className="pc-sheet-line" />
                  <span className="pc-sheet-line" />
                </li>
              ))}
            </ol>
          </section>
        )}

        <footer className="pc-sheet-foot">Racional Engenharia × Alumni · folha de pós-aula gerada a partir do material da aula.</footer>
      </div>

      <RacionalFooter />
    </>
  );
}
