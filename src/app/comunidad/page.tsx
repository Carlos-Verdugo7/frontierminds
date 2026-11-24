import CommunityHub from '@/components/community/CommunityHub';
import { pageMetadata } from '@/lib/page-metadata';

export const metadata = pageMetadata({
  path: '/comunidad', locale: 'es_US', title: 'Comunidad | Ayuda en West Palm Beach',
  description: 'Guías gratuitas en español para usar USCIS, consultar el estatus de una solicitud, encontrar ayuda con la luz, buscar trabajo, inscribir a tus hijos y aprender inglés.',
});

export default function CommunityPage() {
  return <CommunityHub aiEnabled={Boolean(process.env.OPENAI_API_KEY)} />;
}
