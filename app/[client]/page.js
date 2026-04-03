import { redirect } from 'next/navigation';
import { getCourse, getTheme } from '../../lib/courses';
import NavBar from '../../components/NavBar';
import CourseDashboard from '../../components/CourseDashboard';

export default async function ClientPage({ params }) {
  const { client } = await params;

  const course = getCourse(client);
  const theme = getTheme(client);
  if (!course) redirect('/');

  return (
    <>
      <NavBar user={null} theme={theme} />
      <CourseDashboard course={course} theme={theme} clientId={client} />
    </>
  );
}
