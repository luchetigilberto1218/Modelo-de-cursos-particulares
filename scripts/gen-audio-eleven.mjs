#!/usr/bin/env node
/*
 * Generate natural-voice MP3s for APS lessons via ElevenLabs API.
 * Adapted from FAAP's gen-audio-eleven.mjs for the APS course.json schema.
 *
 * Usage:
 *   node scripts/gen-audio-eleven.mjs                          # all M1-M6, all kinds
 *   node scripts/gen-audio-eleven.mjs --module=1               # only module 1
 *   node scripts/gen-audio-eleven.mjs --lessons=1,2,3,4        # specific lessons
 *   node scripts/gen-audio-eleven.mjs --kinds=intro,context    # only some kinds
 *   node scripts/gen-audio-eleven.mjs --course=aps             # which course (default: aps)
 *   node scripts/gen-audio-eleven.mjs --force                  # overwrite existing
 *   node scripts/gen-audio-eleven.mjs --dry                    # estimate without API calls
 *
 * Kinds:
 *   intro, context, takeaways, grammar, vocab, objective   (main lesson sections)
 *   exercises                                              (per-exercise prompts)
 *   critical                                               (grammarCriticalQuestion)
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');

const { pickVoiceForLesson, pickPtVoiceForLesson } = await import(`file://${path.join(ROOT_DIR, 'lib/eleven-voices.js')}`);

const ALL_KINDS = ['intro', 'context', 'takeaways', 'grammar', 'vocab', 'objective', 'exercises', 'critical'];

const args = Object.fromEntries(process.argv.slice(2).map(a => {
  const m = a.match(/^--([^=]+)=(.*)$/);
  return m ? [m[1], m[2]] : [a.replace(/^--/, ''), true];
}));
const COURSE  = args.course || 'aps';
const KINDS   = args.kinds   ? String(args.kinds).split(',') : ALL_KINDS;
const MODULE  = args.module  ? parseInt(args.module, 10) : null;
const LESSONS = args.lessons ? String(args.lessons).split(',').map(n => parseInt(n, 10)) : null;
const LIMIT   = args.limit   ? parseInt(args.limit, 10) : Infinity;
const FORCE   = args.force === true || args.force === 'true';
const DRY     = args.dry === true || args.dry === 'true';
const MODEL   = args.model || 'eleven_multilingual_v2';

const COURSE_FILE = path.join(ROOT_DIR, `courses/${COURSE}/course.json`);
const AUDIO_DIR   = path.join(ROOT_DIR, `public/audio/${COURSE}`);

function loadApiKey() {
  if (process.env.ELEVENLABS_API_KEY) return process.env.ELEVENLABS_API_KEY;
  try {
    const env = fs.readFileSync(path.join(ROOT_DIR, '.env.local'), 'utf-8');
    const m = env.match(/ELEVENLABS_API_KEY=([^\s]+)/);
    if (m) return m[1];
  } catch {}
  return null;
}
const API_KEY = loadApiKey();
if (!API_KEY && !DRY) {
  console.error('ELEVENLABS_API_KEY missing (set in .env.local or env)');
  process.exit(1);
}

function stripHtml(s) {
  return String(s || '')
    .replace(/\s*(?:→|->|⇒|=>)\s*/g, ', ')
    .replace(/\s*—\s*/g, ', ')
    .replace(/\s*–\s*/g, ', ')
    .replace(/[•●◉◆]/g, '')
    .replace(/<br\s*\/?>/gi, '. ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\s+([.,;:!?])/g, '$1')
    .replace(/,\s*,/g, ',')
    .replace(/\.\s*\./g, '.')
    .trim();
}

function moduleForLesson(num) {
  const n = Number(num);
  if (n <= 4) return 1;
  if (n <= 13) return 2;
  if (n <= 22) return 3;
  if (n <= 31) return 4;
  if (n <= 40) return 5;
  return 6;
}

function exerciseAudioText(ex) {
  if (!ex || !ex.type) return '';
  if (ex.type === 'fillGap') {
    return stripHtml((ex.prompt || '').replace('___', ex.correctAnswer || ''));
  }
  if (ex.type === 'multipleChoice') return stripHtml(ex.prompt || '');
  if (ex.type === 'matching') return (ex.pairs || []).map(p => p.left).join(', ');
  if (ex.type === 'reorder') return Array.isArray(ex.correctOrder) ? ex.correctOrder.join(' ') : '';
  if (ex.type === 'info') return '';
  return '';
}

async function tts(text, voiceId, outPath) {
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'xi-api-key': API_KEY,
      'Content-Type': 'application/json',
      'Accept': 'audio/mpeg',
    },
    body: JSON.stringify({
      text,
      model_id: MODEL,
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.0,
        use_speaker_boost: true,
        speed: 0.85, // slightly slower for A1 starter
      },
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`HTTP ${res.status}: ${err.slice(0, 300)}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 512) throw new Error('empty output');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, buf);
  return buf.length;
}

async function generateOne({ lesson, kind, text, slug, isPt = false, stats }) {
  if (!text || text.length < 5) return null;

  const pick = isPt ? pickPtVoiceForLesson(lesson) : pickVoiceForLesson(lesson);
  const relDir = `lesson-${String(lesson.num).padStart(2, '0')}/${slug}`;
  const dirAbs = path.join(AUDIO_DIR, relDir);
  const filePath = path.join(dirAbs, 'audio.mp3');
  const url = `/audio/${COURSE}/${relDir}/audio.mp3`;

  stats.total++;

  if (!FORCE && fs.existsSync(filePath) && fs.statSync(filePath).size > 1024) {
    stats.skipped++;
    return url;
  }

  if (DRY) {
    stats.charsUsed += text.length;
    stats.generated++;
    process.stdout.write(`~ L${String(lesson.num).padStart(2,'0')} ${slug.padEnd(14)} ${String(text.length).padStart(4)} chars  voice=${pick.voice_id} (${pick.accent}/${pick.gender})\n`);
    return url;
  }

  try {
    const bytes = await tts(text, pick.voice_id, filePath);
    stats.generated++;
    stats.charsUsed += text.length;
    process.stdout.write(`+ L${String(lesson.num).padStart(2,'0')} ${slug.padEnd(14)} ${String(text.length).padStart(4)}c → ${(bytes/1024).toFixed(0).padStart(3)}KB  ${pick.voice_id} (${pick.accent}/${pick.gender})\n`);
    return url;
  } catch (e) {
    stats.failed++;
    console.error(`✗ L${lesson.num} ${slug}: ${e.message || e}`);
    if (String(e.message || '').match(/quota|limit|insufficient|payment/i)) {
      stats.aborted = true;
      console.error('Aborting — looks like a quota/billing error.');
    }
    return null;
  }
}

async function run() {
  if (!fs.existsSync(COURSE_FILE)) {
    console.error(`Course file not found: ${COURSE_FILE}`);
    process.exit(1);
  }
  const data = JSON.parse(fs.readFileSync(COURSE_FILE, 'utf-8'));
  const stats = { total: 0, generated: 0, skipped: 0, failed: 0, charsUsed: 0, aborted: false };

  outer:
  for (const lesson of data.lessons) {
    if (stats.aborted) break;
    if (stats.generated + stats.failed >= LIMIT) break;

    if (MODULE && moduleForLesson(lesson.num) !== MODULE) continue;
    if (LESSONS && !LESSONS.includes(lesson.num)) continue;

    lesson.audio = lesson.audio || {};

    // ── Main lesson sections ────────────────────────────────
    const mainKinds = ['intro', 'context', 'takeaways', 'grammar', 'vocab', 'objective'];
    for (const kind of mainKinds) {
      if (!KINDS.includes(kind)) continue;
      let text = '';
      if (kind === 'intro')     text = stripHtml(lesson.intro);
      if (kind === 'takeaways') text = (lesson.takeaways || []).join('. ');
      if (kind === 'context')   text = stripHtml(lesson.context);
      if (kind === 'objective') text = stripHtml(lesson.objective);
      if (kind === 'grammar')   text = stripHtml([lesson.grammar, lesson.grammarDetail].filter(Boolean).join('. '));
      if (kind === 'vocab')     text = (lesson.vocab || []).filter(v => v && v.en && v.en !== 'Review').map(v => `${v.en}. ${v.example || ''}`).join(' ');

      const isPt = (kind === 'objective' && lesson.level === 'starter');
      const url = await generateOne({ lesson, kind, text, slug: kind, isPt, stats });
      if (url) lesson.audio[kind] = url;
      if (stats.aborted) break outer;
    }

    // ── Per-exercise audios ────────────────────────────────
    if (KINDS.includes('exercises') && Array.isArray(lesson.exercises)) {
      lesson.audio.exercises = lesson.audio.exercises || [];
      for (let i = 0; i < lesson.exercises.length; i++) {
        const text = exerciseAudioText(lesson.exercises[i]);
        const url = await generateOne({ lesson, kind: 'exercise', text, slug: `ex-${String(i).padStart(2, '0')}`, stats });
        lesson.audio.exercises[i] = url || null;
        if (stats.aborted) break outer;
      }
    }

    // ── Critical question ──────────────────────────────────
    if (KINDS.includes('critical') && lesson.grammarCriticalQuestion) {
      const url = await generateOne({
        lesson, kind: 'critical',
        text: stripHtml(lesson.grammarCriticalQuestion),
        slug: 'critical', stats,
      });
      if (url) lesson.audio.critical = url;
      if (stats.aborted) break outer;
    }
  }

  // Save updated course.json (persists audio paths)
  if (!DRY) {
    fs.writeFileSync(COURSE_FILE, JSON.stringify(data, null, 2));
  }

  const charK = (stats.charsUsed / 1000).toFixed(1);
  console.log(`\n${DRY ? '[DRY] ' : ''}Done. Generated: ${stats.generated}, skipped: ${stats.skipped}, failed: ${stats.failed}, total attempted: ${stats.total}, chars used: ${stats.charsUsed} (~${charK}k)`);
}

run().catch(e => { console.error(e); process.exit(1); });
