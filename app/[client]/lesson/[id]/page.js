import { redirect } from 'next/navigation';
import { getSession, canAccessClient } from '../../../../lib/auth';
import { getCourse, getTheme } from '../../../../lib/courses';
import NavBar from '../../../../components/NavBar';
import LessonView from '../../../../components/LessonView';

export default async function LessonPage({ params }) {
  const { client, id } = await params;
  const session = await getSession();
  if (!session) redirect('/login');
  if (!canAccessClient(session, client)) redirect('/login');

  const course = getCourse(client);
  const theme = getTheme(client);
  if (!course) redirect('/');

  const lessonIndex = parseInt(id, 10) - 1;
  const lesson = course.lessons[lessonIndex];
  if (!lesson) redirect(`/${client}`);

  const totalLessons = course.lessons.length;

  return (
    <>
      <NavBar user={session} theme={theme} />
      <LessonView
        lesson={lesson}
        lessonIndex={lessonIndex}
        totalLessons={totalLessons}
        clientId={client}
      />
    </>
  );
}
