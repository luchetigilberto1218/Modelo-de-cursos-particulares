'use client';

import Icon from './RacionalIcon';

/**
 * TeacherCompass — "Bússola Pedagógica" Alumni × Racional.
 * Regras da empresa que regem TODA aula no modo professor — ADAPTADA ao contexto.
 *
 * variant="banner" → faixa compacta fixa no topo do Teacher's Guide (cada aula).
 * variant="full"   → card completo no painel docente (princípios gerais).
 *
 * Exceção do Fábio: as aulas TEÓRICAS dele (modelo teoria→prática, não-flipped) são
 * 100% focadas no material/regra, SEM prática de produção. A regra de comunicação/
 * produção vale para ele apenas nas aulas PRÁTICAS. O aviso se adapta a isso.
 *
 * Só renderiza em modo professor (quem chama já garante isso).
 */

const DEFAULT_PRINCIPLES = [
  ['Curso complexo (data centers)', 'Tema de engenharia de data centers é denso. Revise SEMPRE o vocabulário da aula antes e durante — é o que destrava o aproveitamento.'],
  ['Comunicação em primeiro lugar', 'Suas aulas são sempre voltadas à COMUNICAÇÃO. O objetivo nunca é a teoria pela teoria, e sim o aluno se comunicando.'],
  ['Foco na produção', 'No Teacher\'s Guide, os exercícios são sempre prática do que o aluno já estudou na plataforma. Faça o aluno PRODUZIR (falar/escrever) a maior parte da aula.'],
  ['Gramática e material a serviço da fala', 'Se um ponto gramatical ou um material da área do aluno ajudar a aula, fique à vontade para usá-lo — desde que o objetivo e a abordagem sigam alinhados à empresa: comunicação.'],
];

const FABIO_THEORY_PRINCIPLES = [
  ['Aula TEÓRICA (a "planta")', 'No modelo do Fábio (teoria → prática), esta é uma aula de TEORIA por design: foco 100% no material e na regra desta aula. Aqui NÃO se faz prática de produção — isso é intencional.'],
  ['Revise sempre o vocabulário', 'Tema de data centers é denso. Garanta que cada termo-chave fique claro antes de seguir.'],
  ['Apresente com clareza e contexto', 'Conduza você, com exemplos no contexto da Racional (Microsoft / AWS / Google), e cheque o entendimento bloco a bloco.'],
  ['A produção vem na aula PRÁTICA', 'A comunicação e a produção do Fábio acontecem na aula PRÁTICA correspondente (a "obra"). Esta aula prepara o terreno para aquela.'],
];

export default function TeacherCompass({ variant = 'banner', studentId = null, lesson = null }) {
  const isFabioTheory = studentId === 'fabio' && (lesson?.type === 'TEORIA' || lesson?.format === 'theory');
  const principles = isFabioTheory ? FABIO_THEORY_PRINCIPLES : DEFAULT_PRINCIPLES;
  const tag = isFabioTheory ? 'Bússola Pedagógica · Aula TEÓRICA (Fábio)' : 'Bússola Pedagógica · Alumni × Racional';
  const mini = isFabioTheory
    ? 'aula de teoria/planta · 100% no material · a produção é na aula prática'
    : 'curso complexo · revise o vocabulário · foco em comunicação e produção';

  if (variant === 'full') {
    return (
      <div className="rc-compass rc-compass-full">
        <div className="rc-compass-tag"><Icon name="target" size={15} /> {tag}</div>
        <p className="rc-compass-lead">
          Estes princípios regem <strong>todas</strong> as aulas. Eles também aparecem, adaptados ao contexto, no topo do Teacher's Guide de cada aula.
        </p>
        <ul className="rc-compass-list">
          {principles.map(([h, b], i) => (
            <li key={i}><strong>{h}.</strong> {b}</li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <details className={`rc-compass rc-compass-banner${isFabioTheory ? ' rc-compass-theory' : ''}`}>
      <summary>
        <Icon name="target" size={14} />
        <span className="rc-compass-title">{tag}</span>
        <span className="rc-compass-mini">{mini}</span>
        <span className="rc-module-chev">›</span>
      </summary>
      <ul className="rc-compass-list">
        {principles.map(([h, b], i) => (
          <li key={i}><strong>{h}.</strong> {b}</li>
        ))}
      </ul>
    </details>
  );
}
