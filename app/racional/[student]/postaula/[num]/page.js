import { notFound } from 'next/navigation';
import { getStudentIds, getStudent, getStudentLesson } from '../../../../../lib/racional';
import PostClass from '../../../../../components/racional/PostClass';

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

export default async function PostClassPage({ params }) {
  const { student, num } = await params;
  const data = getStudentLesson(student, num);
  if (!data) notFound();
  return <PostClass course={data.course} lesson={data.lesson} />;
}
