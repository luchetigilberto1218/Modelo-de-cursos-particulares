/* Trilha 2 — Educação: Brasil e o mundo.
   O vocabulário que aparece em toda conversa com escola internacional,
   coordenador estrangeiro ou família recém-chegada. */
module.exports = [

/* ─────────────────────────────── 1 ─────────────────────────────── */
{
  title: 'The Brazilian education system',
  focus: 'Explicar como funciona a educação no Brasil',
  character: 'us-female',
  image: '/faapatendimento/img/g9.jpg',
  imageCaption: 'Aula prática no campus: o sistema brasileiro em ação.',
  objective: 'Explicar, em inglês e em poucas frases, como funciona o sistema educacional brasileiro — etapas, calendário e entrada na universidade.',
  intro: [
    'Sooner or later somebody from abroad asks: <em>"So how does school work in Brazil?"</em>',
    'The answer has three parts: <strong>basic education</strong> (from kindergarten to high school), the <strong>entrance exam</strong>, and <strong>university</strong>.',
    'Two facts surprise everyone: our school year runs February to December, and our best universities are public and free.',
  ],
  introPt: [
    'Mais cedo ou mais tarde alguém de fora pergunta: <em>"Como funciona a escola no Brasil?"</em>',
    'A resposta tem três partes: <strong>educação básica</strong> (do infantil ao médio), o <strong>vestibular</strong> e a <strong>universidade</strong>.',
    'Dois fatos surpreendem todo mundo: o nosso ano letivo vai de fevereiro a dezembro, e as nossas melhores universidades são públicas e gratuitas.',
  ],
  vocab: [
    { en: 'basic education', pt: 'educação básica', example: 'Basic education goes up to the end of high school.' },
    { en: 'entrance exam', pt: 'vestibular / prova de entrada', example: 'Students take an entrance exam to get into university.' },
    { en: 'tuition-free', pt: 'gratuito (sem mensalidade)', example: 'Public universities are tuition-free.' },
    { en: 'state / federal', pt: 'estadual / federal', example: 'There are state and federal universities.' },
    { en: 'compulsory', pt: 'obrigatório', example: 'School is compulsory from age four to seventeen.' },
    { en: 'to apply to', pt: 'candidatar-se a', example: 'She applied to three universities.' },
  ],
  exercises: [
    {
      type: 'wordBank',
      title: 'O sistema em cinco frases',
      instruction: 'Complete com o banco de palavras.',
      bank: ['basic', 'compulsory', 'entrance', 'tuition-free', 'February'],
      items: [
        { text: '___ education goes from kindergarten to high school.', answer: 'basic' },
        { text: 'School is ___ for children and teenagers.', answer: 'compulsory' },
        { text: 'To get into university, students take an ___ exam.', answer: 'entrance' },
        { text: 'Public universities are ___ .', answer: 'tuition-free' },
        { text: 'Our school year starts in ___ .', answer: 'February' },
      ],
      explanation: 'Cinco frases dão conta do sistema inteiro. Guarde essas.',
    },
    {
      type: 'readingTask',
      title: 'Leia e responda',
      badge: 'Leia e responda',
      heading: 'Education in Brazil · a short guide for visitors',
      instruction: 'Leia o guia e responda. Tudo o que você precisa está no texto.',
      passage: [
        'Basic education in Brazil has three stages: early years, nine years of fundamental education, and three years of secondary school. The school year runs from February to December, with a long break in July.',
        'At the end of secondary school, most students sit the ENEM, a national exam. Results from the ENEM are used both by public universities and by many private ones.',
        'Public universities are tuition-free, but places are limited and competition is high. Private institutions charge tuition and usually run their own entrance exams as well.',
      ],
      questions: [
        {
          prompt: 'How long is fundamental education?',
          options: [
            { text: 'Nine years.', correct: true },
            { text: 'Three years.' },
            { text: 'Twelve years.' },
          ],
          why: '"nine years of fundamental education".',
        },
        {
          prompt: 'What is the ENEM used for?',
          options: [
            { text: 'By public universities and many private ones.', correct: true },
            { text: 'Only by private schools.' },
            { text: 'To finish primary school.' },
          ],
          why: 'É o exame que abre as duas portas — e a explicação mais útil para um estrangeiro.',
        },
        {
          prompt: 'Why is it hard to get into a public university?',
          options: [
            { text: 'Places are limited and competition is high.', correct: true },
            { text: 'Because tuition is very expensive.' },
            { text: 'Because they only accept foreign students.' },
          ],
          why: 'Gratuito + concorrido é a combinação que estrangeiro custa a entender.',
        },
      ],
    },
    {
      type: 'trueFalse',
      title: 'Verdadeiro ou falso?',
      instruction: 'Sobre o sistema brasileiro, como você explicaria a um estrangeiro.',
      items: [
        { text: 'In Brazil, the school year runs from September to June.', answer: false, why: 'Vai de fevereiro a dezembro. Essa é a primeira surpresa de qualquer família estrangeira.' },
        { text: 'Public universities in Brazil are tuition-free.', answer: true, why: 'Gratuitas — e por isso muito concorridas.' },
        { text: 'The ENEM is taken at the end of secondary school.', answer: true, why: 'No fim do ensino médio.' },
        { text: 'Private universities never run their own entrance exams.', answer: false, why: 'Muitas rodam o próprio vestibular além de aceitar o ENEM.' },
      ],
      explanation: 'Se souber esses quatro pontos, você explica o Brasil inteiro numa conversa de elevador.',
    },
    {
      type: 'errorSpot',
      title: 'Ache a palavra errada',
      badge: 'Ache o erro',
      instruction: 'Uma palavra errada em cada frase. Clique nela.',
      items: [
        { sentence: 'Students make an entrance exam at the end of school.', wrong: 'make', fix: 'take / sit', why: 'Prova em inglês se <strong>take</strong> (EUA) ou se <strong>sit</strong> (Reino Unido). Nunca "make".' },
        { sentence: 'Public universities are free of tuition fee.', wrong: 'fee', fix: 'fees', why: 'A expressão consagrada é <strong>tuition-free</strong> ou "free of tuition fees".' },
        { sentence: 'She applied for three universities.', wrong: 'for', fix: 'to', why: 'Candidatar-se a uma instituição é <strong>apply to</strong>. "Apply for" é para uma vaga ou bolsa.' },
        { sentence: 'The scholar year starts in February.', wrong: 'scholar', fix: 'school', why: '<strong>School year</strong> — nunca "scholar year".' },
      ],
      explanation: 'Take an exam, apply to a university, the school year. Três colocações que se colam no ouvido.',
    },
    {
      type: 'checkOff',
      title: 'Antes de fechar esta lição',
      items: [
        { en: 'I can describe the three stages of basic education.', pt: 'Sei descrever as três etapas da educação básica.' },
        { en: 'I can explain what the ENEM is.', pt: 'Sei explicar o que é o ENEM.' },
        { en: 'I can say that public universities are tuition-free but competitive.', pt: 'Sei dizer que as universidades públicas são gratuitas, mas concorridas.' },
        { en: 'I say "take an exam", not "make an exam".', pt: 'Digo "take an exam", não "make an exam".' },
      ],
      doneMessage: 'sistema brasileiro explicado. Agora o vocabulário de matrícula e mensalidade.',
      openMessage: 'reveja a leitura — as três partes do sistema estão lá.',
    },
  ],
  insights: {
    kicker: 'Sacadas · did you know?',
    title: 'O que soa estranho para quem vem de fora',
    intro: 'Três pontos que sempre geram pergunta.',
    cards: [
      { en: 'Our school year matches the calendar year. In the northern hemisphere the year is split in two — that is why a January arrival is complicated.', pt: 'O nosso ano letivo coincide com o ano civil. No hemisfério norte o ano é partido ao meio — por isso uma chegada em janeiro é complicada.' },
      { en: 'In most countries the best universities are private. In Brazil many of the best are public and free, which surprises almost every visitor.', pt: 'Na maioria dos países as melhores universidades são particulares. No Brasil muitas das melhores são públicas e gratuitas, o que surpreende quase todo visitante.' },
      { en: 'The word "college" does not work here. Say "university" for higher education and "school" for basic education.', pt: 'A palavra "college" não funciona aqui. Diga "university" para o superior e "school" para a educação básica.' },
    ],
  },
  takeaways: [
    'Basic education has three stages and the school year runs February to December.',
    'Students take the ENEM at the end of secondary school.',
    'Public universities are tuition-free but very competitive.',
  ],
  celebrate: {
    en: 'You can explain an entire national system in four sentences.',
    pt: 'Você explica um sistema nacional inteiro em quatro frases.',
  },
},

/* ─────────────────────────────── 2 ─────────────────────────────── */
{
  title: 'Enrolment, tuition and fees',
  focus: 'O vocabulário de matrícula e pagamento',
  character: 'gb-female',
  image: '/faapatendimento/img/g6.jpg',
  imageCaption: 'Onde as conversas de matrícula acontecem: mesa, cadeira e uma decisão de família.',
  objective: 'Falar sobre matrícula, mensalidade, descontos e prazos em inglês — sem constrangimento e sem erro de número.',
  intro: [
    'Money is the part of the conversation people most avoid — and the part families most need.',
    'In English, three words carry almost everything: <strong>enrolment</strong> (getting in), <strong>tuition</strong> (what you pay for the course) and <strong>fee</strong> (any other charge).',
    'Say them clearly and the whole conversation gets easier.',
  ],
  introPt: [
    'Dinheiro é a parte da conversa que as pessoas mais evitam — e a parte de que as famílias mais precisam.',
    'Em inglês, três palavras carregam quase tudo: <strong>enrolment</strong> (entrar), <strong>tuition</strong> (o que se paga pelo curso) e <strong>fee</strong> (qualquer outra taxa).',
    'Diga essas três com clareza e a conversa inteira fica mais fácil.',
  ],
  vocab: [
    { en: 'enrolment / to enrol', pt: 'matrícula / matricular-se', example: 'Enrolment for next year opens in October.' },
    { en: 'tuition', pt: 'mensalidade / anuidade do curso', example: 'Tuition is paid monthly.' },
    { en: 'fee', pt: 'taxa', example: 'There is a small registration fee.' },
    { en: 'instalment', pt: 'parcela', example: 'You can pay in twelve instalments.' },
    { en: 'discount / waiver', pt: 'desconto / isenção', example: 'Employees are entitled to a discount.' },
    { en: 'deadline', pt: 'prazo final', example: 'The deadline is the fifth of each month.' },
  ],
  exercises: [
    {
      type: 'matching',
      title: 'Associe cada termo',
      instruction: 'Clique na caixa à direita e escolha a definição certa.',
      pairs: [
        { left: 'enrolment', right: 'o ato de se matricular e garantir a vaga' },
        { left: 'tuition', right: 'o valor cobrado pelo curso em si' },
        { left: 'fee', right: 'qualquer taxa avulsa, além da mensalidade' },
        { left: 'instalment', right: 'cada parcela do pagamento' },
        { left: 'deadline', right: 'a data limite para pagar ou entregar' },
      ],
      explanation: 'Tuition é o curso. Fee é o resto. Essa distinção evita mal-entendido caro.',
    },
    {
      type: 'dialogue',
      title: 'Quanto custa?',
      badge: 'Diálogo',
      scene: 'Uma mãe britânica pergunta sobre valores pela primeira vez.',
      lines: [
        { who: 'Parent', voice: 'gb-female', en: 'Could you tell me about the fees? I have no idea what to expect.', pt: 'Você poderia me falar sobre os valores? Não faço ideia do que esperar.' },
        { who: 'You', voice: 'us-female', en: 'Of course. There is a registration fee when you enrol, and then tuition, paid monthly.', pt: 'Claro. Há uma taxa de matrícula quando você se inscreve, e depois a mensalidade, paga mensalmente.' },
        { who: 'Parent', voice: 'gb-female', en: 'Is the registration fee refundable?', pt: 'A taxa de matrícula é reembolsável?' },
        { who: 'You', voice: 'us-female', en: 'Let me check that for you and confirm it by email today — I would rather give you the exact rule.', pt: 'Deixe-me verificar isso e te confirmo por e-mail hoje — prefiro te dar a regra exata.' },
        { who: 'Parent', voice: 'gb-female', en: 'I appreciate that. And when is the payment due?', pt: 'Agradeço. E quando vence o pagamento?' },
        { who: 'You', voice: 'us-female', en: 'On the fifth of each month. If the fifth is a weekend, the next working day.', pt: 'No dia cinco de cada mês. Se o dia cinco cair no fim de semana, no próximo dia útil.' },
      ],
      questions: [
        {
          q: 'What does the employee do when unsure about the refund rule?',
          options: [
            { text: 'Says she will check and confirm by email today.', correct: true },
            { text: 'Gives an approximate answer.' },
            { text: 'Says it is not her department.' },
          ],
          why: 'Em conversa sobre dinheiro, chutar é o pior caminho. Verificar com prazo é o melhor.',
        },
        {
          q: 'When is the payment due?',
          options: [
            { text: 'On the fifth of each month.', correct: true },
            { text: 'At the end of the year.' },
            { text: 'Whenever the family prefers.' },
          ],
          why: '<em>Due</em> é a palavra do vencimento: "the payment is due on the fifth".',
        },
      ],
      explanation: 'Repare na estrutura: taxa de entrada + mensalidade + vencimento. Nessa ordem, sempre.',
    },
    {
      type: 'serialChoice',
      title: 'A palavra certa sobre dinheiro',
      badge: 'Escolha certa',
      instruction: 'Escolha a opção que um falante nativo usaria.',
      items: [
        { prompt: 'The payment is ___ on the fifth.', options: [{ text: 'due', correct: true }, { text: 'duty' }, { text: 'owed to' }], why: '<strong>due</strong> = com vencimento em.' },
        { prompt: 'You can pay in twelve monthly ___ .', options: [{ text: 'instalments', correct: true }, { text: 'parcels' }, { text: 'portions' }], why: 'Parcela é <strong>instalment</strong>. "Parcel" é encomenda.' },
        { prompt: 'Employees are ___ to a discount.', options: [{ text: 'entitled', correct: true }, { text: 'entitle' }, { text: 'rightful' }], why: '<strong>to be entitled to</strong> = ter direito a.' },
        { prompt: 'The registration fee is not ___ .', options: [{ text: 'refundable', correct: true }, { text: 'returnable' }, { text: 'givable' }], why: 'Dinheiro que volta é <strong>refundable</strong>. "Returnable" é produto.' },
      ],
      explanation: 'Quatro colocações fixas. Ninguém as improvisa — todo mundo as decora.',
    },
    {
      type: 'listenChoose',
      title: 'Ouça os números',
      badge: 'Ouça e escolha',
      instruction: 'Números são o que mais se erra ao telefone. Ouça, e use o transcript se precisar.',
      items: [
        {
          audio: 'The registration fee is two hundred and fifty reais.',
          pt: 'A taxa de matrícula é de duzentos e cinquenta reais.',
          options: [
            { text: 'R$ 250', correct: true },
            { text: 'R$ 215' },
            { text: 'R$ 2,050' },
          ],
          why: 'two hundred and fifty = 250. Repare no "and" britânico antes da dezena.',
        },
        {
          audio: 'Payment is due on the fifteenth, not on the fiftieth.',
          pt: 'O pagamento vence no dia quinze, não no quinquagésimo.',
          options: [
            { text: 'The fifteenth.', correct: true },
            { text: 'The fiftieth.' },
            { text: 'The fifth.' },
          ],
          why: 'fifTEEN tem a tônica no fim; FIFty, no começo. Essa é a diferença que salva o dia.',
        },
        {
          audio: 'You can pay in twelve instalments with no extra charge.',
          pt: 'Você pode pagar em doze parcelas sem custo adicional.',
          options: [
            { text: 'Twelve instalments, no extra charge.', correct: true },
            { text: 'Twenty instalments with interest.' },
            { text: 'Two instalments only.' },
          ],
          why: '<em>No extra charge</em> = sem acréscimo. Frase de ouro numa negociação.',
        },
      ],
      explanation: 'Sempre repita o número de volta: "so, two hundred and fifty — is that right?".',
    },
    {
      type: 'checkOff',
      title: 'Antes de fechar esta lição',
      items: [
        { en: 'I know the difference between tuition and fee.', pt: 'Sei a diferença entre tuition e fee.' },
        { en: 'I can say when a payment is due.', pt: 'Sei dizer quando um pagamento vence.' },
        { en: 'I can hear the difference between fifteen and fifty.', pt: 'Consigo ouvir a diferença entre fifteen e fifty.' },
        { en: 'When I am not sure, I check and confirm by email.', pt: 'Quando não tenho certeza, eu verifico e confirmo por e-mail.' },
      ],
      doneMessage: 'dinheiro resolvido em inglês. A próxima lição sai do Brasil.',
      openMessage: 'volte ao exercício de escuta — número é o que mais gera retrabalho.',
    },
  ],
  insights: {
    kicker: 'Sacadas · did you know?',
    title: 'Falar de dinheiro sem constrangimento',
    intro: 'Três hábitos que deixam a conversa profissional.',
    cards: [
      { en: 'Repeat the number back: "So, two hundred and fifty — is that right?" It costs two seconds and prevents a week of confusion.', pt: 'Repita o número de volta: "So, two hundred and fifty — is that right?" Custa dois segundos e evita uma semana de confusão.' },
      { en: 'British English says "two hundred AND fifty"; American English often drops the "and". Both are correct.', pt: 'O inglês britânico diz "two hundred AND fifty"; o americano costuma cortar o "and". Os dois estão certos.' },
      { en: 'Never guess a rule about refunds. "Let me confirm that by email today" is a professional answer, not a weak one.', pt: 'Nunca chute uma regra de reembolso. "Let me confirm that by email today" é uma resposta profissional, não fraca.' },
    ],
  },
  takeaways: [
    'There is a registration fee, and then tuition paid monthly.',
    'The payment is due on the fifth of each month.',
    'Let me check that and confirm it by email today.',
  ],
  celebrate: {
    en: 'Money conversations — handled clearly and without guessing.',
    pt: 'Conversa de dinheiro — resolvida com clareza e sem chute.',
  },
},

/* ─────────────────────────────── 3 ─────────────────────────────── */
{
  title: 'Education around the world',
  focus: 'Comparar sistemas de ensino em inglês',
  character: 'gb-male',
  image: '/faapatendimento/img/g12.jpg',
  imageCaption: 'A mesa de trabalho muda de país para país — o esforço, não.',
  objective: 'Comparar o sistema brasileiro com o americano, o britânico e o alemão — e usar comparativos em inglês sem errar.',
  intro: [
    'When a family arrives from abroad, they compare everything to what they know. Your job is to translate between systems.',
    'Three references cover almost all of them: the <strong>American</strong> (K-12, high school diploma, GPA), the <strong>British</strong> (GCSEs at sixteen, A-levels at eighteen) and the <strong>German</strong> (Gymnasium, Abitur).',
    'And to compare, you need one grammar point: <strong>comparatives</strong>.',
  ],
  introPt: [
    'Quando uma família chega de fora, ela compara tudo com o que conhece. O seu trabalho é traduzir entre sistemas.',
    'Três referências dão conta de quase todas: a <strong>americana</strong> (K-12, high school diploma, GPA), a <strong>britânica</strong> (GCSEs aos dezesseis, A-levels aos dezoito) e a <strong>alemã</strong> (Gymnasium, Abitur).',
    'E para comparar, você precisa de um ponto de gramática: os <strong>comparativos</strong>.',
  ],
  vocab: [
    { en: 'K-12', pt: 'da pré-escola ao fim do ensino médio (EUA)', example: 'K-12 covers the whole of basic education.' },
    { en: 'high school diploma', pt: 'diploma de ensino médio americano', example: 'She finished with a high school diploma.' },
    { en: 'GPA (grade point average)', pt: 'média de notas (EUA)', example: 'Universities look at the GPA.' },
    { en: 'A-levels', pt: 'exames britânicos do fim do ensino médio', example: 'He is taking three A-levels.' },
    { en: 'Abitur', pt: 'exame alemão de conclusão do ensino médio', example: 'The Abitur opens the door to German universities.' },
    { en: 'transcript', pt: 'histórico escolar', example: 'Please send the school transcript.' },
  ],
  exercises: [
    {
      type: 'matching',
      title: 'Cada país, o seu nome',
      instruction: 'Associe o termo ao sistema a que ele pertence.',
      pairs: [
        { left: 'K-12 and GPA', right: 'sistema americano' },
        { left: 'GCSEs and A-levels', right: 'sistema britânico' },
        { left: 'Gymnasium and Abitur', right: 'sistema alemão' },
        { left: 'ENEM and vestibular', right: 'sistema brasileiro' },
        { left: 'transcript', right: 'o histórico escolar, pedido em todos eles' },
      ],
      explanation: 'Reconhecer o vocabulário do outro é meio caminho para ser entendido.',
    },
    {
      type: 'dropdownGap',
      title: 'Complete a comparação',
      badge: 'Complete o texto',
      instruction: 'Escolha a forma comparativa certa em cada lacuna.',
      text: 'The Brazilian school year is ___ than the American one in its calendar: ours follows the civil year. British students take exams ___ than Brazilian students, at sixteen and again at eighteen. German secondary school is ___ demanding in its final exam, the Abitur. In general, our university entrance is ___ competitive than in many countries, because public places are free. And the paperwork is ___ everywhere: they all ask for a transcript.',
      gaps: [
        { options: ['different', 'more different', 'differenter'], answer: 'different', why: '<strong>Different</strong> não vira comparativo com -er nem com more; ele já compara sozinho, com <em>than</em> ou <em>from</em>.' },
        { options: ['more often', 'oftener', 'most often'], answer: 'more often', why: 'Advérbios longos usam <strong>more</strong>.' },
        { options: ['very', 'more', 'much'], answer: 'very', why: 'Aqui não há comparação: é intensidade. <strong>very demanding</strong>.' },
        { options: ['more', 'most', 'much'], answer: 'more', why: 'Comparativo de adjetivo longo: <strong>more competitive than</strong>.' },
        { options: ['the same', 'the samer', 'more same'], answer: 'the same', why: '<strong>the same everywhere</strong> — igual em todo lugar.' },
      ],
      explanation: 'Adjetivo curto ganha -er; adjetivo longo ganha more. E "different" nunca leva nenhum dos dois.',
    },
    {
      type: 'oddOneOut',
      title: 'Qual não pertence?',
      badge: 'Odd one out',
      instruction: 'Em cada linha, clique na forma que NÃO existe em inglês.',
      groups: [
        { items: ['more difficult', 'harder', 'more harder'], odd: 'more harder', why: 'Ou -er, ou more — nunca os dois juntos.' },
        { items: ['different from', 'different than', 'different of'], odd: 'different of', why: '"Different from" (UK) e "different than" (US) existem; "different of" não.' },
        { items: ['the same as', 'the same than', 'as big as'], odd: 'the same than', why: 'É sempre <strong>the same as</strong>.' },
        { items: ['as competitive as', 'so competitive as', 'not as competitive as'], odd: 'so competitive as', why: 'Na afirmativa é <strong>as … as</strong>. "So … as" só aparece na negativa, e mesmo assim é raro.' },
      ],
      explanation: 'Comparar é a operação mais comum quando se fala de educação. Vale afinar.',
    },
    {
      type: 'dialogue',
      title: 'Como isso se compara ao que a gente conhece?',
      badge: 'Diálogo',
      scene: 'Um coordenador de uma escola alemã quer entender o percurso brasileiro.',
      lines: [
        { who: 'Coordinator', voice: 'gb-male', en: 'In Germany, students finish with the Abitur. What is the equivalent here?', pt: 'Na Alemanha, os alunos terminam com o Abitur. Qual é o equivalente aqui?' },
        { who: 'You', voice: 'us-female', en: 'The closest thing is the ENEM. It is a national exam at the end of secondary school.', pt: 'O mais próximo é o ENEM. É um exame nacional no fim do ensino médio.' },
        { who: 'Coordinator', voice: 'gb-male', en: 'And is it required for every university?', pt: 'E ele é exigido por todas as universidades?' },
        { who: 'You', voice: 'us-female', en: 'Not always. Public universities rely on it heavily; private ones may also run their own exam.', pt: 'Nem sempre. As públicas dependem muito dele; as particulares podem ter o próprio exame também.' },
        { who: 'Coordinator', voice: 'gb-male', en: 'That is different from Germany, then.', pt: 'Então é diferente da Alemanha.' },
        { who: 'You', voice: 'us-female', en: 'It is. The idea is the same, but the way in is more flexible here.', pt: 'É sim. A ideia é a mesma, mas o caminho de entrada aqui é mais flexível.' },
      ],
      questions: [
        {
          q: 'What does the employee compare the ENEM to?',
          options: [
            { text: 'The Abitur.', correct: true },
            { text: 'The GPA.' },
            { text: 'A high school diploma.' },
          ],
          why: 'Traduzir para a referência do outro é a técnica inteira desta lição.',
        },
        {
          q: 'Which sentence sums up the difference politely?',
          options: [
            { text: '"The idea is the same, but the way in is more flexible here."', correct: true },
            { text: '"Our system is better."' },
            { text: '"It is impossible to compare."' },
          ],
          why: 'Comece pelo que é igual, termine pelo que muda. Nunca compare por qualidade.',
        },
      ],
      explanation: '"The idea is the same, but…" é a frase mais útil de toda comparação entre países.',
    },
    {
      type: 'checkOff',
      title: 'Antes de fechar esta lição',
      items: [
        { en: 'I can name the key terms of three foreign systems.', pt: 'Sei nomear os termos-chave de três sistemas estrangeiros.' },
        { en: 'I can compare without saying one system is better.', pt: 'Sei comparar sem dizer que um sistema é melhor.' },
        { en: 'I use "more … than" and "-er than" correctly.', pt: 'Uso "more … than" e "-er than" corretamente.' },
        { en: 'I never say "more harder".', pt: 'Nunca digo "more harder".' },
      ],
      doneMessage: 'comparações no lugar. Agora, as escolas internacionais aqui do Brasil.',
      openMessage: 'reveja o texto com lacunas — os comparativos estão todos lá.',
    },
  ],
  insights: {
    kicker: 'Sacadas · did you know?',
    title: 'Comparar sem ofender',
    intro: 'Três cuidados para conversas entre culturas escolares.',
    cards: [
      { en: 'Compare structures, not quality. "It works differently here" lands well; "our system is better" never does.', pt: 'Compare estruturas, não qualidade. "It works differently here" cai bem; "our system is better" nunca cai.' },
      { en: 'Start with what is the same. It reassures the other person before you explain what is different.', pt: 'Comece pelo que é igual. Isso tranquiliza a outra pessoa antes de você explicar o que muda.' },
      { en: 'Every system in the world asks for a transcript. When in doubt, ask for that document — it is the universal word.', pt: 'Todo sistema do mundo pede um transcript. Na dúvida, peça esse documento — é a palavra universal.' },
    ],
  },
  takeaways: [
    'The closest thing to the Abitur here is the ENEM.',
    'The idea is the same, but the way in is more flexible here.',
    'It works differently here — not better, differently.',
  ],
  celebrate: {
    en: 'You can now translate between four school systems.',
    pt: 'Você já traduz entre quatro sistemas escolares.',
  },
},

/* ─────────────────────────────── 4 ─────────────────────────────── */
{
  title: 'International schools in Brazil',
  focus: 'Entender o mundo das escolas internacionais',
  character: 'us-female',
  image: '/faapatendimento/img/g11.jpg',
  imageCaption: 'Trabalho de ateliê: o que atrai famílias que vêm de fora é a prática.',
  objective: 'Entender e explicar em inglês o que é uma escola internacional no Brasil, quem estuda nelas e por que elas conversam com a FAAP.',
  intro: [
    'São Paulo has dozens of <strong>international schools</strong>: American, British, German, French, Japanese and bilingual schools of every kind.',
    'They exist for two publics: <strong>expat families</strong>, who stay two or three years, and <strong>Brazilian families</strong> who want a foreign curriculum.',
    'Knowing how they work is what makes a conversation with a coordinator go from polite to productive.',
  ],
  introPt: [
    'São Paulo tem dezenas de <strong>escolas internacionais</strong>: americanas, britânicas, alemãs, francesas, japonesas e bilíngues de todo tipo.',
    'Elas existem para dois públicos: <strong>famílias expatriadas</strong>, que ficam dois ou três anos, e <strong>famílias brasileiras</strong> que querem um currículo estrangeiro.',
    'Entender como elas funcionam é o que faz uma conversa com um coordenador sair do educado e virar produtiva.',
  ],
  vocab: [
    { en: 'curriculum', pt: 'currículo / grade curricular', example: 'They follow the British curriculum.' },
    { en: 'bilingual school', pt: 'escola bilíngue', example: 'A bilingual school teaches in two languages.' },
    { en: 'expat family', pt: 'família expatriada', example: 'Many expat families stay for three years.' },
    { en: 'accreditation', pt: 'credenciamento', example: 'The school has international accreditation.' },
    { en: 'placement', pt: 'colocação / enturmação', example: 'Placement depends on age and level.' },
    { en: 'to transfer', pt: 'transferir(-se)', example: 'Students often transfer mid-year.' },
  ],
  exercises: [
    {
      type: 'wordBank',
      title: 'O vocabulário das escolas internacionais',
      instruction: 'Complete com o banco de palavras.',
      bank: ['curriculum', 'bilingual', 'expat', 'accreditation', 'transfer'],
      items: [
        { text: 'They follow the British ___ .', answer: 'curriculum' },
        { text: 'A ___ school teaches in two languages.', answer: 'bilingual' },
        { text: 'Many ___ families stay for two or three years.', answer: 'expat' },
        { text: 'The school has international ___ .', answer: 'accreditation' },
        { text: 'Students sometimes ___ in the middle of the year.', answer: 'transfer' },
      ],
      explanation: 'Cinco palavras que aparecem em qualquer conversa com escola internacional.',
    },
    {
      type: 'readingTask',
      title: 'Leia e responda',
      badge: 'Leia e responda',
      heading: 'Working with international schools',
      instruction: 'Leia e responda. Este texto é o mapa do assunto.',
      passage: [
        'International schools in Brazil follow a foreign curriculum — American, British, German, French — or an international one, such as the International Baccalaureate.',
        'Their families fall into two groups. Expat families move for work, often for two or three years, and need everything explained from scratch: the city, the paperwork, the calendar. Brazilian families choose these schools for the language and for access to universities abroad.',
        'Both groups look at what comes after school: exams, transcripts, applications, and how a Brazilian institution recognises what their child has studied.',
      ],
      questions: [
        {
          prompt: 'Which two groups of families use international schools?',
          options: [
            { text: 'Expat families and Brazilian families.', correct: true },
            { text: 'Only foreign diplomats.' },
            { text: 'Only students over eighteen.' },
          ],
          why: 'Saber quem é a família muda completamente o tom da conversa.',
        },
        {
          prompt: 'What do expat families most need?',
          options: [
            { text: 'Everything explained from scratch.', correct: true },
            { text: 'Only the price list.' },
            { text: 'Nothing — they already know the country.' },
          ],
          why: 'Quem acabou de chegar precisa de contexto, não só de informação.',
        },
        {
          prompt: 'What do both groups care about?',
          options: [
            { text: 'What comes after school — exams, transcripts, applications.', correct: true },
            { text: 'The colour of the uniform.' },
            { text: 'Only the sports programme.' },
          ],
          why: 'Toda conversa acaba nesse ponto. É onde a FAAP entra.',
        },
      ],
    },
    {
      type: 'multiSelect',
      title: 'O que interessa a um coordenador internacional?',
      instruction: 'Marque tudo o que costuma importar numa conversa com escola internacional. Há mais de uma resposta.',
      prompt: 'You are meeting the coordinator of an international school. Which topics are likely to matter to them?',
      options: [
        { text: 'How Brazilian institutions recognise a foreign diploma.', correct: true },
        { text: 'What documents students need to apply.', correct: true },
        { text: 'The colour of our reception desk.', correct: false },
        { text: 'Dates and deadlines for the next intake.', correct: true },
        { text: 'Whether we have a contact person they can call.', correct: true },
        { text: 'The full history of the foundation, in detail.', correct: false },
      ],
      explanation: 'Reconhecimento, documentos, prazos e um nome com telefone. Esses quatro resolvem a reunião.',
    },
    {
      type: 'swipeChoice',
      title: 'Qual frase funciona melhor?',
      badge: 'A ou B',
      instruction: 'As duas são educadas. Escolha a que abre a porta.',
      items: [
        { prompt: 'Primeiro contato com uma escola internacional.', a: 'We would like to present our institution to you.', b: 'We would like to understand how your students plan their next step — and see where we fit.', correct: 'b', why: 'Quem começa perguntando é convidado a voltar. Quem começa apresentando, não.' },
        { prompt: 'A escola pergunta se a FAAP aceita alunos com currículo estrangeiro.', a: 'I think so, probably.', b: 'Yes — and I can send you exactly which documents we need for that.', correct: 'b', why: 'Resposta afirmativa + próximo passo concreto.' },
        { prompt: 'Encerrando a conversa.', a: 'Thank you for your time.', b: 'Thank you for your time — I will send you the calendar this week, and I am always available on this number.', correct: 'b', why: 'Agradecer é bonito; agradecer com compromisso é comercial.' },
      ],
      explanation: 'Toda frase boa aqui tem duas partes: a educação e o próximo passo.',
    },
    {
      type: 'checkOff',
      title: 'Antes de fechar esta lição',
      items: [
        { en: 'I can explain what an international school is.', pt: 'Sei explicar o que é uma escola internacional.' },
        { en: 'I know the two kinds of families they serve.', pt: 'Conheço os dois tipos de família que elas atendem.' },
        { en: 'I know what a coordinator actually wants from a meeting.', pt: 'Sei o que um coordenador de fato quer de uma reunião.' },
        { en: 'I always finish with a concrete next step.', pt: 'Sempre termino com um próximo passo concreto.' },
      ],
      doneMessage: 'terreno mapeado. A próxima lição decifra as siglas: IB, Abitur, SAT, ACT, Mizzou.',
      openMessage: 'reveja a leitura — ela é o mapa inteiro do assunto.',
    },
  ],
  insights: {
    kicker: 'Sacadas · did you know?',
    title: 'O mundo das escolas internacionais',
    intro: 'Três coisas que ajudam a entender o outro lado da mesa.',
    cards: [
      { en: 'Coordinators change schools often. The relationship you build follows the person, not the address.', pt: 'Coordenadores trocam de escola com frequência. A relação que você constrói segue a pessoa, não o endereço.' },
      { en: 'Expat families arrive mid-year and leave mid-year. Flexibility with calendars is worth more to them than any discount.', pt: 'Famílias expatriadas chegam no meio do ano e vão embora no meio do ano. Flexibilidade de calendário vale mais para elas do que qualquer desconto.' },
      { en: 'The most common question is not about price. It is: "will my child\'s diploma be recognised?"', pt: 'A pergunta mais comum não é sobre preço. É: "o diploma do meu filho vai ser reconhecido?"' },
    ],
  },
  takeaways: [
    'International schools follow a foreign or international curriculum.',
    'They serve expat families and Brazilian families — different needs, same questions.',
    'I can send you exactly which documents we need for that.',
  ],
  celebrate: {
    en: 'You now understand the other side of the table.',
    pt: 'Você já entende o outro lado da mesa.',
  },
},

/* ─────────────────────────────── 5 ─────────────────────────────── */
{
  title: 'The alphabet soup: IB, Abitur, SAT, ACT, Mizzou',
  focus: 'Decifrar as siglas dos programas internacionais',
  character: 'gb-male',
  image: '/faapatendimento/img/graduacao.jpg',
  imageCaption: 'Por trás de cada sigla há uma família tentando planejar um futuro.',
  objective: 'Reconhecer, pronunciar e explicar as siglas que aparecem em toda conversa com escola internacional.',
  intro: [
    'Coordinators speak in initials. In one meeting you will hear <strong>IB</strong>, <strong>DP</strong>, <strong>TOK</strong>, <strong>SAT</strong>, <strong>ACT</strong>, <strong>Abitur</strong> and <strong>Mizzou</strong>.',
    'You do not need to be an expert in any of them. You need to know <em>what each one is for</em> — and to say the letters correctly.',
    'This lesson is the decoder.',
  ],
  introPt: [
    'Coordenadores falam por siglas. Em uma reunião você vai ouvir <strong>IB</strong>, <strong>DP</strong>, <strong>TOK</strong>, <strong>SAT</strong>, <strong>ACT</strong>, <strong>Abitur</strong> e <strong>Mizzou</strong>.',
    'Você não precisa ser especialista em nenhuma delas. Precisa saber <em>para que cada uma serve</em> — e falar as letras corretamente.',
    'Esta lição é o decodificador.',
  ],
  vocab: [
    { en: 'International Baccalaureate (IB)', pt: 'Bacharelado Internacional — currículo internacional', example: 'The school offers the IB Diploma Programme.' },
    { en: 'Diploma Programme (DP)', pt: 'o programa do IB para os dois últimos anos', example: 'The DP takes two years.' },
    { en: 'SAT / ACT', pt: 'exames de admissão a universidades americanas', example: 'She is preparing for the SAT.' },
    { en: 'Abitur', pt: 'exame alemão de conclusão do ensino médio', example: 'The Abitur gives access to German universities.' },
    { en: 'dual diploma', pt: 'diploma duplo (brasileiro e estrangeiro)', example: 'The Mizzou programme offers a dual diploma.' },
    { en: 'to sit / to take an exam', pt: 'prestar uma prova', example: 'They sit the exam in May.' },
  ],
  exercises: [
    {
      type: 'matching',
      title: 'Cada sigla, a sua função',
      instruction: 'Associe cada programa ao que ele faz. Não precisa decorar detalhes — só a função.',
      pairs: [
        { left: 'IB Diploma Programme', right: 'currículo internacional dos dois últimos anos do ensino médio' },
        { left: 'Abitur', right: 'exame alemão que dá acesso às universidades da Alemanha' },
        { left: 'SAT', right: 'prova de admissão americana, com leitura, escrita e matemática' },
        { left: 'ACT', right: 'a outra prova de admissão americana, que inclui ciências' },
        { left: 'Mizzou Academy', right: 'programa americano de high school que permite diploma duplo' },
      ],
      explanation: 'Currículo (IB), exame nacional (Abitur), provas de admissão (SAT/ACT), diploma duplo (Mizzou). Quatro categorias, cinco nomes.',
    },
    {
      type: 'trueFalse',
      title: 'Verdadeiro ou falso?',
      instruction: 'Só o essencial — o que basta para conversar sem se perder.',
      items: [
        { text: 'The IB Diploma Programme covers the last two years of secondary school.', answer: true, why: 'São dois anos, normalmente dos dezesseis aos dezoito.' },
        { text: 'The SAT and the ACT are curricula, like the IB.', answer: false, why: 'São provas de admissão, não currículos. É a confusão mais comum.' },
        { text: 'The Abitur is a German qualification.', answer: true, why: 'É a certificação alemã de conclusão do ensino médio.' },
        { text: 'A dual diploma means a student holds two school diplomas.', answer: true, why: 'Normalmente o brasileiro e o americano.' },
      ],
      explanation: 'Se lembrar de uma distinção só: IB e Abitur são o curso; SAT e ACT são a prova de entrada.',
    },
    {
      type: 'listenChoose',
      title: 'Ouça as siglas',
      badge: 'Ouça e escolha',
      instruction: 'Siglas ditas rápido são o que mais escapa numa reunião. Ouça — o transcript está aí.',
      items: [
        {
          audio: 'Our students follow the I B Diploma Programme in the last two years.',
          pt: 'Os nossos alunos seguem o Programa do Diploma do IB nos dois últimos anos.',
          options: [
            { text: 'They follow the IB Diploma Programme.', correct: true },
            { text: 'They take the SAT twice.' },
            { text: 'They study for the Abitur.' },
          ],
          why: 'IB se diz letra por letra: "eye-bee".',
        },
        {
          audio: 'Most of them will sit the S A T in the autumn, and some will take the A C T instead.',
          pt: 'A maioria vai prestar o SAT no outono, e alguns vão fazer o ACT no lugar.',
          options: [
            { text: 'Some take the ACT instead of the SAT.', correct: true },
            { text: 'Everyone takes both exams.' },
            { text: 'Nobody takes admission exams.' },
          ],
          why: '<em>instead</em> = em vez de. Palavra pequena, mudança grande de sentido.',
        },
        {
          audio: 'The Mizzou programme lets them graduate with an American diploma as well as the Brazilian one.',
          pt: 'O programa Mizzou permite que eles se formem com um diploma americano além do brasileiro.',
          options: [
            { text: 'Students get two diplomas.', correct: true },
            { text: 'Students give up the Brazilian diploma.' },
            { text: 'Students study in the United States.' },
          ],
          why: '<em>as well as</em> = além de, não em vez de.',
        },
      ],
      explanation: 'Instead of = troca. As well as = soma. Duas expressões, dois sentidos opostos.',
    },
    {
      type: 'dialogue',
      title: 'Numa reunião com a coordenação',
      badge: 'Diálogo',
      scene: 'Reunião de apresentação numa escola internacional com programa IB.',
      lines: [
        { who: 'Coordinator', voice: 'gb-male', en: 'Our seniors are finishing the DP in May. Many of them want to stay in Brazil for university.', pt: 'Os nossos formandos terminam o DP em maio. Muitos deles querem ficar no Brasil para a universidade.' },
        { who: 'You', voice: 'us-female', en: 'That is good to hear. Do they usually apply with the IB results, or do they sit a local exam as well?', pt: 'Que bom saber. Eles costumam se candidatar com as notas do IB, ou prestam um exame local também?' },
        { who: 'Coordinator', voice: 'gb-male', en: 'Both, normally. That is why the calendar matters so much to us.', pt: 'Os dois, normalmente. É por isso que o calendário importa tanto para nós.' },
        { who: 'You', voice: 'us-female', en: 'Understood. Our dates are set well in advance — I can send you the next two intakes today.', pt: 'Entendi. As nossas datas são definidas com bastante antecedência — posso te mandar as duas próximas entradas hoje.' },
        { who: 'Coordinator', voice: 'gb-male', en: 'That would help. Families ask us in September and we never have the answer.', pt: 'Isso ajudaria. As famílias perguntam em setembro e a gente nunca tem a resposta.' },
        { who: 'You', voice: 'us-female', en: 'Then let us fix that. I will be your contact for it.', pt: 'Então vamos resolver isso. Eu serei o seu contato para esse assunto.' },
      ],
      questions: [
        {
          q: 'What is the coordinator\'s real problem?',
          options: [
            { text: 'Families ask about dates in September and the school has no answer.', correct: true },
            { text: 'The students do not want to study in Brazil.' },
            { text: 'The IB exams are too difficult.' },
          ],
          why: 'A dor apareceu na quinta fala. Toda reunião tem uma — e ela raramente é a primeira coisa dita.',
        },
        {
          q: 'What makes the last line strong?',
          options: [
            { text: 'It offers a named person, not a department.', correct: true },
            { text: 'It promises a discount.' },
            { text: 'It changes the subject.' },
          ],
          why: '"I will be your contact" é a frase que transforma instituição em relação.',
        },
      ],
      explanation: 'Pergunta aberta → escuta → oferta específica → um nome. É a estrutura de uma boa reunião.',
    },
    {
      type: 'checkOff',
      title: 'Antes de fechar esta lição',
      items: [
        { en: 'I can say what the IB Diploma Programme is.', pt: 'Sei dizer o que é o Programa do Diploma do IB.' },
        { en: 'I know the SAT and the ACT are admission exams, not curricula.', pt: 'Sei que SAT e ACT são provas de admissão, não currículos.' },
        { en: 'I can explain what a dual diploma is.', pt: 'Sei explicar o que é um diploma duplo.' },
        { en: 'I pronounce the initials letter by letter without hesitating.', pt: 'Pronuncio as siglas letra por letra sem hesitar.' },
      ],
      doneMessage: 'sopa de letrinhas decifrada. A última lição da trilha junta tudo.',
      openMessage: 'volte à associação: função de cada sigla é o que importa, não o detalhe.',
    },
  ],
  insights: {
    kicker: 'Sacadas · did you know?',
    title: 'Siglas em inglês',
    intro: 'Como falar de programas sem tropeçar.',
    cards: [
      { en: 'Most initials are said letter by letter: I-B, S-A-T, A-C-T, D-P. Do not try to read them as words.', pt: 'A maioria das siglas se diz letra por letra: I-B, S-A-T, A-C-T, D-P. Não tente lê-las como palavra.' },
      { en: 'Abitur and Mizzou are read as words, not letters — "AH-bee-toor" and "mi-ZOO".', pt: 'Abitur e Mizzou são lidos como palavras, não como letras — "ÁH-bi-tur" e "mi-ZÚ".' },
      { en: 'If a coordinator uses an acronym you do not know, ask: "Sorry, what does that stand for?" It is a normal, professional question.', pt: 'Se um coordenador usar uma sigla que você não conhece, pergunte: "Sorry, what does that stand for?" É uma pergunta normal e profissional.' },
    ],
  },
  takeaways: [
    'The IB Diploma Programme covers the last two years of school.',
    'The SAT and the ACT are admission exams, not curricula.',
    'Sorry, what does that stand for?',
  ],
  celebrate: {
    en: 'No acronym in that meeting can catch you out any more.',
    pt: 'Nenhuma sigla daquela reunião te pega mais de surpresa.',
  },
},

/* ─────────────────────────────── 6 ─────────────────────────────── */
{
  title: 'Talking about education with confidence',
  focus: 'Juntar tudo numa conversa real',
  character: 'us-female',
  image: '/faapatendimento/img/cinema.jpg',
  imageCaption: 'No fim, toda conversa sobre educação é sobre alguém escolhendo um caminho.',
  objective: 'Sustentar uma conversa inteira sobre educação em inglês — do sistema brasileiro às siglas internacionais — sem travar.',
  intro: [
    'This lesson has no new vocabulary. It has <strong>one conversation</strong>, from "hello" to "I will send it today".',
    'Everything in it came from the five previous lessons. If you can get through it, the track has done its job.',
    'Take your time. Use the translation button as much as you need.',
  ],
  introPt: [
    'Esta lição não tem vocabulário novo. Ela tem <strong>uma conversa</strong>, do "olá" até o "eu envio hoje".',
    'Tudo o que está nela veio das cinco lições anteriores. Se você atravessar essa conversa, a trilha cumpriu o papel dela.',
    'Vá no seu tempo. Use o botão de tradução o quanto precisar.',
  ],
  vocab: [
    { en: 'to look into', pt: 'verificar / averiguar', example: 'I will look into that and come back to you.' },
    { en: 'to follow up', pt: 'dar retorno / retomar', example: 'I will follow up on Monday.' },
    { en: 'in the meantime', pt: 'enquanto isso', example: 'In the meantime, here is the calendar.' },
    { en: 'to keep someone posted', pt: 'manter alguém informado', example: 'I will keep you posted.' },
    { en: 'off the top of my head', pt: 'de cabeça', example: 'Off the top of my head, it is around four years.' },
    { en: 'to put someone in touch with', pt: 'colocar alguém em contato com', example: 'I can put you in touch with our admissions team.' },
  ],
  exercises: [
    {
      type: 'flowChoice',
      title: 'A conversa inteira',
      badge: 'Conversa',
      situation: 'Um coordenador de escola internacional te encontra num evento. Você tem cinco minutos e nenhuma pasta na mão.',
      turns: [
        {
          who: 'Coordinator',
          them: 'Hi — I do not think we have met. Which institution are you from?',
          options: [
            { text: 'I am from FAAP — a private foundation in Higienópolis with a school, a university, a museum and a theatre.', correct: true, why: 'Nome + o que é + o que tem. Três informações em uma frase.' },
            { text: 'FAAP. You know it, right?', why: 'Assumir que a pessoa conhece é o jeito mais rápido de constranger os dois.' },
            { text: 'It is complicated to explain quickly.', why: 'Nunca. Você treinou exatamente para isso.' },
          ],
        },
        {
          who: 'Coordinator',
          them: 'Right, the one with the museum. Do you take students coming from the IB?',
          options: [
            { text: 'We do. Their results are accepted, and I can send you exactly which documents we ask for.', correct: true, why: 'Sim claro + próximo passo concreto.' },
            { text: 'I believe so, but I am not the right person.', why: 'Pode ser verdade, mas assim a conversa morre aqui.' },
            { text: 'Only if they also take the ENEM.', why: 'Regra dita de cabeça e provavelmente incompleta. Nunca invente regra.' },
          ],
        },
        {
          who: 'Coordinator',
          them: 'And how long is an undergraduate degree with you?',
          options: [
            { text: 'Off the top of my head, four years for most programmes — but let me confirm the exact figure for the one you are interested in.', correct: true, why: 'Dá o número, sinaliza que é aproximado e se compromete a confirmar. Perfeito.' },
            { text: 'Four years. Definitely, for everything.', why: 'Uma generalização que pode voltar como problema.' },
            { text: 'It depends on many factors.', why: 'Verdadeiro e inútil. Sempre dê um número de referência.' },
          ],
        },
        {
          who: 'Coordinator',
          them: 'Our families always ask us in September and we never know the dates. It is our biggest headache.',
          options: [
            { text: 'Then let me fix that for you. I will send the next two intake calendars this week and keep you posted when they change.', correct: true, why: 'Ele te entregou a dor dele. Você respondeu com uma solução e um compromisso contínuo.' },
            { text: 'Yes, that is a common problem.', why: 'Concordar sem resolver desperdiça a melhor frase da conversa.' },
            { text: 'You should check our website.', why: 'Mandar a pessoa se virar é o oposto de relacionamento.' },
          ],
        },
        {
          who: 'Coordinator',
          them: 'That would genuinely help. How do I reach you?',
          options: [
            { text: 'Here is my card. I am your contact for this — write to me directly, not to the general address.', correct: true, why: 'Um nome, um canal direto. É assim que a relação sobrevive à reunião.' },
            { text: 'Through the website form.', why: 'Formulário não cria relação com ninguém.' },
            { text: 'I will find you on LinkedIn later.', why: 'Depender de "depois" é perder o contato agora.' },
          ],
        },
      ],
      explanation: 'Apresentação curta → sim com próximo passo → número com ressalva → resolver a dor dele → um nome. Essa conversa vale por toda a trilha.',
    },
    {
      type: 'sentenceBuild',
      title: 'Monte as frases que salvam',
      instruction: 'Clique nos blocos na ordem certa. Alguns sobram de propósito.',
      items: [
        { hint: 'Dar um número aproximado com honestidade.', answer: 'Off the top of my head it is about four years', extra: ['on', 'were'] },
        { hint: 'Prometer verificar.', answer: 'Let me look into that and come back to you this week', extra: ['for', 'looking'] },
        { hint: 'Oferecer o contato certo.', answer: 'I can put you in touch with our admissions team', extra: ['on', 'touching'] },
      ],
      explanation: 'Três frases que resolvem noventa por cento dos momentos difíceis numa conversa.',
    },
    {
      type: 'multiSelect',
      title: 'O que fazer quando você não sabe a resposta',
      instruction: 'Marque tudo o que é uma boa saída. Há mais de uma.',
      prompt: 'A coordinator asks something you genuinely do not know. What works?',
      options: [
        { text: 'Say you are not sure and offer to confirm by a specific day.', correct: true },
        { text: 'Give an approximate answer clearly marked as approximate.', correct: true },
        { text: 'Invent a plausible rule to sound competent.', correct: false },
        { text: 'Offer to put them in touch with the right person.', correct: true },
        { text: 'Change the subject quickly.', correct: false },
        { text: 'Write the question down in front of them.', correct: true },
      ],
      explanation: 'Anotar a pergunta na frente da pessoa é o gesto mais subestimado de toda reunião. Ele diz: isso não vai se perder.',
    },
    {
      type: 'checkOff',
      title: 'Antes de fechar a trilha',
      items: [
        { en: 'I can explain the Brazilian system to a foreign colleague.', pt: 'Sei explicar o sistema brasileiro a um colega estrangeiro.' },
        { en: 'I can compare systems without ranking them.', pt: 'Sei comparar sistemas sem colocar um acima do outro.' },
        { en: 'I know what IB, SAT, ACT, Abitur and Mizzou are for.', pt: 'Sei para que servem IB, SAT, ACT, Abitur e Mizzou.' },
        { en: 'I have three ready sentences for when I do not know something.', pt: 'Tenho três frases prontas para quando eu não souber alguma coisa.' },
      ],
      doneMessage: 'trilha concluída. Agora escolha a sua: Comercial ou Atendimento.',
      openMessage: 'a conversa do primeiro exercício é a trilha inteira em cinco turnos. Volte nela.',
    },
  ],
  insights: {
    kicker: 'Sacadas · did you know?',
    title: 'O que sustenta uma conversa em outra língua',
    intro: 'Não é vocabulário. É estratégia.',
    cards: [
      { en: 'Fluency is not knowing every word. It is having a plan for the words you do not know.', pt: 'Fluência não é saber todas as palavras. É ter um plano para as palavras que você não sabe.' },
      { en: 'Writing the question down in front of the person is worth more than a perfect sentence. It shows the question will not be lost.', pt: 'Anotar a pergunta na frente da pessoa vale mais que uma frase perfeita. Mostra que a pergunta não vai se perder.' },
      { en: '"I will keep you posted" is the cheapest promise in English and the one people remember most.', pt: '"I will keep you posted" é a promessa mais barata do inglês e a que as pessoas mais lembram.' },
    ],
  },
  takeaways: [
    'Off the top of my head, it is about four years — let me confirm.',
    'Let me look into that and come back to you this week.',
    'I am your contact for this — write to me directly.',
  ],
  celebrate: {
    en: 'Track complete. You can hold a whole conversation about education in English.',
    pt: 'Trilha concluída. Você sustenta uma conversa inteira sobre educação em inglês.',
  },
},
];
