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
