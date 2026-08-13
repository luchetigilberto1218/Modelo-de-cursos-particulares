#!/usr/bin/env node
/*
  Czarnikow (ambiente de teste) — cadastra o roster real de colaboradores.

  Fonte dos nomes: CSV de presença de junho/2026 (16 nomes + a trilha de cada um,
  baixado do Drive) cruzado com o relatório de julho/2026 (Douglas Salomão, e as
  duas entradas novas: Alessandra e Claudia) e com o Weslley Magnago, que começa
  em 04/08/2026. Total: 20.

  Login por NOME COMPLETO (decisão do usuário) + senha individual por aluno. A
  senha vai como hash bcrypt em data/users.json; a versão legível é impressa aqui
  UMA vez, para o RH distribuir. Nada de senha em texto puro no repositório.

  Por que senha individual e não troca no 1º acesso: não há onde gravar a senha
  nova. O users.json é arquivo do repositório (filesystem da Vercel é somente
  leitura em runtime) e o único store de runtime — o Vercel Blob — está suspenso
  para escrita. Uma troca de senha hoje trancaria o colaborador para fora.

  Uso:
    node scripts/czt-cadastra-roster.cjs --dry     (mostra, não grava)
    node scripts/czt-cadastra-roster.cjs --apply
    node scripts/czt-cadastra-roster.cjs --senhas  (reimprime as senhas de quem
                                                    JÁ está cadastrado, conferindo
                                                    cada uma contra o hash)
*/

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const USERS = path.join(__dirname, '..', 'data', 'users.json');
const APPLY = process.argv.includes('--apply');
const SENHAS = process.argv.includes('--senhas');
const CLIENT = 'czarnikow-teste';

/* Trilha vem do CSV de presença; `nivel` só onde o relatório de julho registrou
   a mudança. Nível não bloqueia o cadastro — o aluno escolhe no hub do curso. */
const ROSTER = [
  { nome: 'Aline Momi',                trilha: 'HR' },
  { nome: 'Antônio Sérgio Vido Junior', trilha: 'General Business' },
  { nome: 'Bruna Beatriz',             trilha: 'Trade & Finance' },
  { nome: 'Carla Casanova',            trilha: 'Trade & Finance' },
  { nome: 'Hadassa Regis',             trilha: 'HR' },
  { nome: 'João Gabriel Brandão',      trilha: 'Trade & Finance' },
  { nome: 'Juliana Ferreira',          trilha: 'Fiscal & Taxes' },
  { nome: 'Lissa Figueira',            trilha: 'Accounting' },
  { nome: 'Luccas Bardella',           trilha: 'General Business' },
  { nome: 'Luis Takeo Setai',          trilha: 'General Business' },
  { nome: 'Matheus Santos da Paz',     trilha: 'Logistics', nivel: 'Essentials 1' },
  { nome: 'Serena Lanças',             trilha: 'Trade & Finance' },
  { nome: 'Thiago Pereira',            trilha: 'Information Technology' },
  { nome: 'Vinicius Steck',            trilha: 'General Business', nivel: 'Rise 1' },
  { nome: 'Vitor Oliveira',            trilha: 'General Business' },
  { nome: 'Vitória Duarte Matto',      trilha: 'Fiscal & Taxes' },  // a lista de inscrição diz Accounting; Fiscal & Taxes confirmado pelo usuário em 03/08/2026
  { nome: 'Douglas Salomão',           trilha: 'General Business' },
  { nome: 'Alessandra de Melo Cruz',   trilha: 'Fiscal & Taxes' },
  { nome: 'Claudia Gonçalves da Silva', trilha: 'General Business' },
  { nome: 'Weslley Magnago',            trilha: 'General Business', nivel: 'Rise 1' },
];

/** id do progresso: precisa casar com /^[a-z0-9-]{1,64}$/ (isValidStudent) */
function slug(nome) {
  return 'czt-' + nome.normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 56);
}

/* Senha legível: duas sílabas + 3 dígitos. Sem caractere ambíguo (l/1, O/0) e
   sem acento — ela vai ser digitada no celular, muitas vezes por quem não
   escreve em inglês todo dia. */
const SILABAS = ['sugar', 'trade', 'cargo', 'port', 'ship', 'grain', 'market', 'desk',
  'route', 'cane', 'juice', 'crop', 'field', 'stock', 'flow', 'bridge', 'north',
  'south', 'river', 'harvest'];
function senhaPara(i) {
  const s = SILABAS[i % SILABAS.length];
  const n = 234 + (i * 37) % 700;   // 3 dígitos, determinístico
  return `${s}-${n}`;
}

/* ── reimpressão das senhas ─────────────────────────────────────────────────
   A senha é determinística (índice na lista), então dá para reconstituí-la a
   qualquer momento sem guardar nada em texto puro. Cada uma é CONFERIDA contra o
   hash antes de aparecer: se alguém trocou a senha de um aluno na mão, a linha
   sai marcada em vez de entregar uma senha que não funciona. */
if (SENHAS) {
  const usuarios = JSON.parse(fs.readFileSync(USERS, 'utf8')).users;
  const norm = (s) => (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, ' ').trim().toLowerCase();
  const porNome = new Map(usuarios.map((u) => [norm(u.name), u]));
  let ok = 0; const linhas = [];
  ROSTER.forEach((p, i) => {
    const u = porNome.get(norm(p.nome));
    const senha = senhaPara(i);
    if (!u) { linhas.push(`  ✗ ${p.nome} — não está cadastrado`); return; }
    const confere = bcrypt.compareSync(senha, u.password);
    if (confere) ok += 1;
    linhas.push(`  ${confere ? ' ' : '✗'} ${p.nome.padEnd(29)} | ${senha.padEnd(12)} | ${(u.stage || '—').padEnd(13)} | ${p.trilha}`);
  });
  console.log(`\nSenhas conferidas contra o hash: ${ok} de ${ROSTER.length}\n`);
  console.log('   NOME COMPLETO (é o login)     | SENHA        | NÍVEL         | TRILHA');
  console.log('  ' + '-'.repeat(84));
  linhas.forEach((l) => console.log(l));
  process.exit(0);
}

/* ── execução ──────────────────────────────────────────────────────────────── */
const db = JSON.parse(fs.readFileSync(USERS, 'utf8'));
const antes = db.users.length;
const existentes = new Set(db.users.map((u) => u.id));

const novos = [];
const credenciais = [];

ROSTER.forEach((p, i) => {
  const id = slug(p.nome);
  if (existentes.has(id)) { console.log(`já existe, pulando: ${p.nome} (${id})`); return; }
  const senha = senhaPara(i);
  novos.push({
    id,
    name: p.nome,
    username: p.nome,          // login é o nome completo; acento é ignorado na comparação
    password: bcrypt.hashSync(senha, 10),
    role: 'student',
    clients: [CLIENT],
  });
  credenciais.push({ nome: p.nome, senha, trilha: p.trilha, nivel: p.nivel || '' });
});

console.log(`\nRoster Czarnikow — ${ROSTER.length} colaboradores`);
console.log(`  já cadastrados: ${ROSTER.length - novos.length}`);
console.log(`  a cadastrar:    ${novos.length}`);
console.log('\n  NOME COMPLETO (login)             | SENHA        | TRILHA');
console.log('  ' + '-'.repeat(74));
for (const c of credenciais) {
  console.log(`  ${c.nome.padEnd(33)} | ${c.senha.padEnd(12)} | ${c.trilha}${c.nivel ? ' · ' + c.nivel : ''}`);
}

if (APPLY) {
  db.users.push(...novos);
  fs.writeFileSync(USERS, JSON.stringify(db, null, 2) + '\n');
  console.log(`\nGRAVADO: data/users.json passou de ${antes} para ${db.users.length} usuários.`);
  console.log('As senhas em texto puro só existem nesta saída — guarde antes de fechar.');
} else {
  console.log('\n(dry run — nada foi gravado; use --apply)');
}
