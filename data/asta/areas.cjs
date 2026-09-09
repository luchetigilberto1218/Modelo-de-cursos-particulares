/*
  As seis áreas de atuação da ASTA — o "break down" que abre a página depois da
  história. Cada área é também uma trilha: o botão leva direto para ela.
  `similar` guarda o que foi fundido dentro daquela área, para ninguém procurar
  uma sétima trilha que não existe.
*/
module.exports = [
  {
    id: 'manufacturing',
    track: 'manufacturing',
    name: 'Copper, Wire & Enamelling',
    pt: 'Cobre, fios e esmaltagem',
    short: 'PRODUCTION',
    description:
      'Trefilação, esmaltagem, isolação em papel, cabo transposto (CTC) e barra Roebel. É o produto e o processo — de onde sai tudo o que a ASTA vende.',
    similar: ['Produção', 'Processo', 'Engenharia de produto'],
  },
  {
    id: 'maintenance',
    track: 'maintenance',
    name: 'Maintenance & Engineering',
    pt: 'Manutenção e engenharia',
    short: 'MAINTENANCE',
    description:
      'Máquinas, parada de linha, manutenção preventiva e corretiva, ordem de serviço, peça de reposição e o inglês dos manuais de equipamento importado.',
    similar: ['Manutenção elétrica', 'Manutenção mecânica', 'Utilidades'],
  },
  {
    id: 'purchasing',
    track: 'purchasing',
    name: 'Purchasing & Supply Chain',
    pt: 'Compras e cadeia de suprimentos',
    short: 'PURCHASING',
    description:
      'Fornecedores, cotações, pedido de compra, condições de pagamento, contratos, matéria-prima, importação e estoque.',
    similar: ['Suprimentos', 'Logística', 'Comércio exterior', 'Almoxarifado'],
  },
  {
    id: 'sales',
    track: 'sales',
    name: 'Sales & Customer Relations',
    pt: 'Vendas e relacionamento com clientes',
    short: 'SALES',
    description:
      'Os fabricantes de transformadores e geradores, propostas, negociação, prazo de entrega, venda de máquinas e pós-venda.',
    similar: ['Comercial', 'Vendas técnicas', 'Atendimento ao cliente'],
  },
  {
    id: 'ehs',
    track: 'ehs',
    name: 'EHS, Sustainability & Decarbonisation',
    pt: 'Saúde, segurança, meio ambiente e descarbonização',
    short: 'EHS',
    description:
      'Segurança e saúde ocupacional, meio ambiente, relato de incidente, energia limpa e o processo de descarbonização do grupo.',
    similar: ['SSMA', 'Segurança do trabalho', 'Meio ambiente', 'Sustentabilidade'],
  },
  {
    id: 'quality',
    track: 'quality',
    name: 'Quality, Compliance & Business Conduct',
    pt: 'Qualidade, compliance e conduta',
    short: 'QUALITY',
    description:
      'Normas e ensaios, não conformidade, auditoria de cliente, código de conduta e as diretrizes de compliance do grupo.',
    similar: ['Qualidade', 'Laboratório', 'Auditoria', 'Compliance', 'Jurídico'],
  },
];
