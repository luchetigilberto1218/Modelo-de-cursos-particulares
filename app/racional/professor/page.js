import { getRacionalIndex } from '../../../lib/racional';
import ProfessorHub from '../../../components/racional/ProfessorHub';

export default function ProfessorPage() {
  const index = getRacionalIndex();
  return <ProfessorHub students={index.students} professorCode={index.access?.professorCode || ''} />;
}
