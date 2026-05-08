#!/usr/bin/env node
/*
 * Merge module drafts (module{N}_draft.json) into courses/aps/course.json.
 *
 * Replaces lessons by `num`. Preserves existing `audio` block on the lesson
 * (so already-generated mp3s keep working).
 *
 * Usage:
 *   node scripts/merge-aps-drafts.mjs                # merge all module*_draft.json found
 *   node scripts/merge-aps-drafts.mjs --modules=2,3  # only specific module numbers
 *   node scripts/merge-aps-drafts.mjs --dry          # show plan, do not write
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', 'courses', 'aps');
const COURSE = path.join(ROOT, 'course.json');

const args = Object.fromEntries(process.argv.slice(2).map(a => {
  const m = a.match(/^--([^=]+)=(.*)$/);
  return m ? [m[1], m[2]] : [a.replace(/^--/, ''), true];
}));
const ONLY = args.modules ? String(args.modules).split(',').map(n => parseInt(n, 10)) : null;
const DRY  = args.dry === true || args.dry === 'true';

const course = JSON.parse(fs.readFileSync(COURSE, 'utf-8'));

const drafts = fs.readdirSync(ROOT)
  .filter(f => /^module(\d+)_draft\.json$/.test(f))
  .map(f => ({ file: f, mod: parseInt(f.match(/^module(\d+)_draft\.json$/)[1], 10) }))
  .filter(d => !ONLY || ONLY.includes(d.mod))
  .sort((a, b) => a.mod - b.mod);

if (drafts.length === 0) {
  console.error('No drafts to merge.');
  process.exit(0);
}

console.log(`Drafts: ${drafts.map(d => `M${d.mod}`).join(', ')}`);

const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const backup = path.join(ROOT, `course.backup-${stamp}.json`);
if (!DRY) {
  fs.writeFileSync(backup, JSON.stringify(course, null, 2));
  console.log(`Backup: ${backup}`);
}

let replaced = 0;
let added = 0;
const replacedNums = [];

for (const { file, mod } of drafts) {
  const draft = JSON.parse(fs.readFileSync(path.join(ROOT, file), 'utf-8'));
  if (!Array.isArray(draft.lessons)) {
    console.warn(`  skip ${file}: no lessons[]`);
    continue;
  }
  for (const newLesson of draft.lessons) {
    const idx = course.lessons.findIndex(l => l.num === newLesson.num);
    if (idx < 0) {
      course.lessons.push(newLesson);
      added++;
      replacedNums.push(`+L${newLesson.num}`);
    } else {
      const oldAudio = course.lessons[idx].audio;
      course.lessons[idx] = newLesson;
      if (oldAudio) course.lessons[idx].audio = oldAudio;
      replaced++;
      replacedNums.push(`L${newLesson.num}`);
    }
  }
}

course.lessons.sort((a, b) => a.num - b.num);

if (!DRY) {
  fs.writeFileSync(COURSE, JSON.stringify(course, null, 2));
}

console.log(`\n${DRY ? '[DRY] ' : ''}Replaced ${replaced} lessons, added ${added}. Total now: ${course.lessons.length}.`);
console.log(`Lessons touched: ${replacedNums.join(', ')}`);
