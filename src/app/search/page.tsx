import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import GuideSearch, { first, type QueryParams } from '@/components/site/GuideSearch';

export const metadata: Metadata = { title: 'Search the field guides | FrontierMinds', robots: { index: false, follow: true } };
export default async function SearchPage({ searchParams }: { searchParams: QueryParams }) {
  const params = await searchParams;
  const query = first(params.q).trim();
  if (first(params.lang) === 'es') redirect('/buscar' + (query ? '?q=' + encodeURIComponent(query) : ''));
  return <GuideSearch query={query} />;
}
