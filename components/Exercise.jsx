'use client';

import { useState, useEffect } from 'react';
import { translateExerciseTitle, UI_LABELS_PT, UI_LABELS_EN } from '../lib/translate-exercises';
import SpeakingExercise from './SpeakingExercise';

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
    background: disabled ? '#CBD5E0' : ACCENT, color: '#FFFFFF',
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
      {ex.prompt && <p style={{ fontSize: 15, marginBottom: 14, lineHeight: 1.6 }}>{ex.prompt}</p>}
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
                  ? 'Sua resposta cobre a proposta.'
                  : 'Sua resposta não cobre a proposta da questão.'}
              </strong>
              {result.found.length > 0 && (
                <div style={{ marginTop: 8, fontSize: 13 }}>
                  <span style={{ color: OK_FG }}>Você usou:</span> {result.found.map(k => <KeywordChip key={k} kind="ok">{k.split('|')[0]}</KeywordChip>)}
                </div>
              )}
              {!isCorrect && result.missing.length > 0 && (
                <div style={{ marginTop: 8, fontSize: 13 }}>
                  <span style={{ color: BAD_FG }}>Use ao menos uma:</span> {result.missing.map(k => <KeywordChip key={k} kind="bad">{k.split('|')[0]}</KeywordChip>)}
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
  const t = norm(text);
  const rawKeywords = (ex.keywords || []).filter(Boolean);
  if (rawKeywords.length === 0) return { score: 1, coverage: 1, found: [], missing: [] };
  const found = [];
  const missing = [];
  for (const raw of rawKeywords) {
    // 'a|b|c' = match if any alternative appears (sinônimos / formas válidas)
    const alts = raw.split('|').map(s => norm(s)).filter(Boolean);
    const hit = alts.some(a => t.includes(a));
    if (hit) found.push(raw);
    else missing.push(raw);
  }
  const coverage = found.length / rawKeywords.length;
  const score = found.length > 0 ? 1 : 0;
  return { score, coverage, found, missing };
}

/* ───── 7. SPEAKING (wraps SpeakingExercise — voice with per-word feedback) ───── */
function Speaking({ ex, title, L, onResult, quizMode }) {
  return (
    <Shell title={title}>
      {ex.prompt && <p style={{ fontSize: 15, marginBottom: 12, lineHeight: 1.6 }}>{ex.prompt}</p>}
      <div style={{
        padding: '12px 14px', borderRadius: 10, background: SURFACE,
        border: `1px solid ${LINE}`, marginBottom: 14, fontSize: 15, fontWeight: 500,
      }}>
        <span style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 4 }}>Frase para você falar</span>
        {ex.targetText}
      </div>
      <SpeakingExercise
        mode="read"
        targetText={ex.targetText}
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
