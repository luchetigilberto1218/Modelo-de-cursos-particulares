import { redirect, notFound } from 'next/navigation';
import { getCourseLite, getTheme } from '../../../lib/courses';
import { guardClient } from '../../../lib/guard';
import NavBar from '../../../components/NavBar';
import GrammarReference from '../../../components/GrammarReference';

export default async function GrammarPage({ params }) {
  const { client } = await params;
  await guardClient(client);

  const course = getCourseLite(client);
  const theme = getTheme(client);
  if (!course) notFound();

  return (
    <>
      <NavBar user={null} theme={theme} clientId={client} />
      <GrammarReference course={course} clientId={client} />
    </>
  );
}
