import fs from 'fs';
import path from 'path';

import { getUsers } from './auth';
import { getCourse } from './courses';
import { listAll as listCzarnikow } from './czarnikow-teste-progress-store';
import { listAll as listDeltaDucon } from './deltaducon-progress-store';
import { listAll as listBakerHughes } from './bakerhughes-progress-store';
import { listAll as listFaap } from './faapatendimento-progress-store';
import { readProgress as readRacional, listUpdatedAt as racionalDatas } from './racional-progress-store';
import { TRACKS as DD_TRACKS, TOTAL as DD_TOTAL, ROSTER as DD_ROSTER, slugify, doneInTrack } from './deltaducon-roster';

/*
  Leitura de turma para a coordenação.

  Cada curso guarda progresso de um jeito próprio, herdado de quando foi
  construído: a Czarnikow e o Baker Hughes por número de lição, a Delta Ducon
  por "<trilha>_<n>", a Racional num doc por aluno. Este módulo é o tradutor —
  lê cada um no formato dele e devolve a MESMA linha para todos:

      { nome, feitas, meta, ultimaAt, detalhe }

  Só leitura: nada aqui grava, e cada cliente é lido dentro do seu próprio
  try/catch. Se o Blob de um cair, os outros continuam aparecendo — o painel
  mostra o erro naquele bloco em vez de ficar em branco.
*/

const CZ_CLIENT = 'czarnikow-teste';   // as duas portas da CZ dividem o mesmo store
const CZ_POR_BLOCO = 20;               // cada (nível × trilha) tem 20 lições
const FAAP_CLIENT = 'faapatendimento';
const BH_CLIENT = 'bakerhughes';

function contarFeitas(lessons) {
  return Object.values(lessons || {}).filter((l) => l?.done).length;
}

// Data mais recente entre o carimbo do servidor e as conclusões registradas.
function ultimaAtividade(doc) {
  const datas = Object.values(doc?.lessons || {}).map((l) => l?.doneAt).filter(Boolean);
  if (doc?.at) datas.push(doc.at);
  datas.sort();
  return datas.length ? datas[datas.length - 1] : null;
}

async function bloco(id, nome, href, painel, carregar, aviso = null, contagem = null) {
  const base = { id, nome, href, painel, aviso, contagem };
  try {
    return { ...base, erro: null, alunos: await carregar() };
  } catch (e) {
    return { ...base, erro: e?.message || 'falha ao ler', alunos: [] };
  }
}

// O que o número de acessos de cada curso quer dizer. Não é o mesmo em todos:
// onde há login, o servidor conta só sessão de aluno; onde não há, conta todo
// mundo. Dizer isso na tela evita comparar duas coisas diferentes.
const SO_ALUNO = 'só acessos de aluno logado';

// ---------------------------------------------------------------- Czarnikow

async function alunosCzarnikow() {
  const docs = await listCzarnikow();
  const porAluno = new Map(docs.map((d) => [d.student, d]));
  const course = getCourse(CZ_CLIENT);
  const nomeTrilha = new Map((course?.tracks || []).map((t) => [t.id, t.name]));

  // `czt-teste` é a conta de demonstração e `czt-prof` é o acesso do professor:
  // nenhum dos dois é colaborador, e contá-los inflaria o engajamento.
  return getUsers()
    .filter((u) => u.role === 'student' && (u.clients || []).includes(CZ_CLIENT) && u.id !== 'czt-teste')
    .map((u) => {
      const doc = porAluno.get(u.id) || null;
      const trilhas = u.track || [];
      return {
        nome: u.name,
        feitas: contarFeitas(doc?.lessons),
        // meta = as trilhas designadas a esta pessoa, 20 lições cada
        meta: trilhas.length ? trilhas.length * CZ_POR_BLOCO : null,
        ultimaAt: ultimaAtividade(doc),
        detalhe: [u.stage || u.level, trilhas.map((t) => nomeTrilha.get(t) || t).join(', ')]
          .filter(Boolean).join(' · '),
      };
    });
}

// -------------------------------------------------------------- Delta Ducon

async function alunosDeltaDucon() {
  const registros = await listDeltaDucon();
  const porSlug = new Map(registros.map((r) => [r.slug, r]));

  return DD_ROSTER.map(([nome, t]) => {
    const rec = porSlug.get(slugify(nome)) || null;
    const naTrilha = doneInTrack(rec?.done, t);
    const total = rec?.done ? Object.keys(rec.done).length : 0;
    return {
      nome,
      feitas: naTrilha,
      meta: DD_TOTAL,
      extra: Math.max(0, total - naTrilha),   // aulas fora da trilha designada
      ultimaAt: rec?.at || null,
      detalhe: DD_TRACKS[t] || '',
    };
  });
}

// ----------------------------------------------------------------- Racional

// A Racional não tem cadastro em users.json: o elenco é o índice do curso, e
// cada aluno tem um plano próprio (por isso a meta varia de 72 a 180 lições).
async function alunosRacional() {
  const idxPath = path.join(process.cwd(), 'courses', 'racional', 'index.json');
  const idx = JSON.parse(fs.readFileSync(idxPath, 'utf-8'));
  const datas = await racionalDatas();
  const alunos = [];
  for (const s of idx.students || []) {
    const p = await readRacional(s.id);
    const feitas = Object.values(p || {}).filter((l) => l?.done).length;
    alunos.push({
      nome: s.studentName || s.id,
      feitas,
      meta: s.totalLessons || null,
      // o doc da Racional não carimba data por dentro: a que existe é a do
      // próprio arquivo no Blob, ou seja, a última vez que ele sincronizou
      ultimaAt: datas.get(s.id) || null,
      detalhe: [s.role, s.cefr].filter(Boolean).join(' · '),
    });
  }
  return alunos;
}

// --------------------------------------------------------------------- FAAP

async function alunosFaap() {
  const docs = await listFaap();
  const porAluno = new Map(docs.map((d) => [d.student, d]));
  const total = (getCourse(FAAP_CLIENT)?.lessons || []).length || null;

  return getUsers()
    .filter((u) => u.role === 'student' && (u.clients || []).includes(FAAP_CLIENT))
    .map((u) => {
      const doc = porAluno.get(u.id) || null;
      return {
        nome: u.name,
        feitas: contarFeitas(doc?.lessons),
        meta: total,
        ultimaAt: ultimaAtividade(doc),
        detalhe: u.level || '',
      };
    });
}

// ------------------------------------------------------------- Baker Hughes

async function alunosBakerHughes() {
  const docs = await listBakerHughes();
  const porAluno = new Map(docs.map((d) => [d.student, d]));
  const course = getCourse(BH_CLIENT);
  const lessons = course?.lessons || [];
  // Trilha pessoal (com `owner`): é a meta de quem a tem. O resto do material
  // fica disponível, mas não é o que foi combinado com a pessoa.
  const daTrilha = (owner) => lessons.filter((l) => l.track === owner).length || null;

  return getUsers()
    .filter((u) => u.role === 'student' && (u.clients || []).includes(BH_CLIENT))
    .map((u) => {
      const doc = porAluno.get(u.id) || null;
      const owner = (u.tracks || [])[0] || null;
      return {
        nome: u.name,
        feitas: contarFeitas(doc?.lessons),
        meta: owner ? daTrilha(owner) : null,
        ultimaAt: ultimaAtividade(doc),
        // Conta desativada continua no painel, marcada — o histórico não some.
        // `awaitingSetup` é quem já foi cadastrado mas ainda não tem senha nem
        // trilha definidas: dizer "acesso desativado" faria parecer que saiu,
        // como a Mariana, quando na verdade ainda nem começou.
        detalhe: u.awaitingSetup ? 'aguardando senha e trilha'
          : u.disabled ? 'acesso desativado'
          : owner ? 'trilha pessoal'
          : 'trilhas compartilhadas',
        inativo: !!u.disabled,
        pendente: !!u.awaitingSetup,
      };
    });
}

// --------------------------------------------------------------------------

// Todos os blocos, na ordem em que a coordenação pediu para lê-los.
export async function getPainelCoordenacao() {
  return Promise.all([
    bloco('czarnikow', 'Czarnikow', '/czarnikow', '/czarnikow/professor', alunosCzarnikow, null, SO_ALUNO),
    bloco('deltaducon', 'Delta Ducon', '/deltaducon', '/deltaducon-admin', alunosDeltaDucon,
      'O material da Delta Ducon é HTML estático e ficou de fora do contador de acessos até 18/08/2026 — o progresso sempre foi real, mas o número de acessos só passa a contar a partir dessa data.',
      'todos os acessos — o curso não tem login'),
    bloco('racional', 'Racional', '/racional', null, alunosRacional,
      'A data da Racional é a da última sincronização do aluno, não a de cada conclusão.',
      'acessos de aluno — quem está em modo professor não conta'),
    bloco('faapatendimento', 'FAAP · Atendimento', '/faapatendimento', null, alunosFaap,
      'A gravação no servidor foi ligada em 18/08/2026. O que cada pessoa fez antes disso está no navegador dela e aparece aqui assim que ela abrir o material de novo.',
      SO_ALUNO),
    bloco('bakerhughes', 'Baker Hughes', '/bakerhughes', null, alunosBakerHughes, null, SO_ALUNO),
  ]);
}
