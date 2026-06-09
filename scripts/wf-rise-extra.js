export const meta = {
  name: 'rise-extra-practice',
  description: 'Autora extraPractice avançado (6 blocos, B1-B2) para as 180 lições Rise, 1 agente por track',
  phases: [{ title: 'Author', detail: 'um agente por track (20 lições) → 6 blocos B1-B2 → grava JSON próprio' }],
}

const REPO = '/Users/gilbertoluchetti/Alumni/cursos'

const TRACKS = [
  { id: 'accounting',             theme: 'contabilidade (livros-razão, faturas, conciliação, balanços, auditoria, relatórios financeiros) numa trading de açúcar global (Czarnikow)' },
  { id: 'fiscal-taxes',           theme: 'tributação e impostos (IVA/VAT, impostos alfandegários, declarações, transfer pricing, compliance) na Czarnikow' },
  { id: 'general-business',       theme: 'negócios em geral (reuniões, e-mails, apresentações, negociação, relatórios) na Czarnikow' },
  { id: 'hr',                     theme: 'recursos humanos (contratação, onboarding, folha, avaliações, políticas, performance) na Czarnikow' },
  { id: 'information-technology', theme: 'TI (sistemas, software, suporte, segurança, dados, integração) na Czarnikow' },
  { id: 'logistics',              theme: 'logística (transporte, armazém, entregas, contêineres, incoterms, açúcar) na Czarnikow' },
  { id: 'supply-chain',           theme: 'cadeia de suprimentos (fornecedores, sourcing, estoque, planejamento, risco) de açúcar na Czarnikow' },
  { id: 'trade-finance',          theme: 'trade finance (carta de crédito, pagamentos, contratos de commodities, hedge, câmbio) na Czarnikow' },
  { id: 'uk-england',             theme: 'inglês e cultura de negócios britânica (etiqueta, negociação, e-mails formais, reuniões no Reino Unido) na Czarnikow' },
]

const SPEC = String.raw`
NÍVEL: Rise = B1–B2 (intermediário a intermediário-alto). Régua mais ALTA que Essentials: frases mais longas e densas, vocabulário de negócios real, menos "andaime". Cada lição recebe EXATAMENTE 6 blocos, sob medida para o campo "grammar" da lição e o tema da track. Tipologia inspirada no Oxford/Cambridge "Use of English" + banco de prática Racional:

Bloco A — "Open cloze — <descrição em PT> (<track>)": 10 itens de lacuna SEM opções e SEM dica entre parênteses (o aluno produz a palavra: auxiliar, preposição, linker, artigo, forma verbal) treinando a gramática da lição. {q: frase com ___, a: palavra(s)}.
Bloco B — "Key word transformation — <descrição em PT>": 6 itens. Reescrever a 2ª frase com o MESMO sentido usando a palavra-chave dada (2 a 5 palavras). Formato do q: "Frase original.  ·  (PALAVRA-CHAVE)  ·  Segunda frase com ___ ." e a: a frase completa transformada. É o exercício-assinatura do B2 — capriche.
Bloco C — "Multiple-choice cloze — <descrição em PT>": 6 itens. q: frase com ___ e três opções "(a) … (b) … (c) …" (gramática/colocação/linker da lição); a: a letra + a opção correta.
Bloco D — "Error correction (editing) — <descrição em PT>": 6 itens. q: uma frase com UM erro (tempo verbal, colocação, preposição, linker ou registro); a: a frase corrigida + bem curtinho o porquê.
Bloco E — "Collocations & vocabulary building — <descrição em PT>": 10 colocações/expressões/phrasal verbs de negócios NOVAS do tema (não repita o vocab da aula). {q: colocação em inglês, a: tradução/sentido em PT}. note: "Peça uma frase com cada colocação no contexto do aluno."
Bloco F — "Fale sobre você / Discuss — <descrição em PT>": 6 perguntas mais abertas e profissionais sobre o trabalho do aluno, usando a gramática da lição. {q: pergunta em inglês, a: resposta-modelo completa de nível B1–B2 (uma frase bem-formada que o aluno pode adaptar)}.

REGRAS:
- Títulos e notes em PORTUGUÊS; exercícios e respostas em INGLÊS.
- A gramática treinada DEVE bater com o campo "grammar" da lição (ex.: present perfect, relative clauses, passive voice, conditionals, reported speech, linking words, modals).
- Tom B1–B2: frases de negócios reais e mais longas, com gabarito/resposta-modelo em "a". Tema da track no contexto Czarnikow (trading de açúcar).
- Conteúdo NOVO (não copie os exercícios que já estão no app). Sem markdown, sem emojis.
`

const EXAMPLE = String.raw`
EXEMPLO (gramática "Present perfect for ongoing results", tema general-business). Replique o FORMATO e a densidade, adaptando à gramática e ao tema da SUA track:

[
 {"title":"Open cloze — Present Perfect (resultados em aberto) (general-business)","note":"Sem opções. O aluno produz a palavra que falta.","items":[
   {"q":"We ___ already finalised the Q3 sugar forecast.","a":"have"},
   {"q":"The board ___ not yet approved the new budget.","a":"has"},
   {"q":"How long ___ you worked with this supplier?","a":"have"},
   {"q":"She ___ just sent the revised contract.","a":"has"},
   {"q":"They have ___ closed three deals this quarter.","a":"already"},
   {"q":"We have been in talks ___ March.","a":"since"},
   {"q":"I have known the client ___ five years.","a":"for"},
   {"q":"The team ___ recently moved to the new system.","a":"has"},
   {"q":"___ the invoice been paid yet?","a":"Has"},
   {"q":"We haven't received the shipment ___ .","a":"yet"}]},
 {"title":"Key word transformation — mantenha o sentido","note":"Reescreva usando a palavra-chave (2–5 palavras).","items":[
   {"q":"I started this job in 2019 and I am still here.  ·  (FOR)  ·  I ___ this job for years.","a":"have had / have been in"},
   {"q":"This is my first visit to the London office.  ·  (NEVER)  ·  I ___ to the London office before.","a":"have never been"},
   {"q":"The last time we updated the price was on Monday.  ·  (SINCE)  ·  We ___ the price since Monday.","a":"haven't updated"},
   {"q":"It is two weeks since the report was due.  ·  (FOR)  ·  The report ___ for two weeks.","a":"has been overdue"},
   {"q":"She finished the audit a moment ago.  ·  (JUST)  ·  She ___ the audit.","a":"has just finished"},
   {"q":"Do you have experience with this client?  ·  (EVER)  ·  ___ with this client?","a":"Have you ever dealt"}]},
 {"title":"Multiple-choice cloze — escolha a forma correta","note":"Marque a opção certa.","items":[
   {"q":"We ___ the figures, so the report is ready. (a) have checked (b) checked (c) are checking","a":"(a) have checked"},
   {"q":"The CFO has worked here ___ 2015. (a) for (b) since (c) from","a":"(b) since"},
   {"q":"___ you finished the reconciliation yet? (a) Did (b) Are (c) Have","a":"(c) Have"},
   {"q":"They haven't replied ___ . (a) already (b) yet (c) since","a":"(b) yet"},
   {"q":"This is the best forecast we ___ produced. (a) have ever (b) ever have (c) had ever","a":"(a) have ever"},
   {"q":"Profits ___ risen sharply this year. (a) has (b) have (c) having","a":"(b) have"}]},
 {"title":"Error correction (editing) — ache e corrija o erro","note":"Um erro por frase. Corrija e diga por quê.","items":[
   {"q":"We have finished the audit yesterday.","a":"We finished the audit yesterday. (tempo definido no passado → simple past, não present perfect)"},
   {"q":"I am working here since 2018.","a":"I have worked / have been working here since 2018. (duração até agora → present perfect)"},
   {"q":"She has went to the meeting.","a":"She has gone to the meeting. (particípio de go = gone)"},
   {"q":"Have you ever worked with they?","a":"Have you ever worked with them? (objeto → them)"},
   {"q":"We have closed the deal since two weeks.","a":"We closed the deal two weeks ago. (ponto no passado → ago + simple past)"},
   {"q":"The price has rise a lot.","a":"The price has risen a lot. (particípio de rise = risen)"}]},
 {"title":"Collocations & vocabulary building — negócios (além da aula)","note":"Peça uma frase com cada colocação no contexto do aluno.","items":[
   {"q":"to close a deal","a":"fechar um negócio"},{"q":"to meet a deadline","a":"cumprir um prazo"},
   {"q":"to follow up on","a":"dar seguimento a"},{"q":"a track record","a":"um histórico (de resultados)"},
   {"q":"to roll out (a system)","a":"implantar / lançar"},{"q":"key takeaway","a":"principal conclusão"},
   {"q":"to keep someone posted","a":"manter alguém informado"},{"q":"in the pipeline","a":"em andamento / previsto"},
   {"q":"to touch base","a":"fazer um contato rápido"},{"q":"a ballpark figure","a":"um valor aproximado"}]},
 {"title":"Fale sobre você / Discuss — Present Perfect no seu trabalho","note":"Respostas-modelo de nível B1–B2 que o aluno adapta.","items":[
   {"q":"What have you achieved at work this year?","a":"This year I have led two projects and we have improved our delivery time by 20%."},
   {"q":"How long have you worked in your current role?","a":"I have worked in this role for three years / since 2022."},
   {"q":"What new skill have you developed recently?","a":"I have recently developed my reporting skills, so now I prepare the monthly figures myself."},
   {"q":"Have you ever dealt with a difficult client? What happened?","a":"Yes, I have. I have handled several tense negotiations and learned to stay calm."},
   {"q":"What has changed in your company in the last year?","a":"We have adopted a new system and the team has grown a lot."},
   {"q":"What haven't you finished yet this week?","a":"I haven't finished the quarterly report yet, but I will send it on Friday."}]}
]
`

function buildPrompt(track) {
  return `Você é um autor sênior de materiais de inglês para negócios (ESL), especialista em exames Cambridge/Oxford "Use of English". Aluno: profissional brasileiro adulto de nível B1–B2.

TAREFA: gerar um BANCO DE EXERCÍCIOS EXTRAS (campo teacherGuide.extraPractice) para 20 lições do curso RISE, track "${track.id}" — tema: ${track.theme}.

PASSO 1 — Leia o arquivo de origem com as 20 lições:
  ${REPO}/scripts/rise_src/${track.id}.json
Cada lição traz: num, order, title, grammar (o PONTO GRAMATICAL), objective, grammarDetail, grammarDeepDive e vocab (palavras já ensinadas).

PASSO 2 — Para CADA uma das 20 lições, escreva EXATAMENTE 6 blocos seguindo esta especificação:
${SPEC}

${EXAMPLE}

PASSO 3 — Grave em:
  ${REPO}/scripts/rise_extra/${track.id}.json
Objeto JSON: chave = num da lição (string), valor = array dos 6 blocos. Inclua TODAS as 20 lições.
Valide: python3 -c "import json;d=json.load(open('${REPO}/scripts/rise_extra/${track.id}.json'));print(len(d), all(len(v)==6 for v in d.values()))" — deve imprimir "20 True".

Retorne só um resumo curto: track, lições gravadas, e os 6 títulos de uma lição de exemplo.`
}

// args (opcional) = lista de track ids a processar; default = todas
const only = Array.isArray(args) && args.length ? TRACKS.filter(t => args.includes(t.id)) : TRACKS
phase('Author')
const results = await parallel(only.map(t => () =>
  agent(buildPrompt(t), { label: `rise:${t.id}`, phase: 'Author' })
))

return { tracks: only.map((t, i) => ({ track: t.id, summary: results[i] })) }
