import fs from 'fs';
import path from 'path';

const ROOT = path.join(process.cwd(), 'courses', 'racional');

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(path.join(ROOT, file), 'utf-8'));
  } catch {
    return null;
  }
}

/** Marca + lista dos 6 alunos (landing). */
export function getRacionalIndex() {
  return readJson('index.json');
}

/** IDs de todos os alunos (para generateStaticParams). */
export function getStudentIds() {
  const idx = getRacionalIndex();
  return idx?.students?.map((s) => s.id) || [];
}

/** Curso completo de um aluno. */
export function getStudent(id) {
  if (!/^[a-z]+$/.test(id || '')) return null;
  return readJson(`${id}.json`);
}

/** Uma aula + vizinhas. Retorna um curso ENXUTO (sem o array completo de
 *  aulas) para não inflar o payload de cada página de aula. */
export function getStudentLesson(id, num) {
  const course = getStudent(id);
  if (!course) return null;
  const n = parseInt(num, 10);
  const index = course.lessons.findIndex((l) => l.num === n);
  if (index === -1) return null;
  const lesson = course.lessons[index];
  const prevNum = index > 0 ? course.lessons[index - 1].num : null;
  const nextNum = index < course.lessons.length - 1 ? course.lessons[index + 1].num : null;
  const { lessons, overview, logic, capstoneDetail, distribution, legend, ...slim } = course;
  return { lesson, prevNum, nextNum, course: slim };
}
