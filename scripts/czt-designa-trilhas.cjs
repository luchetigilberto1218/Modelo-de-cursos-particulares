#!/usr/bin/env node
/*
  Czarnikow (ambiente de teste) — grava a TRILHA DESIGNADA de cada colaborador
  em data/users.json.

  Por que existe: a trilha de cada um sempre esteve no czt-cadastra-roster.cjs,
  mas só como texto do ROSTER — nunca foi para o users.json. O painel do
  professor precisa dela para responder "qual a próxima unidade a dar", então
  ela vira dado.

  A trilha NÃO bloqueia nada: o aluno continua livre para abrir qualquer trilha
  no hub (foi assim desde o começo). Ela é a trilha combinada com a CZ — o que o
  professor usa para planejar a aula e o que o painel mostra como referência.

  Campo gravado: `track` (array de ids de trilha do course.json). Array porque
  a inscrição de alguns colaboradores lista mais de uma área.

  Uso:
    node scripts/czt-designa-trilhas.cjs          (mostra, não grava)
    node scripts/czt-designa-trilhas.cjs --apply
*/

const fs = require('fs');
const path = require('path');

const USERS = path.join(__dirname, '..', 'data', 'users.json');
const COURSE = path.join(__dirname, '..', 'courses', 'czarnikow-teste', 'course.json');
const APPLY = process.argv.includes('--apply');
const CLIENT = 'czarnikow-teste';

/* Nome do CSV de presença → id da trilha no course.json. */
const TRACK_ID = {
  'HR': 'hr',
  'General Business': 'general-business',
  'Trade & Finance': 'trade-finance',
  'Fiscal & Taxes': 'fiscal-taxes',
  'Accounting': 'accounting',
  'Logistics': 'logistics',
  'Information Technology': 'information-technology',
  'Supply Chain': 'supply-chain',
  'UK & England': 'uk-england',
};

/* Mesma fonte do czt-cadastra-roster.cjs (CSV de junho + relatório de julho).
   Divergências entre a lista de inscrição e o CSV foram fechadas com o usuário:
   - Vitória Duarte Matto: inscrição diz Accounting; Fiscal & Taxes confirmado em 03/08/2026.
   - Alessandra de Melo Cruz: inscrição diz "Accounting and Fiscal"; Fiscal & Taxes
     confirmado em 04/08/2026. */
const TRILHAS = {
  'Aline Momi': ['HR'],
  'Antônio Sérgio Vido Junior': ['General Business'],
  'Bruna Beatriz': ['Trade & Finance'],
  'Carla Casanova': ['Trade & Finance'],
  'Hadassa Regis': ['HR'],
  'João Gabriel Brandão': ['Trade & Finance'],
  'Juliana Ferreira': ['Fiscal & Taxes'],
  'Lissa Figueira': ['Accounting'],
  'Luccas Bardella': ['General Business'],
  'Luis Takeo Setai': ['General Business'],
  'Matheus Santos da Paz': ['Logistics'],
  'Serena Lanças': ['Trade & Finance'],
  'Thiago Pereira': ['Information Technology'],
  'Vinicius Steck': ['General Business'],
  'Vitor Oliveira': ['General Business'],
  'Vitória Duarte Matto': ['Fiscal & Taxes'],
  'Douglas Salomão': ['General Business'],
  'Alessandra de Melo Cruz': ['Fiscal & Taxes'],
  'Claudia Gonçalves da Silva': ['General Business'],
  'Weslley Magnago': ['General Business'],
  // conta de demonstração: mostra a trilha já convertida
  'Colaborador Teste': ['HR'],
};

const course = JSON.parse(fs.readFileSync(COURSE, 'utf-8'));
const validTracks = new Set((course.tracks || []).map((t) => t.id));

const db = JSON.parse(fs.readFileSync(USERS, 'utf-8'));
const alunos = db.users.filter((u) => u.role === 'student' && (u.clients || []).includes(CLIENT));

let mudou = 0;
const semTrilha = [];

for (const u of alunos) {
  const nomes = TRILHAS[u.name];
  if (!nomes) { semTrilha.push(u.name); continue; }

  const ids = nomes.map((n) => {
    const id = TRACK_ID[n];
    if (!id || !validTracks.has(id)) throw new Error(`trilha desconhecida para ${u.name}: ${n}`);
    return id;
  });

  const atual = JSON.stringify(u.track || null);
  if (atual === JSON.stringify(ids)) {
    console.log(`   = ${u.name.padEnd(30)} ${ids.join(' · ')}`);
    continue;
  }
  u.track = ids;
  mudou += 1;
  console.log(`   ${APPLY ? '✓' : '→'} ${u.name.padEnd(30)} ${ids.join(' · ')}`);
}

if (semTrilha.length) {
  console.log(`\n⚠️  sem trilha na lista (ficam sem o campo): ${semTrilha.join(', ')}`);
}

console.log(`\n${alunos.length} alunos · ${mudou} a gravar`);

if (!APPLY) {
  console.log('\n(dry-run — rode com --apply para gravar)');
  process.exit(0);
}

if (mudou) {
  fs.writeFileSync(USERS, `${JSON.stringify(db, null, 2)}\n`);
  console.log('✓ data/users.json gravado');
} else {
  console.log('nada a fazer');
}
