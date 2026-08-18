// Destino natural de quem acaba de entrar: o curso da própria pessoa.
//
// Um ambiente interno de teste (`<cliente>-teste`) não conta como curso
// separado quando o cliente real também está liberado — é o mesmo material,
// em espelho. Sem isso, um aluno da Czarnikow (que tem `czarnikow` e
// `czarnikow-teste` no cadastro) parecia ter "dois cursos" e caía na raiz.
//
// Sobrando exatamente um cliente, ele é o destino. Com mais de um (ou nenhum),
// devolve null — aí a raiz mostra a lista para a pessoa escolher.
//
// Módulo puro de propósito: sem fs/jwt/next-headers, para poder ser importado
// tanto pelo servidor quanto pela tela de login (client component).
const TEST_SUFFIX = '-teste';

export function primaryClient(session) {
  const clients = session?.clients || [];
  const real = clients.filter(
    (c) => !(c.endsWith(TEST_SUFFIX) && clients.includes(c.slice(0, -TEST_SUFFIX.length)))
  );
  return real.length === 1 ? real[0] : null;
}

// Todos os clientes "de verdade" da sessão (espelhos de teste removidos),
// na ordem do cadastro. Usado pela raiz para montar a lista de cursos.
export function realClients(session) {
  const clients = session?.clients || [];
  return clients.filter(
    (c) => !(c.endsWith(TEST_SUFFIX) && clients.includes(c.slice(0, -TEST_SUFFIX.length)))
  );
}

// Clientes cujo material só abre com login. É a MESMA lista que o guard usa
// (ele importa daqui) — uma fonte só, para não haver dois lugares onde a
// resposta pode divergir. Adicionar um cliente aqui passa a exigir login nele.
export const PROTECTED_CLIENTS = ['aps', 'czarnikow', 'czarnikow-teste', 'bakerhughes', 'faapatendimento'];

// Filtra o destino pós-login (`?next=`). Devolve o caminho quando a pessoa
// realmente pode abri-lo, e null quando não pode — aí quem chamou usa o
// destino padrão dela.
//
// Por que existe: o botão "Sair" agora guarda o curso de onde a pessoa saiu, e
// sem esta checagem alguém que entrasse com OUTRA conta no mesmo navegador
// seria mandado para um material que não acessa, o guard a devolveria para o
// login, e o login a mandaria de novo para o mesmo lugar — um vai-e-volta sem
// fim. Rota que não é de cliente protegido (raiz, curso aberto) passa igual.
export function allowedNext(session, next) {
  if (typeof next !== 'string') return null;
  if (!next.startsWith('/') || next.startsWith('//')) return null;
  const seg = next.split(/[?#]/)[0].split('/')[1] || '';
  if (!seg || !PROTECTED_CLIENTS.includes(seg)) return next;
  if (session?.role === 'coordinator') return next;
  return (session?.clients || []).includes(seg) ? next : null;
}
