#!/usr/bin/env node
/*
  Baker Hughes — mescla a trilha personalizada da Mariana no course.json.

  Idempotente: roda quantas vezes quiser. Só mexe na trilha `mariana` e nas
  lições dela (num 201+). As 9 trilhas compartilhadas, as 63 lições que já
  estão no ar e a trilha da Fernanda (101+) não são tocadas em nenhuma hipótese.

  uso: node scripts/bakerhughes-merge-mariana.cjs
*/
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const COURSE = path.join(ROOT, 'courses', 'bakerhughes', 'course.json');
const SRC = path.join(ROOT, 'courses', 'bakerhughes', 'mariana');

const TRACK = {
  id: 'mariana',
  name: 'Mariana · Tech, Product & Leadership English',
  status: 'active',
  owner: 'mariana',
  level: 'essentials',
  description:
    'Trilha desenhada a partir dos temas que você mesma escolheu: gestão de projetos e agile, reuniões e liderança, apresentar e explicar tecnologia, colaboração entre áreas, métricas e risco — mais o inglês técnico de desenvolvimento, cloud, dados e IA, e o vocabulário de HSE, supply chain e óleo e gás do produto com que você trabalha.',
};

const BASE_NUM = 201; // compartilhadas 1–63, Fernanda 101+ — sem colisão

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
        track: 'mariana',
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
  course.tracks = (course.tracks || []).filter((t) => t.id !== 'mariana').concat([TRACK]);
  // lições (troca só as da trilha dela)
  const others = (course.lessons || []).filter((l) => l.track !== 'mariana');
  course.lessons = others.concat(lessons);
  course.meta = {
    ...course.meta,
    totalTracks: course.tracks.length,
    totalLessons: course.lessons.length,
  };

  fs.writeFileSync(COURSE, JSON.stringify(course, null, 2));
  console.log(`OK — ${lessons.length} lições da Mariana (${files.length} tópicos).`);
  console.log(`     curso agora: ${course.lessons.length} lições, ${course.tracks.length} trilhas.`);
}

main();
