import { notFound } from 'next/navigation';
import { getStudentIds, getStudent } from '../../../../../lib/racional';
import { buildDistractorPool, buildPostClass } from '../../../../../lib/postclass-exercises';
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
  const course = getStudent(student);
  if (!course) notFound();
  const n = parseInt(num, 10);
  const lesson = course.lessons.find((l) => l.num === n);
  if (!lesson) notFound();

  const pool = buildDistractorPool(course, n);
  const { blocks } = buildPostClass({ ...lesson, __meta: course.meta }, pool);

  // curso enxuto (sem o array completo de aulas) para não inflar o payload
  const { lessons, overview, logic, capstoneDetail, distribution, legend, ...slim } = course;
  return <PostClass course={slim} lesson={lesson} blocks={blocks} />;
}
