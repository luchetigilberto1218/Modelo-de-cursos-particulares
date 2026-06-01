import { notFound } from 'next/navigation';
import { getStudent, getStudentIds, getStudentLesson } from '../../../../../lib/racional';
import RacionalLessonView from '../../../../../components/racional/RacionalLessonView';

export function generateStaticParams() {
  const params = [];
  for (const student of getStudentIds()) {
    const course = getStudent(student);
    if (!course) continue;
    for (const l of course.lessons) {
      params.push({ student, num: String(l.num) });
    }
  }
  return params;
}

export default async function LessonPage({ params }) {
  const { student, num } = await params;
  const data = getStudentLesson(student, num);
  if (!data) notFound();
  return (
    <RacionalLessonView
      course={data.course}
      lesson={data.lesson}
      prevNum={data.prevNum}
      nextNum={data.nextNum}
    />
  );
}
