#!/usr/bin/env node
/*
  Czarnikow (ambiente de teste) — lança a presença de aula da campanha.

  A presença NÃO é lançada pelo aluno nem por tela: o Gilberto lança uma vez por
  mês, quando monta o relatório de assiduidade. Por isso isto é um script e não
  uma interface — menos coisa para dar errado e nenhum acesso a mais para
  gerenciar. A interface avisa o colaborador que o lançamento é mensal.

  O que é gravado: o TOTAL ACUMULADO de aulas do semestre por pessoa, separado em
  turma e particular (valem 7 e 10 pontos na campanha). É acumulado, não
  incremental: no lançamento de setembro se informa "agosto + setembro", e assim
  por diante. Assim um lançamento repetido por engano não dobra a pontuação de
  ninguém.

  Entrada: um arquivo JSON no formato
    {
      "Aline Momi":     { "turma": 8, "particular": 2 },
      "Vinicius Steck": { "turma": 6 }
    }
  Nome = o nome completo do colaborador (acento e maiúscula não importam).
  Quem não aparece no arquivo fica como está.

  Uso:
    node scripts/czt-lanca-aulas.cjs aulas-agosto.json            (confere, não grava)
    node scripts/czt-lanca-aulas.cjs aulas-agosto.json --apply
    node scripts/czt-lanca-aulas.cjs --ver                        (mostra o que está lançado hoje)
*/

const fs = require('fs');
const path = require('path');

const RAIZ = path.join(__dirname, '..');
const APPLY = process.argv.includes('--apply');
const VER = process.argv.includes('--ver');
const ARQ = process.argv.slice(2).find((a) => !a.startsWith('--'));

// o store é ESM; este script é CJS — carrega o .env.local antes de importar
for (const linha of fs.readFileSync(path.join(RAIZ, '.env.local'), 'utf8').split('\n')) {
  const m = linha.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
  if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}

const norm = (s) => (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/\s+/g, ' ').trim().toLowerCase();

async function main() {
  const { readDoc, setClasses } = await import('../lib/czarnikow-teste-progress-store.js');
  const usuarios = JSON.parse(fs.readFileSync(path.join(RAIZ, 'data', 'users.json'), 'utf8')).users;
  const alunos = usuarios.filter((u) => (u.clients || []).includes('czarnikow-teste') && u.role === 'student');
  const porNome = new Map(alunos.map((u) => [norm(u.name), u]));

  if (VER || !ARQ) {
    console.log('\nAulas lançadas hoje (acumulado do semestre):\n');
    console.log('  COLABORADOR                   | TURMA | PARTICULAR');
    console.log('  ' + '-'.repeat(52));
    for (const u of alunos) {
      const doc = await readDoc(u.id);
      const c = doc?.classes;
      console.log(`  ${u.name.padEnd(29)} | ${String(c?.general ?? 0).padStart(5)} | ${String(c?.private ?? 0).padStart(10)}`);
    }
    if (!ARQ) console.log('\nPara lançar: node scripts/czt-lanca-aulas.cjs <arquivo.json> [--apply]');
    return;
  }

  const entrada = JSON.parse(fs.readFileSync(ARQ, 'utf8'));
  const linhas = [];
  const semAluno = [];
  const aGravar = [];

  for (const [nome, v] of Object.entries(entrada)) {
    const u = porNome.get(norm(nome));
    if (!u) { semAluno.push(nome); continue; }
    const turma = Math.max(0, Number(v?.turma ?? v?.general ?? 0) || 0);
    const particular = Math.max(0, Number(v?.particular ?? v?.private ?? 0) || 0);
    const doc = await readDoc(u.id);
    const antes = doc?.classes || { general: 0, private: 0 };
    const mudou = antes.general !== turma || antes.private !== particular;
    linhas.push(`  ${mudou ? '→' : ' '} ${u.name.padEnd(29)} | ${String(antes.general).padStart(3)} → ${String(turma).padStart(3)} | ${String(antes.private).padStart(3)} → ${String(particular).padStart(3)}`);
    if (mudou) aGravar.push({ u, turma, particular });
  }

  console.log(`\nLançamento a partir de ${path.basename(ARQ)}\n`);
  console.log('    COLABORADOR                   |   TURMA   | PARTICULAR');
  console.log('  ' + '-'.repeat(58));
  linhas.forEach((l) => console.log(l));
  if (semAluno.length) {
    console.log('\n  ⚠ nome não encontrado no cadastro (verifique a grafia):');
    semAluno.forEach((n) => console.log(`     · ${n}`));
  }
  console.log(`\n  ${aGravar.length} colaborador(es) a atualizar, ${linhas.length - aGravar.length} sem mudança.`);

  if (!APPLY) { console.log('\n(conferência — nada foi gravado; repita com --apply)'); return; }

  let ok = 0;
  for (const { u, turma, particular } of aGravar) {
    try { await setClasses(u.id, { general: turma, private: particular }); ok += 1; }
    catch (e) { console.log(`  ✗ ${u.name}: ${e.message.slice(0, 90)}`); }
  }
  console.log(`\nGRAVADO: ${ok} de ${aGravar.length}.`);
  if (ok < aGravar.length) console.log('Alguma gravação falhou — confira se o Blob está ativo.');
}

main().catch((e) => { console.error('ERRO:', e.message); process.exit(1); });
