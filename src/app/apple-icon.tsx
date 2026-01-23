import { ImageResponse } from 'next/og';

export const size = {
  width: 180,
  height: 180,
};
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          borderRadius: 32,
        }}
      >
        <svg
          width="120"
          height="120"
          viewBox="0 0 64 64"
          fill="none"
        >
          {/* Central vertex */}
          <circle cx="32" cy="32" r="5" fill="#60A5FA" />

          {/* Incoming paths */}
          <line x1="8" y1="32" x2="27" y2="32" stroke="#60A5FA" strokeWidth="3" />
          <line x1="32" y1="8" x2="32" y2="27" stroke="#60A5FA" strokeWidth="3" />

          {/* Wavy line */}
          <path
            d="M37 32 Q42 26, 47 32 Q52 38, 57 32"
            stroke="#F59E0B"
            strokeWidth="3"
            fill="none"
          />

          {/* Outgoing paths */}
          <line x1="37" y1="37" x2="52" y2="52" stroke="#A78BFA" strokeWidth="3" />
          <line x1="37" y1="27" x2="52" y2="12" stroke="#34D399" strokeWidth="3" />

          {/* Small vertices */}
          <circle cx="20" cy="32" r="2.5" fill="#60A5FA" />
          <circle cx="32" cy="20" r="2.5" fill="#60A5FA" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
