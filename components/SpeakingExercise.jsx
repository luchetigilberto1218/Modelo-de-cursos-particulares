'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * SpeakingExercise — voice capture + transcription with feedback.
 *
 * mode="read"  → known targetText, compares word-by-word, scores 0-100
 * mode="free"  → no target, just transcribes and plays back
 *
 * Engine: Web Speech API (Chrome/Edge/Safari). No external dependency.
 * Audio never leaves the device.
 */

function normalizeWords(s) {
  return (s || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s']/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

// Strip Portuguese-only words from a transcription so they neither match nor
// pollute the diff. The Web Speech API in en-US sometimes injects words from
// the speaker's L1 — those should be ignored, not penalised.
const PT_STOPWORDS = new Set([
  'sim','não','nao','obrigado','obrigada','por','favor','com','sem','para','que','muito','pouco',
  'aqui','ali','lá','la','isso','aquilo','também','tambem','está','esta','estou','sou','eu','você',
  'voce','ele','ela','nós','nos','vocês','voces','eles','elas','do','da','dos','das','no','na',
  'nos','nas','um','uma','uns','umas','meu','minha','seu','sua','de','é','e','o','a','os','as',
  'mas','porém','porem','então','entao','agora','depois','antes','aqui','onde','quando','como',
  'porque','muito','tudo','nada','algum','alguma','cada','este','essa','esse','aquele','aquela',
  'foi','vai','tem','tinha','quero','quer','sabe','sei','obrigado','tchau','olá','ola','oi'
]);
function filterEnglishOnly(words) {
  return words.filter(w => !PT_STOPWORDS.has(w));
}

// LCS-based alignment so word order counts.
function diffWords(target, spoken) {
  const t = normalizeWords(target);
  // Strip PT-only words from the student's speech before scoring.
  const s = filterEnglishOnly(normalizeWords(spoken));
  const m = t.length, n = s.length;
  if (m === 0) return { tokens: [], accuracy: 0 };

  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (t[i - 1] === s[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
      else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  const matched = new Array(m).fill(false);
  let i = m, j = n;
  while (i > 0 && j > 0) {
    if (t[i - 1] === s[j - 1]) { matched[i - 1] = true; i--; j--; }
    else if (dp[i - 1][j] >= dp[i][j - 1]) { i--; }
    else { j--; }
  }
  const tokens = t.map((word, idx) => ({
    text: word,
    status: matched[idx] ? 'ok' : 'wrong',
  }));
  const correct = matched.filter(Boolean).length;
  const accuracy = Math.round((correct / m) * 100);
  return { tokens, accuracy };
}

function hasWebSpeech() {
  if (typeof window === 'undefined') return false;
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}

export default function SpeakingExercise({
  mode = 'read',
  targetText = '',
  translation = '',
  levelId = 'starter',
  lang = 'en-US',
  maxSeconds = 90,
  onResult,
  hideFeedback = false,
}) {
  const isStarter = levelId === 'starter';
  const T = (pt, en) => (isStarter ? pt : en);

  const [phase, setPhase] = useState('idle'); // 'idle' | 'requesting-mic' | 'recording' | 'processing' | 'done' | 'error' | 'unsupported'
  const [transcript, setTranscript] = useState('');
  const [diff, setDiff] = useState([]);
  const [accuracy, setAccuracy] = useState(0);
  const [error, setError] = useState('');
  const [elapsed, setElapsed] = useState(0);
  const [recordingUrl, setRecordingUrl] = useState(null);

  const recognitionRef = useRef(null);
  const startedAtRef = useRef(0);
  const timerRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const phaseRef = useRef(phase);
  useEffect(() => { phaseRef.current = phase; }, [phase]);

  const supported = typeof window !== 'undefined' && hasWebSpeech();

  useEffect(() => {
    if (!supported && phase === 'idle') setPhase('unsupported');
  }, [supported, phase]);

  const stop = useCallback(() => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (_) {}
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try { mediaRecorderRef.current.stop(); } catch (_) {}
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => { try { t.stop(); } catch (_) {} });
      streamRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const start = useCallback(async () => {
    if (!supported) { setPhase('unsupported'); return; }
    setError('');
    setTranscript('');
    setDiff([]);
    setAccuracy(0);
    setElapsed(0);

    setPhase('requesting-mic');
    if (recordingUrl) {
      try { URL.revokeObjectURL(recordingUrl); } catch (_) {}
      setRecordingUrl(null);
    }
    chunksRef.current = [];
    try {
      // Get a stream we can record in parallel with Web Speech API.
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      // MediaRecorder captures the audio blob alongside the speech recognition.
      try {
        const mime = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
          ? 'audio/webm;codecs=opus'
          : (MediaRecorder.isTypeSupported('audio/mp4') ? 'audio/mp4' : '');
        const mr = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
        mr.ondataavailable = (ev) => { if (ev.data && ev.data.size > 0) chunksRef.current.push(ev.data); };
        mr.onstop = () => {
          if (chunksRef.current.length > 0) {
            const blob = new Blob(chunksRef.current, { type: chunksRef.current[0].type || 'audio/webm' });
            setRecordingUrl(URL.createObjectURL(blob));
          }
        };
        mr.start();
        mediaRecorderRef.current = mr;
      } catch (e) {
        // MediaRecorder not supported — keep going with Web Speech only.
        console.warn('MediaRecorder not available:', e);
      }
    } catch (e) {
      setError(T('Não consegui acessar o microfone. Verifique as permissões.', 'Could not access microphone. Check permissions.'));
      setPhase('error');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SpeechRecognition();
    rec.lang = lang;
    rec.continuous = true;
    rec.interimResults = true;
    let finalText = '';

    rec.onresult = (event) => {
      let interim = '';
      for (let k = event.resultIndex; k < event.results.length; k++) {
        const t = event.results[k][0].transcript;
        if (event.results[k].isFinal) finalText += t + ' ';
        else interim += t;
      }
      setTranscript((finalText + interim).trim());
    };
    rec.onerror = (event) => {
      setError(`${event.error || 'unknown error'}`);
      setPhase('error');
      stop();
    };
    rec.onend = () => {
      if (phaseRef.current !== 'recording') return;
      const finalTranscript = (finalText || transcript).trim();
      if (mode === 'read' && targetText && finalTranscript) {
        const { tokens, accuracy } = diffWords(targetText, finalTranscript);
        setDiff(tokens);
        setAccuracy(accuracy);
        if (onResult) {
          // Defer to next microtask so we never run during a parent's render commit.
          queueMicrotask(() => onResult({ accuracy, transcript: finalTranscript }));
        }
      }
      setPhase('done');
    };

    recognitionRef.current = rec;
    startedAtRef.current = Date.now();
    timerRef.current = setInterval(() => {
      const e = Math.round((Date.now() - startedAtRef.current) / 1000);
      setElapsed(e);
      if (e >= maxSeconds) stop();
    }, 250);

    try {
      rec.start();
      setPhase('recording');
    } catch (e) {
      setError(T('Erro ao iniciar gravação.', 'Error starting recognition.'));
      setPhase('error');
    }
  }, [supported, lang, maxSeconds, mode, targetText, transcript, stop]);

  const reset = () => {
    stop();
    if (recordingUrl) {
      try { URL.revokeObjectURL(recordingUrl); } catch (_) {}
    }
    setRecordingUrl(null);
    setPhase('idle'); setTranscript(''); setDiff([]); setAccuracy(0); setError('');
  };

  const accuracyColor = accuracy >= 80 ? '#22543D' : accuracy >= 50 ? '#7B5300' : '#742A2A';
  const accuracyBg = accuracy >= 80 ? '#F0FFF4' : accuracy >= 50 ? '#FFFBEB' : '#FFF5F5';
  const accuracyBorder = accuracy >= 80 ? '#9AE6B4' : accuracy >= 50 ? '#FBD38D' : '#FEB2B2';

  if (phase === 'unsupported') {
    return (
      <div style={{
        marginTop: 14, padding: 14, borderRadius: 10,
        background: '#FFF5F5', border: '1px solid #FEB2B2', color: '#742A2A', fontSize: 13,
      }}>
        🎤 {T(
          'Seu navegador não suporta gravação de voz. Use Chrome, Edge ou Safari.',
          'Your browser does not support voice recording. Use Chrome, Edge or Safari.'
        )}
      </div>
    );
  }

  return (
    <div style={{
      marginTop: 14, padding: 16, borderRadius: 12,
      background: '#F8FAFC', border: '1px solid #E2E8F0',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        {phase === 'idle' && (
          <button onClick={start} style={btnMic(false)}>
            🎤 {T('Gravar minha voz', 'Record my voice')}
          </button>
        )}
        {phase === 'requesting-mic' && (
          <span style={{ fontSize: 13, color: '#8892A4' }}>{T('Pedindo permissão do microfone...', 'Requesting mic permission...')}</span>
        )}
        {phase === 'recording' && (
          <>
            <button onClick={stop} style={btnMic(true)}>
              ⏹ {T('Parar', 'Stop')} ({elapsed}s)
            </button>
            <span style={{ fontSize: 13, color: '#742A2A' }}>● {T('Gravando...', 'Recording...')}</span>
          </>
        )}
        {phase === 'done' && (
          <button onClick={reset} style={{ ...btnMic(false), background: '#0071E3' }}>
            🔁 {T('Tentar de novo', 'Try again')}
          </button>
        )}
        {phase === 'error' && (
          <button onClick={reset} style={btnMic(false)}>
            🔁 {T('Tentar de novo', 'Try again')}
          </button>
        )}
      </div>

      {phase === 'recording' && transcript && (
        <div style={{ marginTop: 12, fontSize: 14, color: '#4A5568', fontStyle: 'italic' }}>
          "{transcript}"
        </div>
      )}

      {phase === 'done' && hideFeedback && (
        <div style={{ marginTop: 14, padding: '10px 14px', borderRadius: 8, background: '#EBF5FF', border: '1px solid #BEE3F8', color: '#2D3748', fontSize: 13 }}>
          ✓ {T('Resposta gravada. Avance para o próximo exercício.', 'Answer recorded. Move on to the next exercise.')}
        </div>
      )}

      {phase === 'done' && !hideFeedback && (transcript || recordingUrl) && (
        <div style={{ marginTop: 14 }}>
          {recordingUrl && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, color: '#8892A4', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 6 }}>
                {T('Sua gravação', 'Your recording')}
              </div>
              <audio
                src={recordingUrl}
                controls
                style={{ width: '100%', height: 38, borderRadius: 8 }}
              />
            </div>
          )}
          {transcript && (<>
          <div style={{ fontSize: 12, color: '#8892A4', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 6 }}>
            {T('O que você falou', 'What you said')}
          </div>
          <div style={{ fontSize: 15, marginBottom: 12, padding: 10, background: '#FFFFFF', borderRadius: 8, border: '1px solid #E2E8F0' }}>
            "{transcript}"
          </div></>)}

          {mode === 'read' && diff.length > 0 && (
            <>
              <div style={{ fontSize: 12, color: '#8892A4', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 6 }}>
                {T('Comparação com o texto', 'Comparison with the text')}
              </div>
              <div style={{ marginBottom: 12, lineHeight: 2, overflowWrap: 'break-word', wordBreak: 'break-word' }}>
                {diff.map((w, i) => (
                  <span key={i} style={{
                    padding: '2px 6px', margin: '0 2px', borderRadius: 4,
                    background: w.status === 'ok' ? '#F0FFF4' : '#FFF5F5',
                    color: w.status === 'ok' ? '#22543D' : '#742A2A',
                    fontWeight: 600,
                  }}>
                    {w.text}
                  </span>
                ))}
              </div>
              <div style={{
                padding: '10px 14px', borderRadius: 8,
                background: accuracyBg, border: `1px solid ${accuracyBorder}`,
                color: accuracyColor, fontWeight: 700,
              }}>
                {T('Pontuação', 'Score')}: {accuracy}/100
                {accuracy >= 80 && ' — ' + T('Excelente!', 'Excellent!')}
                {accuracy >= 50 && accuracy < 80 && ' — ' + T('Bom, continue treinando.', 'Good, keep practising.')}
                {accuracy < 50 && ' — ' + T('Ouça o áudio e tente de novo.', 'Listen to the audio and try again.')}
              </div>
              {translation && (
                <div style={{
                  marginTop: 10, padding: '10px 14px', borderRadius: 8,
                  background: '#FFFFFF', border: '1px dashed #CBD5E0', color: '#4A5568',
                  fontSize: 14, lineHeight: 1.55, overflowWrap: 'break-word', wordBreak: 'break-word',
                }}>
                  <span style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#8892A4', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 4 }}>Tradução</span>
                  {translation}
                </div>
              )}
            </>
          )}

          {mode === 'free' && (
            <div style={{ fontSize: 13, color: '#4A5568' }}>
              {T(
                'Ótimo! Sua resposta foi registrada. Não há resposta certa ou errada — o importante é praticar.',
                'Great! Your answer is recorded. There is no right or wrong — the point is to practise.'
              )}
            </div>
          )}
        </div>
      )}

      {phase === 'error' && (
        <div style={{ marginTop: 12, fontSize: 13, color: '#742A2A' }}>
          ✗ {error}
        </div>
      )}
    </div>
  );
}

function btnMic(recording) {
  return {
    padding: '10px 18px',
    borderRadius: 10,
    border: 'none',
    background: recording ? '#E53E3E' : '#10B981',
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  };
}
