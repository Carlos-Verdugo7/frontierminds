import { ImageResponse } from 'next/og';
import { deductibleLab, emailCaseLab, responseLab, schoolCall } from '@/content/activities';

const cards = {
  school: { page: schoolCall, label: 'Comunidad', caption: 'Inglés y español · Práctica de 5 minutos', background: '#f6e7c6', ink: '#22262c', accent: '#835314' },
  salesforce: { page: emailCaseLab, label: 'Salesforce', caption: '3 fictional cases · 5-minute practice lab', background: '#f7e0dc', ink: '#232631', accent: '#88443b' },
  deductible: { page: deductibleLab, label: 'Actuarial Exam P', caption: 'Simulate a contract · Audit a calculation', background: '#2548cc', ink: '#fff9ef', accent: '#dce5ff' },
  review: { page: responseLab, label: 'Salesforce & AI', caption: 'Review a reply · Cite the case record', background: '#f8e7e1', ink: '#22262c', accent: '#834037' },
};

export function activityShareImage(activity: keyof typeof cards) {
  const { page, label, caption, background, ink, accent } = cards[activity];
  return new ImageResponse(
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', padding: '55px 70px', background, color: ink, fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid ' + accent, paddingBottom: 26, fontSize: 28 }}>
        <span>FrontierMinds</span><span>{label}</span>
      </div>
      <div style={{ display: 'flex', marginTop: 58, fontSize: 78, fontWeight: 700, lineHeight: 1.08, maxWidth: 990 }}>{page.title}</div>
      <div style={{ display: 'flex', marginTop: 'auto', color: accent, fontSize: 32 }}>{caption}</div>
    </div>,
    { width: 1200, height: 630 },
  );
}
