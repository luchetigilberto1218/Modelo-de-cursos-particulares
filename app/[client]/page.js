import { redirect } from 'next/navigation';
import { getSession, canAccessClient } from '../../lib/auth';
import { getCourse, getTheme } from '../../lib/courses';
import NavBar from '../../components/NavBar';
import CourseDashboard from '../../components/CourseDashboard';

export default async function ClientPage({ params }) {
  const { client } = await params;
  const session = await getSession();
  if (!session) redirect('/login');
  if (!canAccessClient(session, client)) redirect('/login');

  const course = getCourse(client);
  const theme = getTheme(client);
  if (!course) redirect('/');

  return (
    <>
      <NavBar user={session} theme={theme} />
      <CourseDashboard course={course} theme={theme} clientId={client} />
    </>
  );
}
