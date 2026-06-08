'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * AudioPlayer — instant Web Speech API (browser) with optional pre-generated MP3 fallback.
 *
 * Web Speech is INSTANT (no network roundtrip) and uses OS-native voices, which on
 * Edge/Chrome/Windows are quite natural ("Microsoft Aria", "Microsoft Guy", etc.).
 *
 * Props:
 *   text       — string to speak
 *   audioUrl   — optional pre-generated MP3 url (preferred when available, e.g. ElevenLabs)
 *   voiceType  — 'us-male' | 'us-female' | 'gb-male' | 'gb-female' | character name
 *   rate       — playback rate (default 0.85 for clarity at A1 level)
 *   label      — button label
 *   small/size — visual size variant
 */

// Map voiceType → preferred OS voice patterns. We pick the first that matches.
const VOICE_PREFS = {
  'us-male':   { lang: 'en-US', genderHints: ['guy', 'eric', 'aaron', 'tony', 'davis', 'roger', 'male'] },
  'us-female': { lang: 'en-US', genderHints: ['aria', 'jenny', 'jane', 'samantha', 'female'] },
  'gb-male':   { lang: 'en-GB', genderHints: ['ryan', 'thomas', 'alfie', 'george', 'oliver', 'male'] },
  'gb-female': { lang: 'en-GB', genderHints: ['sonia', 'libby', 'ava', 'olivia', 'kate', 'female'] },
  // FAAP-style aliases
  'james':    { lang: 'en-GB', genderHints: ['ryan', 'james', 'thomas', 'male'] },
  'oliver':   { lang: 'en-GB', genderHints: ['oliver', 'thomas', 'male'] },
  'harry':    { lang: 'en-AU', genderHints: ['william', 'james', 'male'] },
  'sophie':   { lang: 'en-GB', genderHints: ['sonia', 'female'] },
  'emily':    { lang: 'en-IE', genderHints: ['emily', 'female'] },
  'charlotte':{ lang: 'en-NZ', genderHints: ['molly', 'female'] },
  // Português (BR) — texto em PT deve ser lido com voz PT-BR.
  'pt-br':        { lang: 'pt-BR', genderHints: ['francisca', 'maria', 'luciana', 'female', 'antonio', 'daniel', 'male'] },
  'pt-br-female': { lang: 'pt-BR', genderHints: ['francisca', 'maria', 'luciana', 'female'] },
  'pt-br-male':   { lang: 'pt-BR', genderHints: ['antonio', 'daniel', 'male'] },
};

function pickVoice(voices, voiceType = 'us-male') {
  const pref = VOICE_PREFS[voiceType] || VOICE_PREFS['us-male'];
  const langPrefix = pref.lang.split('-')[0]; // 'en'

  // 1) lang exact + name hint
  for (const hint of pref.genderHints) {
    const v = voices.find(v => v.lang?.toLowerCase().startsWith(pref.lang.toLowerCase()) && v.name?.toLowerCase().includes(hint));
    if (v) return v;
  }
  // 2) lang exact, any name
  const langExact = voices.find(v => v.lang?.toLowerCase() === pref.lang.toLowerCase());
  if (langExact) return langExact;
  // 3) any en-* voice
  const anyEn = voices.find(v => v.lang?.toLowerCase().startsWith(langPrefix + '-'));
  return anyEn || voices[0] || null;
}

function stripHtml(s) {
  return String(s || '')
    .replace(/<br\s*\/?>/gi, '. ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Texto majoritariamente em português → deve ser lido com voz PT-BR, mesmo que a
// chamada passe uma voiceType inglesa. Heurística leve (acentos + palavras-função
// PT vs EN); conservadora: só vira PT quando PT supera EN, pra não trocar texto inglês.
function isPortuguese(text) {
  const t = ` ${stripHtml(text).toLowerCase()} `;
  if (!t.trim()) return false;
  const pt = (t.match(/[áàâãéêíóôõúüç]|\b(você|voce|não|nao|para|com|que|uma|seu|sua|isso|aqui|então|porque|quando|aula|frases|prática|cliente|obra|reunião|sobre|vai|este|esta|nesta|neste|muito|mais|como|fazer|também|seus|suas|nós|são|está)\b/g) || []).length;
  const en = (t.match(/\b(the|you|your|this|with|that|will|about|meeting|client|they|are|for|and|to|of|is|in|on|we|our|it)\b/g) || []).length;
  return pt > en;
}

// Resolve a voiceType efetiva: se o texto é PT e a voz pedida não é PT, usa pt-BR.
function effectiveVoiceType(voiceType, text) {
  if (String(voiceType || '').startsWith('pt')) return voiceType;
  return isPortuguese(text) ? 'pt-br' : (voiceType || 'us-male');
}

// Resolve um MP3 pré-gerado (ex.: ElevenLabs) a partir de um manifesto global
// opcional: window.__RC_AUDIO__ = { base, sep, manifest: { `${voiceType}${sep}${stripHtml(text)}`: 'rel/path.mp3' } }.
// Sem o global (ou sem entrada), retorna null e o player usa Web Speech.
function resolveManifestUrl(voiceType, text) {
  if (typeof window === 'undefined') return null;
  const g = window.__RC_AUDIO__;
  if (!g || !g.manifest) return null;
  const key = (voiceType || 'us-male') + (g.sep || '') + stripHtml(text);
  const rel = g.manifest[key];
  return rel ? (g.base || '') + rel : null;
}

export default function AudioPlayer({
  text,
  audioUrl = null,
  voiceType = 'us-male',
  rate = 0.85,
  label = 'Listen',
  small = false,
  size,
}) {
  const [state, setState] = useState('idle'); // 'idle' | 'playing' | 'paused' | 'unsupported'
  const [voices, setVoices] = useState([]);
  const audioRef = useRef(null);
  const utteranceRef = useRef(null);
  const modeRef = useRef(null); // 'mp3' | 'speech' — qual via está ativa (para pausar/retomar)

  const useNative = !!audioUrl;
  const supportsSpeech = typeof window !== 'undefined' && !!window.speechSynthesis;

  useEffect(() => {
    if (useNative) return;
    if (!supportsSpeech) { setState('unsupported'); return; }
    function loadVoices() { setVoices(window.speechSynthesis.getVoices() || []); }
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
      if (utteranceRef.current) try { window.speechSynthesis.cancel(); } catch (_) {}
    };
  }, [useNative, supportsSpeech]);

  // Inicia do começo (cria/reinicia o áudio).
  function start() {
    if (!text && !audioUrl) return;
    // Texto PT → voz pt-BR mesmo que a chamada peça voz inglesa (varredura global).
    const vt = effectiveVoiceType(voiceType, text);
    // Pre-generated MP3 path (prop explícita ou manifesto global resolvido no clique)
    const mp3Url = audioUrl || resolveManifestUrl(vt, text);
    if (mp3Url) {
      if (!audioRef.current || audioRef.current.dataset.url !== mp3Url) {
        audioRef.current = new Audio(mp3Url);
        audioRef.current.dataset.url = mp3Url;
        audioRef.current.onended = () => setState('idle');
        audioRef.current.onerror = () => setState('idle');
      }
      modeRef.current = 'mp3';
      audioRef.current.currentTime = 0;
      audioRef.current.playbackRate = rate;
      audioRef.current.play().then(() => setState('playing')).catch(() => setState('idle'));
      return;
    }
    // Web Speech path
    if (!supportsSpeech) return;
    try { window.speechSynthesis.cancel(); } catch (_) {}
    const cleanText = stripHtml(text);
    if (!cleanText) return;
    const u = new SpeechSynthesisUtterance(cleanText);
    u.rate = rate;
    u.pitch = 1.0;
    const v = pickVoice(voices, vt);
    if (v) { u.voice = v; u.lang = v.lang; }
    else u.lang = (VOICE_PREFS[vt]?.lang) || 'en-US';
    u.onend = () => setState('idle');
    u.onerror = () => setState('idle');
    utteranceRef.current = u;
    modeRef.current = 'speech';
    window.speechSynthesis.speak(u);
    setState('playing');
  }

  // Pausa mantendo a posição.
  function pause() {
    if (modeRef.current === 'mp3') {
      try { audioRef.current?.pause(); } catch (_) {}
    } else if (supportsSpeech) {
      try { window.speechSynthesis.pause(); } catch (_) {}
    }
    setState('paused');
  }

  // Retoma de onde parou.
  function resume() {
    if (modeRef.current === 'mp3') {
      audioRef.current?.play().then(() => setState('playing')).catch(() => setState('idle'));
    } else if (supportsSpeech) {
      try { window.speechSynthesis.resume(); } catch (_) {}
      setState('playing');
    }
  }

  // Clique único alterna: tocar → pausar → continuar.
  function toggle() {
    if (state === 'playing') pause();
    else if (state === 'paused') resume();
    else start();
  }

  if (state === 'unsupported' && !useNative) {
    return (
      <button className="btn-audio" disabled style={{ opacity: 0.4 }} title="Áudio não suportado">
        ▶ {label}
      </button>
    );
  }

  const isPlaying = state === 'playing';
  const isPaused = state === 'paused';
  const isSmall = small || size === 'xs' || size === 'sm';
  const styleSmall = isSmall ? { padding: '4px 10px', fontSize: 11 } : {};
  // ▶ tocar (idle) · ⏸ pausar (tocando) · ▶ continuar (pausado)
  const icon = isPlaying ? '⏸' : '▶';

  return (
    <button
      className={'btn-audio' + (isPlaying ? ' playing' : '') + (isPaused ? ' paused' : '')}
      onClick={toggle}
      type="button"
      style={styleSmall}
      aria-label={isPlaying ? 'Pausar' : isPaused ? 'Continuar' : label}
      title={isPlaying ? 'Pausar' : isPaused ? 'Continuar' : label}
    >
      {icon + ' ' + (label || 'Listen')}
    </button>
  );
}
