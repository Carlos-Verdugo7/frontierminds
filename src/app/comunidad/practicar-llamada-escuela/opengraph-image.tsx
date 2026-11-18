import { activityShareImage } from '@/lib/activity-share-image';

export const alt = 'Practica una llamada a la escuela en inglés y español';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() { return activityShareImage('school'); }
