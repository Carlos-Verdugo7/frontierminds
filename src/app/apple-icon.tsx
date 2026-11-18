import { ImageResponse } from 'next/og';
import GuideMark from '@/components/site/GuideMark';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(<GuideMark size={size.width} />, size);
}
