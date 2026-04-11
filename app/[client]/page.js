import { redirect } from 'next/navigation';
import { getCourse, getTheme } from '../../lib/courses';
import NavBar from '../../components/NavBar';
import CourseDashboard from '../../components/CourseDashboard';
import LevelHub from '../../components/LevelHub';

export default async function ClientPage({ params }) {
  const { client } = await params;

  const course = getCourse(client);
  const theme = getTheme(client);
  if (!course) redirect('/');

  const isLevelPlatform = course.meta?.platform === 'levels' || theme?.platform === 'levels';

  return (
    <>
      <NavBar user={null} theme={theme} />
      {isLevelPlatform ? (
        <LevelHub course={course} theme={theme} clientId={client} />
      ) : (
        <CourseDashboard course={course} theme={theme} clientId={client} />
      )}
    </>
  );
}
