export const meta = {
  name: 'apex-extra-practice',
  description: 'Autora extraPractice C1-C2 (6 blocos avançados) para as 180 lições Apex, 1 agente por track',
  phases: [{ title: 'Author', detail: 'um agente por track (20 lições) → 6 blocos C1-C2 → grava JSON próprio' }],
}

const REPO = '/Users/gilbertoluchetti/Alumni/cursos'

const TRACKS = [
  { id: 'accounting',             theme: 'contabilidade avançada (consolidação, auditoria, normas IFRS, governança, relatórios ao board) numa trading de açúcar global (Czarnikow)' },
  { id: 'fiscal-taxes',           theme: 'tributação avançada (transfer pricing, compliance internacional, litígio fiscal, planejamento tributário) na Czarnikow' },
  { id: 'general-business',       theme: 'negócios em alto nível (negociação estratégica, board meetings, gestão de stakeholders, comunicação executiva) na Czarnikow' },
  { id: 'hr',                     theme: 'RH estratégico (gestão de talentos, change management, políticas, relações trabalhistas, liderança) na Czarnikow' },
  { id: 'information-technology', theme: 'TI estratégica (arquitetura, transformação digital, governança de dados, cibersegurança, integração de sistemas) na Czarnikow' },
  { id: 'logistics',              theme: 'logística avançada (incoterms, otimização de rede, gestão de risco, contratos internacionais, açúcar) na Czarnikow' },
  { id: 'supply-chain',           theme: 'cadeia de suprimentos estratégica (resiliência, sourcing global, sustentabilidade, gestão de risco) de açúcar na Czarnikow' },
  { id: 'trade-finance',          theme: 'trade finance avançado (estruturação, hedge, derivativos, risco de crédito, contratos de commodities) na Czarnikow' },
  { id: 'uk-england',             theme: 'comunicação executiva e cultura britânica de alto nível (diplomacia, nuance, understatement, negociação formal no Reino Unido) na Czarnikow' },
]

const SPEC = String.raw`
NÍVEL: Apex = C1–C2 (avançado a proficiente). Régua ALTA: frases longas e densas, registro formal/executivo, vocabulário sofisticado e idiomático, hedging e nuance. NADA de andaime infantil. Cada lição recebe EXATAMENTE 6 blocos, sob medida para o campo "grammar" da lição e o tema da track. Tipologia: Oxford Practice Grammar Advanced + Cambridge C1/C2 "Use of English" + banco Racional.

Bloco A — "Open cloze (avançado) — <descrição em PT> (<track>)": 10 itens de lacuna SEM opções (o aluno produz conectores formais, auxiliares, preposições dependentes, advérbios, elementos de estruturas avançadas). Frases de registro executivo. {q: frase com ___, a: palavra(s)}.
Bloco B — "Key word transformation — <descrição em PT>": 6 itens com a estrutura AVANÇADA da lição (ex.: inversão, cleft, nominalização, condicionais mistas, passiva formal, particípios). Formato do q: "Frase original.  ·  (PALAVRA-CHAVE)  ·  Segunda frase com ___ ." e a: a frase transformada (mesmo sentido, 3 a 6 palavras). Exercício-assinatura C1/C2.
Bloco C — "Register / paraphrase — <descrição em PT>": 6 itens. Reescrever uma frase neutra/informal em registro FORMAL/executivo usando a estrutura da lição (nominalização, passiva, hedging, cleft). q: frase de partida; a: versão reescrita modelo.
Bloco D — "Error correction (editing) — <descrição em PT>": 6 itens com erros SUTIS de C1/C2 (registro, colocação, coesão, hedging, ordem de palavras, uso de conector). q: frase com um erro; a: frase corrigida + porquê curtinho.
Bloco E — "Advanced collocations & lexis — <descrição em PT>": 10 colocações/expressões formais/idiomáticas/de hedging do tema (não repita o vocab da aula). {q: expressão em inglês, a: tradução/sentido em PT}. note: "Peça uma frase de registro formal com cada item."
Bloco F — "Discuss / Argue — <descrição em PT>": 6 prompts discursivos exigentes (opinião, contraste, recomendação) sobre o trabalho do aluno, usando a estrutura da lição. {q: prompt em inglês, a: resposta-modelo C1–C2 sofisticada, uma frase bem construída e formal que o aluno adapta}.

REGRAS:
- Títulos e notes em PORTUGUÊS; exercícios e respostas em INGLÊS.
- A estrutura treinada DEVE bater com o campo "grammar" da lição (ex.: nominalisation, inversion, cleft sentences, participle clauses, mixed conditionals, formal passive, advanced discourse markers, formal comparatives, subjunctive).
- Registro C1–C2: frases de negócios reais, formais e densas, com gabarito/resposta-modelo em "a". Tema da track no contexto Czarnikow (trading de açúcar).
- Conteúdo NOVO. Sem markdown, sem emojis.
`

const EXAMPLE = String.raw`
EXEMPLO (gramática "Inversion for emphasis", tema general-business). Replique o FORMATO e a densidade, adaptando à estrutura e ao tema da SUA track:

[
 {"title":"Open cloze (avançado) — Inversão para ênfase (general-business)","note":"Sem opções. O aluno produz o elemento que falta.","items":[
   {"q":"Not only ___ the board reject the proposal, but it also requested a full review.","a":"did"},
   {"q":"Rarely ___ we seen such volatility in the sugar market.","a":"have"},
   {"q":"No sooner ___ the deal been signed than the price moved against us.","a":"had"},
   {"q":"Under no circumstances ___ confidential figures be shared externally.","a":"should / may"},
   {"q":"Only after the audit ___ the discrepancy come to light.","a":"did"},
   {"q":"Such ___ the demand that we doubled the shipment.","a":"was"},
   {"q":"Little ___ they know that the contract would be renegotiated.","a":"did"},
   {"q":"Not until the quarter closed ___ we realise the full impact.","a":"did"},
   {"q":"So complex ___ the structure that few directors fully grasped it.","a":"was"},
   {"q":"At no point ___ the client express any concern.","a":"did"}]},
 {"title":"Key word transformation — mantenha o sentido (inversão)","note":"Reescreva usando a palavra-chave (3–6 palavras).","items":[
   {"q":"We had only just closed the books when the figures were queried.  ·  (SOONER)  ·  No ___ the books than the figures were queried.","a":"sooner had we closed"},
   {"q":"The committee has seldom faced such a difficult decision.  ·  (RARELY)  ·  Rarely ___ such a difficult decision.","a":"has the committee faced"},
   {"q":"You must not, in any case, disclose these terms.  ·  (CIRCUMSTANCES)  ·  Under no ___ disclose these terms.","a":"circumstances must you"},
   {"q":"They did not realise how exposed the position was.  ·  (LITTLE)  ·  Little ___ how exposed the position was.","a":"did they realise"},
   {"q":"The proposal was so ambitious that it alarmed investors.  ·  (SUCH)  ·  Such ___ that it alarmed investors.","a":"was the ambition of the proposal"},
   {"q":"We only understood the risk after the report.  ·  (ONLY)  ·  Only after the report ___ the risk.","a":"did we understand"}]},
 {"title":"Register / paraphrase — eleve ao registro executivo","note":"Reescreva em registro formal usando inversão/nominalização.","items":[
   {"q":"We've never seen results this good.","a":"Never before have we achieved such strong results."},
   {"q":"You really shouldn't share this with anyone outside.","a":"Under no circumstances should this be disclosed externally."},
   {"q":"As soon as we signed, the market dropped.","a":"No sooner had we signed than the market declined."},
   {"q":"It was only when the audit ended that we saw the problem.","a":"Only upon the conclusion of the audit did the problem become apparent."},
   {"q":"The plan was so risky that the board said no.","a":"So considerable was the risk that the board declined to proceed."},
   {"q":"We didn't expect the contract to change at all.","a":"At no point did we anticipate any revision to the contract."}]},
 {"title":"Error correction (editing) — ache e corrija o erro sutil","note":"Um erro de C1/C2 por frase. Corrija e diga por quê.","items":[
   {"q":"Not only the board rejected it, but also delayed the review.","a":"Not only did the board reject it, but it also delayed the review. (inversão exige auxiliar 'did' + sujeito)"},
   {"q":"Rarely we have encountered such resistance.","a":"Rarely have we encountered such resistance. (após advérbio negativo inicial, inverte: have we)"},
   {"q":"No sooner we had arrived than the meeting started.","a":"No sooner had we arrived than the meeting started. (inversão: had we)"},
   {"q":"Under no circumstances you should sign without approval.","a":"Under no circumstances should you sign without approval. (inverte sujeito e modal)"},
   {"q":"Only after the deal we understood the terms.","a":"Only after the deal did we understand the terms. (cláusula 'only after' inicial força inversão)"},
   {"q":"Such was the demand that we had to ration the supply, isn't it?","a":"Such was the demand that we had to ration supply. (registro formal não pede question tag coloquial)"}]},
 {"title":"Advanced collocations & lexis — comunicação executiva (além da aula)","note":"Peça uma frase de registro formal com cada item.","items":[
   {"q":"to table a proposal","a":"apresentar uma proposta (em reunião)"},{"q":"to reach a consensus","a":"chegar a um consenso"},
   {"q":"to err on the side of caution","a":"pecar pelo excesso de cautela"},{"q":"a calculated risk","a":"um risco calculado"},
   {"q":"to defer to someone","a":"acatar a opinião de alguém"},{"q":"with the benefit of hindsight","a":"em retrospecto"},
   {"q":"to bring something to bear","a":"colocar algo em ação / aplicar"},{"q":"a contentious issue","a":"uma questão controversa"},
   {"q":"to set a precedent","a":"abrir um precedente"},{"q":"all things considered","a":"considerando tudo"}]},
 {"title":"Discuss / Argue — inversão e ênfase no seu trabalho","note":"Respostas-modelo C1–C2 que o aluno adapta.","items":[
   {"q":"What decision in your role has carried the greatest risk, and how did you justify it?","a":"Rarely have I faced a decision as consequential as approving the new sourcing contract, yet so compelling was the business case that the risk was warranted."},
   {"q":"How do you signal a firm boundary to a counterparty without sounding aggressive?","a":"Under no circumstances would I concede on price prematurely; instead, I frame the limit as a shared constraint we must work within."},
   {"q":"Describe a moment when the full impact of a problem only emerged later.","a":"Only after the quarter had closed did the scale of the exposure become apparent, which prompted a thorough review of our controls."},
   {"q":"What trend in your sector has surprised you most?","a":"Not only has volatility increased, but it has also reshaped how we hedge our positions."},
   {"q":"How do you defend an unpopular recommendation to senior stakeholders?","a":"Seldom is such a recommendation welcomed at first, so I anchor it in data and frame the alternative cost of inaction."},
   {"q":"What would you never compromise on professionally?","a":"At no point would I compromise the integrity of our reporting, however inconvenient the figures may be."}]}
]
`

function buildPrompt(track) {
  return `Você é um autor sênior de materiais de inglês para negócios (ESL), especialista em Cambridge C1 Advanced / C2 Proficiency e Oxford Practice Grammar Advanced. Aluno: executivo brasileiro de nível C1–C2.

TAREFA: gerar um BANCO DE EXERCÍCIOS EXTRAS (campo teacherGuide.extraPractice) para 20 lições do curso APEX, track "${track.id}" — tema: ${track.theme}.

PASSO 1 — Leia o arquivo de origem com as 20 lições:
  ${REPO}/scripts/apex_src/${track.id}.json
Cada lição traz: num, order, title, grammar (a ESTRUTURA AVANÇADA), objective, grammarDetail, grammarDeepDive e vocab (já ensinado).

PASSO 2 — Para CADA uma das 20 lições, escreva EXATAMENTE 6 blocos seguindo esta especificação:
${SPEC}

${EXAMPLE}

PASSO 3 — Grave em:
  ${REPO}/scripts/apex_extra/${track.id}.json
Objeto JSON: chave = num da lição (string), valor = array dos 6 blocos. Inclua TODAS as 20 lições.
Valide: python3 -c "import json;d=json.load(open('${REPO}/scripts/apex_extra/${track.id}.json'));print(len(d), all(len(v)==6 for v in d.values()))" — deve imprimir "20 True".

Retorne só um resumo curto: track, lições gravadas, e os 6 títulos de uma lição de exemplo.`
}

const only = Array.isArray(args) && args.length ? TRACKS.filter(t => args.includes(t.id)) : TRACKS
phase('Author')
const results = await parallel(only.map(t => () =>
  agent(buildPrompt(t), { label: `apex:${t.id}`, phase: 'Author' })
))

return { tracks: only.map((t, i) => ({ track: t.id, summary: results[i] })) }
