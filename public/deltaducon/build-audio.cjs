// Gera os áudios das aulas com 2 vozes ElevenLabs (masculina + feminina, inglês),
// escolhendo o gênero pelo texto (nome em 1ª pessoa -> pronomes -> alterna).
// Saída: public/deltaducon/audio/l/<TRILHA>-<n>-{intro,listen}.mp3
// Uso: XI="<ELEVENLABS_API_KEY>" node build-audio.cjs   (roda a partir desta pasta)
// Também há build-lessons.cjs (dados) e os clipes do apresentador em audio/intro-*.mp3.
const https = require('https'); const fs = require('fs'); const path = require('path');
const KEY = process.env.XI;
if (!KEY) { console.error('Defina XI com a API key do ElevenLabs.'); process.exit(1); }
const DIR = __dirname;
eval(fs.readFileSync(path.join(DIR, 'lessons.js'), 'utf8').replace('window.', 'global.'));
const OUT = path.join(DIR, 'audio', 'l'); fs.mkdirSync(OUT, { recursive: true });
const VOICE = { m: 'cjVigY5qzO86Huf0OWal', f: 'XrExE9yKIg1WjnnlVkGX' }; // Eric (M), Matilda (F)
const FEMALE = new Set(['Ana','Paula','Sofia','Carla','Elena','Renata','Lucia','Elisa','Maria','Beatriz','Julia','Andrea','Camila','Fernanda','Patricia','Amanda','Bruna','Larissa','Gabriela','Isabela','Helena','Clara','Sara','Sarah','Marta','Rita','Vera']);
const MALE = new Set(['Ricardo','Paulo','Marcos','Diego','Rafael','Bruno','Pedro','Fabio','Carlos','Joao','Lucas','Gustavo','Felipe','Andre','Marcio','Anselmo','Milton','Aldo','Eduardo','Antonio','Fernando','Gabriel','Hugo','Jefferson','Roberto','Thiago','Tiago','Rodrigo','Daniel','Leonardo','Mateus','Victor','Sergio','Luis','Jorge']);
function gender(text, idx) {
  const m = text.match(/\b(?:I am|I'?m|My name is)\s+([A-Z][a-z]+)/);
  if (m) { if (FEMALE.has(m[1])) return 'f'; if (MALE.has(m[1])) return 'm'; }
  const f = (text.match(/\b(she|her|hers)\b/gi) || []).length;
  const ml = (text.match(/\b(he|him|his)\b/gi) || []).length;
  if (f > ml) return 'f'; if (ml > f) return 'm';
  return idx % 2 ? 'f' : 'm';
}
const tasks = []; let gi = 0;
global.LESSONS.tracks.forEach(t => t.lessons.forEach((l, li) => {
  const intro = (l.intro || []).join(' ');
  if (intro) tasks.push({ id: `${t.id}-${li + 1}-intro`, text: intro, g: gender(intro, gi++) });
  const at = (l.audio && l.audio.text) || '';
  if (at) tasks.push({ id: `${t.id}-${li + 1}-listen`, text: at, g: gender(at, gi++) });
}));
function tts(t, attempt) {
  return new Promise((res, rej) => {
    const f = path.join(OUT, t.id + '.mp3');
    if (fs.existsSync(f) && fs.statSync(f).size > 1000) return res('skip ' + t.id);
    const body = JSON.stringify({ text: t.text, model_id: 'eleven_multilingual_v2', voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0, use_speaker_boost: true } });
    const req = https.request({ host: 'api.elevenlabs.io', path: '/v1/text-to-speech/' + VOICE[t.g], method: 'POST', headers: { 'xi-api-key': KEY, 'content-type': 'application/json', accept: 'audio/mpeg', 'content-length': Buffer.byteLength(body) } }, r => {
      const ch = []; r.on('data', d => ch.push(d)); r.on('end', () => {
        const buf = Buffer.concat(ch);
        if (r.statusCode !== 200) { if ((r.statusCode === 429 || r.statusCode >= 500) && attempt < 4) return setTimeout(() => tts(t, attempt + 1).then(res, rej), 1500 * attempt); return rej(t.id + ' HTTP ' + r.statusCode); }
        fs.writeFileSync(f, buf); res(t.g.toUpperCase() + ' ' + t.id);
      });
    });
    req.on('error', e => { if (attempt < 4) setTimeout(() => tts(t, attempt + 1).then(res, rej), 1500 * attempt); else rej(t.id + ' ' + e.message); });
    req.write(body); req.end();
  });
}
const CONC = 4; let done = 0, failed = [];
async function worker(q) { while (q.length) { const t = q.shift(); try { await tts(t, 1); done++; } catch (e) { failed.push(e); } } }
(async () => {
  const q = tasks.slice();
  await Promise.all(Array.from({ length: CONC }, () => worker(q)));
  console.log('clipes:', tasks.length, '| ok/skip:', done, '| falhas:', failed.length);
  if (failed.length) console.log(failed);
})();
