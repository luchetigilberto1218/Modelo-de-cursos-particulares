import { notFound } from 'next/navigation';
import { getTheme } from '../../../lib/courses';
import { guardClient } from '../../../lib/guard';
import { isCzarnikow } from '../../../lib/czarnikow';
import NavBar from '../../../components/NavBar';
import CampaignPage from '../../../components/czarnikow-teste/CampaignPage';

// Campanha Ago–Dez 2026 — exclusiva das rotas da Czarnikow (/czarnikow e a
// porta antiga /czarnikow-teste). Qualquer outro cliente cai em 404.
export default async function CampanhaRoute({ params }) {
  const { client } = await params;
  if (!isCzarnikow(client)) notFound();

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
