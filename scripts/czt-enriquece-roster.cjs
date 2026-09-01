#!/usr/bin/env node
/*
  Czarnikow (ambiente de teste) — grava o NÍVEL de cada um dos 20 colaboradores,
  a partir da lista de inscrição do portal da Better.

  NÃO recria ninguém: casa pelo nome e só ACRESCENTA campos ao usuário que já
  existe. id, username e senha ficam intocados — quem já recebeu a senha continua
  entrando com ela.

  Grava só dois campos:
    · level — nível do curso: confidence | essentials | rise | apex.
    · stage — o rótulo que a própria Czarnikow usa ("Essentials 2", "Apex 1").
              O app tem 4 níveis; a numeração é da empresa, então fica separada.

  São metadados: nada no app lê hoje. Entram para o painel do professor (fase 2),
  que precisa saber em que ponto cada um está.

  E-MAIL E TELEFONE DA LISTA NÃO SÃO GRAVADOS. Vieram junto na lista de
  inscrição, mas o app não usa nenhum dos dois e dado pessoal não fica em
  repositório de código sem função.

  Também NÃO uso o campo `tracks` (Baker Hughes): ele serve para LIBERAR trilha
  que tem `owner`, e nenhuma trilha do Czarnikow tem. Preenchê-lo não esconderia
  nada de ninguém, mas confundiria quem for ler depois.

  Uso:  node scripts/czt-enriquece-roster.cjs [--apply]
*/

const fs = require('fs');
const path = require('path');

const USERS = path.join(__dirname, '..', 'data', 'users.json');
const APPLY = process.argv.includes('--apply');

/* Fonte: lista de inscritos do portal (03/08/2026). Onde o relatório mensal de
   julho registrou mudança de nível DEPOIS da inscrição, vale o mais recente —
   está marcado em `nota`. */
const DADOS = [
  { nome: 'Aline Momi',                 level: 'apex',       stage: 'Apex 1' },
  { nome: 'Antônio Sérgio Vido Junior', level: 'confidence', stage: 'Confidence' },
  { nome: 'Bruna Beatriz',              level: 'rise',       stage: 'Rise 1' },
  { nome: 'Carla Casanova',             level: 'rise',       stage: 'Rise 2' },
  { nome: 'Hadassa Regis',              level: 'confidence', stage: 'Confidence' },
  { nome: 'João Gabriel Brandão',       level: 'essentials', stage: 'Essentials 2' },
  { nome: 'Juliana Ferreira',           level: 'confidence', stage: 'Confidence' },
  { nome: 'Lissa Figueira',             level: 'essentials', stage: 'Essentials 4' },
  { nome: 'Luccas Bardella',            level: 'essentials', stage: 'Essentials 2' },
  { nome: 'Luis Takeo Setai',           level: 'rise',       stage: 'Rise 1' },
  { nome: 'Matheus Santos da Paz',      level: 'essentials', stage: 'Essentials 1', nota: 'subiu de Confidence em julho/2026' },
  { nome: 'Serena Lanças',              level: 'apex',       stage: 'Apex 1' },
  { nome: 'Thiago Pereira',             level: 'essentials', stage: 'Essentials 1' },
  { nome: 'Vinicius Steck',             level: 'rise',       stage: 'Rise 1',       nota: 'subiu de Essentials 4 em julho/2026' },
  { nome: 'Vitor Oliveira',             level: 'essentials', stage: 'Essentials 2' },
  { nome: 'Vitória Duarte Matto',       level: 'apex',       stage: 'Apex 1' },
  { nome: 'Douglas Salomão',            level: 'essentials', stage: 'Essentials 1' },
  { nome: 'Alessandra de Melo Cruz',    level: 'essentials', stage: 'Essentials 2' },
  { nome: 'Claudia Gonçalves da Silva', level: 'rise',       stage: 'Rise 2' },
  { nome: 'Weslley Magnago',             level: 'rise',       stage: 'Rise 1',       nota: 'começa em 04/08/2026' },
  { nome: 'João Vitor Caffetani',        level: 'essentials', stage: 'Essentials 3', nota: 'iniciou em 06/08/2026' },
];

const norm = (s) => (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/\s+/g, ' ').trim().toLowerCase();

const db = JSON.parse(fs.readFileSync(USERS, 'utf8'));
const porNome = new Map(db.users.map((u) => [norm(u.name), u]));

let atualizados = 0;
const semUsuario = [];
const linhas = [];

for (const d of DADOS) {
  const u = porNome.get(norm(d.nome));
  if (!u) { semUsuario.push(d.nome); continue; }
  u.level = d.level;
  u.stage = d.stage;
  if (d.nota) u.nota = d.nota;
  atualizados += 1;
  linhas.push(`  ${d.nome.padEnd(29)} | ${d.level.padEnd(11)} | ${d.stage}`);
}

console.log(`\nRoster Czarnikow — ${DADOS.length} na lista, ${atualizados} casaram com usuário cadastrado`);
if (semUsuario.length) console.log('  SEM usuário correspondente:', semUsuario.join(', '));
console.log('\n  NOME                          | NÍVEL       | ETAPA DA CZ');
console.log('  ' + '-'.repeat(60));
linhas.forEach((l) => console.log(l));

const notas = DADOS.filter((d) => d.nota);
if (notas.length) {
  console.log('\n  OBSERVAÇÕES:');
  notas.forEach((d) => console.log(`    · ${d.nome}: ${d.nota}`));
}

if (APPLY) {
  fs.writeFileSync(USERS, JSON.stringify(db, null, 2) + '\n');
  console.log('\nGRAVADO em data/users.json (id, username e senha intocados).');
} else {
  console.log('\n(dry run — nada foi gravado; use --apply)');
}
