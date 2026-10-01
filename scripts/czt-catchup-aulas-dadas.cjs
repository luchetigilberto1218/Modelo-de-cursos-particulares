#!/usr/bin/env node
/*
  Czarnikow — catch-up de "aula dada" (aulas particulares que aconteceram mas o
  professor não marcou no material).

  Entrada: até qual lição DA TRILHA o aluno já teve aula (1ª, 2ª, 3ª…). Marca
  `taught` da 1ª até essa, na trilha e no nível do cadastro. Usa o mesmo
  setTaught do painel do professor — só mexe em taught/taughtAt/taughtBy;
  `done` (ponto de material da campanha) fica intocado. Lição já marcada é pulada.

  Fonte: o usuário, 01/10/2026 (antes do relatório de setembro).

  Uso:
    node scripts/czt-catchup-aulas-dadas.cjs          (mostra, não grava)
    node scripts/czt-catchup-aulas-dadas.cjs --apply
*/

const fs = require('fs');
const path = require('path');

const RAIZ = path.join(__dirname, '..');
const APPLY = process.argv.includes('--apply');

for (const linha of fs.readFileSync(path.join(RAIZ, '.env.local'), 'utf8').split('\n')) {
  const m = linha.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
  if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}

// id do users.json → até qual lição da trilha já houve aula
const CATCHUP = {
  'czt-alessandra-de-melo-cruz': 2,
  'czt-aline-momi': 5,
  'czt-vinicius-steck': 3,
  'czt-vitoria-duarte-matto': 2,
  'czt-wesley-magnano': 1,
};

async function main() {
  const { readDoc, setTaught } = await import('../lib/czarnikow-teste-progress-store.js');
  const users = JSON.parse(fs.readFileSync(path.join(RAIZ, 'data', 'users.json'), 'utf8')).users;
  const course = JSON.parse(fs.readFileSync(path.join(RAIZ, 'courses', 'czarnikow-teste', 'course.json'), 'utf8'));

  for (const [id, ate] of Object.entries(CATCHUP)) {
    const u = users.find((x) => x.id === id);
    if (!u) { console.log(`✗ ${id} — não cadastrado`); continue; }
    const trilha = (u.track || [])[0];
    const licoes = course.lessons
      .filter((l) => l.level === u.level && l.track === trilha && l.trackOrder <= ate)
      .sort((a, b) => a.trackOrder - b.trackOrder);
    const doc = await readDoc(id);
    const st = doc?.lessons || {};
    console.log(`\n${u.name} — ${u.level} / ${trilha} — até a ${ate}ª`);
    for (const l of licoes) {
      const ja = st[l.num]?.taught;
      const tag = ja ? '= já marcada' : APPLY ? '✓ marcada' : '→ a marcar';
      if (!ja && APPLY) await setTaught(id, l.num, true, 'teacher');
      console.log(`   ${tag.padEnd(13)} ${String(l.trackOrder).padStart(2)}ª  #${l.num}  ${l.title}${st[l.num]?.done ? '  (material feito)' : ''}`);
    }
  }
  if (!APPLY) console.log('\n(dry-run — rode com --apply para gravar)');
}

main().catch((e) => { console.error(e); process.exit(1); });
