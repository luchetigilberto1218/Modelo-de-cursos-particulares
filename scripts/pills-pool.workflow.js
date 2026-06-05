export const meta = {
  name: 'pills-pool',
  description: 'Gera um pool de ~200 Pílulas de Sotaque únicas e linguisticamente vetadas (10 lotes temáticos + verificador linguista por lote)',
  phases: [
    { title: 'Generate', detail: 'um agente por tema gera ~20 pílulas únicas' },
    { title: 'Verify', detail: 'linguista revisa e corrige erros de pronúncia/explicação/contexto' },
  ],
}

const THEMES = [
  { key: 'east', n: 20, desc: "Sotaques regionais dos EUA — Costa Leste: Nova York (NYC), Brooklyn, Boston/New England, Filadélfia, Nova Jersey, Maine/Down East. Cada pílula isola UM traço fonético real e verificável (ex.: queda do 'r' pós-vocálico em Boston, vogal 'aw' aberta de NYC, 'water'→'wooder' na Filadélfia)." },
  { key: 'southmid', n: 20, desc: "Sotaques regionais dos EUA — Sul e Centro: Texas/Sul (drawl, 'y'all', monotongação de /aɪ/), Deep South, Chicago/Inland North (Northern Cities Vowel Shift, 'cat' tenso), Minnesota/Upper Midwest ('o' arredondado, 'you betcha'), Midland, e o General American do noticiário (rótico, neutro)." },
  { key: 'westintl', n: 20, desc: "Sotaques: Oeste dos EUA (Califórnia, 'Valley'/uptalk, Pacific Northwest, Western) + 1-2 traços do AAVE apresentados com RESPEITO e precisão + Inglês internacional ouvido em TI: Inglês indiano (ritmo silábico, 'kindly/revert'), diferenças British x American (schedule, garage, advertisement), Inglês australiano. Nada de estereótipo ofensivo — só fato fonético." },
  { key: 'connected', n: 22, desc: "Fala conectada e reduções do inglês americano: 'gonna/wanna/gotta/hafta', 'didja/whatcha', linking consoante→vogal, linking vogal→vogal com /w/ e /j/, flap T ('water'→'wadder', 'better'→'bedder'), glottal stop ('button', 'kitten'), formas fracas (to/for/of/and/can → schwa), 'of'→'a' ('cup a coffee'), '-ing'→'-in'', elisão ('next day'→'nex day'), assimilação ('ten boys'→'tem boys')." },
  { key: 'vowels', n: 20, desc: "Contrastes vocálicos e pares mínimos que travam o brasileiro: ship/sheep (ɪ x iː), full/fool (ʊ x uː), bed/bad (ɛ x æ), cat/cut (æ x ʌ), 'beach/bitch', 'sheet/shit' (cuidado e utilidade), live/leave, pull/pool, man/men, work/walk, schwa em sílaba átona. Cada pílula = um par + como produzir." },
  { key: 'consonants', n: 20, desc: "Consoantes e finais: TH surdo/sonoro (think x this) vs t/d/s/z, V x W (very x wary), dark L (milk, full), aspiração de p/t/k, terminação '-ed' (/t/ /d/ /ɪd/ — worked/played/wanted), terminação '-s' (/s/ /z/ /ɪz/), letras mudas (could, debt, receipt, island, hour, knee, climb), 'ough' (through/though/thought/tough/cough)." },
  { key: 'wordstress', n: 20, desc: "Tonicidade de palavra (word stress) e schwa: substantivo x verbo (REcord/reCORD, PREsent/preSENT, OBject/obJECT, conTRACT/CONtract), substantivos compostos (GREENhouse x green HOUSE), phrasal verbs, sufixos que mexem na tônica (-tion, -ity, -ic: 'photograph/photography'), schwa nas átonas. Cada pílula = um par/regra + exemplo." },
  { key: 'intonation', n: 20, desc: "Tonicidade de frase e entonação: stress em content words x function words, thought groups/pausas, entonação descendente (wh-questions, afirmações) x ascendente (yes/no), tag questions (confirmação x dúvida), entonação de listas, focus stress para contraste, cuidado com o uptalk em reunião. Cada pílula = um padrão + exemplo de negócio." },
  { key: 'business', n: 20, desc: "Traços de fala em reunião/telefone (inglês corporativo, genérico — serve a qualquer aluno): contrações no telefone, soletrar com o alfabeto fonético (Alpha/Bravo), dizer números/datas/horas/decimais/percentuais, ler e-mails e siglas, suavizar com entonação, evitar fillers, pronúncia clara em call com ruído, 'circle back/EOD/ASAP'." },
  { key: 'words', n: 20, desc: "Palavras de negócio/tech comumente mal pronunciadas por brasileiros: schedule (US 'SKED-jool'), data, route, status, process, niche, project (subst x verbo), comparable, leverage, infrastructure, architecture, vendor, invoice, warranty, issue, asset, liaison, colleague, hierarchy, subsidiary, façade, suite, genre, et al., via. Cada pílula = palavra + pronúncia aproximada + erro comum." },
]

const SUMMARY = {
  type: 'object', additionalProperties: false,
  required: ['theme', 'count', 'ok'],
  properties: { theme: { type: 'string' }, count: { type: 'integer' }, ok: { type: 'boolean' }, notes: { type: 'string' } },
}
const VSUMMARY = {
  type: 'object', additionalProperties: false,
  required: ['theme', 'issuesFound', 'issuesFixed', 'ok'],
  properties: { theme: { type: 'string' }, issuesFound: { type: 'integer' }, issuesFixed: { type: 'integer' }, ok: { type: 'boolean' }, notes: { type: 'string' } },
}

function genPrompt(t, i) {
  return `You are a phonetics-trained ESL pronunciation coach writing "Pílulas de Sotaque" (accent pills) for Brazilian executives learning English. Output is consumed by an app and must be linguistically ACCURATE.

THEME for this batch: ${t.desc}

Produce EXACTLY ${t.n} DISTINCT accent pills for this theme. Each pill:
{
  "region": "<rótulo curto em PT do sotaque/tema, ex: 'Boston (New England)', 'Fala conectada', 'Par mínimo ship/sheep', 'Tonicidade de palavra'>",
  "code": "<US | GB | IN | AU>  (use US por padrão; GB para British; IN para indiano; AU para australiano)",
  "tip": "<a DICA, em PORTUGUÊS, 1-2 frases. Explica UM traço de forma concreta e CORRETA, com exemplo de palavra entre aspas e uma aproximação de som. Sem IPA pesado; linguagem clara para leigo. NADA de afirmação fonética falsa.>",
  "sample": "<UMA frase-exemplo em INGLÊS, genérica de negócios (reunião/obra/contrato/e-mail), que CONTÉM as palavras citadas na dica para o aluno ouvir o traço. Curta, natural.>",
  "voice": "<us-male | us-female | gb-male | gb-female — combine com o code (US→us-*, GB→gb-*, IN/AU→us-female); alterne male/female para variar>"
}

HARD RULES:
- Cada uma das ${t.n} pílulas é ÚNICA (traço diferente, região/par/regra diferente). Sem duas dicas iguais.
- Precisão linguística é obrigatória: só afirme o que é verdade sobre o inglês americano/britânico real. Se não tiver certeza de um traço, escolha outro que você domina.
- A 'sample' DEVE conter as palavras-chave mencionadas na 'tip'.
- 'tip' em português; 'sample' em inglês. Tom respeitoso (sem caricatura).

Write the result to /tmp/pills_${i}.json as {"pills":[ ... ${t.n} objects ... ]} using the Write tool. Then return the summary {theme:"${t.key}", count:${t.n}, ok:true}.`
}

function verPrompt(t, i) {
  return `You are a strict English phonetics reviewer. Audit /tmp/pills_${i}.json (theme "${t.key}") for LINGUISTIC ERRORS and fix them.

Read the file. For EVERY pill check:
1. PRONUNCIATION ACCURACY — is the phonetic claim TRUE for real American/British English? (e.g. flap T, r-dropping, vowel contrasts, -ed endings, word stress like reCORD vs REcord). Fix any false or misleading claim.
2. EXPLANATION CLARITY — is the 'tip' clear and correct Portuguese, understandable to a layperson? Fix awkward or wrong wording.
3. CONTEXT/SAMPLE — does 'sample' actually contain the key words from 'tip' and demonstrate the trait? Is it natural business English? Fix if not.
4. CONSISTENCY — code matches the accent; voice matches code; no offensive stereotype.
5. DUPLICATES — if two pills teach the SAME trait, replace one with a new distinct, accurate pill on the same theme.

Rewrite /tmp/pills_${i}.json in place (Write tool) with the corrected pills (same count, same JSON shape). Return {theme:"${t.key}", issuesFound:<n>, issuesFixed:<n>, ok:true}.`
}

phase('Generate')
const results = await pipeline(
  THEMES.map((t, i) => ({ t, i })),
  ({ t, i }) => agent(genPrompt(t, i), { label: `gen:${t.key}`, phase: 'Generate', schema: SUMMARY }),
  (gen, { t, i }) => agent(verPrompt(t, i), { label: `verify:${t.key}`, phase: 'Verify', schema: VSUMMARY })
    .then((v) => ({ theme: t.key, gen, verify: v }))
)

const ok = results.filter(Boolean)
log(`Temas concluídos: ${ok.length}/${THEMES.length}`)
return {
  themes: ok.length,
  totalGenerated: ok.reduce((a, r) => a + (r.gen?.count || 0), 0),
  issuesFixed: ok.reduce((a, r) => a + (r.verify?.issuesFixed || 0), 0),
  files: THEMES.map((_, i) => `/tmp/pills_${i}.json`),
}
