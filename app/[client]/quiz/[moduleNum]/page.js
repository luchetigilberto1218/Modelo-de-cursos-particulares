import { redirect } from 'next/navigation';
import { getCourse } from '../../../../lib/courses';
import NavBar from '../../../../components/NavBar';
import ModuleQuiz from '../../../../components/ModuleQuiz';

export default async function QuizPage({ params }) {
  const { client, moduleNum } = await params;

  const course = getCourse(client);
  if (!course) redirect('/');

  const modIdx = parseInt(moduleNum, 10) - 1;
  const mod = course.modules?.[modIdx];
  if (!mod) redirect(`/${client}`);

  const totalLessons = (mod.range?.[1] ?? 0) - (mod.range?.[0] ?? 0);

  return (
    <>
      <NavBar clientId={client} />
      <ModuleQuiz
        quiz={mod.quiz}
        moduleName={mod.name}
        moduleNum={modIdx + 1}
        clientId={client}
        totalLessons={totalLessons}
      />
    </>
  );
}
