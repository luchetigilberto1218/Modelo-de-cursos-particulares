import { redirect, notFound } from 'next/navigation';
import { getCourse, getTheme } from '../../../../lib/courses';
import { guardClient } from '../../../../lib/guard';
import { canAccessTrack } from '../../../../lib/auth';
import NavBar from '../../../../components/NavBar';
import LessonView from '../../../../components/LessonView';
import BakerHughesLesson from '../../../../components/bakerhughes/BakerHughesLesson';

// Clientes de auto-estudo que usam o renderizador self-study (hero, tradução,
// exercícios auto-corrigíveis). Aditivo: quem não está aqui segue no LessonView.
const SELF_STUDY = ['bakerhughes', 'faapatendimento'];

// Cores da trilha por cima das do cliente. Trilha sem `palette` devolve o tema
// intacto, então todo curso que não usa o campo continua igual.
function themeForTrack(theme, track) {
  if (!track?.palette) return theme;
  return { ...theme, colors: { ...(theme?.colors || {}), ...track.palette } };
}


export default async function LessonPage({ params }) {
  const { client, id } = await params;
  const session = await guardClient(client);

  const course = getCourse(client);
  const theme = getTheme(client);
  if (!course) notFound();

  const lessonNum = parseInt(id, 10);
  const lessonIndex = course.lessons.findIndex((l) => l.num === lessonNum);
  const lesson = lessonIndex >= 0 ? course.lessons[lessonIndex] : null;
  if (!lesson) redirect(`/${client}`);

  // Lição de trilha pessoal só abre para o dono (ou para quem vê tudo).
  const lessonTrack = (course.tracks || []).find((t) => t.id === lesson.track);
  if (lessonTrack && !canAccessTrack(session, lessonTrack)) redirect(`/${client}`);

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

  if (SELF_STUDY.includes(client)) {
    // "Onde você está": posição da lição dentro da própria trilha.
    const position = {
      index: siblingIndex >= 0 ? siblingIndex + 1 : 1,
      total: siblings.length,
      topic: lesson.topic || null,
      trackName: lessonTrack?.name || lesson.trackLabel || null,
    };
    return (
      <BakerHughesLesson
        lesson={lesson}
        theme={themeForTrack(theme, lessonTrack)}
        clientId={client}
        backHref={backHref}
        prevNum={prevNum}
        nextNum={nextNum}
        student={session?.name || null}
        position={position}
      />
    );
  }

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
