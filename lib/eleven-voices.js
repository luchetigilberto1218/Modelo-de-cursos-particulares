/*
 * ElevenLabs voice mapping for APS course (and other modelo courses).
 * Voice IDs imported from the user's FAAP gallery so we reuse the same library.
 *
 * Strategy: rotate accents and gender per module so the student hears variety
 * (US female → US male → GB female → GB male → ...) across the 6 modules.
 */

const PT_POOL = {
  f: ['GDzHdQOi6jjf8zaXhCYD', 'PznTnBc8X6pvixs9UkQm'], // Raquel, Dani
  m: ['xNGAXaCH8MaasNuo7Hr7', '4J31DrhygVjvFsoj7BsM'], // Beto, Eduardo S.
};

const GB_POOL = {
  f: ['Xb7hH8MSUJpSbSDYk0k2', 'AHg1lJfBfVzMxI156Ici', 'pFZP5JQG7iQjIQuC4Bku'], // Alice, Phebe, Lily
  m: ['JBFqnCBsd6RMkjVDRZzb', 'EtsjFhqOd0YWASYxlmIg', 'NNl6r8mD7vthiJatiJt1'], // George, Jack, Bradford
};

export const VOICE_POOLS = {
  us: {
    f: ['EXAVITQu4vr4xnSDxMaL', 'qWRrMoaOJUg6mVvRBiwM', 'XrExE9yKIg1WjnnlVkGX'], // Sarah, Gia, Matilda
    m: ['cjVigY5qzO86Huf0OWal', 'IjnA9kwZJHJ20Fp7Vmy6', 'CwhRBWXzGAHq8TQ4Fs17'], // Eric, Matthew, Roger
  },
  gb: GB_POOL,
  pt: PT_POOL,
};

/* Module → accent + gender mapping for APS.
 * Even modules: female; odd modules: male. Alternates US/GB. */
const APS_MODULE_VOICE = [
  { accent: 'us', gender: 'f' }, // M1 — Apresentações (welcoming, female US)
  { accent: 'gb', gender: 'm' }, // M2 — O Porto e a cidade (storytelling, male GB)
  { accent: 'us', gender: 'f' }, // M3 — Museu do Porto (museum narrator, female US)
  { accent: 'gb', gender: 'm' }, // M4 — Cultura portuária (technical, male GB)
  { accent: 'us', gender: 'm' }, // M5 — História do Porto Organizado (historian, male US)
  { accent: 'gb', gender: 'f' }, // M6 — Trabalho portuário (workforce, female GB)
];

function hashString(s) {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/* Resolve module index from APS lesson number (matches course.json modules ranges).
 * M1: 1-4, M2: 5-13, M3: 14-22, M4: 23-31, M5: 32-40, M6: 41-48. */
function moduleForLesson(num) {
  const n = Number(num);
  if (n <= 4) return 0;
  if (n <= 13) return 1;
  if (n <= 22) return 2;
  if (n <= 31) return 3;
  if (n <= 40) return 4;
  return 5;
}

/* Pick a voice deterministically from APS lesson.num — reruns are stable. */
export function pickVoiceForLesson(lesson) {
  const modIdx = moduleForLesson(lesson.num);
  const cfg = APS_MODULE_VOICE[modIdx] || APS_MODULE_VOICE[0];
  const pool = (VOICE_POOLS[cfg.accent] || VOICE_POOLS.us)[cfg.gender] || VOICE_POOLS.us.f;
  const seed = String(lesson.num) + (lesson.title || '');
  const voice_id = pool[hashString(seed) % pool.length];
  return { voice_id, accent: cfg.accent, gender: cfg.gender };
}

/* Same picker but for Portuguese audios (e.g., starter objectives). */
export function pickPtVoiceForLesson(lesson) {
  const modIdx = moduleForLesson(lesson.num);
  const cfg = APS_MODULE_VOICE[modIdx] || APS_MODULE_VOICE[0];
  const pool = PT_POOL[cfg.gender] || PT_POOL.f;
  const seed = String(lesson.num) + (lesson.title || '');
  const voice_id = pool[hashString(seed) % pool.length];
  return { voice_id, accent: 'pt-BR', gender: cfg.gender };
}
