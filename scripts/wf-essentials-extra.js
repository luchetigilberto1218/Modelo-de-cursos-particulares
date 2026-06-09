export const meta = {
  name: 'essentials-extra-practice',
  description: 'Autora extraPractice (banco de exercícios extras) bespoke para as 180 lições Essentials, 1 agente por track',
  phases: [{ title: 'Author', detail: 'um agente por track (20 lições cada) → grava JSON próprio' }],
}

const REPO = '/Users/gilbertoluchetti/Alumni/cursos'

const TRACKS = [
  { id: 'accounting',             theme: 'contabilidade (livros-razão, faturas, conciliação, balanços, relatórios financeiros) numa trading de açúcar global (Czarnikow)' },
  { id: 'fiscal-taxes',           theme: 'tributação e impostos (IVA/VAT, impostos alfandegários, declarações, retenções) na Czarnikow' },
  { id: 'general-business',       theme: 'negócios em geral (reuniões, e-mails, apresentações, telefonemas, escritório) na Czarnikow' },
  { id: 'hr',                     theme: 'recursos humanos (contratação, onboarding, folha de pagamento, avaliações, benefícios) na Czarnikow' },
  { id: 'information-technology', theme: 'TI (sistemas, software, suporte, segurança, dados) na Czarnikow' },
  { id: 'logistics',              theme: 'logística (transporte, armazém, entregas, contêineres, açúcar) na Czarnikow' },
  { id: 'supply-chain',           theme: 'cadeia de suprimentos (fornecedores, sourcing, estoque, planejamento) de açúcar na Czarnikow' },
  { id: 'trade-finance',          theme: 'trade finance (carta de crédito, pagamentos, contratos de commodities, câmbio) na Czarnikow' },
  { id: 'uk-england',             theme: 'inglês e cultura de negócios britânica (etiqueta, small talk, e-mails formais no Reino Unido) na Czarnikow' },
]

const EXAMPLE = String.raw`
EXEMPLO COMPLETO (uma lição do nível irmão Confidence, gramática "Verbo to be", tema logística).
Replique EXATAMENTE este formato e esta qualidade, mas para a gramática e o tema da SUA track:

[
 {
  "title": "Exercício extra A — Complete com am / is / are (logística)",
  "note": "Faça oralmente e depois no caderno. Gabarito em verde.",
  "items": [
   {"q": "The truck ___ at the gate.", "a": "is"},
   {"q": "I ___ the warehouse assistant.", "a": "am"},
   {"q": "The containers ___ very heavy.", "a": "are"},
   {"q": "Sugar ___ our main product.", "a": "is"},
   {"q": "We ___ a small but fast team.", "a": "are"},
   {"q": "The driver ___ on the road now.", "a": "is"},
   {"q": "You ___ in charge of the delivery today.", "a": "are"},
   {"q": "The pallets ___ ready for loading.", "a": "are"},
   {"q": "My manager ___ in a meeting.", "a": "is"},
   {"q": "The forklift and the truck ___ in the yard.", "a": "are"}
  ]
 },
 {
  "title": "Exercício extra B — Pergunta (?) e negativa (not)",
  "note": "Modelo: The truck is ready → Is the truck ready? / The truck is not ready.",
  "items": [
   {"q": "The delivery is late.", "a": "Is the delivery late? / The delivery is not (isn't) late."},
   {"q": "The drivers are here.", "a": "Are the drivers here? / The drivers are not (aren't) here."},
   {"q": "I am ready to start.", "a": "Am I ready to start? / I am not ready to start."},
   {"q": "The warehouse is open.", "a": "Is the warehouse open? / The warehouse is not open."},
   {"q": "They are on time.", "a": "Are they on time? / They are not (aren't) on time."}
  ]
 },
 {
  "title": "Vocabulary building — palavras de logística (além das da aula)",
  "note": "Para cada palavra, peça ao aluno uma frase curta no tema.",
  "items": [
   {"q": "pallet", "a": "palete"},
   {"q": "forklift", "a": "empilhadeira"},
   {"q": "container", "a": "contêiner"},
   {"q": "gate", "a": "portão"},
   {"q": "shift", "a": "turno"},
   {"q": "supplier", "a": "fornecedor"},
   {"q": "customer", "a": "cliente"},
   {"q": "load", "a": "carga / carregar"}
  ]
 },
 {
  "title": "Fale sobre você — sua rotina com o verbo to be",
  "note": "Perguntas sobre o dia a dia do aluno. Se travar, ofereça a estrutura-modelo e peça para completar.",
  "items": [
   {"q": "What is your job?", "a": "I am a / an ___ ."},
   {"q": "Where is your company?", "a": "My company is in ___ ."},
   {"q": "Are you busy on Mondays?", "a": "Yes, I am. / No, I am not."},
   {"q": "Who is your manager?", "a": "My manager is ___ ."},
   {"q": "What is your main product or service?", "a": "Our main product is ___ ."},
   {"q": "Are your customers in Brazil or abroad?", "a": "Our customers are ___ ."}
  ]
 }
]
`

function buildPrompt(track) {
  return `Você é um autor de materiais de inglês para negócios (ESL), nível A1–A2 (iniciante). Aluno é um profissional brasileiro adulto.

TAREFA: gerar um BANCO DE EXERCÍCIOS EXTRAS (campo teacherGuide.extraPractice) para 20 lições do curso Essentials, track "${track.id}" — tema: ${track.theme}.

PASSO 1 — Leia o arquivo de origem com as 20 lições:
  ${REPO}/scripts/essentials_src/${track.id}.json
Cada lição traz: num, order, title, grammar (o PONTO GRAMATICAL da lição), objective, grammarDetail e vocab (palavras já ensinadas na aula).

PASSO 2 — Para CADA uma das 20 lições, escreva EXATAMENTE 4 blocos, sob medida para o campo "grammar" daquela lição e para o tema da track:
  Bloco A — "Exercício extra A — <descrição em PT> (${track.id})": 8 a 10 itens de completar/transformar treinando a gramática da lição, frases no tema. Cada item {q, a} com gabarito.
  Bloco B — "Exercício extra B — <descrição em PT>": 5 itens de transformação/aplicação/montar-frase (ex.: vira pergunta, vira negativa, monte a frase, corrija o erro) — escolha o que melhor pratica a gramática da lição. Cada {q, a} com resposta-modelo.
  Bloco C — "Vocabulary building — <descrição em PT>": exatamente 8 palavras/expressões NOVAS do tema (NÃO repita as que já estão no vocab da lição), {q: termo em inglês, a: tradução em PT}. note: "Para cada palavra, peça ao aluno uma frase curta no tema."
  Bloco D — "Fale sobre você — <descrição em PT>": 6 perguntas sobre a rotina/dia a dia do PRÓPRIO aluno usando a gramática da lição, {q: pergunta em inglês, a: estrutura-modelo de resposta com ___ para o aluno completar}. note: "Perguntas sobre o dia a dia do aluno. Se travar, ofereça a estrutura-modelo e peça para completar."

REGRAS:
- Títulos e notes em PORTUGUÊS; os exercícios e respostas em INGLÊS (como no exemplo).
- A gramática treinada DEVE bater com o campo "grammar" da lição (ex.: se for "There is / There are", os itens praticam there is/are; se for "First conditional", praticam if + will).
- Tom de apoio A1–A2: frases curtas, vocabulário simples, sempre com gabarito/resposta-modelo em "a" para o professor conduzir sem preparo.
- Frases no tema da track e do contexto Czarnikow (trading de açúcar). Use os exemplos e vocab da própria lição como inspiração de tema, mas crie conteúdo NOVO (não copie os exercícios que já estão no app).
- Nada de markdown nos textos. Sem emojis.

${EXAMPLE}

PASSO 3 — Grave o resultado em:
  ${REPO}/scripts/essentials_extra/${track.id}.json
O arquivo deve ser um objeto JSON onde a chave é o num da lição (string) e o valor é o array dos 4 blocos. Exemplo de forma:
  { "301": [ {bloco A}, {bloco B}, {bloco C}, {bloco D} ], "302": [ ... ], ... }
Inclua TODAS as 20 lições da track. Valide que é JSON válido (rode: python3 -c "import json;d=json.load(open('${REPO}/scripts/essentials_extra/${track.id}.json'));print(len(d))" e confirme que imprime 20).

Retorne só um resumo curto: track, quantas lições gravadas, e os títulos dos 4 blocos de uma lição de exemplo.`
}

phase('Author')
const results = await parallel(TRACKS.map(t => () =>
  agent(buildPrompt(t), { label: `essentials:${t.id}`, phase: 'Author' })
))

return { tracks: TRACKS.map((t, i) => ({ track: t.id, summary: results[i] })) }
