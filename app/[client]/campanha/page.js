import { notFound } from 'next/navigation';
import { getTheme } from '../../../lib/courses';
import { guardClient } from '../../../lib/guard';
import NavBar from '../../../components/NavBar';
import CampaignPage from '../../../components/czarnikow-teste/CampaignPage';

// Campanha Ago–Dez 2026 — exclusiva do ambiente de teste da Czarnikow.
// Qualquer outro cliente cai em 404: rota aditiva, nenhum curso existente muda.
export default async function CampanhaRoute({ params }) {
  const { client } = await params;
  if (client !== 'czarnikow-teste') notFound();

  await guardClient(client);
  const theme = getTheme(client);
  if (!theme) notFound();

  return (
    <>
      <NavBar user={null} theme={theme} clientId={client} />
      <CampaignPage clientId={client} theme={theme} />
    </>
  );
}
