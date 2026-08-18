#!/usr/bin/env node
/*
  Capas da área livre, no visual do FAAP English Hub.

  O hub ilustra cada tópico com pôster de filme e série. Aqui as capas são
  geradas: o material é interno e nós não temos os direitos daquelas imagens.
  O que se copia é a linguagem visual — fundo #0a0612, glow radial do accent,
  gradiente diagonal rosa/ciano (neon) ou roxo/lima (calm) e tipografia grande.

    node scripts/build-faap-covers.cjs
*/
const fs = require('fs');
const path = require('path');
const OUT = path.join(__dirname, '..', 'public', 'faapatendimento', 'img', 'livre');

// Tema neon = Pop Culture; calm = Mind & Body. Cores idênticas às do hub.
const NEON = { bg: '#0a0612', a: '#ff3dc3', b: '#9d4edd', c: '#00e5ff' };
const CALM = { bg: '#0b0618', a: '#a855f7', b: '#7c3aed', c: '#bef264' };

const items = [
  { id: 'popculture', label: 'Pop Culture', sub: 'fora do expediente', t: NEON, shape: 'waves' },
  { id: 'tv',         label: 'TV Shows',    sub: 'Pop Culture',        t: NEON, shape: 'grid' },
  { id: 'movies',     label: 'Movies',      sub: 'Pop Culture',        t: NEON, shape: 'frames' },
  { id: 'music',      label: 'Music',       sub: 'Pop Culture',        t: NEON, shape: 'bars' },
  { id: 'geek',       label: 'Geek',        sub: 'Pop Culture',        t: NEON, shape: 'pixels' },
  { id: 'mindbody',   label: 'Mind & Body', sub: 'fora do expediente', t: CALM, shape: 'orbit' },
  { id: 'mental',     label: 'Mental Health', sub: 'Mind & Body',      t: CALM, shape: 'orbit' },
  { id: 'football',   label: 'Football',    sub: 'Mind & Body',        t: { ...CALM, a: '#22c55e', b: '#16a34a', c: '#ef4444' }, shape: 'pitch' },
  { id: 'gym',        label: 'Gym & Training', sub: 'Mind & Body',     t: { ...CALM, a: '#fb923c', b: '#f97316', c: '#fbbf24' }, shape: 'bars' },
  { id: 'anatomy',    label: 'Human Anatomy', sub: 'Mind & Body',      t: { ...CALM, a: '#60a5fa', b: '#3b82f6', c: '#f472b6' }, shape: 'spine' },
  { id: 'skincare',   label: 'Skincare',    sub: 'Mind & Body',        t: { ...CALM, a: '#f0abfc', b: '#d946ef', c: '#a855f7' }, shape: 'bubbles' },
  { id: 'nutrition',  label: 'Nutrition',   sub: 'Mind & Body',        t: { ...CALM, a: '#facc15', b: '#eab308', c: '#bef264' }, shape: 'grid' },
];

function shape(kind, a) {
  switch (kind) {
    case 'waves':
      return `<path d="M0 400 Q150 340 300 400 T600 400 T900 400 T1200 400" stroke="${a}" stroke-width="3" fill="none" opacity=".5"/>
        <path d="M0 440 Q150 380 300 440 T600 440 T900 440 T1200 440" stroke="${a}" stroke-width="2" fill="none" opacity=".28"/>`;
    case 'grid':
      return Array.from({ length: 7 }, (_, i) => Array.from({ length: 3 }, (_, j) =>
        `<rect x="${830 + i * 50}" y="${130 + j * 108}" width="38" height="78" rx="7" fill="${a}" opacity="${0.1 + ((i + j) % 4) * 0.1}"/>`).join('')).join('');
    case 'frames':
      return Array.from({ length: 4 }, (_, i) =>
        `<rect x="${840 + i * 86}" y="${155 + (i % 2) * 38}" width="66" height="185" rx="9" fill="none" stroke="${a}" stroke-width="2" opacity="${0.55 - i * 0.1}"/>`).join('');
    case 'bars':
      return Array.from({ length: 14 }, (_, i) => {
        const h = 40 + Math.abs(Math.sin(i * 1.1)) * 190;
        return `<rect x="${810 + i * 27}" y="${405 - h}" width="11" height="${h}" rx="5.5" fill="${a}" opacity="${0.25 + (i % 5) * 0.12}"/>`;
      }).join('');
    case 'pixels':
      return Array.from({ length: 40 }, (_, i) => {
        const x = 820 + (i % 8) * 44, y = 120 + Math.floor(i / 8) * 44;
        return (i * 7) % 3 ? `<rect x="${x}" y="${y}" width="32" height="32" rx="3" fill="${a}" opacity="${0.12 + ((i * 3) % 5) * 0.11}"/>` : '';
      }).join('');
    case 'bubbles':
      return `<circle cx="910" cy="190" r="70" fill="${a}" opacity=".18"/><circle cx="1030" cy="280" r="46" fill="${a}" opacity=".28"/>
        <circle cx="890" cy="330" r="30" fill="${a}" opacity=".38"/><circle cx="1090" cy="160" r="20" fill="${a}" opacity=".5"/>`;
    case 'orbit':
      return `<circle cx="975" cy="260" r="120" fill="none" stroke="${a}" stroke-width="2" opacity=".38"/>
        <circle cx="975" cy="260" r="76" fill="none" stroke="${a}" stroke-width="2" opacity=".55"/>
        <circle cx="975" cy="260" r="26" fill="${a}" opacity=".6"/>
        <circle cx="1095" cy="260" r="9" fill="${a}"/><circle cx="899" cy="260" r="7" fill="${a}" opacity=".7"/>`;
    case 'pitch':
      return `<rect x="825" y="130" width="300" height="260" rx="8" fill="none" stroke="${a}" stroke-width="2" opacity=".5"/>
        <line x1="975" y1="130" x2="975" y2="390" stroke="${a}" stroke-width="2" opacity=".5"/>
        <circle cx="975" cy="260" r="46" fill="none" stroke="${a}" stroke-width="2" opacity=".5"/>
        <rect x="825" y="200" width="46" height="120" fill="none" stroke="${a}" stroke-width="2" opacity=".5"/>
        <rect x="1079" y="200" width="46" height="120" fill="none" stroke="${a}" stroke-width="2" opacity=".5"/>`;
    case 'spine':
      return Array.from({ length: 9 }, (_, i) =>
        `<rect x="${955 - (i % 2) * 14}" y="${120 + i * 30}" width="${54 + (i % 3) * 10}" height="20" rx="9" fill="${a}" opacity="${0.24 + i * 0.06}"/>`).join('');
    default: return '';
  }
}

for (const it of items) {
  const { bg, a, b, c } = it.t;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 520" width="1200" height="520" role="img" aria-label="${it.label}">
  <defs>
    <linearGradient id="hero" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${a}"/><stop offset="50%" stop-color="${b}"/><stop offset="100%" stop-color="${c}"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="0%" r="70%">
      <stop offset="0%" stop-color="${a}" stop-opacity="0.30"/><stop offset="55%" stop-color="${a}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="520" fill="${bg}"/>
  <rect width="1200" height="520" fill="url(#glow)"/>
  <rect width="1200" height="5" fill="url(#hero)"/>
  ${shape(it.shape, a)}
  <text x="80" y="238" font-family="Inter, Helvetica, Arial, sans-serif" font-size="24" font-weight="700" letter-spacing="4.5" fill="${a}">◉ ${it.sub.toUpperCase()}</text>
  <text x="80" y="322" font-family="Inter, Helvetica, Arial, sans-serif" font-size="74" font-weight="800" letter-spacing="-2" fill="#f5eeff">${it.label}</text>
  <rect x="80" y="360" width="96" height="4" rx="2" fill="url(#hero)"/>
</svg>`;
  fs.writeFileSync(path.join(OUT, `${it.id}.svg`), svg);

  // Variante para o fundo do hero: as mesmas formas, sem o texto — senão o
  // título da capa aparece atrás do título da página e os dois se atrapalham.
  const bgOnly = svg
    .replace(/<text[\s\S]*?<\/text>/g, '')
    .replace(/<rect x="80" y="360"[^>]*\/>/g, '');
  fs.writeFileSync(path.join(OUT, `${it.id}-bg.svg`), bgOnly);
}
// capas dos temas que saíram do material
for (const velho of ['books.svg', 'memes.svg']) {
  const f = path.join(OUT, velho);
  if (fs.existsSync(f)) { fs.unlinkSync(f); console.log('  removida:', velho); }
}
console.log(`✓ ${items.length} capas no visual do hub → public/faapatendimento/img/livre/`);
