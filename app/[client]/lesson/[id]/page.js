import { redirect } from 'next/navigation';
import { getCourse, getTheme } from '../../../../lib/courses';
import NavBar from '../../../../components/NavBar';
import LessonView from '../../../../components/LessonView';

export default async function LessonPage({ params }) {
  const { client, id } = await params;

  const course = getCourse(client);
  const theme = getTheme(client);
  if (!course) redirect('/');

  const lessonIndex = parseInt(id, 10) - 1;
  const lesson = course.lessons[lessonIndex];
  if (!lesson) redirect(`/${client}`);

  const totalLessons = course.lessons.length;

  // For level-based platforms (Czarnikow), "All Lessons" goes back to the track page
  const backHref = lesson.level && lesson.track
    ? `/${client}/level/${lesson.level}/track/${lesson.track}`
    : `/${client}`;

  return (
    <>
      <NavBar user={null} theme={theme} />
      <LessonView
        lesson={lesson}
        lessonIndex={lessonIndex}
        totalLessons={totalLessons}
        clientId={client}
        backHref={backHref}
      />
    </>
  );
}
