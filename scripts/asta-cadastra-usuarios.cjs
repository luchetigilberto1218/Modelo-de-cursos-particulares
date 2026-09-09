#!/usr/bin/env node
/*
  Cadastra a turma da ASTA em data/users.json.

  Aditivo por construção: só insere quem ainda não existe e nunca toca em
  cadastro de outro cliente. Rodar de novo não duplica ninguém — atualiza o
  cadastro existente mantendo a senha que já estava lá.

    node scripts/asta-cadastra-usuarios.cjs

  As senhas são impressas UMA VEZ, no fim. Elas não ficam gravadas em lugar
  nenhum além do hash — se perder a lista, é preciso gerar de novo.
*/
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const ROOT = path.join(__dirname, '..');
const USERS = path.join(ROOT, 'data', 'users.json');
const roster = require(path.join(ROOT, 'data', 'asta', 'roster.cjs'));

/* Senha legível: duas palavras curtas + dois dígitos. Fácil de ditar por
   telefone e de digitar no chão de fábrica, sem caractere ambíguo. */
const P1 = ['cobre', 'fio', 'linha', 'forno', 'bobina', 'metal', 'campo', 'norte', 'porto', 'trilha', 'ponte', 'raio'];
const P2 = ['azul', 'claro', 'firme', 'novo', 'vivo', 'largo', 'certo', 'leve', 'forte', 'longo', 'puro', 'alto'];
function senha() {
  const a = P1[Math.floor(Math.random() * P1.length)];
  const b = P2[Math.floor(Math.random() * P2.length)];
  const n = String(Math.floor(Math.random() * 90) + 10);
  return `${a}-${b}-${n}`;
}

const db = JSON.parse(fs.readFileSync(USERS, 'utf-8'));
db.users = db.users || [];
const byId = new Map(db.users.map((u) => [u.id, u]));

const novas = [];

function upsert(entrada) {
  const existente = byId.get(entrada.id);
  if (existente) {
    // Mantém a senha já emitida; atualiza só o resto.
    Object.assign(existente, entrada, { password: existente.password });
    return;
  }
  const plain = senha();
  novas.push({ nome: entrada.name, usuario: entrada.username, senha: plain, papel: entrada.role });
  db.users.push({ ...entrada, password: bcrypt.hashSync(plain, 10) });
}

/* 1. Os colaboradores. Quem já enviou os temas recebe a trilha pessoal;
      quem ainda não enviou entra igual, com as trilhas compartilhadas. */
for (const p of roster) {
  upsert({
    id: `asta-${p.id}`,
    name: p.name,
    username: p.name,
    role: 'student',
    clients: ['asta'],
    tracks: p.track ? [p.track] : [],
  });
}

/* 2. O apresentador — a conta de quem conduz a aula. Vê o curso inteiro,
      inclusive as trilhas personalizadas, como o professor do Baker Hughes. */
upsert({
  id: 'asta-apresentador',
  name: 'Apresentador',
  username: 'Apresentador',
  role: 'teacher',
  clients: ['asta'],
});

/* 3. O RH. Papel novo `hr`: vê tudo o que o apresentador vê e, além disso,
      a página de acompanhamento da turma — quem tem trilha personalizada no ar
      e quem ainda está no aguardo do envio dos itens. */
upsert({
  id: 'asta-rh',
  name: 'RH',
  username: 'RH',
  role: 'hr',
  clients: ['asta'],
});

/* 4. O coordenador já existe — só ganha a ASTA na lista de clientes. */
const coord = byId.get('coord-1');
if (coord && !coord.clients.includes('asta')) coord.clients.push('asta');

fs.writeFileSync(USERS, JSON.stringify(db, null, 2));

console.log(`✓ ${USERS}`);
console.log(`  ${db.users.filter((u) => (u.clients || []).includes('asta')).length} contas com acesso à ASTA`);
if (!novas.length) {
  console.log('  nenhuma conta nova — todas já existiam, senhas preservadas');
} else {
  console.log(`\n  ${novas.length} contas novas. ANOTE AGORA — as senhas não são recuperáveis:\n`);
  const w = Math.max(...novas.map((n) => n.usuario.length));
  for (const n of novas) {
    console.log(`    ${n.usuario.padEnd(w)}   ${n.senha.padEnd(16)} ${n.papel}`);
  }
}
