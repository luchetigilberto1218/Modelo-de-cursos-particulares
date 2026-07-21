import { redirect } from 'next/navigation';
import { getCourseLite, getTheme } from '../../../../lib/courses';
import { guardClient } from '../../../../lib/guard';
import NavBar from '../../../../components/NavBar';
import LevelPage from '../../../../components/LevelPage';

const VALID_LEVELS = ['confidence', 'essentials', 'rise', 'apex'];

export default async function LevelRoute({ params }) {
  const { client, levelId } = await params;
  await guardClient(client);

  const course = getCourseLite(client);
  const theme = getTheme(client);
  if (!course) redirect('/');
  if (!VALID_LEVELS.includes(levelId)) redirect(`/${client}`);

  return (
    <>
      <NavBar user={null} theme={theme} clientId={client} />
      <LevelPage course={course} theme={theme} clientId={client} levelId={levelId} />
    </>
  );
}
