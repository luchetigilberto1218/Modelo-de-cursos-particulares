/* Trilhas do material assíncrono da FAAP.
   `group` decide em que ambiente da home a trilha aparece:
     casa     — a Fundação e o mundo da educação
     trabalho — comercial e atendimento
     livre    — os assuntos de fora do expediente */
module.exports = [
  {
    id: 'fundacao',
    name: 'A Fundação, em inglês',
    group: 'casa',
    level: 'essentials',
    levelLabel: 'A FAAP',
    status: 'active',
    image: '/faapatendimento/img/fachada.jpg',
    description: 'Quem foi Armando Alvares Penteado, como a Fundação nasceu, o campus, o museu, o teatro e os cursos — tudo com as palavras que você usa quando alguém de fora pergunta "so, what is FAAP?".',
  },
  {
    id: 'educacao',
    name: 'Educação: Brasil e o mundo',
    group: 'casa',
    level: 'essentials',
    levelLabel: 'Educação',
    status: 'active',
    image: '/faapatendimento/img/g9.jpg',
    description: 'Como explicar o sistema brasileiro em inglês, como funcionam os sistemas lá fora e o que significa a internacionalização das escolas daqui — IB, Abitur, SAT, ACT, Mizzou.',
  },
  {
    id: 'comercial',
    name: 'Comercial · relacionamento e captação',
    group: 'trabalho',
    level: 'essentials',
    levelLabel: 'Comercial',
    status: 'active',
    image: '/faapatendimento/img/graduacao.jpg',
    description: 'Receber um coordenador estrangeiro, apresentar a FAAP, participar de eventos de escolas internacionais, negociar com cordialidade e escrever bem — do primeiro "good morning" ao follow-up por e-mail.',
  },
  {
    id: 'atendimento',
    name: 'Atendimento e acolhimento',
    group: 'trabalho',
    level: 'essentials',
    levelLabel: 'Atendimento',
    status: 'active',
    image: '/faapatendimento/img/g3.jpg',
    description: 'Receber aluno e família que chegam de fora: cumprimentar, oferecer ajuda, entender o pedido, confirmar que a pessoa entendeu, dizer não sem fechar a porta e responder por escrito.',
  },
  {
    id: 'popculture',
    name: 'Pop Culture',
    group: 'livre',
    level: 'essentials',
    levelLabel: 'Pop Culture',
    status: 'active',
    image: '/faapatendimento/img/livre/popculture.svg',
    description: 'Séries, filmes, música, games, livros e memes — o inglês que você já consome sem perceber, virado do avesso para virar vocabulário seu.',
  },
  {
    id: 'mindbody',
    name: 'Mind & Body',
    group: 'livre',
    level: 'essentials',
    levelLabel: 'Mind & Body',
    status: 'active',
    image: '/faapatendimento/img/livre/mindbody.svg',
    description: 'Saúde mental, futebol europeu, academia, corpo humano, skincare e comida: o inglês do que você faz quando sai daqui.',
  },
];
