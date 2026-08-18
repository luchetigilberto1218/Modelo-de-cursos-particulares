/* Pop Culture · TV Shows — quatro séries adultas, quatro pontos de gramática.
   Formato do FAAP English Hub: cada lição é sobre UMA obra, e a obra é o
   contexto para a estrutura que se quer ensinar. */
module.exports = [

/* ─────────────────────────────── 1 ─────────────────────────────── */
{
  title: 'The Bear — Kitchen Under Pressure',
  focus: 'Ordens curtas e o imperativo',
  difficulty: 'Básico',
  character: 'us-male',
  image: '/faapatendimento/img/livre/foto/tv.jpg',
  imageCaption: 'Numa cozinha profissional ninguém fala em frases longas.',
  objective: 'Dar e entender ordens curtas em inglês usando o imperativo — o modo como se fala numa cozinha profissional, e em qualquer lugar com pressa.',
  intro: [
    '<em>The Bear</em> is a series about a chef who takes over his family sandwich shop in Chicago. Almost every line is shouted, and almost every line is short.',
    'That is the point of this lesson: in a real kitchen, nobody says <em>"could you please pass me the pan?"</em>. They say <strong>"Behind!"</strong>, <strong>"Corner!"</strong>, <strong>"Heard!"</strong>.',
  ],
  introPt: [
    '<em>The Bear</em> é uma série sobre um chef que assume a sanduicheria da família em Chicago. Quase toda fala é gritada, e quase toda fala é curta.',
    'É disso que trata esta lição: numa cozinha de verdade ninguém diz <em>"could you please pass me the pan?"</em>. Diz <strong>"Behind!"</strong>, <strong>"Corner!"</strong>, <strong>"Heard!"</strong>.',
  ],
  vocab: [
    { en: 'Behind!', pt: 'Atrás! (estou passando atrás de você)', example: 'Behind! Hot pan!' },
    { en: 'Heard!', pt: 'Entendido! (ouvi e vou fazer)', example: 'Two burgers, no onion. — Heard!' },
    { en: 'to fire', pt: 'mandar preparar / começar o prato', example: 'Fire table six.' },
    { en: 'on the fly', pt: 'com urgência, na frente da fila', example: 'One steak on the fly!' },
    { en: 'to be in the weeds', pt: 'estar afogado de trabalho', example: 'I am in the weeds here.' },
  ],
  exercises: [
    {
      type: 'wordBank',
      title: 'A cozinha em cinco falas',
      instruction: 'Complete com o banco de palavras. Todas as falas são do jeito que se grita numa cozinha.',
      bank: ['Behind', 'Heard', 'fire', 'fly', 'weeds'],
      items: [
        { text: '___ ! Hot pan coming through.', answer: 'Behind' },
        { text: 'Two salads, no dressing. — ___ !', answer: 'Heard' },
        { text: 'Chef, do I ___ table six now?', answer: 'fire' },
        { text: 'One steak on the ___ , please!', answer: 'fly' },
        { text: 'Give me two minutes, I am in the ___ .', answer: 'weeds' },
      ],
      explanation: 'Nenhuma dessas falas tem sujeito. Em situação de pressa, o inglês corta tudo o que não é essencial.',
    },
    {
      type: 'serialChoice',
      title: 'O imperativo, sem enfeite',
      badge: 'Escolha certa',
      instruction: 'Escolha a forma que se usaria numa cozinha — curta e direta.',
      items: [
        { prompt: 'Pedir para alguém sair da frente.', options: [{ text: 'Move!', correct: true }, { text: 'You move.' }, { text: 'Can you please move a little?' }], why: 'Imperativo é o verbo sozinho, sem sujeito: <strong>Move!</strong>' },
        { prompt: 'Dizer para não tocar em algo.', options: [{ text: 'Do not touch that.', correct: true }, { text: 'Not touch that.' }, { text: 'You do not touch.' }], why: 'Negativa do imperativo: <strong>do not</strong> + verbo.' },
        { prompt: 'Pedir para provarem o molho.', options: [{ text: 'Taste this.', correct: true }, { text: 'You taste this.' }, { text: 'To taste this.' }], why: 'De novo o verbo sozinho.' },
        { prompt: 'Chamar atenção para um prato pronto.', options: [{ text: 'Pick up!', correct: true }, { text: 'Picking up.' }, { text: 'The pick up.' }], why: '<strong>Pick up!</strong> é o grito de "prato pronto, venha buscar".' },
      ],
      explanation: 'Verbo sozinho = ordem. "Do not" + verbo = proibição. É a gramática mais curta do inglês.',
    },
    {
      type: 'dialogue',
      title: 'Serviço da noite',
      badge: 'Diálogo',
      scene: 'Uma cozinha cheia, no meio do jantar. Chef e cozinheiro.',
      lines: [
        { who: 'Chef', voice: 'us-male', en: 'How long on table four?', pt: 'Quanto tempo para a mesa quatro?' },
        { who: 'Cook', voice: 'us-female', en: 'Two minutes, chef.', pt: 'Dois minutos, chef.' },
        { who: 'Chef', voice: 'us-male', en: 'Make it one. Fire table six behind it.', pt: 'Faça em um. Manda a mesa seis logo atrás.' },
        { who: 'Cook', voice: 'us-female', en: 'Heard. Behind you!', pt: 'Entendido. Atrás de você!' },
        { who: 'Chef', voice: 'us-male', en: 'Do not plate that yet. The sauce is not ready.', pt: 'Não empratar isso ainda. O molho não está pronto.' },
        { who: 'Cook', voice: 'us-female', en: 'Got it. I am a little in the weeds here.', pt: 'Entendi. Estou meio afogada aqui.' },
        { who: 'Chef', voice: 'us-male', en: 'Take a breath. I will help you.', pt: 'Respira. Eu te ajudo.' },
      ],
      questions: [
        {
          q: 'What does "Make it one" mean?',
          options: [
            { text: 'Do it in one minute instead of two.', correct: true },
            { text: 'Make one portion only.' },
            { text: 'Put everything on one plate.' },
          ],
          why: '<strong>Make it + tempo</strong> = reduza para esse tempo. Duas palavras, uma ordem inteira.',
        },
        {
          q: 'How does the chef end the conversation?',
          options: [
            { text: 'With an order and an offer of help.', correct: true },
            { text: 'By shouting louder.' },
            { text: 'By sending her home.' },
          ],
          why: '"Take a breath. I will help you." Imperativo também serve para acalmar.',
        },
      ],
      explanation: 'Repare que nenhuma fala passa de sete palavras — e a conversa inteira funciona.',
    },
    {
      type: 'checkOff',
      title: 'Antes de fechar esta lição',
      items: [
        { en: 'I can give an order with the verb alone.', pt: 'Sei dar uma ordem com o verbo sozinho.' },
        { en: 'I can say "do not" + verb for a prohibition.', pt: 'Sei usar "do not" + verbo para proibir.' },
        { en: 'I know what "heard", "behind" and "on the fly" mean.', pt: 'Sei o que significam "heard", "behind" e "on the fly".' },
        { en: 'I can say I am overloaded: "I am in the weeds".', pt: 'Sei dizer que estou sobrecarregada: "I am in the weeds".' },
      ],
      doneMessage: 'imperativo dominado. A próxima lição troca a cozinha pela sala de reunião.',
      openMessage: 'volte ao diálogo com o áudio ligado — a velocidade é parte da lição.',
    },
  ],
  insights: {
    kicker: 'Sacadas · did you know?',
    title: 'O inglês da pressa',
    intro: 'Três coisas que a cozinha ensina sobre a língua.',
    cards: [
      { en: 'The imperative is not rude in English when the situation is urgent. In a kitchen, an operating room or a fire drill, short is polite.', pt: 'O imperativo não é grosseiro em inglês quando a situação é urgente. Numa cozinha, num centro cirúrgico ou num treinamento de incêndio, curto é educado.' },
      { en: '"Heard!" means "I understood and I am doing it". It exists because "OK" is too vague when six people are shouting.', pt: '"Heard!" quer dizer "entendi e estou fazendo". Existe porque "OK" é vago demais quando seis pessoas estão gritando.' },
      { en: '"In the weeds" comes from golf — the ball lost in the tall grass. In a kitchen it means you are drowning in orders.', pt: '"In the weeds" vem do golfe — a bola perdida no mato alto. Numa cozinha quer dizer que você está afogado em pedidos.' },
    ],
  },
  takeaways: [
    'Behind! Hot pan coming through.',
    'Do not plate that yet.',
    'I am a little in the weeds here.',
  ],
  celebrate: {
    en: 'Seven words per line, and the whole kitchen understood you.',
    pt: 'Sete palavras por fala, e a cozinha inteira te entendeu.',
  },
},

/* ─────────────────────────────── 2 ─────────────────────────────── */
{
  title: 'Succession — The Language of Power',
  focus: 'Comparativos e o vocabulário do poder',
  difficulty: 'Iniciante',
  character: 'gb-male',
  image: '/faapatendimento/img/livre/foto/tv.jpg',
  imageCaption: 'Uma família, uma empresa e quatro filhos disputando a mesma cadeira.',
  objective: 'Comparar pessoas, cargos e empresas em inglês usando comparativos — a operação que toda conversa sobre poder exige.',
  intro: [
    '<em>Succession</em> is about a media family fighting over who takes the father\'s place. Every scene is a comparison: who is stronger, who is closer to the throne, who is <em>more useful</em> this week.',
    'So the grammar here is the <strong>comparative</strong> — and the vocabulary is the one you also hear in any real company.',
  ],
  introPt: [
    '<em>Succession</em> é sobre uma família de mídia brigando por quem toma o lugar do pai. Toda cena é uma comparação: quem é mais forte, quem está mais perto do trono, quem é <em>mais útil</em> nesta semana.',
    'Então a gramática aqui é o <strong>comparativo</strong> — e o vocabulário é o mesmo que se ouve em qualquer empresa de verdade.',
  ],
  vocab: [
    { en: 'the board', pt: 'o conselho de administração', example: 'The board meets on Thursday.' },
    { en: 'a stake', pt: 'uma participação (acionária)', example: 'She has a bigger stake than her brother.' },
    { en: 'to step down', pt: 'deixar o cargo', example: 'He refused to step down.' },
    { en: 'to back someone', pt: 'apoiar alguém', example: 'The board backed the daughter.' },
    { en: 'a power move', pt: 'uma jogada de poder', example: 'That was a power move.' },
  ],
  exercises: [
    {
      type: 'dropdownGap',
      title: 'Complete a análise do episódio',
      badge: 'Complete o texto',
      instruction: 'Escolha a forma comparativa certa em cada lacuna.',
      text: 'The daughter has a ___ stake than her brother, so her vote counts for more. The father is ___ powerful than he was five years ago, but he is still the one who decides. The youngest son is the ___ prepared of the four, and everyone knows it. The board is ___ patient than it used to be. In the end, the ___ interesting question is not who is strongest, but who the board will back.',
      gaps: [
        { options: ['bigger', 'more big', 'biggest'], answer: 'bigger', why: 'Adjetivo curto: <strong>-er</strong>. Nunca "more big".' },
        { options: ['less', 'lesser', 'little'], answer: 'less', why: '<strong>less powerful than</strong> = menos poderoso que.' },
        { options: ['least', 'less', 'lesser'], answer: 'least', why: 'Superlativo de inferioridade: <strong>the least prepared</strong>.' },
        { options: ['less', 'least', 'little'], answer: 'less', why: 'Comparativo: <strong>less patient than</strong>.' },
        { options: ['most', 'more', 'much'], answer: 'most', why: 'Superlativo de adjetivo longo: <strong>the most interesting</strong>.' },
      ],
      explanation: 'Curto ganha -er e -est. Longo ganha more e most. Para menos: less e the least.',
    },
    {
      type: 'swipeChoice',
      title: 'Qual frase tem mais poder?',
      badge: 'A ou B',
      instruction: 'As duas dizem a mesma coisa. Escolha a que soa mais forte numa mesa de reunião.',
      items: [
        { prompt: 'Discordando do chefe.', a: 'I think maybe that is not the best idea, possibly.', b: 'I see it differently, and here is why.', correct: 'b', why: 'Empilhar "maybe", "possibly" e "I think" enfraquece tudo. Uma posição clara com um motivo é mais forte.' },
        { prompt: 'Recusando um cargo.', a: 'I do not want it.', b: 'I am not stepping down for this.', correct: 'b', why: 'Vocabulário específico ("step down") soa a quem conhece o jogo.' },
        { prompt: 'Pedindo apoio.', a: 'Please help me with the board.', b: 'I need you to back me with the board.', correct: 'b', why: '<strong>to back someone</strong> é o verbo exato para apoio político.' },
      ],
      explanation: 'Poder, em inglês, mora na precisão do verbo — não no volume da voz.',
    },
    {
      type: 'matching',
      title: 'O vocabulário da mesa',
      instruction: 'Associe o termo ao significado.',
      pairs: [
        { left: 'the board', right: 'o conselho que decide os rumos da empresa' },
        { left: 'a stake', right: 'a fatia que alguém tem da empresa' },
        { left: 'to step down', right: 'sair do cargo, por vontade ou pressão' },
        { left: 'to back someone', right: 'apoiar publicamente' },
        { left: 'a power move', right: 'uma jogada feita para mostrar quem manda' },
      ],
      explanation: 'Cinco termos que aparecem na série e em qualquer notícia de negócios.',
    },
    {
      type: 'checkOff',
      title: 'Antes de fechar esta lição',
      items: [
        { en: 'I can compare two people with -er and more.', pt: 'Sei comparar duas pessoas com -er e more.' },
        { en: 'I can use less and the least.', pt: 'Sei usar less e the least.' },
        { en: 'I know what board, stake and step down mean.', pt: 'Sei o que significam board, stake e step down.' },
        { en: 'I state a position instead of stacking "maybe".', pt: 'Assumo uma posição em vez de empilhar "maybe".' },
      ],
      doneMessage: 'comparativos no lugar. A próxima lição separa o trabalho da vida.',
      openMessage: 'reveja o texto com lacunas — os cinco comparativos estão lá.',
    },
  ],
  insights: {
    kicker: 'Sacadas · did you know?',
    title: 'Comparar em inglês',
    intro: 'Três regras que resolvem tudo.',
    cards: [
      { en: 'One or two syllables usually take -er and -est: bigger, strongest. Three or more take more and most: more interesting.', pt: 'Uma ou duas sílabas normalmente levam -er e -est: bigger, strongest. Três ou mais levam more e most: more interesting.' },
      { en: 'Never use both. "More bigger" is the most common mistake of Portuguese speakers, and native ears catch it instantly.', pt: 'Nunca use os dois. "More bigger" é o erro mais comum de quem fala português, e o ouvido nativo pega na hora.' },
      { en: 'Good and bad are irregular: better/best and worse/worst. There is no "gooder" and no "more bad".', pt: 'Good e bad são irregulares: better/best e worse/worst. Não existe "gooder" nem "more bad".' },
    ],
  },
  takeaways: [
    'She has a bigger stake than her brother.',
    'He is less powerful than he was five years ago.',
    'I need you to back me with the board.',
  ],
  celebrate: {
    en: 'You can now compare anything with anything — politely or not.',
    pt: 'Você já compara qualquer coisa com qualquer coisa — com educação ou sem.',
  },
},

/* ─────────────────────────────── 3 ─────────────────────────────── */
{
  title: 'Severance — Work and Life, Split in Two',
  focus: 'Present simple × present continuous',
  difficulty: 'Intermediário',
  character: 'us-female',
  image: '/faapatendimento/img/livre/foto/tv.jpg',
  imageCaption: 'A série pergunta o que sobra de você quando o expediente acaba.',
  objective: 'Separar em inglês o que é rotina do que está acontecendo agora — a diferença entre present simple e present continuous.',
  intro: [
    'In <em>Severance</em>, employees have their memory surgically split: the person at work does not remember life outside, and the person outside does not remember work.',
    'That is a perfect way to learn two tenses. The <strong>routine</strong> self uses <em>present simple</em>: "I work on the severed floor." The <strong>right now</strong> self uses <em>present continuous</em>: "I am looking for the exit."',
  ],
  introPt: [
    'Em <em>Severance</em>, os funcionários têm a memória dividida cirurgicamente: a pessoa no trabalho não lembra a vida lá fora, e a de fora não lembra o trabalho.',
    'Isso é um jeito perfeito de aprender dois tempos verbais. O eu da <strong>rotina</strong> usa o <em>present simple</em>: "I work on the severed floor." O eu do <strong>agora</strong> usa o <em>present continuous</em>: "I am looking for the exit."',
  ],
  vocab: [
    { en: 'shift', pt: 'turno', example: 'My shift starts at nine.' },
    { en: 'floor', pt: 'andar (também: o setor)', example: 'Nobody leaves this floor.' },
    { en: 'to keep track of', pt: 'acompanhar / controlar', example: 'I keep track of the hours.' },
    { en: 'to figure out', pt: 'descobrir / sacar', example: 'She is figuring out what is going on.' },
    { en: 'right now', pt: 'agora mesmo', example: 'Right now I am reading the manual.' },
  ],
  exercises: [
    {
      type: 'categorize',
      title: 'Rotina ou agora?',
      badge: 'Classifique',
      instruction: 'Classifique cada frase pelo tempo verbal que ela pede.',
      categories: [
        { id: 'simple', name: 'Rotina · present simple', short: 'Rotina' },
        { id: 'cont', name: 'Agora · present continuous', short: 'Agora' },
      ],
      items: [
        { text: 'My shift starts at nine every day.', cat: 'simple' },
        { text: 'Right now I am reading the manual.', cat: 'cont' },
        { text: 'She works on the severed floor.', cat: 'simple' },
        { text: 'They are looking for the exit.', cat: 'cont' },
        { text: 'We never talk about the outside.', cat: 'simple' },
        { text: 'He is figuring it out at the moment.', cat: 'cont' },
      ],
      explanation: 'Palavras como every day, never e always pedem simple. Right now, at the moment e today pedem continuous.',
    },
    {
      type: 'dropdownGap',
      title: 'Complete o relato',
      badge: 'Complete o texto',
      instruction: 'Escolha a forma certa em cada lacuna.',
      text: 'My shift ___ at nine every morning. I ___ on the severed floor, in a room with three other people. We ___ talk about the outside, because we do not remember it. But something ___ this week: one of us ___ questions, and right now she ___ for a way out.',
      gaps: [
        { options: ['starts', 'is starting', 'start'], answer: 'starts', why: '<em>every morning</em> = rotina → present simple.' },
        { options: ['work', 'am working', 'works'], answer: 'work', why: 'Rotina, primeira pessoa: <strong>I work</strong>.' },
        { options: ['never', 'not', 'no'], answer: 'never', why: '<strong>never</strong> é advérbio e vem antes do verbo — sem "do": we never talk.' },
        { options: ['is changing', 'changes', 'change'], answer: 'is changing', why: '<em>this week</em> = está acontecendo agora → continuous.' },
        { options: ['is asking', 'asks', 'ask'], answer: 'is asking', why: 'Está acontecendo agora, e é novo → continuous.' },
        { options: ['is looking', 'looks', 'look'], answer: 'is looking', why: '<em>right now</em> → continuous.' },
      ],
      explanation: 'A regra prática: se você pode acrescentar "right now" e a frase continua fazendo sentido, é continuous.',
    },
    {
      type: 'errorSpot',
      title: 'Ache a palavra errada',
      badge: 'Ache o erro',
      instruction: 'Uma palavra errada por frase. Clique nela.',
      items: [
        { sentence: 'I am working here every day since 2019.', wrong: 'am', fix: 'have been', why: 'Com "since" o inglês pede present perfect: <strong>I have been working here since 2019</strong>.' },
        { sentence: 'She is knowing the answer.', wrong: 'is', fix: '(corte)', why: 'Verbos de estado como <em>know</em> não vão para o continuous: <strong>She knows</strong>.' },
        { sentence: 'Right now I read the manual.', wrong: 'read', fix: 'am reading', why: '<em>Right now</em> pede continuous.' },
        { sentence: 'My shift is starting at nine every morning.', wrong: 'is', fix: '(corte)', why: '<em>Every morning</em> é rotina: <strong>My shift starts</strong>.' },
      ],
      explanation: 'Know, want, need, like e believe quase nunca aparecem no continuous. São estados, não ações.',
    },
    {
      type: 'checkOff',
      title: 'Antes de fechar esta lição',
      items: [
        { en: 'I use present simple for routine.', pt: 'Uso present simple para rotina.' },
        { en: 'I use present continuous for right now.', pt: 'Uso present continuous para o agora.' },
        { en: 'I do not put know, want and like in the continuous.', pt: 'Não ponho know, want e like no continuous.' },
        { en: 'I know that "since" asks for another tense.', pt: 'Sei que "since" pede outro tempo verbal.' },
      ],
      doneMessage: 'dois tempos separados. A última lição da trilha é a mais britânica de todas.',
      openMessage: 'a classificação rotina/agora é a lição inteira. Refaça ela.',
    },
  ],
  insights: {
    kicker: 'Sacadas · did you know?',
    title: 'Os dois presentes',
    intro: 'Por que o português não sente essa diferença.',
    cards: [
      { en: 'Portuguese uses "eu trabalho" for both routine and right now. English forces you to choose — and choosing wrong changes the meaning.', pt: 'O português usa "eu trabalho" para rotina e para agora. O inglês obriga a escolher — e escolher errado muda o sentido.' },
      { en: '"I work here" means this is my job. "I am working here" suggests it is temporary, just for now. Same words, different life.', pt: '"I work here" quer dizer que este é o meu emprego. "I am working here" sugere que é temporário, só por enquanto. Mesmas palavras, outra vida.' },
      { en: 'State verbs — know, want, believe, need, like — stay in the simple form even when you mean right now.', pt: 'Verbos de estado — know, want, believe, need, like — ficam na forma simples mesmo quando você quer dizer agora.' },
    ],
  },
  takeaways: [
    'My shift starts at nine every morning.',
    'Right now she is looking for a way out.',
    'She knows the answer — not "she is knowing".',
  ],
  celebrate: {
    en: 'Two presents, two lives — and you can tell them apart.',
    pt: 'Dois presentes, duas vidas — e você distingue os dois.',
  },
},

/* ─────────────────────────────── 4 ─────────────────────────────── */
{
  title: 'Slow Horses — British Understatement',
  focus: 'Dizer muito falando pouco',
  difficulty: 'Intermediário',
  character: 'gb-male',
  image: '/faapatendimento/img/livre/foto/tv.jpg',
  imageCaption: 'Espiões rebaixados, sarcasmo de primeira linha.',
  objective: 'Reconhecer e usar o understatement britânico — o hábito de dizer menos do que se quer dizer, que atravessa toda conversa no Reino Unido.',
  intro: [
    '<em>Slow Horses</em> follows a group of failed spies in London. Nobody in it ever says what they mean directly.',
    'That is not a script trick — it is how British English works. <strong>"Not bad"</strong> can mean excellent. <strong>"A slight problem"</strong> can mean a disaster. This lesson teaches you to hear it.',
  ],
  introPt: [
    '<em>Slow Horses</em> acompanha um grupo de espiões fracassados em Londres. Ninguém ali diz o que quer dizer diretamente.',
    'Isso não é truque de roteiro — é como o inglês britânico funciona. <strong>"Not bad"</strong> pode significar excelente. <strong>"A slight problem"</strong> pode significar um desastre. Esta lição te ensina a ouvir isso.',
  ],
  vocab: [
    { en: 'not bad', pt: 'nada mau (pode significar: muito bom)', example: 'That report was not bad at all.' },
    { en: 'a slight problem', pt: 'um probleminha (pode ser enorme)', example: 'We have a slight problem with the plan.' },
    { en: 'I might be wrong, but…', pt: 'Posso estar enganado, mas… (não está)', example: 'I might be wrong, but that number looks off.' },
    { en: 'quite good', pt: 'bastante bom (no Reino Unido: razoável)', example: 'It was quite good, I suppose.' },
    { en: 'with all due respect', pt: 'com todo o respeito (vem discordância)', example: 'With all due respect, that will not work.' },
  ],
  exercises: [
    {
      type: 'matching',
      title: 'O que a pessoa quer dizer de verdade',
      instruction: 'Associe a frase britânica ao que ela realmente significa.',
      pairs: [
        { left: '"Not bad at all."', right: 'Foi muito bom' },
        { left: '"We have a slight problem."', right: 'Temos um problema sério' },
        { left: '"I might be wrong, but…"', right: 'Eu sei que estou certo' },
        { left: '"That is quite interesting."', right: 'Não me convenceu' },
        { left: '"With all due respect…"', right: 'Vou discordar agora' },
      ],
      explanation: 'Não é falsidade: é um código que todo mundo ali conhece. Aprender o código é aprender a língua.',
    },
    {
      type: 'multipleChoice',
      title: 'Traduza o understatement',
      prompt: 'A British colleague reads your proposal and says: "It is not bad, actually." What do they mean?',
      options: [
        { id: 'a', text: 'They liked it — probably quite a lot.', correct: true },
        { id: 'b', text: 'They thought it was mediocre.', correct: false, whyWrong: 'O "actually" é a pista: ele esperava menos e gostou.' },
        { id: 'c', text: 'They did not read it.', correct: false, whyWrong: 'Se não tivesse lido, não teria opinião.' },
      ],
      explanation: '"Not bad" na boca de um britânico costuma ser elogio. E "not bad at all" é elogio grande.',
    },
    {
      type: 'swipeChoice',
      title: 'Como um britânico diria?',
      badge: 'A ou B',
      instruction: 'Mesma mensagem, dois registros. Escolha o britânico.',
      items: [
        { prompt: 'O plano tem um erro grave.', a: 'This plan is completely wrong.', b: 'There may be one or two issues with this plan.', correct: 'b', why: 'Quanto pior a notícia, mais suave a frase. É contraintuitivo e é a regra.' },
        { prompt: 'Você discorda totalmente do chefe.', a: 'You are wrong.', b: 'I wonder if there is another way of looking at this.', correct: 'b', why: '"I wonder if…" é como se discorda de alguém acima na hierarquia.' },
        { prompt: 'Alguém fez um trabalho excelente.', a: 'That is the best work I have ever seen.', b: 'That is really rather good.', correct: 'b', why: 'Elogio também é contido. "Rather good" de um britânico vale muito.' },
      ],
      explanation: 'Regra geral: no Reino Unido, a intensidade da frase é inversamente proporcional à intensidade do sentimento.',
    },
    {
      type: 'checkOff',
      title: 'Antes de fechar a trilha',
      items: [
        { en: 'I know that "not bad" is often a compliment.', pt: 'Sei que "not bad" costuma ser elogio.' },
        { en: 'I hear "a slight problem" as a warning.', pt: 'Ouço "a slight problem" como um aviso.' },
        { en: 'I know "with all due respect" comes before disagreement.', pt: 'Sei que "with all due respect" vem antes da discordância.' },
        { en: 'I can soften a hard message the British way.', pt: 'Sei suavizar uma mensagem dura do jeito britânico.' },
      ],
      doneMessage: 'trilha de séries concluída. Movies está logo ao lado.',
      openMessage: 'a tabela de tradução do understatement é a lição inteira. Volte nela.',
    },
  ],
  insights: {
    kicker: 'Sacadas · did you know?',
    title: 'Ouvir o que não foi dito',
    intro: 'Três avisos para quem trabalha com britânicos.',
    cards: [
      { en: 'When a British colleague says "I hear what you say", the conversation is usually over and they disagree. It is not agreement.', pt: 'Quando um colega britânico diz "I hear what you say", a conversa geralmente acabou e ele discorda. Não é concordância.' },
      { en: '"Quite" is a trap. In American English it strengthens (quite good = very good); in British English it often weakens (quite good = acceptable).', pt: '"Quite" é uma armadilha. No inglês americano ele reforça (quite good = muito bom); no britânico costuma enfraquecer (quite good = aceitável).' },
      { en: 'Americans tend to say what they mean; the British tend to say slightly less. Neither is dishonest — they are different defaults.', pt: 'Americanos tendem a dizer o que pensam; britânicos tendem a dizer um pouco menos. Nenhum dos dois é desonesto — são padrões diferentes.' },
    ],
  },
  takeaways: [
    'That was not bad at all.',
    'There may be one or two issues with this plan.',
    'I wonder if there is another way of looking at this.',
  ],
  celebrate: {
    en: 'You can now hear the sentence behind the sentence.',
    pt: 'Você já ouve a frase por trás da frase.',
  },
},
];
