import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'FrontierMinds — Understand more. Move forward. Learning and community resources.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', background: '#faf8f2', color: '#173c37', display: 'flex', flexDirection: 'column', padding: '50px 68px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #d8ddcf', paddingBottom: 25 }}>
        <span style={{ fontSize: 29, fontWeight: 700, letterSpacing: '-1px' }}>FrontierMinds</span>
        <span style={{ fontSize: 16, letterSpacing: '2px', color: '#67775e' }}>LEARNING & COMMUNITY</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', marginTop: 48, fontFamily: 'serif', fontSize: 83, lineHeight: 1.08, letterSpacing: '-3px' }}>
        <span>Understand more.</span>
        <span style={{ color: '#b54b26', fontStyle: 'italic' }}>Move forward.</span>
      </div>
      <div style={{ display: 'flex', fontSize: 24, color: '#5d6b65', marginTop: 27 }}>Interactive learning. Practical resources. A next step.</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #d8ddcf', paddingTop: 23, marginTop: 'auto' }}>
        <div style={{ display: 'flex', gap: 24, fontSize: 18 }}><span>Probability & Salesforce</span><span style={{ color: '#7a876d' }}>/</span><span>Comunidad en español</span></div>
        <span style={{ fontSize: 18, color: '#67775e' }}>frontierminds.io</span>
      </div>
    </div>,
    size,
  );
}
