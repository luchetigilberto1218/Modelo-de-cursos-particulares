#!/usr/bin/env node
/*
  Czarnikow — bateria de exercícios INTERATIVOS sobre o assunto da lição.

  O problema que isto resolve: as 720 lições têm exatamente 3 exercícios
  (pronúncia + gramática + glossário) e NENHUM sobre o conteúdo da aula. As
  perguntas de compreensão existiam em `extendedExercises.qAndA`, mas são
  abertas — o aluno responde com as próprias palavras e nada corrige.

  A regra do formato novo (decisão do usuário, 13/08/2026):
    · sempre interativo — ler/ouvir → escolher → corrigir na hora
    · ~10 itens por bloco
    · compreensão de LEITURA e de ÁUDIO, com perguntas de inferência
    · vocabulário em CONTEXTO (não definição solta)
    · expressões e phrasal verbs

  Tudo entra como blocos `mcSet` DEPOIS dos 3 exercícios que já existem: nada é
  removido nem reescrito. Quem já concluiu a lição continua concluído — o que
  muda é que passam a existir mais exercícios avaliáveis nela.

  Uso:
    node scripts/czt-exercicios-interativos.cjs --report      (não escreve nada)
    node scripts/czt-exercicios-interativos.cjs --apply
*/

const fs = require('fs');
const path = require('path');

const COURSES = ['czarnikow', 'czarnikow-teste'].map(
  (c) => path.join(__dirname, '..', 'courses', c, 'course.json')
);
const APPLY = process.argv.includes('--apply');

/* ── Piloto: lição 42 · Apex · HR — Designing Adaptive Organisational Structures
   Escrito a partir do texto da própria lição (intro, situation, vocab), não de
   template. O áudio é inédito: uma fala do James, o personagem da lição. ───── */

const AUDIO_42 = `Right — before we look at any boxes and lines, I want the leadership to answer one question: what must this business be radically better at in three years' time? Not what is broken today. Three years.<br><br>This is the third reorganisation in four years, and every one of them started with a chart. Having watched two of them from the outside, I would say the pattern is fairly clear. Authority was redrawn, but incentives were never touched, and the information the regional teams needed still sat in London. So decisions kept drifting upwards.<br><br>If we go again without agreeing the hypothesis first, we will simply reshuffle the same constraint. My recommendation is that we hold off on the structure for a fortnight. Spend that time writing down the two or three capabilities that will decide whether we win — then design backwards from those.<br><br>And whatever we land on, we live with it for five years. Every reorganisation costs you institutional memory, and this business has spent a great deal of it already.`;

const PILOTO = {
  42: [
    {
      type: 'mcSet',
      skill: 'reading',
      title: '4. Reading comprehension',
      instruction: 'Leia o texto e escolha a alternativa correta. Algumas perguntas pedem inferência — a resposta não está escrita com todas as letras.',
      passage: `Organisational design is one of the most underestimated disciplines in modern management. Most companies overhaul their structure every few years, rarely acknowledging that a new org chart alone changes very little. Structure is only one lever among several: authority, information flows, accountability, incentives and culture must all move together, or not at all.<br><br>Adaptive structures aim to balance two opposing pressures. On one side, the need for integration — alignment, scale, shared systems. On the other, the need for local responsiveness — speed, context, empowerment. Managed well, this tension is productive; managed poorly, it produces matrices where nothing gets decided.<br><br>The best structural decisions are made with a clear hypothesis about what the company must get radically better at in the next three to five years. Structure follows that hypothesis — not the other way around. Designing for yesterday's challenges is how companies end up reorganising every eighteen months, exhausting their leaders and losing institutional memory in the process.`,
      items: [
        {
          q: 'According to the text, what does a new org chart achieve on its own?',
          options: ['Very little', 'Faster decisions', 'Greater accountability', 'Stronger culture'],
          answer: 0,
          why: '"a new org chart alone changes very little" — o gráfico sozinho é apenas um dos vários fatores.',
        },
        {
          q: 'Which of these is NOT listed as a lever that must move together with structure?',
          options: ['Incentives', 'Information flows', 'Remuneration bands', 'Culture'],
          answer: 2,
          why: 'O texto lista authority, information flows, accountability, incentives e culture. "Remuneration bands" não aparece.',
        },
        {
          q: 'Which two pressures must an adaptive structure balance?',
          options: [
            'Cost control and revenue growth',
            'Integration and local responsiveness',
            'Innovation and compliance',
            'Centralisation and outsourcing',
          ],
          answer: 1,
          why: '"balance two opposing pressures… integration… local responsiveness".',
        },
        {
          q: 'What is the consequence of managing that tension poorly?',
          options: [
            'Costs rise sharply',
            'Teams become too independent',
            'Matrices in which nothing gets decided',
            'The company loses market share',
          ],
          answer: 2,
          why: '"managed poorly, it produces matrices where nothing gets decided".',
        },
        {
          q: 'According to the text, structure should follow…',
          options: [
            'the preferences of the leadership team',
            'a clear hypothesis about what the company must get better at',
            'the structure used by competitors',
            'the current reporting lines',
          ],
          answer: 1,
          why: '"Structure follows that hypothesis — not the other way around."',
        },
        {
          q: 'What two costs does the text attach to reorganising every eighteen months?',
          options: [
            'Exhausted leaders and lost institutional memory',
            'Higher salaries and lower margins',
            'Slower hiring and weaker branding',
            'Reduced scale and higher taxes',
          ],
          answer: 0,
          why: '"exhausting their leaders and losing institutional memory in the process".',
        },
        {
          q: 'Calling org design "underestimated" implies that managers…',
          options: [
            'treat it as less consequential than it really is',
            'spend too much money on consultants',
            'change structures too rarely',
            'understand it better than they admit',
          ],
          answer: 0,
          why: 'Inferência: "underestimated" = subestimado — dão a ela menos peso do que ela merece.',
        },
        {
          q: 'Which statement would the author most likely DISAGREE with?',
          options: [
            'Structure should be designed backwards from strategy.',
            'Redrawing the org chart is the fastest way to change behaviour.',
            'Frequent restructuring carries a hidden cost.',
            'Empowerment and alignment pull in different directions.',
          ],
          answer: 1,
          why: 'Inferência: o texto inteiro é um argumento contra a ideia de que o organograma, sozinho, muda comportamento.',
        },
        {
          q: 'A leadership team is about to start a reorganisation. What would the author advise first?',
          options: [
            'Benchmark the structure against three competitors',
            'Reduce the number of management layers',
            'Articulate what the company must be radically better at',
            'Bring in an external consultancy',
          ],
          answer: 2,
          why: 'Inferência: a hipótese vem primeiro, e só então a estrutura segue.',
        },
        {
          q: 'What does "or not at all" at the end of the first paragraph suggest?',
          options: [
            'Some levers matter more than others',
            'Moving only part of the system is worse than moving nothing',
            'Structure should never be changed',
            'Culture is the only lever that counts',
          ],
          answer: 1,
          why: 'Inferência: os fatores movem-se juntos — mexer só em alguns é meia-mudança, que não entrega o resultado.',
        },
      ],
    },
    {
      type: 'mcSet',
      skill: 'listening',
      title: '5. Listening comprehension',
      instruction: 'Ouça James aconselhando a liderança da unidade. Responda sem ler a transcrição — ela só aparece depois de corrigir.',
      audio: { text: AUDIO_42, label: 'Ouça quantas vezes precisar. A transcrição aparece depois de corrigir.', rate: 0.92 },
      items: [
        {
          q: 'What does James want the leadership to answer BEFORE looking at the structure?',
          options: [
            'What is broken in the business today',
            'What the business must be radically better at in three years',
            'How many layers the structure should have',
            'Which competitors have reorganised recently',
          ],
          answer: 1,
          why: '"what must this business be radically better at in three years\' time? Not what is broken today."',
        },
        {
          q: 'How many reorganisations has this unit been through?',
          options: ['Two in three years', 'Three in four years', 'Four in five years', 'Three in eighteen months'],
          answer: 1,
          why: '"This is the third reorganisation in four years."',
        },
        {
          q: 'According to James, what was changed in the past reorganisations — and what was not?',
          options: [
            'Incentives were changed; authority was not',
            'Authority was redrawn; incentives were never touched',
            'Culture was changed; systems were not',
            'Headcount was cut; authority was not',
          ],
          answer: 1,
          why: '"Authority was redrawn, but incentives were never touched."',
        },
        {
          q: 'Why did decisions keep drifting upwards?',
          options: [
            'The regional teams lacked the information they needed',
            'The regional heads were inexperienced',
            'London insisted on approving everything',
            'The matrix had too many layers',
          ],
          answer: 0,
          why: '"the information the regional teams needed still sat in London. So decisions kept drifting upwards."',
        },
        {
          q: 'What does James recommend they do for a fortnight?',
          options: [
            'Interview every regional head',
            'Pause the structure and write down the deciding capabilities',
            'Run a pilot in one region',
            'Draft three alternative org charts',
          ],
          answer: 1,
          why: '"hold off on the structure for a fortnight… writing down the two or three capabilities that will decide whether we win".',
        },
        {
          q: 'How long does James want the new structure to last?',
          options: ['Eighteen months', 'Three years', 'Five years', 'Until the next merger'],
          answer: 2,
          why: '"whatever we land on, we live with it for five years."',
        },
        {
          q: 'What cost does James attach to repeated reorganisation?',
          options: ['Legal exposure', 'Loss of institutional memory', 'Higher consultancy fees', 'Falling market share'],
          answer: 1,
          why: '"Every reorganisation costs you institutional memory."',
        },
        {
          q: 'What does James mean by "we will simply reshuffle the same constraint"?',
          options: [
            'The new structure will hit the same limitation as the old one',
            'The same people will be moved between roles',
            'The budget will not change',
            'The reorganisation will take longer than planned',
          ],
          answer: 0,
          why: 'Inferência: sem tratar a causa (informação e incentivos), a nova estrutura reproduz o mesmo gargalo.',
        },
        {
          q: 'How would you best describe James\'s tone?',
          options: [
            'Enthusiastic about the new structure',
            'Neutral and purely factual',
            'Constructive, but sceptical about repeating the pattern',
            'Dismissive of the leadership team',
          ],
          answer: 2,
          why: 'Inferência: ele critica o padrão, mas propõe um caminho concreto — não descarta a liderança.',
        },
        {
          q: 'What would James consider a successful outcome of the fortnight?',
          options: [
            'A new org chart approved by the board',
            'An agreed, written hypothesis before any boxes and lines',
            'A decision to cancel the reorganisation',
            'A list of roles to be made redundant',
          ],
          answer: 1,
          why: 'Inferência: ele quer a hipótese acordada e escrita primeiro; a estrutura é desenhada a partir dela.',
        },
      ],
    },
    {
      type: 'mcSet',
      skill: 'vocabulary',
      title: '6. Vocabulary in context',
      instruction: 'O vocabulário da lição aparece aqui em frases novas. Escolha o sentido ou a palavra que cabe no contexto.',
      items: [
        {
          q: '"Structure is only one lever among several." A **lever** is…',
          options: [
            'a means of producing an effect',
            'a formal reporting line',
            'a written policy',
            'a senior decision-maker',
          ],
          answer: 0,
          why: 'Lever = alavanca: aquilo em que você age para produzir um efeito.',
        },
        {
          q: '"Her **span of control** widened from six to fourteen." This refers to…',
          options: [
            'the size of her budget',
            'the number of people reporting directly to her',
            'the regions she is responsible for',
            'the length of her contract',
          ],
          answer: 1,
          why: 'Span of control = amplitude de controle: quantos reportam diretamente.',
        },
        {
          q: 'The board decided to **overhaul** the reporting lines. To overhaul means to…',
          options: ['review briefly', 'reform them deeply', 'document them', 'defend them'],
          answer: 1,
          why: 'To overhaul = reformular profundamente — não é um ajuste pequeno.',
        },
        {
          q: 'Choose the correct word: "Empowerment without clear ___ creates confusion, not agility."',
          options: ['accountability', 'integration', 'responsiveness', 'hierarchy'],
          answer: 0,
          why: 'Accountability = responsabilização: quem responde pelo resultado.',
        },
        {
          q: 'Choose the correct term: "The ___ between London and São Paulo broke down, so the desk priced on stale data."',
          options: ['span of control', 'information flow', 'org design', 'matrix'],
          answer: 1,
          why: 'Information flow = fluxo de informação, o que falhou entre os dois escritórios.',
        },
        {
          q: 'In a **matrix** organisation, a manager typically…',
          options: [
            'reports to two lines at once',
            'has no direct reports',
            'works only on projects',
            'reports directly to the CEO',
          ],
          answer: 0,
          why: 'Matriz = dupla linha de reporte (funcional e de negócio).',
        },
        {
          q: '**Institutional memory** is best described as…',
          options: [
            'the archive of company documents',
            'what the organisation retains about why things were done',
            'the length of service of the leadership team',
            'the company\'s brand reputation',
          ],
          answer: 1,
          why: 'É o conhecimento acumulado sobre as razões das decisões — o que se perde a cada reorganização.',
        },
        {
          q: 'Choose the correct verb: "We need to ___ the regional heads to sign off deals under two million."',
          options: ['empower', 'escalate', 'overhaul', 'integrate'],
          answer: 0,
          why: 'To empower = empoderar, dar autoridade para decidir.',
        },
        {
          q: 'Which pair of benefits sits on the **integration** side of the trade-off?',
          options: [
            'Speed and local context',
            'Scale and shared systems',
            'Empowerment and autonomy',
            'Flexibility and experimentation',
          ],
          answer: 1,
          why: 'Integração traz alinhamento, escala e sistemas compartilhados; velocidade e contexto ficam do lado da responsividade.',
        },
        {
          q: '**Org design** covers…',
          options: [
            'the chart alone',
            'the chart plus authority, information flows and incentives',
            'the office layout',
            'the recruitment process',
          ],
          answer: 1,
          why: 'É a tese central da lição: o organograma é só um dos elementos do desenho.',
        },
      ],
    },
    {
      type: 'mcSet',
      skill: 'expressions',
      title: '7. Expressions & phrasal verbs',
      instruction: 'Expressões que aparecem em reuniões de reestruturação. Escolha o sentido no contexto.',
      items: [
        {
          q: '"The CFO still has to **sign off on** the new structure." To sign off on means to…',
          options: ['formally approve', 'comment informally', 'postpone', 'announce publicly'],
          answer: 0,
          why: 'Sign off on = aprovar formalmente, dar o aval final.',
        },
        {
          q: '"We will **roll out** the new model region by region." To roll out means to…',
          options: ['cancel gradually', 'implement in stages', 'test in secret', 'explain to the board'],
          answer: 1,
          why: 'Roll out = implementar de forma progressiva.',
        },
        {
          q: '"Two regional heads **pushed back on** the proposal." They…',
          options: ['approved it quickly', 'resisted or disagreed with it', 'delayed reading it', 'rewrote it themselves'],
          answer: 1,
          why: 'Push back on = resistir, discordar — sem necessariamente rejeitar de vez.',
        },
        {
          q: '"There are a few details to **iron out** before Friday." To iron out means to…',
          options: ['resolve small problems', 'write down formally', 'escalate to the board', 'postpone indefinitely'],
          answer: 0,
          why: 'Iron out = aparar arestas, resolver pontos menores.',
        },
        {
          q: '"He will **hand over** the desk in March." To hand over means to…',
          options: ['close down', 'transfer responsibility', 'audit', 'restructure'],
          answer: 1,
          why: 'Hand over = passar a responsabilidade a outra pessoa.',
        },
        {
          q: '"Given the margin pressure, we had to **scale back** the programme." To scale back means to…',
          options: ['expand carefully', 'reduce its size or scope', 'move it to another region', 'accelerate it'],
          answer: 1,
          why: 'Scale back = reduzir escopo ou tamanho.',
        },
        {
          q: '"The team agreed the plan but never **followed through**." They…',
          options: [
            'failed to carry it to completion',
            'changed the plan halfway',
            'delegated it to another team',
            'documented it poorly',
          ],
          answer: 0,
          why: 'Follow through = levar até o fim o que foi combinado.',
        },
        {
          q: '"Give the new structure six months to **bed in**." To bed in means to…',
          options: ['be reviewed by auditors', 'settle and start working properly', 'be replaced', 'be communicated'],
          answer: 1,
          why: 'Bed in (BrE) = assentar, começar a funcionar como esperado.',
        },
        {
          q: '"The review was **carried out** by an external team." To carry out means to…',
          options: ['commission', 'perform or execute', 'delay', 'summarise'],
          answer: 1,
          why: 'Carry out = executar, realizar.',
        },
        {
          q: '"None of that will **move the needle** on decision speed." This means it will…',
          options: [
            'not make a noticeable difference',
            'create resistance',
            'take too long to measure',
            'cost more than expected',
          ],
          answer: 0,
          why: 'Move the needle = mexer o ponteiro, fazer diferença perceptível.',
        },
      ],
    },
  ],
};

/* ── aplicação ─────────────────────────────────────────────────────────────── */

/* `**termo**` no enunciado vira negrito de verdade. O McSet renderiza `q` como
   HTML justamente para destacar a palavra em foco no exercício de vocabulário. */
const negrito = (s) => (s || '').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
for (const blocos of Object.values(PILOTO)) {
  for (const b of blocos) b.items.forEach((it) => { it.q = negrito(it.q); });
}

/* 5 perguntas em TODOS os blocos novos (decisão do usuário, 13/08/2026: 10 era
   muito). A escolha não é "as cinco primeiras" — em compreensão ficam as que
   cobrem a tese da lição, com pelo menos duas de inferência; em vocabulário,
   uma mistura de sentido e lacuna; em expressões, as de maior frequência real
   numa reunião. Os índices ficam explícitos para a seleção ser auditável. */
const CORTE = {
  reading: [0, 2, 4, 7, 9],
  listening: [0, 2, 3, 7, 8],
  vocabulary: [0, 3, 4, 6, 9],
  expressions: [0, 1, 2, 6, 9],
};
for (const blocos of Object.values(PILOTO)) {
  for (const b of blocos) {
    const manter = CORTE[b.skill];
    if (manter) b.items = manter.map((i) => b.items[i]);
  }
}

/* Ordem dos exercícios na lição. A gramática estava caindo no MEIO dos blocos
   de compreensão; agora ela fecha a bateria, encostada na seção "Grammar Point"
   que vem logo abaixo na página. O resto segue a progressão natural: pronúncia →
   entender → reconhecer vocabulário → usar vocabulário → expressões → gramática. */
const ORDEM = (ex) => {
  if (ex.type === 'readAloud') return 1;
  if (ex.type === 'mcSet' && ex.skill === 'reading') return 2;
  if (ex.type === 'mcSet' && ex.skill === 'listening') return 3;
  if (ex.type === 'matching') return 4;
  if (ex.type === 'mcSet' && ex.skill === 'vocabulary') return 5;
  if (ex.type === 'mcSet' && ex.skill === 'expressions') return 6;
  return 7;   // verbFill, wordBank, wordOrder, quickDrill — tudo que é gramática
};

/** Renumera o "1." / "2." do título para bater com a nova posição. */
const renumera = (ex, i) => {
  ex.title = (ex.title || '').replace(/^\s*\d+\.\s*/, '');
  ex.title = `${i + 1}. ${ex.title}`;
  return ex;
};

let resumo = [];

for (const file of COURSES) {
  const course = JSON.parse(fs.readFileSync(file, 'utf8'));
  let tocadas = 0, blocos = 0, itens = 0;

  for (const [num, novos] of Object.entries(PILOTO)) {
    const lesson = course.lessons.find((l) => l.num === Number(num));
    if (!lesson) { console.log(`  ✗ lição ${num} não existe em ${file}`); continue; }

    // Idempotente: remove uma aplicação anterior antes de reinserir, para que
    // rodar duas vezes não empilhe blocos repetidos na lição.
    lesson.exercises = (lesson.exercises || []).filter((e) => e.type !== 'mcSet');
    lesson.exercises.push(...JSON.parse(JSON.stringify(novos)));
    lesson.exercises.sort((a, b) => ORDEM(a) - ORDEM(b));
    lesson.exercises.forEach(renumera);

    tocadas += 1;
    blocos += novos.length;
    itens += novos.reduce((s, b) => s + b.items.length, 0);
  }

  resumo.push(`${path.basename(path.dirname(file))}: ${tocadas} lição(ões) · ${blocos} blocos · ${itens} itens`);
  if (APPLY) fs.writeFileSync(file, JSON.stringify(course));
}

console.log(resumo.map((r) => '  ' + r).join('\n'));
console.log(APPLY ? '\n  Gravado.' : '\n  Simulação — rode com --apply para gravar.');
