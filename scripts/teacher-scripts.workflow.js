export const meta = {
  name: 'teacher-scripts',
  description: 'Para cada aula da Racional: gera 5 perguntas de lead-in + roteiro literal do professor ("lines") em cada exercício do practiceBank, no estilo do piloto Cássio L1. Escreve em /tmp/ts_<i>.json; merge separado.',
  phases: [
    { title: 'Generate', detail: 'um agente por lote: lead-in + lines por exercício' },
    { title: 'Verify', detail: 'verificador: 5 lead-in e lines concretas em todos os itens' },
  ],
}

const ROOT = '/Users/gilbertoluchetti/Alumni/cursos'
const BATCHES = '/tmp/ts_batches.json'
const COUNT = (args && args.count) || 101

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
  return `You write the Teacher's Guide SCRIPT for an executive English program at Racional Engenharia (Brazilian construction; universe: Microsoft/Google/AWS hyperscale data centers, civil engineering, contract management, US clients). The pedagogy: the STUDENT produces (speaks) most of the class; the teacher must NOT improvise — they need the literal lines to say.

STEP 1 — Read your batch spec:
Run: node -e "const b=require('${BATCHES}'); console.log(JSON.stringify(b[${i}]))"
=> {student, universe, nums:[...]}.

STEP 2 — Read the REAL lesson content INCLUDING the existing practiceBank (you must produce a script for each existing exercise, in order):
Run: node -e "const d=require('${ROOT}/courses/racional/'+process.argv[1]+'.json'); const want=new Set(JSON.parse(process.argv[2])); console.log(JSON.stringify(d.lessons.filter(l=>want.has(l.num)).map(l=>({num:l.num,title:l.title,objective:l.objective,vocab:(l.vocab||[]).map(v=>v.en).filter(Boolean),takeaways:l.takeaways||[],bank:(l.teacher.practiceBank||[]).map(b=>({format:b.format,title:b.title,how:b.how}))}))))" <student> '<nums json>'

STEP 3 — For EACH lesson produce:
  (a) "leadIn": an array of EXACTLY 5 short warm-up questions IN ENGLISH, based on the lesson theme/vocab, that get the student talking at the start of class. Real, answerable, business-relevant.
  (b) "bankLines": an array aligned BY INDEX with that lesson's bank (same length, same order). Each entry is an array of 3-6 "lines" = the LITERAL things the teacher says/does for that exercise. Follow the exercise's own format/title/how:
      - Q&A / "ping-pong" / "bombardeio" exercises → list the actual rapid-fire QUESTIONS (e.g. 7 questions).
      - Role-play with follow-up → the exact PRESSURE/follow-up questions the teacher fires; end with a PT note "(Corrija só no final.)".
      - Transformation/drill → give 3 concrete EXAMPLE SENTENCES for the student to transform aloud (show the transformation with →).
      - Pitch/recording/storytelling → the literal opening line to dictate ("Start with: …"), the target words to require, and a follow-up.
      - Each line is a concrete utterance/instruction the teacher can READ. English utterances stay in English; short stage directions can be in PT (like the pilot).
  Anchor everything to the lesson vocab and the student's universe (${'${universe}'}). Do NOT be generic.

STYLE REFERENCE (the approved pilot, Cássio L1): leadIn like "What is one big goal Racional has for the future?"; for a Q&A bombardment, lines are 7 plain questions; for a role-play, lines are the follow-up questions + "(Corrija só no final.)"; for a drill, lines are 3 "short → long" example sentences.

STEP 4 — Write to /tmp/ts_${i}.json (Write tool), EXACTLY this shape:
{"student":"<student>","lessons":[ {"num":<n>, "leadIn":["q1","q2","q3","q4","q5"], "bankLines":[ ["line","line","line"], ... one array per bank item, same order/length as bank ... ]}, ... ]}

Return {batch:${i}, lessonsDone:<n>, ok:true}.`
}

function verPrompt(i) {
  return `Audit /tmp/ts_${i}.json (Read tool). It must mirror the batch's lessons. For EACH lesson entry verify and FIX in place:
1. "leadIn" has EXACTLY 5 short English warm-up questions, on-topic for the lesson. Fix count/quality if needed.
2. "bankLines" length EQUALS that lesson's practiceBank length (re-read it: node -e "const d=require('${ROOT}/courses/racional/'+process.argv[1]+'.json');const w=new Set([<num>]);console.log(JSON.stringify(d.lessons.filter(l=>w.has(l.num)).map(l=>(l.teacher.practiceBank||[]).map(b=>({format:b.format,title:b.title})))))" <student>). If counts differ, add/trim so each bank item has one array.
3. Each lines array has 3-6 CONCRETE teacher utterances matching that exercise's format (questions for Q&A, example sentences for drills, dictated opening lines for pitches). Replace anything vague/generic.
4. Valid JSON, same shape. Preserve "num" and "student".
Rewrite /tmp/ts_${i}.json (Write tool) with corrections. Return {batch:${i}, issuesFound:<n>, issuesFixed:<n>, ok:true}.`
}

phase('Generate')
const results = await pipeline(
  Array.from({ length: COUNT }, (_, i) => i),
  (i) => agent(genPrompt(i), { label: `gen:ts-${i}`, phase: 'Generate', schema: SUMMARY }),
  (g, i) => agent(verPrompt(i), { label: `verify:ts-${i}`, phase: 'Verify', schema: VSUMMARY }),
)

const ok = results.filter(Boolean).length
log(`Lotes concluídos: ${ok}/${COUNT}. Agora rode: node scripts/ts-merge.cjs`)
return { batches: COUNT, completed: ok }
