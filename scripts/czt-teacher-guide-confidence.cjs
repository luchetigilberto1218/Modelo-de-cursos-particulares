#!/usr/bin/env node
/*
  Czarnikow — Teacher Guide completo para o nível Confidence (A1), nas 9 trilhas.

  Por quê: no Confidence o guia estava praticamente vazio — `lessonFlow` em branco,
  sem `overview`, sem `pacing` e sem `extraPractice` em 160 das 180 lições (só
  Logistics tinha sido feito). O professor abria "Teacher Guide · plano da aula"
  e encontrava só três dicas genéricas. Os outros níveis (Essentials, Rise, Apex)
  têm resumo, roteiro de 90 min em 6 passos, exercícios extras e dificuldades.

  De onde vem o conteúdo: SÓ da própria lição. Cada lição do Confidence já traz,
  fora do que aparece no app, um material próprio — `grammarDeepDive.quickPractice`,
  `extendedExercises.qAndA`, `rolePlays`, `additionalAudios`, `contextualization`.
  Nada disso é exibido ao aluno, então vira prática de AULA sem repetir o app.

  Premissa pedagógica (a mesma do Essentials, ver czt-teacher-guide-hr.cjs): a aula
  é o centro e os exercícios do app o aluno faz SOZINHO — só a primeira tentativa
  pontua na campanha, por isso o roteiro não manda resolvê-los em aula.

  O que muda, por lição confidence:
    • lessonFlow  — sempre reescrito (inclui Logistics, cujo roteiro antigo mandava
                    fazer os exercícios do app junto com o aluno).
    • overview, pacing, extraPractice — preenchidos só se estiverem vazios
                    (o extraPractice escrito à mão de Logistics fica como está).
    • commonChallenges — mantém os existentes e acrescenta os erros comuns da
                    própria lição (grammarDeepDive.commonMistakes), sem duplicar.
  Nenhum outro campo é tocado. Idempotente. Aplica nas DUAS portas.

  Uso:  node scripts/czt-teacher-guide-confidence.cjs [--dry]
*/

const fs = require('fs');
const path = require('path');

const COURSES = ['czarnikow', 'czarnikow-teste'].map((c) =>
  path.join(__dirname, '..', 'courses', c, 'course.json'));
const DRY = process.argv.includes('--dry');

const TYPE_LABEL = {
  readAloud: 'Read aloud (áudio + microfone)',
  mcSet: 'múltipla escolha com correção na hora',
  wordBank: 'Word bank (banco de palavras)',
  verbFill: 'digitar a palavra certa',
  matching: 'Matching (relacionar)',
  multipleChoice: 'Múltipla escolha',
  reorder: 'Reordenar a frase',
  writing: 'Writing',
  speaking: 'Speaking',
  dictation: 'Dictation',
  fillGap: 'Fill the gap',
};
// Espelha GRADEABLE em components/czarnikow-teste/CztLesson.jsx
const GRADED = ['wordBank', 'verbFill', 'quickDrill', 'wordOrder', 'mcSet',
  'matching', 'multipleChoice', 'fillGap', 'reorder', 'writing', 'speaking', 'dictation'];

const noDot = (s) => (s || '').trim().replace(/\.$/, '');
const enTitle = (t) => (t || '').split('—')[0].trim();
const bullets = (arr) => arr.map((s) => `  • ${s}`).join('\n');

function buildOverview(l, trackName) {
  return `Aula do nível Confidence (A1, iniciante) da trilha ${trackName}. Tema: ${enTitle(l.title).replace(/[.!?]$/, '')}. ` +
    `Foco gramatical: ${l.grammar}. ${l.objective || ''} ` +
    'Plano de 90 min abaixo, com frases-modelo, perguntas prontas, role-play e exercícios extras ' +
    '(com gabarito) para o professor conduzir sem preparação extra.';
}

function buildExtraPractice(l) {
  const dd = l.grammarDeepDive || {};
  const ee = l.extendedExercises || {};
  const blocks = [];

  if (dd.quickPractice?.length) {
    blocks.push({
      title: `Exercício extra A — ${l.grammar}`,
      note: 'Faça oralmente e depois no caderno. Gabarito em verde.',
      items: dd.quickPractice.map((it) => ({ q: it.q, a: it.a })),
    });
  }

  const ex = (dd.examples || []).slice(0, 6);
  if (ex.length) {
    blocks.push({
      title: 'Exercício extra B — Diga em inglês',
      note: 'Você lê em português, o aluno diz em inglês. Faça com a tela fechada. Gabarito em verde.',
      items: ex.map((e) => ({ q: e.pt, a: e.en })),
    });
  }

  const au = (ee.additionalAudios || [])[0];
  if (au?.transcript) {
    blocks.push({
      title: `Escuta extra — ${au.title || 'texto para ler em voz alta'}`,
      note: 'Este texto não está no app. Leia em voz alta, devagar, duas vezes; depois faça as tarefas.',
      items: [{ q: `Texto: "${au.transcript}"` }, ...(au.tasks || []).map((t) => ({ q: t }))],
    });
  }

  if (ee.qAndA?.length) {
    blocks.push({
      title: 'Fale sobre você — perguntas da lição',
      note: 'Pergunte em inglês. Se o aluno travar, ofereça a resposta-modelo (em verde) e peça para adaptar.',
      items: ee.qAndA.map((q) => ({ q: q.question, a: q.sampleAnswer })),
    });
  }

  if (ee.contextualization?.length) {
    blocks.push({
      title: 'Escreva sobre você — tarefa curta',
      note: 'Pode ficar como lição de casa. Corrija na próxima aula.',
      items: ee.contextualization.map((t) => ({ q: t })),
    });
  }
  return blocks;
}

function buildFlow(l) {
  const vocab = l.vocab || [];
  const dd = l.grammarDeepDive || {};
  const ee = l.extendedExercises || {};
  const ep = l.teacherGuide.extraPractice || [];
  const qa = ee.qAndA || [];
  const basic = qa.filter((q) => q.type === 'básica').slice(0, 2);
  const warmQs = (basic.length ? basic : qa.slice(0, 2)).map((q) => `"${q.question}"`);
  const rp = (ee.rolePlays || [])[0];
  const mistake = (dd.commonMistakes || [])[0];
  const models = (dd.examples || []).slice(0, 3).map((e) => e.en);
  const exercises = l.exercises || [];
  const graded = exercises.filter((e) => GRADED.includes(e.type));
  const exList = exercises
    .map((e) => `“${(e.title || '').replace(/^\d+\.\s*/, '')}” — ${TYPE_LABEL[e.type] || e.type}`)
    .join('; ');
  const char = l.characterName ? ` com ${l.characterName}` : '';

  const warmup = [
    `OBJETIVO DE HOJE (diga em português, devagar): ${l.objective || ''}`,
    `Escreva no quadro o título da aula: "${enTitle(l.title)}".`,
    l.situation ? `Contexto da lição (conte em português): ${l.situation}` : '',
    warmQs.length
      ? `Aquecimento sem pressão — pergunte em inglês, com sorriso, aceitando respostas de uma palavra:\n${bullets(warmQs)}`
      : '',
    '💛 Regra de ouro do nível Confidence: o aluno é iniciante. Fale devagar, repita e elogie cada tentativa. Errar faz parte.',
  ].filter(Boolean).join('\n\n');

  const vocabStep = [
    'Leia a Introduction em voz alta (há áudio no botão "Listen to introduction").',
    `Depois apresente as ${vocab.length} palavras-chave. Para cada uma: você diz, o aluno repete 2x, depois você dá a tradução.\n\n${bullets(vocab.map((v) => `${v.en} = ${v.pt}`))}`,
    vocab.some((v) => v.example)
      ? `Leia estes exemplos em voz alta (o aluno repete):\n${bullets(vocab.filter((v) => v.example).slice(0, 3).map((v) => v.example))}`
      : '',
    'Cheque o entendimento perguntando "What is ___ in Portuguese?". Aceite a palavra solta: o importante é reconhecer.',
  ].filter(Boolean).join('\n\n');

  const grammarStep = [
    `Foco gramatical: ${l.grammar}.`,
    `Leia o Grammar Point na tela e desça para o Grammar Deep Dive${dd.examples?.length ? `, que traz ${dd.examples.length} exemplos` : ''}${dd.commonMistakes?.length ? ` e ${dd.commonMistakes.length} erros comuns` : ''}.`,
    models.length ? `Frases-modelo (escreva no quadro e leia junto):\n${bullets(models)}` : '',
    mistake ? `Comece pelo erro mais frequente: "${noDot(mistake.wrong)}" → "${noDot(mistake.right)}". ${mistake.note || ''}` : '',
  ].filter(Boolean).join('\n\n');

  const practiceStep = [
    'Use os exercícios extras deste guia: eles NÃO estão no app, existem para a aula. O gabarito está em verde.',
    ep.length ? bullets(ep.map((b) => b.title)) : '',
    ep[0] ? `Faça o "${ep[0].title}" primeiro oralmente e depois por escrito. Em seguida o "Diga em inglês", com o aluno sem olhar a tela.` : '',
    'Dica: se travar, dê a primeira letra ou leia a frase pausando no espaço em branco para o aluno completar.',
  ].filter(Boolean).join('\n\n');

  const production = rp ? [
    `Role-play${char}: "${rp.title}". ${rp.setup || ''}`,
    `  • Aluno: ${rp.studentA || ''}\n  • Professor: ${rp.studentB || ''}`,
    rp.sampleDialogue?.length ? `Diálogo-modelo (leia junto primeiro, depois façam sem o texto):\n${bullets(rp.sampleDialogue)}` : '',
    rp.successCriteria ? `Critério de sucesso: ${rp.successCriteria}` : '',
    rp.teacherNotes || '',
    /troc/i.test(rp.teacherNotes || '') ? '' : 'Depois troquem os papéis.',
    'Se sobrar tempo, faça o bloco "Fale sobre você" dos exercícios extras.',
  ].filter(Boolean).join('\n\n') :
    'Faça as perguntas do bloco "Fale sobre você" dos exercícios extras. Se o aluno travar, dê a resposta-modelo e peça para adaptar.';

  const closing = [
    `Leia com o aluno as ${(l.takeaways || []).length} frases de "What I can do now" em voz alta e peça UMA frase com o que aprendeu hoje.`,
    `Depois mostre a seção de exercícios: são ${exercises.length} que ele faz SOZINHO, fora da aula — ${exList}.`,
    graded.length
      ? `Concluir os ${graded.length} exercícios que corrigem acende a lição na trilha e conta pontos na campanha. Por isso não resolva esses exercícios na aula: só a primeira tentativa pontua, e o mérito é do aluno.`
      : '',
    l.wrapup ? `Mensagem final para o aluno: ${l.wrapup}` : '',
    ep.some((b) => b.title.startsWith('Escreva sobre você'))
      ? 'Lição de casa opcional: o bloco "Escreva sobre você" dos exercícios extras.' : '',
  ].filter(Boolean).join('\n\n');

  return [
    { step: 1, duration: '10 min', what: 'Aquecimento e objetivo do dia', instructions: warmup },
    { step: 2, duration: '15 min', what: 'Introdução + vocabulário', instructions: vocabStep },
    { step: 3, duration: '15 min', what: `Gramática — ${l.grammar}`, instructions: grammarStep },
    { step: 4, duration: '20 min', what: 'Prática guiada — exercícios extras', instructions: practiceStep },
    { step: 5, duration: '20 min', what: 'Produção oral — role-play', instructions: production },
    { step: 6, duration: '10 min', what: 'Fechamento e encaminhamento do material', instructions: closing },
  ];
}

function enrichChallenges(l) {
  const cur = l.teacherGuide.commonChallenges || [];
  const add = (l.grammarDeepDive?.commonMistakes || []).slice(0, 3)
    .map((m) => `Erro comum: "${noDot(m.wrong)}" → "${noDot(m.right)}". ${m.note || ''}`.trim())
    .filter((s) => !cur.includes(s));
  return [...cur, ...add];
}

for (const file of COURSES) {
  const course = JSON.parse(fs.readFileSync(file, 'utf8'));
  const trackName = Object.fromEntries((course.tracks || []).map((t) => [t.id, t.name]));
  const alvo = course.lessons.filter((l) => l.level === 'confidence');
  if (alvo.length !== 180) {
    console.error(`ABORTADO (${file}): esperava 180 lições confidence, achei ${alvo.length}.`);
    process.exit(1);
  }
  for (const l of alvo) {
    const g = (l.teacherGuide = l.teacherGuide || {});
    if (!g.overview) g.overview = buildOverview(l, trackName[l.track] || l.track);
    if (!g.pacing) g.pacing = g.duration || '90 minutes';
    if (!g.extraPractice?.length) g.extraPractice = buildExtraPractice(l);
    g.commonChallenges = enrichChallenges(l);
    g.lessonFlow = buildFlow(l);
  }
  if (DRY) {
    const a = alvo.find((l) => l.num === 1001);
    console.log(JSON.stringify(a.teacherGuide, null, 2));
    console.log(`\n(dry — ${alvo.length} lições em ${path.basename(path.dirname(file))}, nada salvo)`);
    break;
  }
  fs.writeFileSync(file, JSON.stringify(course));
  console.log(`OK — ${alvo.length} lições confidence em ${path.basename(path.dirname(file))}.`);
}
