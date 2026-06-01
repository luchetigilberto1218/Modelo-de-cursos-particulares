'use client';

import { useEffect } from 'react';

/**
 * Carrega o manifesto de áudio pré-gerado (ElevenLabs) e o expõe em
 * window.__RC_AUDIO__ para o AudioPlayer resolver MP3 por (voiceType, texto).
 * Se o fetch falhar, o AudioPlayer simplesmente cai no Web Speech.
 */
export default function RacionalAudioBoot() {
  useEffect(() => {
    if (typeof window === 'undefined' || window.__RC_AUDIO__) return;
    window.__RC_AUDIO__ = { base: '/racional/', sep: '', manifest: {} };
    fetch('/racional/audio/manifest.json')
      .then((r) => (r.ok ? r.json() : {}))
      .then((m) => { window.__RC_AUDIO__.manifest = m || {}; })
      .catch(() => {});
  }, []);
  return null;
}
