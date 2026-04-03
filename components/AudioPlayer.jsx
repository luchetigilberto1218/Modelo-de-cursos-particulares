'use client';

import { useRef, useState, useEffect } from 'react';

// Voice search preferences by type
const VOICE_PREFS = {
  'us-male': {
    lang: 'en-US',
    names: ['microsoft david', 'microsoft mark', 'google us english male', 'james', 'guy'],
    avoid: ['zira', 'jenny', 'aria', 'sara', 'female'],
  },
  'us-female': {
    lang: 'en-US',
    names: ['microsoft zira', 'microsoft jenny', 'microsoft aria', 'google us english', 'samantha'],
    avoid: ['david', 'mark', 'james', 'guy', 'male'],
  },
  'gb-male': {
    lang: 'en-GB',
    names: ['microsoft george', 'microsoft ryan', 'google uk english male', 'daniel'],
    avoid: ['hazel', 'libby', 'sonia', 'female', 'kate'],
  },
  'gb-female': {
    lang: 'en-GB',
    names: ['microsoft hazel', 'microsoft libby', 'microsoft sonia', 'google uk english female', 'kate'],
    avoid: ['george', 'ryan', 'male', 'daniel'],
  },
};

function findVoice(voices, voiceType) {
  const pref = VOICE_PREFS[voiceType];
  if (!pref) return null;

  // Filter voices by language
  const langVoices = voices.filter(v =>
    v.lang.startsWith(pref.lang.split('-')[0]) &&
    (v.lang.includes(pref.lang.split('-')[1]) || v.lang === pref.lang)
  );

  // Try to match by preferred name
  for (const name of pref.names) {
    const match = langVoices.find(v => v.name.toLowerCase().includes(name));
    if (match) return match;
  }

  // Fallback: pick a voice in the right language, avoiding wrong gender keywords
  const filtered = langVoices.filter(v => {
    const n = v.name.toLowerCase();
    return !pref.avoid.some(a => n.includes(a));
  });

  return filtered[0] || langVoices[0] || null;
}

export default function AudioPlayer({ text, rate = 0.85, label = 'Listen', small = false, voiceType = 'us-male' }) {
  const [state, setState] = useState('idle');
  const [voices, setVoices] = useState([]);
  const utterRef = useRef(null);

  useEffect(() => {
    const synth = window.speechSynthesis;
    const loadVoices = () => {
      const v = synth.getVoices();
      if (v.length > 0) setVoices(v);
    };
    loadVoices();
    synth.addEventListener('voiceschanged', loadVoices);
    return () => synth.removeEventListener('voiceschanged', loadVoices);
  }, []);

  function handleClick() {
    const synth = window.speechSynthesis;

    if (state === 'playing') {
      synth.pause();
      setState('paused');
      return;
    }

    if (state === 'paused') {
      synth.resume();
      setState('playing');
      return;
    }

    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);

    const pref = VOICE_PREFS[voiceType];
    u.lang = pref?.lang || 'en-US';
    u.rate = rate;
    u.pitch = 1;

    const voice = findVoice(voices.length > 0 ? voices : synth.getVoices(), voiceType);
    if (voice) u.voice = voice;

    u.onend = () => setState('idle');
    u.onerror = () => setState('idle');

    utterRef.current = u;
    synth.speak(u);
    setState('playing');
  }

  const labels = {
    idle: `▶ ${label}`,
    playing: '◼ Pause',
    paused: '▶ Resume',
  };

  const className = `btn-audio${state === 'playing' ? ' playing' : ''}`;
  const style = small ? { padding: '4px 10px', fontSize: 11 } : {};

  return (
    <button className={className} onClick={handleClick} style={style}>
      {labels[state]}
    </button>
  );
}
