/*
  A turma da ASTA.

  `track` preenchido = a pessoa já enviou os temas e tem trilha personalizada
  no ar. `track: null` = ainda no aguardo do envio dos itens — o nome aparece
  na visão do RH em tom opaco, e nada mais.

  Quem saiu do programa não fica aqui: Rita de Cássia Greco Matos de Lima
  (saiu da empresa) e Roberto Junior Araujo (pediu desligamento em 08/09/2026)
  foram removidos da lista em 09/09/2026.
*/
module.exports = [
  { id: 'anilton', name: 'Anilton Alves de Menezes',      level: 'Rise 1',        track: 'anilton' },
  { id: 'maysa',   name: 'Maysa Vitória Diniz Marquez',   level: 'Essentials 3',  track: 'maysa' },
  { id: 'andre',   name: 'André Domingos Lazarin',        level: 'Real beginner', track: 'andre' },
  { id: 'antonio', name: 'Antonio Marcio Zarpelão',       level: null, track: null },
  { id: 'bruno',   name: 'Bruno William Silva dos Santos', level: null, track: null },
  { id: 'fabio',   name: 'Fabio Paques',                  level: null, track: null },
  { id: 'thiago',  name: 'Thiago Teodoro',                level: null, track: null },
  { id: 'william', name: 'William Aguiar de Oliveira',    level: null, track: null },
  { id: 'diego',   name: 'Diego Munoz Andrade',           level: null, track: null },
];
