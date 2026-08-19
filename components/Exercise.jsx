'use client';

import { useState, useEffect } from 'react';
import { translateExerciseTitle, UI_LABELS_PT, UI_LABELS_EN } from '../lib/translate-exercises';
import SpeakingExercise from './SpeakingExercise';
import AudioPlayer from './AudioPlayer';

/**
 * Typed exercise dispatcher.
 * Renders interactive exercises (fillGap, multipleChoice, matching, reorder, writing, speaking)
 * with auto-correction, error feedback, and explanation.
 *
 * Usage: <Exercise exercise={ex} levelId="starter" onResult={(r) => ...} />
 *   onResult is invoked once after the student checks. r = { correct: bool, accuracy: 0..1 }
 */
export default function Exercise({ exercise, levelId = 'starter', onResult, quizMode = false }) {
  const { type } = exercise;
  const isStarter = levelId === 'starter';
  const L = isStarter ? UI_LABELS_PT : UI_LABELS_EN;
  const title = isStarter ? translateExerciseTitle(exercise.title) : exercise.title;
  const ctx = { ex: exercise, title, L, onResult, quizMode };

  if (type === 'fillGap') return <FillGap {...ctx} />;
  if (type === 'multipleChoice') return <MultipleChoice {...ctx} />;
  if (type === 'matching') return <Matching {...ctx} />;
  if (type === 'reorder') return <Reorder {...ctx} />;
  if (type === 'writing') return <Writing {...ctx} />;
  if (type === 'speaking') return <Speaking {...ctx} />;
  if (type === 'dictation') return <Dictation {...ctx} />;
  if (type === 'info') return <Info {...ctx} />;

  return (
    <Shell title={title}>
      <p style={{ color: '#8892A4', fontSize: 13 }}>Tipo de exercício não suportado: {type}</p>
    </Shell>
  );
}

/* ───── Shell ───── */
function Shell({ title, children }) {
  return (
    <div style={{
      background: '#FFFFFF',
      border: '1px solid #E4E9EF',
      borderRadius: 12,
      padding: 20,
      marginBottom: 16,
    }}>
      {title && <h4 style={{ margin: '0 0 14px', fontSize: 16 }}>{title}</h4>}
      {children}
    </div>
  );
}

const OK_BG = '#F0FFF4';
const OK_BORDER = '#9AE6B4';
const OK_FG = '#22543D';
const BAD_BG = '#FFF5F5';
const BAD_BORDER = '#FEB2B2';
const BAD_FG = '#742A2A';
const ACCENT = '#0071E3';
const SURFACE = '#F7FAFC';
const LINE = '#E4E9EF';

function fbOk(extraStyle = {}) {
  return { marginTop: 14, padding: '10px 14px', borderRadius: 8, background: OK_BG, border: `1px solid ${OK_BORDER}`, color: OK_FG, fontSize: 14, ...extraStyle };
}
function fbBad(extraStyle = {}) {
  return { marginTop: 14, padding: '10px 14px', borderRadius: 8, background: BAD_BG, border: `1px solid ${BAD_BORDER}`, color: BAD_FG, fontSize: 14, ...extraStyle };
}
function btnPrimary(disabled) {
  return {
    padding: '10px 18px', borderRadius: 8, border: 'none',
    // Desabilitado o fundo clareia, então a letra tem de escurecer junto: branco
    // sobre #CBD5E0 dá 1,5:1 e some da tela — em qualquer tema, não só no escuro.
    background: disabled ? '#CBD5E0' : ACCENT, color: disabled ? '#2D3748' : '#FFFFFF',
    fontWeight: 600, fontSize: 14, cursor: disabled ? 'not-allowed' : 'pointer',
  };
}
function btnOutline() {
  return {
    padding: '10px 18px', borderRadius: 8, border: `1px solid ${LINE}`,
    background: '#FFFFFF', color: '#2D3748',
    fontWeight: 600, fontSize: 14, cursor: 'pointer',
  };
}

function normalize(s) {
  return (s || '').toString().trim().toLowerCase().replace(/\s+/g, ' ');
}
function isAcceptable(value, ex) {
  const v = normalize(value);
  if (!v) return false;
  const pool = [ex.correctAnswer, ...(ex.acceptable || [])].filter(Boolean).map(normalize);
  return pool.includes(v);
}

/* ───── 1. FILL GAP ───── */
function FillGap({ ex, title, L, onResult, quizMode }) {
  const [value, setValue] = useState('');
  const [checked, setChecked] = useState(quizMode);
  const isCorrect = checked && isAcceptable(value, ex);
  const isWrong = checked && !isAcceptable(value, ex) && !quizMode;
  const commonErrorKey = isWrong
    ? Object.keys(ex.commonErrors || {}).find(k => normalize(k) === normalize(value))
    : null;
  useEffect(() => {
    if (!quizMode && checked && onResult) onResult({ correct: isCorrect, accuracy: isCorrect ? 1 : 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked]);
  useEffect(() => {
    if (quizMode && onResult) {
      const has = value.trim() !== '';
      const acc = has && isAcceptable(value, ex) ? 1 : 0;
      onResult({ answered: has, correct: !!acc, accuracy: acc, userAnswer: value });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <Shell title={title}>
      <p style={{ fontSize: 15, lineHeight: 1.6, marginBottom: 14 }}>
        {renderPromptWithInput(ex.prompt, value, setValue, checked && !quizMode, isCorrect, L)}
      </p>
      {!quizMode && (
        <>
          <div style={{ display: 'flex', gap: 10 }}>
            {!checked ? (
              <button style={btnPrimary(!value)} onClick={() => setChecked(true)} disabled={!value}>{L.checkAnswer}</button>
            ) : (
              <button style={btnOutline()} onClick={() => { setChecked(false); setValue(''); }}>{L.tryAgain}</button>
            )}
          </div>
          {isCorrect && <div style={fbOk()}>✓ {ex.explanation || L.correct + '!'}</div>}
          {isWrong && (
            <div style={fbBad()}>
              ✗ {commonErrorKey ? ex.commonErrors[commonErrorKey] : ex.explanation || `${L.answer}: ${ex.correctAnswer}`}
              {!commonErrorKey && ex.correctAnswer && (
                <div style={{ marginTop: 8, fontSize: 13 }}>
                  <strong>{L.answer}:</strong> {ex.correctAnswer}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </Shell>
  );
}

function renderPromptWithInput(prompt, value, setValue, checked, isCorrect, L) {
  const inputStyle = (inline) => ({
    padding: '6px 10px', borderRadius: 6,
    border: `2px solid ${checked ? (isCorrect ? OK_BORDER : BAD_BORDER) : LINE}`,
    background: checked ? (isCorrect ? OK_BG : BAD_BG) : '#FFFFFF',
    fontSize: 15, fontFamily: 'inherit',
    ...(inline ? { display: 'inline-block', minWidth: 100, margin: '0 4px' } : { width: '100%', marginTop: 8 }),
  });
  const parts = (prompt || '').split('___');
  if (parts.length === 1) {
    return (
      <>
        <div>{prompt}</div>
        <input
          style={inputStyle(false)}
          value={value}
          onChange={e => setValue(e.target.value)}
          disabled={checked && isCorrect}
          placeholder={L.typeAnswer}
        />
      </>
    );
  }
  return (
    <>
      {parts[0]}
      <input
        style={inputStyle(true)}
        value={value}
        onChange={e => setValue(e.target.value)}
        disabled={checked && isCorrect}
        placeholder="..."
      />
      {parts.slice(1).join('___')}
    </>
  );
}

/* ───── 2. MULTIPLE CHOICE ───── */
function MultipleChoice({ ex, title, L, onResult, quizMode }) {
  const [choice, setChoice] = useState(null);
  const [checked, setChecked] = useState(false);
  const selected = ex.options?.find(o => o.id === choice);
  const isCorrect = checked && selected?.correct;
  useEffect(() => {
    if (!quizMode && checked && onResult) onResult({ correct: !!isCorrect, accuracy: isCorrect ? 1 : 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked]);
  useEffect(() => {
    if (quizMode && onResult) {
      const sel = ex.options?.find(o => o.id === choice);
      const has = !!sel;
      const acc = has && sel.correct ? 1 : 0;
      onResult({ answered: has, correct: !!acc, accuracy: acc, userAnswer: sel ? sel.text : '' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [choice]);

  return (
    <Shell title={title}>
      {ex.prompt && <p style={{ fontSize: 15, marginBottom: 14 }}>{ex.prompt}</p>}
      <div style={{ display: 'grid', gap: 10 }}>
        {ex.options?.map(opt => {
          const isThis = choice === opt.id;
          const showOk = !quizMode && checked && opt.correct;
          const showBad = !quizMode && checked && isThis && !opt.correct;
          return (
            <button
              key={opt.id}
              onClick={() => (quizMode || !checked) && setChoice(opt.id)}
              disabled={!quizMode && checked}
              style={{
                textAlign: 'left',
                padding: '12px 14px',
                borderRadius: 10,
                border: '1px solid',
                borderColor: showOk ? OK_BORDER : showBad ? BAD_BORDER : isThis ? ACCENT : LINE,
                background: showOk ? OK_BG : showBad ? BAD_BG : isThis ? '#EBF5FF' : '#FFFFFF',
                color: showOk ? OK_FG : showBad ? BAD_FG : '#2D3748',
                fontSize: 14,
                fontWeight: isThis ? 600 : 400,
                cursor: !quizMode && checked ? 'default' : 'pointer',
              }}
            >
              <span style={{ fontWeight: 700, marginRight: 8 }}>{opt.id.toUpperCase()}.</span>
              {opt.text}
              {showOk && <span style={{ float: 'right' }}>✓</span>}
              {showBad && <span style={{ float: 'right' }}>✗</span>}
            </button>
          );
        })}
      </div>
      {!quizMode && (
        <>
          <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
            {!checked ? (
              <button style={btnPrimary(!choice)} onClick={() => setChecked(true)} disabled={!choice}>{L.checkAnswer}</button>
            ) : (
              <button style={btnOutline()} onClick={() => { setChecked(false); setChoice(null); }}>{L.tryAgain}</button>
            )}
          </div>
          {checked && isCorrect && <div style={fbOk()}>✓ {ex.explanation || L.correct + '!'}</div>}
          {checked && !isCorrect && selected && (
            <div style={fbBad()}>✗ {selected.whyWrong || ex.explanation || L.almost + '.'}</div>
          )}
        </>
      )}
    </Shell>
  );
}

/* ───── 3. MATCHING ───── */
function Matching({ ex, title, L, onResult, quizMode }) {
  const pairs = ex.pairs || [];
  // Exercício de vocabulário? (associa termo/palavra ↔ tradução/significado)
  const isVocab = ex.skill === 'vocabulary' || /vocabul|tradu|termo|palavra/i.test(ex.title || '');
  const instruction = ex.instruction || (isVocab
    ? 'Associe cada termo em inglês à sua tradução em português: clique na caixa à direita e escolha a opção correta.'
    : 'Associe cada item da esquerda ao seu par correto: clique na caixa à direita e escolha a opção.');
  const [shuffledRight, setShuffledRight] = useState(() => pairs.map(p => p.right));
  useEffect(() => {
    setShuffledRight(shuffle(pairs.map(p => p.right)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ex]);
  const [selections, setSelections] = useState({});
  const [checked, setChecked] = useState(false);
  const allChosen = pairs.every(p => selections[p.left]);

  function setPair(left, right) {
    if (!quizMode && checked) return;
    setSelections(s => ({ ...s, [left]: right }));
  }
  function isPairCorrect(left) {
    const right = selections[left];
    const pair = pairs.find(p => p.left === left);
    return right && pair.right === right;
  }
  const allCorrect = checked && pairs.every(p => isPairCorrect(p.left));
  const correctCount = checked ? pairs.filter(p => isPairCorrect(p.left)).length : 0;
  useEffect(() => {
    if (!quizMode && checked && onResult) {
      const acc = pairs.length ? correctCount / pairs.length : 0;
      onResult({ correct: allCorrect, accuracy: acc });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked]);
  useEffect(() => {
    if (quizMode && onResult) {
      const live = pairs.filter(p => selections[p.left] && pairs.find(pp => pp.left === p.left).right === selections[p.left]).length;
      const total = pairs.length || 1;
      const allChosenLive = pairs.every(p => selections[p.left]);
      onResult({ answered: allChosenLive, correct: live === total, accuracy: live / total, userAnswer: { ...selections } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selections]);

  return (
    <Shell title={title}>
      <div style={{ marginBottom: 12 }}>
        {isVocab && (
          <span style={{
            display: 'inline-block', fontSize: 11, fontWeight: 700, color: '#1B5E36',
            background: '#EAF7EF', border: '1px solid #A7D7BC', borderRadius: 999,
            padding: '3px 10px', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5,
          }}>🔤 Vocabulário</span>
        )}
        <p style={{ fontSize: 14, color: '#4A5568', lineHeight: 1.55, margin: 0 }}>{instruction}</p>
      </div>
      <div style={{ display: 'grid', gap: 10 }}>
        {pairs.map(pair => (
          <div key={pair.left} style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 10,
            alignItems: 'center',
          }}>
            <div style={{
              padding: '10px 14px',
              borderRadius: 10,
              background: SURFACE,
              border: `1px solid ${LINE}`,
              fontWeight: 600,
              fontSize: 14,
            }}>
              {pair.left}
            </div>
            <select
              value={selections[pair.left] || ''}
              onChange={e => setPair(pair.left, e.target.value)}
              disabled={!quizMode && checked}
              style={{
                padding: '10px 12px',
                borderRadius: 8,
                border: `2px solid ${!quizMode && checked ? (isPairCorrect(pair.left) ? OK_BORDER : BAD_BORDER) : LINE}`,
                background: !quizMode && checked ? (isPairCorrect(pair.left) ? OK_BG : BAD_BG) : '#FFFFFF',
                fontSize: 14,
                fontFamily: 'inherit',
              }}
            >
              <option value="">{L.chooseDefault}</option>
              {shuffledRight.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        ))}
      </div>
      {!quizMode && (
        <>
          <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
            {!checked ? (
              <button style={btnPrimary(!allChosen)} onClick={() => setChecked(true)} disabled={!allChosen}>{L.checkAnswers}</button>
            ) : (
              <button style={btnOutline()} onClick={() => { setChecked(false); setSelections({}); }}>{L.tryAgain}</button>
            )}
          </div>
          {checked && allCorrect && <div style={fbOk()}>✓ {ex.explanation || L.correct + '!'}</div>}
          {checked && !allCorrect && (
            <div style={fbBad()}>
              ✗ {L.correctPairs}:
              <ul style={{ marginTop: 8, paddingLeft: 20 }}>
                {pairs.filter(p => !isPairCorrect(p.left)).map(p => (
                  <li key={p.left}><strong>{p.left}</strong> → {p.right}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </Shell>
  );
}
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ───── 4. REORDER ───── */
function Reorder({ ex, title, L, onResult, quizMode }) {
  const [tokens, setTokens] = useState(() => ex.prompt || []);
  const [touched, setTouched] = useState(false);
  const [checked, setChecked] = useState(false);
  const correct = checked && sameOrder(tokens, ex.correctOrder);
  useEffect(() => {
    if (!quizMode && checked && onResult) onResult({ correct: !!correct, accuracy: correct ? 1 : 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked]);
  useEffect(() => {
    if (quizMode && onResult) {
      const ok = sameOrder(tokens, ex.correctOrder);
      onResult({ answered: touched, correct: !!ok, accuracy: ok ? 1 : 0, userAnswer: [...tokens] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokens, touched]);

  function move(i, dir) {
    if (!quizMode && checked) return;
    const j = i + dir;
    if (j < 0 || j >= tokens.length) return;
    const next = [...tokens];
    [next[i], next[j]] = [next[j], next[i]];
    setTokens(next);
    if (quizMode) setTouched(true);
  }

  return (
    <Shell title={title}>
      <p style={{ color: '#8892A4', fontSize: 13, marginBottom: 10 }}>{L.tapArrows}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {tokens.map((t, i) => {
          const showCheck = !quizMode && checked;
          const tokenColor = showCheck
            ? (correct ? OK_BG : ex.correctOrder?.[i] === t ? OK_BG : BAD_BG)
            : SURFACE;
          const tokenBorder = showCheck
            ? (correct ? OK_BORDER : ex.correctOrder?.[i] === t ? OK_BORDER : BAD_BORDER)
            : LINE;
          const dis = !quizMode && checked;
          return (
            <div key={`${t}-${i}`} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 12px',
              borderRadius: 10,
              background: tokenColor,
              border: `1px solid ${tokenBorder}`,
              fontWeight: 600,
              fontSize: 14,
            }}>
              <button onClick={() => move(i, -1)} disabled={dis || i === 0}
                style={{ background: 'transparent', border: 'none', cursor: dis || i === 0 ? 'default' : 'pointer', opacity: i === 0 ? 0.2 : 1, fontSize: 18, padding: 0, lineHeight: 1 }}>←</button>
              <span>{t}</span>
              <button onClick={() => move(i, +1)} disabled={dis || i === tokens.length - 1}
                style={{ background: 'transparent', border: 'none', cursor: dis || i === tokens.length - 1 ? 'default' : 'pointer', opacity: i === tokens.length - 1 ? 0.2 : 1, fontSize: 18, padding: 0, lineHeight: 1 }}>→</button>
            </div>
          );
        })}
      </div>
      {!quizMode && (
        <>
          <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
            {!checked ? (
              <button style={btnPrimary(false)} onClick={() => setChecked(true)}>{L.check}</button>
            ) : (
              <button style={btnOutline()} onClick={() => { setChecked(false); setTokens(ex.prompt); }}>{L.tryAgain}</button>
            )}
          </div>
          {checked && correct && <div style={fbOk()}>✓ {ex.explanation || L.correct + '!'}</div>}
          {checked && !correct && (
            <div style={fbBad()}>
              ✗ {ex.explanation || L.almost + '.'}
              <div style={{ marginTop: 8, fontSize: 13 }}>
                <strong>{L.answer}:</strong> {ex.correctOrder?.join(' ')}
              </div>
            </div>
          )}
        </>
      )}
    </Shell>
  );
}
function sameOrder(a, b) {
  if (!a || !b || a.length !== b.length) return false;
  return a.every((t, i) => t === b[i]);
}

/* ───── 5. INFO (display-only block, used in outdoor lessons) ───── */
function Info({ ex, title }) {
  return (
    <Shell title={title}>
      <div style={{ fontSize: 14, lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: ex.content }} />
    </Shell>
  );
}

/* ───── 6. WRITING (free-form text with keyword-based grading) ───── */
function Writing({ ex, title, L, onResult, quizMode }) {
  const [value, setValue] = useState('');
  const [checked, setChecked] = useState(false);
  const minWords = ex.minWords || 4;
  const wordCount = (value.trim().match(/\S+/g) || []).length;
  const canCheck = wordCount >= minWords;

  const result = checked ? gradeWriting(value, ex) : null;
  const accuracy = result ? result.score : 0;
  const isCorrect = result && result.score === 1;
  const isPartial = false;

  useEffect(() => {
    if (!quizMode && checked && onResult) onResult({ correct: isCorrect, accuracy });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked]);
  useEffect(() => {
    if (quizMode && onResult) {
      const live = gradeWriting(value, ex);
      onResult({
        answered: wordCount >= minWords,
        correct: live.score >= 0.8,
        accuracy: live.score,
        userAnswer: value,
        found: live.found,
        missing: live.missing,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <Shell title={title}>
      {ex.prompt && <p style={{ fontSize: 15, marginBottom: 8, lineHeight: 1.6 }}>{ex.prompt}</p>}
      <div style={{ fontSize: 12.5, color: '#1B5E36', background: '#EAF7EF', border: '1px solid #A7D7BC', borderRadius: 8, padding: '8px 12px', marginBottom: 12, lineHeight: 1.5 }}>
        A correção olha só o <strong>uso dos termos em inglês</strong> da lição — não a gramática nem outras nuances. {ex.minKeywords ? `Use ao menos ${ex.minKeywords} termo(s).` : ''}
      </div>
      <textarea
        value={value}
        onChange={e => setValue(e.target.value)}
        disabled={!quizMode && checked}
        placeholder="Escreva sua resposta em inglês…"
        rows={4}
        style={{
          width: '100%', padding: '12px 14px', borderRadius: 10,
          border: `2px solid ${!quizMode && checked ? (isCorrect ? OK_BORDER : isPartial ? '#F6AD55' : BAD_BORDER) : LINE}`,
          background: !quizMode && checked ? (isCorrect ? OK_BG : isPartial ? '#FFFAF0' : BAD_BG) : '#FFFFFF',
          fontSize: 15, fontFamily: 'inherit', resize: 'vertical', lineHeight: 1.5,
        }}
      />
      <div style={{ fontSize: 12, color: 'var(--gray)', marginTop: 6 }}>
        {wordCount} {wordCount === 1 ? 'palavra' : 'palavras'}
        {!canCheck && ` · escreva pelo menos ${minWords}`}
      </div>
      {!quizMode && (
        <>
          <div style={{ marginTop: 14, display: 'flex', gap: 10 }}>
            {!checked ? (
              <button style={btnPrimary(!canCheck)} onClick={() => setChecked(true)} disabled={!canCheck}>{L.checkAnswer}</button>
            ) : (
              <button style={btnOutline()} onClick={() => { setChecked(false); setValue(''); }}>{L.tryAgain}</button>
            )}
          </div>
          {checked && (
            <div style={isCorrect ? fbOk() : fbBad()}>
              {isCorrect ? '✓ ' : '✗ '}
              <strong>
                {isCorrect
                  ? `Boa! Você usou ${result.found.length} termo(s) em inglês da lição.`
                  : `Quase — você usou ${result.found.length} de ${result.need || 1} termo(s) necessários. Inclua mais termos em inglês da lição.`}
              </strong>
              {result.found.length > 0 && (
                <div style={{ marginTop: 8, fontSize: 13 }}>
                  <span style={{ color: OK_FG }}>Termos que você usou:</span> {result.found.map(k => <KeywordChip key={k} kind="ok">{k.split('|')[0]}</KeywordChip>)}
                </div>
              )}
              {!isCorrect && result.missing.length > 0 && (
                <div style={{ marginTop: 8, fontSize: 13 }}>
                  <span style={{ color: BAD_FG }}>Termos sugeridos:</span> {result.missing.map(k => <KeywordChip key={k} kind="bad">{k.split('|')[0]}</KeywordChip>)}
                </div>
              )}
              {ex.modelAnswer && (
                <div style={{ marginTop: 10, padding: 10, background: '#FFFFFF', borderRadius: 8, fontSize: 13 }}>
                  <strong>Resposta modelo:</strong><br />
                  <span style={{ fontStyle: 'italic', color: '#2D3748' }}>{ex.modelAnswer}</span>
                </div>
              )}
              {ex.explanation && <div style={{ marginTop: 8, fontSize: 13 }}>{ex.explanation}</div>}
            </div>
          )}
        </>
      )}
    </Shell>
  );
}

function KeywordChip({ children, kind }) {
  return (
    <span style={{
      display: 'inline-block', margin: '2px 4px 2px 0', padding: '2px 8px',
      borderRadius: 980, fontSize: 12, fontWeight: 600,
      background: kind === 'ok' ? OK_BG : BAD_BG,
      color: kind === 'ok' ? OK_FG : BAD_FG,
      border: `1px solid ${kind === 'ok' ? OK_BORDER : BAD_BORDER}`,
    }}>{children}</span>
  );
}

// Lenient writing grader — ONLY checks if keywords (or any of their alternatives,
// separated by `|`) appear as substrings. Punctuation, capitalization, spelling of
// non-keyword words, and word order are all ignored.
//
// Score is BINARY: if AT LEAST ONE keyword (or any of its alternatives) is found,
// the student gets 100%. If none is found, 0%. found/missing are still tracked so
// the review screen can show what was covered.
function gradeWriting(text, ex) {
  const norm = (s) => (s || '').toLowerCase().replace(/[^a-z0-9\s']/g, ' ').replace(/\s+/g, ' ').trim();
  // Tolerância a flexão: ignora terminações comuns (-ing/-ed/-s) para que
  // "doubling down" reconheça "double down", "centers" reconheça "center", etc.
  const stem = (w) => w.replace(/(ing|ed|s)$/i, '');
  const loose = (s) => norm(s).split(' ').map(stem).filter(Boolean).join(' ');
  const t = ' ' + norm(text) + ' ';
  const tl = ' ' + loose(text) + ' ';
  const rawKeywords = (ex.keywords || []).filter(Boolean);
  if (rawKeywords.length === 0) return { score: 1, coverage: 1, found: [], missing: [], need: 0 };
  // Conta TERMOS recomendados distintos usados (somando alternativas de todos os
  // grupos), não nº de grupos — alinha com o enunciado "use N termos".
  const foundAlts = new Set();
  const found = [];
  const missing = [];
  let totalAlts = 0;
  for (const raw of rawKeywords) {
    const alts = raw.split('|').map(s => s.trim()).filter(Boolean);
    totalAlts += alts.length;
    let groupHit = false;
    for (const a of alts) {
      const na = norm(a);
      if (!na) continue;
      if (t.includes(' ' + na + ' ') || t.includes(na) || tl.includes(loose(a))) {
        if (!foundAlts.has(na)) { foundAlts.add(na); found.push(a); }
        groupHit = true;
      }
    }
    if (!groupHit) missing.push(raw);
  }
  // minKeywords: nº mínimo de termos a usar (default 1). Nunca exige mais termos
  // do que existem disponíveis.
  const need = Math.min(ex.minKeywords || 1, totalAlts || 1);
  const score = found.length >= need ? 1 : 0;
  const coverage = rawKeywords.length ? (rawKeywords.length - missing.length) / rawKeywords.length : 1;
  return { score, coverage, found, missing, need };
}

/* ───── 8. DICTATION (listen and type, with word-by-word diff) ───── */
function diffWords(userText, correctText) {
  const user = normalize(userText).split(' ').filter(Boolean);
  const correct = normalize(correctText).split(' ').filter(Boolean);
  return correct.map((cw, i) => {
    if (user[i] === cw) return { text: cw, status: 'ok' };
    if (user[i]) return { text: cw, status: 'wrong' };
    return { text: cw, status: 'missing' };
  });
}
function Dictation({ ex, title, L, onResult, quizMode }) {
  const [value, setValue] = useState('');
  const [checked, setChecked] = useState(false);
  const isCorrect = checked && normalize(value) === normalize(ex.correctText);
  const words = checked ? diffWords(value, ex.correctText) : [];
  useEffect(() => {
    if (!quizMode && checked && onResult) onResult({ correct: isCorrect, accuracy: isCorrect ? 1 : 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked]);

  return (
    <Shell title={title || (L === UI_LABELS_PT ? 'Escute e digite' : 'Listen and type')}>
      <div style={{ marginBottom: 14 }}>
        <AudioPlayer text={ex.correctText} audioUrl={ex.audioUrl} voiceType={ex.voice || 'us-male'} rate={ex.rate || 0.8} label={L === UI_LABELS_PT ? 'Ouvir' : 'Listen'} small />
      </div>
      <textarea
        value={value}
        onChange={e => setValue(e.target.value)}
        disabled={!quizMode && checked && isCorrect}
        placeholder={L === UI_LABELS_PT ? 'Digite o que você ouviu…' : 'Type what you hear…'}
        rows={2}
        style={{
          width: '100%', padding: '12px 14px', borderRadius: 10,
          border: `2px solid ${!quizMode && checked ? (isCorrect ? OK_BORDER : BAD_BORDER) : LINE}`,
          background: !quizMode && checked ? (isCorrect ? OK_BG : BAD_BG) : '#FFFFFF',
          fontSize: 15, fontFamily: 'inherit', resize: 'vertical', lineHeight: 1.5,
        }}
      />
      {!quizMode && (
        <>
          <div style={{ marginTop: 14, display: 'flex', gap: 10 }}>
            {!checked ? (
              <button style={btnPrimary(!value.trim())} onClick={() => setChecked(true)} disabled={!value.trim()}>{L.check}</button>
            ) : (
              <button style={btnOutline()} onClick={() => { setChecked(false); setValue(''); }}>{L.tryAgain}</button>
            )}
          </div>
          {checked && isCorrect && <div style={fbOk()}>✓ {ex.explanation || L.correct + '!'}</div>}
          {checked && !isCorrect && (
            <div style={fbBad()}>
              <div style={{ marginBottom: 8 }}>✗ {L.almost}.</div>
              <div style={{ lineHeight: 2 }}>
                {words.map((w, i) => (
                  <span key={i} style={{
                    padding: '2px 6px', margin: '0 2px', borderRadius: 4, fontWeight: 600,
                    background: w.status === 'ok' ? 'rgba(56,161,105,0.15)' : w.status === 'missing' ? 'rgba(220,38,38,0.15)' : 'rgba(217,119,6,0.2)',
                    color: w.status === 'ok' ? OK_FG : w.status === 'missing' ? BAD_FG : '#9C6A00',
                    textDecoration: w.status === 'missing' ? 'underline' : 'none',
                  }}>{w.text}</span>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </Shell>
  );
}

/* ───── 7. SPEAKING (wraps SpeakingExercise — voice with per-word feedback) ───── */
function Speaking({ ex, title, L, onResult, quizMode }) {
  return (
    <Shell title={title}>
      {ex.prompt && (
        <div style={{ fontSize: 14, marginBottom: 10, lineHeight: 1.6, color: '#4A5568' }}>
          <span style={{ fontWeight: 700, color: 'var(--gray)' }}>Contexto: </span>{ex.prompt}
        </div>
      )}
      <div style={{
        fontSize: 13.5, color: '#1B4D7A', background: '#EAF2FB', border: '1px solid #BBD6F2',
        borderRadius: 8, padding: '8px 12px', marginBottom: 12, lineHeight: 1.5,
      }}>
        🗣️ <strong>Leia a frase abaixo em voz alta.</strong> É uma resposta-modelo: o objetivo é treinar a <strong>pronúncia e a fluência</strong> — não precisa criar sua própria resposta aqui. Toque no microfone e leia; depois você se ouve e compara.
      </div>
      <div style={{
        padding: '12px 14px', borderRadius: 10, background: SURFACE,
        border: `1px solid ${LINE}`, marginBottom: 14, fontSize: 15, fontWeight: 500,
        lineHeight: 1.6, overflowWrap: 'break-word', wordBreak: 'break-word', maxWidth: '100%',
      }}>
        <span style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 4 }}>Frase-modelo para ler em voz alta</span>
        {ex.targetText}
      </div>
      <SpeakingExercise
        mode="read"
        targetText={ex.targetText}
        translation={ex.translation}
        levelId="starter"
        hideFeedback={quizMode}
        onResult={(r) => {
          const acc = (r?.accuracy ?? 0) / 100;
          if (onResult) onResult({ answered: true, correct: acc >= 0.8, accuracy: acc, userAnswer: r?.transcript || '' });
        }}
      />
      {!quizMode && ex.explanation && (
        <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 8, background: '#EBF5FF', fontSize: 13, color: '#2D3748' }}>
          {ex.explanation}
        </div>
      )}
    </Shell>
  );
}
