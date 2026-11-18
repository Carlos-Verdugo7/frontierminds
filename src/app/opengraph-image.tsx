import { ImageResponse } from 'next/og';
import GuideMark from '@/components/site/GuideMark';

export const runtime = 'edge';
export const alt = 'FrontierMinds field guides for actuarial math, Salesforce and AI, and community resources in Spanish';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(<div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', padding: '60px 70px', background: '#faf9f5', color: '#20242a', fontFamily: 'sans-serif' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 34, borderBottom: '2px solid #d5d6ce', paddingBottom: 24 }}><GuideMark size={48} />FrontierMinds</div>
    <div style={{ display: 'flex', flexDirection: 'column', margin: '52px 0', fontSize: 92, letterSpacing: '-4px', lineHeight: 1.05 }}><span>Choose your</span><span style={{ fontFamily: 'serif', fontStyle: 'italic', color: '#2548cc' }}>field guide.</span></div>
    <div style={{ display: 'flex', gap: 28, borderTop: '2px solid #d5d6ce', paddingTop: 22, marginTop: 'auto', fontSize: 27 }}><span>Actuarial math</span><span>Salesforce &amp; AI</span><span>Comunidad en español</span></div>
  </div>, size);
}
