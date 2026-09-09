/*
  ASTA — trilhas do programa.

  Ordem da página: a história da empresa abre (foundations), as seis áreas de
  atuação vêm em seguida, e o inglês do dia a dia fecha as trilhas
  compartilhadas. As trilhas pessoais (com `owner`) vivem em arquivos próprios
  e só aparecem para o dono, para o apresentador e para o RH.
*/
module.exports = [
  {
    id: 'foundations',
    name: 'ASTA & the Copper Industry',
    level: 'essentials',
    levelLabel: 'Foundations',
    status: 'active',
    description:
      'A empresa e o setor em inglês: 1814, Oed, Cerquilho e Três Corações, o que é um CTC, quem são os clientes e por que cobre move a transição energética. Comece por aqui.',
  },
  {
    id: 'manufacturing',
    name: 'Copper, Wire & Enamelling',
    level: 'essentials',
    levelLabel: 'Área de atuação',
    status: 'active',
    description:
      'O produto e o processo: trefilação, esmaltagem, isolação em papel, cabo transposto e barra Roebel — o vocabulário do chão de fábrica.',
  },
  {
    id: 'maintenance',
    name: 'Maintenance & Engineering',
    level: 'essentials',
    levelLabel: 'Área de atuação',
    status: 'active',
    description:
      'Máquinas, parada de linha, manutenção preventiva e corretiva, peças de reposição e ordens de serviço.',
  },
  {
    id: 'purchasing',
    name: 'Purchasing & Supply Chain',
    level: 'essentials',
    levelLabel: 'Área de atuação',
    status: 'active',
    description:
      'Fornecedores, cotações, pedidos de compra, condições de pagamento, contratos, matérias-primas e estoque.',
  },
  {
    id: 'sales',
    name: 'Sales & Customer Relations',
    level: 'essentials',
    levelLabel: 'Área de atuação',
    status: 'active',
    description:
      'Clientes de transformadores e geradores, propostas, negociação, prazos de entrega e pós-venda.',
  },
  {
    id: 'ehs',
    name: 'EHS, Sustainability & Decarbonisation',
    level: 'essentials',
    levelLabel: 'Área de atuação',
    status: 'active',
    description:
      'Segurança e saúde ocupacional, meio ambiente, descarbonização, energia limpa e o relato de incidentes.',
  },
  {
    id: 'quality',
    name: 'Quality, Compliance & Business Conduct',
    level: 'essentials',
    levelLabel: 'Área de atuação',
    status: 'active',
    description:
      'Normas e ensaios, não conformidade, auditoria, código de conduta e as diretrizes de compliance do grupo.',
  },
  {
    id: 'everyday',
    name: 'Everyday Business English',
    level: 'essentials',
    levelLabel: 'Transversal',
    status: 'active',
    description:
      'O inglês que atravessa todas as áreas: e-mails, calls, reuniões, números, datas e pedidos claros.',
  },

  /* ── Trilhas pessoais ── */
  {
    id: 'andre',
    name: 'André · Maintenance English from Zero',
    level: 'essentials',
    levelLabel: 'Trilha personalizada',
    status: 'active',
    owner: 'andre',
    description:
      'Trilha montada a partir dos temas que você escolheu: manutenção preventiva e corretiva, gestão de prazos, orçamento, gestão de equipe e o linguajar do dia a dia da fábrica. Inglês do começo, bem devagar, com tradução em tudo — vocabulário, enunciados e objetivos em português ao lado do inglês.',
  },
  {
    id: 'maysa',
    name: 'Maysa · Purchasing & Negotiation English',
    level: 'essentials',
    levelLabel: 'Trilha personalizada',
    status: 'active',
    owner: 'maysa',
    description:
      'Trilha montada a partir dos temas que você escolheu, com o peso maior em compras: fornecedores, cotações, condições de pagamento e contratos — mais cobre, esmaltagem, matérias-primas, venda de máquinas, estoque e manutenção.',
  },
  {
    id: 'anilton',
    name: 'Anilton · Decarbonisation, EHS & Compliance English',
    level: 'essentials',
    levelLabel: 'Trilha personalizada',
    status: 'active',
    owner: 'anilton',
    description:
      'Trilha montada a partir dos três temas que você escolheu: o processo de descarbonização, saúde e segurança ambiental e as diretrizes de compliance do negócio — com o grau de desafio de quem já sustenta uma discussão em inglês.',
  },
];
