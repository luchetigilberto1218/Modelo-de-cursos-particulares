import { redirect } from 'next/navigation';
import { getCourse, getTheme } from '../../../lib/courses';
import NavBar from '../../../components/NavBar';
import SearchView from '../../../components/SearchView';

export default async function SearchPage({ params }) {
  const { client } = await params;

  const course = getCourse(client);
  const theme = getTheme(client);
  if (!course) redirect('/');

  return (
    <>
      <NavBar user={null} theme={theme} clientId={client} />
      <SearchView course={course} clientId={client} />
    </>
  );
}
