import { redirect } from 'next/navigation';
import { getCourseForSearch, getTheme } from '../../../lib/courses';
import { guardClient } from '../../../lib/guard';
import NavBar from '../../../components/NavBar';
import SearchView from '../../../components/SearchView';

export default async function SearchPage({ params }) {
  const { client } = await params;
  await guardClient(client);

  const course = getCourseForSearch(client);
  const theme = getTheme(client);
  if (!course) redirect('/');

  return (
    <>
      <NavBar user={null} theme={theme} clientId={client} />
      <SearchView course={course} clientId={client} />
    </>
  );
}
