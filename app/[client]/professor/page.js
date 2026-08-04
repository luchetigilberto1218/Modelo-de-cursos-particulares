import { notFound } from 'next/navigation';
import { getTheme } from '../../../lib/courses';
import { guardClient } from '../../../lib/guard';
import NavBar from '../../../components/NavBar';
import TeacherPanel from '../../../components/czarnikow-teste/TeacherPanel';

// Painel do professor — exclusivo do ambiente de teste da Czarnikow.
// Qualquer outro cliente cai em 404: rota aditiva, nenhum curso existente muda.
// Aluno logado também cai em 404 (não em "acesso negado"): a existência do
// painel não precisa aparecer para quem não é professor.
export default async function ProfessorRoute({ params }) {
  const { client } = await params;
  if (client !== 'czarnikow-teste') notFound();

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
