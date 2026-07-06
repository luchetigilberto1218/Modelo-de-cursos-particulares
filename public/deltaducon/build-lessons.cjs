// Monta lessons.js a partir dos JSON por trilha em ./data
const fs = require('fs');
const path = require('path');
const D = path.join(__dirname, 'data');

const IMG = {
  factory: 'https://static.wixstatic.com/media/0f6ed5_e9286b3abd8040778458ad52178eefc1~mv2.jpg',
  office:  'https://static.wixstatic.com/media/0f6ed5_2f23468731be406fb49894316fe52bff~mv2.png',
  steel:   'https://static.wixstatic.com/media/0f6ed5_dcdbf45564ab422e91d753753623c2e4~mv2.jpg',
  esp:     'https://static.wixstatic.com/media/0f6ed5_b85e26e9a1e4447a924460bf8ebcff6f~mv2.jpg',
};

const META = [
  { id:'BIZ', ptName:'Inglês para Negócios',        subtitle:'Comunicação geral no trabalho',        img:IMG.office,  files:['BIZ1.json','BIZ.json','BIZ2.json'] },
  { id:'ADM', ptName:'Assistentes Administrativos',  subtitle:'Rotina, agenda e documentos',           img:IMG.office,  files:['ADM.json','ADM2.json'] },
  { id:'SAL', ptName:'Vendas / Comercial',           subtitle:'Clientes, propostas e negociação',      img:IMG.esp,     files:['SAL.json','SAL2.json'] },
  { id:'IND', ptName:'Gestão Industrial',            subtitle:'Produção, montagem e segurança',        img:IMG.steel,   files:['IND.json','IND2.json'] },
  { id:'QUA', ptName:'Qualidade e PCP',              subtitle:'ISO 9001, inspeções e planejamento',    img:IMG.factory, files:['QUA.json','QUA2.json'] },
  { id:'PEO', ptName:'Gestão de Pessoas',            subtitle:'Equipe, feedback e desenvolvimento',    img:IMG.office,  files:['PEO.json','PEO2.json'] },
  { id:'ENG', ptName:'Engenharia de Aplicação',      subtitle:'Projeto e especificação técnica',       img:IMG.esp,     files:['ENG.json','ENG2.json'] },
  { id:'PUR', ptName:'Compras (Procurement)',        subtitle:'Fornecedores, pedidos e prazos',        img:IMG.steel,   files:['PUR.json','PUR2.json'] },
];

function load(file){
  const p = path.join(D, file);
  if(!fs.existsSync(p)){ console.warn('FALTA:', file); return []; }
  const raw = fs.readFileSync(p,'utf8');
  let j;
  try { j = JSON.parse(raw); } catch(e){ console.error('JSON INVÁLIDO:', file, e.message); return []; }
  return Array.isArray(j) ? j : [j];
}

const tracks = META.map(m=>{
  let lessons = [];
  m.files.forEach(f=> lessons = lessons.concat(load(f)) );
  return { id:m.id, ptName:m.ptName, subtitle:m.subtitle, img:m.img, lessons };
});

const total = tracks.reduce((s,t)=>s+t.lessons.length,0);
tracks.forEach(t=> console.log(`${t.id}: ${t.lessons.length} aulas`) );
console.log('TOTAL:', total);

const out = 'window.LESSONS = ' + JSON.stringify({tracks}, null, 0) + ';\n';
fs.writeFileSync(path.join(__dirname,'lessons.js'), out);
console.log('lessons.js gravado ('+ (out.length/1024).toFixed(0) +' KB)');
