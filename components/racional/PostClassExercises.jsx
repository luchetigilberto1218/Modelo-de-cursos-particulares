'use client';

import { useState } from 'react';
import Exercise from '../Exercise';
import RacionalFlashcards from './RacionalFlashcards';

const OK = '#1E7A46', OKBG = '#F0FFF4', OKB = '#9AE6B4';
const BAD = '#B4232F', BADBG = '#FFF5F5', BADB = '#FEB2B2';
const norm = (s) => String(s || '').trim().toLowerCase().replace(/[.,!?;:"“”]+$/, '');

/* Dispatcher: renderiza a parte interativa de um bloco de pós-aula. */
export default function PostClassBlock({ block, accent = '#102A71', voice = 'gb-female' }) {
  switch (block.render) {
    case 'engine':
      return (<>{(block.exercises || []).map((ex, i) => <Exercise key={i} exercise={ex} levelId="starter" />)}</>);
    case 'truefalse':
      return <TrueFalse items={block.items} accent={accent} />;
    case 'memory':
      return <MemoryMatch deck={block.deck} accent={accent} />;
    case 'wordbank':
      return <WordBankCloze items={block.items} bank={block.bank} accent={accent} />;
    case 'tiles':
      return <LetterTiles items={block.items} accent={accent} />;
    case 'picture':
      return <PictureChoice block={block} accent={accent} />;
    case 'flashdeck':
      return (
        <RacionalFlashcards
          vocab={block.vocab} title={block.deckTitle} image={block.image}
          voice={voice} level="starter" accent={accent} T={(pt) => pt}
        />
      );
    default:
      return null;
  }
}

/* ───── Verdadeiro ou falso ───── */
function TrueFalse({ items = [], accent }) {
  const [ans, setAns] = useState({});
  return (
    <div className="pc-card">
      {items.map((it, i) => {
        const chosen = ans[i];
        const done = chosen !== undefined;
        const right = done && chosen === it.answer;
        return (
          <div key={i} className="pc-tf-row">
            <div className="pc-tf-text">{it.text}</div>
            <div className="pc-tf-btns">
              {[{ v: true, l: 'V' }, { v: false, l: 'F' }].map((b) => {
                const active = chosen === b.v;
                return (
                  <button key={b.l} type="button" disabled={done}
                    onClick={() => setAns((s) => ({ ...s, [i]: b.v }))}
                    className={`pc-tf-btn ${active ? (right ? 'ok' : 'bad') : ''}`}
                    style={active && right ? { background: OK, borderColor: OK, color: '#fff' } : active ? { background: BAD, borderColor: BAD, color: '#fff' } : null}>
                    {b.l}
                  </button>
                );
              })}
            </div>
            {done && <div className="pc-fb" style={{ color: right ? OK : BAD }}>{right ? '✓ ' : '✗ '}{it.explain}</div>}
          </div>
        );
      })}
    </div>
  );
}

/* ───── Jogo da memória (palavra ↔ tradução) ───── */
function MemoryMatch({ deck = [], accent }) {
  const [flipped, setFlipped] = useState([]);     // ids virados no lance atual
  const [matched, setMatched] = useState([]);     // keys já encontradas
  const [lock, setLock] = useState(false);
  const done = matched.length > 0 && matched.length === new Set(deck.map((c) => c.key)).size;

  function flip(card) {
    if (lock || flipped.includes(card.id) || matched.includes(card.key)) return;
    const now = [...flipped, card.id];
    setFlipped(now);
    if (now.length === 2) {
      setLock(true);
      const [a, b] = now.map((id) => deck.find((c) => c.id === id));
      if (a.key === b.key) {
        setTimeout(() => { setMatched((m) => [...m, a.key]); setFlipped([]); setLock(false); }, 420);
      } else {
        setTimeout(() => { setFlipped([]); setLock(false); }, 900);
      }
    }
  }

  return (
    <div className="pc-card">
      <div className="pc-mem-grid">
        {deck.map((card) => {
          const isUp = flipped.includes(card.id) || matched.includes(card.key);
          return (
            <button key={card.id} type="button" onClick={() => flip(card)}
              className={`pc-mem-card ${isUp ? 'up' : ''} ${matched.includes(card.key) ? 'done' : ''}`}
              style={isUp ? { borderColor: accent } : null}>
              <span className="pc-mem-face">{isUp ? card.face : '?'}</span>
            </button>
          );
        })}
      </div>
      {done && <div className="pc-fb" style={{ color: OK }}>✓ Todos os pares encontrados!</div>}
    </div>
  );
}

/* ───── Banco de palavras (completar sem digitar) ───── */
function WordBankCloze({ items = [], bank = [], accent }) {
  const [placed, setPlaced] = useState({});   // idx -> palavra
  const [sel, setSel] = useState(null);
  const [checked, setChecked] = useState(false);

  function placeOn(idx) {
    if (checked || !sel) return;
    setPlaced((p) => ({ ...p, [idx]: sel }));
    setSel(null);
  }
  const allPlaced = items.every((_, i) => placed[i]);

  return (
    <div className="pc-card">
      <div className="pc-bank">
        {bank.map((w, i) => (
          <button key={i} type="button" disabled={checked}
            onClick={() => setSel(w)} className={`pc-chip ${sel === w ? 'sel' : ''}`}
            style={sel === w ? { borderColor: accent, background: '#EBF2FF' } : null}>{w}</button>
        ))}
      </div>
      <ol className="pc-cloze-list">
        {items.map((it, i) => {
          const val = placed[i];
          const right = checked && norm(val) === norm(it.answer);
          return (
            <li key={i}>
              <span>{it.before}</span>
              <button type="button" onClick={() => placeOn(i)} disabled={checked}
                className="pc-blank"
                style={checked ? { borderColor: right ? OK : BAD, background: right ? OKBG : BADBG, color: right ? OK : BAD } : val ? { borderColor: accent } : null}>
                {val || '＿＿＿'}
              </button>
              <span>{it.after}</span>
              {checked && !right && <span className="pc-fb-inline" style={{ color: BAD }}> ✗ {it.answer}</span>}
            </li>
          );
        })}
      </ol>
      {!checked ? (
        <button type="button" className="rc-btn rc-btn-primary pc-check" style={{ background: allPlaced ? accent : '#CBD5E0' }} disabled={!allPlaced} onClick={() => setChecked(true)}>Corrigir</button>
      ) : (
        <button type="button" className="rc-btn rc-btn-outline pc-check" onClick={() => { setChecked(false); setPlaced({}); setSel(null); }}>Refazer</button>
      )}
    </div>
  );
}

/* ───── Montar peças (letras ou palavras) ───── */
function LetterTiles({ items = [], accent }) {
  return (
    <div className="pc-card">
      {items.map((it, i) => <TileItem key={i} item={it} accent={accent} sep={it.mode === 'words' ? ' ' : ''} />)}
    </div>
  );
}
function TileItem({ item, accent, sep }) {
  const [order, setOrder] = useState([]);   // índices das peças usadas, na ordem
  const [checked, setChecked] = useState(false);
  const used = new Set(order);
  const built = order.map((idx) => item.tiles[idx]);
  const right = built.join('') === item.target.join('');

  return (
    <div className="pc-tile-item">
      {item.hint && <div className="pc-tile-hint">Dica: {item.hint}</div>}
      <div className="pc-tile-answer" style={checked ? { borderColor: right ? OK : BAD, background: right ? OKBG : BADBG } : null}>
        {built.length ? built.map((u, i) => (
          <button key={i} type="button" disabled={checked} className="pc-tile used" onClick={() => setOrder((o) => o.filter((_, j) => j !== i))}>{u}{sep}</button>
        )) : <span className="pc-tile-ph">toque nas peças abaixo…</span>}
      </div>
      <div className="pc-tile-bank">
        {item.tiles.map((t, idx) => (
          <button key={idx} type="button" disabled={checked || used.has(idx)}
            className={`pc-tile ${used.has(idx) ? 'spent' : ''}`}
            style={!used.has(idx) ? { borderColor: accent } : null}
            onClick={() => setOrder((o) => [...o, idx])}>{t}</button>
        ))}
      </div>
      <div className="pc-tile-actions">
        {!checked ? (
          <button type="button" className="rc-btn rc-btn-primary pc-check" style={{ background: order.length ? accent : '#CBD5E0' }} disabled={!order.length} onClick={() => setChecked(true)}>Conferir</button>
        ) : (
          <>
            <span className="pc-fb" style={{ color: right ? OK : BAD }}>{right ? '✓ Certo!' : `✗ Certo: ${item.target.join(sep)}`}</span>
            <button type="button" className="rc-btn rc-btn-outline pc-check" onClick={() => { setChecked(false); setOrder([]); }}>Refazer</button>
          </>
        )}
      </div>
    </div>
  );
}

/* ───── Escolha com imagem ───── */
function PictureChoice({ block, accent }) {
  const [choice, setChoice] = useState(null);
  const [checked, setChecked] = useState(false);
  const sel = block.options.find((o) => o.id === choice);
  const right = checked && sel?.correct;
  return (
    <div className="pc-card">
      {block.image && (
        <figure className="pc-pic">
          <img src={block.image} alt="" />
          {block.caption && <figcaption>{block.caption}</figcaption>}
        </figure>
      )}
      {block.prompt && <p className="pc-pic-prompt">{block.prompt}</p>}
      <div className="pc-pic-opts">
        {block.options.map((o) => {
          const isThis = choice === o.id;
          const showOk = checked && o.correct;
          const showBad = checked && isThis && !o.correct;
          return (
            <button key={o.id} type="button" disabled={checked} onClick={() => setChoice(o.id)}
              className="pc-pic-opt"
              style={showOk ? { borderColor: OK, background: OKBG, color: OK } : showBad ? { borderColor: BAD, background: BADBG, color: BAD } : isThis ? { borderColor: accent, background: '#EBF2FF' } : null}>
              <b>{o.id.toUpperCase()}.</b> {o.text}{showOk ? ' ✓' : showBad ? ' ✗' : ''}
            </button>
          );
        })}
      </div>
      {!checked ? (
        <button type="button" className="rc-btn rc-btn-primary pc-check" style={{ background: choice ? accent : '#CBD5E0' }} disabled={!choice} onClick={() => setChecked(true)}>Corrigir</button>
      ) : (
        <>
          <div className="pc-fb" style={{ color: right ? OK : BAD }}>{right ? '✓ ' : '✗ '}{block.explanation}</div>
          <button type="button" className="rc-btn rc-btn-outline pc-check" onClick={() => { setChecked(false); setChoice(null); }}>Refazer</button>
        </>
      )}
    </div>
  );
}
