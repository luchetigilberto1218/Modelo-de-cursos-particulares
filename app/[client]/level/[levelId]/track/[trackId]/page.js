import { redirect, notFound } from 'next/navigation';
import { getCourseLite, getTheme } from '../../../../../../lib/courses';
import { guardClient } from '../../../../../../lib/guard';
import { canAccessTrack } from '../../../../../../lib/auth';
import NavBar from '../../../../../../components/NavBar';
import TrackPage from '../../../../../../components/TrackPage';
import BakerHughesTrack from '../../../../../../components/bakerhughes/BakerHughesTrack';

const VALID_LEVELS = ['confidence', 'essentials', 'rise', 'apex'];
const SELF_STUDY = ['bakerhughes', 'faapatendimento'];

export default async function TrackRoute({ params }) {
  const { client, levelId, trackId } = await params;
  const session = await guardClient(client);

  const course = getCourseLite(client);
  const theme = getTheme(client);
  if (!course) notFound();
  if (!VALID_LEVELS.includes(levelId)) redirect(`/${client}`);

  const track = (course.tracks || []).find((t) => t.id === trackId);
  if (!track) redirect(`/${client}/level/${levelId}`);
  // Trilha pessoal de outro aluno: manda de volta pra home, sem vazar conteúdo.
  if (!canAccessTrack(session, track)) redirect(`/${client}`);

  if (SELF_STUDY.includes(client)) {
    return (
      <BakerHughesTrack
        course={course}
        theme={theme}
        clientId={client}
        trackId={trackId}
        student={session?.name || null}
      />
    );
  }

  return (
    <>
      <NavBar user={null} theme={theme} clientId={client} />
      <TrackPage
        course={course}
        theme={theme}
        clientId={client}
        levelId={levelId}
        trackId={trackId}
      />
    </>
  );
}
