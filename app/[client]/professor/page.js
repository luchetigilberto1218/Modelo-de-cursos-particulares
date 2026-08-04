import { notFound } from 'next/navigation';
import { getTheme } from '../../../lib/courses';
import { guardClient } from '../../../lib/guard';
import { isCzarnikow } from '../../../lib/czarnikow';
import NavBar from '../../../components/NavBar';
import TeacherPanel from '../../../components/czarnikow-teste/TeacherPanel';

// Painel do professor — exclusivo das rotas da Czarnikow (/czarnikow e a porta
// antiga /czarnikow-teste). Qualquer outro cliente cai em 404: rota aditiva.
// Aluno logado também cai em 404 (não em "acesso negado"): a existência do
// painel não precisa aparecer para quem não é professor.
export default async function ProfessorRoute({ params }) {
  const { client } = await params;
  if (!isCzarnikow(client)) notFound();

  const session = await guardClient(client);
  if (session?.role !== 'teacher' && session?.role !== 'coordinator') notFound();

  const theme = getTheme(client);
  if (!theme) notFound();

  return (
    <>
      <NavBar user={null} theme={theme} clientId={client} />
      <TeacherPanel clientId={client} theme={theme} />
    </>
  );
}
