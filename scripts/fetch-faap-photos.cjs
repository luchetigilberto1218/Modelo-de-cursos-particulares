#!/usr/bin/env node
/*
  Fotos da área livre, do Openverse (Wikimedia, Flickr e afins).

  O FAAP English Hub ilustra os tópicos com pôster de filme e série. Aqui não
  dá: o material é nosso e aqueles pôsteres têm dono. Então buscamos fotografia
  de licença aberta sobre o tema, preferindo domínio público / CC0 — que não
  exige atribuição — e caindo para CC BY quando não houver.

  Os créditos ficam em img/livre/creditos.json e são obrigatórios para CC BY.

    node scripts/fetch-faap-photos.cjs
*/
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const OUT = path.join(__dirname, '..', 'public', 'faapatendimento', 'img', 'livre', 'foto');
const API = 'https://api.openverse.org/v1/images/';

// Licenças sem exigência de crédito primeiro; CC BY entra só se preciso.
const PREFER = ['cc0', 'pdm'];

// Recorte com fundo transparente não serve de capa — sob o gradiente do card
// ele vira um borrão. O acervo marca isso no título.
const RECORTE = /png sticker|transparent|clipart|cut ?out|isolated|white background/i;
const serve = (r) => !RECORTE.test(r.title || '') && !/\.png($|\?)/i.test(r.url || '');

// Várias consultas por tópico: a primeira que devolver uma foto de domínio
// público ganha. Sem isso, um tópico fica sem imagem por causa do vocabulário
// do acervo, não por falta de foto.
const TOPICS = [
  { id: 'tv',        qs: ['home cinema screen dark', 'living room sofa television', 'tv screen glow'] },
  { id: 'movies',    qs: ['film reel cinema', 'cinema auditorium seats screen', 'movie theater'] },
  { id: 'music',     qs: ['electric guitar', 'vinyl record player', 'concert stage lights'] },
  { id: 'geek',      qs: ['Hubble nebula NASA', 'star cluster telescope', 'milky way night sky'] },
  { id: 'mental',    qs: ['mist fog lake', 'calm sea horizon', 'forest morning light'] },
  { id: 'football',  qs: ['football stadium', 'soccer pitch floodlights', 'football pitch grass'] },
  { id: 'gym',       qs: ['dumbbells weights', 'gym equipment', 'barbell training'] },
  { id: 'anatomy',   qs: ['anatomy illustration muscles', 'human skeleton drawing', 'anatomical plate'] },
  { id: 'skincare',  qs: ['glass bottles still life', 'cosmetic jar', 'soap bottles white'] },
  { id: 'nutrition', qs: ['vegetable market stall', 'fresh food table photograph', 'farmers market produce'] },
];

// O Wikimedia recusa download com User-Agent genérico — precisa de um que
// identifique quem está baixando, com contato. Sem isso volta uma página de erro.
const UA = 'AlumnyMaterialBot/1.0 (https://alumni.org.br; ti@alumni.org.br)';
function get(url) {
  return execFileSync('curl', ['-sL', '--max-time', '60', '-H', `User-Agent: ${UA}`, url], { maxBuffer: 60 * 1024 * 1024 });
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const creditos = {};
  for (const t of TOPICS) {
    let escolha = null, resto = null;
    for (const q of t.qs) {
      const url = `${API}?q=${encodeURIComponent(q)}&license_type=commercial&aspect_ratio=wide&size=large&page_size=20`;
      let results = [];
      try { results = JSON.parse(get(url).toString()).results || []; } catch { continue; }
      const livre = results.find((r) => PREFER.includes(r.license) && serve(r));
      if (livre) { escolha = livre; break; }
      if (!resto) resto = results.find(serve) || null;
    }
    escolha = escolha || resto;
    if (!escolha) { console.log(`  ! ${t.id}: nenhuma imagem`); continue; }
    const file = path.join(OUT, `${t.id}.jpg`);
    try {
      fs.writeFileSync(file, get(escolha.url));
      execFileSync('sips', ['-Z', '1400', '-s', 'format', 'jpeg', '-s', 'formatOptions', '70', file, '--out', file], { stdio: 'ignore' });
    } catch (e) { console.log(`  ! ${t.id}: falhou o download`); continue; }

    creditos[t.id] = {
      titulo: escolha.title || '',
      autor: escolha.creator || '',
      licenca: `${escolha.license}${escolha.license_version ? ' ' + escolha.license_version : ''}`.toUpperCase(),
      fonte: escolha.foreign_landing_url || escolha.url,
      precisaCredito: !PREFER.includes(escolha.license),
    };
    const kb = (fs.statSync(file).size / 1024).toFixed(0);
    console.log(`  ✓ ${t.id.padEnd(10)} ${creditos[t.id].licenca.padEnd(10)} ${kb.padStart(4)} KB  ${(escolha.title || '').slice(0, 40)}`);
  }
  fs.writeFileSync(path.join(OUT, '..', 'creditos.json'), JSON.stringify(creditos, null, 2));
  const comCredito = Object.values(creditos).filter((c) => c.precisaCredito).length;
  console.log(`\n✓ ${Object.keys(creditos).length} fotos · ${comCredito} exigem crédito (ver creditos.json)`);
}
main();
