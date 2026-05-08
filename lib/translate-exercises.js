// Runtime EN→PT translation of exercise titles for starter level (APS, FAAP, etc.)

const P = '[A-Z]*\\d+\\.\\s*';

const TITLE_MAP = [
  [new RegExp(`^${P}Complete the sentence$`, 'i'), 'Complete a frase'],
  [new RegExp(`^${P}Complete with .*$`, 'i'), 'Complete a frase'],
  [new RegExp(`^${P}Fill in the gap$`, 'i'), 'Complete a lacuna'],
  [new RegExp(`^${P}Fill the gap$`, 'i'), 'Complete a lacuna'],
  [new RegExp(`^${P}Choose the best option$`, 'i'), 'Escolha a melhor opção'],
  [new RegExp(`^${P}Choose the best word$`, 'i'), 'Escolha a melhor palavra'],
  [new RegExp(`^${P}Choose the best definition$`, 'i'), 'Escolha a melhor definição'],
  [new RegExp(`^${P}Choose the correct .*$`, 'i'), 'Escolha a opção correta'],
  [new RegExp(`^${P}Match the pairs$`, 'i'), 'Associe os pares'],
  [new RegExp(`^${P}Match the word to the translation$`, 'i'), 'Combine a palavra com a tradução'],
  [new RegExp(`^${P}Match the word to the definition$`, 'i'), 'Associe a palavra à definição'],
  [new RegExp(`^${P}Match the word with its meaning$`, 'i'), 'Associe a palavra ao significado'],
  [new RegExp(`^${P}Match .*$`, 'i'), 'Faça as correspondências'],
  [new RegExp(`^${P}Put (the )?(sentence|words?) in (the )?(right )?order$`, 'i'), 'Coloque em ordem'],
  [new RegExp(`^${P}Put in order$`, 'i'), 'Coloque em ordem'],
];

export function translateExerciseTitle(title) {
  if (!title) return title;
  for (const [re, pt] of TITLE_MAP) {
    const m = title.match(/^([A-Z]*\d+\.\s*)/);
    const prefix = m ? m[1] : '';
    if (re.test(title)) {
      return prefix + pt.replace(/^[a-z]/, c => c.toUpperCase());
    }
  }
  return title;
}

export const UI_LABELS_PT = {
  check: 'Verificar',
  checkAnswer: 'Verificar resposta',
  checkAnswers: 'Verificar respostas',
  tryAgain: 'Tentar de novo',
  correct: 'Correto',
  almost: 'Quase lá',
  answer: 'Resposta',
  correctPairs: 'Pares corretos',
  typeAnswer: 'Digite sua resposta...',
  chooseDefault: 'Escolha...',
  tapArrows: 'Toque nas setas para mover cada palavra.',
};

export const UI_LABELS_EN = {
  check: 'Check',
  checkAnswer: 'Check answer',
  checkAnswers: 'Check answers',
  tryAgain: 'Try again',
  correct: 'Correct',
  almost: 'Almost there',
  answer: 'Answer',
  correctPairs: 'Correct pairs',
  typeAnswer: 'Type your answer...',
  chooseDefault: 'Choose...',
  tapArrows: 'Tap the arrows to move each word.',
};
