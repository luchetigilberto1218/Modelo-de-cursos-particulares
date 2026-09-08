import { redirect, notFound } from 'next/navigation';
import { getCourseForSearch, getTheme } from '../../../lib/courses';
import { guardClient } from '../../../lib/guard';
import { visibleTracks } from '../../../lib/auth';
import NavBar from '../../../components/NavBar';
import SearchView from '../../../components/SearchView';

export default async function SearchPage({ params }) {
  const { client } = await params;
  const session = await guardClient(client);

  const course = getCourseForSearch(client);
  const theme = getTheme(client);
  if (!course) notFound();

  // A busca enxerga o mesmo que a home: trilha pessoal de outra pessoa não
  // entra no resultado. Sem isso, o título e o vocabulário de uma lição
  // pessoal apareciam na busca de quem não pode abri-la. Curso sem trilha com
  // `owner` (todos menos a Baker Hughes) não muda em nada.
  const tracks = visibleTracks(session, course.tracks);
  const allowed = new Set(tracks.map((t) => t.id));
  const scoped = {
    ...course,
    tracks,
    lessons: (course.lessons || []).filter((l) => !l.track || allowed.has(l.track)),
  };

  return (
    <>
      <NavBar user={null} theme={theme} clientId={client} />
      <SearchView course={scoped} clientId={client} />
    </>
  );
}
