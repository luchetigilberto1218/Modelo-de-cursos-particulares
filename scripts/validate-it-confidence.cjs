const fs = require('fs');
const path = require('path');
const p = path.resolve(__dirname, '..', 'courses', 'czarnikow', 'course.json');
const course = JSON.parse(fs.readFileSync(p, 'utf8'));

const L1001 = course.lessons.find((l) => l.num === 1001);
if (!L1001) throw new Error('L1001 not found');
const refKeys = Object.keys(L1001).sort();

const targets = course.lessons.filter((l) => l.num >= 1161 && l.num <= 1180);
if (targets.length !== 20) throw new Error(`Expected 20, got ${targets.length}`);

let ok = 0;
for (const l of targets) {
  const keys = Object.keys(l).sort();
  if (keys.length !== 21)
    throw new Error(`num ${l.num}: ${keys.length} fields`);
  if (JSON.stringify(keys) !== JSON.stringify(refKeys))
    throw new Error(
      `num ${l.num}: key mismatch vs L1001\n got: ${keys}\n ref: ${refKeys}`
    );
  if (l.vocab.length !== 5) throw new Error(`num ${l.num}: vocab != 5`);
  if (l.exercises.length !== 3) throw new Error(`num ${l.num}: exercises != 3`);
  if (l.takeaways.length !== 10)
    throw new Error(`num ${l.num}: takeaways != 10`);
  if (l.level !== 'confidence') throw new Error(`num ${l.num}: level`);
  if (l.track !== 'information-technology')
    throw new Error(`num ${l.num}: track`);
  if (l.trackOrder !== l.num - 1160)
    throw new Error(`num ${l.num}: trackOrder ${l.trackOrder}`);
  if (!JSON.stringify(l).includes('💛'))
    throw new Error(`num ${l.num}: missing 💛`);
  // grammarDeepDive sub-keys match L1001
  const gddRef = Object.keys(L1001.grammarDeepDive).sort();
  const gddCur = Object.keys(l.grammarDeepDive).sort();
  if (JSON.stringify(gddRef) !== JSON.stringify(gddCur))
    throw new Error(`num ${l.num}: grammarDeepDive keys mismatch`);
  // extendedExercises sub-keys match
  const eeRef = Object.keys(L1001.extendedExercises).sort();
  const eeCur = Object.keys(l.extendedExercises).sort();
  if (JSON.stringify(eeRef) !== JSON.stringify(eeCur))
    throw new Error(`num ${l.num}: extendedExercises keys mismatch`);
  ok++;
}
console.log(`Validated ${ok}/20 lessons. Structure matches L1001 exactly.`);
console.log(`Top-level fields (21): ${refKeys.join(', ')}`);
