import DeductibleLab from '@/components/labs/DeductibleLab';
import WorkshopShell from '@/components/labs/WorkshopShell';
import { deductibleLab } from '@/content/activities';
import { pageMetadata } from '@/lib/page-metadata';
import { readDeductible } from '@/lib/learning/loss-lab';

export const metadata = pageMetadata(deductibleLab, deductibleLab.path + '/opengraph-image');

export default async function Page({ searchParams }: { searchParams: Promise<{ deductible?: string | string[] }> }) {
  const deductible = readDeductible((await searchParams).deductible);
  return <WorkshopShell course="exam-p"><DeductibleLab key={deductible} initialDeductible={deductible} /></WorkshopShell>;
}
