import { notFound } from 'next/navigation';
import { getStudent, getStudentIds } from '../../../lib/racional';
import StudentDashboard from '../../../components/racional/StudentDashboard';

export function generateStaticParams() {
  return getStudentIds().map((student) => ({ student }));
}

export default async function StudentPage({ params }) {
  const { student } = await params;
  const course = getStudent(student);
  if (!course) notFound();
  return <StudentDashboard course={course} />;
}
