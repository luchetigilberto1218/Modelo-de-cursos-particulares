/* Mind & Body · Mental Health — vocabulário e conversa. O material fica no
   idioma e em como pedir ajuda; não dá conselho clínico. */
module.exports = [

{
  title: 'How Are You, Really?',
  focus: 'Cumprimento x pergunta de verdade',
  difficulty: 'Básico',
  character: 'gb-female',
  image: '/faapatendimento/img/livre/foto/mental.jpg',
  imageCaption: 'Em inglês, "how are you?" quase nunca é uma pergunta.',
  objective: 'Distinguir o cumprimento da pergunta real em inglês — e saber fazer a pergunta que traz uma resposta de verdade.',
  intro: [
    'The first thing to know about this subject in English is uncomfortable: <strong>"How are you?" is a greeting, not a question.</strong>',
    'The expected answer is "good, you?" — even in a hospital corridor. To ask for real, you need a different sentence.',
  ],
  introPt: [
    'A primeira coisa a saber sobre esse assunto em inglês é desconfortável: <strong>"How are you?" é um cumprimento, não uma pergunta.</strong>',
    'A resposta esperada é "good, you?" — mesmo num corredor de hospital. Para perguntar de verdade, você precisa de outra frase.',
  ],
  vocab: [
    { en: 'How have you been?', pt: 'Como você tem estado?', example: 'How have you been, actually?' },
    { en: 'to check in on someone', pt: 'ver como alguém está', example: 'I wanted to check in on you.' },
    { en: 'How are you holding up?', pt: 'Como você está aguentando?', example: 'How are you holding up this week?' },
    { en: 'to be honest', pt: 'para ser sincero', example: 'To be honest, not great.' },
    { en: 'I am around', pt: 'estou por aqui', example: 'I am around if you want to talk.' },
  ],
  exercises: [
    {
      type: 'categorize',
      title: 'Cumprimento ou pergunta?',
      badge: 'Classifique',
      instruction: 'Classifique cada frase pelo que ela é de fato em inglês.',
      categories: [
        { id: 'g', name: 'Cumprimento · não espera resposta', short: 'Cumprimento' },
        { id: 'p', name: 'Pergunta de verdade', short: 'Pergunta' },
      ],
      items: [
        { text: 'How are you?', cat: 'g' },
        { text: 'How is it going?', cat: 'g' },
        { text: 'All right?', cat: 'g' },
        { text: 'How have you been, actually?', cat: 'p' },
        { text: 'I wanted to check in on you.', cat: 'p' },
        { text: 'How are you holding up?', cat: 'p' },
      ],
      explanation: 'A diferença está no "actually", no motivo e no tom. Sem eles, é só um olá.',
    },
    {
      type: 'multipleChoice',
      title: 'A pergunta que abre a conversa',
      prompt: 'You noticed a colleague has been quiet all week. What do you say?',
      options: [
        { id: 'a', text: 'How have you been, actually? You seemed quiet this week.', correct: true },
        { id: 'b', text: 'How are you?', correct: false, whyWrong: 'Vai receber "fine, thanks" por reflexo, mesmo que não esteja.' },
        { id: 'c', text: 'Are you OK?', correct: false, whyWrong: 'Funciona, mas quase sempre ganha um "yes" automático. Falta o motivo.' },
      ],
      explanation: 'A observação concreta ("você pareceu quieta") é o que torna a pergunta crível.',
    },
    {
      type: 'dialogue',
      title: 'Perguntando de verdade',
      badge: 'Diálogo',
      scene: 'Fim de uma semana pesada, dois colegas no corredor.',
      lines: [
        { who: 'Maya', voice: 'gb-female', en: 'Hey — how have you been, actually? You seemed quiet this week.', pt: 'Ei — como você tem estado, de verdade? Você pareceu quieta essa semana.' },
        { who: 'You', voice: 'us-female', en: 'To be honest, not great. Everything came at once.', pt: 'Para ser sincera, nada bem. Veio tudo de uma vez.' },
        { who: 'Maya', voice: 'gb-female', en: 'That makes sense. Do you want to talk about it, or would you rather not?', pt: 'Faz sentido. Você quer falar sobre isso, ou prefere não?' },
        { who: 'You', voice: 'us-female', en: 'Maybe later. But thank you for asking.', pt: 'Talvez depois. Mas obrigada por perguntar.' },
        { who: 'Maya', voice: 'gb-female', en: 'Of course. I am around whenever.', pt: 'Claro. Estou por aqui quando você quiser.' },
      ],
      questions: [
        {
          q: 'What makes the first question work?',
          options: [
            { text: '"Actually" plus a concrete observation.', correct: true },
            { text: 'It is louder than usual.' },
            { text: 'It is asked twice.' },
          ],
          why: 'Sem o motivo, seria mais um cumprimento.',
        },
        {
          q: 'Why does Maya offer "or would you rather not"?',
          options: [
            { text: 'It gives permission to say no.', correct: true },
            { text: 'It ends the conversation.' },
            { text: 'It shows she is busy.' },
          ],
          why: 'Perguntar de verdade inclui deixar a pessoa recusar sem constrangimento.',
        },
      ],
      explanation: 'Ninguém deu conselho. Perguntar, ouvir e ficar disponível já é o suficiente.',
    },
    {
      type: 'checkOff',
      title: 'Antes de fechar esta lição',
      items: [
        { en: 'I know "how are you?" is a greeting in English.', pt: 'Sei que "how are you?" é um cumprimento em inglês.' },
        { en: 'I can ask a real question with a reason.', pt: 'Sei fazer uma pergunta de verdade, com um motivo.' },
        { en: 'I give the other person permission to say no.', pt: 'Dou à outra pessoa a permissão de dizer não.' },
        { en: 'I can say "I am around".', pt: 'Sei dizer "I am around".' },
      ],
      doneMessage: 'a pergunta está no lugar. A próxima lição é sobre nomear o que se sente.',
      openMessage: 'a classificação cumprimento/pergunta é a lição inteira.',
    },
  ],
  insights: {
    kicker: 'Sacadas · did you know?',
    title: 'Perguntar em inglês',
    intro: 'Três diferenças culturais.',
    cards: [
      { en: '"How are you?" from a shop assistant is not an invitation to talk. Answer "good, thanks, you?" and both of you move on.', pt: '"How are you?" de um atendente de loja não é convite para conversar. Responda "good, thanks, you?" e os dois seguem em frente.' },
      { en: 'To ask for real, add a reason: "you seemed quiet this week". The observation is what makes the question credible.', pt: 'Para perguntar de verdade, acrescente um motivo: "você pareceu quieta essa semana". A observação é o que torna a pergunta crível.' },
      { en: '"I am around" is the lightest offer of presence in English. It promises nothing and opens everything.', pt: '"I am around" é a oferta de presença mais leve do inglês. Não promete nada e abre tudo.' },
    ],
  },
  takeaways: [
    'How have you been, actually?',
    'To be honest, not great.',
    'I am around whenever.',
  ],
  celebrate: {
    en: 'You can ask a question that gets a real answer.',
    pt: 'Você já faz uma pergunta que recebe resposta de verdade.',
  },
},

{
  title: 'Naming What You Feel',
  focus: 'Vocabulário de estado',
  difficulty: 'Iniciante',
  character: 'us-female',
  image: '/faapatendimento/img/livre/foto/mental.jpg',
  imageCaption: 'Dar nome ao que se sente é metade do caminho — em qualquer idioma.',
  objective: 'Nomear estados em inglês com precisão — a diferença entre cansado, sobrecarregado e esgotado.',
  intro: [
    'In Portuguese we say "estou cansado" for almost everything. English separates it into three different words, and the difference matters.',
    '<strong>Tired</strong> is a night of bad sleep. <strong>Overwhelmed</strong> is too much at once. <strong>Burned out</strong> is months of it.',
  ],
  introPt: [
    'Em português a gente diz "estou cansado" para quase tudo. O inglês separa isso em três palavras diferentes, e a diferença importa.',
    '<strong>Tired</strong> é uma noite mal dormida. <strong>Overwhelmed</strong> é coisa demais de uma vez. <strong>Burned out</strong> é meses disso.',
  ],
  vocab: [
    { en: 'tired', pt: 'cansado', example: 'I am just tired today.' },
    { en: 'overwhelmed', pt: 'sobrecarregado, soterrado', example: 'I am a bit overwhelmed this week.' },
    { en: 'burned out', pt: 'esgotado', example: 'That is burnout, not laziness.' },
    { en: 'anxious', pt: 'ansioso', example: 'I get anxious before presentations.' },
    { en: 'to have a lot on my plate', pt: 'estar com muita coisa', example: 'I have a lot on my plate right now.' },
  ],
  exercises: [
    {
      type: 'categorize',
      title: 'Qual é o tamanho do cansaço?',
      badge: 'Classifique',
      instruction: 'Classifique cada situação pela palavra que ela pede.',
      categories: [
        { id: 'tired', name: 'Tired · uma noite ruim', short: 'Tired' },
        { id: 'over', name: 'Overwhelmed · coisa demais agora', short: 'Overwhelmed' },
        { id: 'burn', name: 'Burned out · meses disso', short: 'Burned out' },
      ],
      items: [
        { text: 'I slept badly and I have a long day ahead.', cat: 'tired' },
        { text: 'Four deadlines landed on the same afternoon.', cat: 'over' },
        { text: 'I have not felt rested since March.', cat: 'burn' },
        { text: 'I stayed up late watching a series.', cat: 'tired' },
        { text: 'Everything came at once this week.', cat: 'over' },
        { text: 'I do not care about work I used to love.', cat: 'burn' },
      ],
      explanation: 'Uma noite, uma semana, um semestre. Três palavras, três tamanhos.',
    },
    {
      type: 'wordBank',
      title: 'Diga como você está',
      instruction: 'Complete com o banco de palavras.',
      bank: ['tired', 'overwhelmed', 'burnout', 'anxious', 'plate'],
      items: [
        { text: 'I am just ___ today — I slept badly.', answer: 'tired' },
        { text: 'I am a bit ___ this week, everything came at once.', answer: 'overwhelmed' },
        { text: 'That is not laziness, that is ___ .', answer: 'burnout' },
        { text: 'I get ___ before presentations.', answer: 'anxious' },
        { text: 'I have a lot on my ___ right now.', answer: 'plate' },
      ],
      explanation: 'Cinco frases. Elas servem para você e para entender um colega.',
    },
    {
      type: 'errorSpot',
      title: 'Ache a palavra errada',
      badge: 'Ache o erro',
      instruction: 'Uma palavra errada por frase. Clique nela.',
      items: [
        { sentence: 'I am with a lot of work this week.', wrong: 'with', fix: 'have a lot of', why: 'Em inglês se <strong>tem</strong> trabalho: I have a lot of work.' },
        { sentence: 'I am very anxious of the presentation.', wrong: 'of', fix: 'about', why: '<strong>anxious about</strong>, nunca "anxious of".' },
        { sentence: 'I am burning out since March.', wrong: 'am', fix: 'have been', why: 'Com "since" o inglês pede present perfect: <strong>I have been burning out</strong>.' },
        { sentence: 'I feel me overwhelmed.', wrong: 'me', fix: '(corte)', why: 'Sem reflexivo: <strong>I feel overwhelmed</strong>.' },
      ],
      explanation: 'Have work, anxious about, since + present perfect, feel sem "me". Quatro correções.',
    },
    {
      type: 'checkOff',
      title: 'Antes de fechar esta lição',
      items: [
        { en: 'I know the difference between tired, overwhelmed and burned out.', pt: 'Sei a diferença entre tired, overwhelmed e burned out.' },
        { en: 'I say "anxious about", not "anxious of".', pt: 'Digo "anxious about", não "anxious of".' },
        { en: 'I say "I have a lot of work", not "I am with work".', pt: 'Digo "I have a lot of work", não "I am with work".' },
        { en: 'I can name my state without dramatising it.', pt: 'Sei nomear o meu estado sem dramatizar.' },
      ],
      doneMessage: 'vocabulário no lugar. A próxima lição é sobre limites.',
      openMessage: 'a classificação por tamanho do cansaço é o que mais importa aqui.',
    },
  ],
  insights: {
    kicker: 'Sacadas · did you know?',
    title: 'Nomear com precisão',
    intro: 'Três razões para escolher a palavra certa.',
    cards: [
      { en: 'Burnout was recognised by the World Health Organization as an occupational phenomenon — not a mood. The word carries weight in English.', pt: 'Burnout foi reconhecido pela Organização Mundial da Saúde como fenômeno ocupacional — não como estado de humor. A palavra tem peso em inglês.' },
      { en: '"Overwhelmed" is the most useful word in this whole lesson. It says "too much at once" without saying "I cannot cope".', pt: '"Overwhelmed" é a palavra mais útil de toda esta lição. Diz "coisa demais de uma vez" sem dizer "não estou dando conta".' },
      { en: 'Naming a state precisely tends to make it smaller. That is true in any language, and it is the reason this vocabulary is worth having.', pt: 'Nomear um estado com precisão tende a diminuí-lo. Isso vale em qualquer idioma, e é a razão de valer a pena ter esse vocabulário.' },
    ],
  },
  takeaways: [
    'I am a bit overwhelmed this week.',
    'I get anxious about presentations.',
    'I have a lot on my plate right now.',
  ],
  celebrate: {
    en: 'Three words instead of one — and each one is more accurate.',
    pt: 'Três palavras no lugar de uma — e cada uma mais precisa.',
  },
},

{
  title: 'Setting Boundaries',
  focus: 'Recusar sem culpa',
  difficulty: 'Intermediário',
  character: 'gb-male',
  image: '/faapatendimento/img/livre/foto/mental.jpg',
  imageCaption: 'Dizer não é uma habilidade — e em outra língua ela precisa de fórmula.',
  objective: 'Estabelecer limites em inglês — recusar pedidos, proteger horário e sair de uma conversa — sem soar hostil.',
  intro: [
    'Saying no in your own language is hard. In a second language it is harder, because the softeners you use without thinking are not there.',
    'The good news: English has <strong>fixed formulas</strong> for this, and formulas can be learned.',
  ],
  introPt: [
    'Dizer não na sua própria língua já é difícil. Numa segunda língua é mais, porque os amortecedores que você usa sem pensar não estão lá.',
    'A boa notícia: o inglês tem <strong>fórmulas fixas</strong> para isso, e fórmula se aprende.',
  ],
  vocab: [
    { en: 'to set boundaries', pt: 'estabelecer limites', example: 'I am learning to set boundaries.' },
    { en: 'I would rather not', pt: 'eu preferiria não', example: 'I would rather not talk about it now.' },
    { en: 'to take on', pt: 'assumir (uma tarefa)', example: 'I cannot take on anything else this week.' },
    { en: 'to have capacity', pt: 'ter espaço na agenda', example: 'I do not have capacity for that right now.' },
    { en: 'to circle back', pt: 'retomar depois', example: 'Can we circle back to this next week?' },
  ],
  exercises: [
    {
      type: 'swipeChoice',
      title: 'Qual recusa funciona?',
      badge: 'A ou B',
      instruction: 'As duas recusam. Escolha a que preserva a relação.',
      items: [
        { prompt: 'Pedem mais uma tarefa numa semana cheia.', a: 'No, I cannot.', b: 'I cannot take that on this week — I could look at it on Monday.', correct: 'b', why: 'Recusa + alternativa com data. Nunca termine no "não".' },
        { prompt: 'Perguntam sobre um assunto pessoal.', a: 'That is none of your business.', b: 'I would rather not get into that, if you do not mind.', correct: 'b', why: '"I would rather not" é a fórmula pronta para recusar sem ofender.' },
        { prompt: 'Mandam mensagem de trabalho às onze da noite.', a: '(responder na hora)', b: 'Just seen this — I will pick it up first thing tomorrow.', correct: 'b', why: 'Responder na hora ensina que você responde na hora. A frase protege o horário sem confronto.' },
        { prompt: 'A reunião está passando do tempo.', a: 'I have to go now.', b: 'I have a hard stop at four — can we circle back to the rest?', correct: 'b', why: '<strong>a hard stop</strong> é o termo exato para "tenho que sair na hora".' },
      ],
      explanation: 'Toda recusa boa tem três partes: o não, o motivo curto e o próximo passo.',
    },
    {
      type: 'sentenceBuild',
      title: 'Monte as três recusas',
      instruction: 'Monte cada frase na ordem certa. Alguns blocos sobram.',
      items: [
        { hint: 'Recusar uma tarefa nova.', answer: 'I cannot take that on this week but I could look at it on Monday', extra: ['take on it', 'will'] },
        { hint: 'Recusar um assunto.', answer: 'I would rather not get into that if you do not mind', extra: ['prefer', 'to'] },
        { hint: 'Encerrar no horário.', answer: 'I have a hard stop at four can we circle back tomorrow', extra: ['hardly', 'return'] },
      ],
      explanation: 'Três frases guardadas e você protege a sua semana inteira em inglês.',
    },
    {
      type: 'multiSelect',
      title: 'O que faz uma recusa funcionar?',
      instruction: 'Marque tudo o que ajuda. Há mais de uma resposta.',
      prompt: 'You need to say no to a colleague you like. What makes it land well?',
      options: [
        { text: 'A short reason, not a long justification.', correct: true },
        { text: 'An alternative with a date.', correct: true },
        { text: 'An apology repeated three times.', correct: false },
        { text: 'Saying it early rather than late.', correct: true },
        { text: 'Explaining everything else you have to do.', correct: false },
        { text: 'A clear "I cannot", not a vague "maybe".', correct: true },
      ],
      explanation: 'Um "não" claro e cedo é mais gentil do que um "talvez" que vira "não" na véspera.',
    },
    {
      type: 'checkOff',
      title: 'Antes de fechar esta lição',
      items: [
        { en: 'I can refuse a task and offer a date.', pt: 'Sei recusar uma tarefa e oferecer uma data.' },
        { en: 'I can use "I would rather not".', pt: 'Sei usar "I would rather not".' },
        { en: 'I can say "I have a hard stop at…".', pt: 'Sei dizer "I have a hard stop at…".' },
        { en: 'I say no early instead of maybe late.', pt: 'Digo não cedo em vez de talvez tarde.' },
      ],
      doneMessage: 'limites em inglês. A última lição da trilha é sobre pedir ajuda.',
      openMessage: 'as três frases do exercício de blocos são o essencial. Guarde elas.',
    },
  ],
  insights: {
    kicker: 'Sacadas · did you know?',
    title: 'Limites em outra língua',
    intro: 'Três coisas que ajudam.',
    cards: [
      { en: '"I would rather not" is the most useful refusal in English. It refuses without giving a reason, and nobody finds it rude.', pt: '"I would rather not" é a recusa mais útil do inglês. Recusa sem dar motivo, e ninguém acha grosseiro.' },
      { en: '"A hard stop" means a time you cannot move. Saying it at the start of a meeting is normal and professional, not impolite.', pt: '"A hard stop" é um horário que não se pode mexer. Dizer isso no começo de uma reunião é normal e profissional, não deselegante.' },
      { en: 'A long justification weakens a refusal. The more you explain, the more it sounds negotiable.', pt: 'Uma justificativa longa enfraquece a recusa. Quanto mais você explica, mais parece negociável.' },
    ],
  },
  takeaways: [
    'I cannot take that on this week — I could look at it on Monday.',
    'I would rather not get into that, if you do not mind.',
    'I have a hard stop at four.',
  ],
  celebrate: {
    en: 'You can say no in English, and still be liked on Monday.',
    pt: 'Você já diz não em inglês e continua bem-vista na segunda.',
  },
},

{
  title: 'Asking for Help',
  focus: 'Pedir apoio e oferecer apoio',
  difficulty: 'Intermediário',
  character: 'us-female',
  image: '/faapatendimento/img/livre/foto/mental.jpg',
  imageCaption: 'Existe um verbo em inglês só para isso: reach out.',
  objective: 'Pedir e oferecer apoio em inglês com naturalidade — inclusive quando o assunto é difícil.',
  intro: [
    'English has a verb that Portuguese does not have in one piece: <strong>to reach out</strong>. It means to ask for support, and it carries no weight of weakness.',
    'This lesson has both sides: how to ask, and what to say when someone asks you.',
  ],
  introPt: [
    'O inglês tem um verbo que o português não tem em uma peça só: <strong>to reach out</strong>. Significa procurar apoio, e não carrega nenhum peso de fraqueza.',
    'Esta lição tem os dois lados: como pedir, e o que dizer quando pedem a você.',
  ],
  vocab: [
    { en: 'to reach out', pt: 'procurar alguém, pedir apoio', example: 'Please reach out if you need anything.' },
    { en: 'to be there for someone', pt: 'estar presente para alguém', example: 'I am here for you.' },
    { en: 'to take something off your plate', pt: 'tirar algo da sua carga', example: 'Can I take something off your plate?' },
    { en: 'to talk it through', pt: 'conversar até clarear', example: 'Do you want to talk it through?' },
    { en: 'no pressure', pt: 'sem pressão', example: 'No pressure either way.' },
  ],
  exercises: [
    {
      type: 'wordBank',
      title: 'Os dois lados da conversa',
      instruction: 'Complete com o banco de palavras.',
      bank: ['reach', 'here', 'plate', 'through', 'pressure'],
      items: [
        { text: 'Please ___ out if you need anything.', answer: 'reach' },
        { text: 'I am ___ for you, whatever you decide.', answer: 'here' },
        { text: 'Can I take something off your ___ this week?', answer: 'plate' },
        { text: 'Do you want to talk it ___ ?', answer: 'through' },
        { text: 'No ___ either way.', answer: 'pressure' },
      ],
      explanation: '"No pressure either way" é a frase que faz a oferta ser aceitável — porque deixa recusar.',
    },
    {
      type: 'serialChoice',
      title: 'O que dizer quando alguém abre',
      badge: 'Escolha certa',
      instruction: 'Um colega acabou de contar algo difícil. Escolha a resposta.',
      items: [
        {
          prompt: 'Primeira reação.',
          options: [
            { text: 'Thank you for telling me. That sounds really hard.', correct: true },
            { text: 'I know exactly how you feel.' },
            { text: 'You should try to relax more.' },
          ],
          why: 'Agradecer a confiança e reconhecer o tamanho. Nada de conselho na primeira frase.',
        },
        {
          prompt: 'Oferecendo algo concreto.',
          options: [
            { text: 'Can I take something off your plate this week?', correct: true },
            { text: 'Let me know if you need anything.' },
            { text: 'Everything happens for a reason.' },
          ],
          why: 'Oferta específica se aceita; oferta vaga fica no ar.',
        },
        {
          prompt: 'Fechando sem pressionar.',
          options: [
            { text: 'I am around whenever — no pressure either way.', correct: true },
            { text: 'Call me tonight, I insist.' },
            { text: 'Just try not to think about it.' },
          ],
          why: 'Disponibilidade sem cobrança é o que faz a pessoa voltar.',
        },
      ],
      explanation: 'Reconhecer → oferecer algo concreto → ficar disponível sem cobrar. Nessa ordem.',
    },
    {
      type: 'swipeChoice',
      title: 'Ajuda que ajuda',
      badge: 'A ou B',
      instruction: 'As duas são bem-intencionadas. Escolha a que serve.',
      items: [
        { prompt: 'Oferecendo apoio.', a: 'Let me know if you need anything.', b: 'I am free Thursday afternoon — can I help with the report?', correct: 'b', why: 'A oferta vaga põe o trabalho de pedir em quem já está sobrecarregado.' },
        { prompt: 'Respondendo a algo difícil.', a: 'I know exactly how you feel.', b: 'I cannot imagine. Thank you for telling me.', correct: 'b', why: 'Quase nunca sabemos exatamente como o outro se sente. Admitir isso vale mais.' },
        { prompt: 'Alguém não quer falar.', a: 'It helps to talk, you know.', b: 'Understood. The offer stands whenever.', correct: 'b', why: 'Insistir transforma apoio em pressão.' },
      ],
      explanation: 'A regra: seja específico na oferta e leve na cobrança.',
    },
    {
      type: 'checkOff',
      title: 'Antes de fechar a trilha',
      items: [
        { en: 'I can use "reach out" naturally.', pt: 'Uso "reach out" com naturalidade.' },
        { en: 'I make specific offers, not vague ones.', pt: 'Faço ofertas específicas, não vagas.' },
        { en: 'I do not say "I know exactly how you feel".', pt: 'Não digo "I know exactly how you feel".' },
        { en: 'I add "no pressure either way".', pt: 'Acrescento "no pressure either way".' },
      ],
      doneMessage: 'trilha concluída. Os outros tópicos de Mind & Body estão na home.',
      openMessage: 'as três respostas do exercício de escolha são o roteiro. Volte nelas.',
    },
  ],
  insights: {
    kicker: 'Sacadas · did you know?',
    title: 'Apoiar em inglês',
    intro: 'Três frases que mudam a conversa.',
    cards: [
      { en: '"Reach out" became common in English precisely because it removes the shame from asking. There is no equivalent single verb in Portuguese.', pt: '"Reach out" se tornou comum em inglês justamente porque tira a vergonha de pedir. Não há um verbo único equivalente em português.' },
      { en: '"Let me know if you need anything" almost never produces a request. A specific offer with a day and a task does.', pt: '"Let me know if you need anything" quase nunca gera um pedido. Uma oferta específica, com dia e tarefa, gera.' },
      { en: '"I cannot imagine" is more honest than "I know how you feel", and people receive it much better.', pt: '"I cannot imagine" é mais honesto que "I know how you feel", e as pessoas recebem muito melhor.' },
    ],
  },
  takeaways: [
    'Please reach out if you need anything.',
    'Can I take something off your plate this week?',
    'I am around whenever — no pressure either way.',
  ],
  celebrate: {
    en: 'You can ask for help, and you can offer it in a way people accept.',
    pt: 'Você já pede ajuda, e oferece de um jeito que as pessoas aceitam.',
  },
},
];
