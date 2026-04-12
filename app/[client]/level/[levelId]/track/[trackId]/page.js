import { redirect } from 'next/navigation';
import { getCourse, getTheme } from '../../../../../../lib/courses';
import NavBar from '../../../../../../components/NavBar';
import TrackPage from '../../../../../../components/TrackPage';

const VALID_LEVELS = ['confidence', 'rise', 'apex'];

export default async function TrackRoute({ params }) {
  const { client, levelId, trackId } = await params;

  const course = getCourse(client);
  const theme = getTheme(client);
  if (!course) redirect('/');
  if (!VALID_LEVELS.includes(levelId)) redirect(`/${client}`);

  const track = (course.tracks || []).find((t) => t.id === trackId);
  if (!track) redirect(`/${client}/level/${levelId}`);

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
