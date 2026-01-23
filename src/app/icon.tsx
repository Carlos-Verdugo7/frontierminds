import { ImageResponse } from 'next/og';

export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
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
          borderRadius: 6,
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 64 64"
          fill="none"
        >
          {/* Central vertex */}
          <circle cx="32" cy="32" r="6" fill="#60A5FA" />

          {/* Incoming paths */}
          <line x1="8" y1="32" x2="26" y2="32" stroke="#60A5FA" strokeWidth="4" />
          <line x1="32" y1="8" x2="32" y2="26" stroke="#60A5FA" strokeWidth="4" />

          {/* Wavy line */}
          <path
            d="M38 32 Q44 24, 50 32 Q56 40, 62 32"
            stroke="#F59E0B"
            strokeWidth="4"
            fill="none"
          />

          {/* Outgoing paths */}
          <line x1="38" y1="38" x2="54" y2="54" stroke="#A78BFA" strokeWidth="4" />
          <line x1="38" y1="26" x2="54" y2="10" stroke="#34D399" strokeWidth="4" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
