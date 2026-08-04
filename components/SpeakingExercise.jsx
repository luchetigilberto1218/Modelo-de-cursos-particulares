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
  // Gravou, mas sem nota: o navegador não entregou transcrição (ver `degradado`).
  const [semNota, setSemNota] = useState(false);

  const recognitionRef = useRef(null);
  const startedAtRef = useRef(0);
  const timerRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const phaseRef = useRef(phase);
  useEffect(() => { phaseRef.current = phase; }, [phase]);
  // O reconhecimento morreu no meio (serviço indisponível) e seguimos só gravando.
  const degradadoRef = useRef(false);

  /*
    Duas capacidades DIFERENTES, e o exercício não pode depender de uma só:

    - GRAVAR (getUserMedia + MediaRecorder) funciona em praticamente todo
      navegador atual.
    - AVALIAR A PRONÚNCIA (Web Speech API) depende de um serviço de
      reconhecimento que, nos navegadores Chromium que não são o Chrome
      (Samsung Internet, Opera, Brave, Edge no Android), EXISTE na API mas
      responde com erro de serviço.

    Antes o botão inteiro sumia — ou pior, aparecia e a gravação morria junto
    com o reconhecimento. Agora, sem avaliação, o aluno ainda grava e ouve a
    própria voz para comparar com o áudio do exercício.
  */
  const podeGravar = typeof window !== 'undefined'
    && !!navigator.mediaDevices?.getUserMedia
    && typeof MediaRecorder !== 'undefined';
  const podeAvaliar = typeof window !== 'undefined' && hasWebSpeech();
  const supported = podeGravar || podeAvaliar;

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
    // Quem normalmente fecha a gravação é o rec.onend. Sem reconhecimento (ou
    // com ele caído), é este stop que precisa fechar — senão a tela fica
    // eternamente em "Gravando...".
    if (!recognitionRef.current || degradadoRef.current) {
      setPhase((p) => (p === 'recording' ? 'done' : p));
    }
  }, []);

  // Cronômetro da gravação (para sozinho no limite de tempo).
  const iniciaCronometro = useCallback((pararFn) => {
    startedAtRef.current = Date.now();
    timerRef.current = setInterval(() => {
      const e = Math.round((Date.now() - startedAtRef.current) / 1000);
      setElapsed(e);
      if (e >= maxSeconds) pararFn();
    }, 250);
  }, [maxSeconds]);

  const start = useCallback(async () => {
    if (!supported) { setPhase('unsupported'); return; }
    setError('');
    setTranscript('');
    setDiff([]);
    setAccuracy(0);
    setElapsed(0);
    setSemNota(false);
    degradadoRef.current = false;

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

    // Navegador que não avalia pronúncia: grava assim mesmo, sem nota.
    if (!podeAvaliar) {
      degradadoRef.current = true;
      setSemNota(true);
      recognitionRef.current = null;
      iniciaCronometro(() => stop());
      setPhase('recording');
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
      // Com o gravador rodando, falha do reconhecimento NÃO derruba a gravação:
      // é o caso dos navegadores Chromium fora do Chrome, onde o serviço de
      // reconhecimento responde 'network'/'service-not-allowed'. O aluno segue
      // gravando e ouve a própria voz; só não recebe a nota de pronúncia.
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        degradadoRef.current = true;
        setSemNota(true);
        try { recognitionRef.current?.stop(); } catch (_) {}
        recognitionRef.current = null;
        return;
      }
      setError(`${event.error || 'unknown error'}`);
      setPhase('error');
      stop();
    };
    rec.onend = () => {
      if (degradadoRef.current) return;
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
    iniciaCronometro(() => stop());

    try {
      rec.start();
      setPhase('recording');
    } catch (e) {
      // O reconhecimento não subiu, mas o microfone já está aberto: grava mesmo assim.
      degradadoRef.current = true;
      setSemNota(true);
      recognitionRef.current = null;
      setPhase('recording');
    }
  }, [supported, podeAvaliar, lang, mode, targetText, transcript, stop, iniciaCronometro]);

  const reset = () => {
    stop();
    if (recordingUrl) {
      try { URL.revokeObjectURL(recordingUrl); } catch (_) {}
    }
    setRecordingUrl(null);
    setPhase('idle'); setTranscript(''); setDiff([]); setAccuracy(0); setError('');
    setSemNota(false);
    degradadoRef.current = false;
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
          'Este navegador não permite gravar áudio. Abra a lição no Chrome ou no Safari.',
          'This browser cannot record audio. Open the lesson in Chrome or Safari.'
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

      {/* Gravou, mas este navegador não avalia a pronúncia. Dizer isso é melhor
          do que deixar o aluno esperando uma nota que nunca vem. */}
      {semNota && (phase === 'recording' || phase === 'done') && (
        <div style={{
          marginTop: 12, padding: '10px 12px', borderRadius: 8,
          background: '#FFFBEB', border: '1px solid #FBD38D', color: '#7B5300',
          fontSize: 12.5, lineHeight: 1.5,
        }}>
          {T(
            'Este navegador não avalia a pronúncia automaticamente. Sua gravação funciona normalmente: ouça e compare com o áudio da frase. Para receber a nota, abra a lição no Chrome.',
            'This browser does not score pronunciation automatically. Your recording still works: listen and compare it with the sentence audio. For the score, open the lesson in Chrome.'
          )}
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
