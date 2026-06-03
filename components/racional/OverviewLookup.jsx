'use client';

import { useState } from 'react';
import Icon from './RacionalIcon';

/**
 * OverviewLookup — campo educativo de dúvida de vocabulário.
 *
 * Aparece logo abaixo do overview de cada aula. O aluno digita uma palavra
 * que não conhece e clica em "Traduzir"; só então a tradução aparece — assim
 * a tradução não fica "na cara", mas o texto também não vira inimigo da aula.
 *
 * Tradução automática (qualquer palavra) via MyMemory — grátis, sem chave,
 * com CORS, então roda 100% no navegador. Detecta a direção pela 1ª palavra:
 * se tem letra acentuada/parece PT, traduz PT→EN; senão EN→PT.
 *
 * Aditivo e isolado: não altera nada do conteúdo existente.
 */
export default function OverviewLookup({ accent = '#102a71' }) {
  const [word, setWord] = useState('');
  const [result, setResult] = useState(null); // { from, to, src, out }
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(false);

  async function lookup() {
    const term = word.trim();
    if (!term || loading) return;
    setLoading(true);
    setErr(false);
    setResult(null);
    // Direção: palavra com acento ou termo claramente PT → PT→EN; senão EN→PT.
    const looksPT = /[áàâãéêíóôõúüç]/i.test(term);
    const pair = looksPT ? 'pt|en' : 'en|pt';
    try {
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(term)}&langpair=${pair}`;
      const r = await fetch(url);
      const j = await r.json();
      const out = j?.responseData?.translatedText;
      if (!out) throw new Error('no translation');
      setResult({
        from: looksPT ? 'PT' : 'EN',
        to: looksPT ? 'EN' : 'PT',
        src: term,
        out,
      });
    } catch {
      setErr(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rc-lookup">
      <div className="rc-lookup-head">
        <Icon name="book" size={15} />
        <span>Ficou com dúvida em alguma palavra? Escreva aqui e confira a tradução.</span>
      </div>
      <div className="rc-lookup-row">
        <input
          className="rc-lookup-input"
          type="text"
          value={word}
          placeholder="ex.: stakeholder, target, goal…"
          onChange={(e) => setWord(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') lookup(); }}
          aria-label="Palavra para traduzir"
        />
        <button
          className="rc-lookup-btn"
          style={{ background: accent }}
          onClick={lookup}
          disabled={loading || !word.trim()}
        >
          {loading ? 'Traduzindo…' : 'Traduzir'}
        </button>
      </div>

      {result && (
        <div className="rc-lookup-out">
          <span className="rc-lookup-src">{result.src}</span>
          <span className="rc-lookup-arrow">→</span>
          <span className="rc-lookup-tr">{result.out}</span>
          <span className="rc-lookup-dir">{result.from}→{result.to}</span>
        </div>
      )}
      {err && (
        <div className="rc-lookup-err">Não consegui traduzir agora. Tente de novo em instantes.</div>
      )}
    </div>
  );
}
