/*
  ASTA & the Copper Industry — a trilha de entrada.
  A empresa, a história, o produto e o setor, em inglês.
*/
module.exports = [
  {
    character: 'us-male',
    topic: 'A empresa e você',
    title: 'Where You Work at ASTA',
    focus: 'Site, área, cargo e responsabilidade',
    objective: 'Dizer, em inglês, em qual planta você trabalha, qual é a sua área, o seu cargo e aquilo pelo que você é responsável.',
    intro: [
      'The first question anyone asks in a global group is <em>"What do you do?"</em> — and right after it, <em>"Which site are you at?"</em>.',
      'At ASTA that second question matters: the group has six <strong>sites</strong> in five countries. Saying "I\'m at Cerquilho" or "I\'m at Três Corações" places you on the map immediately.',
    ],
    introPt: [
      'A primeira pergunta que fazem num grupo global é <em>"What do you do?"</em> (o que você faz?) — e logo depois <em>"Which site are you at?"</em> (em qual unidade você está?).',
      'Na ASTA essa segunda pergunta importa: o grupo tem seis <strong>sites</strong> (unidades) em cinco países. Dizer "I\'m at Cerquilho" ou "I\'m at Três Corações" já coloca você no mapa.',
    ],
    vocab: [
      { en: 'site / plant', pt: 'unidade / planta / fábrica', example: 'I work at the Cerquilho site.' },
      { en: 'shop floor', pt: 'chão de fábrica', example: 'Most of my day is on the shop floor.' },
      { en: 'role', pt: 'cargo / função', example: 'My role is maintenance technician.' },
      { en: 'to be responsible for', pt: 'ser responsável por', example: "I'm responsible for the enamelling line." },
      { en: 'to report to', pt: 'reportar-se a', example: 'I report to the production manager.' },
      { en: 'shift', pt: 'turno', example: 'I work the morning shift.' },
      { en: 'headquarters (HQ)', pt: 'matriz / sede', example: 'Our headquarters are in Austria.' },
    ],
    exercises: [
      {
        type: 'wordBank',
        title: 'Complete com o banco de palavras',
        instruction: 'Monte a sua própria apresentação na ASTA.',
        bank: ['site', 'role', 'responsible', 'report', 'shift', 'headquarters'],
        items: [
          { text: 'I work at the Cerquilho ___.', answer: 'site' },
          { text: 'My ___ is process engineer.', answer: 'role' },
          { text: "I'm ___ for the enamelling line.", answer: 'responsible' },
          { text: 'I ___ to the plant manager.', answer: 'report' },
          { text: 'I work the night ___.', answer: 'shift' },
          { text: 'Our ___ are in Austria.', answer: 'headquarters' },
        ],
        explanation: 'Estas seis peças montam qualquer apresentação sua dentro do grupo.',
      },
      {
        type: 'multipleChoice',
        title: 'Qual soa mais natural?',
        prompt: 'Someone from the Austrian HQ asks: "So, what do you do?" Which answer sounds most natural?',
        options: [
          { id: 'a', text: "I'm a maintenance technician. I work at the Cerquilho plant.", correct: true },
          { id: 'b', text: 'I make the maintenance in the Cerquilho.', correct: false, whyWrong: 'Não se diz "make the maintenance". Use "I\'m a(n) + cargo" e "I work at…".' },
          { id: 'c', text: 'I am responsible of the enamelling line.', correct: false, whyWrong: 'É "responsible FOR", nunca "responsible of".' },
        ],
        explanation: 'Padrão: "I\'m a(n) [cargo]. I work at [unidade]. I\'m responsible for [algo]."',
      },
      {
        type: 'serialChoice',
        title: 'A preposição certa',
        badge: 'Escolha certa',
        instruction: 'São colocações fixas — decorar aqui economiza um mal-entendido depois.',
        items: [
          { prompt: 'I work ___ the Cerquilho plant.', options: [{ text: 'at', correct: true }, { text: 'in' }, { text: 'on' }], why: '<strong>at</strong> + nome da unidade. "In" fica para cidade e país: <em>in Cerquilho, in Brazil</em>.' },
          { prompt: "I'm responsible ___ two production lines.", options: [{ text: 'for', correct: true }, { text: 'of' }, { text: 'about' }], why: '<strong>responsible for</strong> — sempre.' },
          { prompt: 'I report ___ the plant manager.', options: [{ text: 'to', correct: true }, { text: 'for' }, { text: 'at' }], why: '<strong>report to</strong> + pessoa.' },
          { prompt: 'I work ___ the night shift.', options: [{ text: 'on', correct: true }, { text: 'in' }, { text: 'at' }], why: 'Turno leva <strong>on</strong>: <em>on the night shift</em>.' },
        ],
        explanation: 'at + planta · for + responsabilidade · to + chefia · on + turno.',
      },
      {
        type: 'dialogue',
        title: 'Uma visita da matriz',
        badge: 'Diálogo',
        scene: 'Um engenheiro do grupo, vindo da Áustria, chega a Cerquilho e conhece você no corredor.',
        instruction: 'Ouça a conversa, leia junto e responda. Use o botão de tradução se precisar.',
        lines: [
          { who: 'Oliver (HQ)', voice: 'oliver', en: "Hi, I'm Oliver, from the Oed site in Austria. Is this your first time meeting someone from HQ?", pt: 'Oi, sou o Oliver, da unidade de Oed, na Áustria. É a primeira vez que você encontra alguém da matriz?' },
          { who: 'You', voice: 'us-male', en: "Yes, it is. I'm a maintenance technician here at Cerquilho. Nice to meet you.", pt: 'Sim, é. Sou técnico de manutenção aqui em Cerquilho. Prazer em conhecê-lo.' },
          { who: 'Oliver (HQ)', voice: 'oliver', en: 'Nice to meet you too. What are you responsible for?', pt: 'Prazer o meu também. Você é responsável por quê?' },
          { who: 'You', voice: 'us-male', en: "I'm responsible for the enamelling ovens. I report to the maintenance supervisor.", pt: 'Sou responsável pelos fornos de esmaltagem. Me reporto ao supervisor de manutenção.' },
          { who: 'Oliver (HQ)', voice: 'oliver', en: 'Good. We have the same equipment in Oed. How many shifts do you run?', pt: 'Ótimo. Temos o mesmo equipamento em Oed. Vocês rodam quantos turnos?' },
          { who: 'You', voice: 'us-male', en: 'Three shifts, twenty-four hours. I usually work the morning shift.', pt: 'Três turnos, vinte e quatro horas. Eu normalmente trabalho no turno da manhã.' },
        ],
        questions: [
          { prompt: 'Where is Oliver from?', options: [{ text: 'The Oed site, in Austria.', correct: true }, { text: 'The Cerquilho site, in Brazil.' }, { text: 'The Baoying site, in China.' }], why: 'Ele diz "from the Oed site in Austria" logo na primeira fala.' },
          { prompt: 'What is the technician responsible for?', options: [{ text: 'The enamelling ovens.', correct: true }, { text: 'The whole plant.' }, { text: 'The shift schedule.' }], why: '"I\'m responsible for the enamelling ovens."' },
          { prompt: 'How many shifts does Cerquilho run?', options: [{ text: 'Three.', correct: true }, { text: 'One.' }, { text: 'Two.' }], why: '"Three shifts, twenty-four hours."' },
        ],
      },
      {
        type: 'readAloud',
        title: 'Agora fale em voz alta',
        instruction: 'Ouça, repita e grave. Troque os dados pelos seus — esta é a frase que você mais vai repetir em inglês.',
        sentences: [
          "Hi, I'm Anderson. I'm a maintenance technician at the Cerquilho plant.",
          "I'm responsible for the enamelling ovens.",
          'I report to the maintenance supervisor.',
          'I usually work the morning shift.',
          'Our headquarters are in Austria, but I work here in Brazil.',
        ],
      },
      {
        type: 'checkOff',
        title: 'Antes de fechar esta lição',
        items: [
          { en: 'I can say which ASTA site I work at.', pt: 'Sei dizer em qual unidade da ASTA eu trabalho.' },
          { en: 'I can say my role and what I am responsible for.', pt: 'Sei dizer o meu cargo e aquilo pelo que sou responsável.' },
          { en: 'I can say who I report to.', pt: 'Sei dizer a quem me reporto.' },
          { en: 'I use at / for / to / on with the right word.', pt: 'Uso at, for, to e on com a palavra certa.' },
        ],
        doneMessage: 'apresentação resolvida. A próxima lição volta duzentos anos no tempo.',
        openMessage: 'leve o que ficou em branco para a próxima aula com o professor.',
      },
    ],
    celebrate: {
      en: 'Now you can introduce yourself and your work at ASTA with confidence.',
      pt: 'Agora você consegue se apresentar e falar do seu trabalho na ASTA com confiança.',
    },
    insights: {
      kicker: 'Sacadas · did you know?',
      title: 'Como se apresentar num grupo com seis países',
      intro: 'Detalhes pequenos que fazem você soar natural numa conversa com a matriz. Ouça e revele a tradução.',
      cards: [
        { en: 'ASTA has six production sites in five countries — Austria, Bosnia and Herzegovina, Brazil, China and India.', pt: 'A ASTA tem seis unidades produtivas em cinco países — Áustria, Bósnia e Herzegovina, Brasil, China e Índia.' },
        { en: 'In English, "plant" and "site" both mean fábrica. "Factory" sounds older and is less common in industry today.', pt: 'Em inglês, "plant" e "site" significam fábrica. "Factory" soa mais antigo e é menos usado na indústria hoje.' },
        { en: 'Say "I\'m based in Cerquilho" when you travel a lot but your home site is there.', pt: 'Diga "I\'m based in Cerquilho" quando você viaja muito, mas a sua base é ali.' },
        { en: 'Saying who you report to instantly shows a foreign colleague where you sit in the structure.', pt: 'Dizer a quem você se reporta mostra na hora a um colega estrangeiro onde você se encaixa na estrutura.' },
      ],
    },
  },
];
