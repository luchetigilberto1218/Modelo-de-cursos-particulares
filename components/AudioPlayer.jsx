'use client';

import { useRef, useState } from 'react';

export default function AudioPlayer({ text, rate = 0.85, label = 'Listen', small = false, voiceType = 'us-male' }) {
  const [state, setState] = useState('idle');
  const audioRef = useRef(null);

  async function handleClick() {
    if (typeof window === 'undefined') return;

    if (state === 'playing' && audioRef.current) {
      audioRef.current.pause();
      setState('paused');
      return;
    }

    if (state === 'paused' && audioRef.current) {
      try { await audioRef.current.play(); setState('playing'); } catch { setState('idle'); }
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    if (!text || text.trim().length === 0) return;

    setState('loading');

    try {
      const params = new URLSearchParams({ text: text.slice(0, 3000), voice: voiceType });
      const res = await fetch('/api/tts?' + params.toString());
      if (!res.ok) { setState('idle'); return; }

      const blob = await res.blob();
      if (blob.size === 0) { setState('idle'); return; }

      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.playbackRate = rate;
      audioRef.current = audio;

      audio.onended = () => { setState('idle'); URL.revokeObjectURL(url); audioRef.current = null; };
      audio.onerror = () => { setState('idle'); URL.revokeObjectURL(url); audioRef.current = null; };

      await audio.play();
      setState('playing');
    } catch (err) {
      console.error('Audio error:', err);
      setState('idle');
    }
  }

  const btnLabel = state === 'idle' ? ('\u25B6 ' + label)
    : state === 'loading' ? '\u2026'
    : state === 'playing' ? '\u25FC Pause'
    : '\u25B6 Resume';

  const style = small ? { padding: '4px 10px', fontSize: 11 } : {};

  return (
    <button
      className={'btn-audio' + (state === 'playing' ? ' playing' : '')}
      onClick={handleClick}
      style={style}
      type="button"
    >
      {btnLabel}
    </button>
  );
}
