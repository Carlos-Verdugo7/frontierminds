import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'FrontierMinds - AI-Powered Interactive Learning';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 40 }}>
          <svg
            width="80"
            height="80"
            viewBox="0 0 64 64"
            fill="none"
          >
            {/* Background circle */}
            <circle cx="32" cy="32" r="30" stroke="url(#gradient1)" strokeWidth="2" fill="none" opacity="0.3" />

            {/* Central vertex */}
            <circle cx="32" cy="32" r="4" fill="#60A5FA" />

            {/* Incoming paths */}
            <line x1="8" y1="32" x2="28" y2="32" stroke="#60A5FA" strokeWidth="2" />
            <line x1="32" y1="8" x2="32" y2="28" stroke="#60A5FA" strokeWidth="2" />

            {/* Wavy line */}
            <path
              d="M36 32 Q40 28, 44 32 Q48 36, 52 32 Q56 28, 60 32"
              stroke="#F59E0B"
              strokeWidth="2.5"
              fill="none"
            />

            {/* Outgoing paths */}
            <line x1="36" y1="36" x2="52" y2="52" stroke="#A78BFA" strokeWidth="2" />
            <line x1="36" y1="28" x2="52" y2="12" stroke="#34D399" strokeWidth="2" />

            {/* Small vertices */}
            <circle cx="20" cy="32" r="2" fill="#60A5FA" />
            <circle cx="32" cy="20" r="2" fill="#60A5FA" />

            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#60A5FA" />
                <stop offset="100%" stopColor="#A78BFA" />
              </linearGradient>
            </defs>
          </svg>
          <div style={{ marginLeft: 20, display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 56, fontWeight: 'bold', color: 'white' }}>
              Frontier<span style={{ color: '#60A5FA' }}>Minds</span>
            </span>
            <span style={{ fontSize: 18, color: '#64748b', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              AI-Powered Learning
            </span>
          </div>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 32,
            color: '#cbd5e1',
            textAlign: 'center',
            maxWidth: 800,
            lineHeight: 1.4,
          }}
        >
          Learn Complex Topics Through Interaction
        </div>

        {/* Features */}
        <div
          style={{
            display: 'flex',
            gap: 40,
            marginTop: 40,
          }}
        >
          {['Interactive Simulations', 'Exam-Style Problems', 'Free Forever'].map((feature) => (
            <div
              key={feature}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                color: '#94a3b8',
                fontSize: 20,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#3b82f6',
                }}
              />
              {feature}
            </div>
          ))}
        </div>

        {/* URL */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            color: '#475569',
            fontSize: 20,
          }}
        >
          frontierminds.io
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
