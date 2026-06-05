export const meta = {
  name: 'practice-bank',
  description: 'Gera um banco de 12+ exercícios de prática (formatos variados) por aula para os 6 alunos da Racional (pula teóricas do Fábio), com verificador de variedade/qualidade',
  phases: [
    { title: 'Generate', detail: 'um agente por lote: 12+ atividades variadas por aula' },
    { title: 'Verify', detail: 'verificador: 12+ itens, variedade de formato, foco em produção' },
  ],
}

const BATCHES = '/tmp/pb_batches.json'
const COUNT = (args && args.count) || 132

const FORMATS = [
  'Role-play', 'Simulação de reunião', 'Information gap', 'Back-to-back', 'Transformation drill (oral)',
  'Descrição de imagem/diagrama', 'Debate / opinião + porquê', 'Gravação de 60s', 'Find someone who (mingle)',
  'Dictogloss', 'Q&A ping-pong', 'Jigsaw', 'Corrida de correção de erros (oral)', 'Ranking + justificar',
  'Storytelling / recap falado', 'Hot seat', 'Survey + report back', 'Spot the difference',
  'Reversão de papéis (aluno = cliente)', 'Vocabulário em ação', 'Cenário de resolução de problema',
  'E-mail → resposta falada', 'Advogado do diabo', 'Corrida de pronúncia (minimal pairs)', 'Just a minute (falar sem parar)',
  'Negociação cronometrada', 'Elevator pitch', 'Telefone/call sem vídeo', 'Complete a história', 'Tradução oral relâmpago',
]

const SUMMARY = {
  type: 'object', additionalProperties: false,
  required: ['batch', 'lessonsDone', 'ok'],
  properties: { batch: { type: 'integer' }, lessonsDone: { type: 'integer' }, ok: { type: 'boolean' }, notes: { type: 'string' } },
}
const VSUMMARY = {
  type: 'object', additionalProperties: false,
  required: ['batch', 'issuesFound', 'issuesFixed', 'ok'],
  properties: { batch: { type: 'integer' }, issuesFound: { type: 'integer' }, issuesFixed: { type: 'integer' }, ok: { type: 'boolean' }, notes: { type: 'string' } },
}

function genPrompt(i) {
  return `You design CLASS practice activities (Teacher's Guide) for an executive English program at Racional Engenharia (Brazilian construction; universe: Microsoft/Google/AWS hyperscale data centers, civil engineering, contract management, US clients). All activities must be COMMUNICATION/PRODUCTION-focused and practise what the student already studied in that lesson — aligned with the company's pedagogy: the student PRODUCES (speaks/writes) most of the class.

STEP 1 — Read your batch spec:
Run: node -e "const b=require('${BATCHES}'); console.log(JSON.stringify(b[${i}]))"
=> {student, universe, nums:[...]}.

STEP 2 — Read the real lesson content:
Run: node -e "const d=require('/Users/gilbertoluchetti/Alumni/cursos/courses/racional/'+process.argv[1]+'.json'); const want=new Set(JSON.parse(process.argv[2])); console.log(JSON.stringify(d.lessons.filter(l=>want.has(l.num)).map(l=>({num:l.num,type:l.type,title:l.title,objective:l.objective,situation:l.situation,vocab:(l.vocab||[]).map(v=>v.en),hasGrammar:!!l.grammar}))))" <student> '<nums json>'

STEP 3 — For EACH lesson, produce a "practiceBank": an array of AT LEAST 12 distinct class activities. Each activity:
{
  "format": "<um rótulo curto de formato, ex: 'Role-play', 'Information gap', 'Gravação de 60s'>",
  "title": "<título curto e específico da atividade, em PT, ancorado no tema da aula>",
  "how": "<2-4 frases em PT: como conduzir; o que o aluno PRODUZ; como usar o vocabulário/estrutura ESTUDADO na aula; papel do professor. Tema ligado a ${'${universe}'} e ao título da aula.>",
  "min": <inteiro 4-12, minutos sugeridos>
}

VARIETY RULES (anti-repetição):
- Use pelo menos 10 FORMATOS DIFERENTES entre as 12 atividades de uma mesma aula. Não repita o mesmo formato mais de 1-2 vezes.
- Faça os bancos de aulas vizinhas DIFERENTES entre si (varie formatos e ângulos).
- Inspire-se nesta paleta (não precisa usar só ela; crie novos): ${FORMATS.join('; ')}.
- Toda atividade é de PRODUÇÃO/comunicação (falar, negociar, descrever, debater, gravar, simular) — nada de exercício escrito passivo de múltipla escolha.
- Ancore no conteúdo da aula: use o vocab e a situação reais.

STEP 4 — Write to /tmp/pb_${i}.json (Write tool):
{"student":"<student>","lessons":[ {"num":<n>, "practiceBank":[ ...12+ atividades... ]}, ... ]}

Return {batch:${i}, lessonsDone:<n>, ok:true}.`
}

function verPrompt(i) {
  return `Audit /tmp/pb_${i}.json (Read tool). For EACH lesson entry verify:
1. practiceBank has AT LEAST 12 activities. If fewer, ADD new distinct ones to reach 12+.
2. FORMAT VARIETY: at least 10 distinct "format" values per lesson; no format repeated more than twice. If too repetitive, replace duplicates with new distinct formats.
3. PRODUCTION FOCUS: every activity makes the student speak/produce and practises the lesson's studied content. Replace any passive/written-only activity.
4. Each "how" is concrete, in Portuguese, themed to the lesson and the student's universe; "title" specific; "min" an integer 4-12.
5. Valid JSON; preserve "num" and "student".

If issues, rewrite /tmp/pb_${i}.json in place (Write tool) with the corrected content. Return {batch:${i}, issuesFound:<n>, issuesFixed:<n>, ok:true}.`
}

phase('Generate')
const results = await pipeline(
  Array.from({ length: COUNT }, (_, i) => i),
  (i) => agent(genPrompt(i), { label: `gen:pb-${i}`, phase: 'Generate', schema: SUMMARY }),
  (g, i) => agent(verPrompt(i), { label: `verify:pb-${i}`, phase: 'Verify', schema: VSUMMARY })
    .then((v) => ({ batch: i, gen: g, verify: v }))
)

const ok = results.filter(Boolean)
log(`Lotes concluídos: ${ok.length}/${COUNT}`)
return {
  batches: ok.length,
  lessonsDone: ok.reduce((a, r) => a + (r.gen?.lessonsDone || 0), 0),
  issuesFixed: ok.reduce((a, r) => a + (r.verify?.issuesFixed || 0), 0),
  files: ok.map((r) => `/tmp/pb_${r.batch}.json`),
}
