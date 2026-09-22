import { get } from '@vercel/blob';

/*
  Materiais que moram FORA deste projeto, na Vercel da Helen:
    - EuroChem  → eurochem-material.vercel.app  (Gleyson, Edgar, Vitor)
    - Sucafina  → sucafina-portugues.vercel.app (Daniela)

  Cada um guarda o estado do aluno num JSON privado do Blob dele
  (estado/<aluno>.json). Aqui só se LÊ esse arquivo — este módulo importa
  apenas `get`, de propósito: nada grava, lista ou apaga no store de lá.
  Os projetos da Helen não sabem que este painel existe e não mudam nada.

  Tokens: EUROCHEM_BLOB_TOKEN e SUCAFINA_BLOB_TOKEN (env deste projeto).
  Sem token, o bloco mostra o erro e os outros clientes seguem normais.

  O formato é o de aula ao vivo, não de lição avulsa: cada aula tem a
  preparação do aluno (pre), a aula marcada como dada pelo professor
  (concluida) e a revisão depois dela (post). "Feitas" = preparações enviadas,
  que é o que o aluno faz sozinho no material.
*/

async function lerEstado(path, token) {
  if (!token) throw new Error('token do Blob não configurado');
  let r;
  try {
    r = await get(path, { access: 'private', token, useCache: false });
  } catch (e) {
    // Arquivo inexistente = aluno que nunca abriu. Qualquer outro erro (token
    // errado, rede) sobe e aparece no bloco — não vira um falso "zero".
    if (/not.?found/i.test(`${e?.name} ${e?.message}`)) return null;
    throw e;
  }
  if (!r || r.statusCode !== 200) return null;   // aluno que nunca abriu
  return JSON.parse(await new Response(r.stream).text());
}

// Última coisa que o PRÓPRIO aluno fez (o log também tem professor e intro).
function ultimaDoAluno(st, usuario) {
  const datas = (st?.log || []).filter((e) => e?.u === usuario).map((e) => e.em).filter(Boolean);
  datas.sort();
  return datas.length ? datas[datas.length - 1] : null;
}

function linha(st, { nome, usuario, meta, perfil }) {
  // A Sucafina foi semeada com dados de demonstração para o teste do
  // professor. Isso não é progresso da aluna e não pode contar como tal.
  if (st?.demo) {
    return { nome, feitas: 0, meta, ultimaAt: null, detalhe: `${perfil} · só dados de demonstração no arquivo` };
  }
  const aulas = Object.values(st?.aulas || {});
  const pre = aulas.filter((a) => a?.pre).length;
  const dadas = aulas.filter((a) => a?.concluida).length;
  const pos = aulas.filter((a) => a?.post).length;
  return {
    nome,
    feitas: pre,
    meta,
    ultimaAt: ultimaDoAluno(st, usuario),
    detalhe: [perfil, `${pre} preparações · ${dadas} aulas dadas · ${pos} pós-aula`].join(' · '),
  };
}

const EUROCHEM = [
  { usuario: 'gleyson', nome: 'Gleyson Ferreira', perfil: 'Diretor comercial', meta: 96 },
  { usuario: 'edgar', nome: 'Edgar Traldi', perfil: 'Head de Logística', meta: 96 },
  { usuario: 'vitor', nome: 'Vitor Lainetti', perfil: 'Diretor de Operações', meta: 96 },
];

export async function alunosEurochem() {
  const token = process.env.EUROCHEM_BLOB_TOKEN;
  return Promise.all(EUROCHEM.map(async (a) => linha(await lerEstado(`estado/${a.usuario}.json`, token), a)));
}

export async function alunosSucafina() {
  const token = process.env.SUCAFINA_BLOB_TOKEN;
  const st = await lerEstado('estado/daniela.json', token);
  return [linha(st, { usuario: 'daniela', nome: 'Daniela Marin Puentes', perfil: 'Português · Colômbia', meta: 48 })];
}
