import { redirect, notFound } from 'next/navigation';
import { getCourseLite, getTheme } from '../../lib/courses';
import { guardClient } from '../../lib/guard';
import { visibleTracks } from '../../lib/auth';
import NavBar from '../../components/NavBar';
import CourseDashboard from '../../components/CourseDashboard';
import LevelHub from '../../components/LevelHub';
import BakerHughesHome from '../../components/BakerHughesHome';
import FaapHome from '../../components/faap/FaapHome';

// Clients with a fully bespoke home layout (own hero, business-line buttons,
// track grid). Additive: everything else keeps the shared LevelHub/CourseDashboard.
const CUSTOM_HOME = {
  bakerhughes: BakerHughesHome,
  faapatendimento: FaapHome,
};

export default async function ClientPage({ params }) {
  const { client } = await params;
  const session = await guardClient(client);

  const course = getCourseLite(client);
  const theme = getTheme(client);
  if (!course) notFound();

  const CustomHome = CUSTOM_HOME[client];
  if (CustomHome) {
    // Trilhas pessoais: cada aluno vê as compartilhadas + a dele. Trilhas sem
    // `owner` continuam visíveis para todos, então cursos antigos não mudam.
    const tracks = visibleTracks(session, course.tracks);
    const allowed = new Set(tracks.map((t) => t.id));
    const scoped = {
      ...course,
      tracks,
      lessons: (course.lessons || []).filter((l) => !l.track || allowed.has(l.track)),
    };
    return (
      <CustomHome
        course={scoped}
        theme={theme}
        clientId={client}
        student={session?.name || null}
        role={session?.role || null}
      />
    );
  }

  const isLevelPlatform = course.meta?.platform === 'levels' || theme?.platform === 'levels';

  return (
    <>
      <NavBar user={null} theme={theme} clientId={client} />
      {isLevelPlatform ? (
        <LevelHub theme={theme} clientId={client} />
      ) : (
        <CourseDashboard course={course} theme={theme} clientId={client} />
      )}
    </>
  );
}
