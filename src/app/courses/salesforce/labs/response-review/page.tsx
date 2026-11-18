import ResponseReview from '@/components/labs/ResponseReview';
import WorkshopShell from '@/components/labs/WorkshopShell';
import { responseLab } from '@/content/activities';
import { pageMetadata } from '@/lib/page-metadata';

export const metadata = pageMetadata(responseLab, responseLab.path + '/opengraph-image');

export default function Page() {
  return <WorkshopShell course="salesforce"><ResponseReview /></WorkshopShell>;
}
