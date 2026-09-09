/*
  Carregador de trilha: junta os arquivos numerados de `licoes/<trilha>/` na
  ordem do nome. Cada lição vive num arquivo próprio — assim o material cresce
  sem que um arquivo de mil linhas precise ser reescrito inteiro a cada lição.
*/
const fs = require('fs');
const path = require('path');

module.exports = function trilha(id) {
  const dir = path.join(__dirname, 'licoes', id);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.cjs'))
    .sort()
    .flatMap((f) => {
      const mod = require(path.join(dir, f));
      return Array.isArray(mod) ? mod : [mod];
    });
};
