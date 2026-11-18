import { activityShareImage } from '@/lib/activity-share-image';

export const alt = 'The deductible lab on FrontierMinds';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() { return activityShareImage('deductible'); }
