'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Exercise from './Exercise';
import Icon from './Icon';

/**
 * ModuleQuiz — silent-mode quiz with festive result screens.
 *
 * Flow:
 *   1. Welcome header explains rules + green-light goal.
 *   2. Student answers each exercise — NO inline feedback, NO check button.
 *      Exercise components in quizMode broadcast { answered, correct, accuracy } via onResult.
 *   3. "Próximo →" navigates; on the last item the button reads "Corrigir e ver nota".
 *   4. Final screen shows tier (red 0–5, amber 6–8, green 9–10) with celebratory imagery.
 */
export default function ModuleQuiz({ quiz, moduleName, moduleNum, clientId, totalLessons }) {
  const exercises = quiz?.exercises || [];
  const [started, setStarted] = useState(false);
  const [idx, setIdx] = useState(0);
  const [results, setResults] = useState({}); // { [exIndex]: { answered, correct, accuracy } }
  const [finished, setFinished] = useState(false);

  if (exercises.length === 0) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: 'var(--gray)' }}>
        <p>Esta prova ainda não foi gerada.</p>
        <Link href={`/${clientId}`} style={{ color: 'var(--accent)' }}>← voltar ao curso</Link>
      </div>
    );
  }

  const totalCount = exercises.length;
  const sum = Object.values(results).reduce((acc, r) => acc + (r?.accuracy || 0), 0);
  const score10 = totalCount > 0 ? (sum / totalCount) * 10 : 0;
  const scoreInt = Math.round(score10 * 10) / 10;
  const tier = scoreInt >= 8 ? 'green' : scoreInt >= 6 ? 'amber' : 'red';

  function handleResult(r) {
    setResults((prev) => ({ ...prev, [idx]: r }));
  }
  function next() {
    if (idx < totalCount - 1) setIdx(idx + 1);
    else setFinished(true);
  }
  function prev() { if (idx > 0) setIdx(idx - 1); }
  function restart() { setResults({}); setIdx(0); setFinished(false); setStarted(true); }
  function backToStart() { setResults({}); setIdx(0); setFinished(false); setStarted(false); }

  // ── Welcome screen ───────────────────────────────────────
  if (!started) {
    return (
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 20px 60px' }}>
        <Link href={`/${clientId}`} style={{ fontSize: 13, color: 'var(--gray)', textDecoration: 'none' }}>
          ← {moduleName}
        </Link>
        <div style={{
          marginTop: 16, padding: '32px 28px', borderRadius: 18,
          background: 'linear-gradient(135deg, #0F1D3A 0%, #1B2D52 100%)',
          color: 'var(--white)',
          boxShadow: '0 14px 40px rgba(15,29,58,.15)',
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase', color: '#E8C786', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon name="flag" size={14} color="#E8C786" />
            <span>Prova de fim de módulo</span>
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, lineHeight: 1.2, marginBottom: 14 }}>
            {quiz.title || `Prova do Módulo ${moduleNum}`}
          </h1>
          <p style={{ fontSize: 15, lineHeight: 1.7, opacity: 0.92, marginBottom: 0 }}>
            Esta é a sua prova de fim de módulo. Você vai responder a exercícios sobre tudo o que viu nas aulas — gramática, vocabulário, escrita e fala.
          </p>
        </div>

        <div style={{ marginTop: 24, display: 'grid', gap: 14 }}>
          <Tile iconName="target" title="Objetivo: tirar 8, 9 ou 10" body="Essa é a sua luz verde para liberar o próximo módulo." accent="#2F855A" />
          <Tile iconName="edit" title="Responda todas as questões" body="Não há botão de verificar a cada exercício. Responda, avance, e ao final clique em Corrigir para ver sua nota." accent="#0071E3" />
          <Tile iconName="refresh" title="Pode refazer quantas vezes quiser" body="Veja onde errou, revise as lições daquele tópico, e refaça a prova até tirar 8, 9 ou 10." accent="#B7791F" />
          <Tile iconName="help" title="Em caso de dúvida" body="Procure seu professor para um suporte extra. Estamos juntos nessa." accent="#C53030" />
        </div>

        <button
          onClick={() => setStarted(true)}
          style={{
            marginTop: 28, width: '100%', padding: '16px 22px', borderRadius: 14, border: 'none',
            background: 'linear-gradient(135deg, #B7791F 0%, #D69E2E 100%)',
            color: 'var(--white)', fontWeight: 700, fontSize: 16, cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(183,121,31,.25)',
          }}
        >Começar prova ({totalCount} exercícios) →</button>
      </div>
    );
  }

  // ── Final result screen ──────────────────────────────────
  if (finished) {
    return <ResultScreen tier={tier} score={scoreInt} totalCount={totalCount}
      results={results} exercises={exercises} clientId={clientId}
      moduleNum={moduleNum} restart={restart} backToStart={backToStart} />;
  }

  // ── Quiz running ─────────────────────────────────────────
  const ex = exercises[idx];
  const lessonNum = ex?.lessonNum;
  const completedCount = Object.values(results).filter(r => r?.answered).length;
  const isLast = idx === totalCount - 1;

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '20px' }}>
      <div style={{ marginBottom: 16 }}>
        <button onClick={backToStart} style={{ fontSize: 12, color: 'var(--gray)', background: 'none', border: 'none', padding: 0, cursor: 'pointer', textDecoration: 'underline' }}>
          ← instruções da prova
        </button>
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--gray)', marginBottom: 6 }}>
          <span>Exercício {idx + 1} de {totalCount}{lessonNum ? ` · da Lição ${lessonNum}` : ''}</span>
          <span>{completedCount} respondidos</span>
        </div>
        <div style={{ height: 6, background: 'var(--gray-light)', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${((idx + 1) / totalCount) * 100}%`,
            background: 'linear-gradient(90deg, #B7791F 0%, #D69E2E 100%)',
            transition: 'width 0.3s ease',
          }} />
        </div>
      </div>

      <Exercise key={idx} exercise={ex} levelId="starter" quizMode onResult={handleResult} />

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, gap: 10 }}>
        <button
          onClick={prev}
          disabled={idx === 0}
          style={{
            padding: '12px 20px', borderRadius: 10, border: '1px solid var(--gray-light)',
            background: 'var(--white)', color: idx === 0 ? 'var(--gray)' : 'var(--text)',
            fontWeight: 600, fontSize: 14, cursor: idx === 0 ? 'not-allowed' : 'pointer',
          }}
        >← Anterior</button>
        <button
          onClick={next}
          style={{
            padding: '12px 22px', borderRadius: 10, border: 'none',
            background: isLast ? 'linear-gradient(135deg, #2F855A 0%, #38A169 100%)' : 'var(--navy)',
            color: 'var(--white)', fontWeight: 700, fontSize: 14, cursor: 'pointer',
            boxShadow: isLast ? '0 6px 18px rgba(47,133,90,.25)' : 'none',
          }}
        >
          {isLast ? 'Corrigir e ver minha nota' : 'Próximo →'}
        </button>
      </div>
    </div>
  );
}

function Tile({ iconName, title, body, accent }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '44px 1fr', gap: 14, alignItems: 'flex-start',
      padding: 18, borderRadius: 12, background: 'var(--white)',
      border: `1px solid var(--gray-light)`, borderLeft: `4px solid ${accent}`,
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: accent + '15', color: accent,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name={iconName} size={20} color={accent} strokeWidth={1.7} />
      </div>
      <div>
        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--navy)', marginBottom: 4 }}>{title}</div>
        <div style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.55 }}>{body}</div>
      </div>
    </div>
  );
}

/* ───── Result screen — 3 tier variants ───── */
function ResultScreen({ tier, score, totalCount, results, exercises, clientId, moduleNum, restart, backToStart }) {
  const completedCount = Object.values(results).filter(r => r?.answered).length;
  return (
    <div className={`quiz-result quiz-result-${tier}`}>
      {tier === 'green' && <Confetti />}
      <div className="quiz-result-inner">
        {tier === 'green' && <GreenScreen score={score} moduleNum={moduleNum} clientId={clientId} restart={restart} />}
        {tier === 'amber' && <AmberScreen score={score} restart={restart} backToStart={backToStart} clientId={clientId} />}
        {tier === 'red' && <RedScreen score={score} restart={restart} backToStart={backToStart} clientId={clientId} />}

        <div className="quiz-result-details">
          <h3 style={{ fontSize: 14, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: 'var(--gray)', marginBottom: 6 }}>
            Detalhes ({completedCount}/{totalCount} respondidos)
          </h3>
          <p style={{ fontSize: 13, color: 'var(--gray)', marginBottom: 14, lineHeight: 1.5 }}>
            Clique em qualquer exercício para ver o que você respondeu e o gabarito.
          </p>
          <div style={{ display: 'grid', gap: 6 }}>
            {exercises.map((e, i) => (
              <ReviewItem key={i} index={i} exercise={e} result={results[i]} />
            ))}
          </div>
          <div style={{ marginTop: 22, padding: '14px 16px', background: '#EBF5FF', borderRadius: 10, fontSize: 12, color: '#2C5282', lineHeight: 1.55 }}>
            <strong>Sobre a correção dos writings:</strong> usar pelo menos uma das palavras-chave sugeridas já vale 100% do exercício. Variantes British e American (bathroom/restroom/toilet, lift/elevator…) são aceitas. Pontuação, capitalização e ortografia de palavras não-chave <strong>não</strong> contam contra você.
          </div>

          {/* Bottom CTAs — always visible after the details */}
          <div style={{
            marginTop: 28, paddingTop: 22, borderTop: '1px solid var(--gray-light)',
            display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center',
          }}>
            <Link href={`/${clientId}`} style={{
              padding: '12px 24px', borderRadius: 10, border: 'none',
              background: 'var(--navy)', color: 'var(--white)',
              fontWeight: 700, fontSize: 14, textDecoration: 'none',
            }}>← Voltar aos módulos</Link>
            <button onClick={restart} style={{
              padding: '12px 24px', borderRadius: 10, border: '1px solid var(--gray-light)',
              background: 'var(--white)', color: 'var(--text)',
              fontWeight: 600, fontSize: 14, cursor: 'pointer',
            }}>Refazer a prova</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function GreenScreen({ score, moduleNum, clientId, restart }) {
  return (
    <>
      <div className="checker-band" />
      <div style={{ textAlign: 'center', padding: '40px 20px 28px' }}>
        <div style={{
          width: 96, height: 96, margin: '0 auto 14px', borderRadius: 24,
          background: '#2F855A15', color: '#2F855A',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'pop 0.6s ease-out',
        }}>
          <Icon name="trophy" size={56} color="#2F855A" strokeWidth={1.5} />
        </div>
        <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase', color: '#2F855A', marginBottom: 4 }}>
          Luz verde!
        </div>
        <h1 style={{ fontSize: 36, fontWeight: 900, color: '#22543D', margin: '6px 0', letterSpacing: -0.5 }}>
          Você cruzou a linha de chegada
        </h1>
        <div style={{ fontSize: 80, fontWeight: 900, color: '#2F855A', lineHeight: 1, margin: '10px 0' }}>
          {score.toFixed(1)}
        </div>
        <p style={{ fontSize: 15, color: '#22543D', maxWidth: 460, margin: '0 auto 24px', lineHeight: 1.6 }}>
          Excelente desempenho! Você está liberado para o próximo módulo. Continue nesse ritmo — está pilotando direto.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href={`/${clientId}`} style={{
            padding: '14px 26px', borderRadius: 12, border: 'none',
            background: 'linear-gradient(135deg, #2F855A 0%, #38A169 100%)',
            color: '#FFF', fontWeight: 700, fontSize: 15, textDecoration: 'none',
            boxShadow: '0 8px 22px rgba(47,133,90,.3)',
          }}>Avançar no curso →</Link>
          <button onClick={restart} style={{
            padding: '14px 26px', borderRadius: 12, border: '1px solid #C6F6D5',
            background: '#FFF', color: '#22543D', fontWeight: 700, fontSize: 15, cursor: 'pointer',
          }}>Refazer prova</button>
        </div>
      </div>
      <div className="checker-band" />
    </>
  );
}

function AmberScreen({ score, restart, backToStart, clientId }) {
  return (
    <div style={{ textAlign: 'center', padding: '40px 24px 28px' }}>
      <div style={{
        width: 88, height: 88, margin: '0 auto 14px', borderRadius: 22,
        background: '#B7791F15', color: '#B7791F',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: 'pop 0.6s ease-out',
      }}>
        <Icon name="bicep" size={48} color="#B7791F" strokeWidth={1.5} />
      </div>
      <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase', color: '#B7791F', marginBottom: 4 }}>
        Você está perto!
      </div>
      <h1 style={{ fontSize: 32, fontWeight: 900, color: '#7B341E', margin: '6px 0', lineHeight: 1.15 }}>
        Faltou pouco para a luz verde
      </h1>
      <div style={{ fontSize: 80, fontWeight: 900, color: '#B7791F', lineHeight: 1, margin: '10px 0' }}>
        {score.toFixed(1)}
      </div>
      <p style={{ fontSize: 15, color: '#7B341E', maxWidth: 480, margin: '0 auto 8px', lineHeight: 1.6 }}>
        Bom trabalho! Você já domina muita coisa do módulo. Olhe os exercícios em vermelho/amarelo logo abaixo, revise os tópicos que ainda escapam, e refaça a prova.
      </p>
      <p style={{ fontSize: 14, color: '#B7791F', fontWeight: 600, marginBottom: 24 }}>
        Quase lá. Mais uma volta no circuito e você cruza a linha.
      </p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <button onClick={restart} style={{
          padding: '14px 26px', borderRadius: 12, border: 'none',
          background: 'linear-gradient(135deg, #B7791F 0%, #D69E2E 100%)',
          color: '#FFF', fontWeight: 700, fontSize: 15, cursor: 'pointer',
          boxShadow: '0 8px 22px rgba(183,121,31,.25)',
        }}>Refazer a prova</button>
        <Link href={`/${clientId}`} style={{
          padding: '14px 26px', borderRadius: 12, border: '1px solid #FBD38D',
          background: '#FFF', color: '#7B341E', fontWeight: 700, fontSize: 15, textDecoration: 'none',
        }}>Voltar e revisar o módulo</Link>
      </div>
    </div>
  );
}

function RedScreen({ score, restart, backToStart, clientId }) {
  return (
    <div style={{ textAlign: 'center', padding: '40px 24px 28px' }}>
      <div style={{
        width: 88, height: 88, margin: '0 auto 14px', borderRadius: 22,
        background: '#C5303015', color: '#C53030',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: 'pop 0.6s ease-out',
      }}>
        <Icon name="seedling" size={48} color="#C53030" strokeWidth={1.5} />
      </div>
      <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase', color: '#C53030', marginBottom: 4 }}>
        Toda jornada tem início
      </div>
      <h1 style={{ fontSize: 32, fontWeight: 900, color: '#742A2A', margin: '6px 0', lineHeight: 1.15 }}>
        Vamos com calma — você consegue
      </h1>
      <div style={{ fontSize: 80, fontWeight: 900, color: '#C53030', lineHeight: 1, margin: '10px 0' }}>
        {score.toFixed(1)}
      </div>
      <p style={{ fontSize: 15, color: '#742A2A', maxWidth: 500, margin: '0 auto 12px', lineHeight: 1.65 }}>
        Esta nota não te define. Aprender uma língua tem altos e baixos, e errar agora é como o piloto que sai da pista no treino: faz parte. Vamos ajustar.
      </p>
      <div style={{
        background: '#FFF5F5', border: '1px solid #FEB2B2', borderRadius: 12,
        padding: 18, margin: '0 auto 22px', maxWidth: 500, textAlign: 'left',
      }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#742A2A', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon name="phone" size={16} color="#742A2A" />
          <span>Próximo passo</span>
        </div>
        <p style={{ fontSize: 14, color: '#742A2A', lineHeight: 1.6, margin: 0 }}>
          Procure seu <strong>professor</strong> para um suporte extra. Conte onde sentiu mais dificuldade — ele vai te ajudar a destravar os pontos exatos. Depois, volte aqui e refaça a prova.
        </p>
      </div>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link href={`/${clientId}`} style={{
          padding: '14px 26px', borderRadius: 12, border: 'none',
          background: 'linear-gradient(135deg, #C53030 0%, #E53E3E 100%)',
          color: '#FFF', fontWeight: 700, fontSize: 15, textDecoration: 'none',
          boxShadow: '0 8px 22px rgba(197,48,48,.25)',
        }}>Voltar para revisar →</Link>
        <button onClick={restart} style={{
          padding: '14px 26px', borderRadius: 12, border: '1px solid #FED7D7',
          background: '#FFF', color: '#742A2A', fontWeight: 700, fontSize: 15, cursor: 'pointer',
        }}>Refazer a prova</button>
      </div>
    </div>
  );
}

/* ───── Review item (collapsible, shows user answer vs gabarito) ───── */
function ReviewItem({ index, exercise: e, result: r }) {
  const [open, setOpen] = useState(false);
  const acc = r?.accuracy ?? 0;
  const ans = r?.answered;
  const dot = !ans ? 'var(--gray-light)' : acc >= 0.8 ? '#2F855A' : acc >= 0.5 ? '#B7791F' : '#C53030';
  const label = !ans ? '—' : `${Math.round(acc * 100)}%`;

  return (
    <div style={{ background: 'var(--white)', border: '1px solid var(--gray-light)', borderRadius: 8, overflow: 'hidden' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 12,
          padding: '10px 14px', background: 'transparent', border: 'none',
          cursor: 'pointer', fontSize: 13, textAlign: 'left',
        }}
      >
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: dot, flexShrink: 0 }} />
        <span style={{ width: 32, color: 'var(--gray)', fontWeight: 600 }}>{index + 1}.</span>
        <span style={{ flex: 1, color: 'var(--text)' }}>{e.title || e.type}</span>
        <span style={{ fontSize: 11, color: 'var(--gray)' }}>L{String(e.lessonNum || '?').padStart(2, '0')}</span>
        <span style={{ minWidth: 48, textAlign: 'right', fontWeight: 700, color: dot }}>{label}</span>
        <span style={{ color: 'var(--gray)', fontSize: 11, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
      </button>

      {open && (
        <div style={{ padding: '4px 18px 16px', borderTop: '1px solid var(--gray-light)', fontSize: 13, lineHeight: 1.6, background: '#FAFBFD' }}>
          {/* Prompt */}
          {e.prompt && typeof e.prompt === 'string' && (
            <div style={{ marginTop: 12 }}>
              <Label>Pergunta</Label>
              <div style={{ color: 'var(--text)' }}>{e.prompt}</div>
            </div>
          )}

          {/* Per-type review */}
          {e.type === 'fillGap' && <ReviewFillGap ex={e} r={r} />}
          {e.type === 'multipleChoice' && <ReviewMC ex={e} r={r} />}
          {e.type === 'matching' && <ReviewMatching ex={e} r={r} />}
          {e.type === 'reorder' && <ReviewReorder ex={e} r={r} />}
          {e.type === 'writing' && <ReviewWriting ex={e} r={r} />}
          {e.type === 'speaking' && <ReviewSpeaking ex={e} r={r} />}

          {e.explanation && e.type !== 'writing' && (
            <div style={{ marginTop: 12, padding: '8px 12px', background: '#EBF5FF', borderRadius: 6, color: '#2C5282', fontSize: 12 }}>
              💡 {e.explanation}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Label({ children }) {
  return <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: 'var(--gray)', marginBottom: 4, marginTop: 10 }}>{children}</div>;
}

function ReviewFillGap({ ex, r }) {
  const correct = r?.correct;
  const userAns = r?.userAnswer ?? '';
  return (
    <>
      <Label>Sua resposta</Label>
      <div style={{ color: correct ? '#22543D' : '#742A2A', fontWeight: 600 }}>
        {userAns ? `"${userAns}"` : <span style={{ color: 'var(--gray)', fontWeight: 400 }}>— não respondido —</span>}
      </div>
      <Label>Resposta correta</Label>
      <div style={{ color: '#22543D', fontWeight: 600 }}>"{ex.correctAnswer}"</div>
      {ex.acceptable && ex.acceptable.length > 1 && (
        <div style={{ fontSize: 11, color: 'var(--gray)', marginTop: 2 }}>Também aceitas: {ex.acceptable.filter(a => a !== ex.correctAnswer).join(' · ')}</div>
      )}
    </>
  );
}

function ReviewMC({ ex, r }) {
  const correctOpt = ex.options?.find(o => o.correct);
  const userText = r?.userAnswer ?? '';
  return (
    <>
      <Label>Sua resposta</Label>
      <div style={{ color: r?.correct ? '#22543D' : '#742A2A', fontWeight: 600 }}>
        {userText ? userText : <span style={{ color: 'var(--gray)', fontWeight: 400 }}>— não respondido —</span>}
      </div>
      <Label>Resposta correta</Label>
      <div style={{ color: '#22543D', fontWeight: 600 }}>{correctOpt?.text || '—'}</div>
    </>
  );
}

function ReviewMatching({ ex, r }) {
  const sel = r?.userAnswer || {};
  return (
    <>
      <Label>Pares corretos</Label>
      <ul style={{ margin: 0, paddingLeft: 18 }}>
        {(ex.pairs || []).map((p, i) => {
          const ok = sel[p.left] === p.right;
          return (
            <li key={i} style={{ color: ok ? '#22543D' : '#742A2A', marginBottom: 2 }}>
              <strong>{p.left}</strong> → {p.right}
              {sel[p.left] && !ok && <span style={{ color: '#742A2A', marginLeft: 8 }}>(você marcou: {sel[p.left]})</span>}
              {!sel[p.left] && <span style={{ color: 'var(--gray)', marginLeft: 8 }}>(não respondido)</span>}
            </li>
          );
        })}
      </ul>
    </>
  );
}

function ReviewReorder({ ex, r }) {
  const userOrder = r?.userAnswer || [];
  return (
    <>
      <Label>Sua ordem</Label>
      <div style={{ color: r?.correct ? '#22543D' : '#742A2A', fontWeight: 600 }}>
        {userOrder.length ? userOrder.join(' ') : <span style={{ color: 'var(--gray)', fontWeight: 400 }}>— não respondido —</span>}
      </div>
      <Label>Ordem correta</Label>
      <div style={{ color: '#22543D', fontWeight: 600 }}>{ex.correctOrder?.join(' ')}</div>
    </>
  );
}

function ReviewWriting({ ex, r }) {
  const found = r?.found || [];
  const missing = r?.missing || [];
  return (
    <>
      <Label>Sua resposta</Label>
      <div style={{ background: '#FFFFFF', border: '1px solid var(--gray-light)', borderRadius: 6, padding: 10, fontStyle: 'italic', color: 'var(--text)' }}>
        {r?.userAnswer ? r.userAnswer : <span style={{ color: 'var(--gray)', fontStyle: 'normal' }}>— não respondido —</span>}
      </div>
      {found.length > 0 && (
        <>
          <Label>Você usou</Label>
          <div>{found.map(k => <Chip key={k} kind="ok">{k.split('|')[0]}</Chip>)}</div>
        </>
      )}
      {!r?.correct && missing.length > 0 && (
        <>
          <Label>Use ao menos uma</Label>
          <div>{missing.map(k => <Chip key={k} kind="bad">{k.split('|')[0]}</Chip>)}</div>
        </>
      )}
      {ex.modelAnswer && (
        <>
          <Label>Resposta modelo</Label>
          <div style={{ background: '#F0FFF4', border: '1px solid #C6F6D5', borderRadius: 6, padding: 10, color: '#22543D' }}>{ex.modelAnswer}</div>
        </>
      )}
      <div style={{ marginTop: 10, padding: 8, background: '#FFF', borderRadius: 6, fontSize: 11, color: 'var(--gray)' }}>
        ℹ️ Apenas o conteúdo da proposta conta. Pontuação, capitalização e erros em palavras não relacionadas <strong>não</strong> reduzem a nota.
      </div>
    </>
  );
}

function ReviewSpeaking({ ex, r }) {
  return (
    <>
      <Label>Frase pedida</Label>
      <div style={{ color: '#22543D', fontWeight: 600 }}>"{ex.targetText}"</div>
      <Label>O que reconhecemos da sua fala</Label>
      <div style={{ background: '#FFFFFF', border: '1px solid var(--gray-light)', borderRadius: 6, padding: 10, fontStyle: 'italic' }}>
        {r?.userAnswer ? `"${r.userAnswer}"` : <span style={{ color: 'var(--gray)', fontStyle: 'normal' }}>— sem gravação reconhecida —</span>}
      </div>
      <div style={{ marginTop: 8, fontSize: 12, color: 'var(--gray)' }}>
        Acurácia palavra-a-palavra: <strong>{Math.round((r?.accuracy ?? 0) * 100)}%</strong>
      </div>
    </>
  );
}

function Chip({ children, kind }) {
  return (
    <span style={{
      display: 'inline-block', margin: '3px 4px 3px 0', padding: '2px 8px',
      borderRadius: 980, fontSize: 11, fontWeight: 600,
      background: kind === 'ok' ? '#F0FFF4' : '#FFF5F5',
      color: kind === 'ok' ? '#22543D' : '#742A2A',
      border: `1px solid ${kind === 'ok' ? '#9AE6B4' : '#FEB2B2'}`,
    }}>{children}</span>
  );
}

/* ───── Confetti (CSS animation, no deps) ───── */
function Confetti() {
  const pieces = useMemo(
    () => Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 3 + Math.random() * 4,
      color: ['#2F855A', '#38A169', '#B7791F', '#D69E2E', '#0F1D3A', '#0071E3', '#FFFFFF'][i % 7],
      size: 6 + Math.random() * 6,
      rotate: Math.random() * 360,
    })),
    []
  );
  return (
    <div className="confetti" aria-hidden="true">
      {pieces.map(p => (
        <span key={p.id} style={{
          left: `${p.left}%`,
          width: p.size, height: p.size,
          background: p.color,
          animationDelay: `${p.delay}s`,
          animationDuration: `${p.duration}s`,
          transform: `rotate(${p.rotate}deg)`,
        }} />
      ))}
    </div>
  );
}
