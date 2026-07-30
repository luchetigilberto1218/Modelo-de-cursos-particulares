#!/usr/bin/env node
/*
  Baker Hughes — mescla a trilha personalizada da Fernanda no course.json.

  Idempotente: roda quantas vezes quiser. Só mexe na trilha `fernanda` e nas
  lições dela (num 101+). As 9 trilhas compartilhadas e as 63 lições que já
  estão no ar não são tocadas em nenhuma hipótese.

  uso: node scripts/bakerhughes-merge-fernanda.cjs
*/
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const COURSE = path.join(ROOT, 'courses', 'bakerhughes', 'course.json');
const SRC = path.join(ROOT, 'courses', 'bakerhughes', 'fernanda');

const TRACK = {
  id: 'fernanda',
  name: 'Fernanda · Business & Leadership English',
  status: 'active',
  owner: 'fernanda',
  level: 'essentials',
  description:
    'Trilha desenhada a partir dos temas que você mesma escolheu: números e orçamento, contratos, projetos, clientes, negociação, apresentações, e-mails e Teams, reuniões, liderança People First e tomada de decisão.',
};

const BASE_NUM = 101; // as lições compartilhadas vão de 1 a 63 — sem colisão

function main() {
  const course = JSON.parse(fs.readFileSync(COURSE, 'utf-8'));

  const files = fs.readdirSync(SRC).filter((f) => /^topic-\d+\.json$/.test(f)).sort();
  if (!files.length) {
    console.error('Nenhum topic-XX.json em', SRC);
    process.exit(1);
  }

  const lessons = [];
  let order = 0;
  for (const f of files) {
    const topic = JSON.parse(fs.readFileSync(path.join(SRC, f), 'utf-8'));
    for (const l of topic.lessons) {
      order += 1;
      lessons.push({
        ...l,
        num: BASE_NUM + order - 1,
        level: 'essentials',
        track: 'fernanda',
        trackOrder: order,
        levelLabel: 'Sua trilha',
        trackLabel: TRACK.name,
        topic: topic.topic,
        objectiveLabel: l.objectiveLabel || 'O que você leva daqui',
        practiceLabel: l.practiceLabel || 'Practice · pratique sozinha',
      });
    }
  }

  // trilha (substitui a versão anterior, se houver)
  course.tracks = (course.tracks || []).filter((t) => t.id !== 'fernanda').concat([TRACK]);
  // lições (troca só as da trilha dela)
  const others = (course.lessons || []).filter((l) => l.track !== 'fernanda');
  course.lessons = others.concat(lessons);
  course.meta = {
    ...course.meta,
    totalTracks: course.tracks.length,
    totalLessons: course.lessons.length,
  };

  fs.writeFileSync(COURSE, JSON.stringify(course, null, 2));
  console.log(`OK — ${lessons.length} lições da Fernanda (${files.length} tópicos).`);
  console.log(`     curso agora: ${course.lessons.length} lições, ${course.tracks.length} trilhas.`);
}

main();
