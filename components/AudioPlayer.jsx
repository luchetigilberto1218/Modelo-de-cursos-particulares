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

export default function AudioPlayer({
  text,
  audioUrl = null,
  voiceType = 'us-male',
  rate = 0.85,
  label = 'Listen',
  small = false,
  size,
}) {
  const [state, setState] = useState('idle'); // 'idle' | 'playing' | 'unsupported'
  const [voices, setVoices] = useState([]);
  const audioRef = useRef(null);
  const utteranceRef = useRef(null);

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

  function play() {
    if (!text && !audioUrl) return;
    // Pre-generated MP3 path
    if (useNative) {
      if (!audioRef.current) {
        audioRef.current = new Audio(audioUrl);
        audioRef.current.onended = () => setState('idle');
        audioRef.current.onerror = () => setState('idle');
      }
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
    const v = pickVoice(voices, voiceType);
    if (v) { u.voice = v; u.lang = v.lang; }
    else u.lang = (VOICE_PREFS[voiceType]?.lang) || 'en-US';
    u.onend = () => setState('idle');
    u.onerror = () => setState('idle');
    utteranceRef.current = u;
    window.speechSynthesis.speak(u);
    setState('playing');
  }

  function stop() {
    if (useNative) {
      try { audioRef.current?.pause(); } catch (_) {}
      setState('idle');
      return;
    }
    if (supportsSpeech) try { window.speechSynthesis.cancel(); } catch (_) {}
    setState('idle');
  }

  if (state === 'unsupported' && !useNative) {
    return (
      <button className="btn-audio" disabled style={{ opacity: 0.4 }} title="Áudio não suportado">
        ▶ {label}
      </button>
    );
  }

  const isPlaying = state === 'playing';
  const isSmall = small || size === 'xs' || size === 'sm';
  const styleSmall = isSmall ? { padding: '4px 10px', fontSize: 11 } : {};

  return (
    <button
      className={'btn-audio' + (isPlaying ? ' playing' : '')}
      onClick={isPlaying ? stop : play}
      type="button"
      style={styleSmall}
      aria-label={label}
      title={label}
    >
      {isPlaying ? '◼ ' + (label || 'Stop') : '▶ ' + (label || 'Listen')}
    </button>
  );
}
