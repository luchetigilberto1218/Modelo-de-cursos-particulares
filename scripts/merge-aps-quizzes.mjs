#!/usr/bin/env node
/*
 * Merge module quiz drafts (module{N}_quiz_draft.json) into
 * courses/aps/course.json modules[N-1].quiz.
 *
 * Usage:
 *   node scripts/merge-aps-quizzes.mjs
 *   node scripts/merge-aps-quizzes.mjs --modules=1,2,3
 *   node scripts/merge-aps-quizzes.mjs --dry
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
  .filter(f => /^module(\d+)_quiz_draft\.json$/.test(f))
  .map(f => ({ file: f, mod: parseInt(f.match(/^module(\d+)_quiz_draft\.json$/)[1], 10) }))
  .filter(d => !ONLY || ONLY.includes(d.mod))
  .sort((a, b) => a.mod - b.mod);

if (drafts.length === 0) {
  console.error('No quiz drafts found.');
  process.exit(1);
}

console.log(`Quiz drafts: ${drafts.map(d => `M${d.mod}`).join(', ')}`);

if (!DRY) {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backup = path.join(ROOT, `course.backup-quiz-${stamp}.json`);
  fs.writeFileSync(backup, JSON.stringify(course, null, 2));
  console.log(`Backup: ${backup}`);
}

const summary = [];
for (const { file, mod } of drafts) {
  const draft = JSON.parse(fs.readFileSync(path.join(ROOT, file), 'utf-8'));
  if (!Array.isArray(draft.exercises)) {
    console.warn(`  skip ${file}: no exercises[]`);
    continue;
  }
  const target = course.modules?.[mod - 1];
  if (!target) {
    console.warn(`  skip M${mod}: course has no module index ${mod - 1}`);
    continue;
  }
  target.quiz = {
    title: draft.title,
    intro: draft.intro,
    exercises: draft.exercises,
  };
  summary.push({ mod, count: draft.exercises.length, title: draft.title });
}

if (!DRY) fs.writeFileSync(COURSE, JSON.stringify(course, null, 2));

console.log(`\n${DRY ? '[DRY] ' : ''}Merged ${summary.length} module quizzes:`);
for (const s of summary) console.log(`  M${s.mod}: ${s.count} exercises — ${s.title}`);
