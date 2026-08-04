#!/usr/bin/env node
/*
  Roda a compactação do contador de acessos na mão, sem esperar o cron diário.
  Útil depois de um pico de acesso ou para conferir o efeito.

  Uso:  node scripts/czt-compacta-acessos.cjs
*/
const fs = require('fs');
const path = require('path');
const RAIZ = path.join(__dirname, '..');
for (const l of fs.readFileSync(path.join(RAIZ, '.env.local'), 'utf8').split('\n')) {
  const m = l.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
  if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
(async () => {
  const { list } = await import('@vercel/blob');
  const { compactarDiasFechados } = await import('../lib/stats.js');
  const antes = await list({ limit: 1000 });
  const contaEv = antes.blobs.filter((b) => b.pathname.startsWith('ev/')).length;
  const contaAgg = antes.blobs.filter((b) => b.pathname.startsWith('agg/')).length;
  console.log(`antes:  ${contaEv} eventos crus · ${contaAgg} dias compactados`);
  const r = await compactarDiasFechados();
  const depois = await list({ limit: 1000 });
  console.log(`compactados ${r.dias} dia(s), ${r.apagados} evento(s) apagado(s)`);
  console.log(`depois: ${depois.blobs.filter((b) => b.pathname.startsWith('ev/')).length} eventos crus · ${depois.blobs.filter((b) => b.pathname.startsWith('agg/')).length} dias compactados`);
  console.log(`total de arquivos no store: ${antes.blobs.length} → ${depois.blobs.length}`);
})().catch((e) => { console.error('ERRO:', e.message); process.exit(1); });
