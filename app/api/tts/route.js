import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';

const VOICES = {
  'us-male':   'en-US-GuyNeural',
  'us-female': 'en-US-JennyNeural',
  'gb-male':   'en-GB-RyanNeural',
  'gb-female': 'en-GB-SoniaNeural',
  'james':     'en-GB-RyanNeural',
  'oliver':    'en-GB-ThomasNeural',
  'harry':     'en-AU-WilliamNeural',
  'sophie':    'en-GB-SoniaNeural',
  'emily':     'en-IE-EmilyNeural',
  'charlotte': 'en-NZ-MollyNeural',
  // Português (BR) — voz nativa. Trechos em inglês (entre aspas) são lidos por uma
  // voz en-US separada e os áudios são concatenados (ver synthPtMixed). Isso evita
  // tanto o "inglês aportuguesado" quanto o "sotaque gringo no português".
  'pt-br':        'pt-BR-FranciscaNeural',
  'pt-br-female': 'pt-BR-FranciscaNeural',
  'pt-br-male':   'pt-BR-AntonioNeural',
};

// Voz en-US que casa com o timbre da voz pt-BR (mesmo gênero).
const EN_PARTNER = { 'pt-BR-FranciscaNeural': 'en-US-AriaNeural', 'pt-BR-AntonioNeural': 'en-US-GuyNeural' };

const FORMAT = OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3;

async function synth(voiceName, text) {
  const tts = new MsEdgeTTS();
  await tts.setMetadata(voiceName, FORMAT);
  const { audioStream } = tts.toStream(text);
  const chunks = [];
  await new Promise((resolve, reject) => {
    audioStream.on('data', (c) => chunks.push(c));
    audioStream.on('end', resolve);
    audioStream.on('error', reject);
  });
  return Buffer.concat(chunks);
}

// Trecho entre aspas que parece inglês (sem acentos/palavras-função do PT).
function looksEnglish(s) {
  if (/[áàâãéêíóôõúüç]/i.test(s)) return false;
  if (/\b(você|voce|não|nao|que|uma|com|para|seu|sua|isso|então|porque|é|são|está)\b/i.test(s)) return false;
  return /[a-z]/i.test(s);
}

// Quebra o texto em segmentos PT (voz nativa) e EN (aspas → voz en-US).
function segment(text) {
  const re = /[“"]([^”"]+)[”"]/g;
  const segs = [];
  let last = 0, m;
  while ((m = re.exec(text))) {
    if (m.index > last) segs.push({ en: false, t: text.slice(last, m.index) });
    segs.push({ en: looksEnglish(m[1]), t: m[1] });
    last = re.lastIndex;
  }
  if (last < text.length) segs.push({ en: false, t: text.slice(last) });
  return segs.filter((s) => s.t.trim().length);
}

async function synthPtMixed(ptVoice, text) {
  const segs = segment(text);
  const enVoice = EN_PARTNER[ptVoice] || 'en-US-AriaNeural';
  // Sem inglês entre aspas → uma requisição só (rápido).
  if (!segs.some((s) => s.en)) return synth(ptVoice, text);
  // Gera todos os trechos em paralelo e concatena na ordem.
  const buffers = await Promise.all(segs.map((s) => synth(s.en ? enVoice : ptVoice, s.t.trim()).catch(() => Buffer.alloc(0))));
  return Buffer.concat(buffers.filter((b) => b.length > 256));
}

export async function GET(request) {
  const url = new URL(request.url);
  const text = url.searchParams.get('text');
  const voice = url.searchParams.get('voice') || 'us-male';

  if (!text) return new Response('Missing text parameter', { status: 400 });

  const trimmed = text.slice(0, 3000);
  const voiceName = VOICES[voice] || VOICES['us-male'];

  try {
    const audioBuffer = String(voice).startsWith('pt')
      ? await synthPtMixed(voiceName, trimmed)
      : await synth(voiceName, trimmed);

    if (!audioBuffer || audioBuffer.length < 512) return new Response('TTS generation failed', { status: 500 });

    return new Response(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.length.toString(),
        'Cache-Control': 'public, max-age=86400, s-maxage=604800',
        'Accept-Ranges': 'bytes',
      },
    });
  } catch (err) {
    console.error('TTS error:', err);
    return new Response('TTS generation failed', { status: 500 });
  }
}
