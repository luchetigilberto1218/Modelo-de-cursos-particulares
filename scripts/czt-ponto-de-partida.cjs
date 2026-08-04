#!/usr/bin/env node
/*
  Czarnikow (ambiente de teste) — ponto de partida de quem JÁ TEVE AULA.

  Quatro colaboradores começaram o programa antes do lançamento da plataforma
  (aulas particulares já dadas). Sem isso o painel do professor mandaria todo
  mundo para a lição 1 da trilha, e o professor repetiria matéria.

  Por que `startAt` e NÃO marcar a lição como concluída: as lições anteriores
  foram DADAS EM AULA, não estudadas no material. Marcar `done` daria pontos de
  material na campanha (lição concluída + dia ativo) a quem não abriu o material
  — e a campanha é 60% aula / 40% material justamente porque as duas coisas são
  contadas separado. A presença de aula continua entrando 1× por mês, pelo
  czt-lanca-aulas.cjs.

  Fonte: o próprio usuário (04/08/2026), com o link da lição de cada um.

  Uso:
    node scripts/czt-ponto-de-partida.cjs          (mostra, não grava)
    node scripts/czt-ponto-de-partida.cjs --apply
*/

const fs = require('fs');
const path = require('path');

const USERS = path.join(__dirname, '..', 'data', 'users.json');
const COURSE = path.join(__dirname, '..', 'courses', 'czarnikow-teste', 'course.json');
const APPLY = process.argv.includes('--apply');
const CLIENT = 'czarnikow-teste';

/* `startAt` = num da PRÓXIMA lição a dar (a primeira que ainda não foi vista).
   `trilha` só onde o cadastro diverge do que a aula mostrou. */
const PARTIDA = [
  { nome: 'Aline Momi',      startAt: 42 },   // apex · HR · já viu a 1
  // O link mandado apontava para 462 (apex/fiscal-taxes), mas o usuário
  // confirmou em 04/08: ela é Trade & Finance e está na 2ª lição — 162.
  { nome: 'Serena Lanças',   startAt: 162, trilha: 'trade-finance' },
  { nome: 'Thiago Pereira',  startAt: 482 },  // essentials · IT · já viu a 1
  { nome: 'Vinicius Steck',  startAt: 83 },   // rise · General Business · já viu 1 e 2
];

const course = JSON.parse(fs.readFileSync(COURSE, 'utf-8'));
const byNum = new Map(course.lessons.map((l) => [l.num, l]));
const trackName = new Map((course.tracks || []).map((t) => [t.id, t.name]));

const db = JSON.parse(fs.readFileSync(USERS, 'utf-8'));
const norm = (s) => (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/\s+/g, ' ').trim().toLowerCase();
const porNome = new Map(
  db.users.filter((u) => (u.clients || []).includes(CLIENT)).map((u) => [norm(u.name), u])
);

let mudou = 0;
const avisos = [];

for (const p of PARTIDA) {
  const u = porNome.get(norm(p.nome));
  if (!u) { avisos.push(`✗ ${p.nome} — não está cadastrado`); continue; }

  const licao = byNum.get(p.startAt);
  if (!licao) { avisos.push(`✗ ${p.nome} — lição ${p.startAt} não existe`); continue; }

  const trilha = p.trilha || (u.track || [])[0];
  if (licao.track !== trilha) {
    avisos.push(`✗ ${p.nome} — lição ${p.startAt} é da trilha "${licao.track}", mas ele está em "${trilha}"`);
    continue;
  }
  if (licao.level !== u.level) {
    avisos.push(`⚠ ${p.nome} — lição ${p.startAt} é ${licao.level}, cadastro diz ${u.level} (gravando assim mesmo)`);
  }

  const antes = { startAt: u.startAt, track: JSON.stringify(u.track) };
  u.startAt = p.startAt;
  if (p.trilha) u.track = [p.trilha];

  const mudouAlgo = antes.startAt !== u.startAt || antes.track !== JSON.stringify(u.track);
  if (mudouAlgo) mudou += 1;

  console.log(
    `   ${mudouAlgo ? (APPLY ? '✓' : '→') : '='} ${p.nome.padEnd(18)} ` +
    `começa na ${String(licao.trackOrder).padStart(2)}ª de ${trackName.get(licao.track)} ` +
    `(${licao.level}) — "${licao.title}"` +
    (p.trilha ? `  [trilha corrigida para ${trackName.get(p.trilha)}]` : '')
  );
}

if (avisos.length) console.log('\n' + avisos.join('\n'));
console.log(`\n${PARTIDA.length} colaboradores · ${mudou} a gravar`);

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
