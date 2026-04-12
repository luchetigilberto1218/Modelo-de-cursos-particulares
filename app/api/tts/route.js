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
};

export async function GET(request) {
  const url = new URL(request.url);
  const text = url.searchParams.get('text');
  const voice = url.searchParams.get('voice') || 'us-male';

  if (!text) {
    return new Response('Missing text parameter', { status: 400 });
  }

  const trimmed = text.slice(0, 3000);
  const voiceName = VOICES[voice] || VOICES['us-male'];

  try {
    const tts = new MsEdgeTTS();
    await tts.setMetadata(voiceName, OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3);

    const { audioStream } = tts.toStream(trimmed);
    const chunks = [];

    await new Promise((resolve, reject) => {
      audioStream.on('data', (chunk) => chunks.push(chunk));
      audioStream.on('end', resolve);
      audioStream.on('error', reject);
    });

    const audioBuffer = Buffer.concat(chunks);

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
