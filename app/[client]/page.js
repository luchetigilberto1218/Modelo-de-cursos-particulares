import { redirect } from 'next/navigation';
import { getCourseLite, getTheme } from '../../lib/courses';
import { guardClient } from '../../lib/guard';
import NavBar from '../../components/NavBar';
import CourseDashboard from '../../components/CourseDashboard';
import LevelHub from '../../components/LevelHub';

export default async function ClientPage({ params }) {
  const { client } = await params;
  await guardClient(client);

  const course = getCourseLite(client);
  const theme = getTheme(client);
  if (!course) redirect('/');

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
