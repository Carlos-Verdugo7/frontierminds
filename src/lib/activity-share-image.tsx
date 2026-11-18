import { ImageResponse } from 'next/og';
import { deductibleLab, emailCaseLab, responseLab, schoolCall } from '@/content/activities';

const cards = {
  school: { page: schoolCall, label: 'Comunidad', caption: 'Inglés y español · Práctica de 5 minutos', background: '#faf8f2', ink: '#193e36', accent: '#b04f29' },
  salesforce: { page: emailCaseLab, label: 'Salesforce', caption: '3 fictional cases · 5-minute practice lab', background: '#101c2f', ink: '#f2f6fa', accent: '#75dfca' },
  deductible: { page: deductibleLab, label: 'Actuarial Exam P', caption: 'Simulate a contract · Audit a calculation', background: '#153e33', ink: '#f7f3e2', accent: '#edbc93' },
  review: { page: responseLab, label: 'Salesforce & AI', caption: 'Review a reply · Cite the case record', background: '#e9efde', ink: '#193e36', accent: '#985331' },
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
