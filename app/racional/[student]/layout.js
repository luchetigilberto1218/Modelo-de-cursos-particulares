import { getStudent } from '../../../lib/racional';
import StudentGate from '../../../components/racional/StudentGate';

export default async function StudentLayout({ children, params }) {
  const { student } = await params;
  const course = getStudent(student);
  const meta = course?.meta || {};
  return (
    <StudentGate
      studentId={student}
      password={meta.password || ''}
      studentName={meta.studentName || ''}
      accent={meta.accent || '#102A71'}
    >
      {children}
    </StudentGate>
  );
}
