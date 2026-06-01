import { notFound } from 'next/navigation';
import { getStudent, getStudentIds } from '../../../../../lib/racional';
import RacionalQuiz from '../../../../../components/racional/RacionalQuiz';

export function generateStaticParams() {
  const params = [];
  for (const student of getStudentIds()) {
    const course = getStudent(student);
    if (!course?.quizzes) continue;
    for (const mod of Object.keys(course.quizzes)) {
      params.push({ student, mod });
    }
  }
  return params;
}

export default async function ProvaPage({ params }) {
  const { student, mod } = await params;
  const course = getStudent(student);
  const quiz = course?.quizzes?.[mod];
  if (!course || !quiz) notFound();
  const modName = course.modules.find((m) => m.code === mod)?.name || mod;
  return <RacionalQuiz meta={{ ...course.meta, id: course.id }} mod={mod} modName={modName} quiz={quiz} />;
}
