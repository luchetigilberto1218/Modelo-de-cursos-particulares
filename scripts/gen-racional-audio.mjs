#!/usr/bin/env node
/*
 * Gera os áudios FALTANTES da Racional (gramática + bônus) via ElevenLabs,
 * compatível com o manifesto que o AudioPlayer consome
 * (window.__RC_AUDIO__: key = `${voiceType}${stripHtml(text)}` → 'audio/<hash>.mp3').
 *
 * Regras de sotaque (clipes EN):
 *   ~60% Americano (vários locutores distintos, m/f)
 *   ~30% Britânico (m/f)
 *   ~10% Indiano — quando o texto fala de TI (palavra-chave)
 * Texto PT → voz PT-BR (não aplicável aqui: gramática/bônus são EN).
 *
 * Uso:
 *   node scripts/gen-racional-audio.mjs --dry                 # estimativa, sem chave/sem API
 *   node scripts/gen-racional-audio.mjs --students=josemario  # só um aluno
 *   node scripts/gen-racional-audio.mjs --force               # regerar mesmo se já existir
 *   node scripts/gen-racional-audio.mjs                       # gera tudo que falta
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const AUDIO_DIR = path.join(ROOT, 'public/racional/audio');
const MANIFEST = path.join(AUDIO_DIR, 'manifest.json');
const MODEL = 'eleven_multilingual_v2';

// voiceType que o componente usa por aluno (= chave do manifesto)
const VOICE_BY_STUDENT = {
  cassio: 'us-male', fabio: 'us-male', fabricio: 'us-female',
  fernando: 'gb-male', josemario: 'us-female', julio: 'gb-female',
};

// Pools ElevenLabs (US/GB/PT reaproveitados de lib/eleven-voices.js).
// Indiano: precisa de IDs reais da SUA biblioteca ElevenLabs (env ELEVEN_IN_F / ELEVEN_IN_M
// ou edite abaixo). Sem IDs, clipes de TI caem para US e o script avisa.
const POOLS = {
  us: { f: ['EXAVITQu4vr4xnSDxMaL', 'qWRrMoaOJUg6mVvRBiwM', 'XrExE9yKIg1WjnnlVkGX'],
        m: ['cjVigY5qzO86Huf0OWal', 'IjnA9kwZJHJ20Fp7Vmy6', 'CwhRBWXzGAHq8TQ4Fs17'] },
  gb: { f: ['Xb7hH8MSUJpSbSDYk0k2', 'AHg1lJfBfVzMxI156Ici', 'pFZP5JQG7iQjIQuC4Bku'],
        m: ['JBFqnCBsd6RMkjVDRZzb', 'EtsjFhqOd0YWASYxlmIg', 'NNl6r8mD7vthiJatiJt1'] },
  in: { f: (process.env.ELEVEN_IN_F ? [process.env.ELEVEN_IN_F] : []),
        m: (process.env.ELEVEN_IN_M ? [process.env.ELEVEN_IN_M] : []) },
};

const IT_RE = /\b(data ?center|datacenter|server|cloud|software|hardware|network|azure|aws|amazon web|google cloud|hyperscale|latency|bandwidth|fiber|fibre|rack|cooling|uptime|downtime|firmware|database|API|IT team|infrastructure|provider|cabling|switch|router|virtual|storage|backup|cyber|protocol)\b/i;

const args = Object.fromEntries(process.argv.slice(2).map(a => {
  const m = a.match(/^--([^=]+)=(.*)$/); return m ? [m[1], m[2]] : [a.replace(/^--/, ''), true];
}));
const DRY = args.dry === true;
const FORCE = args.force === true;
const LIMIT = args.limit ? parseInt(args.limit, 10) : Infinity;
const ONLY = args.students ? String(args.students).split(',') : Object.keys(VOICE_BY_STUDENT);

function loadApiKey() {
  if (process.env.ELEVENLABS_API_KEY) return process.env.ELEVENLABS_API_KEY;
  try {
    const env = fs.readFileSync(path.join(ROOT, '.env.local'), 'utf-8');
    const m = env.match(/ELEVENLABS_API_KEY=([^\s]+)/); if (m) return m[1];
  } catch {}
  return null;
}

// stripHtml IDÊNTICO ao do AudioPlayer (a chave do manifesto depende disso).
function stripHtml(s) {
  return String(s || '')
    .replace(/<br\s*\/?>/gi, '. ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
function hash16(s) { return crypto.createHash('sha1').update(s).digest('hex').slice(0, 16); }
function h(s) { let x = 5381; for (let i = 0; i < s.length; i++) x = ((x << 5) + x + s.charCodeAt(i)) | 0; return Math.abs(x); }

// Escolhe sotaque/gênero deterministicamente por texto → mira ~60/30/10.
// Texto de TI → indiano (≈ os ~10-13% de clipes de TI). O resto: 60/30 US/GB.
function pickVoice(text) {
  const isIT = IT_RE.test(text);
  const haveIndian = !!(POOLS.in.f.length || POOLS.in.m.length);
  let accent;
  if (isIT && haveIndian) accent = 'in';
  else accent = (h(text) % 100 < 69) ? 'us' : 'gb'; // 69/31 entre não-TI → ~60/30 no total
  const gender = (h(text + 'g') % 2) ? 'f' : 'm';
  let pool = POOLS[accent][gender];
  if (!pool || !pool.length) { pool = POOLS.us[gender]; accent = 'us'; }
  const voice_id = pool[h(text + accent) % pool.length];
  return { voice_id, accent, gender, isIT };
}

function collectClips() {
  const clips = [];
  for (const id of ONLY) {
    if (!VOICE_BY_STUDENT[id]) continue;
    const course = JSON.parse(fs.readFileSync(path.join(ROOT, `courses/racional/${id}.json`), 'utf-8'));
    const vt = VOICE_BY_STUDENT[id];
    for (const l of course.lessons) {
      if (l.grammar) {
        (l.grammar.sections || []).forEach(s => (s.examples || []).forEach(e => e?.en && clips.push({ id, vt, text: e.en })));
        (l.grammar.mistakes || []).forEach(m => m?.right && clips.push({ id, vt, text: m.right }));
      }
      if (l.bonus?.body) clips.push({ id, vt, text: stripHtml(l.bonus.body) });
    }
  }
  // dedup por chave de manifesto
  const seen = new Set(); const out = [];
  for (const c of clips) {
    const key = c.vt + stripHtml(c.text);
    if (seen.has(key)) continue; seen.add(key);
    out.push({ ...c, key });
  }
  return out;
}

async function tts(text, voiceId, apiKey) {
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: { 'xi-api-key': apiKey, 'Content-Type': 'application/json', 'Accept': 'audio/mpeg' },
    body: JSON.stringify({ text, model_id: MODEL, voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0, use_speaker_boost: true, speed: 0.9 } }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 512) throw new Error('empty output');
  return buf;
}

async function run() {
  const manifest = fs.existsSync(MANIFEST) ? JSON.parse(fs.readFileSync(MANIFEST, 'utf-8')) : {};
  const clips = collectClips();
  let todo = clips.filter(c => FORCE || !manifest[c.key]);
  if (Number.isFinite(LIMIT)) todo = todo.slice(0, LIMIT);

  const dist = { us: 0, gb: 0, in: 0 }; let chars = 0, itCount = 0;
  for (const c of todo) { const v = pickVoice(c.text); c.pick = v; dist[v.accent]++; chars += c.text.length; if (v.isIT) itCount++; }

  console.log(`Clipes faltando: ${todo.length} (de ${clips.length} totais nas superfícies)`);
  console.log(`Caracteres: ~${(chars / 1000).toFixed(1)}k | clipes de TI detectados: ${itCount}`);
  const pct = (n) => todo.length ? ((n / todo.length) * 100).toFixed(0) : 0;
  console.log(`Distribuição de sotaque → US ${pct(dist.us)}% · GB ${pct(dist.gb)}% · IN ${pct(dist.in)}%`);
  if (!POOLS.in.f.length && !POOLS.in.m.length) console.log('⚠️  Sem vozes indianas (defina ELEVEN_IN_F / ELEVEN_IN_M); clipes de TI caem para US.');

  if (DRY) { console.log('\n[DRY] nada gerado.'); return; }

  const apiKey = loadApiKey();
  if (!apiKey) { console.error('ELEVENLABS_API_KEY ausente (.env.local ou env).'); process.exit(1); }
  fs.mkdirSync(AUDIO_DIR, { recursive: true });

  let ok = 0, fail = 0;
  for (const c of todo) {
    const file = `audio/${hash16(c.key)}.mp3`;
    const abs = path.join(AUDIO_DIR, path.basename(file));
    try {
      const buf = await tts(c.text, c.pick.voice_id, apiKey);
      fs.writeFileSync(abs, buf);
      manifest[c.key] = file;
      ok++;
      if (ok % 25 === 0) { fs.writeFileSync(MANIFEST, JSON.stringify(manifest)); process.stdout.write(`  ${ok}/${todo.length}\n`); }
    } catch (e) {
      fail++; console.error(`✗ ${c.id} [${c.pick.accent}] ${c.text.slice(0, 40)}…: ${e.message}`);
      if (/quota|limit|insufficient|payment|401|403/i.test(e.message)) { console.error('Abortando (quota/billing/auth).'); break; }
    }
  }
  fs.writeFileSync(MANIFEST, JSON.stringify(manifest));
  console.log(`\nGerado: ${ok} | falhas: ${fail} | manifest agora: ${Object.keys(manifest).length} entradas`);
}

run().catch(e => { console.error(e); process.exit(1); });
