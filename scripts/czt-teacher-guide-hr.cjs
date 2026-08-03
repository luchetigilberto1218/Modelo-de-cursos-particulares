#!/usr/bin/env node
/*
  Czarnikow (ambiente de teste) — reescreve o roteiro do Teacher Guide da trilha
  essentials/hr para a lição INTERATIVA.

  Por quê: as 20 lições de essentials/hr foram convertidas para o formato com
  exercícios auto-corrigidos (CztLesson), mas o `teacherGuide.lessonFlow` ainda
  descrevia a lição antiga — mandava o professor tocar "Audio A", rodar o role
  play, fazer o Q&A e o "Make It Your Own", coisas que não existem mais na tela.
  O professor abriria o guia e não acharia nada daquilo.

  O que muda: SÓ o `lessonFlow`. `overview`, `pacing`, `commonChallenges` e
  `extraPractice` ficam intactos — continuam corretos e são justamente o que
  sustenta a prática guiada da aula.

  Premissa pedagógica (a mesma da campanha): a AULA é o centro, o material do app
  é reforço que o aluno faz SOZINHO. Por isso o roteiro apoia a prática de aula
  nos exercícios extras deste guia — que não estão no app — e no fechamento
  encaminha os 3 exercícios do app como tarefa individual, avisando que a
  primeira tentativa é a que pontua na campanha (então não se resolve em aula).

  Uso:  node scripts/czt-teacher-guide-hr.cjs [--dry]
*/

const fs = require('fs');
const path = require('path');

const COURSE = path.join(__dirname, '..', 'courses', 'czarnikow-teste', 'course.json');
const DRY = process.argv.includes('--dry');

/* Aquecimento e produção são os dois momentos em que o professor precisa de algo
   específico DAQUELA lição — o resto do roteiro se apoia no conteúdo real da
   página. Escritos à mão, um por lição, indexados por trackOrder. */
const BESPOKE = {
  1: {
    warmup: 'Pergunte: "What does HR do at Czarnikow? Which HR decision helped the business this year?" Deixe o aluno falar sem interromper — anote dois erros para retomar no fechamento.',
    production: 'Peça 5 frases descrevendo a área de RH da Czarnikow com am / is / are ("I am…", "HR is…", "Our people are…"). O aluno grava no celular e ouve de volta antes de você comentar.',
  },
  2: {
    warmup: 'Pergunte: "Who does what in your team? Name three roles and one responsibility for each." Se travar, comece você descrevendo um cargo.',
    production: 'Peça a descrição do próprio dia de trabalho em 5 frases no presente, com pelo menos três verbos na 3ª pessoa (he/she/it + s). Cobre o -s com firmeza aqui.',
  },
  3: {
    warmup: 'Pergunte: "Which number does your team look at every month?" Escreva o número no papel e peça para o aluno lê-lo em inglês.',
    production: 'Peça a apresentação de três números do time do aluno, cada frase começando por There is / There are. Depois inverta: você diz o número, o aluno monta a frase.',
  },
  4: {
    warmup: 'Pergunte: "How does a performance review work here? What is the hardest question to answer?" Não corrija ainda — você quer o vocabulário espontâneo.',
    production: 'Role play: o aluno conduz uma avaliação e faz 5 perguntas com Do / Does; você responde como colaborador. Depois troquem os papéis.',
  },
  5: {
    warmup: 'Pergunte: "Who is your team hiring right now? What is the position?" Use a resposta para introduzir o Present Continuous naturalmente.',
    production: 'Peça 5 frases sobre o que está acontecendo AGORA no recrutamento da Czarnikow (am/is/are + verb-ing). Insista no verbo auxiliar, que é o que some.',
  },
  6: {
    warmup: 'Pergunte: "What is the first question you ask a candidate?" Anote a pergunta em inglês no papel e mostre a estrutura Wh-.',
    production: 'Role play de entrevista: 6 perguntas Wh- do aluno, você como candidato. Depois inverta — o aluno responde às mesmas perguntas sobre si.',
  },
  7: {
    warmup: 'Pergunte: "Why do people want to work at Czarnikow? Give me three reasons." Guarde os adjetivos que aparecerem para comparar com os da lição.',
    production: 'Peça a descrição da Czarnikow para um candidato em 5 frases com adjetivos. Corrija a ordem (a great international company, não a company great).',
  },
  8: {
    warmup: 'Pergunte: "What happens on a new colleague\'s first day at Czarnikow?" Peça a sequência em ordem — é o mesmo raciocínio do exercício de ordenar no app.',
    production: 'O aluno dá a VOCÊ as instruções do primeiro dia de um novo colaborador: 6 ordens no imperativo. Finja seguir ao pé da letra; instrução vaga vira erro visível.',
  },
  9: {
    warmup: 'Pergunte: "What can you do today that you could not do two years ago?" Serve de aquecimento e de termômetro de autoconfiança.',
    production: 'Peça 5 frases com can sobre habilidades no trabalho e 2 com cannot sobre o que ainda não consegue — e o que a Czarnikow poderia treinar.',
  },
  10: {
    warmup: 'Pergunte: "Think of a good leader you know. What does this person do differently?" Deixe o aluno falar em português se travar, e traduza junto.',
    production: 'Peça 5 conselhos a um líder recém-promovido usando should / should not. Cobre a ausência de "to" depois de should.',
  },
  11: {
    warmup: 'Pergunte: "Where do you want to be in three years?" Anote a resposta — ela vira o material da produção e do exercício do app.',
    production: 'Peça os planos de carreira dos próximos 12 meses em 5 frases com going to. É o mesmo tema do exercício "Fale sobre a sua carreira" do app: aqui é oral, lá o aluno escreve.',
  },
  12: {
    warmup: 'Pergunte: "When was the last time you received good feedback? What made it good?" O contraste bom/ruim já traz os advérbios.',
    production: 'Peça a descrição de como três colegas trabalham, usando advérbios de modo (carefully, quickly, politely). Depois peça um feedback real, em inglês, para um deles.',
  },
  13: {
    warmup: 'Pergunte: "What do you like most about your work week?" Uma pergunta leve — a lição inteira sai daí.',
    production: 'Peça 6 frases com like / don\'t like + verbo-ing sobre o trabalho. É o tema do exercício "Fale sobre você" do app: aqui oral, lá por escrito.',
  },
  14: {
    warmup: 'Pergunte: "Which Czarnikow value do you see in practice every day?" Se o aluno citar um valor oficial, peça um exemplo concreto.',
    production: 'Peça 5 frases descrevendo a cultura da Czarnikow com has got / have got. Aceite também a forma com have simples, mas mostre a diferença de registro.',
  },
  15: {
    warmup: 'Pergunte: "What makes a team welcoming for everyone?" Conduza com cuidado: o tema é sensível e o objetivo é vocabulário respeitoso.',
    production: 'Peça 5 frases sobre o time do aluno com everyone e nobody, sempre com o verbo no singular. Esse singular é o erro clássico — cobre em todas.',
  },
  16: {
    warmup: 'Pergunte: "How does news travel at Czarnikow — by email, in a meeting or on a call?" A própria resposta já usa as preposições da lição.',
    production: 'Peça a explicação, em 5 frases, do caminho que uma notícia faz até chegar ao time — by email, in a meeting, on a call, in person.',
  },
  17: {
    warmup: 'Pergunte: "Which rule at work is impossible to break?" Ouça o exemplo e devolva em inglês com must.',
    production: 'Peça 5 regras do trabalho na Czarnikow com must / must not. Explique que must not é proibição, não ausência de obrigação.',
  },
  18: {
    warmup: 'Pergunte: "Which benefit matters most to people in your team?" Trate números com naturalidade — o foco é a pergunta, não o valor.',
    production: 'O aluno faz 6 perguntas sobre salário e benefícios com How much / How many; você responde como RH. Depois inverta.',
  },
  19: {
    warmup: 'Pergunte: "Think of a small disagreement at work. How did it end?" Um caso pequeno e real vale mais que um exemplo de livro.',
    production: 'Cenário: um colega perdeu um prazo e o time está tenso. Peça 5 sugestões com Let\'s / Why don\'t we para resolver sem escalar o conflito.',
  },
  20: {
    warmup: 'Pergunte: "How many days do you work from home? What works better at home, and what works better at the office?"',
    production: 'Peça a descrição da semana híbrida do aluno em 5 frases com preposições de lugar — at home, at the office, from São Paulo, on a call.',
  },
};

/* Rótulo humano de cada tipo de exercício do app, para o roteiro citar a tela
   pelo mesmo nome que o aluno vê. */
const TYPE_LABEL = {
  readAloud: 'Read aloud (áudio + microfone)',
  wordBank: 'Word bank (banco de palavras)',
  verbFill: 'Verb fill (digitar a forma certa)',
  quickDrill: 'Quick drill',
  matching: 'Matching (relacionar)',
  multipleChoice: 'Múltipla escolha',
  reorder: 'Reordenar a frase',
  makeItYourOwn: 'Make it your own (produção livre, sem correção automática)',
  writing: 'Writing',
  speaking: 'Speaking',
  dictation: 'Dictation',
  fillGap: 'Fill the gap',
};
// Os tipos que fecham a lição e valem ponto — espelha GRADEABLE em CztLesson.jsx
const GRADED = ['wordBank', 'verbFill', 'quickDrill', 'matching', 'multipleChoice', 'fillGap', 'reorder', 'writing', 'speaking', 'dictation'];

/** Tira o ponto final — as frases entram dentro de aspas no meio do roteiro. */
function noDot(s) { return (s || '').trim().replace(/\.$/, ''); }

function buildFlow(l) {
  const b = BESPOKE[l.trackOrder];
  if (!b) throw new Error(`sem texto próprio para a lição ${l.trackOrder}`);

  const vocab = l.vocab || [];
  const sample = vocab.slice(0, 3).map((v) => v.en).filter(Boolean);
  const dd = l.grammarDeepDive || {};
  const mistake = (dd.commonMistakes || [])[0];
  const ep = l.teacherGuide?.extraPractice || [];
  const exercises = l.exercises || [];
  const graded = exercises.filter((e) => GRADED.includes(e.type));
  const exList = exercises
    .map((e) => `“${(e.title || '').replace(/^\d+\.\s*/, '')}” — ${TYPE_LABEL[e.type] || e.type}`)
    .join('; ');

  const grammarStep = [
    `Foco da lição: ${l.grammar}. Leia o Grammar Point na tela e desça para o Grammar Deep Dive`,
    dd.examples?.length ? `, que traz ${dd.examples.length} exemplos` : '',
    dd.commonMistakes?.length ? ` e ${dd.commonMistakes.length} erros comuns` : '',
    '.',
    mistake ? ` Comece pelo mais frequente: "${noDot(mistake.wrong)}" → "${noDot(mistake.right)}".` : '',
  ].join('');

  const practiceStep = [
    'Use os exercícios extras deste guia — eles NÃO estão no app, existem para a aula.',
    ep[0] ? ` Faça o "${ep[0].title.replace(/\s*\(hr\)\s*$/, '')}" primeiro oralmente e depois por escrito.` : '',
    ep[1] ? ` Em seguida o "${ep[1].title}".` : '',
    ep[2] ? ' Se sobrar tempo, o bloco de vocabulary building traz palavras além das da aula.' : '',
    ' O gabarito de cada item está em verde, ao lado.',
  ].join('');

  const closingStep = [
    `Leia com o aluno as ${(l.takeaways || []).length} frases de "What I can do now" em voz alta.`,
    ` Depois mostre a seção Practice: são ${exercises.length} exercícios que ele faz SOZINHO, fora da aula — ${exList}.`,
    graded.length
      ? ` Concluir ${graded.length === 1 ? 'o exercício que corrige' : `os ${graded.length} exercícios que corrigem`} acende a lição na trilha e conta pontos na campanha.`
      : ' Eles são de prática livre e não têm correção automática.',
    graded.length
      ? ' Por isso não resolva esses exercícios na aula: só a primeira tentativa pontua, e o mérito é do aluno.'
      : '',
  ].join('');

  return [
    { step: 1, duration: '5 min', what: 'Aquecimento', instructions: b.warmup },
    {
      step: 2,
      duration: '15 min',
      what: 'Introdução + vocabulário',
      instructions: `Leia a Introduction em voz alta (há áudio no botão "Listen to introduction") e passe pelas ${vocab.length} palavras da seção Vocabulary — cada uma tem áudio próprio. O aluno repete e usa cada palavra numa frase sobre a Czarnikow.${sample.length ? ` Se o tempo apertar, priorize: ${sample.join(', ')}.` : ''}`,
    },
    { step: 3, duration: '20 min', what: 'Gramática', instructions: grammarStep },
    { step: 4, duration: '25 min', what: 'Prática guiada', instructions: practiceStep },
    {
      step: 5,
      duration: '15 min',
      what: 'Produção oral',
      instructions: `${b.production} O bloco "Fale sobre você" dos exercícios extras serve de roteiro se o aluno travar.`,
    },
    { step: 6, duration: '10 min', what: 'Fechamento e encaminhamento do material', instructions: closingStep },
  ];
}

/* ── execução ──────────────────────────────────────────────────────────────── */
const course = JSON.parse(fs.readFileSync(COURSE, 'utf8'));
const alvo = course.lessons.filter((l) => l.level === 'essentials' && l.track === 'hr');

if (alvo.length !== 20) {
  console.error(`ABORTADO: esperava 20 lições em essentials/hr, achei ${alvo.length}.`);
  process.exit(1);
}

for (const l of alvo) {
  if (!l.teacherGuide) throw new Error(`lição ${l.num} sem teacherGuide`);
  l.teacherGuide.lessonFlow = buildFlow(l);
  l.teacherGuide.pacing = l.teacherGuide.pacing || '90 minutes';
}

if (DRY) {
  const amostra = alvo.find((l) => l.trackOrder === 1);
  console.log(JSON.stringify(amostra.teacherGuide.lessonFlow, null, 2));
  console.log(`\n(dry run — ${alvo.length} lições seriam reescritas, nada foi salvo)`);
} else {
  fs.writeFileSync(COURSE, JSON.stringify(course));
  console.log(`OK — lessonFlow reescrito em ${alvo.length} lições de essentials/hr.`);
}
