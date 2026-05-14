import { redirect } from 'next/navigation';
import { getCourseLite, getTheme } from '../../../lib/courses';
import NavBar from '../../../components/NavBar';
import GrammarReference from '../../../components/GrammarReference';

export default async function GrammarPage({ params }) {
  const { client } = await params;

  const course = getCourseLite(client);
  const theme = getTheme(client);
  if (!course) redirect('/');

  return (
    <>
      <NavBar user={null} theme={theme} clientId={client} />
      <GrammarReference course={course} clientId={client} />
    </>
  );
}
