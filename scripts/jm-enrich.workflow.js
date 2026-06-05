export const meta = {
  name: 'jm-enrich',
  description: 'Gera gramática (144 CORE) + bônus EN nivelados (90) para o curso do José Mário, com verificação adversarial por lote',
  phases: [
    { title: 'Generate', detail: 'um agente por lote: lê as aulas e escreve grammar+bonus' },
    { title: 'Verify', detail: 'verificador adversarial por lote: inglês-only, nível, schema' },
  ],
}

const COURSE = '/Users/gilbertoluchetti/Alumni/cursos/courses/racional/josemario.json'
const BATCHES = '/tmp/jm_batches.json'
const COUNT = (args && args.count) || 30

const SUMMARY_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['batch', 'ok', 'grammarCount', 'bonusCount'],
  properties: {
    batch: { type: 'integer' },
    ok: { type: 'boolean' },
    grammarCount: { type: 'integer' },
    bonusCount: { type: 'integer' },
    notes: { type: 'string' },
  },
}

const VERIFY_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['batch', 'ok', 'issuesFound', 'issuesFixed'],
  properties: {
    batch: { type: 'integer' },
    ok: { type: 'boolean' },
    issuesFound: { type: 'integer' },
    issuesFixed: { type: 'integer' },
    notes: { type: 'string' },
  },
}

function genPrompt(i) {
  return `You are an ESL curriculum author for an executive English program. The student is **José Mário Simões Jacinto**, a Contract Manager at Racional Engenharia (a Brazilian construction company), CEFR level A1 rising. His professional universe: **Microsoft hyperscale data centers**, civil engineering, contract management, dealing with a US client. The program is in Portuguese-for-instruction with English targets.

Your job: enrich a BATCH of lessons with two add-ons.

STEP 1 — Read your batch spec:
Run: node -e "const b=require('${BATCHES}'); console.log(JSON.stringify(b[${i}]))"
That gives you {range, lessons:[{num, needsGrammar, needsBonus, bonusLevel}]}.

STEP 2 — Read the real lesson content for those nums:
Run: node -e "const d=require('${COURSE}'); const want=new Set(JSON.parse(process.argv[1])); console.log(JSON.stringify(d.lessons.filter(l=>want.has(l.num)).map(l=>({num:l.num,mod:l.mod,type:l.type,title:l.title,objective:l.objective,context:l.context,vocab:(l.vocab||[]).map(v=>({en:v.en,pt:v.pt}))}))))" '[<comma-separated nums>]'

STEP 3 — For EACH lesson in the batch, produce:

(a) If needsGrammar=true → a "grammar" object (Portuguese explanations, English examples). Choose a grammar point that NATURALLY FITS the structures in that lesson's title/vocab/context and the learner's progression (early lessons = basic A1/A2 points like to be, present simple, articles, possessives, there is/are, can, prepositions; later lessons build toward A2/B1 = past simple, present continuous, going to, comparatives, present perfect, modals, passive). DO NOT repeat the same point across lessons — vary it, anchored to each lesson's content. Shape:
{
  "point": "<rótulo do ponto em PT, ex: 'Present Simple — afirmativa, negativa e perguntas'>",
  "sources": ["Cambridge — English Grammar Today", "British Council — LearnEnglish"],
  "lead": "<intro em PORTUGUÊS, 2-3 frases, conectando o ponto ao contexto do José Mário na Microsoft/data center; pode usar <strong> e <em>>",
  "sections": [
    { "heading": "<título PT>", "body": "<explicação em PORTUGUÊS com <strong>>", "examples": [ {"en":"<frase em INGLÊS, tema data center/contrato>","gloss":"<tradução PT>"}, ... 2-3 ] },
    ... 2 a 4 sections (forma / uso / negativa-perguntas / formal-informal)
  ],
  "mistakes": [ {"wrong":"<erro comum em inglês>","right":"<forma certa>","why":"<por que, em PORTUGUÊS, com <strong>>"}, ... 2-3 ]
}

(b) If needsBonus=true → a "bonus" object. This is a leveled reading IN ENGLISH ONLY (the <body> must contain NO Portuguese — only the glossary translates). Level = the lesson's bonusLevel ("A2+" or "B1"). Theme: a real-world business / tech / US-culture reading that connects to THIS lesson's topic AND José Mário's universe (Microsoft, Azure, hyperscale data centers, the AI/cloud boom, US construction & engineering, contract & negotiation culture, corporate America). Make each bonus DISTINCT (vary the angle: company history, how a technology works, a market trend, a cultural habit, a career/soft-skill note). Shape:
{
  "category": "<short English category, e.g. 'Tech & data centers', 'Business culture', 'US market', 'Careers'>",
  "level": "<A2+ or B1 exactly as bonusLevel>",
  "readMin": <integer 2-5>,
  "title": "<English title>",
  "body": "<2 to 4 short <p> paragraphs, ENGLISH ONLY, leveled. A2+ = short simple sentences, present/past simple, common words, define jargon inline. B1 = slightly longer sentences, connectors (however, because, so that), some passive and opinion. Use <strong> for key terms.>",
  "glossary": [ {"en":"<term/phrase from the text>","pt":"<tradução PT>"}, ... 4 to 8 items ],
  "takeaway": "<one English sentence: the business or learning point>"
}

STEP 4 — Write ALL results for this batch to /tmp/jm_out_${i}.json as:
{"lessons":[ {"num":<n>, "grammar":{...} (only if generated), "bonus":{...} (only if generated)}, ... ]}
Use the Write tool to write that file. Include an entry only for lessons that got grammar and/or bonus.

QUALITY BARS:
- Bonus <body>: English only, no Portuguese, correct level, themed, factually sane, varied.
- Grammar: explanations in Portuguese, all examples in English with PT gloss, point fits the lesson, no repetition.
- Valid JSON (escape quotes; HTML allowed inside string values).

After writing the file, return the summary object.`
}

function verifyPrompt(i) {
  return `Adversarially verify and FIX the generated enrichment for batch ${i}.

Read /tmp/jm_out_${i}.json (use the Read tool). For each lesson entry check:

BONUS (if present):
- <body> must be ENGLISH ONLY — flag and rewrite any Portuguese sentence/word found in the body (the glossary is the only place PT is allowed).
- level must match the intended level (A2+ = simple; B1 = a bit richer). If the text is clearly too hard for A2+ or too trivial for B1, simplify/enrich it.
- title in English, glossary has 4-8 {en,pt} items, takeaway is one English sentence.
- factually sane, themed to Microsoft / data centers / US business, not a duplicate of a sibling lesson.

GRAMMAR (if present):
- "point", "lead", section "heading"/"body" and "why" are in PORTUGUESE; all "examples[].en" are in ENGLISH with a PT "gloss".
- the point fits the lesson and is not a copy of the previous lesson's point within this file.
- JSON well-formed; required keys present (point, sources, lead, sections, mistakes).

If you find issues, FIX them by rewriting /tmp/jm_out_${i}.json in place (Write tool) with corrected content, preserving the same structure and the "num" values. If everything is fine, leave the file as is.

Return the verify summary (issuesFound = how many lesson-entries had a problem, issuesFixed = how many you corrected).`
}

phase('Generate')
const results = await pipeline(
  Array.from({ length: COUNT }, (_, i) => i),
  (i) => agent(genPrompt(i), { label: `gen:batch-${i}`, phase: 'Generate', schema: SUMMARY_SCHEMA }),
  (genSummary, i) => agent(verifyPrompt(i), { label: `verify:batch-${i}`, phase: 'Verify', schema: VERIFY_SCHEMA })
    .then((v) => ({ batch: i, gen: genSummary, verify: v }))
)

const ok = results.filter(Boolean)
log(`Lotes concluídos: ${ok.length}/${COUNT}`)
return {
  batches: ok.length,
  totalGrammar: ok.reduce((a, r) => a + (r.gen?.grammarCount || 0), 0),
  totalBonus: ok.reduce((a, r) => a + (r.gen?.bonusCount || 0), 0),
  issuesFixed: ok.reduce((a, r) => a + (r.verify?.issuesFixed || 0), 0),
  outFiles: ok.map((r) => `/tmp/jm_out_${r.batch}.json`),
}
