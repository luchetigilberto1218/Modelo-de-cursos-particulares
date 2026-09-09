module.exports = {
  character: 'gb-male',
  topic: 'Objeções',
  title: 'Handling Objections and Price Pressure',
  focus: 'Responder a "está caro" sem baixar o preço na hora',
  objective: 'Responder em inglês às objeções mais comuns — preço, prazo, fornecedor desconhecido — sem ceder no reflexo.',
  intro: [
    'There are only four objections in this business, and you will hear them for the rest of your career: <em>too expensive, too slow, we do not know you,</em> and <em>we already have a supplier</em>.',
    'The reflex to resist is dropping the price in the same breath. In English there is a better first move: <strong>ask a question</strong>. "Compared with what?" costs nothing and buys everything.',
  ],
  introPt: [
    'Existem só quatro objeções neste negócio, e você vai ouvi-las pelo resto da carreira: <em>caro demais, lento demais, não conhecemos vocês</em> e <em>já temos fornecedor</em>.',
    'O reflexo a resistir é baixar o preço no mesmo fôlego. Em inglês há um primeiro movimento melhor: <strong>fazer uma pergunta</strong>. "Compared with what?" não custa nada e compra tudo.',
  ],
  vocab: [
    { en: 'objection', pt: 'objeção', example: 'The main objection was the lead time.' },
    { en: 'Compared with what?', pt: 'Comparado com o quê?', example: 'It is expensive — compared with what?' },
    { en: 'total cost of ownership', pt: 'custo total ao longo da vida', example: 'Lower losses reduce the total cost of ownership.' },
    { en: 'to push back', pt: 'contra-argumentar / resistir', example: 'I pushed back politely on the price comparison.' },
    { en: 'trial order', pt: 'pedido de teste', example: 'Would a trial order of 500 kg help?' },
    { en: 'reference', pt: 'referência (cliente que atesta)', example: 'We can give you references in this segment.' },
    { en: 'to reassure', pt: 'tranquilizar', example: 'Let me reassure you on the quality process.' },
    { en: 'value', pt: 'valor (o que se ganha, não o preço)', example: 'The value is in the losses you avoid.' },
  ],
  exercises: [
    {
      type: 'flowChoice',
      title: 'A objeção do preço',
      badge: 'Conversa',
      situation: 'Você apresentou a proposta. O comprador diz que está cara. Você acredita que o preço é justo e não quer baixá-lo agora.',
      turns: [
        {
          who: 'Buyer',
          them: 'To be honest, your price is high. Higher than what we are paying today.',
          options: [
            { text: 'Thank you for being direct — could you tell me how much higher, and on what basis?', correct: true, why: 'Agradece a franqueza e pede o dado. Sem número, você está negociando contra um fantasma.' },
            { text: 'I understand. What price would you need?', why: 'Você acabou de convidar o cliente a definir o seu preço.' },
            { text: 'Our quality justifies the difference.', why: 'Afirmação genérica, e ainda por cima defensiva. Ele não perguntou por qualidade.' },
          ],
        },
        {
          who: 'Buyer',
          them: 'About eight per cent higher, on the same cross-section.',
          options: [
            { text: 'Understood. And is that comparison on the same Incoterm and the same thermal class?', correct: true, why: 'Metade das comparações "iguais" não são. Vale checar antes de qualquer concessão.' },
            { text: 'Eight per cent is not much for this quality.', why: 'Minimizar o número do cliente é a forma mais rápida de irritá-lo.' },
            { text: 'We could probably close some of that gap.', why: 'Você cedeu antes mesmo de saber se a comparação é válida.' },
          ],
        },
        {
          who: 'Buyer',
          them: 'Same class, but their price is ex works and yours is CIF.',
          options: [
            { text: 'Then most of the gap is freight. On the same basis we are within about two per cent — shall we compare like for like?', correct: true, why: 'O dado desmonta a objeção sozinho. E "like for like" é a expressão exata para isso.' },
            { text: 'Ah, that explains it.', why: 'Certo, mas você parou antes de fazer a conta na frente dele — que é onde a objeção morre.' },
            { text: 'We can also quote ex works if you prefer.', why: 'Cotar EXW resolve a comparação, mas passa o frete para ele sem que ele tenha pedido.' },
          ],
        },
        {
          who: 'Buyer',
          them: 'Fair enough. But you are still slightly above, and we do not know your quality.',
          options: [
            { text: 'Would a trial order of five hundred kilos help? Your lab checks it, and we talk again with data.', correct: true, why: 'Transforma uma objeção de confiança num teste pequeno e barato. É a resposta clássica — e funciona.' },
            { text: 'We have been making this since 1814.', why: 'A idade da empresa não responde a uma dúvida sobre o lote que vai chegar na fábrica dele.' },
            { text: 'I can offer two per cent to close the gap.', why: 'Você comprou o pedido em vez de ganhá-lo — e fixou um preço menor para sempre.' },
          ],
        },
      ],
    },
    {
      type: 'matching',
      title: 'Associe a objeção à melhor primeira resposta',
      instruction: 'Clique na caixa à direita e escolha o primeiro movimento certo.',
      pairs: [
        { left: '"Your price is too high."', right: '"Compared with what — and on the same Incoterm?"' },
        { left: '"Your lead time is too long."', right: '"What date do you actually need it on site?"' },
        { left: '"We do not know your company."', right: '"Would a trial order and two references in this segment help?"' },
        { left: '"We already have a supplier."', right: '"Understood. What would have to change for you to consider a second source?"' },
        { left: '"We need to think about it."', right: '"Of course — what would you like to have in hand before deciding?"' },
      ],
      explanation: 'Toda objeção se responde primeiro com uma pergunta. A concessão, se vier, vem depois.',
    },
    {
      type: 'swipeChoice',
      title: 'Qual resposta segura o preço?',
      badge: 'A ou B',
      instruction: 'Escolha a que defende a proposta sem irritar o cliente.',
      items: [
        { prompt: 'O cliente diz que está caro.', a: 'Could you tell me how much higher, and on what basis?', b: 'How much would we need to come down?', correct: 'a', why: 'A segunda entrega a caneta ao cliente.' },
        { prompt: 'O cliente compara com um preço EXW.', a: 'Then most of the gap is freight — shall we compare like for like?', b: 'That is not a fair comparison.', correct: 'a', why: 'Mesma ideia, tom diferente. "Not fair" soa como acusação.' },
        { prompt: 'O cliente não conhece a empresa.', a: 'Would a trial order of five hundred kilos help?', b: 'We are a very traditional company with two hundred years of history.', correct: 'a', why: 'Confiança se constrói com uma amostra testada, não com uma data de fundação.' },
        { prompt: 'O cliente diz que já tem fornecedor.', a: 'Understood. What would have to change for you to consider a second source?', b: 'Our product is better than theirs.', correct: 'a', why: 'A pergunta descobre o critério dele. A afirmação só cria defesa.' },
      ],
      explanation: 'Pergunta antes de concessão. Sempre.',
    },
    {
      type: 'readAloud',
      title: 'Respondendo objeções em voz alta',
      instruction: 'Ouça, repita e grave. Diga com calma — pressa numa objeção parece nervosismo.',
      sentences: [
        'Thank you for being direct — could you tell me how much higher, and on what basis?',
        'Is that comparison on the same Incoterm and the same thermal class?',
        'On the same basis we are within about two per cent — shall we compare like for like?',
        'Would a trial order of five hundred kilos help?',
        'What would have to change for you to consider a second source?',
      ],
    },
    {
      type: 'checkOff',
      title: 'Antes de fechar esta lição',
      items: [
        { en: 'My first move on any objection is a question, not a discount.', pt: 'Meu primeiro movimento em qualquer objeção é uma pergunta, não um desconto.' },
        { en: 'I check that a price comparison is on the same basis.', pt: 'Verifico se uma comparação de preço está na mesma base.' },
        { en: 'I can offer a trial order to answer a trust objection.', pt: 'Sei oferecer um pedido de teste para responder a uma objeção de confiança.' },
        { en: 'I know the four objections I will hear for the rest of my career.', pt: 'Conheço as quatro objeções que vou ouvir pelo resto da carreira.' },
      ],
      doneMessage: 'objeções resolvidas. A próxima lição é a conversa mais difícil: dar a má notícia.',
      openMessage: 'leve o que ficou em branco para a próxima aula com o professor.',
    },
  ],
  celebrate: {
    en: 'A question before a discount — the habit that protects every margin you have.',
    pt: 'Uma pergunta antes do desconto — o hábito que protege toda margem que você tem.',
  },
  insights: {
    kicker: 'Sacadas · did you know?',
    title: 'Objeção não é rejeição',
    intro: 'Quatro verdades sobre objeções em venda técnica.',
    cards: [
      { en: 'An objection means the customer is still in the conversation. Silence is the answer to fear.', pt: 'Uma objeção significa que o cliente ainda está na conversa. Silêncio é a resposta que deve assustar.' },
      { en: '"Like for like" is the exact English phrase for comparing on the same basis — worth memorising.', pt: '"Like for like" é a expressão exata do inglês para comparar na mesma base — vale decorar.' },
      { en: 'Half of all "your price is higher" comparisons are on different Incoterms, quantities or specifications.', pt: 'Metade das comparações "o seu preço é mais alto" está em Incoterms, quantidades ou especificações diferentes.' },
      { en: 'Total cost of ownership is the argument that beats price: a conductor with lower losses saves money every day it runs.', pt: 'Custo total de propriedade é o argumento que vence o preço: um condutor com menos perdas economiza dinheiro todo dia em que roda.' },
    ],
  },
};
