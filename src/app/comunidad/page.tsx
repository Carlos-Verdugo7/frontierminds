import type { Metadata } from 'next';
import CommunityHub from '@/components/community/CommunityHub';

export const metadata: Metadata = {
  title: 'Comunidad | Ayuda en West Palm Beach — FrontierMinds',
  description: 'Guías en español para encontrar ayuda con la luz, buscar trabajo, inscribir a tus hijos y aprender inglés en Palm Beach County.',
};

export default function CommunityPage() {
  return <CommunityHub />;
}
