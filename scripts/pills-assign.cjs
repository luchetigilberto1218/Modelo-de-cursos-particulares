// Atribui as Pílulas de Sotaque do pool gerado aos 6 alunos.
// Regras: (1) cada aula do MESMO aluno recebe uma dica diferente;
//         (2) a mesma dica PODE ser usada em alunos diferentes;
//         (3) o mesmo aluno NUNCA recebe a mesma dica duas vezes.
// Implementação: pool único deduplicado; cada aluno usa pool[(offset+i) % P]
// para i = 0..L-1. Como L <= P, índices consecutivos são distintos => sem repetição.
const fs = require('fs');
const path = require('path');

// 1) carrega e deduplica o pool
const norm = (s) => (s || '').trim().toLowerCase().replace(/\s+/g, ' ');
const pool = [];
const seen = new Set();
for (let i = 0; i < 10; i++) {
  const f = `/tmp/pills_${i}.json`;
  if (!fs.existsSync(f)) { console.warn('faltando', f); continue; }
  const d = JSON.parse(fs.readFileSync(f, 'utf8'));
  for (const p of d.pills || []) {
    const k = norm(p.tip);
    if (!p.tip || seen.has(k)) continue;
    seen.add(k);
    pool.push({
      kind: 'accent',
      region: p.region,
      code: p.code || 'US',
      tip: p.tip,
      sample: p.sample,
      voice: p.voice || 'us-female',
    });
  }
}
const P = pool.length;
console.log('pool único:', P, 'pílulas');

// 2) ordem dos alunos e offsets distintos (espalha o ponto de partida)
const STUDENTS = ['cassio', 'fabio', 'fabricio', 'fernando', 'josemario', 'julio'];
const OFFSETS = { cassio: 0, fabio: 31, fabricio: 67, fernando: 103, josemario: 139, julio: 7 };

const report = {};
for (const id of STUDENTS) {
  const file = path.join(__dirname, '../courses/racional/', id + '.json');
  const course = JSON.parse(fs.readFileSync(file, 'utf8'));
  const lessons = course.lessons;
  const L = lessons.length;
  if (L > P) throw new Error(`${id}: ${L} aulas > ${P} pílulas no pool — pool insuficiente`);
  const off = OFFSETS[id] || 0;
  let assigned = 0;
  lessons.forEach((l, i) => {
    l.pill = { ...pool[(off + i) % P] };
    assigned++;
  });
  // sanidade: nenhuma dica repetida dentro do aluno
  const tips = lessons.map((l) => norm(l.pill.tip));
  const dup = tips.length !== new Set(tips).size;
  fs.writeFileSync(file, JSON.stringify(course, null, 1));
  report[id] = { lessons: L, assigned, hasInternalDuplicate: dup };
}
console.log(JSON.stringify({ poolSize: P, students: report }, null, 2));
