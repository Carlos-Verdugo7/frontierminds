import { ImageResponse } from 'next/og';
import { emailCaseLab, schoolCall } from '@/content/activities';

export function activityShareImage(activity: 'school' | 'salesforce') {
  const school = activity === 'school';
  const page = school ? schoolCall : emailCaseLab;
  const accent = school ? '#b04f29' : '#75dfca';
  return new ImageResponse(
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', padding: '55px 70px', background: school ? '#faf8f2' : '#101c2f', color: school ? '#193e36' : '#f2f6fa', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid ' + accent, paddingBottom: 26, fontSize: 28 }}>
        <span>FrontierMinds</span><span>{school ? 'Comunidad' : 'Salesforce'}</span>
      </div>
      <div style={{ display: 'flex', marginTop: 58, fontSize: 78, fontWeight: 700, lineHeight: 1.08, maxWidth: 990 }}>{page.title}</div>
      <div style={{ display: 'flex', marginTop: 'auto', color: accent, fontSize: 32 }}>{school ? 'Inglés y español · Práctica de 5 minutos' : '3 fictional cases · 5-minute practice lab'}</div>
    </div>,
    { width: 1200, height: 630 },
  );
}
