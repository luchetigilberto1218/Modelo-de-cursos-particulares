import { notFound } from 'next/navigation';
import { getStudent, getStudentIds } from '../../../../../lib/racional';
import BonusReader from '../../../../../components/racional/BonusReader';

export function generateStaticParams() {
  const params = [];
  for (const student of getStudentIds()) {
    const course = getStudent(student);
    for (const ex of course?.extras || []) {
      params.push({ student, id: ex.id });
    }
  }
  return params;
}

export default async function ExtraPage({ params }) {
  const { student, id } = await params;
  const course = getStudent(student);
  const item = (course?.extras || []).find((e) => e.id === id);
  if (!course || !item) notFound();
  return <BonusReader meta={{ ...course.meta, id: course.id }} item={item} />;
}
