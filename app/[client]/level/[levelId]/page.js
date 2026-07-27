import { redirect, notFound } from 'next/navigation';
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
  if (!course) notFound();
  if (!VALID_LEVELS.includes(levelId)) redirect(`/${client}`);

  // Baker Hughes has a bespoke self-study flow (home → track → lesson); it has
  // no level page, so send any direct hit back to the home.
  if (client === 'bakerhughes') redirect(`/${client}`);

  return (
    <>
      <NavBar user={null} theme={theme} clientId={client} />
      <LevelPage course={course} theme={theme} clientId={client} levelId={levelId} />
    </>
  );
}
