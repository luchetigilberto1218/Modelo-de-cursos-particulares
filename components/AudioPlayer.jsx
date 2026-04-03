'use client';

import { useRef, useState } from 'react';

export default function AudioPlayer({ text, rate = 0.85, label = 'Listen', small = false }) {
  const [state, setState] = useState('idle'); // idle | playing | paused
  const utterRef = useRef(null);

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

    // Start new
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    u.rate = rate;
    u.pitch = 1;

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
