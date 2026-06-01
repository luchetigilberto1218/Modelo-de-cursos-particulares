import { notFound } from 'next/navigation';
import { getStudent, getStudentIds } from '../../../../lib/racional';
import Glossary from '../../../../components/racional/Glossary';

export function generateStaticParams() {
  return getStudentIds().map((student) => ({ student }));
}

export default async function VocabularioPage({ params }) {
  const { student } = await params;
  const course = getStudent(student);
  if (!course) notFound();

  const items = [];
  for (const l of course.lessons) {
    if (Array.isArray(l.vocab)) {
      for (const v of l.vocab) {
        items.push({ en: v.en, pt: v.pt, example: v.example || '', lessonNum: l.num, lessonTitle: l.title });
      }
    }
  }
  return <Glossary meta={course.meta && { ...course.meta, id: course.id }} items={items} />;
}
