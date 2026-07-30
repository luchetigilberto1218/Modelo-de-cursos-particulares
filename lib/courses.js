import fs from 'fs';
import path from 'path';

const courseCache = new Map();

export function getCourse(clientId) {
  if (courseCache.has(clientId)) return courseCache.get(clientId);
  const coursePath = path.join(process.cwd(), 'courses', clientId, 'course.json');
  if (!fs.existsSync(coursePath)) return null;
  const course = JSON.parse(fs.readFileSync(coursePath, 'utf-8'));
  courseCache.set(clientId, course);
  return course;
}

// Lesson nav fields used by dashboard/level/track/grammar pages.
const LITE_LESSON_FIELDS = ['num', 'level', 'track', 'trackOrder', 'title', 'focus', 'grammar', 'type', 'topic'];

function pickLiteLesson(lesson) {
  const out = {};
  for (const f of LITE_LESSON_FIELDS) if (lesson[f] !== undefined) out[f] = lesson[f];
  return out;
}

// Lite course: same shape as full, but lessons are stripped to navigation fields only.
// Use this to pass `course` to client components on listing/index pages — avoids
// serializing the entire (multi-MB) course payload into the RSC response.
export function getCourseLite(clientId) {
  const course = getCourse(clientId);
  if (!course) return null;
  const liteLessons = (course.lessons || []).map(pickLiteLesson);
  // Modules carry quiz objects which can be large; strip quiz body but keep counts/labels.
  const liteModules = (course.modules || []).map((m) => ({
    ...m,
    quiz: m.quiz ? { title: m.quiz.title, exercises: (m.quiz.exercises || []).map(() => null) } : undefined,
  }));
  return { ...course, lessons: liteLessons, modules: liteModules };
}

// Search/grammar variant: adds the fields SearchView needs (vocab, takeaways).
export function getCourseForSearch(clientId) {
  const course = getCourse(clientId);
  if (!course) return null;
  const liteLessons = (course.lessons || []).map((lesson) => {
    const out = pickLiteLesson(lesson);
    if (Array.isArray(lesson.vocab)) {
      out.vocab = lesson.vocab.map((v) => ({ en: v.en, pt: v.pt, example: v.example }));
    }
    if (Array.isArray(lesson.takeaways)) out.takeaways = lesson.takeaways;
    return out;
  });
  return { ...course, lessons: liteLessons, modules: undefined };
}

export function getLesson(clientId, num) {
  const course = getCourse(clientId);
  if (!course) return null;
  const idx = (course.lessons || []).findIndex((l) => l.num === num);
  if (idx < 0) return null;
  return { lesson: course.lessons[idx], index: idx, total: course.lessons.length };
}

export function getModuleQuiz(clientId, moduleNum) {
  const course = getCourse(clientId);
  if (!course) return null;
  const mod = course.modules?.[moduleNum - 1];
  if (!mod) return null;
  return {
    quiz: mod.quiz,
    name: mod.name,
    range: mod.range,
  };
}

export function getTheme(clientId) {
  const themePath = path.join(process.cwd(), 'courses', clientId, 'theme.json');
  if (!fs.existsSync(themePath)) return null;
  return JSON.parse(fs.readFileSync(themePath, 'utf-8'));
}

export function getAvailableClients() {
  const coursesDir = path.join(process.cwd(), 'courses');
  if (!fs.existsSync(coursesDir)) return [];
  return fs.readdirSync(coursesDir).filter(d => {
    return fs.existsSync(path.join(coursesDir, d, 'course.json'));
  });
}
