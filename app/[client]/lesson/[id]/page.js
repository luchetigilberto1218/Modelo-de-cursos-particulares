import { redirect } from 'next/navigation';
import { getCourse, getTheme } from '../../../../lib/courses';
import NavBar from '../../../../components/NavBar';
import LessonView from '../../../../components/LessonView';

export default async function LessonPage({ params }) {
  const { client, id } = await params;

  const course = getCourse(client);
  const theme = getTheme(client);
  if (!course) redirect('/');

  const lessonNum = parseInt(id, 10);
  const lessonIndex = course.lessons.findIndex((l) => l.num === lessonNum);
  const lesson = lessonIndex >= 0 ? course.lessons[lessonIndex] : null;
  if (!lesson) redirect(`/${client}`);

  const totalLessons = course.lessons.length;

  // For level-based platforms (Czarnikow), "All Lessons" goes back to the track page
  const backHref = lesson.level && lesson.track
    ? `/${client}/level/${lesson.level}/track/${lesson.track}`
    : `/${client}`;

  // Previous/Next navigation by real lesson `num`. On level platforms the lesson `num`
  // is not the array index (e.g. 1101), so we resolve neighbours inside the same
  // level+track, ordered by trackOrder. Sequential courses (no level/track) just walk
  // the array. This stops "Next" from jumping to a non-existent num and bouncing home.
  const siblings = lesson.level && lesson.track
    ? course.lessons
        .filter((x) => x.level === lesson.level && x.track === lesson.track)
        .sort((a, b) => (a.trackOrder || a.num) - (b.trackOrder || b.num))
    : course.lessons;
  const siblingIndex = siblings.findIndex((x) => x.num === lesson.num);
  const prevNum = siblingIndex > 0 ? siblings[siblingIndex - 1].num : null;
  const nextNum =
    siblingIndex >= 0 && siblingIndex < siblings.length - 1
      ? siblings[siblingIndex + 1].num
      : null;

  return (
    <>
      <NavBar user={null} theme={theme} clientId={client} />
      <LessonView
        lesson={lesson}
        lessonIndex={lessonIndex}
        totalLessons={totalLessons}
        clientId={client}
        backHref={backHref}
        prevNum={prevNum}
        nextNum={nextNum}
      />
    </>
  );
}
