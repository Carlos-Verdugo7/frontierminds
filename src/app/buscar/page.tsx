import type { Metadata } from 'next';
import GuideSearch, { first, type QueryParams } from '@/components/site/GuideSearch';

export const metadata: Metadata = { title: 'Buscar en las guías | FrontierMinds', robots: { index: false, follow: true } };
export default async function BuscarPage({ searchParams }: { searchParams: QueryParams }) {
  return <GuideSearch query={first((await searchParams).q).trim()} es />;
}
