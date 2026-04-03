'use client';

import { useRef, useState } from 'react';

export default function AudioPlayer({ text, rate = 0.85, label = 'Listen', small = false, voiceType = 'us-male' }) {
  const [state, setState] = useState('idle');
  const audioRef = useRef(null);

  function handleClick() {
    // Playing → Pause
    if (state === 'playing' && audioRef.current) {
      audioRef.current.pause();
      setState('paused');
      return;
    }

    // Paused → Resume
    if (state === 'paused' && audioRef.current) {
      audioRef.current.play();
      setState('playing');
      return;
    }

    // Idle → Start new
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    setState('loading');

    const params = new URLSearchParams({ text, voice: voiceType });
    const audio = new Audio(`/api/tts?${params}`);
    audio.playbackRate = rate;

    audio.oncanplaythrough = () => {
      audio.play();
      setState('playing');
    };

    audio.onended = () => setState('idle');
    audio.onerror = () => setState('idle');

    audioRef.current = audio;
  }

  const labels = {
    idle: `▶ ${label}`,
    loading: `… ${label}`,
    playing: '◼ Pause',
    paused: '▶ Resume',
  };

  const className = `btn-audio${state === 'playing' ? ' playing' : ''}${state === 'loading' ? ' loading' : ''}`;
  const style = small ? { padding: '4px 10px', fontSize: 11 } : {};

  return (
    <button className={className} onClick={handleClick} style={style} disabled={state === 'loading'}>
      {labels[state]}
    </button>
  );
}
