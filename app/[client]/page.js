import { redirect, notFound } from 'next/navigation';
import { getCourseLite, getTheme } from '../../lib/courses';
import { guardClient } from '../../lib/guard';
import NavBar from '../../components/NavBar';
import CourseDashboard from '../../components/CourseDashboard';
import LevelHub from '../../components/LevelHub';
import BakerHughesHome from '../../components/BakerHughesHome';

// Clients with a fully bespoke home layout (own hero, business-line buttons,
// track grid). Additive: everything else keeps the shared LevelHub/CourseDashboard.
const CUSTOM_HOME = {
  bakerhughes: BakerHughesHome,
};

export default async function ClientPage({ params }) {
  const { client } = await params;
  await guardClient(client);

  const course = getCourseLite(client);
  const theme = getTheme(client);
  if (!course) notFound();

  const CustomHome = CUSTOM_HOME[client];
  if (CustomHome) {
    return <CustomHome course={course} theme={theme} clientId={client} />;
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
