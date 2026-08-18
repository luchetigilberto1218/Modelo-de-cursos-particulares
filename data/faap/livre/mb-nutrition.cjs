/* Mind & Body · Food & Nutrition — pedir, explicar restrição e falar de comida. */
module.exports = [

{
  title: 'Ordering Food',
  focus: 'Pedir num restaurante',
  difficulty: 'Básico',
  character: 'gb-male',
  image: '/faapatendimento/img/livre/foto/nutrition.jpg',
  imageCaption: 'Comida é o assunto que mais aproxima — e o que mais gera mal-entendido à mesa.',
  objective: 'Pedir uma refeição em inglês do começo ao fim, incluindo as perguntas que o garçom vai fazer antes de você abrir a boca.',
  intro: [
    'Ordering has a fixed shape in English, and the waiter starts it: <em>"Are you ready to order?"</em>, <em>"Still or sparkling?"</em>, <em>"Anything to drink?"</em>',
    'Knowing the questions in advance is more useful than knowing the menu.',
  ],
  introPt: [
    'Pedir tem um formato fixo em inglês, e é o garçom quem começa: <em>"Are you ready to order?"</em>, <em>"Still or sparkling?"</em>, <em>"Anything to drink?"</em>',
    'Saber as perguntas de antemão é mais útil do que saber o cardápio.',
  ],
  vocab: [
    { en: 'starter / main / dessert', pt: 'entrada / principal / sobremesa', example: 'I will just have a main, thank you.' },
    { en: 'still or sparkling', pt: 'sem gás ou com gás', example: 'Sparkling water, please.' },
    { en: 'the bill / the check', pt: 'a conta (UK / US)', example: 'Could we have the bill, please?' },
    { en: 'to be ready to order', pt: 'estar pronto para pedir', example: 'We are ready to order.' },
    { en: 'on the side', pt: 'à parte', example: 'Dressing on the side, please.' },
  ],
  exercises: [
    {
      type: 'orderList',
      title: 'A refeição, em ordem',
      badge: 'Coloque em ordem',
      instruction: 'Clique nas falas na ordem em que elas acontecem numa mesa.',
      items: [
        'Are you ready to order, or would you like a few more minutes?',
        'We are ready. I will have the soup to start.',
        'And for the main, the fish, with the dressing on the side.',
        'Still or sparkling water?',
        'Sparkling, please. And could we have the bill after, when you have a moment?',
      ],
      explanation: 'Pergunta → entrada → principal → bebida → conta. É a mesma sequência em qualquer país.',
    },
    {
      type: 'serialChoice',
      title: 'A resposta certa',
      badge: 'Escolha certa',
      instruction: 'O garçom perguntou. Escolha a resposta natural.',
      items: [
        { prompt: '"Still or sparkling?"', options: [{ text: 'Sparkling, please.', correct: true }, { text: 'With gas, please.' }, { text: 'Normal water.' }], why: 'Com gás é <strong>sparkling</strong>; sem gás é <strong>still</strong>.' },
        { prompt: 'Pedindo só o prato principal.', options: [{ text: 'I will just have a main, thank you.', correct: true }, { text: 'Only the principal plate.' }, { text: 'I want main dish only.' }], why: 'Prato principal é <strong>a main</strong> ou main course.' },
        { prompt: 'Pedindo o molho à parte.', options: [{ text: 'Could I have the dressing on the side?', correct: true }, { text: 'Can you put the sauce apart?' }, { text: 'Sauce outside, please.' }], why: '<strong>on the side</strong> é a expressão fixa.' },
        { prompt: 'Pedindo a conta.', options: [{ text: 'Could we have the bill, please?', correct: true }, { text: 'Bring the account.' }, { text: 'The note, please.' }], why: 'Conta é <strong>the bill</strong> (UK) ou <strong>the check</strong> (US).' },
      ],
      explanation: 'Sparkling, a main, on the side, the bill. Quatro respostas e o jantar inteiro está resolvido.',
    },
    {
      type: 'listenChoose',
      title: 'Ouça o garçom',
      badge: 'Ouça e escolha',
      instruction: 'Garçom fala rápido e sempre a mesma coisa. Ouça — o transcript está aí.',
      items: [
        {
          audio: 'Are you ready to order, or would you like a few more minutes?',
          pt: 'Vocês estão prontos para pedir, ou querem mais alguns minutos?',
          options: [
            { text: 'He is asking if you want to order now.', correct: true },
            { text: 'He is bringing the bill.' },
            { text: 'He is asking about allergies.' },
          ],
          why: 'É a primeira pergunta de qualquer restaurante em inglês.',
        },
        {
          audio: 'Still or sparkling? And anything to drink with your meal?',
          pt: 'Sem gás ou com gás? E algo para beber com a refeição?',
          options: [
            { text: 'Two questions: water type and drinks.', correct: true },
            { text: 'He is asking about dessert.' },
            { text: 'He is asking how you want the meat.' },
          ],
          why: 'Duas perguntas numa fala só — muito comum.',
        },
      ],
      explanation: 'Se você reconhecer essas duas falas, a mesa inteira fica tranquila.',
    },
    {
      type: 'checkOff',
      title: 'Antes de fechar esta lição',
      items: [
        { en: 'I know the difference between still and sparkling.', pt: 'Sei a diferença entre still e sparkling.' },
        { en: 'I can order a starter, a main and a dessert.', pt: 'Sei pedir entrada, prato principal e sobremesa.' },
        { en: 'I can ask for something on the side.', pt: 'Sei pedir algo à parte.' },
        { en: 'I can ask for the bill politely.', pt: 'Sei pedir a conta com educação.' },
      ],
      doneMessage: 'mesa resolvida. A próxima lição é a mais importante: restrição alimentar.',
      openMessage: 'as duas falas do garçom são as que mais se repetem. Ouça de novo.',
    },
  ],
  insights: {
    kicker: 'Sacadas · did you know?',
    title: 'À mesa, em inglês',
    intro: 'Três diferenças que confundem brasileiros.',
    cards: [
      { en: '"Still or sparkling?" is the first question in most European restaurants. Answering it wrong is the most common tourist mistake there is.', pt: '"Still or sparkling?" é a primeira pergunta na maioria dos restaurantes europeus. Responder errado é o erro de turista mais comum que existe.' },
      { en: 'The British say "the bill", Americans say "the check". Asking for "the note" or "the account" will get you a confused look.', pt: 'Os britânicos dizem "the bill", os americanos "the check". Pedir "the note" ou "the account" rende um olhar confuso.' },
      { en: 'In many countries the waiter will not bring the bill until you ask. Waiting politely can last a very long time.', pt: 'Em muitos países o garçom não traz a conta até você pedir. Esperar educadamente pode durar muito tempo.' },
    ],
  },
  takeaways: [
    'We are ready to order.',
    'Sparkling, please — and the dressing on the side.',
    'Could we have the bill, please?',
  ],
  celebrate: {
    en: 'Dinner abroad, handled from start to finish.',
    pt: 'Jantar lá fora, resolvido do começo ao fim.',
  },
},

{
  title: 'Dietary Restrictions',
  focus: 'Explicar o que você não pode comer',
  difficulty: 'Iniciante',
  character: 'us-female',
  image: '/faapatendimento/img/livre/foto/nutrition.jpg',
  imageCaption: 'A conversa que precisa acontecer antes do pedido, nunca depois.',
  objective: 'Explicar uma restrição alimentar em inglês com clareza — e saber a diferença entre alergia e preferência, que muda o protocolo da cozinha.',
  intro: [
    'This is the one lesson here with a real cost if it goes wrong. A dietary restriction explained badly is not a funny story.',
    'Two rules: <strong>say it before you order</strong>, and <strong>never use the word "allergic" for a preference</strong>.',
  ],
  introPt: [
    'Esta é a única lição daqui com custo real se der errado. Uma restrição alimentar mal explicada não é uma história engraçada.',
    'Duas regras: <strong>diga antes de pedir</strong> e <strong>nunca use a palavra "allergic" para uma preferência</strong>.',
  ],
  vocab: [
    { en: 'I am allergic to…', pt: 'Sou alérgico a…', example: 'I am allergic to peanuts.' },
    { en: 'gluten-free / dairy-free', pt: 'sem glúten / sem laticínios', example: 'Do you have a gluten-free option?' },
    { en: 'I do not eat…', pt: 'Eu não como…', example: 'I do not eat pork.' },
    { en: 'to check with the kitchen', pt: 'verificar com a cozinha', example: 'Could you check with the kitchen?' },
    { en: 'a trace of', pt: 'um traço de', example: 'Even a trace of nuts is a problem.' },
  ],
  exercises: [
    {
      type: 'categorize',
      title: 'Alergia, intolerância ou escolha?',
      badge: 'Classifique',
      instruction: 'A palavra muda o protocolo da cozinha. Classifique cada caso.',
      categories: [
        { id: 'alergia', name: 'Alergia · risco médico', short: 'Alergia' },
        { id: 'intol', name: 'Intolerância · passa mal', short: 'Intolerância' },
        { id: 'escolha', name: 'Escolha · preferência', short: 'Escolha' },
      ],
      items: [
        { text: 'Even a trace of peanuts sends me to hospital.', cat: 'alergia' },
        { text: 'Milk gives me stomach pain for hours.', cat: 'intol' },
        { text: 'I am vegetarian.', cat: 'escolha' },
        { text: 'Shellfish makes my throat close.', cat: 'alergia' },
        { text: 'Gluten leaves me bloated all day.', cat: 'intol' },
        { text: 'I just do not like mushrooms.', cat: 'escolha' },
      ],
      explanation: 'Alergia é emergência. Intolerância é desconforto. Escolha é escolha. Usar a palavra errada desgasta a palavra para quem precisa dela.',
    },
    {
      type: 'serialChoice',
      title: 'Como dizer cada uma',
      badge: 'Escolha certa',
      instruction: 'Escolha a forma que garante que a cozinha vai entender.',
      items: [
        {
          prompt: 'Você tem alergia grave a amendoim.',
          options: [
            { text: 'I am allergic to peanuts — it is a serious allergy. Could you check with the kitchen?', correct: true },
            { text: 'I do not like peanuts.' },
            { text: 'I prefer without peanuts.' },
          ],
          why: 'Diga a palavra "allergy" e peça para checarem. Só assim o protocolo é acionado.',
        },
        {
          prompt: 'Você não come carne por escolha.',
          options: [
            { text: 'I am vegetarian — is there a dish without meat?', correct: true },
            { text: 'I am allergic to meat.' },
            { text: 'Meat is bad for me.' },
          ],
          why: 'Nunca use "alergia" para preferência.',
        },
        {
          prompt: 'Você quer saber se há opção sem glúten.',
          options: [
            { text: 'Do you have a gluten-free option?', correct: true },
            { text: 'Is this without gluten inside?' },
            { text: 'This has gluten, no?' },
          ],
          why: '<strong>-free</strong> é o sufixo padrão: gluten-free, dairy-free, nut-free.',
        },
      ],
      explanation: 'Allergy para alergia, -free para restrição, "I do not eat" para escolha. Três fórmulas.',
    },
    {
      type: 'dialogue',
      title: 'Antes de pedir',
      badge: 'Diálogo',
      scene: 'Jantar de trabalho. Você tem uma alergia e o cardápio está em inglês.',
      lines: [
        { who: 'Waiter', voice: 'gb-male', en: 'Are you ready to order?', pt: 'Estão prontos para pedir?' },
        { who: 'You', voice: 'us-female', en: 'Almost — before I do, I am allergic to peanuts. Is that a problem with any of these?', pt: 'Quase — antes de pedir, sou alérgica a amendoim. Isso é um problema em algum desses?' },
        { who: 'Waiter', voice: 'gb-male', en: 'Let me check with the kitchen. The satay definitely has peanuts.', pt: 'Vou verificar com a cozinha. O satay definitivamente tem amendoim.' },
        { who: 'You', voice: 'us-female', en: 'Thank you. It is a serious allergy, so even a trace matters.', pt: 'Obrigada. É uma alergia séria, então até um traço importa.' },
        { who: 'Waiter', voice: 'gb-male', en: 'Understood. I will flag it on the order.', pt: 'Entendido. Vou sinalizar no pedido.' },
        { who: 'You', voice: 'us-female', en: 'I appreciate that. Then I will have the fish, please.', pt: 'Agradeço. Então vou querer o peixe, por favor.' },
      ],
      questions: [
        {
          q: 'When does she mention the allergy?',
          options: [
            { text: 'Before ordering, so the kitchen can be checked.', correct: true },
            { text: 'After the food arrives.' },
            { text: 'At the end of the meal.' },
          ],
          why: 'Antes de pedir. Depois é tarde para a cozinha.',
        },
        {
          q: 'Why does she add "even a trace matters"?',
          options: [
            { text: 'To make the seriousness explicit.', correct: true },
            { text: 'To be polite.' },
            { text: 'To order more food.' },
          ],
          why: 'Cozinhas tratam "não gosto" e "vai para o hospital" de formas muito diferentes. Diga qual é.',
        },
      ],
      explanation: 'Avisar antes, usar a palavra certa, pedir para checarem, confirmar a gravidade. Quatro passos.',
    },
    {
      type: 'checkOff',
      title: 'Antes de fechar esta lição',
      items: [
        { en: 'I mention a restriction before ordering.', pt: 'Menciono a restrição antes de pedir.' },
        { en: 'I never say "allergic" for a preference.', pt: 'Nunca digo "allergic" para uma preferência.' },
        { en: 'I know the -free suffix.', pt: 'Conheço o sufixo -free.' },
        { en: 'I ask them to check with the kitchen.', pt: 'Peço que verifiquem com a cozinha.' },
      ],
      doneMessage: 'restrições resolvidas. A próxima lição é sobre macros e rotina.',
      openMessage: 'a classificação alergia/intolerância/escolha é a parte que mais importa.',
    },
  ],
  insights: {
    kicker: 'Sacadas · did you know?',
    title: 'Restrição alimentar',
    intro: 'Três coisas com consequência real.',
    cards: [
      { en: 'In many countries kitchens have a separate protocol for allergies — different utensils, different surface. Using the word loosely wears it out for people whose lives depend on it.', pt: 'Em muitos países as cozinhas têm um protocolo separado para alergias — outros utensílios, outra superfície. Usar a palavra à toa desgasta quem depende dela.' },
      { en: 'The suffix -free covers everything: gluten-free, dairy-free, nut-free, sugar-free, alcohol-free. Learn the pattern and you never need the individual words.', pt: 'O sufixo -free cobre tudo: gluten-free, dairy-free, nut-free, sugar-free, alcohol-free. Aprenda o padrão e você nunca precisa das palavras individuais.' },
      { en: '"Could you check with the kitchen?" is the sentence that actually triggers action. Saying the restriction alone often is not enough.', pt: '"Could you check with the kitchen?" é a frase que de fato aciona a ação. Só dizer a restrição muitas vezes não basta.' },
    ],
  },
  takeaways: [
    'I am allergic to peanuts — it is a serious allergy.',
    'Could you check with the kitchen?',
    'Do you have a gluten-free option?',
  ],
  celebrate: {
    en: 'The most important conversation at any table, handled properly.',
    pt: 'A conversa mais importante de qualquer mesa, resolvida direito.',
  },
},

{
  title: 'Macros and Meal Prep',
  focus: 'O vocabulário dos aplicativos',
  difficulty: 'Intermediário',
  character: 'us-male',
  image: '/faapatendimento/img/livre/foto/nutrition.jpg',
  imageCaption: 'Todo aplicativo de nutrição fala inglês — e sempre as mesmas vinte palavras.',
  objective: 'Entender o vocabulário de nutrição que aparece em todo aplicativo e conversa de treino: macros, porções e preparo.',
  intro: [
    'Every nutrition app you open speaks English: <em>macros</em>, <em>portion</em>, <em>serving</em>, <em>intake</em>, <em>meal prep</em>.',
    'Two of these are worth special attention, because they look easy and are not: <strong>portion</strong> is what you put on the plate; <strong>serving</strong> is what the label calls one unit. They are almost never the same.',
  ],
  introPt: [
    'Todo aplicativo de nutrição que você abre fala inglês: <em>macros</em>, <em>portion</em>, <em>serving</em>, <em>intake</em>, <em>meal prep</em>.',
    'Duas dessas merecem atenção especial, porque parecem fáceis e não são: <strong>portion</strong> é o que você põe no prato; <strong>serving</strong> é o que o rótulo chama de uma unidade. Quase nunca são a mesma coisa.',
  ],
  vocab: [
    { en: 'macros', pt: 'macronutrientes (proteína, carbo, gordura)', example: 'I try to track my macros.' },
    { en: 'a portion', pt: 'a porção que você serve', example: 'That is a huge portion.' },
    { en: 'a serving', pt: 'a porção do rótulo', example: 'One serving is thirty grams.' },
    { en: 'intake', pt: 'ingestão', example: 'I increased my protein intake.' },
    { en: 'meal prep', pt: 'preparar as refeições da semana', example: 'I do meal prep on Sundays.' },
  ],
  exercises: [
    {
      type: 'wordBank',
      title: 'A semana planejada',
      instruction: 'Complete com o banco de palavras.',
      bank: ['macros', 'portion', 'serving', 'intake', 'prep'],
      items: [
        { text: 'I try to track my ___ during the week.', answer: 'macros' },
        { text: 'That is a huge ___ for one person.', answer: 'portion' },
        { text: 'One ___ on the label is thirty grams.', answer: 'serving' },
        { text: 'I increased my protein ___ this month.', answer: 'intake' },
        { text: 'I do meal ___ on Sundays.', answer: 'prep' },
      ],
      explanation: 'Portion é o seu prato. Serving é o rótulo. Confundir os dois é o erro que estraga qualquer contagem.',
    },
    {
      type: 'trueFalse',
      title: 'Verdadeiro ou falso?',
      instruction: 'Sobre o vocabulário de nutrição em inglês.',
      items: [
        { text: '"Portion" and "serving" mean exactly the same thing.', answer: false, why: 'Portion é o que você serve; serving é a unidade do rótulo. Quase nunca coincidem.' },
        { text: '"Macros" means protein, carbohydrates and fat.', answer: true, why: 'São os três macronutrientes.' },
        { text: '"Intake" is how much of something you consume.', answer: true, why: 'Protein intake, calorie intake, water intake.' },
        { text: '"Meal prep" means eating out every day.', answer: false, why: 'É o contrário: preparar as refeições com antecedência.' },
      ],
      explanation: 'Se lembrar de uma distinção só: portion é o prato, serving é o rótulo.',
    },
    {
      type: 'errorSpot',
      title: 'Ache a palavra errada',
      badge: 'Ache o erro',
      instruction: 'Uma palavra errada por frase. Clique nela.',
      items: [
        { sentence: 'I eat much protein in the morning.', wrong: 'much', fix: 'a lot of', why: 'Em afirmativa, <strong>a lot of</strong>. "Much" fica em negativas e perguntas.' },
        { sentence: 'I need to reduce the sugar quantity.', wrong: 'quantity', fix: 'intake', why: 'A palavra da área é <strong>intake</strong>: sugar intake.' },
        { sentence: 'I made a diet last year.', wrong: 'made', fix: 'went on / was on', why: 'Dieta se <strong>goes on</strong>: I went on a diet.' },
        { sentence: 'This yogurt has many protein.', wrong: 'many', fix: 'a lot of', why: '<strong>Protein</strong> é incontável: a lot of protein, não "many".' },
      ],
      explanation: 'A lot of, intake, go on a diet, incontáveis. Quatro correções muito comuns.',
    },
    {
      type: 'checkOff',
      title: 'Antes de fechar esta lição',
      items: [
        { en: 'I know the difference between portion and serving.', pt: 'Sei a diferença entre portion e serving.' },
        { en: 'I know what macros and intake mean.', pt: 'Sei o que significam macros e intake.' },
        { en: 'I say "a lot of protein", not "many protein".', pt: 'Digo "a lot of protein", não "many protein".' },
        { en: 'I say "go on a diet", not "make a diet".', pt: 'Digo "go on a diet", não "make a diet".' },
      ],
      doneMessage: 'aplicativos decifrados. A última lição da trilha é sobre cultura à mesa.',
      openMessage: 'a distinção portion/serving é a parte prática. Volte nela.',
    },
  ],
  insights: {
    kicker: 'Sacadas · did you know?',
    title: 'Contáveis e incontáveis',
    intro: 'A regra que atrapalha justamente aqui.',
    cards: [
      { en: 'Food words are often uncountable in English: protein, rice, bread, water, advice. They take "a lot of" and "much", never "many".', pt: 'Palavras de comida costumam ser incontáveis em inglês: protein, rice, bread, water, advice. Levam "a lot of" e "much", nunca "many".' },
      { en: '"Much" and "many" mostly live in questions and negatives. In an affirmative sentence, native speakers say "a lot of" almost every time.', pt: '"Much" e "many" vivem principalmente em perguntas e negativas. Numa afirmativa, falantes nativos dizem "a lot of" quase sempre.' },
      { en: 'A "serving" on a label is a legal unit, chosen by the manufacturer. It is often much smaller than what anyone actually eats.', pt: 'Uma "serving" no rótulo é uma unidade legal, escolhida pelo fabricante. Costuma ser bem menor do que qualquer um de fato come.' },
    ],
  },
  takeaways: [
    'I try to track my macros during the week.',
    'One serving is thirty grams — that is not a portion.',
    'I do meal prep on Sundays.',
  ],
  celebrate: {
    en: 'Every nutrition app in English just became readable.',
    pt: 'Todo aplicativo de nutrição em inglês acabou de ficar legível.',
  },
},

{
  title: 'Food Cultures',
  focus: 'Falar de comida entre culturas',
  difficulty: 'Intermediário',
  character: 'gb-female',
  image: '/faapatendimento/img/livre/foto/nutrition.jpg',
  imageCaption: 'A pergunta que mais aproxima duas pessoas de países diferentes.',
  objective: 'Falar sobre comida brasileira em inglês, entender a comida do outro e conduzir a conversa que mais aproxima pessoas de países diferentes.',
  intro: [
    'Ask anyone from another country what they miss most and the answer is food. It is the fastest way from a formal conversation to a real one.',
    'Two skills here: <strong>describing a dish someone has never eaten</strong>, and <strong>reacting well to food you do not know</strong>.',
  ],
  introPt: [
    'Pergunte a qualquer pessoa de outro país do que ela mais sente falta e a resposta é comida. É o caminho mais rápido de uma conversa formal para uma conversa de verdade.',
    'Duas habilidades aqui: <strong>descrever um prato que a pessoa nunca comeu</strong> e <strong>reagir bem a uma comida que você não conhece</strong>.',
  ],
  vocab: [
    { en: 'It is a bit like…', pt: 'É meio parecido com…', example: 'It is a bit like a stew.' },
    { en: 'savoury / sweet', pt: 'salgado / doce', example: 'It is savoury, not sweet.' },
    { en: 'an acquired taste', pt: 'gosto que se adquire', example: 'It is an acquired taste.' },
    { en: 'to give something a go', pt: 'experimentar', example: 'I will give it a go.' },
    { en: 'comfort food', pt: 'comida afetiva', example: 'That is proper comfort food.' },
  ],
  exercises: [
    {
      type: 'sentenceBuild',
      title: 'Descreva um prato brasileiro',
      instruction: 'Monte cada frase na ordem certa. Alguns blocos sobram.',
      items: [
        { hint: 'Comparar com algo conhecido.', answer: 'It is a bit like a stew with beans and pork', extra: ['likely', 'of'] },
        { hint: 'Dizer se é doce ou salgado.', answer: 'It is savoury not sweet and we eat it with rice', extra: ['salty', 'sugar'] },
        { hint: 'Explicar quando se come.', answer: 'People usually eat it on Saturdays with the family', extra: ['in', 'usual'] },
      ],
      explanation: 'Comparar → classificar → contextualizar. Três frases e a pessoa consegue imaginar o prato.',
    },
    {
      type: 'swipeChoice',
      title: 'Reagindo a algo que você não conhece',
      badge: 'A ou B',
      instruction: 'Serviram algo que você nunca viu. Escolha a reação.',
      items: [
        { prompt: 'Você não sabe o que é.', a: 'What is that?', b: 'That looks interesting — what is in it?', correct: 'b', why: '"What is that?" pode soar a desconfiança. Um elogio antes da pergunta muda tudo.' },
        { prompt: 'Você provou e não gostou.', a: 'I do not like it.', b: 'It is not quite for me, but I am glad I tried it.', correct: 'b', why: 'Recusar o gosto sem recusar o gesto de quem ofereceu.' },
        { prompt: 'Você gostou muito.', a: 'It is good.', b: 'This is excellent — what is it called?', correct: 'b', why: 'Perguntar o nome é o maior elogio que existe para uma comida.' },
        { prompt: 'Você prefere não experimentar.', a: 'No, I do not eat that.', b: 'I will pass on that one, but thank you — it smells great.', correct: 'b', why: '<strong>to pass on something</strong> é recusar educadamente.' },
      ],
      explanation: 'Nas quatro: reconheça o gesto antes de falar do gosto.',
    },
    {
      type: 'dialogue',
      title: 'Explicando o Brasil à mesa',
      badge: 'Diálogo',
      scene: 'Almoço com uma colega estrangeira que nunca comeu comida brasileira.',
      lines: [
        { who: 'Colleague', voice: 'gb-female', en: 'I have never had Brazilian food. What should I try first?', pt: 'Nunca comi comida brasileira. O que eu deveria experimentar primeiro?' },
        { who: 'You', voice: 'us-female', en: 'Feijoada, probably. It is a bit like a stew, with beans and pork.', pt: 'Feijoada, provavelmente. É meio parecida com um cozido, com feijão e carne de porco.' },
        { who: 'Colleague', voice: 'gb-female', en: 'Is it spicy?', pt: 'É apimentada?' },
        { who: 'You', voice: 'us-female', en: 'Not spicy, no. Savoury and heavy — proper comfort food.', pt: 'Apimentada não. Salgada e pesada — comida afetiva de verdade.' },
        { who: 'Colleague', voice: 'gb-female', en: 'When do people eat it?', pt: 'Quando as pessoas comem isso?' },
        { who: 'You', voice: 'us-female', en: 'Usually on Saturdays, with family, and then nobody does anything for the rest of the day.', pt: 'Normalmente aos sábados, em família, e depois ninguém faz nada pelo resto do dia.' },
        { who: 'Colleague', voice: 'gb-female', en: 'That sounds perfect. I will give it a go.', pt: 'Isso parece perfeito. Vou experimentar.' },
      ],
      questions: [
        {
          q: 'How does she describe feijoada?',
          options: [
            { text: 'Like a stew, savoury, heavy, eaten on Saturdays.', correct: true },
            { text: 'As a spicy dessert.' },
            { text: 'As a light lunch.' },
          ],
          why: 'Comparação + sabor + peso + contexto social. Quatro informações e a pessoa entende.',
        },
        {
          q: 'What makes the last line about Saturdays good?',
          options: [
            { text: 'It gives the social context, not just the recipe.', correct: true },
            { text: 'It explains the ingredients.' },
            { text: 'It says the price.' },
          ],
          why: 'Comida é cultura. O contexto é a parte que a pessoa vai lembrar.',
        },
      ],
      explanation: '"Not spicy" é a informação que todo estrangeiro quer sobre comida de outro país — dê ela antes que perguntem.',
    },
    {
      type: 'checkOff',
      title: 'Antes de fechar a trilha',
      items: [
        { en: 'I can describe a Brazilian dish by comparison.', pt: 'Sei descrever um prato brasileiro por comparação.' },
        { en: 'I know savoury is the opposite of sweet.', pt: 'Sei que savoury é o oposto de sweet.' },
        { en: 'I can decline food politely with "I will pass on that".', pt: 'Sei recusar comida educadamente com "I will pass on that".' },
        { en: 'I give the social context, not just the ingredients.', pt: 'Dou o contexto social, não só os ingredientes.' },
      ],
      doneMessage: 'trilha concluída — e com ela, Mind & Body inteira. O material todo está no ar para você voltar quando quiser.',
      openMessage: 'o diálogo da feijoada é o modelo para descrever qualquer prato.',
    },
  ],
  insights: {
    kicker: 'Sacadas · did you know?',
    title: 'Comida entre culturas',
    intro: 'Três coisas que ajudam à mesa.',
    cards: [
      { en: '"Savoury" has no single translation in Portuguese. It means the opposite of sweet — and it is the first thing a foreigner wants to know about an unfamiliar dish.', pt: '"Savoury" não tem tradução única em português. Quer dizer o oposto de doce — e é a primeira coisa que um estrangeiro quer saber sobre um prato desconhecido.' },
      { en: '"Is it spicy?" is the most common question about food from another country. Answer it before it is asked and you save everyone the worry.', pt: '"Is it spicy?" é a pergunta mais comum sobre comida de outro país. Responda antes de perguntarem e você poupa a preocupação de todo mundo.' },
      { en: '"An acquired taste" is the kindest thing you can say about food you do not like. It puts the difficulty on the palate, not on the dish.', pt: '"An acquired taste" é a coisa mais gentil que se pode dizer sobre uma comida de que você não gostou. Põe a dificuldade no paladar, não no prato.' },
    ],
  },
  takeaways: [
    'It is a bit like a stew, with beans and pork.',
    'Not spicy — savoury and heavy, proper comfort food.',
    'I will give it a go.',
  ],
  celebrate: {
    en: 'Mind & Body complete. Six topics, twenty-four lessons.',
    pt: 'Mind & Body concluída. Seis tópicos, vinte e quatro lições.',
  },
},
];
